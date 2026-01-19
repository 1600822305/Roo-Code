import { ToolArgs } from "./types"

export function getMultiEditFileDescription(args: ToolArgs): string {
	return `## multi_edit_file
Description: Apply multiple edits to a single file. Two modes available:
1. String match: {"old_string": "find", "new_string": "replace"}
2. Line range: {"start_line": N, "end_line": M, "content": "text"} (INSERT: end_line < start_line, DELETE: content="")

Edits apply sequentially on the result of previous edits. Atomic operation: any failure rolls back all. Line numbers are 1-indexed.

Parameters:
- path: (required) File path relative to ${args.cwd}
- edits: (required) JSON array of edit operations

Usage:
<multi_edit_file>
<path>src/file.ts</path>
<edits>
[{"old_string": "const x = 1", "new_string": "const x = 2"}]
</edits>
</multi_edit_file>`
}
