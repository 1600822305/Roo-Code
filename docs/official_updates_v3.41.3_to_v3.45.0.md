# Roo-Code 官方更新日志（v3.41.3 → v3.45.0+）

> 当前本地版本：v3.41.3 | 官方最新版本：v3.45.0+（含后续热修复）
> 共 255 个提交，按时间顺序排列（从旧到新）
> 生成日期：2026-02-14

---

## 一、版本发布时间线

| 版本 | 提交 | 说明 |
|------|------|------|
| v3.42.0 | `f38bac9fe` | 正式发布 |
| v3.43.0 | `4bff2ab19` | changeset |
| v3.44.0 | `826e6da41` | changeset |
| v3.44.1 | `7b54a733e` | 热修复 |
| v3.44.2 | `e9043723d` | 热修复 |
| v3.45.0 | `763280702` | 正式发布 |
| v3.46.0 | `5945d0280` | 正式发布 |
| v3.46.1 | `db0bcbec8` | 热修复 |
| v3.46.2 | `957600ab8` | 热修复 |
| v3.47.0 | `846d66880` | 正式发布 |
| v3.47.1 | `08f3b5ac1` | 热修复 |
| v3.47.2 | `dfb4e3930` | 热修复 |
| v3.47.3 | `1cdb5f4ce` | 热修复 |
| v1.109.0 | `5f9c243d6` | 内部版本号 |
| v1.110.0 | `d7714e4e0` | 内部版本号 |
| v1.111.0 | `bd4cd07e8` | 内部版本号 |
| **最终状态** | `6cfa82f57` | **回滚到 pre-AI-SDK 状态** |
| **最终状态** | `d52b6834e` | **重新添加回滚后的 bug 修复和功能** |

---

## 二、完整提交列表（中文翻译）

### 第 1-31 条（v3.41.3 → v3.42.0）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 1 | `1a1827d80` | feat | OpenAI Codex：添加 ChatGPT 订阅用量仪表盘 |
| 2 | `06039400c` | perf | Webview：避免在状态更新中重复发送 taskHistory |
| 3 | `ead165844` | fix | 修复定价页面的失效链接 |
| 4 | `04256be95` | feat | **Git Worktree 管理功能** |
| 5 | `c7ce8aae8` | feat | 为 Cerebras zai-glm-4.7 模型启用提示缓存 |
| 6 | `a060915d1` | feat | 在 VertexAI 中添加 Kimi K2 思维模型 |
| 7 | `e356d058e` | feat | **标准化所有 Provider 的模型选择器** |
| 8 | `8de9337e6` | chore | ⚠️ **移除 XML 工具调用支持** |
| 9 | `9ab279ae4` | misc | PR #10853 合并 |
| 10 | `fa92ec458` | fix | 修复上下文压缩提示输入的竞态条件 |
| 11 | `bef796de8` | copy | 更新 /slack 页面文案 |
| 12 | `5bd26eb1d` | fix | 修复工作区切换时模式选择器的空状态处理 |
| 13 | `7f854c0dd` | feat | ⚠️ **移除 Claude Code 提供商** |
| 14 | `3f332d8e2` | refactor | 将上下文压缩提示迁移到 customSupportPrompts 并清理遗留代码 |
| 15 | `5e0bb5af2` | refactor | 统一导出路径逻辑，默认使用 Downloads 目录 |
| 16 | `230588874` | fix | 修复营销网站预览逻辑 |
| 17 | `d87abe8ef` | feat | 重新设计 Slack 页面特色工作流区域（含 YouTube） |
| 18 | `971885d8e` | feat | 为 Worktree 文件复制添加基于大小的进度跟踪 |
| 19 | `21bd7609a` | feat | 添加基于同意的 HubSpot 跟踪加载 |
| 20 | `1feefb6f4` | fix | OpenAI：防止 native 和 codex 处理器中 text/reasoning 的双重发送 |
| 21 | `73b1b38eb` | fix | 修复 Roo Code Cloud 追加销售的内边距 |
| 22 | `94459adba` | fix | 创建 worktreeinclude 文件后自动打开它 |
| 23 | `13e090ef8` | fix | 防止通过 IPC/bridge 恢复任务时中止任务 |
| 24 | `5c1c16c16` | fix | 将机器人重命名为 'Roomote' 并修复 Slack 演示间距 |
| 25 | `f6006c998` | fix | **对所有编辑工具强制执行文件限制** |
| 26 | `be0e8c266` | chore | ⚠️ 清理 XML 遗留代码和 native-only 注释 |
| 27 | `f98dc1389` | feat | 从菜单中隐藏 Worktree 功能 |
| 28 | `9d65772d2` | fix | 移除自定义压缩模型选项 |
| 29 | `3ab1d0815` | fix | EXT-553：移除 Worktree 文件复制的百分比进度跟踪 |
| 30 | `6eb3d5dd0` | chore | 澄清链接的 SKILL.md 文件处理方式 |
| 31 | `f38bac9fe` | release | **Release v3.42.0** |

### 第 32-69 条（v3.42.0 → v3.44.0）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 32 | `f7bf7a484` | chore | Changeset 版本号更新 |
| 33 | `1f7be769e` | feat | 将压缩提示编辑器移至「上下文管理」标签页 |
| 34 | `6e009971d` | feat | 更新 Z.AI 模型变体和定价 |
| 35 | `763734a19` | fix | 修正 Gemini 3 Flash 和 Pro 模型的定价 |
| 36 | `d1e74cb3e` | feat | 添加 pnpm install:vsix:nightly 命令 |
| 37 | `cf5d42e1e` | feat | ⭐ **智能上下文压缩 v2** |
| 38 | `0ff826d21` | feat | 改进压缩：环境详情、精确 token 计数、懒计算 |
| 39 | `1daac839e` | docs | 修复 CLI README 使用正确命令语法 |
| 40 | `85f42dca8` | chore | ⚠️ **移除 diffEnabled 和 fuzzyMatchThreshold 设置** |
| 41 | `2d2ed15bf` | ux | 从 Worktree 中移除合并按钮 |
| 42 | `f7434dec7` | chore | 移除 POWER_STEERING 实验功能 |
| 43 | `526488e5b` | chore | 移除 MULTI_FILE_APPLY_DIFF 实验 |
| 44 | `339f5aad4` | fix | 压缩后将孤立的 tool_results 转换为文本块 |
| 45 | `a08bd766f` | refactor | ⚠️ **移除遗留 XML 工具调用代码（getToolDescription）** |
| 46 | `f09718c5f` | fix | 修复 OpenAI Codex 提供商的重复模型显示 |
| 47 | `dd561142e` | fix | Markdown 导出时跳过 thoughtSignature 块 |
| 48 | `4e67357ab` | fix | 使用 json-stream-stringify 美化打印 MCP 配置文件 |
| 49 | `b042866ee` | fix | 自动迁移 v1 压缩提示并处理导入时的无效 Provider |
| 50 | `4bff2ab19` | chore | 添加 v3.43.0 changeset |
| 51 | `83f123f27` | chore | Changeset 版本号更新 |
| 52 | `3877d0249` | fix | 用模糊匹配替代 MCP 工具名的连字符编码 |
| 53 | `f9a3a178d` | fix | 将 AWS Bedrock toolUseId 截断到 64 字符 |
| 54 | `84f7409f3` | feat | ⚠️ **从系统提示中移除 MCP SERVERS 段** |
| 55 | `3b703b8b5` | feat | 更新 Fireworks 提供商新模型 |
| 56 | `5848db66b` | ux | 改善子任务在历史和聊天视图中的可见性和导航 |
| 57 | `c7910a99c` | fix | 移除 Fireworks 模型中不支持的 tool 字段 |
| 58 | `c56f0f43c` | ux | 改善 Worktree 选择器和创建体验 |
| 59 | `c28478eda` | feat | **MCP alwaysAllow 配置支持通配符** |
| 60 | `b472c1522` | fix | 恢复设置区段标题的不透明背景 |
| 61 | `953c7773c` | i18n | 更新和改进繁体中文（zh-TW）翻译和文档 |
| 62 | `7534e19c6` | chore | 移除 POWER_STEERING 实验残留 |
| 63 | `bd2976640` | fix | 压缩失败但截断成功时记录截断事件 |
| 64 | `27708f303` | feat | new_task 工具像 write_to_file 一样创建 checkpoint |
| 65 | `dd245cc40` | fix | VS Code LM 在请求外 token 计数返回 0，导致上下文压缩中断 |
| 66 | `2f92cb7a8` | fix | 防止嵌套压缩包含已压缩的内容 |
| 67 | `2391a0f06` | fix | 删除 Worktree 时默认使用 --force |
| 68 | `826e6da41` | chore | 添加 v3.44.0 changeset |
| 69 | `3edf71e29` | chore | Changeset 版本号更新 |

### 第 70-87 条（v3.44.0 → v3.45.0）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 70 | `f5d32e771` | fix | 修复 LiteLLM 对 Bedrock 代理的工具 ID 验证错误 |
| 71 | `2584504b9` | feat | **启用并行工具调用 + new_task 隔离保护** |
| 72 | `5100d1583` | chore | 为营销网站部署添加质量检查 |
| 73 | `6e08ae4bf` | fix | 为 zai-glm-4.7 模型设置 temperature=0.9, top_p=0.95 |
| 74 | `5b3626f1a` | revert | 回滚「启用并行工具调用」 |
| 75 | `7b54a733e` | release | **Release v3.44.1** |
| 76 | `207853720` | chore | Changeset 版本号更新 |
| 77 | `dc5e765e9` | revert | 再次恢复「启用并行工具调用」（回滚的回滚） |
| 78 | `d6d00dede` | fix | 修复 Ollama 模型的本地模型验证错误 |
| 79 | `b9cf163b8` | fix | 使用相对路径修复 isPathInIgnoredDirectory 以修复 Worktree 索引 |
| 80 | `17d3456e9` | fix | 从 Responses API Provider 中移除重复的 tool_call 发送 |
| 81 | `e9043723d` | release | **Release v3.44.2** |
| 82 | `7607c684e` | chore | Changeset 版本号更新 |
| 83 | `d748de6fa` | feat | ⭐ **压缩 v2.1：添加智能代码折叠** |
| 84 | `763280702` | release | **Release v3.45.0** |
| 85 | `c6d030655` | chore | Changeset 版本号更新 |
| 86 | `a44842f16` | fix | 在任务头部百分比计算中包含预留输出 token |
| 87 | `e7965d9b4` | feat | ⭐ **无损终端输出 + 按需检索** |

### 第 88-134 条（v3.45.0 → v3.46.2）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 88 | `f5004ac40` | fix | 防止并行工具调用中的时间旅行 bug |
| 89 | `fe722dad2` | feat | 添加 AI SDK 依赖和消息转换工具 |
| 90 | `8640fd147` | fix | 基于可用输入空间计算头部百分比 |
| 91 | `d7fa963b1` | docs | 澄清 read_command_output 的 search 参数（不过滤时应省略） |
| 92 | `c983e2628` | feat | 营销网站：添加 Linear 集成页面 |
| 93 | `010aba24b` | feat | **在设置面板中添加 Skills 管理 UI** |
| 94 | `ed35b09aa` | feat | ⭐ **默认启用并行工具调用** |
| 95 | `8d38e6018` | feat | 添加 OpenAI 兼容基础 Provider 并迁移 Moonshot 到 AI SDK |
| 96 | `31bed9ceb` | feat | **在 webview-ui 中集成 React Compiler** |
| 97 | `49aac7ea0` | feat | VS Code LM API Provider 添加图片支持 |
| 98 | `40b2bdc4d` | revert | 回滚 VS Code LM 图片支持 |
| 99 | `67e568f6b` | refactor | 用 skill 工具和内置 Skills 替换 fetch_instructions |
| 100 | `0c53f1937` | revert | 回滚上述替换 |
| 101 | `f84879577` | refactor | 再次用 skill 工具替换 fetch_instructions |
| 102 | `4b1d78fe0` | feat | 迁移 DeepSeek 到 @ai-sdk/deepseek + 修复 AI SDK 工具流 |
| 103 | `0f43cc981` | feat | 迁移 Cerebras Provider 到 AI SDK |
| 104 | `cc86049f1` | refactor | **Codex 风格 read_file 重构（EXT-617）** |
| 105 | `fd46e3113` | chore | 更新 next.js |
| 106 | `e771a4936` | feat | 迁移 Groq Provider 到 @ai-sdk/groq |
| 107 | `d8f65b655` | feat | 添加 pnpm serve 命令用于 code-server 开发 |
| 108 | `0cd257af8` | feat | 用 shadcn 导航菜单替换自定义导航 |
| 109 | `b5ae55783` | feat | 迁移 Fireworks Provider 到 AI SDK |
| 110 | `5945d0280` | release | **Release v3.46.0** |
| 111 | `946ae8056` | chore | Changeset 版本号更新 |
| 112 | `20d1f1f28` | chore | 将扩展 .env 文件设为可选 |
| 113 | `fa93109b7` | feat | **允许在初始欢迎界面导入设置** |
| 114 | `340049991` | fix | 清理 tool_result 块中的 tool_use_id 以匹配 API 历史 |
| 115 | `16fbabf2a` | feat | 添加模式下拉框以动态更改 Skill 模式 |
| 116 | `db0bcbec8` | chore | 添加 v3.46.1 changeset |
| 117 | `f97a5c221` | chore | Changeset 版本号更新 |
| 118 | `e46fae7ad` | fix | 为 MCP 工具响应添加图片内容支持 |
| 119 | `8cf82cd3a` | chore | 从 issue 模板中移除功能请求选项 |
| 120 | `ede1d2929` | fix | **命令执行期间排队消息而非丢弃** |
| 121 | `b020f6be4` | feat | 迁移 Mistral Provider 到 AI SDK |
| 122 | `e5fa5e8e4` | fix | IPC 修复：任务取消和排队消息 |
| 123 | `cfb604164` | chore | 版本号更新至 v1.107.0 |
| 124 | `1e790b0d3` | fix | 移除已弃用的 text-embedding-004 并迁移到 gemini-embedding-001 |
| 125 | `b4b8cef85` | fix | 压缩前将工具块转换为文本（EXT-624） |
| 126 | `c5874fc76` | feat | 迁移 SambaNova Provider 到 AI SDK |
| 127 | `67fb15072` | feat | 使用自定义 Base URL 获取 OpenRouter 模型列表 |
| 128 | `e90e6178e` | feat | 迁移 xAI Provider 到专用 @ai-sdk/xai 包 |
| 129 | `459213362` | feat | CLI 添加 Linux 支持 |
| 130 | `304b1c213` | fix | 在 cli-release 工作流中用 echo 替换 heredoc |
| 131 | `1c7ccb7b3` | chore | 移除 MacOS-13 CLI 支持 |
| 132 | `4647d0f3c` | fix | CLI：修正安装脚本中的示例 |
| 133 | `957600ab8` | chore | 添加 v3.46.2 changeset |
| 134 | `658034323` | chore | Changeset 版本号更新 |

### 第 135-169 条（v3.46.2 → v3.47.3）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 135 | `460cff4c3` | feat | 迁移 HuggingFace Provider 到 AI SDK |
| 136 | `54ea34e2c` | ux | 改进 Skills 和斜杠命令设置 UI（多模式支持） |
| 137 | `7f6272afb` | feat | 在 Fireworks Provider 中添加 Kimi K2.5 模型 |
| 138 | `1da2b1c45` | feat | **支持 AGENTS.local.md 个人覆盖文件** |
| 139 | `6e5661941` | feat | CLI：改进开发体验和 Roo Provider API Key 支持 |
| 140 | `afe51e0fe` | feat | **迁移 Gemini 和 Vertex Provider 到 AI SDK** |
| 141 | `dcba68509` | refactor | docs-extractor：简化模式聚焦原始事实提取 |
| 142 | `6214f4c16` | release | Roo Code CLI v0.0.50 |
| 143 | `aa49871a5` | fix | CLI：修复模式变更期间导致 Provider 切换的竞态条件 |
| 144 | `227b9796d` | fix | AI SDK：在消息转换中保留 reasoning 部分 |
| 145 | `934f34ea8` | revert | 回滚上述修复 |
| 146 | `1b75d59a6` | fix | AI SDK：再次修复消息转换中 reasoning 部分的保留 |
| 147 | `47bba1c2f` | feat | **在所有 Provider 中添加 Claude Opus 4.6 支持** |
| 148 | `f73b103b8` | chore | 从 getEnvironmentDetails 中移除无效的 toolFormat 代码 |
| 149 | `d5b7fdcfa` | feat | 在 OpenAI Codex Provider 中添加 gpt-5.3-codex 模型 |
| 150 | `b0dc6ae91` | refactor | 将环境详情追加到现有块中 |
| 151 | `846d66880` | release | **Release v3.47.0** |
| 152 | `c23e2717a` | chore | Changeset 版本号更新 |
| 153 | `5c5686d98` | docs | 更新 CHANGELOG（Claude Opus 4.6 支持） |
| 154 | `2d5e63378` | chore | 移除未使用的 stripAppendedEnvironmentDetails 和辅助函数 |
| 155 | `8c6d1ef15` | fix | 修正 Bedrock 中 Claude Opus 4.6 的模型 ID |
| 156 | `23d34154d` | fix | 防止 Provider 构造函数中空字符串 baseURL |
| 157 | `08f3b5ac1` | release | **Release v3.47.1** |
| 158 | `590fef711` | chore | Changeset 版本号更新 |
| 159 | `a266834ee` | feat | **支持 .agents/skills 目录** |
| 160 | `6a32b2e6f` | fix | AI SDK 迁移后恢复 Gemini thought signature 往返处理 |
| 161 | `87f6d908c` | fix | 捕获并往返处理 Bedrock Claude 的 thinking signature |
| 162 | `dfb4e3930` | release | **Release v3.47.2** |
| 163 | `5f9c243d6` | release | Release: v1.109.0 |
| 164 | `5b0897beb` | chore | Changeset 版本号更新 |
| 165 | `2053de7b4` | feat | 移除「启用 URL 上下文」和「启用 Google 搜索 Grounding」复选框 |
| 166 | `5fd156de7` | revert | 回滚移除 stripAppendedEnvironmentDetails |
| 167 | `dd6e32eb1` | revert | 回滚「将环境详情追加到现有块」 |
| 168 | `1cdb5f4ce` | release | **Release v3.47.3** |
| 169 | `78e64115e` | chore | Changeset 版本号更新 |

### 第 170-196 条（v3.47.3 → AI SDK 全面迁移阶段）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 170 | `8ef61bd32` | fix | 移除 NativeToolCallParser 中嘈杂的 console.warn 日志 |
| 171 | `06b25185e` | feat | CLI：默认模型从 Opus 4.5 更新到 Opus 4.6 |
| 172 | `a9e9c0207` | release | CLI v0.0.51 |
| 173 | `a3a904874` | refactor | 迁移 io-intelligence Provider 到 AI SDK |
| 174 | `36a986db1` | refactor | 迁移 featherless Provider 到 AI SDK |
| 175 | `00b1a7ed4` | refactor | 迁移 chutes Provider 到 AI SDK |
| 176 | `0e5407aa7` | fix | 将 defaultTemperature 设为 getModelParams 必需项，防止静默温度覆盖 |
| 177 | `ca7e3b616` | feat | **迁移 Bedrock Provider 到 AI SDK** |
| 178 | `6d2459c7e` | feat | **添加 disabledTools 设置以全局禁用 native 工具** |
| 179 | `9b39d2242` | feat | 为命令、模式和模型添加 IPC 查询处理器 |
| 180 | `f27953789` | feat | 在云功能网格中用 Linear 集成替换 Roomote Control |
| 181 | `43a307354` | refactor | 迁移 baseten Provider 到 AI SDK |
| 182 | `d7714e4e0` | chore | 版本号更新至 v1.110.0 |
| 183 | `4d87a004a` | fix | 在 nightly 构建配置中添加 stub-baseten-native esbuild 插件 |
| 184 | `7fc42d70e` | chore | 在 CODEOWNERS 文件中添加新代码所有者 |
| 185 | `97c10387e` | chore | 更新 AI SDK 包到最新版本 |
| 186 | `f179ba1b9` | refactor | 迁移 zai Provider 到 AI SDK |
| 187 | `6826e20da` | fix | 防止编排器委托期间父任务状态丢失 |
| 188 | `5d17f56db` | feat | **添加锁定切换以在工作区所有模式中固定 API 配置** |
| 189 | `7db4bfef5` | feat | **历史记录：将嵌套子任务渲染为递归树** |
| 190 | `12cddc969` | fix | 验证 Gemini thinkingLevel 对模型能力的兼容性并处理空流 |
| 191 | `4bc3d62d1` | feat | CLI 添加 linux-arm64 支持 |
| 192 | `99a2e3b1e` | release | CLI v0.0.52 |
| 193 | `2789baba9` | perf | 合并 resolveWebviewView 中的 getState 调用 |
| 194 | `5313cb503` | feat | 为任务头部添加视觉状态高亮 |
| 195 | `7afa43635` | feat | **在聊天 UI 中批量显示连续工具调用** |
| 196 | `ef2fec9a2` | refactor | ⚠️ **移除 9 个低使用率 Provider 并添加退役 Provider UX** |

### 第 197-255 条（AI SDK 迁移 → 回滚 → 恢复）

| # | Hash | 类型 | 中文说明 |
|---|------|------|---------|
| 197 | `1e0fc89fa` | refactor | **迁移 Anthropic Provider 到 @ai-sdk/anthropic** |
| 198 | `2b72a585d` | fix | 防止 OpenAI Compatible headers 导致误报未保存变更提示 |
| 199 | `115d6c5fc` | fix | 序列化 taskHistory 写入并修复委托状态覆写竞态 |
| 200 | `62a0106ce` | fix | 防止 webview postMessage 崩溃并使 dispose 幂等 |
| 201 | `7c58f2997` | fix | 修复 new_task 委托中丢失父任务历史的竞态条件 |
| 202 | `b8ef35280` | feat | 迁移 OpenAI Native Provider 到 @ai-sdk/openai |
| 203 | `571be7100` | misc | PR #11144 合并 |
| 204 | `24039c78b` | refactor | 迁移 AnthropicVertexHandler 到 AI SDK |
| 205 | `bb86eb865` | refactor | 迁移 LM Studio Provider 到 Vercel AI SDK |
| 206 | `70775f0ec` | fix | 使 removeClineFromStack() 感知委托以防止孤立父任务 |
| 207 | `c74acf36e` | feat | 迁移 LiteLLM Provider 到 AI SDK（@ai-sdk/openai-compatible） |
| 208 | `7da429da1` | revert | 回滚「任务头部视觉状态高亮」 |
| 209 | `f51e91ac7` | fix | 防止双重通知声音播放 |
| 210 | `7a38b9923` | feat | 迁移 Requesty Provider 到 AI SDK（@requesty/ai-sdk） |
| 211 | `a4914c438` | feat | 迁移 OpenAiHandler 到 AI SDK |
| 212 | `34a278e9a` | feat | 迁移 VercelAiGatewayHandler 到 AI SDK |
| 213 | `b7d6e4933` | refactor | 迁移 OpenAI Codex 到 AI SDK 并使用 Responses API 指令字段 |
| 214 | `b6bf829ad` | feat | 迁移 MiniMax Provider 到 AI SDK |
| 215 | `938e6994a` | refactor | 迁移 Qwen Code Provider 到 AI SDK |
| 216 | `2f9849071` | fix | **显示实际 API 错误消息而非通用 NoOutputGeneratedError** |
| 217 | `5773af8dd` | feat | 重构 OpenRouter Provider 使用 Vercel AI SDK |
| 218 | `b02924530` | fix | 修复 API 模块中的任务恢复 |
| 219 | `c1a8767ad` | fix | **Checkpoint：规范化 core.worktree 比较以防止 Windows 路径不匹配** |
| 220 | `7df1a18cc` | fix | 编辑器：在 DiffViewProvider.open 中使标签关闭为尽力尝试 |
| 221 | `d4cf3211e` | fix | 避免 zsh 进程替换在赋值中的误报 |
| 222 | `ff89965f5` | fix | 防止在云/设置导航期间聊天历史丢失 |
| 223 | `4272a6972` | refactor | 通过 handleAiSdkError() 统一 Gemini/Vertex 错误处理 |
| 224 | `cdd1a4dab` | refactor | 迁移 NativeOllamaHandler 到 AI SDK |
| 225 | `b971fe1a6` | fix | 在聊天活动期间保留聊天框中粘贴的图片 |
| 226 | `4438fdadc` | fix | Azure Foundry 第二次快速修复 |
| 227 | `50e5d98f5` | feat | RooMessage 类型系统和存储层（为 ModelMessage 迁移做准备） |
| 228 | `08a96af22` | fix | 加固命令自动审批以防内联 JS 误报 |
| 229 | `8d57da8bc` | refactor | 迁移 Roo Provider 到 AI SDK |
| 230 | `097f64834` | fix | 修复聊天滚动锚定和任务切换滚动竞态条件 |
| 231 | `8a69e9e04` | feat | ⚠️ **将 search_and_replace 工具重命名为 edit 并统一编辑工具族 UI** |
| 232 | `580036390` | refactor | 删除孤立的 per-provider 缓存转换文件 |
| 233 | `4e659b459` | refactor | ⚠️ **移除 footgun prompting（文件级系统提示覆盖）** |
| 234 | `a7ba3b5af` | feat | 将 RooMessage 存储接入 Task.ts 和所有 Provider |
| 235 | `dcb33c47a` | revert | 回滚上述接入 |
| 236 | `e6f0e79c3` | feat | 实现 ModelMessage 存储层（含 AI SDK 响应消息） |
| 237 | `d2c52c9e0` | chore | 清理面向仓库的 mode rules |
| 238 | `b759b92f0` | refactor | ⚠️ **移除内置 Skills 和内置 Skills 机制** |
| 239 | `b51af9827` | fix | 使委托重开流程原生适配 Roo v2 |
| 240 | `77b76a891` | fix | 处理取消/恢复中止竞态而不崩溃 |
| 241 | `bd4cd07e8` | release | Release: v1.111.0 |
| 242 | `6c8b9dfa2` | feat | CLI 默认自动审批，require-approval 变为可选 |
| 243 | `f54f224a2` | release | CLI v0.0.53 |
| 244 | `fa9dff4a0` | refactor | ⚠️ **完全移除浏览器使用功能** |
| 245 | `897c372d2` | refactor | **统一缓存控制：集中化断点和通用 Provider 选项** |
| 246 | `cdf481c8f` | feat | 在 Z.ai Provider 中添加 GLM-5 模型支持 |
| 247 | `6c9ff49dd` | fix | 倒计时期间关闭自动审批时取消后端超时 |
| 248 | `9e46d3e10` | fix | 修复 Provider 400 错误：从消息中剥离 reasoning_details，从工具 schema 中剥离 $ref |
| 249 | `b7857bcd6` | fix | 加固委托生命周期：每任务元数据、互斥锁、多层故障恢复 |
| 250 | `3965cd974` | fix | 稳定所有 Provider 和路由 Roo 元数据的 token/缓存记账 |
| 251 | `b4d9f92b4` | revert | 回滚 Provider 400 修复 |
| 252 | `5507f5ab6` | feat | 将翻译和合并解析器模式提取为可复用 Skills |
| 253 | `6cfa82f57` | revert | ⚠️⚠️ **回滚到 pre-AI-SDK 状态（2026年1月29日）** |
| 254 | `594ed62f9` | fix | 恢复默认代码所有者 |
| 255 | `d52b6834e` | feat | **重新添加回滚后的 bug 修复和功能（Step 2）** |

---

## 三、重大变更分类汇总

### 🔴 架构级变更（影响你的自定义功能）

1. **XML 工具调用被彻底移除**
   - `#8` 移除 XML 工具调用支持
   - `#26` 清理 XML 遗留代码
   - `#45` 移除遗留 XML 工具调用代码（getToolDescription）
   - **影响**：你的「工具协议选择器」功能将无法简单恢复

2. **search_and_replace 重命名为 edit**
   - `#231` 工具重命名 + 统一编辑工具族 UI
   - **影响**：你的 `multi_edit_file` 工具可能需要适配

3. **AI SDK 全面迁移 → 回滚**
   - `#253` 最终回滚到 pre-AI-SDK 状态
   - `#255` 部分恢复 bug 修复和功能
   - **影响**：最终状态不确定，rebase 时需谨慎

4. **无损终端输出系统**
   - `#87` 全新终端输出 + 按需检索机制
   - **影响**：可能与你的终端增强功能冲突

### 🟡 功能移除

| 被移除的功能 | 提交 |
|-------------|------|
| XML 工具调用 | #8, #26, #45 |
| Claude Code Provider | #13 |
| diffEnabled / fuzzyMatchThreshold 设置 | #40 |
| POWER_STEERING 实验 | #42, #62 |
| MULTI_FILE_APPLY_DIFF 实验 | #43 |
| 自定义压缩模型选项 | #28 |
| MCP SERVERS 系统提示段 | #54 |
| fetch_instructions 工具 | #99→#101（替换为 skill 工具） |
| footgun prompting（文件级系统提示覆盖） | #233 |
| 内置 Skills 机制 | #238 |
| 浏览器使用功能 | #244 |
| 9 个低使用率 Provider | #196 |
| URL 上下文 / Google 搜索 Grounding | #165 |

### 🟢 重要新功能

| 新功能 | 提交 |
|--------|------|
| Git Worktree 管理 | #4 |
| 智能上下文压缩 v2 | #37 |
| 压缩 v2.1 智能代码折叠 | #83 |
| 并行工具调用（默认开启） | #94 |
| 无损终端输出 + 按需检索 | #87 |
| Skills 管理 UI | #93 |
| MCP alwaysAllow 通配符 | #59 |
| React Compiler 集成 | #96 |
| 欢迎界面导入设置 | #113 |
| AGENTS.local.md 个人覆盖 | #138 |
| .agents/skills 目录 | #159 |
| Claude Opus 4.6 支持 | #147 |
| gpt-5.3-codex 模型 | #149 |
| API 配置锁定切换 | #188 |
| 嵌套子任务递归树 | #189 |
| 连续工具调用批量显示 | #195 |
| disabledTools 全局禁用 | #178 |

### 🔧 重要 Bug 修复

| 修复 | 提交 |
|------|------|
| Windows checkpoint 路径不匹配 | #219 |
| 聊天历史在导航时丢失 | #222 |
| 粘贴图片在聊天活动中丢失 | #225 |
| 双重通知声音 | #209 |
| 委托生命周期竞态 | #249 |
| 父任务状态丢失 | #187, #201 |
| webview postMessage 崩溃 | #200 |
| 聊天滚动锚定竞态 | #230 |
| 命令自动审批 JS 误报 | #228 |
| zsh 进程替换误报 | #221 |
| API 错误被吞掉 | #216 |
| Ollama 模型验证错误 | #78 |
| Bedrock toolUseId 截断 | #53 |
| LiteLLM 工具 ID 验证 | #70 |
| 嵌套压缩包含已压缩内容 | #66 |
| 孤立 tool_results | #44 |
| token 计数返回 0 | #65 |

---

## 四、AI SDK 迁移完整时间线

这是官方这次更新最大的工程，经历了 **迁移 → 问题 → 回滚 → 部分恢复** 的完整过程：

| 阶段 | 说明 |
|------|------|
| 启动 | 添加 AI SDK 依赖和消息转换工具（#89） |
| 迁移 | Moonshot、DeepSeek、Cerebras、Groq、Fireworks、Mistral、SambaNova、xAI、HuggingFace、Gemini/Vertex、io-intelligence、featherless、chutes、Bedrock、baseten、zai、Anthropic、OpenAI、LM Studio、LiteLLM、Requesty、OpenAI Codex、MiniMax、Qwen Code、OpenRouter、Ollama、Roo、AnthropicVertex |
| 问题 | reasoning 部分丢失（#144→#145→#146）、thought signature 问题（#160, #161）、环境详情追加问题（#150→#166→#167） |
| 回滚 | **`6cfa82f57` — 回滚到 2026-01-29 的 pre-AI-SDK 状态** |
| 恢复 | **`d52b6834e` — 重新添加回滚后的 bug 修复和功能** |

> ⚠️ 最终 origin/main 的状态是：**AI SDK 迁移被回滚，但部分非 AI-SDK 的 bug 修复和功能被重新添加回来。**

---

## 五、对自定义功能的影响评估

| 你的功能 | 风险 | 详细说明 |
|---------|------|---------|
| **工具协议选择器** | 🔴 严重 | XML 支持已彻底移除（#8, #26, #45），`toolProtocol` 设置已删除（#40），`getToolDescription` 已移除 |
| **multi_edit_file** | 🟡 中等 | `search_and_replace` 重命名为 `edit`（#231），工具体系有变化，但由于 AI SDK 回滚，最终状态需要验证 |
| **终端增强** | 🟡 中等 | 官方新增无损终端输出系统（#87），命令执行期间排队消息（#120），可能冲突 |
| **导入任务** | 🟢 低 | 独立功能，影响小 |
| **Shell Integration 修复** | 🟢 低 | 独立修复 |
| **终端同步** | 🟢 低 | 独立功能 |
