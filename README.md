# INK Design Language

> 先感受，再解释。

INK 是一套个人设计语言，也是一份可执行的规范：纸白底、墨黑字、八个色场、直角与 1px 线。本仓库同时是它的展示站。

## 站点

- https://knink-owo.github.io/INK-DesignLanguage/
- 首页：`index.html`（开场一句话 + 八色场占满第一屏 / 原则与语气 / 彩蛋与实验区）
- 规范正文：`spec/` 五章 — 色彩、文字、空间、组件、语气与动效

## 文件

| 路径 | 内容 |
| --- | --- |
| `index.html` | 首页 |
| `spec/color.html` | 色彩规范 |
| `spec/typography.html` | 文字规范 |
| `spec/space.html` | 空间规范 |
| `spec/components.html` | 组件规范 |
| `spec/voice-motion.html` | 语气与动效规范 |
| `tokens.css` | 唯一设计变量源 |
| `tokens.json` | 机器可读变量导出 |
| `assets/site.css` | 样式（reset / 组件 / 页面类） |
| `assets/site.js` | 空间连续性对话框、复制按钮 |
| `assets/favicon.svg` | INK 标记 |
| `DESIGN.md` | 设计规范正文（人读） |
| `AGENTS.md` | Agent 实现约束 |
| `llms.txt` | LLM 入口索引 |

## 本地预览

```bash
python -m http.server 8642
# 打开 http://127.0.0.1:8642/
```

## 部署

纯静态站点，GitHub Pages 从 `main` 分支根目录发布；推送即更新。`.nojekyll` 已存在。

## 约束

零框架、零构建、零 CDN、零外链字体；所有颜色、字号、间距、动效只取自 `tokens.css`。细节见 [`DESIGN.md`](DESIGN.md) 与 [`AGENTS.md`](AGENTS.md)。
