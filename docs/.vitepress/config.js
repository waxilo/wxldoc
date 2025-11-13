export default {
  title: "VitePress文档",
  description: "使用VitePress构建的文档站点",

  // 重要：设置基础路径，应该与GitHub仓库名称一致
  // 例如，如果您的仓库名是 'vite-press-doc'，则设置为 '/vite-press-doc/'
  base: "/wxldoc/",

  themeConfig: {
    // 目录
    outline: {
      level: [2, 3],
      label: "目录",
    },

    // 导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "面经", link: "/doc/dev/" },
    ],

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/waxilo/vite-press-doc" },
    ],

    // 侧边栏 - 首页显示other目录的侧边栏
    sidebar: {
      "/": [
        {
          items: [
            { text: "概述", link: "/" },
            { text: "VPN", link: "/doc/index/VPN" },
            {
              text: "一键激活 JetBrains 全家桶",
              link: "/doc/index/一键激活 JetBrains 全家桶",
            },
            {
              text: "Mac Idea 最新版激活",
              link: "/doc/index/Mac Idea 最新版激活",
            },
          ],
        },
      ],
      "/doc/dev": [
        {
          items: [
            { text: "概述", link: "/doc/dev/" },
            { text: "网络安全", link: "/doc/dev/网络安全/网络安全" },
            { text: "Java", link: "/doc/dev/Java" },
            { text: "MySQL", link: "/doc/dev/MySQL" },
            { text: "Redis", link: "/doc/dev/Redis" },
            { text: "Spring", link: "/doc/dev/Spring" },
          ],
        },
      ],
    },

    // 隐藏底部的上一页下一页导航
    docFooter: {
      prev: false,
      next: false,
    },
  },
};
