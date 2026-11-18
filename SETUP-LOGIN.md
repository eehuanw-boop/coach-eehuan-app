# 学员 email 登入：设定指南（约 10 分钟）

设好之后：

- 学员用 email + 密码注册、登入。资料、餐单、训练课表存在云端，换手机也能看到，不用重新填写。
- 教练用自己的 email 登入，在任何设备都能看到全部学员，修改热量、餐单，设计训练课表。
- 学员只能看到自己的档案；每日热量、教练调整、训练课表只有教练能改。

没设之前，网页照常用「本机模式」，资料只存在这台设备的浏览器。

用的是 Google 的 **Firebase** 免费方案（Spark）：每天 5 万次读取、2 万次写入，几百位学员用不完。

---

## 第 1 步：建立 Firebase 项目

1. 用 Google 账号打开 <https://console.firebase.google.com>
2. 按 **建立项目 / Create a project**，名字填 `burnup-coaching`
3. Google Analytics 可以关掉，按 **建立项目**

## 第 2 步：开启 email 登入

1. 左边选 **Build → Authentication → 开始使用 / Get started**
2. **登入方式 / Sign-in method** → 选 **电子邮件/密码 / Email/Password** → 打开第一个开关 → **储存**
3. 同一页上方 **设定 / Settings → 授权网域 / Authorized domains → 新增网域**，填：
   `eehuanw-boop.github.io`

## 第 3 步：建立资料库

1. 左边选 **Build → Firestore Database → 建立资料库 / Create database**
2. 位置选 **asia-southeast1 (Singapore)**，离马来西亚最近
3. 选 **正式版模式 / Production mode** → 建立

## 第 4 步：贴上安全规则

1. Firestore Database → **规则 / Rules**
2. 打开这个 repo 里的 `firestore.rules`，把 `coach@example.com` 换成**你的教练 email**（全部小写）
3. 整份贴进去，按 **发布 / Publish**

## 第 5 步：拿网页设定（web config）

1. 左上角齿轮 → **项目设定 / Project settings**
2. 往下到 **你的应用程式 / Your apps** → 按 **`</>`（Web）**
3. 应用程式名称填 `burnup-web`（不用勾 Hosting）→ **注册**
4. 会出现一段 `const firebaseConfig = { apiKey: "...", authDomain: "...", ... }`，整段复制

## 第 6 步：交给我（或自己贴）

把这两样发给我，我帮你放进网页、测试、推送：

- 第 5 步复制的 `firebaseConfig`
- 你的教练 email

这段 config 本来就是公开的（每个用 Firebase 的网站都看得到），安全靠第 4 步的规则保护，不用担心。

想自己改的话：打开 `coaching.html`，在 `<script>` 最上面找到这两行：

```js
const FIREBASE_CONFIG = null;
const COACH_EMAILS = [];
```

改成：

```js
const FIREBASE_CONFIG = {apiKey:"…", authDomain:"burnup-coaching.firebaseapp.com", projectId:"burnup-coaching", appId:"…"};
const COACH_EMAILS = ["你的教练email@gmail.com"];
```

## 第 7 步：教练第一次登入

1. 打开网页 → **Coach sign in / 教练登入** → **注册账号**，用你的教练 email
2. 去邮箱点开验证链接（没收到的话看垃圾邮件）
3. 回网页按 **我已验证**，就会进入学员档案

---

## 常见问题

- **学员忘记密码：** 登入页按「忘记密码？」，会收到重设邮件。
- **学员看不到训练课表：** 教练还没帮他设计。到教练后台打开学员 → 训练 → 套用模板或自己填。
- **出现「没有云端资料的权限」：** 第 4 步的规则没发布，或规则里的教练 email 和网页里的不一样。
- **本机模式的旧档案怎么搬：** 在本机模式的教练后台先按「备份全部」，开好云端后用教练账号登入 → 「导入备份」。
- **学员之前在本机试用过：** 第一次注册时，本机的资料会自动带进他的云端账号。
