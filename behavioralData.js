/**
 * Behavioral Interview Questions & STAR Templates
 * Based on "Behavioral Interview Common Questions" (CAda15Tawlg)
 */

const BehavioralQuestions = [
  {
    id: 1,
    category: "Conflict Resolution",
    question: "Tell me about a conflict you had with a co-worker. How did you resolve it?",
    companies: ["Meta", "Amazon", "Apple", "DataDog"],
    level: "All levels",
    keySignals: [
      "Conflict resolution skills",
      "Communication skills",
      "Empathy and understanding",
      "Win-win solutions",
      "Relationship preservation"
    ],
    starTemplate: {
      situation: "设置背景（10%时间）\n- 描述冲突的背景和环境\n- 说明为什么这个冲突很重要（高stakes）\n- 强调你在其中的深度参与",
      task: "明确任务/目标\n- 说明业务或项目的目标\n- 解释冲突对目标的影响",
      action: "详细描述行动（60%时间）\n✓ 先寻求理解对方观点\n✓ 展现同理心，理解对方动机和限制\n✓ 使用数据/证据来客观解决分歧\n✓ 选择合适的沟通渠道（从文字→会议→面对面）\n✓ 寻找双赢解决方案\n✓ 保持专业和尊重",
      result: "展示结果（20%时间）\n- 冲突的解决方案\n- 业务/项目的实际成果\n- 关系状态：与对方后续合作情况\n- 学习和反思（10%时间）"
    },
    checklist: [
      "展示了主动理解对方观点",
      "表现出同理心",
      "使用客观数据/证据",
      "选择了恰当的沟通方式",
      "达成了双赢结果",
      "保持了良好的工作关系"
    ],
    avoidPitfalls: [
      "不要把对方描述成明显不合理的人",
      "避免情绪化或指责性语言",
      "不要选择鸡毛蒜皮的小冲突（如代码格式）",
      "不要只关注'赢'而忽略关系维护",
      "不要隐藏情绪内容（如果确实发生了激烈争执，要专业地承认）"
    ],
    levelingGuide: {
      junior: "与同级别同事的冲突，可能需要寻求帮助",
      senior: "与跨职能伙伴（PM/设计师）或其他团队的冲突，可能涉及POC/数据分析",
      staff: "组织层面的系统性冲突，涉及解决方案设计以防止未来冲突"
    }
  },
  {
    id: 2,
    category: "Disagreement with Manager",
    question: "What was a situation where you didn't agree with your manager's decision?",
    companies: ["Tech companies (Silicon Valley culture)"],
    level: "All levels",
    keySignals: [
      "Willingness to speak up",
      "Respectful pushback",
      "Judgment (when to push vs. disagree & commit)",
      "Thought partnership vs. execution",
      "Trust and influence"
    ],
    starTemplate: {
      situation: "描述背景\n- 说明manager的决策内容\n- 解释为什么这个决策很重要",
      task: "明确你的concern\n- 说明你发现的潜在问题\n- 解释为什么值得pushback而不是直接执行",
      action: "描述你如何处理\n✓ 准备充分（收集数据/证据）\n✓ 选择合适的时机和方式\n✓ 保持尊重和专业的tone\n✓ 通过提问理解manager的高层context\n✓ 清晰表达你的观点和理由\n✓ 提供替代方案",
      result: "展示结果\n- Manager的反应和最终决策\n- 实际执行的方案\n- 对项目/团队的影响\n- 你的学习和反思"
    },
    checklist: [
      "Pushback是基于充分理由而非个人偏好",
      "做了充分准备（数据/分析）",
      "保持了尊重和专业",
      "理解了manager的更高层次context",
      "成功说服或优雅地disagree & commit"
    ],
    avoidPitfalls: [
      "不要选择个人利益相关的话题（绩效评估/晋升）",
      "避免琐碎的分歧（个人偏好而非客观理由）",
      "不要带着强烈情绪讲述",
      "避免选择你错了的情况"
    ]
  },
  {
    id: 3,
    category: "Project Pride",
    question: "Tell me about a project that you're most proud of",
    companies: ["Common across all tech companies"],
    level: "All levels",
    keySignals: [
      "Technical scope and complexity",
      "End-to-end ownership",
      "Connection to business outcomes",
      "Problem-solving skills",
      "Handling ambiguity",
      "Communication and organization"
    ],
    starTemplate: {
      situation: "简洁设置背景（10%）\n- 项目的业务背景\n- 为什么重要",
      task: "【提供目录TOC】\n列出3-5个主要部分，例如：\n1. 调研和设计阶段\n2. 与stakeholders达成一致\n3. 解决关键技术难题\n4. 谨慎rollout",
      action: "按目录展开（60%）\n- 对每个部分详细描述\n- 重点放在可复用的actions\n- 引导面试官关注最重要的部分\n- 准备好深入回答follow-up",
      result: "展示影响（20%）\n- 具体的业务成果/metrics\n- 技术成果\n- 对团队/组织的影响\n- 学习和后续（10%）"
    },
    projectSelection: {
      dimensions: [
        "Impact（业务/用户成果的意义）",
        "Scope（技术复杂度、时间跨度、团队规模）",
        "Personal Contribution（你的核心贡献，不是旁观者）"
      ],
      levelGuide: {
        "L3-L4 (Junior)": "Feature level, 1-4周, 自己实现大部分，例如：完整实现一个profile settings页面",
        "L5 (Senior)": "Project level, 1-3个月, 1-2个工程师，技术leadership，例如：REST API迁移到GraphQL",
        "L6 (Staff)": "Significant project, 6-12个月, 多个工作流, 驱动vision和架构，例如：实时通知系统架构",
        "L7 (Principal)": "Major initiative, 1年+, 平台现代化, 战略影响整个组织，例如：开发者体验改进计划"
      }
    },
    commonFollowUps: [
      "What would you do differently?",
      "What was the hardest part (technical/organizational)?",
      "How did you measure success?",
      "Did you encounter any conflicts?",
      "What would you do next on this project?"
    ],
    avoidPitfalls: [
      "不要迷失在技术细节中",
      "不要选择你只是旁观者的大项目",
      "避免过长的背景介绍（keep context tight）"
    ]
  },
  {
    id: 4,
    category: "Failure & Learning",
    question: "Tell me about a project where you failed",
    companies: ["Common across all tech companies"],
    level: "All levels",
    keySignals: [
      "Growth mindset and self-awareness",
      "Ability to reflect and learn",
      "Perseverance",
      "Judgment and decision-making",
      "Ownership and accountability"
    ],
    starTemplate: {
      situation: "设置背景\n- 描述项目和目标\n- **关键：说明你当时的合理假设/理由**",
      task: "明确期望和实际gap\n- 期望达成的目标\n- 实际发生的失败",
      action: "描述过程和发现\n- 你的初始approach和理由\n- 如何发现问题\n- 如何应对和修正\n- 采取的补救措施",
      result: "展示反思和成长\n- 从失败中学到了什么\n- 后续如何应用这些经验\n- **简短示例：下次遇到类似情况如何做**"
    },
    failureFrameworks: [
      "Speed vs Quality trade-off（移动太快→质量问题 或 太慢→错失机会）",
      "Data问题（基于错误数据做决策，如用户调研 vs 实际使用）",
      "过往经验不适用（'我们以前都这样做'在新场景失效）",
      "Under/Over-engineering（设计不足需重构 或 过度设计难维护）",
      "估算失误（低估依赖、边界情况、时间）"
    ],
    goldilocksZone: {
      tooSmall: "微不足道的失败（缺乏学习价值）",
      justRight: "有意义的失败但可恢复，展现resilience",
      tooBig: "灾难性失败或明显的判断失误"
    },
    goodExamples: [
      "设计方案在production负载下需要重构",
      "过度工程导致维护困难",
      "功能开发出来但用户不用（需求理解偏差）",
      "移动太快导致质量问题",
      "低估工期导致延期"
    ],
    avoidPitfalls: [
      "不要选择明显的判断失误（如'没写测试导致bug'）",
      "必须有合理的初始假设",
      "避免无法恢复的灾难",
      "不要只说失败不说学习和改进"
    ],
    keyDeliveryTip: "在Context部分必须说明：为什么当时的选择是合理的"
  },
  {
    id: 5,
    category: "Calculated Risk",
    question: "Give me an example of a calculated risk that you've taken where speed was critical",
    companies: ["Companies emphasizing speed and iteration"],
    level: "Mid to Senior",
    keySignals: [
      "Prioritization skills",
      "Understanding of trade-offs",
      "Business context awareness",
      "Risk mitigation strategies",
      "Judgment under pressure"
    ],
    starTemplate: {
      situation: "描述压力和context\n- 为什么speed是critical\n- 业务/市场背景",
      task: "说明目标和约束\n- 需要达成什么\n- 面临的时间压力",
      action: "展示计算和权衡\n✓ 识别可以cut的corners\n✓ 评估每个corner的风险\n✓ **风险缓解策略**\n✓ 如何监控和快速响应\n✓ 为什么这个trade-off是正确的",
      result: "展示成果\n- 按时交付的成果\n- 风险是否materialized\n- 后续如何处理技术债\n- 学习和反思"
    },
    riskExamples: {
      junior: "手动测试替代自动化测试，简化功能范围",
      senior: "接受短期架构债，选择更快但不完美的技术方案",
      staff: "选择新兴技术以获得创新优势，尽管developer experience不成熟"
    },
    mitigation: [
      "预留时间处理技术债",
      "额外测试层",
      "分阶段rollout",
      "监控和快速回滚机制",
      "文档记录shortcuts以便后续改进"
    ],
    avoidPitfalls: [
      "不要选择鲁莽的风险（没有计算和缓解）",
      "避免失败的风险（最好是calculated且成功的）",
      "不要忽略风险缓解策略"
    ]
  },
  {
    id: 6,
    category: "Giving Feedback",
    question: "Tell me about the hardest feedback that you've ever had to deliver",
    companies: ["Common for Staff+ and Management"],
    level: "Senior to Staff+",
    keySignals: [
      "Helping others grow",
      "Navigating difficult conversations",
      "Emotional intelligence",
      "Influence without authority",
      "Landing feedback effectively"
    ],
    starTemplate: {
      situation: "说明背景和why it's hard\n- 描述需要feedback的情况\n- 说明为什么这个feedback难以deliver\n- 权力动态（向上/平级/向下）",
      task: "明确feedback的目标\n- 希望对方改变什么\n- 为什么这个改变重要",
      action: "描述如何deliver\n✓ 准备工作（收集examples/data）\n✓ 选择合适时机和环境\n✓ 使用恰当的语言和tone\n✓ 提供具体examples\n✓ 倾听对方反应\n✓ 提供支持和资源",
      result: "展示impact\n- 对方的反应和行为改变\n- 长期影响\n- 关系维护情况\n- 你的学习"
    },
    hardnessExamples: {
      "Early career": "任务表现不达标，要求重做，向manager提feedback",
      "Mid-level": "绩效管理对话，晋升未通过",
      "Senior/Staff": "文化/行为问题（难以量化），需要let go努力但不合适的人，无权力关系的feedback（peer/up）"
    },
    checklist: [
      "Feedback是具体的（有examples）",
      "保持了尊重和同理心",
      "关注行为而非人格",
      "提供了改进的支持",
      "成功'landed'并驱动改变"
    ],
    avoidPitfalls: [
      "不要选择你带情绪的最近事件",
      "避免过于trivial的feedback",
      "不要忽略对方的成长和改变"
    ]
  }
];

// Time allocation guideline for all responses
const TimeAllocation = {
  context: "10%",
  action: "60%",
  result: "20%",
  learning: "10%"
};

// General STAR framework
const STARFramework = {
  S: {
    name: "Situation (情境)",
    description: "简洁设置背景，让面试官理解context",
    time: "10%",
    tips: [
      "只说必要信息",
      "避免过长的背景故事",
      "为Action部分铺垫"
    ]
  },
  T: {
    name: "Task (任务)",
    description: "说明你的目标和责任",
    time: "包含在Situation",
    tips: [
      "明确你的角色",
      "说明stakes/重要性",
      "连接到业务目标"
    ]
  },
  A: {
    name: "Action (行动)",
    description: "详细描述你采取的具体行动",
    time: "60%",
    tips: [
      "使用'我'而不是'我们'",
      "描述可复用的actions",
      "展示思考过程",
      "引导面试官关注重点"
    ]
  },
  R: {
    name: "Result (结果)",
    description: "展示impact和学习",
    time: "20% result + 10% learning",
    tips: [
      "量化成果（metrics）",
      "说明业务影响",
      "包含学习和反思",
      "简短提及后续应用"
    ]
  }
};
