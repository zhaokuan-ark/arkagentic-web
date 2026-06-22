export type Language = "en" | "zh";

export const translations = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      faq: "FAQ",
      apps: "Apps",
      signIn: "Sign in",
      signOut: "Sign out",
      signingOut: "Signing out...",
      back: "Back",
      signedInAs: "Signed in as",
      account: "Account",
    },
    lang: {
      en: "English",
      zh: "中文",
    },
    hero: {
      badge: "AI agents for real business operations",
      heading1: "Building your",
      heading2: "digital workforce",
      description:
        "ArkAgentic is growing in two directions - SaaS/AaaS products your team can launch immediately, and custom AI product design and integration that can be developed specifically for your business needs.",
      cta1: "Explore products",
      cta2: "Custom build enquiry",
      cta3: "Watch demo",
    },
    proofPoints: [
      "Invoice Extractor is live as our first customer product",
      "More AI workflow tools are already being shaped behind it",
      "Custom AI systems and private workflow design are also part of the offer",
    ],
    partners: {
      heading: "Orchestrating the best models",
    },
    features: {
      eyebrow: "Capabilities",
      heading: "A sharper front door for products and bespoke AI systems",
      subheading:
        "ArkAgentic is not just one tool. The homepage now needs to show both the product suite we are building and the custom workflow capability we bring to clients with unique needs.",
      items: [
        {
          title: "Autonomous Execution",
          description:
            "Agents that don't just suggest, but execute complex tasks across your existing software stack.",
        },
        {
          title: "Enterprise Grade",
          description:
            "Built with security and reliability at the core, ensuring safe integration with corporate data.",
        },
        {
          title: "Scalable Workforce",
          description:
            "Instantly deploy dozens of specialized agents to handle peak workloads without overhead.",
        },
      ],
    },
    spotlight: {
      eyebrow: "Product spotlight",
      title: "Invoice Extractor",
      description:
        "Our first live ArkAgentic product, built for finance teams that need to turn messy invoice folders into structured business data.",
      status: "Live now",
      inputLabel: "Input",
      inputTitle: "Cloud folders",
      inputDesc:
        "Connects to cloud folders while keeping customer invoice data private and secure.",
      processingLabel: "Processing",
      processingTitle: "Invoice extraction",
      processingDesc:
        "Identifies invoice files in bulk and extracts key fields into a reviewable structured format.",
      outputLabel: "Output",
      outputTitle: "Structured invoice data",
      outputDesc:
        "Produces review-ready outputs for export, finance checks, and downstream workflows.",
      cta: "Start free 7-day trial",
    },
    serviceTracks: {
      eyebrow: "How to work with us",
      items: [
        {
          title: "Use ArkAgentic products",
          description:
            "Start with ready-to-use AI tools like Invoice Extractor, then launch future products from one ArkAgentic account.",
        },
        {
          title: "Build a private AI workflow with us",
          description:
            "Work with us on a custom AI system designed around your exact internal process, integrations, and review rules.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      heading:
        "Simple product pricing, plus custom build pathways when you need something more tailored.",
      subheading:
        "Start with Invoice Extractor if you want a live SaaS product today, or talk to us about a custom build if your workflow needs something more specific.",
      plans: [
        {
          name: "Invoice Extractor",
          price: "$19/mo",
          description:
            "A simple starting point for individual operators and small teams.",
          features: [
            "7-day free trial",
            "Email-based account login",
            "AI extraction usage billed separately",
          ],
        },
        {
          name: "Custom Build",
          price: "Custom quote",
          description:
            "For teams that want a tailored AI workflow, internal tool, or private system built around how they actually work.",
          features: [
            "Built around your workflow and business requirements",
            "Can combine AI with the tools, steps, and approvals you already use",
            "Can be delivered as a private tool, internal system, or client-facing workflow",
          ],
        },
      ],
      ctaTrial: "Start free trial",
      ctaContact: "Get in touch",
    },
    roadmap: {
      eyebrow: "Product roadmap",
      heading: "The first product is live. More focused tools can follow.",
      subheading:
        "Invoice Extractor is live now. We're building more focused tools for the workflows that cost small businesses the most time — document handling, inbox triage, and sales admin.",
      products: [
        {
          name: "Invoice Extractor",
          status: "Live now",
          description:
            "Extract invoices from cloud folders into structured outputs with human-review-friendly workflows.",
        },
        {
          name: "Inbox & Document Triage",
          status: "In design",
          description:
            "Automatically classify, route, and summarize incoming business documents and shared inbox traffic.",
        },
        {
          name: "Quote & Proposal Assistant",
          status: "Planned",
          description:
            "Generate draft proposals, pull source details, and help small teams move faster on sales admin work.",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Common questions",
      items: [
        {
          question: "How does Invoice Extractor connect to my OneDrive?",
          answer:
            "You connect through Microsoft's official OAuth screen — we never see your password or get access to anything outside the folder you choose. You can disconnect at any time from the account settings page.",
        },
        {
          question: "What does the 7-day free trial include?",
          answer:
            "Full access to all extraction features — no credit card required to start. After 7 days, you can continue with a paid subscription. Trial accounts are one per person.",
        },
        {
          question: "What file formats are supported?",
          answer:
            "PDF invoices and common image formats including PNG, JPG, and TIFF. The system reads each file, extracts structured fields, and flags anything that may need manual review before it goes into Xero.",
        },
        {
          question: "Where do the results go?",
          answer:
            "Results are written back to the OneDrive output folder you chose — an Excel workbook ready for Xero review, plus a full CSV with per-invoice field detail. Nothing is stored on our servers beyond what's needed to run the job.",
        },
        {
          question: "Can you build something custom for my business?",
          answer:
            "Yes. Alongside the SaaS products, we also design and build tailored AI workflows and internal tools for businesses that need something specific — contact us to discuss your requirements.",
        },
        {
          question: "Is my data secure?",
          answer:
            "Yes. Data in transit is encrypted, OneDrive access is scoped to the folders you select, and your documents are never used to train any AI models.",
        },
      ],
    },
    contact: {
      eyebrow: "Request a demo",
      heading:
        "Need software you can use now — or a private AI workflow built for you?",
      description:
        "We can help in both directions: launch a product like Invoice Extractor today, or work with you on a custom AI system tailored to your business process.",
      goodFit: "Good fit for teams exploring:",
      goodFitItems: [
        "Finance and invoice operations",
        "Inbox, documents, and internal ops workflows",
        "Private AI tools with human review and approvals",
      ],
      form: {
        name: "Full name",
        namePlaceholder: "Your name",
        email: "Business email",
        emailPlaceholder: "name@company.com",
        phone: "Phone number",
        phonePlaceholder: "+61 400 000 000",
        company: "Company name",
        companyPlaceholder: "Your business",
        message: "What do you want help with?",
        messagePlaceholder:
          "Tell us whether you want to use an ArkAgentic product, explore a private custom workflow, or both.",
        submit: "Submit request",
      },
    },
    footer: {
      copy: "© 2026 ArkAgentic. ABN: 92 627 301 153",
      address: "11 Hassall Street, Parramatta NSW 2150",
    },
  },

  zh: {
    nav: {
      features: "功能",
      pricing: "价格",
      faq: "常见问题",
      apps: "应用",
      signIn: "登录",
      signOut: "退出登录",
      signingOut: "退出中...",
      back: "返回",
      signedInAs: "当前登录",
      account: "账户",
    },
    lang: {
      en: "English",
      zh: "中文",
    },
    hero: {
      badge: "AI 智能体，驱动真实业务运营",
      heading1: "打造你的",
      heading2: "数字化员工团队",
      description:
        "ArkAgentic 正同步推进两个方向：可立即上手的 SaaS/AaaS 产品，以及专为你的业务需求量身定制开发的 AI 产品设计与集成服务。",
      cta1: "探索产品",
      cta2: "定制开发咨询",
      cta3: "观看演示",
    },
    proofPoints: [
      "发票提取器已作为首款产品正式上线",
      "更多 AI 工作流工具正在研发中",
      "同步提供定制 AI 系统与私有流程设计服务",
    ],
    partners: {
      heading: "整合最优质的 AI 模型",
    },
    features: {
      eyebrow: "核心能力",
      heading: "产品矩阵与定制 AI 系统的双轨入口",
      subheading:
        "ArkAgentic 不只是一款工具。我们同步打造 SaaS 产品套件，并为有特殊需求的客户提供定制化工作流能力。",
      items: [
        {
          title: "自主执行",
          description:
            "智能体不止于建议，更能跨越你现有的软件栈，自主完成复杂的多步骤任务。",
        },
        {
          title: "企业级安全",
          description:
            "以安全性和可靠性为核心构建，确保与企业数据的安全集成。",
        },
        {
          title: "弹性扩展",
          description:
            "秒级部署数十个专业智能体，无需额外人力即可应对业务峰值负载。",
        },
      ],
    },
    spotlight: {
      eyebrow: "产品亮点",
      title: "发票提取器",
      description:
        "ArkAgentic 首款正式上线产品，专为财务团队打造，将混乱的发票文件夹转化为结构化业务数据。",
      status: "已上线",
      inputLabel: "输入",
      inputTitle: "云端文件夹",
      inputDesc: "连接云端文件夹，同时确保客户发票数据的隐私与安全。",
      processingLabel: "处理",
      processingTitle: "发票提取",
      processingDesc:
        "批量识别发票文件，将关键字段提取为可审核的结构化格式。",
      outputLabel: "输出",
      outputTitle: "结构化发票数据",
      outputDesc:
        "生成可直接用于导出、财务核对及下游工作流的审核就绪数据。",
      cta: "开始 7 天免费试用",
    },
    serviceTracks: {
      eyebrow: "合作方式",
      items: [
        {
          title: "使用 ArkAgentic 产品",
          description:
            "从发票提取器等开箱即用的 AI 工具开始，通过一个 ArkAgentic 账户陆续解锁更多产品。",
        },
        {
          title: "与我们共建私有 AI 工作流",
          description:
            "我们将围绕你的内部流程、系统集成和审核规则，设计并实现专属 AI 系统。",
        },
      ],
    },
    pricing: {
      eyebrow: "定价",
      heading: "产品定价简单透明，复杂需求也有定制开发路径。",
      subheading:
        "想立即使用 SaaS 产品，从发票提取器开始；有更复杂的工作流需求，欢迎联系我们定制开发。",
      plans: [
        {
          name: "发票提取器",
          price: "$19/月",
          description: "适合个人运营者和小型团队的轻量起点。",
          features: [
            "7 天免费试用",
            "邮箱账号登录",
            "AI 提取用量单独计费",
          ],
        },
        {
          name: "定制开发",
          price: "按需报价",
          description:
            "适合希望围绕实际工作方式，打造专属 AI 工作流、内部工具或私有系统的团队。",
          features: [
            "围绕你的业务流程和需求定制构建",
            "可与现有工具、流程和审批环节深度整合",
            "可交付为私有工具、内部系统或面向客户的工作流",
          ],
        },
      ],
      ctaTrial: "开始免费试用",
      ctaContact: "联系我们",
    },
    roadmap: {
      eyebrow: "产品路线图",
      heading: "第一款产品已上线，更多专注工具即将推出。",
      subheading:
        "我们将持续扩展产品矩阵，展示已有能力，让 ArkAgentic 成为中小企业、团队和运营者更广泛的 AI 工具箱。",
      products: [
        {
          name: "发票提取器",
          status: "已上线",
          description:
            "从云端文件夹提取发票，输出结构化数据，支持人工审核友好的工作流。",
        },
        {
          name: "邮箱与文档分拣",
          status: "设计中",
          description:
            "自动对收件箱和共享文件夹中的业务文档进行分类、流转和摘要提取。",
        },
        {
          name: "报价与提案助手",
          status: "规划中",
          description:
            "自动生成提案草稿、汇总相关信息，帮助小型团队提升销售行政效率。",
        },
      ],
    },
    faq: {
      eyebrow: "常见问题",
      heading: "常见问题解答",
      items: [
        {
          question: "发票提取器如何连接我的 OneDrive？",
          answer:
            "通过微软官方的 OAuth 授权页面连接，我们不会获取你的密码，也不会访问你所选文件夹以外的任何内容。你可以随时在账户设置中断开授权。",
        },
        {
          question: "7 天免费试用包含哪些功能？",
          answer:
            "免费试用期间可使用全部提取功能，无需绑定信用卡。到期后可选择订阅继续使用。每人限用一次试用。",
        },
        {
          question: "支持哪些文件格式？",
          answer:
            "支持 PDF 发票及常见图片格式，包括 PNG、JPG 和 TIFF。系统会读取每份文件，提取结构化字段，并将需要人工核查的票据标注出来，方便导入 Xero 前审核。",
        },
        {
          question: "提取结果会存在哪里？",
          answer:
            "结果会写回你在 OneDrive 中指定的输出文件夹，包含一份可直接用于 Xero 的 Excel 工作簿，以及一份包含每张发票明细的完整 CSV。我们不会在服务器上长期保留你的文档内容。",
        },
        {
          question: "可以为我的业务定制开发吗？",
          answer:
            "可以。我们在 SaaS 产品之外，也为有特定需求的企业设计和构建定制化 AI 工作流与内部工具。欢迎联系我们了解详情。",
        },
        {
          question: "我的数据安全吗？",
          answer:
            "安全。数据传输全程加密，OneDrive 访问仅限于你所选的文件夹，你的文档不会被用于训练任何 AI 模型。",
        },
      ],
    },
    contact: {
      eyebrow: "申请演示",
      heading: "需要立即可用的产品，还是量身定制的私有 AI 工作流？",
      description:
        "我们可以同时提供两种帮助：立即启用发票提取器等产品，或与你共同打造贴合业务流程的定制 AI 系统。",
      goodFit: "适合以下方向的团队：",
      goodFitItems: [
        "财务与发票处理",
        "邮件、文档及内部运营工作流",
        "带有人工审核与审批环节的私有 AI 工具",
      ],
      form: {
        name: "姓名",
        namePlaceholder: "你的姓名",
        email: "企业邮箱",
        emailPlaceholder: "name@company.com",
        phone: "手机号码",
        phonePlaceholder: "+61 400 000 000",
        company: "公司名称",
        companyPlaceholder: "你的企业名称",
        message: "你需要什么帮助？",
        messagePlaceholder:
          "请描述你希望使用 ArkAgentic 产品、探索定制工作流，或两者兼有。",
        submit: "提交申请",
      },
    },
    footer: {
      copy: "© 2026 ArkAgentic. ABN: 92 627 301 153",
      address: "11 Hassall Street, Parramatta NSW 2150",
    },
  },
} as const;

export type Translations = {
  nav: {
    features: string;
    pricing: string;
    faq: string;
    apps: string;
    signIn: string;
    signOut: string;
    signingOut: string;
    back: string;
    signedInAs: string;
    account: string;
  };
  lang: { en: string; zh: string };
  hero: {
    badge: string;
    heading1: string;
    heading2: string;
    description: string;
    cta1: string;
    cta2: string;
    cta3: string;
  };
  proofPoints: readonly string[];
  partners: { heading: string };
  features: {
    eyebrow: string;
    heading: string;
    subheading: string;
    items: readonly { title: string; description: string }[];
  };
  spotlight: {
    eyebrow: string;
    title: string;
    description: string;
    status: string;
    inputLabel: string;
    inputTitle: string;
    inputDesc: string;
    processingLabel: string;
    processingTitle: string;
    processingDesc: string;
    outputLabel: string;
    outputTitle: string;
    outputDesc: string;
    cta: string;
  };
  serviceTracks: {
    eyebrow: string;
    items: readonly { title: string; description: string }[];
  };
  pricing: {
    eyebrow: string;
    heading: string;
    subheading: string;
    plans: readonly { name: string; price: string; description: string; features: readonly string[] }[];
    ctaTrial: string;
    ctaContact: string;
  };
  roadmap: {
    eyebrow: string;
    heading: string;
    subheading: string;
    products: readonly { name: string; status: string; description: string }[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: readonly { question: string; answer: string }[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    description: string;
    goodFit: string;
    goodFitItems: readonly string[];
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      company: string;
      companyPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
  };
  footer: { copy: string; address: string };
};
