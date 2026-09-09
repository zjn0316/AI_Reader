# 技术方案文档 — 马克阅读（AI Reader）

## 1. 技术选型

| 层 | 选型 | 理由 |
| --- | --- | --- |
| 框架 | React 19 | 组件化、生态成熟，适合快速构建 UI |
| 语言 | TypeScript | 类型约束降低出错率，利于长期维护 |
| 构建 | Vite 8 | 秒级启动、打包快，适合 MVP 快速演示 |
| 测试 | Vitest + React Testing Library | 与 Vite 同源、配置简单，覆盖组件与纯函数 |
| 静态检查 | oxlint | 模板自带，零配置接入 |

> 视频原始方案为 Electron 桌面端；本项目为快速演示改用 Web 版（React + Vite + TS），保留同样的模块化思路。

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

## 5. 边界与取舍

- 仅处理 UTF-8 文本，暂不处理 GBK 等编码。
- 大文件一次读入内存，MVP 阶段不处理分章/懒加载。
