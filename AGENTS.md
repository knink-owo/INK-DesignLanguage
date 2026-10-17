# AGENTS.md · INK 页面实现规则

给照着 INK 写页面的 Agent 看。人读的「为什么」在 `DESIGN.md`，数值只改 `tokens.css`，机器可读副本是 `tokens.json`。

开工顺序：

1. 读 `DESIGN.md` 的第 1、2、4、6、8、9 节。
2. 打开 `tokens.css`，确认要用的变量都存在。
3. 打开 `assets/site.css`，只用里面已经定义的 class。
4. 需要完整样例时，读 `spec/color.html`（章节页模板）和 `index.html`（首页模板）。

---

## 1. 硬约束

1. **零依赖。** 没有框架、构建、CDN、外链字体、图标库。页面只引 `tokens.css`、`assets/site.css`、`assets/site.js`、`assets/favicon.svg`。
2. **只用 token。** 颜色、字号、间距、时长都写 `var(--ink-*)`。不在页面里写 `#hex`、`rgb()`、裸 px 间距。
3. **不新增设计语言。** 不加色相、不加圆角、不加渐变、不加玻璃拟态。字体只用系统栈：正文栈、展示栈（首屏专用）、等宽栈，不外链字体文件。
4. **一屏一块色场。** 色场里只放 `--ink-text-on-color`。反白只放在 `--ink-ink-deep` 底上。
5. **文案按 DESIGN.md 第 8 节。** 动词开头，给数字，一句一事。禁止破折号，禁止「不是……而是……」，禁止「让……」句式。
6. **可访问性不回退。** skip link、`:focus-visible`、`aria-current`、44px 触控、`prefers-reduced-motion` 降级，一个都不能少。
7. **每页唯一 h1，标题不跳级。** 图片必须有 alt（本项目页面内不放图片）。
8. **顶栏只有品牌和五章导航。** 右对齐，不加入口按钮。
9. **每页照样板结构写。** 章节页照 `spec/color.html` 抄，不自己发明区块顺序。
10. **改完过第 7 节验收清单。**

---

## 2. 文件地图

| 路径 | 作用 |
|---|---|
| `site/index.html` | 首页：首屏、五章目录、三条原则、浮层示例 |
| `site/spec/color.html` | 第 01 章 色彩（章节页模板） |
| `site/spec/typography.html` | 第 02 章 文字 |
| `site/spec/space.html` | 第 03 章 空间 |
| `site/spec/components.html` | 第 04 章 组件 |
| `site/spec/voice-motion.html` | 第 05 章 文案与动效 |
| `site/tokens.css` | 唯一数值源 |
| `site/tokens.json` | tokens.css 的机器副本，由 `tools/sync_tokens.py` 生成，不手改 |
| `site/assets/site.css` | 全站样式，页面不写 `<style>` |
| `site/assets/site.js` | 浮层展开收起、复制按钮 |
| `site/assets/favicon.svg` | 站点图标 |
| `site/assets/og.png` | 分享图（不进页面） |
| `site/DESIGN.md` | 为什么 |
| `site/AGENTS.md` | 怎么做与验收（本文件） |
| `site/README.md` | 站点说明（公开） |
| `site/llms.txt` | 给模型的入口清单 |

相对路径：根页用 `tokens.css`、`assets/…`、`spec/…`；`spec/` 下的页面用 `../tokens.css`、`../assets/…`、`../index.html`，同目录章节直接写文件名。

---

## 3. 章节页骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>色彩 · INK 设计语言</title>
<meta name="description" content="一句话说清本章内容。">
<meta name="theme-color" content="#FAF9F5">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../tokens.css">
<link rel="stylesheet" href="../assets/site.css">
<link rel="canonical" href="https://knink-owo.github.io/INK-DesignLanguage/spec/color.html">
</head>
<body>
<a class="skip-link" href="#main">跳到正文</a>

<header class="site-header">
  <div class="wrap">
    <div class="site-header__inner">
      <a class="brand" href="../index.html">INK<span class="brand__sub">设计语言</span></a>
      <nav class="site-nav" aria-label="章节">
        <a class="site-nav__link" href="color.html" aria-current="page">色彩</a>
        <a class="site-nav__link" href="typography.html">文字</a>
        <a class="site-nav__link" href="space.html">空间</a>
        <a class="site-nav__link" href="components.html">组件</a>
        <a class="site-nav__link" href="voice-motion.html">文案与动效</a>
      </nav>
    </div>
  </div>
</header>

<main id="main">
  <section class="chapter-hero tone-lake">
    <div class="wrap">
      <div class="chapter-hero__inner">
        <span class="mono-label chapter-hero__index">01 / 色彩</span>
        <h1 class="chapter-hero__title">八个色场</h1>
        <p class="chapter-hero__lede">一章一句导语，说清本章解决什么问题。</p>
        <p class="chapter-hero__meta">关键数值 / 一行等宽</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <span class="mono-label section-head__index">01 / 主题</span>
        <h2 class="section-head__title">一节一句话标题</h2>
        <p class="section-head__lede">一句导语，给具体信息。</p>
      </div>
      <!-- 内容：compare / rule-row / spec-table / code-block / 色墙 -->
    </div>
  </section>

  <div class="wrap">
    <nav class="pager" aria-label="章节翻页">
      <a class="pager__link" href="typography.html">
        <span class="pager__dir">上一章</span>
        <span class="pager__title">← 文字</span>
      </a>
      <a class="pager__link pager__link--next" href="space.html">
        <span class="pager__dir">下一章</span>
        <span class="pager__title">空间 →</span>
      </a>
    </nav>
  </div>
</main>

<footer class="site-footer"><!-- 照 index.html 或 color.html --></footer>
<script src="../assets/site.js" defer></script>
</body>
</html>
```

章节与色场对应：色彩 `tone-lake`、文字 `tone-lotus`、空间 `tone-moss`、组件 `tone-stone`、文案与动效 `tone-clay`。

---

## 4. 可用结构

- **页面宽度：** `.wrap`。
- **章节首屏：** `.chapter-hero` 加 `.tone-*`，内部 `.chapter-hero__inner`、`__index`、`__title`、`__lede`、`__meta`。
- **内容节：** `.section`，首屏之后自动去掉上边线。节头 `.section-head`（`__index` 等宽序号、`__title` h2、`__lede` 导语）。
- **对照：** `.compare` 加两列 `.compare__col`，列内 `__title`（含 `.mark--yes` / `.mark--no`）、`__example`、`__note`。
- **规则行：** `.rule-row`，列内 `.mono-label`、`.rule-row__title`（h3）、`.rule-row__text`。
- **表格：** `.table-wrap` 包 `.spec-table`，必须有 caption；窄屏横向滚动。
- **代码块：** `.code-block` 包 `__head`（等宽标签加 `.copy-btn`）和 `pre.code-block__body`（带 id）。复制按钮写 `<button class="copy-btn" type="button" data-copy-target="#id"><span data-copy-label>复制</span></button>`。
- **色场墙：** `.field-wall` 加 8 个 `.field.tone-*`，内部 `.field__name`、`.field__hex`。
- **中性色列表：** `.neutral-list` 加 `.neutral-row`。swatch 用内联 `style="background: var(--ink-…)"`，其余列是 `__name`、`__hex`、`__role`。
- **字号阶梯：** `.type-list` 加 `.type-row`（`__name`、`__spec`、`__sample`），样本加 `.sample--display/h1/h2/h3/lead/body/small/label`。
- **间距阶梯：** `.scale-list` 加 `.scale-row`（`__name`、`__value`、`__bar`）。
- **网格演示：** `.grid-demo`、`.grid-demo__cell`、`--span-4`、`--lake/--lotus/--moss`。
- **按钮：** `.btn`，加 `.btn--primary`（实心）、`.btn--field`（湖蓝）、`.btn--quiet`（文字）。一行用 `.btn-row`。
- **输入：** `.form-field` 包 `.form-field__label`、`.input`、`.form-field__hint`、`.form-field__error`。错误态给 input 加 `aria-invalid="true"` 和 `aria-describedby`。
- **链接块：** `.tile-grid` 包 `a.tile`（`__label`、`__title`、`__arrow`）。
- **标签：** `.tag-row` 包 `.chip`（状态）、`.tag`（分类）。
- **提示：** `.note`。
- **翻页：** `.pager` 加 `.pager__link`（`--next`），内部 `__dir`、`__title`。
- **浮层：** `<dialog class="sheet" id="…">` 加 `.sheet__inner/__head/__title/__close/__body/__steps/__step/__step-num/__step-title/__step-text/__actions`。触发写 `data-sheet-open="id"`，关闭写 `data-sheet-close`。
- **页脚：** `.site-footer` 四列加 `.site-footer__bottom`，示例触发按钮用 `.link-button`。
- **轮廓字：** 首屏两行都用展示字体（`--ink-font-display`，等线 Bold）。第一行 `.display__line` 实心，靠 `-webkit-text-stroke: var(--ink-stroke-solid)` 加粗；第二行 `.display__outline` 是整字空心，靠 `index.html` 顶部的 SVG 滤镜（`#ink-outline` / `-md` / `-sm`）先合并字形再取外轮廓环。半径只在 SVG `defs` 与 `site.css` 的两个断点里写，不要分散到页面。不支持 URL 滤镜时自动退回描边。
- **目录行：** `.chapter-index` 加 `a.chapter-row`（`--lake` 等八种色），内部 `__num`、`__title`、`__lede`、`__arrow`。悬停时整行填色。

新增 class 之前先看 `site.css` 有没有现成的；没有就用现成组合表达，并在提交说明里写清楚。页面里不写 `<style>`。

---

## 5. 文案

- 标题和正文用实词和动词，给数字。例：「八个色场」「先把一句排好」「留白按刻度走」。
- 禁止破折号、对仗格言、「让……」句式、空泛形容词、感叹号。
- 每节导语一句话，不超过 40 个汉字。
- 「推荐 / 避免」成对出现，用 `.mark--yes` / `.mark--no` 标记。

---

## 6. 常见错误

1. 色场铺满整页，或一屏出现两块色场。
2. 给色场加白字，或给按钮加圆角。
3. 页面里写 `style="background:#87B9CE"`，应该写 `var(--ink-sky)`。
4. 间距写 13px、18px、36px。
5. 用 `<div>` 当按钮，或漏掉 `aria-current`、`aria-labelledby`。
6. 复制旧版文案，例如「给 Agent」入口、首屏双入口 CTA。
7. 在首屏塞版本号、装饰性数字、滚动提示。
8. 新增 `<style>` 或外链资源。
9. 直接改 `tokens.json`，或改完 `tokens.css` 忘记跑同步脚本。

---

## 7. 验收清单

改完页面、发布之前逐项打勾：

1. `python tools/check_site.py`：`pages: 6`，每页 h1 = 1，errors 为 0。
2. `python tools/sync_tokens.py --check`：`tokens.json` 与 `tokens.css` 一致。
3. `python tools/check_site.py --strict` 通过：裸色值、裸间距、未知 class、缺失资源全部为 0。
4. `node tools/audit.js`：`artifacts/screenshots/local-latest/report.json` 里 `errors` 为空，截图 17 张以上，`console` 为空。
5. 浮层：打开后焦点在面板内，Esc、点遮罩、点关闭三条路都能关，关闭后焦点回到触发按钮。
6. `prefers-reduced-motion: reduce` 下 `--ink-duration-expand` 为 `0ms`，`.rise` 无动画。
7. 375 / 768 / 1440 三档宽度：无横向滚动，导航不换行。
8. 首屏高度约等于视口高减 64px，色墙贴底（±2px）。
9. 页面无外部资源：`grep -R "https\?://" site/*.html site/spec/*.html` 只剩 canonical、og、GitHub 源码链接。
10. `node --check tools/*.js` 通过；`tokens.json` 能 `JSON.parse`。
11. 发布后打开线上地址，再跑一次 `node tools/audit.js --url https://knink-owo.github.io/INK-DesignLanguage/`。

---

## 8. 本地预览与发布

```bash
python -m http.server 8802 --directory site      # 本地预览
python tools/check_site.py                        # 静态检查
python tools/sync_tokens.py --check               # token 平价
node tools/audit.js                               # 浏览器审计与截图
gh auth status                                    # 确认 gh 已登录
node tools/deploy.js                              # 发布到 GitHub Pages
```

发布规则：

- 发布源是 GitHub 仓库 `knink-owo/INK-DesignLanguage` 的 `main` 分支根目录，内容就是 `site/` 的复制。
- 本机 `git remote` 不可用，`deploy.js` 通过 GitHub REST API 逐文件提交，然后轮询 Pages 构建。
- 不强制覆盖、不跳过构建检查。构建失败就停下来修，不重复上传。
- 本地预览端口只记 8802。旧文档里的 8642 是错的。
