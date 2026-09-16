# 季亦飞 · 服饰 AIGC 数据标注求职作品集

一个纯静态、零外部依赖（无 CDN / 无外部字体）的求职作品集站点，用于应聘 **AI 训练师（大数据标注）/ 标注质检** 岗位。

线上地址：`https://<你的用户名>.github.io/<仓库名>/`

## 目录结构

```
.
├── index.html              唯一页面（语义化结构 + SEO / OG / JSON-LD）
├── 404.html                自定义 404 页
├── favicon.svg             站点图标（内联 SVG，无请求依赖）
├── robots.txt
├── .nojekyll               关闭 GitHub Pages 的 Jekyll 处理
└── assets
    ├── css/style.css       设计系统（CSS 变量 + 响应式 + 打印样式）
    ├── js/main.js          交互（原生 JS，无第三方库）
    └── img/
        ├── case-*.webp     WebP 主图（1024 / 640 两档）
        ├── case-*.jpg      JPEG 回退图（1024 / 640 两档）
        └── og-cover.png    社交平台分享封面（1200×630）
```

## 本地预览

任选一种方式，在项目根目录执行：

```bash
python -m http.server 8765      # 然后访问 http://127.0.0.1:8765
# 或
npx serve .
```

> 直接双击 `index.html` 也可以打开，但建议用本地服务器，便于验证图片与缓存行为。

## 部署到 GitHub Pages

1. 新建仓库（例如 `portfolio`），把本目录全部文件推送到 `main` 分支：

   ```bash
   git init && git add . && git commit -m "chore: portfolio site"
   git branch -M main
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

2. 仓库 **Settings → Pages**：Source 选 `Deploy from a branch`，Branch 选 `main` / `(root)`，保存。
3. 等待 1–2 分钟，访问 `https://<用户名>.github.io/<仓库名>/`。
4. 部署完成后，把 `index.html` 中 `__SITE_URL__` 占位符替换为真实地址（共 4 处：`og:image`、`og:url`、`canonical`、JSON-LD 的 `url`）。

> 绑定自定义域名：在仓库 Pages 设置里填写 Custom domain，并在域名服务商添加 CNAME 记录指向 `<用户名>.github.io`。

## 日常维护建议

| 想改什么 | 改哪里 |
| --- | --- |
| 联系方式、求职意向 | `index.html` 中 `#about`、`#contact` 两节 |
| 新增标注案例 | 复制 `#case` 中的 `.panel` 块 + 顶部 `.tab` 按钮，并递增 `id` / `aria-controls` |
| 关键点坐标 | 案例 2 的 `.kp` 元素 `style="--x:..%;--y:..%"`，以及下方坐标表 |
| 配色 / 圆角 / 间距 | `assets/css/style.css` 顶部 `:root` 变量 |
| 替换图片 | 覆盖 `assets/img/` 内同名文件（保持文件名与尺寸） |

## 技术要点

- **性能**：无外部依赖；图片 WebP 优先 + JPEG 回退，`srcset` 两档分辨率，`loading="lazy"`，显式 `width/height` 避免布局偏移。首屏关键请求仅 HTML + CSS。
- **SEO**：`title` / `description` / `keywords`、Open Graph、Twitter Card、`canonical`、JSON-LD `Person` 结构化数据、语义化标题层级。
- **无障碍**：跳转链接、`aria-*` 标签页与手风琴、键盘方向键切换、可见焦点环、`prefers-reduced-motion` 降级、图片 `alt` 描述。
- **响应式**：1160 / 1080 / 900 / 620 / 440 五档断点，小屏下关键点标签自动精简、表格横向滚动带阴影提示。
- **打印**：`@media print` 会自动展开全部折叠内容并隐藏交互控件，可直接「打印 → 另存为 PDF」交给 HR。

## 说明

站内数据为求职演示用的模拟示例，用于展现标注标准理解、质检流程与数据分析方法。
