import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const babel = require('@babel/core');

const root = new URL('.', import.meta.url).pathname;

// 1. Compile JSX -> plain browser JS (no runtime Babel needed)
const src = readFileSync(root + 'src/app.jsx', 'utf8');
const { code } = babel.transformSync(src, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  compact: false,
});

// 2. Generate a static Tailwind stylesheet containing only the classes used
execSync('npx tailwindcss -c tailwind.config.js -i input.css -o build/tailwind.css --minify', {
  cwd: root, stdio: 'inherit',
});
const css = readFileSync(root + 'build/tailwind.css', 'utf8');

// 3. Vendor libraries (inlined from npm, so the page needs no network at all)
const react = readFileSync(root + 'node_modules/react/umd/react.production.min.js', 'utf8');
const reactDom = readFileSync(root + 'node_modules/react-dom/umd/react-dom.production.min.js', 'utf8');

// 4. Assemble the self-contained page
const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#09090b" />
  <title>BurnUp 减重比赛排行</title>
  <meta name="description" content="BurnUp FitCamp 减重比赛排行榜 — 记录学员体脂/体重等指标，按体脂下降比例排名。数据保存在本机浏览器。" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%94%A5%3C/text%3E%3C/svg%3E" />
  <style>
${css}
/* extras */
html,body{background:#09090b;}
input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7);}
*{-webkit-tap-highlight-color:transparent;}
::-webkit-scrollbar{width:8px;height:8px;}
::-webkit-scrollbar-thumb{background:#3f3f46;border-radius:4px;}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>${react}</script>
  <script>${reactDom}</script>
  <script>
${code}
  </script>
</body>
</html>
`;

mkdirSync(root + 'build', { recursive: true });
writeFileSync(root + 'index.html', html);
console.log('\\n✅ Wrote index.html (' + (html.length / 1024).toFixed(0) + ' KB, self-contained)');
