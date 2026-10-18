# VIBECODING.md · 把 INK 搬到新项目

给「拿 INK 做别的项目」这一步用。读这份文件的人或 agent 已经看过 INK，缺三样东西：搬哪些文件、开工时说什么、没有工具链时怎么验收。

边界：

- 为什么这样设计：`DESIGN.md`
- 这个仓库怎么实现、怎么发布：`AGENTS.md`
- 搬到新项目怎么开工：本文
- 给模型的入口索引：`llms.txt`
- 本文不新增规则。规则冲突时以 `DESIGN.md` 为准。

当前版本：v1.1.3（2026-10-18，`tokens.css` 85 条变量）。线上：<https://knink-owo.github.io/INK-DesignLanguage/>

---

## 1. 开工前读什么

按顺序读四份，读完再动手：

1. `DESIGN.md` 第 1、2、4、6、8、9 节。这几节决定颜色、字号、间距、文案和页面骨架。
2. `tokens.css`。要用的每个数值都必须在这里有名字。
3. `assets/site.css`。只准用里面已经定义的 class（约 202 条）。
4. `spec/color.html`。章节页骨架照它抄，区块顺序不要自己发明。

程序读数值时加一份 `tokens.json`，它由 `tokens.css` 生成。

---

## 2. 三种开工方式

### 2.1 拷进项目（推荐）

一次拷贝，之后不依赖网络。任何 agent 或编辑器都能读。

```powershell
$ink = 'D:\Projects\INK-DesignLanguage\site'
New-Item -ItemType Directory -Force design\assets | Out-Null
Copy-Item "$ink\DESIGN.md","$ink\tokens.css","$ink\tokens.json" design\
Copy-Item "$ink\assets\site.css","$ink\assets\site.js" design\assets\
```

再在新项目根目录的 `AGENTS.md`（Claude Code 用 `CLAUDE.md`，Cursor 用 `.cursorrules`）写三行：

```md
## 设计规范
UI 遵循 INK 设计语言，规范在 design/。开工先读 design/DESIGN.md。
颜色、字号、间距、动效只用 design/tokens.css 的 --ink-*；class 只用 design/assets/site.css 里已有的，不新增设计语言。
```

**不要整份拷本仓库的 `AGENTS.md`。** 它写的是 `site/` 路径和 `tools/` 验收命令，换到新项目后全部落空，agent 会照着跑失败。新项目需要自己的三行约束和 §5 的替代验收。

### 2.2 只发链接（不落盘）

省事，依赖对方能抓网页。五个地址给全，少一个就会漂移：

```text
https://knink-owo.github.io/INK-DesignLanguage/AGENTS.md
https://knink-owo.github.io/INK-DesignLanguage/DESIGN.md
https://knink-owo.github.io/INK-DesignLanguage/tokens.css
https://knink-owo.github.io/INK-DesignLanguage/assets/site.css
https://knink-owo.github.io/INK-DesignLanguage/spec/color.html
```

只发首页链接不够：agent 通常只读传进去的那一个 URL，不会去点页脚的文件链接。

### 2.3 固定版本（长期项目）

线上一直是最新版。要可复现，用带 commit 的地址：

```text
https://raw.githubusercontent.com/knink-owo/INK-DesignLanguage/<commit>/AGENTS.md
```

当前发布 HEAD：`c0b826267c5bcb45c829cf3b194f7d17ba499d40`。

---

## 3. 开工提示词

复制下面整段，把第一行换成项目描述：

```text
用 INK 设计语言做【项目描述】。

动手前按顺序读这五个地址，读完再写代码；读不到就停下告诉我，不要凭印象设计：
1. https://knink-owo.github.io/INK-DesignLanguage/AGENTS.md
2. https://knink-owo.github.io/INK-DesignLanguage/DESIGN.md
3. https://knink-owo.github.io/INK-DesignLanguage/tokens.css
4. https://knink-owo.github.io/INK-DesignLanguage/assets/site.css
5. https://knink-owo.github.io/INK-DesignLanguage/spec/color.html

硬约束：零依赖，不用框架、CDN、外链字体、图标库；颜色、字号、间距、动效只用 var(--ink-*)；
class 只用 site.css 里已有的；圆角 0，描边 1px，阴影只给浮层；一屏一块色场，色场里只放深墨字；
每页唯一 h1；跳转链接、焦点环、44px 触控、减少动效降级不许缺；不做暗色模式、多语言、渐变、玻璃拟态。
文案：动词开头、给数字、一句一事；禁止破折号、「让……」句式、对仗格言、空泛形容词、感叹号。
交付前自检：无裸 hex、无 <style>、无外链资源、375/768/1440 无横向滚动、文案规则逐条对过。
```

---

## 4. 移植时改什么

| 文件 | 新项目里怎么处理 |
| --- | --- |
| `tokens.css` | 原样放入 `design/`。只改数值，不加变量；新增色相、圆角、阴影都属于新增设计语言。改完同步 `tokens.json`。 |
| `tokens.json` | 程序读（Tailwind 主题、设计工具、文档生成）。从 `tokens.css` 生成，不手改。 |
| `assets/site.css` | 原样放入 `design/assets/`。缺 class 时先加在 `design/assets/site.css`，并在提交说明里写一行理由。 |
| `DESIGN.md` | 原样放入。改规则先改它，再改代码。 |
| `spec/color.html` | 当页面模板抄结构。删掉五章导航，换成项目自己的导航。 |
| 本仓库的 `AGENTS.md` | 不拷。新项目写 §2.1 那三行。 |
| `tools/` | 不拷。要门禁就用 §5 的替代检查。 |

---

## 5. 新项目的验收

新项目没有 `tools/check_site.py` 和 `tools/audit.js`，用下面七条替代，全部能在本地跑。

```bash
# 1) 裸色值应为 0（design/tokens.css 除外）
grep -rIn -E '#[0-9a-fA-F]{3,8}\b|\brgba?\(' --include='*.html' --include='*.css' . | grep -v 'design/tokens.css'
# 2) 外链资源应为 0（canonical、文档链接不算）
grep -rIn -E '<(script|link|img)[^>]+(src|href)="https?://' --include='*.html' .
# 3) 内联样式块应为 0
grep -rIn '<style' --include='*.html' .
# 4) 每页一个 h1
grep -rc '<h1' --include='*.html' .
# 5) 破折号应为 0
grep -rIn '—' --include='*.html' .
```

浏览器里再查两条：

6. 375、768、1440 三档宽度：`document.documentElement.scrollWidth === window.innerWidth`。
7. 键盘 Tab 一圈：焦点环可见；跳转链接排第一；按钮和链接最小 44px；`prefers-reduced-motion: reduce` 下动画时长为 0。

---

## 6. 四类常见错误

| 现象 | 原因 | 修法 |
| --- | --- | --- |
| 颜色对了，间距、组件、焦点态全错 | 凭记忆设计，没读 `site.css` | 先读 `tokens.css` 与 `site.css`，只写已存在的 class |
| agent 找不到 `site/` 和 `tools/`，开始自由发挥 | 原样拷了本仓库的 `AGENTS.md` | 新项目写三行指向 `design/`，验收换成 §5 |
| `tokens.css` 改了，`tokens.json` 没跟上 | 两个数值源不同步 | 跑 `python tools/sync_tokens.py`，或在原仓库生成后拷入 |
| 越做越像作品集：圆角、阴影、渐变、暗色模式 | 想加装饰补空白 | 删掉装饰，先删内容，再用字号和留白分层 |

---

## 7. 项目做完

- 把 `design/` 留在项目仓库里，下一个 agent 照着改。
- 记录用的是哪个版本或哪个 commit，方便回查。
- 项目里改出的新规则，回 INK 仓库提，不要各项目各一套。
