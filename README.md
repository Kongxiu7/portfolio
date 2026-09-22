# 季亦飞 · AIGC 电商视觉设计求职作品集

一个纯静态、零外部依赖（无 CDN / 无外链字体 / 无第三方库）的求职作品集站点，用于应聘 **AIGC 电商视觉设计 / AI 美工** 岗位。

**线上地址：<https://kongxiu7.github.io/portfolio/>**

---

## 站点定位

主叙事是 **AIGC 电商视觉设计**：用 AI 出图、用 Photoshop 收口，把商品素材做到能直接上架。

同时保留了一套 **服饰数据标注 / AIGC 质量评估** 的能力展示，作为差异化佐证 —— 它回答的是「我为什么知道一张图会被判不合格」，因此出图返工率更低。

---

## 内容结构

| 区块 | 锚点 | 说明 |
| --- | --- | --- |
| 首屏 | `#top` | 岗位定位、能力关键词、作品集数据速览 |
| **AIGC 电商视觉** | `#aigc` | 5 个案例：白底主图 / 多色 SKU / 详情页排版 / 精修对比 / 流程沉淀 |
| 关于我 | `#about` | 定位陈述与求职意向 |
| 能力模型 | `#ability` | 岗位能力拆解 |
| 标注标准 | `#standard` | 服饰标注标准理解 |
| 标注案例 | `#case` | 3 个可切换的标注案例 |
| 对错判断 | `#quiz` | 标注对错判断案例（折叠交互） |
| 质检流程 | `#flow` | 质检 SOP |
| 数据分析 | `#data` | 数据分析能力展示 |
| 培训能力 | `#training` | 培训能力展示 |
| 联系我 | `#contact` | 联系方式 |

---

## 目录结构

```
.
├── index.html              唯一页面（语义化结构 + SEO / OG / JSON-LD）
├── 404.html                自定义 404 页
├── favicon.svg             站点图标（内联 SVG，无请求依赖）
├── robots.txt
├── sitemap.xml
├── .nojekyll               关闭 GitHub Pages 的 Jekyll 处理
├── README.md
└── assets
    ├── css/style.css       设计系统（CSS 变量 + 响应式 + 打印样式）
    ├── js/main.js          交互（原生 JS，无第三方库）
    └── img
        ├── aigc/           AIGC 电商视觉成品图（1000 宽原图 + 640 宽派生图）
        └── case-*.{jpg,webp}  标注案例用图（WebP + JPEG 回退）
```

> **关于 AIGC 图片的两个档位**：`xxx.jpg` 为原始导出规格（1000px），`xxx-640.jpg` 为响应式派生档，通过 `srcset` 让浏览器按需选择。本机没有可用的 WebP 编码器（无 Pillow、无 libwebp，GDI+ 也不支持 WebP），因此该板块采用 JPEG 两档 + `srcset`，而不是挂一个指向不存在文件的 `type="image/webp"`。

---

## 图片是怎么产出的

`assets/img/aigc/` 下的成品图由 `tools/build-aigc.ps1` 生成，链路为：

1. **白底规格化**：等比缩放 + 8% 安全留白 → 1000×1000，底色压到 `#FFFFFF`
2. **多色 SKU**：只对 色相 / 明度 / 饱和度 三通道做映射，保留褶皱、投影、缝线等明暗结构；同时用「中性亮像素保护」避免背景被一起染色
3. **精修**：白平衡（灰世界）→ 黑白场拉伸 → S 形对比 → 自然饱和度 → **背景净化收尾**
4. **排版**：详情页长图按信息层级竖排拼合
5. **派生**：批量输出 640 宽响应式档

> ⚠️ **重要说明**：这些成品图是**基于真实商品图的图像工程产出**（抠像 / 换色 / 合成 / 调色 / 排版 / 规格化），**不是** AI 文生图的原始输出。面试口径请与 `job-search/面试问题库-AIGC电商视觉设计.md` 中「这些图是你用 AI 生成的吗」一节保持一致 —— 不虚报。
>
> 如果你后续用即梦 / Midjourney 等工具产出了 AI 原始出图，把图放进 `assets/img/aigc/` 并在 `index.html` 的 `#aigc` 区块补充对应案例即可（可参考现有 `<figure class="shot">` 结构）。

---

## 本地预览

```bash
python -m http.server 8765      # 然后访问 http://127.0.0.1:8765
# 或
npx serve .
```

> 直接双击 `index.html` 也能打开（图片为相对路径）。
> 完全离线场景请用 `dist/季亦飞-作品集-单文件版.html`。

---

## 部署到 GitHub Pages

**本仓库已部署完成**，`main` 分支更新后 GitHub Pages 会自动重新构建（约 1 分钟）。

若需重新部署或在其他账号下部署，把本目录全部文件推送到 `main` 分支，然后在仓库 **Settings → Pages** 选择 `Deploy from a branch` → `main` / `(root)`。

### 本机可用的部署方式（无 git 环境）

本机没有安装 git，因此 `tools/deploy.ps1` 通过 **GitHub Contents / Trees API** 直接提交文件树：

```powershell
pwsh -File tools/deploy.ps1
```

它会自动：替换 `index.html` 中 4 处 `__SITE_URL__` 占位符 → 生成 `sitemap.xml` → 与远端逐文件比对 sha → 只上传有变化的文件 → 建 tree / commit / 更新 `main`。

---

## 日常维护建议

| 想改什么 | 改哪里 |
| --- | --- |
| 首屏文案、能力关键词、数据速览 | `index.html` 中 `.hero` 区块 |
| AIGC 案例内容 | `index.html` 中 `#aigc` 区块（5 个 `<article>`） |
| 多色 SKU 色号 | `tools/build-aigc.ps1` 中 `$sku` / `$coats` 数组 |
| 换色参数（色相 / 明度 / 饱和） | 同上，数组里每项的 `hue / sm / sa / lm / lp` |
| 精修强度 | `tools/build-aigc.ps1` 里 `Retouch` 的调用参数 |
| 联系方式、求职意向 | `index.html` 中 `#about`、`#contact` 两节 |
| 配色 / 圆角 / 间距 | `assets/css/style.css` 顶部 `:root` 变量 |
| AIGC 板块样式 | `assets/css/style.css` 第 18 节（`.shot` / `.cw` / `.cmp`） |

### 改完务必跑一遍自检

```powershell
pwsh -File tools/qa.ps1        # 24 项检查：结构 / 锚点 / 图片存在性 / SEO / 体积
pwsh -File tools/build-single.ps1   # 重新生成离线单文件版
```

---

## 技术要点

- **性能**：无外部依赖；AIGC 图片走 `srcset` 两档 + 懒加载；首图不做懒加载（在首屏，避免拖慢 LCP）；显式 `width/height` 防布局抖动。
- **SEO**：`title` / `description` / `keywords`、Open Graph、Twitter Card、`canonical`、`sitemap.xml`、JSON-LD `Person` 结构化数据、语义化标题层级。
- **无障碍**：跳转链接、`aria-*` 标签页与手风琴、键盘方向键切换、可见焦点环、`prefers-reduced-motion` 降级、图片 `alt` 描述。
- **响应式**：1160 / 1080 / 900 / 620 / 440 五档断点；色卡栅格 5 → 3 → 2 列自适应。
- **打印**：`@media print` 自动展开全部折叠内容并隐藏交互控件，可直接「打印 → 另存为 PDF」。

### 一个已修复的渲染坑（值得记住）

`.cw__item img` 最初只写了 `width:100%` + `aspect-ratio:1/1`，结果色卡被渲染成 **139×1024 的窄高条**，商品缩在正中间一小块。

原因：`<img>` 带了 `width="1024" height="1024"` 属性（用于防布局抖动），**Chromium 会据此推导图片盒高度**，再叠加全局 `img{max-width:100%}` 把宽度压到 139px。

修复：**必须显式写 `height: auto`**。同理 `.shot img` 因为本来就写了 `height:auto` 所以一直正常 —— 这也正是定位问题的关键线索。

---

## 说明

标注相关的数据与案例为求职演示用的模拟示例，用于展现标注标准理解、质检流程与数据分析方法。AIGC 板块的成品图均基于真实商品图产出，过程可复现。
