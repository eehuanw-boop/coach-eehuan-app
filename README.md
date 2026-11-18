# BurnUp 减重比赛排行 · 独立网页版

> 🆕 **`coaching.html` — BurnUp × Herbalife 学员教练页**：Meal Plan（TDEE → 每日热量 → 自动配一日餐单）+ Fitness（目标 × 每周天数 → 课表）。纯 HTML/JS 单文件，无需构建，直接打开即可。部署后网址：`<你的 Pages 网址>/coaching.html`。


BurnUp FitCamp 的减重比赛排行榜 —— 记录学员的体重、体脂率、内脏脂肪、肌肉量、基础代谢、代谢年龄、身体水分等指标，按 **体脂下降比例** 自动排名。

原本是 Claude Artifact（依赖 `window.storage` 沙盒环境），现已改造为 **完全独立、可离线运行的单一网页**。

## 直接使用

打开 **`index.html`** 即可，无需安装、无需联网、无需服务器：

- 双击 `index.html` 用浏览器打开；或
- 传到手机后用浏览器打开（可「加入主屏幕」当作 App 用）；或
- 放到任意静态托管（GitHub Pages、Netlify…）分享链接。

`index.html` 已把 React、样式、图标、图表全部内联进去，**没有任何外部依赖 / CDN**，断网也能正常运行。

## 功能

- 🏆 **排行榜**：前三名领奖台 + 完整排名，按体脂下降比例排序
- 👤 **学员管理**：新增学员（含基线数据）、查看详情、删除
- 📈 **趋势图**：体脂率与体重随时间变化（纯 SVG，支持触摸/鼠标查看数值）
- 📊 **全指标对比**：基线 → 最新，自动标注进步（绿）/ 退步（红）
- 📝 **测量记录**：基线 + 每次更新，可单独删除
- 💾 **本地保存**：数据存在浏览器 `localStorage`（仅本机）
- ⬆️⬇️ **导入 / 导出**：JSON 备份，方便换设备或防止清除浏览器数据丢失

> 数据保存在当前浏览器本地。换手机、换浏览器或清除浏览器数据会丢失，请定期用右上角 **导出** 备份，在新设备用 **导入** 恢复。

## 修改与重新构建（可选）

页面逻辑在 `src/app.jsx`（React + JSX）。改完后重新生成 `index.html`：

```bash
npm install
npm run build
```

`build.mjs` 会：把 JSX 编译成浏览器可直接运行的 JS、用 Tailwind 生成仅含所用类的静态样式、并把 React 一起内联进单个 `index.html`。

### 相比原始 Artifact 的改动

| 原始 (Artifact) | 独立版 |
| --- | --- |
| `window.storage`（沙盒） | 浏览器 `localStorage` + JSON 导入/导出 |
| `lucide-react` 图标库 | 内联 SVG 图标 |
| `recharts` 图表库 | 内联轻量 SVG 趋势图 |
| 打包器 `import` React 等 | 构建时内联，运行时零 CDN |
