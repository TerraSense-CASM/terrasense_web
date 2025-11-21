# 🚀 GitHub Pages 部署完整指南

本指南将帮助你一步一步将 TerraSense 项目部署到 GitHub Pages，实现和本地 `http://localhost:3000/#showcase` 一样的效果。

## ✅ 已完成的配置

我已经为你配置好了：
- ✅ `vite.config.ts` - 设置了 base 路径为 `/terrasense/`
- ✅ `package.json` - 添加了 homepage 和 deploy 脚本
- ✅ 安装了 `gh-pages` 依赖

## 📋 部署步骤

### 步骤 1: 确认 GitHub 仓库

你的仓库信息：
- **用户名**: `QinghuaZhang1`
- **仓库名**: `terrasense`
- **GitHub Pages URL**: `https://QinghuaZhang1.github.io/terrasense`

### 步骤 2: 提交配置更改

```bash
# 1. 查看更改的文件
git status

# 2. 添加更改的文件
git add vite.config.ts package.json package-lock.json

# 3. 提交更改
git commit -m "Configure GitHub Pages deployment"
```

### 步骤 3: 解决网络连接问题（如果需要）

如果遇到代理问题，可以尝试：

**方法 A: 配置 Git 代理（如果使用代理）**
```bash
# 设置代理（替换为你的代理地址和端口）
git config --global http.proxy http://127.0.0.1:1080
git config --global https.proxy http://127.0.0.1:1080

# 或者取消代理设置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**方法 B: 使用 SSH 连接（推荐）**
```bash
# 1. 检查是否已有 SSH key
ls ~/.ssh

# 2. 如果没有，生成 SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. 将公钥添加到 GitHub
# 复制 ~/.ssh/id_ed25519.pub 的内容
# 在 GitHub: Settings > SSH and GPG keys > New SSH key

# 4. 更改远程仓库地址为 SSH
git remote set-url origin git@github.com:QinghuaZhang1/terrasense.git
```

### 步骤 4: 推送到 GitHub

```bash
# 推送到 GitHub
git push -u origin main
```

如果遇到问题，可以尝试：
```bash
# 强制推送（谨慎使用）
git push -u origin main --force
```

### 步骤 5: 构建并部署到 GitHub Pages

```bash
# 运行部署命令
npm run deploy
```

这个命令会：
1. 构建生产版本（`npm run build`）
2. 将 `dist` 目录部署到 `gh-pages` 分支

### 步骤 6: 启用 GitHub Pages

1. 访问你的 GitHub 仓库：`https://github.com/QinghuaZhang1/terrasense`
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 "Source" 部分：
   - 选择 **Deploy from a branch**
   - Branch 选择 **gh-pages**
   - Folder 选择 **/ (root)**
   - 点击 **Save**

### 步骤 7: 等待部署完成

- GitHub Pages 通常需要 1-2 分钟来部署
- 部署完成后，访问：`https://QinghuaZhang1.github.io/terrasense`
- 访问 showcase 页面：`https://QinghuaZhang1.github.io/terrasense/#showcase`

## 🎯 验证部署

部署成功后，你应该能够：

1. ✅ 访问主页：`https://QinghuaZhang1.github.io/terrasense`
2. ✅ 访问 showcase：`https://QinghuaZhang1.github.io/terrasense/#showcase`
3. ✅ 所有导航链接正常工作
4. ✅ 页面样式和本地一致
5. ✅ 动画和交互功能正常

## 🔄 更新网站

每次修改代码后，重新部署：

```bash
# 1. 提交更改
git add .
git commit -m "Update: 描述你的更改"
git push

# 2. 重新部署
npm run deploy
```

## ⚠️ 常见问题

### 问题 1: 页面显示 404

**解决方案**:
- 确认 `vite.config.ts` 中 `base: '/terrasense/'` 已设置
- 确认 GitHub Pages 设置中选择了 `gh-pages` 分支
- 等待几分钟让 GitHub 完成部署

### 问题 2: 样式丢失或资源加载失败

**解决方案**:
- 检查浏览器控制台的错误信息
- 确认所有资源路径都使用了相对路径
- 清除浏览器缓存后重试

### 问题 3: Hash 路由 (#showcase) 不工作

**解决方案**:
- Hash 路由（#）不需要服务器配置，应该自动工作
- 如果问题持续，检查 `index.html` 中的 `scroll-smooth` 类

### 问题 4: API Key 在 GitHub Pages 上不工作

**说明**:
- GitHub Pages 是静态托管，不支持服务端环境变量
- 交互式演示功能需要用户手动输入 API Key
- 或者考虑使用后端服务代理 API 请求

## 📝 下一步

部署成功后，你可以：

1. 在 README.md 中添加 GitHub Pages 链接
2. 添加项目截图
3. 配置自定义域名（可选）

## 🎉 完成！

如果一切顺利，你的网站现在应该可以在 GitHub Pages 上正常访问了！

如有任何问题，请查看 GitHub 仓库的 Actions 标签页，查看部署日志。

