# Stalir Website

Stalir 公益群组生存服的官方网站。支持 **1.13 ~ 26.2** 版本加入，包含群组服与模组服两大玩法。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | 原生 HTML + CSS + JavaScript |
| 图标 | 内联 SVG |
| 构建 | 纯静态，零依赖 |
| 部署 | GitHub Pages + GitHub Actions |
| 许可证 | MIT |

## 项目结构

```
stalir/
├── .github/workflows/
│   └── deploy.yml        # GitHub Pages 自动部署
├── index.html             # 主页面
├── style.css              # 样式表
├── script.js              # 交互脚本
├── logo.png               # 网站图标 / Logo
└── README.md
```

## 功能特性

- **服务器状态检测** — 实时检测 mc.stalir.cn 服务器在线状态
- **整合包版本** — 自动获取最新整合包版本号
- **响应式设计** — 桌面 / 平板 / 手机多端适配
- **VitePress 风格光晕** — Hero 区域 Logo 背景光晕
- **SVG 导航图标** — 所有导航链接均有对应图标

## 页面区块

1. **首页** — 服务器状态、IP 复制、版本支持说明
2. **特色** — 8 大服务器特色卡片
3. **架构** — 服务端与面板介绍
4. **模组** — 模组服 Mod 分类 + 整合包提示
5. **加入** — 服务器地址、QQ 群入口

## 本地开发

```bash
git clone https://github.com/kxkl2077/Stalir_Website.git
cd Stalir_Website

# 直接用浏览器打开 index.html 即可预览
# 或使用任意静态文件服务器
python3 -m http.server 8080
```

## 部署

推送至 `main` 分支后，GitHub Actions 自动部署到 GitHub Pages。

> 仅当 commit 修改了 `index.html`、`style.css`、`script.js`、`logo.png` 等网站文件时触发，跳过仅含 `README.md`、`LICENSE`、`.github/workflows/` 的提交。

## License

[MIT](./LICENSE)
