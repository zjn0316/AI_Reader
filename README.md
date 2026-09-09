# 马克阅读 (AI Reader)

一个基于 Web 的 React + TypeScript + Vite 本地 TXT 电子书阅读器 MVP。

## 功能（MVP）

- 打开本地 `.txt` 文件导入书籍
- 纵向滚动阅读视图
- 字号可调（A− / A+）
- 字号设置持久化到浏览器 `localStorage`

> 当前 MVP 仅支持 TXT 格式；EPUB、书签、深色主题等在后续迭代加入。

## 技术栈

React 19 + TypeScript + Vite + Vitest + React Testing Library。

## 开发

```bash
npm install
npm run dev        # 启动开发服务器
npm run test       # 执行全部单元测试
npm run lint       # oxlint 代码检查
npm run build      # 类型检查 + 生产构建
```

## 使用

点击「打开 TXT 文件」选择本地的 `.txt` 文件即可阅读；通过顶部的 A− / A+ 调整字号。

## 相关文档

- `docs/product-design.md` — 产品设计 / MVP 边界
- `docs/tech-solution.md` — 技术选型与模块划分
- `AGENTS.md` — AI 协作规则
