# 官方同步进度记录

> 基线：v3.41.3 | 目标：origin/main（255 个提交）
> 策略：逐批 cherry-pick，跳过 XML 移除提交，优先保留自定义功能
> 最后更新：2026-02-14

---

## 当前同步状态

| 范围 | 状态 | 说明 |
|------|------|------|
| #1-#7 | ✅ 已同步 | rebase 到 `e356d058e`（标准化模型选择器） |
| **#8** | ⛔ 跳过 | `8de9337e6` 移除 XML 工具调用支持 |
| #9-#25 | ✅ 已同步 | cherry-pick，含 3 个冲突解决 |
| **#26** | ⛔ 跳过 | `be0e8c266` 清理 XML 遗留代码 |
| #27-#44 | ✅ 已同步 | cherry-pick，含多个冲突解决 |
| **#45** | ⛔ 待跳过 | `a08bd766f` 移除 getToolDescription（XML 工具描述） |
| #46-#88 | ⏳ 待同步 | 需注意 #54（MCP 段移除）、#87（无损终端输出） |
| #89-#252 | 🚫 不同步 | AI SDK 迁移，被 #253 回滚，无需 cherry-pick |
| **#253** | 🚫 不同步 | 回滚到 pre-AI-SDK 状态（我们本来就没有 AI SDK） |
| #254 | ⏳ 待分析 | 恢复代码所有者 |
| **#255** | ⏳ 待分析 | `d52b6834e` 回滚后的 bug 修复和功能恢复 |

---

## 已跳过的提交（XML 相关）

| # | Hash | 说明 | 跳过原因 |
|---|------|------|----------|
| 8 | `8de9337e6` | 移除 XML 工具调用支持 | 核心 XML 移除，60+ 文件 |
| 26 | `be0e8c266` | 清理 XML 遗留代码 | XML native-only 注释清理 |
| 45 | `a08bd766f` | 移除 getToolDescription | XML 工具描述函数移除 |

---

## 冲突解决记录

### Rebase 到 #7 (e356d058e)
- `vscode-extension-host.ts`：保留两边类型（worktree + openInVscodeTerminal）

### Cherry-pick #9-#25
- `claude-code.ts` 等：接受官方删除 Claude Code Provider（modify/delete）
- `ClineProvider.ts`：保留 importTask + 官方 export 新函数
- `validateToolUse.ts`：保留 XML args 解析 + 官方 apply_patch 验证

### Cherry-pick #27-#44
- `condense/index.ts`：接受官方移除 condensingApiHandler/useNativeTools 参数，getKeepMessagesWithToolBlocks 对 XML 也安全
- `Task.ts`：移除 3 处 useNativeTools 变量（不再需要）
- `system.ts`：用 diffStrategy 替换 effectiveDiffStrategy，保留 XML 协议检查
- `system-prompt.spec.ts`：移除 diffEnabled 测试，保留 XML 协议测试
- `ClineProvider.ts`：从 importTask 中移除 diffEnabled/fuzzyMatchThreshold
- `vscode-extension-host.ts`：移除 mergeWorktreeResult，保留 openInVscodeTerminal
- `getEnvironmentDetails.ts`：保留 resolveToolProtocol 和 experiments 导入
- `presentAssistantMessage.ts`：移除 MULTI_FILE_APPLY_DIFF 实验逻辑，保留 removeClosingTag/toolProtocol
- `modes.spec.ts`：更新测试描述，保留 XML 参数测试

---

## 自定义功能保留状态

| 功能 | 状态 | 说明 |
|------|------|------|
| XML 工具协议选择器 | ✅ 保留 | resolveToolProtocol.ts + ApiOptions.tsx 中本地定义 |
| multi_edit_file 工具 | ✅ 保留 | 工具实现 + native-tools 注册完整 |
| 导入/导出任务 | ✅ 保留 | importTask 已适配（移除 diffEnabled/fuzzyMatchThreshold） |
| 终端增强 | ✅ 保留 | RooPseudoterminal + Shell Integration 修复 |
| 终端同步 | ✅ 保留 | openInVscodeTerminal 功能 |

---

## 下一步计划

1. Cherry-pick #46-#88（跳过 #45），注意：
   - **#54**：移除 MCP SERVERS 系统提示段 — 影响 system.ts
   - **#87**：无损终端输出 — 可能与终端增强冲突
   - **#148**：移除 toolFormat — 可能影响 XML 协议检测
2. 跳过 #89-#253（AI SDK 迁移 + 回滚）
3. 分析 #255 中哪些 bug fix 值得单独 cherry-pick
4. 编译验证 + 文档更新 + git commit

---

## 备份分支

| 分支名 | 说明 |
|--------|------|
| `backup-before-sync-e356d058e` | 同步前的原始 main（13 个自定义提交） |
| `backup-sync-to-44` | 同步到 #44 后的状态（当前） |
