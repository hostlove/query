# QV 面试练习室

<<<<<<< HEAD
QV 现在分为管理版和公开只读版。两者放在**同一个代码仓库**中，不需要维护两个仓库：
=======
根据当前 `query.md` 整理的个人面试题卡应用。初始包含 67 道完整问答，原答案和备考备注均保留。
>>>>>>> e8220040a3776e55417d05f3f8662bda8accb3ba

```text
QV/
├── admin/     仅供维护者在本机使用：新增、编辑、删除、导入、备份
└── public/    对外发布：只能查看题库和练习
```

公开版仍支持搜索、分类筛选、闪卡、60 秒计时、收藏、掌握度和个人笔记。访客产生的收藏、进度和笔记只写入他自己的浏览器，不会修改公开题库，也不会上传给维护者。

## 本机使用

在 QV 目录启动零依赖本地服务：

```powershell
cd QV
npm.cmd start
```

然后访问：

- 管理版：http://127.0.0.1:4173/admin/
- 只读版预览：http://127.0.0.1:4173/public/

服务只监听本机地址。按 `Ctrl+C` 停止。

建议固定使用这个地址打开管理版。浏览器按站点地址保存数据，直接双击 HTML 与使用 `127.0.0.1` 会形成两套独立的本地记录。

## 管理和发布题库

管理版可以新增、编辑、删除和导入题目，也可以下载完整 JSON 备份或 Markdown。页面中的修改先保存在管理者浏览器，不会自动写入 Git 仓库。

完成修改后，点击右上角的**“发布只读版”**。本地服务会：

1. 把管理版当前题库写入 `admin/data/cards.js`；
2. 重新生成 `public/data/cards.js`；
3. 同步公开版使用的公共样式、核心逻辑和图标。

按钮只在通过 `npm.cmd start` 打开的本机管理版中有效。它不会自动上传 GitHub。检查 http://127.0.0.1:4173/public/ 后，再提交并推送代码：

```powershell
git add admin/data/cards.js public
git commit -m "更新公开面试题库"
git push
```

也可以直接从项目外层的 `query.md` 重建初始题库：

```powershell
npm.cmd run sync
npm.cmd run build:public
```

指定其他 Markdown 文件时：

```powershell
node scripts/sync-data.cjs "D:/notes/my-questions.md"
npm.cmd run build:public
```

`build:public` 只读取 `admin/data/cards.js`，不会发布管理版中的个人学习记录。题目自带的“备考备注”属于题库内容，会出现在公开版；发布前请检查是否含有不宜公开的信息。

## 生成外部网页链接

项目已包含 GitHub Pages 自动发布配置。GitHub Actions 只会把 `QV/public/` 上传为网站，外部链接中不存在管理版入口。

当前 GitHub 仓库是 `hostlove/query`，发布成功后的固定外部地址是：

```text
https://hostlove.github.io/query/
```

### 第一次上线

1. 打开 [query 仓库的 Pages 设置](https://github.com/hostlove/query/settings/pages)。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 在本机项目根目录执行：

```powershell
cd F:\bpp\bin\vscodebin\python\intrduction

git add -A -- .github QV/.github QV/README.md
git commit -m "修正 QV GitHub Pages 发布配置"
git push origin main
```

4. 打开 [GitHub Actions](https://github.com/hostlove/query/actions)，等待 `Deploy QV public site` 任务变成绿色。
5. 访问 `https://hostlove.github.io/query/` 查看公开只读题库。

如果刚发布时页面暂时打不开，等待一两分钟后刷新。外部用户只能查看和练习，无法通过网页修改公开题库。

### 后续更新题库

先启动本机服务：

```powershell
cd F:\bpp\bin\vscodebin\python\intrduction\QV
npm.cmd start
```

然后按下面的顺序操作：

1. 打开管理版：`http://127.0.0.1:4173/admin/`。
2. 新增、编辑、删除或导入问题。
3. 点击管理版右上角的 **“发布只读版”**。
4. 打开 `http://127.0.0.1:4173/public/`，检查公开版的题目和页面显示。
5. 确认无误后，在项目根目录提交并推送：

```powershell
cd F:\bpp\bin\vscodebin\python\intrduction

git add QV/admin/data/cards.js QV/public
git commit -m "更新公开面试题库"
git push origin main
```

推送后，GitHub Actions 会自动重新部署。以后始终使用同一个外部链接：

```text
https://hostlove.github.io/query/
```

如果只修改了管理版但没有点击 **“发布只读版”**，`QV/public/` 不会更新，外部网站也不会发生变化。

即使仓库是公开的，其他人也没有你的仓库写权限。他们可以使用网站或复制代码，但不能修改你这个链接显示的题库。只有拥有仓库写权限的人推送后，GitHub Pages 才会更新。

## 管理版功能

- 闪卡练习、60 秒口述计时、顺序或随机练习；
- 收藏、待复习、掌握度、个人笔记和专注模式；
- 新增、编辑和删除问题；
- 导入 QV JSON 备份或问答 Markdown；
- 导出完整 JSON 备份或可读 Markdown；
- 将当前题库写入公开只读版。

管理版快捷键：`Space` 展开答案，`←` / `→` 切题，`S` 收藏，`1` / `2` / `3` 标记，`T` 计时，`/` 搜索，`N` 新增，`E` 编辑，`?` 打开帮助。

## 公开版的数据边界

公开版没有新增、编辑、删除、导入、备份和发布接口。题库始终从 `public/data/cards.js` 加载，浏览器存储中只保存：

- 收藏状态；
- 掌握度、练习次数和最近练习时间；
- 访客自己的个人笔记；
- 主题、专注模式和最后练习位置。

更换浏览器、使用无痕模式或清理网站数据后，这些个人记录可能消失。访客在开发者工具中做的本地改动也只影响自己的页面，刷新或换设备后不会改变发布站点。

## 项目结构

```text
QV/
├── admin/
│   ├── index.html            管理版页面与弹窗
│   ├── app.js                管理、导入导出、练习和发布交互
│   ├── core.js               解析、校验、筛选、去重和统计
│   ├── styles.css            两个版本共享的响应式样式
│   ├── data/
│   │   ├── cards.js          管理版初始题库
│   │   └── query.md          源文档快照
│   └── assets/favicon.svg
├── public/
│   ├── index.html            对外只读页面
│   ├── app.js                只读练习逻辑
│   ├── core.js               由构建脚本同步
│   ├── styles.css            由构建脚本同步
│   ├── data/cards.js         对外发布题库
│   └── assets/favicon.svg
├── scripts/
│   ├── sync-data.cjs         从 Markdown 生成管理版初始题库
│   └── build-public.cjs      生成可发布的 public 目录
├── tests/                    核心逻辑与浏览器端到端测试
├── serve.cjs                 本机管理与预览服务
└── package.json
```

GitHub Pages 工作流位于仓库根目录的 `.github/workflows/pages.yml`，负责发布这里的 `QV/public/`。

## 验证

运行核心测试：

```powershell
npm.cmd test
```

浏览器测试需要 Playwright 和 Chrome，可通过 `PLAYWRIGHT_MODULE`、`CHROME_PATH` 指定路径后运行 `npm.cmd run test:browser`。应用运行和部署本身不依赖 Playwright，也不需要 `npm install`。

交互设计参考：[AI 应用 / Agent 面经记忆卡](https://wzccwzzwcczw.github.io/ai-agent-flashcards/)。本项目独立实现界面和逻辑，题库来自项目中的问答文档。
