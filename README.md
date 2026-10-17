# INK Design Language

> 用八种颜色，排版中文界面。

INK 是一套面向中文界面的设计语言，也是一份可执行的规范：纸白底、墨黑字、八个色场、1px 细线、0 圆角。本仓库是它的展示站，`site/` 与 GitHub 仓库根目录一一对应。

## 站点

- 线上：<https://knink-owo.github.io/INK-DesignLanguage/>
- 首页：左字右色墙的开场、五章目录、三条原则
- 规范正文：`spec/` 五章 — 色彩、文字、空间、组件、文案与动效

## 文件

| 路径 | 内容 |
| --- | --- |
| `index.html` | 首页 |
| `spec/color.html` | 色彩：八个色场 |
| `spec/typography.html` | 文字：先把一句排好 |
| `spec/space.html` | 空间：留白按刻度走 |
| `spec/components.html` | 组件：方角和一条线 |
| `spec/voice-motion.html` | 文案与动效：把句子写短 |
| `tokens.css` | 唯一设计变量源 |
| `tokens.json` | 机器可读变量副本（由 `tools/sync_tokens.py` 生成） |
| `assets/site.css` | 样式（版式 / 组件 / 页面类） |
| `assets/site.js` | 浮层展开收起、复制按钮 |
| `assets/og.png` | 分享图 1200×630 |
| `DESIGN.md` | 为什么：规则与数值解释 |
| `AGENTS.md` | 怎么做：页面骨架、类名清单、验收清单 |
| `llms.txt` | 给模型的入口索引 |

## 本地预览

在项目根执行：

```bash
D:/app/tools/Miniconda/python.exe -m http.server 8802 --bind 127.0.0.1 --directory site
# 打开 http://127.0.0.1:8802/
```

直接双击 `index.html` 也可以看，但浮层与复制功能在部分浏览器下需要 http 环境。

## 部署

纯静态站点，GitHub Pages 从 `main` 分支根目录发布。`main` 分支内容就是本目录的发布产物，不是源码。

```bash
# 需要 gh 已登录 knink-owo
node tools/deploy.js
```

脚本逐文件提交 `site/` 内容、轮询 Pages 构建状态，构建完成后才算发布成功。细节见 [`../HANDOVER.md`](../HANDOVER.md)。

## 约束

零框架、零构建、零 CDN、零外链字体、零图标库。所有颜色、字号、间距、动效只取自 `tokens.css`。约定与验收见 [`AGENTS.md`](AGENTS.md)，理由见 [`DESIGN.md`](DESIGN.md)。
