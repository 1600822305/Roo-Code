import * as vscode from "vscode"
import { execa, ExecaError } from "execa"
import psTree from "ps-tree"
import process from "process"

import type {
	RooTerminalProvider,
	RooTerminal,
	RooTerminalCallbacks,
	RooTerminalProcess,
	RooTerminalProcessResultPromise,
	ExitCodeDetails,
} from "./types"
import { BaseTerminalProcess } from "./BaseTerminalProcess"
import { mergePromise } from "./mergePromise"

/**
 * A Pseudoterminal-based terminal that syncs output to both VSCode terminal panel
 * and the webview in real-time, similar to Windsurf/Cursor implementation.
 */
export class RooPseudoterminal implements RooTerminal {
	public readonly provider: RooTerminalProvider = "pseudoterminal"
	public readonly id: number
	public readonly initialCwd: string

	public busy: boolean = false
	public running: boolean = false
	public taskId?: string
	public process?: RooTerminalProcess
	public completedProcesses: RooTerminalProcess[] = []

	// VSCode terminal and pseudoterminal
	private _terminal?: vscode.Terminal
	private _writeEmitter = new vscode.EventEmitter<string>()
	private _closeEmitter = new vscode.EventEmitter<number | void>()
	private _nameEmitter = new vscode.EventEmitter<string>()
	private _isTerminalVisible: boolean = false
	private _cmdCounter: number = 0

	constructor(id: number, cwd: string) {
		this.id = id
		this.initialCwd = cwd
		this._createTerminal()
	}

	private _createTerminal(): void {
		const pty: vscode.Pseudoterminal = {
			onDidWrite: this._writeEmitter.event,
			onDidClose: this._closeEmitter.event,
			onDidChangeName: this._nameEmitter.event,
			open: () => {
				// Terminal is ready
				this._writeEmitter.fire(`\x1b[2m[Roo Code Terminal - Ready]\x1b[0m\r\n`)
			},
			close: () => {
				// User closed the terminal
			},
			handleInput: (data: string) => {
				// Handle user input if needed (e.g., Ctrl+C)
				if (data === "\x03") {
					// Ctrl+C
					this.process?.abort()
				}
			},
		}

		this._terminal = vscode.window.createTerminal({
			name: `Roo Code`,
			pty,
			iconPath: new vscode.ThemeIcon("terminal"),
		})
	}

	/**
	 * Get the VSCode terminal instance
	 */
	public get terminal(): vscode.Terminal {
		if (!this._terminal) {
			this._createTerminal()
		}
		return this._terminal!
	}

	/**
	 * Show the terminal in VSCode terminal panel
	 */
	public showTerminal(preserveFocus: boolean = true): void {
		this._isTerminalVisible = true
		this.terminal.show(preserveFocus)
	}

	/**
	 * Hide the terminal (but keep it running)
	 */
	public hideTerminal(): void {
		this._isTerminalVisible = false
		// VSCode doesn't have a direct hide method, terminal stays in panel
	}

	/**
	 * Check if terminal is visible
	 */
	public isTerminalVisible(): boolean {
		return this._isTerminalVisible
	}

	/**
	 * Write text to the terminal panel
	 */
	public writeToTerminal(text: string): void {
		// Convert \n to \r\n for proper terminal display
		const formattedText = text.replace(/\n/g, "\r\n")
		this._writeEmitter.fire(formattedText)
	}

	public getCurrentWorkingDirectory(): string {
		return this.initialCwd
	}

	public isClosed(): boolean {
		return false
	}

	public setActiveStream(stream: AsyncIterable<string> | undefined, pid?: number): void {
		if (stream) {
			if (!this.process) {
				this.running = false
				console.warn(
					`[RooPseudoterminal ${this.id}] process is undefined, so cannot set terminal stream`,
				)
				return
			}

			this.running = true
			this.process.emit("shell_execution_started", pid)
			this.process.emit("stream_available", stream)
		}
	}

	public shellExecutionComplete(exitDetails: ExitCodeDetails): void {
		this.busy = false
		this.running = false

		if (this.process) {
			if (this.process.hasUnretrievedOutput()) {
				this.completedProcesses.unshift(this.process)
			}

			this.process.emit("shell_execution_complete", exitDetails)
		}
	}

	public getProcessesWithOutput(): RooTerminalProcess[] {
		return this.completedProcesses.filter((p) => p.hasUnretrievedOutput())
	}

	public getUnretrievedOutput(): string {
		const outputs: string[] = []

		for (const p of this.completedProcesses) {
			if (p.hasUnretrievedOutput()) {
				const output = p.getUnretrievedOutput()
				if (output) {
					outputs.push(output)
				}
			}
		}

		return outputs.join("\n")
	}

	public getLastCommand(): string {
		return this.process?.command ?? ""
	}

	public cleanCompletedProcessQueue(): void {
		this.completedProcesses = this.completedProcesses.filter((p) => p.hasUnretrievedOutput())
	}

	public runCommand(command: string, callbacks: RooTerminalCallbacks): RooTerminalProcessResultPromise {
		this.busy = true
		this._cmdCounter++

		const process = new RooPseudoterminalProcess(this)
		process.command = command
		this.process = process

		// Write command to terminal panel
		this.writeToTerminal(`\x1b[36m❯\x1b[0m ${command}\r\n`)

		// Set up event handlers
		process.on("line", (line) => {
			// Write to VSCode terminal panel in real-time
			this.writeToTerminal(line)
			// Also send to webview
			callbacks.onLine(line, process)
		})

		process.once("completed", (output) => {
			callbacks.onCompleted(output, process)
		})

		process.once("shell_execution_started", (pid) => {
			callbacks.onShellExecutionStarted(pid, process)
		})

		process.once("shell_execution_complete", (details) => {
			// Write exit status to terminal
			const exitColor = details.exitCode === 0 ? "\x1b[32m" : "\x1b[31m"
			this.writeToTerminal(`${exitColor}[Exit: ${details.exitCode ?? "unknown"}]\x1b[0m\r\n\r\n`)
			callbacks.onShellExecutionComplete(details, process)
		})

		const promise = new Promise<void>((resolve, reject) => {
			process.once("continue", () => resolve())
			process.once("error", (error) => reject(error))
			process.run(command)
		})

		return mergePromise(process, promise)
	}

	public dispose(): void {
		this._terminal?.dispose()
		this._writeEmitter.dispose()
		this._closeEmitter.dispose()
		this._nameEmitter.dispose()
	}
}

/**
 * Process class for RooPseudoterminal
 */
class RooPseudoterminalProcess extends BaseTerminalProcess {
	private terminalRef: WeakRef<RooPseudoterminal>
	private aborted = false
	private pid?: number
	private subprocess?: ReturnType<typeof execa>
	private pidUpdatePromise?: Promise<void>

	constructor(terminal: RooPseudoterminal) {
		super()
		this.terminalRef = new WeakRef(terminal)

		this.once("completed", () => {
			this.terminal.busy = false
		})
	}

	private emitRemainingBufferIfListening() {
		if (!this.isListening) {
			return
		}

		const output = this.getUnretrievedOutput()

		if (output !== "") {
			this.emit("line", output)
		}
	}

	public get terminal(): RooPseudoterminal {
		const terminal = this.terminalRef.deref()
		if (!terminal) {
			throw new Error("Unable to dereference terminal")
		}
		return terminal
	}

	public override async run(command: string) {
		this.command = command

		try {
			this.isHot = true

			// Build environment with UTF-8 support
			const execEnv: Record<string, string | undefined> = {
				...process.env,
				LANG: "en_US.UTF-8",
				LC_ALL: "en_US.UTF-8",
			}

			// Windows-specific UTF-8 encoding support
			if (process.platform === "win32") {
				execEnv.PYTHONIOENCODING = "utf-8"
				execEnv.PYTHONUTF8 = "1"
				execEnv.NODE_OPTIONS = process.env.NODE_OPTIONS
					? `${process.env.NODE_OPTIONS} --encoding=utf-8`
					: "--encoding=utf-8"
			}

			this.subprocess = execa({
				shell: true,
				cwd: this.terminal.getCurrentWorkingDirectory(),
				all: true,
				stdin: "ignore",
				env: execEnv,
			})`${command}`

			this.pid = this.subprocess.pid

			// When using shell: true, the PID is for the shell, not the actual command
			if (this.pid) {
				this.pidUpdatePromise = new Promise<void>((resolve) => {
					setTimeout(() => {
						psTree(this.pid!, (err, children) => {
							if (!err && children.length > 0) {
								const actualPid = parseInt(children[0].PID)
								if (!isNaN(actualPid)) {
									this.pid = actualPid
								}
							}
							resolve()
						})
					}, 100)
				})
			}

			// Emit shell execution started
			this.emit("shell_execution_started", this.pid)

			const rawStream = this.subprocess.iterable({ from: "all", preserveNewlines: true })

			// Process stream
			for await (const chunk of rawStream) {
				if (this.aborted) {
					break
				}

				const line = typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk)
				this.fullOutput += line

				// Emit line for real-time sync
				this.emit("line", line)

				this.startHotTimer(line)
			}

			if (this.aborted) {
				let timeoutId: NodeJS.Timeout | undefined

				const kill = new Promise<void>((resolve) => {
					console.log(`[RooPseudoterminalProcess#run] SIGKILL -> ${this.pid}`)

					timeoutId = setTimeout(() => {
						try {
							this.subprocess?.kill("SIGKILL")
						} catch (e) {}
						resolve()
					}, 5_000)
				})

				try {
					await Promise.race([this.subprocess, kill])
				} catch (error) {
					console.log(
						`[RooPseudoterminalProcess#run] subprocess termination error: ${error instanceof Error ? error.message : String(error)}`,
					)
				}

				if (timeoutId) {
					clearTimeout(timeoutId)
				}
			}

			this.emit("shell_execution_complete", { exitCode: 0 })
		} catch (error) {
			if (error instanceof ExecaError) {
				console.error(`[RooPseudoterminalProcess#run] shell execution error: ${error.message}`)
				this.emit("shell_execution_complete", { exitCode: error.exitCode ?? 0, signalName: error.signal })
			} else {
				console.error(
					`[RooPseudoterminalProcess#run] shell execution error: ${error instanceof Error ? error.message : String(error)}`,
				)
				this.emit("shell_execution_complete", { exitCode: 1 })
			}
			this.subprocess = undefined
		}

		this.emitRemainingBufferIfListening()
		this.stopHotTimer()
		this.emit("completed", this.fullOutput)
		this.emit("continue")
		this.subprocess = undefined
	}

	public override continue(): void {
		this.emit("continue")
	}

	public override abort(): void {
		this.aborted = true
		this.stopHotTimer()

		if (this.subprocess) {
			try {
				this.subprocess.kill("SIGTERM")
			} catch (e) {
				console.error(`[RooPseudoterminalProcess#abort] error killing subprocess: ${e}`)
			}
		}
	}

	public override hasUnretrievedOutput(): boolean {
		return this.lastRetrievedIndex < this.fullOutput.length
	}

	public override getUnretrievedOutput(): string {
		let output = this.fullOutput.slice(this.lastRetrievedIndex)
		let index = output.lastIndexOf("\n")

		if (index === -1) {
			return ""
		}

		index++
		this.lastRetrievedIndex += index

		return output.slice(0, index)
	}
}
