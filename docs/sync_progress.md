# 官方同步进度记录

> 基线：v3.41.3 | 目标：origin/main（313 个提交）
> 策略：逐批 cherry-pick，跳过 XML 移除提交，优先保留自定义功能
> 最后更新：2026-02-22

---

## 当前同步状态

| 范围 | 状态 | 说明 |
|------|------|------|
| #1-#7 | ✅ 已同步 | rebase 到 `e356d058e`（标准化模型选择器） |
| **#8** | ⛔ 跳过 | `8de9337e6` 移除 XML 工具调用支持 |
| #9-#25 | ✅ 已同步 | cherry-pick，含 3 个冲突解决 |
| **#26** | ⛔ 跳过 | `be0e8c266` 清理 XML 遗留代码 |
| #27-#44 | ✅ 已同步 | cherry-pick，含多个冲突解决 |
| **#45** | ⛔ 跳过 | `a08bd766f` 移除 getToolDescription（XML 工具描述） |
| #46-#88 | ✅ 已同步 | cherry-pick + 冲突修复（提交 `0a24d9e06`） |
| #89-#252 | 🚫 不同步 | AI SDK 迁移，被 #253 回滚，无需 cherry-pick |
| **#253** | 🚫 不同步 | 回滚到 pre-AI-SDK 状态（我们本来就没有 AI SDK） |
| #254 | 🟡 可跳过 | 恢复代码所有者（CI 相关，不影响功能） |
| **#255** | ⏳ 待分析 | `d52b6834e` 回滚后的 bug 修复和功能恢复 |
| **#256-#258** | ⏳ 待分析 | ⭐ Reapply Batch 1-4：非 AI-SDK 功能恢复（read_file 重构、edit 重命名、Skills UI、浏览器移除、Provider 移除等） |
| #259-#261 | 🟡 可跳过 | CLI 相关（stdin 流模式、v0.0.54 发布） |
| #262-#263 | ⏳ 待同步 | Bug 修复（follow_up 参数验证、压缩摘要保留） |
| #264 | 🟡 可跳过 | 营销网站博客（web app，不影响扩展） |
| #265 | ⏳ 待同步 | Claude Sonnet 4.6 支持 |
| #266 | 🟡 可跳过 | Release v3.48.0 changeset |
| #267-#270 | 🟡 可跳过 | CLI 修复 + changeset |
| #271 | ⏳ 待同步 | MCP 服务器初始化竞态修复 |
| #272 | ⏳ 待分析 | DeleteQueuedMessage IPC 命令 |
| #273 | ⏳ 待同步 | Bedrock Claude Sonnet 4.6 模型 ID 修复 |
| #274-#277 | 🟡 可跳过 | Release v3.48.1 + changeset |
| #278 | ⏳ 待分析 | ⭐ 每会话文件变更面板 |
| #279 | ⏳ 待分析 | ⭐ 每工作区索引 opt-in 控制 |
| #280 | ⏳ 待同步 | 聊天 rehydration 滚动生命周期修复 |
| #281 | ⏳ 待分析 | ⭐ 每任务文件历史存储（跨实例安全） |
| #282-#286 | 🟡 可跳过 | Release v3.49.0 + CLI v0.1.0 + changeset |
| #287 | ⏳ 待同步 | Gemini 3.1 Pro 支持 |
| #288-#289 | 🟡 可跳过 | Release v3.50.0 + changeset |
| #290 | ⏳ 待同步 | 设置搜索结果宽度修复 |
| #291 | ⏳ 待分析 | ⚠️ 移除 Roomote Control |
| #292 | ⏳ 待同步 | gpt-5.3-codex-spark 模型 |
| #293 | ⏳ 待同步 | OpenAI done-only/content-part 响应修复 |
| #294 | ⏳ 待同步 | ⭐ execute_command timeout 参数 |
| #295 | ⏳ 待同步 | Vertex/Gemini 禁用 apply_diff 启用 edit |
| #296-#297 | ⏳ 待同步 | FileChangesPanel 行数 + 复制按钮反馈 |
| #298 | 🟡 可跳过 | Changeset |
| #299 | ⏳ 待同步 | Bedrock 自定义 ARN 提示缓存修复 |
| #300 | ⏳ 待分析 | ⭐ 内联终端渲染与 VSCode 一致（可能与终端增强冲突） |
| #301 | ⏳ 待同步 | git 模板泄漏到 checkpoint 修复 |
| #302-#305 | 🟡 可跳过 | Release v3.50.2 + Unbound 恢复 + changeset |
| #303 | ⏳ 待同步 | 恢复 Unbound Provider |
| #304 | ⏳ 待同步 | Vertex AI claude-sonnet-4-6 模型 ID 修复 |
| #306-#310 | 🟡 可跳过 | CI + changeset + .tool-versions |
| #311 | ⏳ 待同步 | MiniMax M2.5 模型 |
| #312-#313 | 🟡 可跳过 | Release v3.50.4 + changeset |

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

1. ~~Cherry-pick #46-#88~~ ✅ 已完成（提交 `0a24d9e06`）
2. ~~跳过 #89-#253（AI SDK 迁移 + 回滚）~~ ✅ 确认跳过
3. 分析 #255 + #256-#258（Reapply Batches）中哪些功能和修复值得同步，注意：
   - **#255**：回滚后 bug 修复恢复 — 大量文件变动，需逐项分析
   - **#256**：Reapply Batch 1 — read_file 重构、edit 重命名、disabledTools 等 22 项
   - **#257**：Reapply Batch 2 — API 配置锁定修复、Gemini 验证等 9 项
   - **#258**：Reapply Batch 3-4 — Skills UI、浏览器移除、Provider 移除等 6 项（影响最大）
4. 同步 #262-#313 中的独立功能和 bug 修复（优先：Claude Sonnet 4.6、Gemini 3.1 Pro、execute_command timeout）
5. 编译验证 + 文档更新 + git commit

---

## 备份分支

| 分支名 | 说明 |
|--------|------|
| `backup-before-sync-e356d058e` | 同步前的原始 main（13 个自定义提交） |
| `backup-sync-to-44` | 同步到 #44 后的状态 |
| `backup-sync-to-88` | 同步到 #88 后的状态（提交 `0a24d9e06`） |
