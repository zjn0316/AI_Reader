# 技术方案文档 — 马克阅读（AI Reader）

## 1. 技术选型

| 层 | 选型 | 理由 |
| --- | --- | --- |
| 框架 | React 19 | 组件化、生态成熟，适合快速构建 UI |
| 语言 | TypeScript | 类型约束降低出错率，利于长期维护 |
| 构建 | Vite 8 | 秒级启动、打包快，适合 MVP 快速演示 |
| 测试 | Vitest + React Testing Library | 与 Vite 同源、配置简单，覆盖组件与纯函数 |
| 静态检查 | oxlint | 模板自带，零配置接入 |

> 本项目同时提供 Web 版与 Electron 桌面版：渲染层（React + Vite + TS）完全共用，仅在最外层通过桥接层区分文件打开方式。

## 2. 模块划分

```
src/
├── lib/
│   ├── fileLoader.ts      # TXT 导入与解析（纯函数）
│   └── fontSize.ts        # 字号常量、边界钳制（纯函数）
├── hooks/
│   └── useFontSize.ts     # 字号状态 + localStorage 持久化
├── components/
│   └── ReaderView.tsx     # 纵向滚动阅读视图
├── App.tsx                # 组合：导入入口 + 字号控件 + 阅读视图
└── main.tsx               # 应用入口
```

## 3. 数据与状态

- 书籍内容：仅保存在组件 state 中，打开即读，不做持久化。
- 字号设置：持久化到 `localStorage`（key：`ai-reader:font-size`），读取时通过 `clampFontSize` 做边界钳制。
- 读取策略：`readTxtFile` 使用 `File.text()` 读取，`splitIntoParagraphs` 按换行切分并去除空行。

## 4. 测试策略

- 纯函数单元测试：`fileLoader`、`fontSize` 的逻辑。
- 组件测试：`ReaderView` 渲染正确性与字号样式。
- 集成测试：`App` 的导入、错误态、字号调节与持久化。
- 测试环境：`jsdom` + `@testing-library/jest-dom`。

## 5. 桌面版（v2）架构

```
electron/
├── main.ts        # 主进程：创建窗口、dialog.showOpenDialog、fs 读 TXT、ipcMain.handle
└── preload.ts     # contextBridge 暴露 window.desktop.openTxtFile()（contextIsolation 开启）

scripts/build-electron.mjs  # esbuild 将 main/preload 打包为 CJS -> dist-electron/*.cjs
electron-builder.yml        # 打包为免安装 portable exe
```

- **共用渲染层**：`src/` 组件与逻辑 Web/桌面完全一致。
- **桥接降级**：`src/lib/desktop.ts` 的 `hasDesktopApi()` 检测 `window.desktop`；桌面走原生对话框，Web 回退 `<input type=file>`。
- **安全**：`contextIsolation: true`、`nodeIntegration: false`，渲染层仅能通过白名单 IPC 访问文件系统。
- **打包**：`electron-builder --win portable` 产出 `AI_Reader-<version>-portable.exe`（默认 Electron 图标）。

## 6. 边界与取舍

- 仅处理 UTF-8 文本，暂不处理 GBK 等编码。
- 大文件一次读入内存，MVP 阶段不处理分章/懒加载。
- 桌面版暂用默认 Electron 图标，自定义图标留待后续迭代。
