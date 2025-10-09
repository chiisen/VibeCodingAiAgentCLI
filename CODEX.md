# Vibe Coding AI Agent CLI – Codex Notes

## Purpose
- Node.js CLI companion that answers coding prompts, generates runnable JavaScript, and保存互動歷程。
- 主流程從 `src/index.js` 啟動，載入 Commander 指令模組與 dotenv 設定。
- `bin/vibe.js` 提供 `npm link` 後的全域執行入口。

## Core Commands
- `vibe init`: 互動式寫入 `~/.vibe/config.json`，可設定 API Key、模型與自訂 base URL。（`src/commands/init.js`）
- `vibe ask`: 向 AI 詢問問題，支援 `--mock`、`--model`、`--raw`，結果會存入歷程。（`src/commands/ask.js`）
- `vibe run`: 產生程式碼並透過 sandbox 執行，可顯示程式碼、調整逾時或強制 mock。（`src/commands/run.js`）
- `vibe save`: 讀取歷程最新互動並輸出 Markdown 報告。（`src/commands/save.js` + `src/templates/session-summary.mustache`）
- `vibe vibe`: 顯示 ASCII 鼓勵訊息，可選 mood 或向 AI 取得自訂 mantra。（`src/commands/vibe.js`）

## Services & Utilities
- AI 介面：`src/services/ai-client.js` 依 config/環境變數建立 OpenAI client，無金鑰或 `--mock` 時改用 Mustache 範本 (`src/templates/mock-*.mustache`)。
- 設定/歷程：`src/services/config-store.js` 管理 `~/.vibe` 底下的 `config.json` 與 `history.json`，預設保留 20 筆互動。
- 錯誤處理：`src/services/error-handler.js` 捕捉未處理例外，啟動時於 `src/index.js` 直接 require。
- 沙盒執行：`src/utils/sandbox.js` 將生成程式寫入暫存檔，使用 `node` 同步執行並返回 stdout/stderr/status。

## Getting Started
1. `npm install`
2. `npx . --help` 或 `npm link` 後使用 `vibe --help`
3. `vibe init` 先填 API Key（可跳過，此時預設 mock）
4. `vibe ask "prompt"` 或 `vibe run "prompt"` 試用

## Files of Interest
- `README.md`: 使用說明、安裝流程與指令範例。
- `PRD.md`: 產品定位、核心需求與後續 roadmap（目前含部分亂碼）。
- `package.json`: 指定 `chalk`, `commander`, `openai`, `fs-extra`, `inquirer`, `mustache`, `ora` 等依賴；僅提供 `npm run lint`。
- `.nvsrc`: 指令列預設 Node.js 版本代碼 `20`。

## Dev Notes
- CLI 啟動會讀取 `.env` 或 `VIBE_DOTENV` 指向檔案；若無 `OPENAI_API_KEY` 則 fallback 至 mock。
- 歷程寫入與 session 匯出皆為同步檔案操作；如需併發支援需改為 async。
- sandbox 暫存檔位於 `os.tmpdir()`；需要實體檔案才能避免動態 import 限制。
- 若要擴充額外指令，依現有 pattern 在 `src/commands` 新增模組並於 `src/index.js` 註冊。

