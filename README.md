# 马克阅读 (AI Reader)

本地 TXT 电子书阅读器，提供 **Web 版** 与 **Electron 桌面版（.exe）**。

## 功能

- 打开本地 `.txt` 文件导入书籍
- 纵向滚动阅读视图
- 字号可调（A− / A+）
- 字号设置持久化到 `localStorage`
- 桌面版通过系统原生对话框打开文件；Web 版通过文件选择框打开

> 当前仅支持 TXT 格式；EPUB、书签、深色主题等在后续迭代加入。

## 技术栈

React 19 + TypeScript + Vite + Vitest + React Testing Library；桌面版由 Electron + electron-builder 打包。

## 开发（Web 版）

```bash
npm install
npm run dev        # 启动 Web 开发服务器（http://localhost:5173）
npm run test       # 执行全部单元测试
npm run lint       # oxlint 代码检查
npm run build      # 类型检查 + Web 生产构建
```

## 开发（桌面版）

```bash
npm run dev:desktop    # 启动 Electron + Vite 开发环境
npm run dist:desktop   # 打包免安装单文件 exe -> release/AI_Reader-<version>-portable.exe
```

> 若 Electron / electron-builder 二进制下载受网络影响，可设置镜像：
> `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/`
> `ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/`

## 使用

点击「打开 TXT 文件」选择本地的 `.txt` 文件即可阅读；通过顶部的 A− / A+ 调整字号。桌面版双击 exe 即可运行，无需安装。

## 项目结构

```
electron/            # Electron 主进程与 preload（原生文件对话框、窗口）
src/                 # React 渲染层（Web 与桌面共用）
src/lib/desktop.ts   # 桌面桥接层：桌面走原生对话框，Web 降级为文件选择框
scripts/             # 构建脚本（esbuild 打包主进程）
electron-builder.yml # 桌面打包配置
```

## 相关文档

- `docs/product-design.md` — 产品设计 / MVP 边界
- `docs/tech-solution.md` — 技术选型与模块划分
- `AGENTS.md` — AI 协作规则
