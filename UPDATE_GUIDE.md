# Roo-Code 自定义分支更新指南

## 项目背景

这是一个基于官方 [RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code) 的自定义分支，包含以下自定义功能：

1. **导入任务功能** - 从导出的 Markdown 文件导入任务
2. **工具协议选择器** - 在高级设置中保留 XML/Native 工具协议选择（官方已移除）

## Git 远程仓库配置

```
origin  https://github.com/RooCodeInc/Roo-Code.git  (官方仓库)
fork    https://github.com/1600822305/Roo-Code.git  (个人 fork)
```

## 更新步骤

### 1. 获取官方最新代码

```bash
git fetch origin
```

### 2. 查看官方更新内容

```bash
# 查看官方有多少新提交
git rev-list --count HEAD..origin/main

# 查看官方更新日志
git log --oneline HEAD..origin/main

# 查看你的自定义提交
git log --oneline origin/main..HEAD
```

### 3. Rebase 到官方最新代码

```bash
# 如果有未提交的修改，先提交
git add .
git commit --no-verify -m "your commit message"

# Rebase（将自定义提交移到官方最新代码之上）
git rebase origin/main
```

### 4. 解决冲突（如果有）

常见冲突文件：
- `src/shared/WebviewMessage.ts` - 官方已将类型移到 `@roo-code/types`

解决方法：
```bash
# 查看冲突文件
git diff --name-only --diff-filter=U

# 编辑冲突文件，解决冲突后
git add <冲突文件>
git rebase --continue
```

**关于 WebviewMessage.ts 冲突：**
- 保留官方的导出方式：`export type { WebviewMessage } from "@roo-code/types"`
- 如果需要添加新的消息类型（如 `importTask`），需要在 `packages/types/src/vscode-extension-host.ts` 的 `WebviewMessage` 接口中添加

### 5. 恢复被官方删除的功能

**恢复工具协议选择器（UI + 后端逻辑）：**

```bash
# 恢复 UI 组件
git show d00d9edec --reverse -- webview-ui/src/components/settings/ApiOptions.tsx | git apply --reverse

# 恢复后端协议解析逻辑（重要！否则选择 XML 无效）
git show d00d9edec --reverse -- src/utils/resolveToolProtocol.ts | git apply --reverse

# 提交
git add webview-ui/src/components/settings/ApiOptions.tsx src/utils/resolveToolProtocol.ts
git commit --no-verify -m "feat: restore tool protocol selector in advanced settings"
```

> 注：`d00d9edec` 是官方删除工具协议选择器的提交 hash，这个值是固定的
> 
> **必须同时恢复两个文件**：
> - `ApiOptions.tsx` - UI 选择器
> - `resolveToolProtocol.ts` - 后端协议解析逻辑（否则无论选什么都会强制用 native）

### 6. 构建 VSIX

```bash
# 安装依赖
pnpm install

# 如果遇到 SSL 证书问题
pnpm config set strict-ssl false
pnpm install

# 构建 VSIX
pnpm vsix
```

构建产物位置：`bin/roo-cline-x.x.x.vsix`

## 自定义功能文件清单

### 导入任务功能
- `src/integrations/misc/import-markdown.ts` - 导入逻辑
- `src/core/webview/ClineProvider.ts` - 消息处理
- `src/core/webview/webviewMessageHandler.ts` - 消息路由
- `webview-ui/src/components/chat/TaskActions.tsx` - UI 按钮
- `webview-ui/src/i18n/locales/*/chat.json` - 翻译

### 工具协议选择器
- `webview-ui/src/components/settings/ApiOptions.tsx` - UI 组件
- `src/utils/resolveToolProtocol.ts` - 后端协议解析逻辑

### 终端增强
- `src/integrations/terminal/TerminalRegistry.ts` - 修复竞态条件
- `src/integrations/terminal/Terminal.ts` - Windows UTF-8 编码支持
- `src/integrations/terminal/ExecaTerminalProcess.ts` - 内联终端 UTF-8 编码
- `src/core/tools/ExecuteCommandTool.ts` - 警告开关逻辑
- `webview-ui/src/components/settings/TerminalSettings.tsx` - 警告开关 UI

### Shell Integration 修复
- `src/integrations/terminal/TerminalProcess.ts` - 修复中止按钮 + 30秒超时机制

**问题说明**：VSCode 存在 bug #237208，`onDidEndTerminalShellExecution` 事件可能不触发，导致命令卡住。

**解决方案**：
1. **中止按钮修复**：点击中止时强制触发完成事件，解除命令阻塞
2. **30秒超时机制**：如果 shell_execution_complete 事件在 30 秒内未触发，自动完成命令

### multi_edit_file 工具（类似 Cascade/Windsurf）

**涉及文件**：
- `packages/types/src/tool.ts` - 添加 `multi_edit_file` 到 toolNames
- `src/shared/tools.ts` - 添加类型定义、TOOL_GROUPS、toolParamNames
- `src/core/tools/MultiEditFileTool.ts` - 工具核心实现
- `src/core/prompts/tools/native-tools/multi_edit_file.ts` - Native 提示词
- `src/core/prompts/tools/multi-edit-file.ts` - XML 提示词
- `src/core/prompts/tools/index.ts` - toolDescriptionMap 注册
- `src/core/prompts/tools/native-tools/index.ts` - 导出工具
- `src/core/assistant-message/presentAssistantMessage.ts` - 工具调度注册

**功能说明**：一次调用对同一文件执行多处编辑，支持两种模式：
1. **字符串匹配**：`{old_string, new_string}` - 查找替换（只替换首次匹配）
2. **行号编辑**：`{start_line, end_line, content}` - 按行号替换/插入/删除

**特性**：
- 编辑按声明顺序执行，每个编辑基于前一编辑结果
- 原子操作（任一编辑失败则全部回滚）
- 越界行号返回警告并追加到文件末尾
- VSCode diff 预览集成

## 注意事项

1. **提交到 main 分支**：项目有 pre-commit hook 阻止直接提交到 main，使用 `--no-verify` 跳过
2. **类型定义位置**：官方已将 `WebviewMessage` 等类型移到 `packages/types/src/vscode-extension-host.ts`
3. **Vim 编辑器**：Rebase 时可能进入 vim，按 `Esc` 然后输入 `:wq` 保存退出

## 最近一次更新记录

- **日期**：2026-01-18
- **官方版本**：v3.40.0 → v3.41.2
- **同步提交数**：38 个
- **官方新功能**：
  - OpenAI Codex 提供商 + gpt-5.2-codex 模型
  - Markdown 预览按钮
  - 子任务成本汇总
  - 设置标签页搜索
- **官方修复**：
  - Gemini 思维签名验证错误
  - 终端内存泄漏
  - OpenAI 400 错误（重复 tool_use ID）
  - MCP 工具 Schema 展平
- **自定义修改保留**：
  - 导入任务功能
  - 工具协议选择器
  - 终端竞态条件修复
  - Shell 集成警告开关
  - Windows UTF-8 编码
  - 移除 100ms 终端输出延迟
