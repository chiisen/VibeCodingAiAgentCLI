## 📘 PRD：Vibe Coding – AI Code Companion（DEMO 版本）

### 一、產品願景

Vibe Coding 是一款基於 Node.js 的 **AI 程式助手 CLI 工具**，模擬「輕量版 n Codex / Copilot」的體驗。
目標不是要取代完整 IDE 插件，而是展示：

> 一個人也能構建一個能理解自然語言、生成程式碼、並即時執行的智慧 CLI 工具。

這是開源展示用專案，用來體現開發者在「AI 程式生成 × CLI 工具設計 × npm 套件封裝」的實戰能力。

---

### 二、使用場景（User Story）

> 「我只想開個 CLI，輸入一句話，就能讓 AI 幫我生出一段能跑的代碼。」

* **角色：** 全端開發者 / 學生 / 黑客松參賽者
* **需求：** 在命令列快速生成程式碼雛形，不必打開 IDE 或編輯器
* **痛點：** 不想被大型 AI 工具綁架，只想快速試想法

---

### 三、核心功能（Core Features）

| 功能模組                  | 描述                           | 範例指令                                       |
| --------------------- | ---------------------------- | ------------------------------------------ |
| `vibe init`           | 初始化設定檔，選擇語言、模型 API Key、輸出目錄  | `vibe init`                                |
| `vibe ask "<prompt>"` | 傳入自然語言提示（Prompt），生成可執行程式碼    | `vibe ask "build a simple express server"` |
| `vibe run "<prompt>"` | 直接生成並執行程式碼（內建安全沙箱）           | `vibe run "print fibonacci series in JS"`  |
| `vibe save`           | 儲存生成程式到專案目錄                  | `vibe save`                                |
| `vibe vibe`           | 隨機顯示一句「開發者心靈語錄」，展示 CLI 互動趣味性 | `vibe vibe`                                |

---

### 四、技術架構（Tech Stack）

* **核心語言：** JavaScript (Node.js)
* **CLI 框架：** [Commander.js](https://www.npmjs.com/package/commander)
* **AI 服務：** OpenAI API（或 mock endpoint）
* **執行環境隔離：** Node VM / child_process sandbox
* **輸出模板引擎：** Mustache / Handlebars
* **封裝與發布：** npm CLI 套件（`npm publish`）

---

### 五、系統流程（System Flow）

1. 使用者輸入自然語言指令
2. CLI 解析 prompt 並傳送至 AI 模型
3. 模型回傳程式碼片段
4. CLI 於本地執行沙箱中測試運行
5. 輸出結果至終端或儲存為檔案

---

### 六、展示目標（DEMO Focus）

此 DEMO 將展示：

* ✅ 你能設計出結構化的 CLI 工具（指令解析、子命令模組化）
* ✅ 你能串接 AI API 並封裝為可重複使用的 npm 套件
* ✅ 你能以簡潔的 UI / UX（CLI 互動）提升使用體驗
* ✅ 展現 AI 工具產品思維與程式架構掌控能力

---

### 七、延伸構想（Future Roadmap）

* [ ] 支援多語言輸出（Python、Go、Rust）
* [ ] CLI 模式整合 VS Code 插件
* [ ] 離線 prompt 緩存
* [ ] Model 選擇介面（GPT / Claude / local LLM）

---

### 八、DEMO 結尾語

> “Vibe Coding 不只是代碼生成器，而是一個能讓開發者與 AI 一起 Jam 的舞台。”

---

要我幫你順手生一份可直接放在 GitHub `README.md` 的版本嗎？我可以幫你排版成 Markdown＋徽章風格，看起來像真的開源專案。
