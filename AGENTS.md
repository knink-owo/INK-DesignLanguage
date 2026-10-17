# AGENTS.md · INK 设计语言的 Agent 实现约束

这份文档给「要基于 INK 做页面 / 改页面」的 AI Agent 看。人类读者请先读 [`DESIGN.md`](DESIGN.md)。

**开工顺序：** 读 `DESIGN.md` → 读 `tokens.css` → 读 `assets/site.css` 的类名清单 → 再动手。
**一句话：** 只组合已有 token 与类名，不新增设计语言。

---

## 1. 硬约束（不可协商）

1. **零依赖**：不引入框架、构建工具、CDN、外链字体、图标库。新页面 = 纯 HTML + 现有 CSS/JS。
2. **只用 token**：颜色、字号、间距、圆角、阴影、时长全部来自 `tokens.css`。页面里不出现裸色值 / 裸 `px` 间距（色块演示可内联 `var(--ink-*)`）。
3. **不新增视觉语言**：不新增品牌色、不改圆角（恒 0）、不加渐变、不加玻璃拟态卡片、不加第三种字体。
4. **不复制 DNDL 的品牌**：可以参考结构（章节、页脚、token 命名），不复制其色值、文案、布局细节。
5. **中文文案**：短句、动词具体、不用营销话术（见 `DESIGN.md` §8/§10）。不写「关于我」、博客、案例区。
6. **可访问性不许退步**：跳转链接、`:focus-visible` 焦点环、`aria-current`、44px 触控目标、`prefers-reduced-motion` 降级。
7. **每页唯一 h1**；标题不跳级；图片必须有 `alt` 或标注为装饰。
8. **顶栏只有品牌 + 五章导航**（导航右对齐），不加入口按钮；首页色带是静态展示，不做跳转、不加 hover 动效。

## 2. 文件地图

```
index.html                 首页（3 个模块）
spec/color.html            色彩
spec/typography.html       文字
spec/space.html            空间
spec/components.html       组件
spec/voice-motion.html     语气与动效
tokens.css                 唯一 token 源
assets/site.css            唯一样式源（reset + 组件 + 页面类）
assets/site.js             空间连续性对话框 + 复制按钮
assets/favicon.svg         INK 标记
DESIGN.md                  设计规范正文
AGENTS.md                  本文件
tokens.json                机器可读 token 导出
llms.txt                   给 LLM 的入口索引
```

相对路径规则：根目录页面用 `tokens.css` / `assets/...`；`spec/` 下用 `../tokens.css` / `../assets/...`。

## 3. 新页面骨架（照抄，改标题与内容）

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>标题 · INK Design Language</title>
  <meta name="description" content="一句话描述。">
  <meta name="theme-color" content="#FAF9F5">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../tokens.css">
  <link rel="stylesheet" href="../assets/site.css">
</head>
<body>
  <a class="skip-link" href="#main">跳到内容</a>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="../index.html">INK <span class="brand__sub">/ Design Language</span></a>
      <nav class="site-nav" aria-label="规范正文">
        <a href="color.html">色彩</a>
        <a href="typography.html">文字</a>
        <a href="space.html">空间</a>
        <a href="components.html">组件</a>
        <a href="voice-motion.html">语气与动效</a>
      </nav>
    </div>
  </header>
  <main id="main">
    <header class="chapter-hero">
      <div class="wrap">
        <div class="chapter-hero__meta">
          <a class="kicker" href="../index.html">INK / 规范</a>
          <span class="chip">CH 06 · 应用</span>
        </div>
        <h1 class="h1 chapter-hero__title">标题。<br>第二行。</h1>
        <p class="lede chapter-hero__lede">一段 40–80 字的导语。</p>
      </div>
    </header>
    <div class="chapter-body">
      <div class="wrap">
        <section class="spec-section">
          <div class="spec-head">
            <div>
              <span class="spec-head__index">01 / SECTION</span>
              <h2 class="h2">小节标题</h2>
            </div>
            <p class="lede">小节导语。</p>
          </div>
          <!-- 内容：.grid/.panel/.table-wrap/.do-dont/.callout/.code-block 等 -->
        </section>
        <nav class="pager" aria-label="章节目录"> … </nav>
      </div>
    </div>
  </main>
  <footer class="site-footer"> … 与现有页脚一致，链接加 ../ … </footer>
  <script src="../assets/site.js" defer></script>
</body>
</html>
```

## 4. 可用类名（不要造新类；缺布局时优先组合 `.grid` + `.panel`）

| 用途 | 类名 |
| --- | --- |
| 布局 | `.wrap` `.section` `.chapter-hero` `.chapter-body` `.spec-section` `.spec-head` `.spec-head__index` |
| 网格 | `.grid` `.grid--2` `.grid--3` `.grid--4` `.grid--6` |
| 文字 | `.display` `.h1` `.h2` `.h3` `.lede` `.dim` `.kicker` `.kicker--ink` `.kicker--on-color` `.mono` `.visually-hidden` |
| 按钮 | `.btn` `.btn--primary` `.btn--field` `.copy-btn` |
| 色场 | `.tone-lake` `.tone-sky` `.tone-moss` `.tone-lotus` `.tone-wheat` `.tone-clay` `.tone-stone` `.tone-rouge` |
| 容器 | `.panel` `.panel--flush` `.panel__label` `.tile` `.tile--link` `.tile__meta` `.swatch` `.swatch__color` `.swatch__name` `.swatch__meta` `.swatch__role` `.swatch-mini` |
| 表格 | `.table-wrap` `.spec-table` |
| 对比 | `.do-dont` `.do-dont__panel--do` `.do-dont__panel--dont` `.do-dont__head` `.do-dont__body` |
| 提示 | `.callout` `.callout--warn` `.code-block` `.code-block__head` |
| 标签 | `.chip` `.tag` |
| 其他 | `.pager` `.pager__link` `.pager__link--next` `.pager__dir` `.field` `.field__label` `.input` `.field__hint` `.field__error` |

复制按钮：`<button class="copy-btn" type="button" data-copy-target="#目标id">复制</button>`，目标为 `<pre>` / 任何元素。
空间连续性：`<button data-sheet-open="ink-sheet">` + 页面内 `<dialog class="sheet" id="ink-sheet">`（结构照抄 `index.html` 或 `spec/voice-motion.html`）。

## 5. 验收清单（提交前逐条勾）

- [ ] 页面在 `python -m http.server` 下打开无 404、无控制台报错
- [ ] 只有一处 h1；标题层级连续；`aria-current="page"` 指对
- [ ] 无裸色值/裸间距；颜色与尺寸全部来自 `var(--ink-*)`
- [ ] 一屏一个色场、一个主按钮
- [ ] 键盘 Tab 能到达所有交互元素，焦点环可见
- [ ] 用 `prefers-reduced-motion: reduce` 模拟后无动画、功能完整
- [ ] 375px 宽度下不横向滚动；正文 ≥16px，表格/注释等辅助文本 ≥14px
- [ ] 中文文案符合 `DESIGN.md` §8（无营销话术、✓/✕ 成对）
- [ ] 未引入任何外部资源（字体/CDN/脚本）

## 6. 常见错误

- 把色场当背景铺满整页、上面压白字 → 违反对比度红线。
- 给按钮加圆角或胶囊形 → 圆角恒 0。
- 发明 `--ink-purple`、`--ink-space-5xl` 之类新 token → 禁止。
- 用内联 `style="color: #333"` → 必须用 `var(--ink-text-primary)`。
- 首页加「关于我 / 最近文章 / 作品集」模块 → 明确不做（`DESIGN.md` §10）。
- 用 `Alert`/`scroll` 事件做视差 → 禁止。

## 7. 部署

- 仓库：`knink-owo/INK-DesignLanguage`，GitHub Pages 从 `main` 分支根目录发布。
- 站点入口：https://knink-owo.github.io/INK-DesignLanguage/
- 纯静态，无需构建步骤；推送到 `main` 即发布。`.nojekyll` 已存在，避免 Jekyll 处理。
