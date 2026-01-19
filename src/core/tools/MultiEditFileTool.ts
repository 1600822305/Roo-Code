import fs from "fs/promises"
import path from "path"

import { type ClineSayTool, DEFAULT_WRITE_DELAY_MS } from "@roo-code/types"

import { getReadablePath } from "../../utils/path"
import { isPathOutsideWorkspace } from "../../utils/pathUtils"
import { Task } from "../task/Task"
import { formatResponse } from "../prompts/responses"
import { RecordSource } from "../context-tracking/FileContextTrackerTypes"
import { fileExistsAtPath } from "../../utils/fs"
import { EXPERIMENT_IDS, experiments } from "../../shared/experiments"
import { sanitizeUnifiedDiff, computeDiffStats } from "../diff/stats"
import type { ToolUse, MultiEditOperation, StringMatchEdit, LineRangeEdit } from "../../shared/tools"

import { BaseTool, ToolCallbacks } from "./BaseTool"

interface MultiEditFileParams {
	path: string
	edits: MultiEditOperation[]
}

type LineEnding = "\r\n" | "\n"

function detectLineEnding(content: string): LineEnding {
	return content.includes("\r\n") ? "\r\n" : "\n"
}

function normalizeToLF(content: string): string {
	return content.replace(/\r\n/g, "\n")
}

function restoreLineEnding(contentLF: string, eol: LineEnding): string {
	if (eol === "\n") return contentLF
	return contentLF.replace(/\n/g, "\r\n")
}

function isStringMatchEdit(edit: MultiEditOperation): edit is StringMatchEdit {
	return "old_string" in edit && "new_string" in edit
}

function isLineRangeEdit(edit: MultiEditOperation): edit is LineRangeEdit {
	return "start_line" in edit && "end_line" in edit && "content" in edit
}

/**
 * Safely replace the first occurrence of a literal string, handling $ escape sequences.
 */
function safeLiteralReplace(str: string, oldString: string, newString: string): string {
	if (oldString === "" || !str.includes(oldString)) {
		return str
	}

	if (!newString.includes("$")) {
		return str.replace(oldString, newString)
	}

	const escapedNewString = newString.replaceAll("$", "$$$$")
	return str.replace(oldString, escapedNewString)
}

interface LineRangeEditResult {
	lines: string[]
	warning?: string
}

/**
 * Apply a line range edit to the content.
 * @param lines Array of lines (without line endings)
 * @param edit The line range edit to apply
 * @param totalLines Original total line count (for warning messages)
 * @returns Modified array of lines and optional warning
 */
function applyLineRangeEdit(lines: string[], edit: LineRangeEdit, totalLines: number): LineRangeEditResult {
	const { start_line, end_line, content } = edit

	// Convert to 0-indexed
	const startIdx = start_line - 1
	const endIdx = end_line - 1
	let warning: string | undefined

	// Validate line numbers
	if (startIdx < 0) {
		throw new Error(`Invalid start_line: ${start_line}. Line numbers must be >= 1.`)
	}

	// Handle different cases:
	// 1. start_line > end_line: Insert before start_line
	// 2. start_line <= end_line: Replace lines from start_line to end_line
	// 3. start_line > lines.length: Append to end of file (with warning)

	const newLines = content === "" ? [] : content.split("\n")

	if (start_line > end_line) {
		// Insert mode: insert before start_line
		const insertIdx = Math.min(startIdx, lines.length)
		if (startIdx > lines.length) {
			warning = `start_line ${start_line} exceeds file length (${totalLines} lines). Content appended to end.`
		}
		lines.splice(insertIdx, 0, ...newLines)
	} else if (startIdx >= lines.length) {
		// Append to end of file with warning
		warning = `start_line ${start_line} exceeds file length (${totalLines} lines). Content appended to end.`
		lines.push(...newLines)
	} else {
		// Replace mode: replace lines from startIdx to endIdx (inclusive)
		const deleteCount = Math.min(endIdx - startIdx + 1, lines.length - startIdx)
		if (endIdx >= lines.length) {
			warning = `end_line ${end_line} exceeds file length (${totalLines} lines). Replaced lines ${start_line}-${lines.length}.`
		}
		lines.splice(startIdx, deleteCount, ...newLines)
	}

	return { lines, warning }
}

export class MultiEditFileTool extends BaseTool<"multi_edit_file"> {
	readonly name = "multi_edit_file" as const

	private didSendPartialToolAsk = false
	private partialToolAskRelPath: string | undefined

	parseLegacy(params: Partial<Record<string, string>>): MultiEditFileParams {
		let edits: MultiEditOperation[] = []

		// Parse edits from JSON string if provided
		if (params.edits) {
			try {
				// Trim whitespace and parse JSON
				const editsStr = params.edits.trim()
				if (editsStr) {
					edits = JSON.parse(editsStr)
					// Ensure it's an array
					if (!Array.isArray(edits)) {
						edits = []
					}
				}
			} catch (error) {
				console.error("[MultiEditFileTool] Failed to parse edits JSON:", error)
				edits = []
			}
		}

		return {
			path: params.path || "",
			edits,
		}
	}

	async execute(params: MultiEditFileParams, task: Task, callbacks: ToolCallbacks): Promise<void> {
		const { path: relPath, edits } = params
		const { askApproval, handleError, pushToolResult, toolProtocol } = callbacks

		let relPathForErrorHandling: string | undefined

		const finalizePartialToolAskIfNeeded = async (relPath: string) => {
			if (this.didSendPartialToolAsk && this.partialToolAskRelPath) {
				const absolutePath = path.resolve(task.cwd, relPath)
				const isOutsideWorkspace = isPathOutsideWorkspace(absolutePath)
				const sharedMessageProps: ClineSayTool = {
					tool: "appliedDiff",
					path: getReadablePath(task.cwd, relPath),
					diff: "(multi-edit operation)",
					isOutsideWorkspace,
				}
				await task.ask("tool", JSON.stringify(sharedMessageProps), false).catch(() => {})
				this.didSendPartialToolAsk = false
				this.partialToolAskRelPath = undefined
			}
		}

		try {
			// Validate required parameters
			if (!relPath) {
				task.consecutiveMistakeCount++
				task.recordToolError("multi_edit_file")
				pushToolResult(await task.sayAndCreateMissingParamError("multi_edit_file", "path"))
				return
			}

			if (!edits || !Array.isArray(edits) || edits.length === 0) {
				task.consecutiveMistakeCount++
				task.recordToolError("multi_edit_file")
				pushToolResult(
					formatResponse.toolError(
						"Missing or empty 'edits' parameter. At least one edit operation is required.",
					),
				)
				return
			}

			// Validate each edit operation
			for (let i = 0; i < edits.length; i++) {
				const edit = edits[i]
				if (isStringMatchEdit(edit)) {
					if (edit.old_string === undefined || edit.new_string === undefined) {
						task.consecutiveMistakeCount++
						task.recordToolError("multi_edit_file")
						pushToolResult(
							formatResponse.toolError(
								`Edit ${i + 1}: String match edit requires both 'old_string' and 'new_string'.`,
							),
						)
						return
					}
				} else if (isLineRangeEdit(edit)) {
					if (
						typeof edit.start_line !== "number" ||
						typeof edit.end_line !== "number" ||
						edit.content === undefined
					) {
						task.consecutiveMistakeCount++
						task.recordToolError("multi_edit_file")
						pushToolResult(
							formatResponse.toolError(
								`Edit ${i + 1}: Line range edit requires 'start_line', 'end_line', and 'content'.`,
							),
						)
						return
					}
					if (edit.start_line < 1) {
						task.consecutiveMistakeCount++
						task.recordToolError("multi_edit_file")
						pushToolResult(
							formatResponse.toolError(`Edit ${i + 1}: start_line must be >= 1.`),
						)
						return
					}
				} else {
					task.consecutiveMistakeCount++
					task.recordToolError("multi_edit_file")
					pushToolResult(
						formatResponse.toolError(
							`Edit ${i + 1}: Invalid edit format. Use either {old_string, new_string} or {start_line, end_line, content}.`,
						),
					)
					return
				}
			}

			relPathForErrorHandling = relPath

			const accessAllowed = task.rooIgnoreController?.validateAccess(relPath)
			if (!accessAllowed) {
				await finalizePartialToolAskIfNeeded(relPath)
				task.didToolFailInCurrentTurn = true
				await task.say("rooignore_error", relPath)
				pushToolResult(formatResponse.rooIgnoreError(relPath, toolProtocol))
				return
			}

			// Check if file is write-protected
			const isWriteProtected = task.rooProtectedController?.isWriteProtected(relPath) || false

			const absolutePath = path.resolve(task.cwd, relPath)
			const fileExists = await fileExistsAtPath(absolutePath)

			if (!fileExists) {
				task.consecutiveMistakeCount++
				task.didToolFailInCurrentTurn = true
				const formattedError = `File does not exist: ${absolutePath}\n\nmulti_edit_file can only edit existing files. Use write_to_file to create new files.`
				await finalizePartialToolAskIfNeeded(relPath)
				await task.say("error", formattedError)
				task.recordToolError("multi_edit_file", formattedError)
				pushToolResult(formattedError)
				return
			}

			// Read the file
			let currentContent: string
			try {
				currentContent = await fs.readFile(absolutePath, "utf8")
			} catch (error) {
				task.consecutiveMistakeCount++
				task.didToolFailInCurrentTurn = true
				const errorDetails = error instanceof Error ? error.message : String(error)
				const formattedError = `Failed to read file: ${absolutePath}\n\nRead error: ${errorDetails}`
				await finalizePartialToolAskIfNeeded(relPath)
				task.recordToolError("multi_edit_file", formattedError)
				pushToolResult(formattedError)
				return
			}

			const originalContent = currentContent
			const originalEol = detectLineEnding(currentContent)
			let contentLF = normalizeToLF(currentContent)
			const originalLineCount = contentLF.split("\n").length
			const warnings: string[] = []

			// Apply edits sequentially
			for (let i = 0; i < edits.length; i++) {
				const edit = edits[i]

				if (isStringMatchEdit(edit)) {
					// String match edit
					const oldLF = normalizeToLF(edit.old_string)
					const newLF = normalizeToLF(edit.new_string)

					if (!contentLF.includes(oldLF)) {
						task.consecutiveMistakeCount++
						task.didToolFailInCurrentTurn = true
						const preview = edit.old_string.length > 50 ? edit.old_string.substring(0, 50) + "..." : edit.old_string
						const formattedError = `Edit ${i + 1}: No match found for old_string: "${preview}"\n\nUse read_file to verify the current file contents.`
						await finalizePartialToolAskIfNeeded(relPath)
						task.recordToolError("multi_edit_file", formattedError)
						pushToolResult(formattedError)
						return
					}

					contentLF = safeLiteralReplace(contentLF, oldLF, newLF)
				} else if (isLineRangeEdit(edit)) {
					// Line range edit
					const lines = contentLF.split("\n")

					try {
						const result = applyLineRangeEdit(lines, edit, originalLineCount)
						contentLF = result.lines.join("\n")
						if (result.warning) {
							warnings.push(`Edit ${i + 1}: ${result.warning}`)
						}
					} catch (error) {
						task.consecutiveMistakeCount++
						task.didToolFailInCurrentTurn = true
						const errorMessage = error instanceof Error ? error.message : String(error)
						const formattedError = `Edit ${i + 1}: ${errorMessage}`
						await finalizePartialToolAskIfNeeded(relPath)
						task.recordToolError("multi_edit_file", formattedError)
						pushToolResult(formattedError)
						return
					}
				}
			}

			// Restore original line endings
			const newContent = restoreLineEnding(contentLF, originalEol)

			// Check if any changes were made
			if (newContent === originalContent) {
				task.consecutiveMistakeCount = 0
				await finalizePartialToolAskIfNeeded(relPath)
				pushToolResult(`No changes needed for '${relPath}'`)
				return
			}

			task.consecutiveMistakeCount = 0

			// Initialize diff view
			task.diffViewProvider.editType = "modify"
			task.diffViewProvider.originalContent = originalContent

			// Generate diff for display
			const diff = formatResponse.createPrettyPatch(relPath, originalContent, newContent)

			// Check if preventFocusDisruption experiment is enabled
			const provider = task.providerRef.deref()
			const state = await provider?.getState()
			const diagnosticsEnabled = state?.diagnosticsEnabled ?? true
			const writeDelayMs = state?.writeDelayMs ?? DEFAULT_WRITE_DELAY_MS
			const isPreventFocusDisruptionEnabled = experiments.isEnabled(
				state?.experiments ?? {},
				EXPERIMENT_IDS.PREVENT_FOCUS_DISRUPTION,
			)

			const sanitizedDiff = sanitizeUnifiedDiff(diff || "")
			const diffStats = computeDiffStats(sanitizedDiff) || undefined
			const isOutsideWorkspace = isPathOutsideWorkspace(absolutePath)

			const sharedMessageProps: ClineSayTool = {
				tool: "appliedDiff",
				path: getReadablePath(task.cwd, relPath),
				diff: sanitizedDiff,
				isOutsideWorkspace,
			}

			const completeMessage = JSON.stringify({
				...sharedMessageProps,
				content: sanitizedDiff,
				isProtected: isWriteProtected,
				diffStats,
			} satisfies ClineSayTool)

			// Show diff view if focus disruption prevention is disabled
			if (!isPreventFocusDisruptionEnabled) {
				await task.diffViewProvider.open(relPath)
				await task.diffViewProvider.update(newContent, true)
				task.diffViewProvider.scrollToFirstDiff()
			}

			const didApprove = await askApproval("tool", completeMessage, undefined, isWriteProtected)

			if (!didApprove) {
				if (!isPreventFocusDisruptionEnabled) {
					await task.diffViewProvider.revertChanges()
				}
				pushToolResult("Changes were rejected by the user.")
				await task.diffViewProvider.reset()
				return
			}

			// Save the changes
			if (isPreventFocusDisruptionEnabled) {
				await task.diffViewProvider.saveDirectly(relPath, newContent, false, diagnosticsEnabled, writeDelayMs)
			} else {
				await task.diffViewProvider.saveChanges(diagnosticsEnabled, writeDelayMs)
			}

			// Track file edit operation
			if (relPath) {
				await task.fileContextTracker.trackFileContext(relPath, "roo_edited" as RecordSource)
			}

			task.didEditFile = true

			const editCount = edits.length
			const message = await task.diffViewProvider.pushToolWriteResult(task, task.cwd, false)

			// Build result message with warnings if any
			let resultMessage = `${message} (${editCount} edit${editCount > 1 ? "s" : ""} applied)`
			if (warnings.length > 0) {
				resultMessage += `\n\nWarnings:\n${warnings.join("\n")}`
			}
			pushToolResult(resultMessage)

			task.recordToolUsage("multi_edit_file")
			await task.diffViewProvider.reset()
			this.resetPartialState()

			task.processQueuedMessages()
		} catch (error) {
			if (relPathForErrorHandling) {
				await finalizePartialToolAskIfNeeded(relPathForErrorHandling)
			}
			await handleError("multi_edit_file", error as Error)
			await task.diffViewProvider.reset()
			task.didToolFailInCurrentTurn = true
		} finally {
			this.didSendPartialToolAsk = false
			this.partialToolAskRelPath = undefined
			this.resetPartialState()
		}
	}

	override async handlePartial(task: Task, block: ToolUse<"multi_edit_file">): Promise<void> {
		const filePath: string | undefined = block.params.path

		if (!this.hasPathStabilized(filePath)) {
			return
		}

		let relPath = filePath!
		if (path.isAbsolute(relPath)) {
			relPath = path.relative(task.cwd, relPath)
		}
		this.didSendPartialToolAsk = true
		this.partialToolAskRelPath = relPath

		const absolutePath = path.resolve(task.cwd, relPath)
		const isOutsideWorkspace = isPathOutsideWorkspace(absolutePath)

		const sharedMessageProps: ClineSayTool = {
			tool: "appliedDiff",
			path: getReadablePath(task.cwd, relPath),
			diff: "(multi-edit operation in progress...)",
			isOutsideWorkspace,
		}

		await task.ask("tool", JSON.stringify(sharedMessageProps), block.partial).catch(() => {})
	}
}

export const multiEditFileTool = new MultiEditFileTool()
