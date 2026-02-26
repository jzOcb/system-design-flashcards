// System Design 面试网站配置
const siteConfig = {
  topic: "System Design 面试",
  siteName: "System Design 面试速成",
  itemName: "概念",
  itemCount: 30,

  hero: {
    title: [
      "30个核心概念",
      "搞定 System Design",
      "面试"
    ],
    subtitle: "来自 Hello Interview 的 FAANG 面试官教程，从 API Design 到 Kafka，系统掌握面试必考知识",
    animation: {
      enabled: true,
      demoCount: 5
    }
  },

  stats: [
    { value: "30", label: "核心概念" },
    { value: "53", label: "原视频数" },
    { value: "35h", label: "内容浓缩" }
  ],

  footer: {
    tagline: "面试不是背答案，是讲清楚权衡",
    description: "基于 Hello Interview 53 个视频提炼的 System Design 面试核心知识。从基础概念到经典题目，从数据库深入到面试技巧，用最短时间建立完整知识框架。"
  },

  cta: {
    primary: "开始学习 →",
    secondary: "闪卡复习"
  },

  source: {
    name: "Hello Interview",
    url: "https://www.youtube.com/@hello_interview",
    website: "https://hellointerview.com"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = siteConfig;
}
