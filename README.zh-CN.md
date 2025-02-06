# 极简 AI 翻译

> 一个优雅的现代 AI 翻译工具，将传统翻译器的简洁与 AI 语言模型的强大完美结合。

[English](README.md) | [中文](README.zh-CN.md)

🔗 [在线演示](https://fanyi.xunpanziyou.com/)

一个高颜值、超级方便的 AI 翻译工具，为"老顽固"打造的现代翻译体验。远比在 DeepL 或 Google 翻译中的体验要好得多，也比笨笨地把文本复制粘贴到 ChatGPT 中要快捷非常多。

## 🌟 特点

- **极简设计** - 纯净的界面，无广告，无干扰
- **智能交互** - 自动检测语言，即时翻译
- **多模型支持** - 支持 Gemini、GPT-4、Groq、DeepSeek 等多个 AI 模型
- **快捷操作** - 支持快捷键，让翻译更高效
- **响应式设计** - 完美适配桌面端和移动端

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- 包管理器：[Bun](https://bun.sh)（推荐）或 npm

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/ai-translate.git
cd ai-translate
```

2. 安装依赖

```bash
# 使用 Bun（推荐，性能更好）
bun install

# 或使用 npm
npm install
```

3. 配置环境变量

```bash
cp .env.example .env
```

然后编辑 `.env` 文件，添加你的 API 密钥

4. 启动开发服务器

```bash
# 使用 Bun（推荐）
bun dev

# 或使用 npm
npm run dev
```

现在打开 [http://localhost:3000](http://localhost:3000) 即可使用！

## 📝 使用说明

### 基本操作

- **输入文本** - 在左侧输入框中输入或粘贴文本
- **翻译** - 按回车键开始翻译
- **换行** - 使用 Shift + Enter 插入换行
- **复制结果** - 翻译完成后自动复制到剪贴板
- **切换主题** - 点击左上角的主题图标
- **切换模型** - 使用顶部的模型选择器
- **重置** - 点击中间的 Logo 重置所有内容

## 🤝 贡献

欢迎提交 Pull Request 和 Issue！

## 📜 许可证

[MIT License](LICENSE)
