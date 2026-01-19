import type OpenAI from "openai"

const MULTI_EDIT_FILE_DESCRIPTION = `Apply multiple edits to a single file. Supports two modes:

1. STRING MATCH: {"old_string": "find", "new_string": "replace"} - same as edit_file
2. LINE RANGE: {"start_line": N, "end_line": M, "content": "text"} - edit by line numbers
   - INSERT: set end_line < start_line
   - DELETE: set content to ""

RULES:
- Edits apply sequentially; each operates on the result of previous edits
- Atomic: any failure rolls back all changes
- Line numbers are 1-indexed`

const multi_edit_file = {
	type: "function",
	function: {
		name: "multi_edit_file",
		description: MULTI_EDIT_FILE_DESCRIPTION,
		parameters: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "The path to the file to edit. Can be relative to workspace or absolute.",
				},
				edits: {
					type: "array",
					description: "Array of edit operations to apply sequentially.",
					items: {
						oneOf: [
							{
								type: "object",
								description: "String match edit: find and replace text",
								properties: {
									old_string: {
										type: "string",
										description: "The exact text to find and replace.",
									},
									new_string: {
										type: "string",
										description: "The replacement text.",
									},
								},
								required: ["old_string", "new_string"],
								additionalProperties: false,
							},
							{
								type: "object",
								description: "Line range edit: replace lines by line numbers",
								properties: {
									start_line: {
										type: "integer",
										description: "Start line number (1-indexed). First line to replace.",
										minimum: 1,
									},
									end_line: {
										type: "integer",
										description:
											"End line number (1-indexed). Last line to replace. Set < start_line to insert.",
									},
									content: {
										type: "string",
										description:
											"New content for the line range. Use empty string to delete lines.",
									},
								},
								required: ["start_line", "end_line", "content"],
								additionalProperties: false,
							},
						],
					},
					minItems: 1,
				},
			},
			required: ["path", "edits"],
			additionalProperties: false,
		},
	},
} satisfies OpenAI.Chat.ChatCompletionTool

export default multi_edit_file
