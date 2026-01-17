export default {
  title: "Sloan's Doc",
  description: "Sloan's Doc",

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
      { text: "面试题", link: "/doc/dev/" },
      { text: "其他", link: "/" },
    ],

    // 社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/waxilo/vite-press-doc" },
    ],

    // 侧边栏 - 根据实际文件结构配置
    sidebar: {
      "/": [
        // 首页的侧边栏
        {
          text: "工具文档",
          collapsible: true,
          items: [
            { text: "概述", link: "/" },
            { text: "VPN", link: "/doc/other/VPN" },
            {
              text: "一键激活 JetBrains 全家桶",
              link: "/doc/other/一键激活 JetBrains 全家桶",
            },
            {
              text: "Mac Idea 最新版激活",
              link: "/doc/other/Mac Idea 最新版激活",
            },
          ],
        },
      ],
      "/doc/dev": [
        {
          text: "Java",
          collapsible: true,
          collapsed: true,

          items: [
            { text: "集合", link: "/doc/dev/Java/集合" },
            { text: "线程池", link: "/doc/dev/Java/线程池" },
            { text: "JVM", link: "/doc/dev/Java/JVM" },
          ],
        },
        {
          text: "MySQL",
          collapsible: true,
          collapsed: true,

          items: [
            { text: "三大日志", link: "/doc/dev/MySQL/三大日志" },
            { text: "索引", link: "/doc/dev/MySQL/索引" },
            { text: "事务", link: "/doc/dev/MySQL/事务" },
            { text: "锁机制", link: "/doc/dev/MySQL/锁" },
            { text: "MVCC", link: "/doc/dev/MySQL/MVCC" },
          ],
        },
        {
          text: "Redis",
          collapsible: true,
          collapsed: true,

          items: [
            { text: "基础", link: "/doc/dev/Redis/index" },
            { text: "过期策略", link: "/doc/dev/Redis/过期策略" },
            { text: "淘汰策略", link: "/doc/dev/Redis/淘汰策略" },
            { text: "分布式方案", link: "/doc/dev/Redis/分布式方案" },
          ],
        },
        {
          text: "Spring",
          collapsible: true,
          collapsed: true,

          items: [{ text: "基础", link: "/doc/dev/Spring/index" }],
        },
        {
          text: "网络基础",
          collapsible: true,
          collapsed: true,
          items: [{ text: "网络基础", link: "/doc/dev/网络基础/index" }],
        },
        {
          text: "场景题",
          collapsible: true,
          collapsed: true,
          items: [{ text: "场景题", link: "/doc/dev/场景题/index" }],
        }
      ],
    },

    // 隐藏底部的上一页下一页导航
    docFooter: {
      prev: false,
      next: false,
    },
  },
};
