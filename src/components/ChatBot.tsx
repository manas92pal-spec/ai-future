import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "./ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const greetings = ["hi", "hello", "hey", "sup", "yo", "hola", "greetings", "good morning", "good evening", "good afternoon"];
const thanks = ["thank", "thanks", "thx", "ty", "appreciate", "grateful"];
const farewells = ["bye", "goodbye", "see you", "later", "cya", "take care"];

type Pattern = { keywords: string[]; response: string; matchAll?: boolean };

const patterns: Pattern[] = [
  // Career-specific questions
  { keywords: ["ai engineer", "artificial intelligence engineer"], response: "To become an **AI Engineer**, here's what you need:\n\n🐍 **Must-Have Skills:**\n- Python (your primary tool)\n- Linear Algebra, Calculus & Statistics\n- Machine Learning & Deep Learning\n- TensorFlow or PyTorch\n\n🧠 **Key Areas to Master:**\n- Natural Language Processing (NLP)\n- Computer Vision\n- MLOps & model deployment\n- Cloud AI services (AWS SageMaker, GCP Vertex AI)\n\n📅 **Timeline:** 12–18 months with consistent effort\n💰 **Avg Salary:** $120K–$180K\n\nStart with Python + math fundamentals, then build ML projects!" },
  { keywords: ["data scientist", "data science career"], response: "**Data Scientist** is one of the hottest careers! Here's the path:\n\n📊 **Core Skills:**\n- Python & R programming\n- Statistics & Probability\n- SQL & database querying\n- Data visualization (Matplotlib, Tableau)\n\n🔬 **Advanced Skills:**\n- Machine Learning algorithms\n- A/B Testing & experimentation\n- Big Data tools (Spark, Hadoop)\n- Communication & storytelling with data\n\n📅 **Timeline:**\n- With tech background: 6–12 months\n- From scratch: 12–24 months\n\n💰 **Avg Salary:** $100K–$160K\n\nTip: Build a portfolio on Kaggle to stand out!" },
  { keywords: ["web developer", "web development", "full stack", "fullstack"], response: "**Web Development** is a fantastic career choice! 🌐\n\n**Frontend Path:**\n- HTML, CSS, JavaScript\n- React, Vue, or Angular\n- TypeScript, Tailwind CSS\n\n**Backend Path:**\n- Node.js, Python (Django/FastAPI), or Java\n- PostgreSQL, MongoDB\n- REST APIs & GraphQL\n\n**Full Stack = Both!** Plus:\n- Git & version control\n- Docker & deployment\n- CI/CD pipelines\n\n📅 **Timeline:** 6–12 months to job-ready\n💰 **Avg Salary:** $80K–$140K\n\nStart with freeCodeCamp or The Odin Project!" },
  { keywords: ["cybersecurity", "cyber security", "security analyst", "ethical hack"], response: "**Cybersecurity** is a rapidly growing field! 🔒\n\n🛡️ **Foundation Skills:**\n- Networking (TCP/IP, DNS, HTTP)\n- Linux system administration\n- Python scripting\n\n⚔️ **Core Security Skills:**\n- Vulnerability assessment\n- SIEM tools (Splunk, ELK)\n- Penetration testing\n- Incident response\n\n📜 **Key Certifications:**\n- CompTIA Security+ (entry)\n- CEH (intermediate)\n- OSCP (advanced)\n- CISSP (senior)\n\n📅 **Timeline:** 12–18 months\n💰 **Avg Salary:** $90K–$150K\n\nStart with TryHackMe or Hack The Box!" },
  { keywords: ["product manager", "product management", "pm role"], response: "**Product Management** bridges tech, business & design! 🎯\n\n📋 **Core Skills:**\n- User research & interviews\n- Data analysis & SQL\n- Roadmap planning\n- Agile/Scrum methodology\n\n💡 **Soft Skills (Critical!):**\n- Communication & storytelling\n- Stakeholder management\n- Strategic thinking\n- Prioritization frameworks\n\n🛠️ **Tools to Learn:**\n- Jira, Linear, Notion\n- Figma (for wireframes)\n- Amplitude, Mixpanel\n\n📅 **Timeline:** 6–12 months\n💰 **Avg Salary:** $110K–$170K\n\nRead \"Inspired\" by Marty Cagan to start!" },
  { keywords: ["devops", "dev ops", "site reliability"], response: "**DevOps/SRE** is essential for modern tech! ⚙️\n\n🐧 **Foundation:**\n- Linux administration\n- Bash & Python scripting\n- Networking fundamentals\n\n🐳 **Core Skills:**\n- Docker & containerization\n- Kubernetes orchestration\n- CI/CD pipelines (GitHub Actions, Jenkins)\n- Infrastructure as Code (Terraform)\n\n☁️ **Cloud Platforms:**\n- AWS, GCP, or Azure\n- Monitoring (Prometheus, Grafana)\n- Logging (ELK Stack)\n\n📅 **Timeline:** 12–18 months\n💰 **Avg Salary:** $100K–$160K\n\nStart with Linux + Docker, then move to cloud!" },
  { keywords: ["mobile dev", "mobile app", "ios developer", "android developer", "react native", "flutter"], response: "**Mobile Development** powers billions of devices! 📱\n\n**Choose Your Path:**\n\n🍎 **iOS:** Swift, SwiftUI, Xcode\n🤖 **Android:** Kotlin, Jetpack Compose, Android Studio\n🔄 **Cross-Platform:** React Native or Flutter\n\n**Must-Know Concepts:**\n- UI/UX design principles\n- API integration\n- Local storage & state management\n- Push notifications\n- App Store publishing\n\n📅 **Timeline:** 6–12 months\n💰 **Avg Salary:** $90K–$150K\n\nReact Native is great if you already know JavaScript!" },
  { keywords: ["cloud architect", "cloud computing", "aws", "azure", "gcp"], response: "**Cloud Architecture** is in massive demand! ☁️\n\n**Learning Path:**\n\n1️⃣ **Fundamentals:** Linux, Networking, Cloud concepts\n2️⃣ **Core Services:** Compute, Storage, Databases, IAM\n3️⃣ **Advanced:** Serverless, Containers, IaC\n4️⃣ **Architecture:** Multi-region, DR, Cost optimization\n\n📜 **Top Certifications:**\n- AWS Solutions Architect Associate → Professional\n- GCP Professional Cloud Architect\n- Azure Solutions Architect Expert\n\n📅 **Timeline:** 12–24 months\n💰 **Avg Salary:** $130K–$200K\n\nStart with AWS Free Tier!" },
  { keywords: ["ux design", "ui design", "user experience", "ux designer"], response: "**UX/UI Design** shapes how people interact with tech! 🎨\n\n🎯 **UX Skills:**\n- User research & interviews\n- Information architecture\n- Wireframing & prototyping\n- Usability testing\n\n🖌️ **UI Skills:**\n- Visual design & typography\n- Color theory & layout\n- Design systems\n- Responsive design\n\n🛠️ **Tools:**\n- Figma (industry standard)\n- Adobe XD\n- Maze (user testing)\n- Miro (whiteboarding)\n\n📅 **Timeline:** 6–12 months\n💰 **Avg Salary:** $85K–$140K\n\nStart with Google UX Design Certificate!" },
  { keywords: ["blockchain", "web3", "crypto developer", "smart contract"], response: "**Blockchain/Web3 Development** is a frontier field! ⛓️\n\n🔧 **Skills Needed:**\n- Solidity (for Ethereum)\n- JavaScript/TypeScript\n- Smart contract development\n- Web3.js or Ethers.js\n- DeFi & NFT concepts\n\n🛠️ **Tools:**\n- Hardhat, Truffle, Foundry\n- MetaMask, Remix IDE\n- OpenZeppelin libraries\n\n📅 **Timeline:** 6–12 months (with JS background)\n💰 **Avg Salary:** $100K–$200K+\n\nStart with CryptoZombies.io!" },
  { keywords: ["game dev", "game development", "game developer", "unity", "unreal"], response: "**Game Development** combines creativity & code! 🎮\n\n🎯 **Choose Your Engine:**\n- **Unity:** C#, great for mobile & indie games\n- **Unreal Engine:** C++/Blueprints, AAA quality\n- **Godot:** GDScript, open source & lightweight\n\n🔧 **Core Skills:**\n- Programming (C# or C++)\n- 3D math & physics\n- Game design principles\n- Asset creation basics\n\n📅 **Timeline:** 12–24 months\n💰 **Avg Salary:** $70K–$130K\n\nStart by making small games — Pong, platformers, then scale up!" },

  // General career topics
  { keywords: ["resume", "cv", "resume tips"], response: "Here are my top **resume tips**: 📄\n\n✅ **Do:**\n- Keep it to 1-2 pages\n- Use action verbs (Built, Designed, Led)\n- Quantify achievements (\"Increased sales by 30%\")\n- Tailor it to each job description\n- Include relevant projects & GitHub links\n\n❌ **Don't:**\n- Use generic objectives\n- List every technology you've touched\n- Include irrelevant work experience\n- Use fancy templates that break ATS\n\n💡 **Pro Tip:** Use our **Resume Analyzer** tool to get AI feedback on your resume!" },
  { keywords: ["interview", "interview tips", "prepare interview"], response: "**Interview Preparation Guide** 🎤\n\n📚 **Technical Interviews:**\n- Practice on LeetCode/HackerRank (2-3 problems/day)\n- Study system design (for senior roles)\n- Review data structures & algorithms\n- Practice coding on a whiteboard\n\n🗣️ **Behavioral Interviews:**\n- Use the STAR method (Situation, Task, Action, Result)\n- Prepare 5-6 stories from your experience\n- Research the company thoroughly\n- Prepare thoughtful questions to ask\n\n💡 **Tips:**\n- Mock interview with friends or Pramp\n- Record yourself answering questions\n- Take pauses — it's okay to think!\n\nTry our **Interview Simulator** for practice!" },
  { keywords: ["portfolio", "project ideas", "build projects"], response: "**Building a Strong Portfolio** 🚀\n\n🏗️ **Project Ideas by Level:**\n\n**Beginner:**\n- Personal portfolio website\n- To-do app with authentication\n- Weather dashboard\n\n**Intermediate:**\n- E-commerce platform\n- Real-time chat application\n- Data visualization dashboard\n\n**Advanced:**\n- AI-powered application\n- Microservices architecture\n- Open source contribution\n\n💡 **Tips:**\n- Quality over quantity (3-5 great projects)\n- Deploy everything live\n- Write clear README files\n- Include demo videos\n\nCheck out our **Project Ideas Generator** for more!" },
  { keywords: ["salary", "how much", "pay", "compensation", "earn"], response: "**Tech Salary Overview (US averages)** 💰\n\n| Role | Entry Level | Mid Level | Senior |\n|------|-----------|----------|--------|\n| Software Dev | $75K | $110K | $160K+ |\n| Data Scientist | $85K | $120K | $170K+ |\n| AI/ML Engineer | $95K | $140K | $200K+ |\n| DevOps Engineer | $80K | $120K | $165K+ |\n| Product Manager | $90K | $130K | $180K+ |\n| UX Designer | $70K | $100K | $140K+ |\n| Cybersecurity | $75K | $110K | $160K+ |\n\n💡 Salaries vary by location, company size, and skills. Remote work has expanded options!" },
  { keywords: ["freelance", "freelancing", "remote work", "work from home"], response: "**Freelancing & Remote Work Guide** 🏠\n\n💻 **Best Freelancing Fields:**\n- Web Development\n- Mobile App Development\n- UI/UX Design\n- Data Analysis\n- Content Writing\n- Digital Marketing\n\n🌐 **Platforms:**\n- Upwork, Freelancer, Toptal\n- Fiverr (for quick gigs)\n- LinkedIn (for B2B clients)\n\n💡 **Tips for Success:**\n- Build a strong portfolio first\n- Start with competitive pricing\n- Over-communicate with clients\n- Set clear boundaries & contracts\n- Save 30% for taxes\n\nMany tech roles now offer full-time remote options too!" },
  { keywords: ["learn", "start", "beginner", "how to start", "where to start", "getting started"], response: "**Getting Started in Tech — Step by Step** 🌟\n\n1️⃣ **Pick a direction** (don't overthink it!):\n   - Want to build websites? → Web Development\n   - Love data & math? → Data Science / AI\n   - Enjoy design? → UX/UI Design\n   - Like solving puzzles? → Software Engineering\n\n2️⃣ **Start learning** (free resources!):\n   - freeCodeCamp, The Odin Project\n   - CS50 (Harvard, free)\n   - YouTube tutorials\n\n3️⃣ **Build projects** from day one\n4️⃣ **Join communities** (Discord, Reddit, Twitter)\n5️⃣ **Be consistent** — 1 hour/day beats 10 hours once\n\nWhat area interests you most? I can give specific guidance!" },
  { keywords: ["certification", "certifications", "cert", "certificate"], response: "**Top Tech Certifications** 📜\n\n☁️ **Cloud:**\n- AWS Solutions Architect (most popular)\n- Google Cloud Professional\n- Azure Administrator\n\n🔒 **Security:**\n- CompTIA Security+\n- CISSP\n- CEH (Certified Ethical Hacker)\n\n📊 **Data:**\n- Google Data Analytics Certificate\n- IBM Data Science Certificate\n- Tableau Desktop Specialist\n\n💻 **Development:**\n- Meta Frontend/Backend Developer\n- AWS Developer Associate\n- Kubernetes (CKA/CKAD)\n\n💡 **Tip:** Certifications complement skills — they don't replace hands-on experience!" },
  { keywords: ["internship", "intern", "first job", "entry level", "no experience"], response: "**Landing Your First Tech Role** 🎯\n\n**Without Experience:**\n\n1️⃣ **Build 3-5 solid projects** — this IS your experience\n2️⃣ **Contribute to open source** — shows real collaboration\n3️⃣ **Create content** — blog posts, tutorials, videos\n4️⃣ **Network actively** — LinkedIn, meetups, hackathons\n5️⃣ **Apply strategically** — target startups & mid-size companies\n\n📝 **Resume Tips for Freshers:**\n- Lead with projects, not education\n- Include GitHub & deployed links\n- Highlight relevant coursework\n- Add hackathon wins\n\n💡 **Internship Platforms:**\n- LinkedIn, AngelList, Internshala\n- Company career pages directly\n- University career centers" },
  { keywords: ["burnout", "stress", "overwhelmed", "tired", "motivation"], response: "**Dealing with Burnout & Staying Motivated** 💪\n\nI hear you — the tech learning journey can feel overwhelming. Here's what helps:\n\n🧘 **Immediate Relief:**\n- Take a break (seriously, it's okay)\n- Go for a walk or exercise\n- Talk to someone about how you feel\n\n📋 **Long-term Strategies:**\n- Set small, achievable daily goals\n- Celebrate every win, no matter how small\n- Don't compare your progress to others\n- Build projects you genuinely enjoy\n- Take weekends off from learning\n\n🎯 **Remember:**\n- Learning isn't linear — plateaus are normal\n- Every expert was once a beginner\n- Consistency beats intensity\n- It's a marathon, not a sprint\n\nYou've got this! 🌟" },
  { keywords: ["python", "learn python"], response: "**Python Learning Roadmap** 🐍\n\n**Month 1: Basics**\n- Variables, data types, operators\n- Loops, conditionals, functions\n- Lists, dictionaries, strings\n- File I/O\n\n**Month 2: Intermediate**\n- OOP (classes, inheritance)\n- Error handling\n- Libraries (NumPy, Pandas)\n- APIs & web scraping\n\n**Month 3: Projects**\n- Automation scripts\n- Data analysis project\n- Web app with Flask/Django\n- API-based project\n\n🛠️ **Best Resources:**\n- Automate the Boring Stuff (free)\n- Python.org tutorial\n- Real Python\n- LeetCode (Python track)\n\nPython is the #1 language for AI, data science, and automation!" },
  { keywords: ["javascript", "learn javascript", "learn js"], response: "**JavaScript Learning Path** 🌐\n\n**Month 1: Fundamentals**\n- Variables (let, const), data types\n- Functions, arrays, objects\n- DOM manipulation\n- Events & callbacks\n\n**Month 2: Modern JS**\n- ES6+ features (arrow functions, destructuring)\n- Async/await & Promises\n- Fetch API\n- Modules & bundlers\n\n**Month 3: Framework**\n- React.js (most popular)\n- State management\n- Routing\n- API integration\n\n🛠️ **Resources:**\n- JavaScript.info (best free resource)\n- freeCodeCamp\n- The Odin Project\n- Frontend Masters\n\nJS is the language of the web — you can build anything with it!" },
  { keywords: ["machine learning", "ml", "deep learning"], response: "**Machine Learning Roadmap** 🤖\n\n**Phase 1 (1-3 months):**\n- Python + NumPy + Pandas\n- Statistics & Probability\n- Linear Algebra basics\n\n**Phase 2 (3-6 months):**\n- Supervised Learning (regression, classification)\n- Unsupervised Learning (clustering)\n- Scikit-learn library\n- Feature engineering\n\n**Phase 3 (6-12 months):**\n- Neural Networks & Deep Learning\n- CNNs (Computer Vision)\n- RNNs & Transformers (NLP)\n- TensorFlow or PyTorch\n\n**Phase 4 (12+ months):**\n- MLOps & deployment\n- Research papers\n- Specialization (NLP, CV, RL)\n\n📚 **Top Resources:**\n- Andrew Ng's ML Course\n- Fast.ai\n- Hands-On ML (O'Reilly)" },
  { keywords: ["which language", "programming language", "language should"], response: "Great question! Here's my recommendation based on your goal:\n\n🐍 **Python** — AI/ML, Data Science, Automation, Backend\n- Most beginner-friendly\n- Massive ecosystem\n\n🌐 **JavaScript** — Web Development (Full Stack)\n- Build websites & apps\n- Largest job market\n\n☕ **Java** — Enterprise, Android, Backend\n- Strong in corporate world\n- Great for large systems\n\n🦀 **Rust/Go** — Systems, Cloud, Performance\n- Growing demand\n- High-paying niche\n\n📱 **Swift/Kotlin** — iOS/Android native\n- If mobile is your passion\n\n**My advice:** Start with **Python** (most versatile) or **JavaScript** (most jobs). You can always learn more later!\n\nWhat kind of things do you want to build?" },
  { keywords: ["roadmap", "career path", "career roadmap"], response: "I'd love to help you plan your career path! 🗺️\n\nHere's what I suggest:\n\n1️⃣ Use our **Roadmap Generator** — it creates a personalized learning plan based on your skills and goals\n\n2️⃣ Try the **Skill Gap Analyzer** — see exactly what skills you need for your dream role\n\n3️⃣ Check the **Career Path Visualizer** — see the journey from beginner to expert\n\nOr just tell me:\n- What's your current background?\n- What career interests you?\n- How much time can you dedicate?\n\nI'll give you a quick personalized plan right here!" },
  { keywords: ["help", "what can you do", "features", "options"], response: "I'm your **AI Career Mentor**! Here's how I can help: 🤝\n\n💬 **Ask me about:**\n- Any tech career path (AI, Web Dev, Data Science, etc.)\n- Skills needed for specific roles\n- Learning timelines & roadmaps\n- Resume & interview tips\n- Salary expectations\n- Freelancing & remote work\n- Programming language recommendations\n- Project ideas for your portfolio\n- Certifications worth getting\n- Dealing with imposter syndrome\n\n🛠️ **Also try our tools:**\n- 📊 Resume Analyzer\n- 🗺️ Roadmap Generator\n- 🔍 Skill Gap Analyzer\n- 💡 Project Ideas Generator\n- 🎤 Interview Simulator\n\nJust ask anything career-related!" },
];

function findResponse(msg: string): string {
  const lower = msg.toLowerCase().trim();

  // Greetings
  if (greetings.some((g) => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!"))) {
    const replies = [
      "Hey there! 👋 Great to see you! What career questions are on your mind today?",
      "Hello! 😊 I'm your AI Career Mentor. How can I help you today? Ask me about any tech career, skills, or learning paths!",
      "Hi! 🌟 Ready to plan your career journey? Tell me what you're interested in!",
      "Hey! 👋 Welcome! Ask me anything about tech careers, skills, interviews, or learning paths!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Thanks
  if (thanks.some((t) => lower.includes(t))) {
    const replies = [
      "You're welcome! 😊 Feel free to ask anything else about your career journey!",
      "Happy to help! 🌟 Is there anything else you'd like to know?",
      "Glad I could help! Don't hesitate to come back with more questions! 💪",
      "Anytime! 😄 Your career growth matters. Ask me more whenever you need!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Farewells
  if (farewells.some((f) => lower.includes(f))) {
    const replies = [
      "Goodbye! 👋 Best of luck on your career journey! Come back anytime!",
      "See you later! 🚀 Keep learning and building — you've got this!",
      "Bye! 🌟 Remember: consistency is key. Good luck with your goals!",
      "Take care! 💪 Your future in tech is bright. Come chat anytime!",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Pattern matching
  for (const pattern of patterns) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.response;
    }
  }

  // Fallback — friendly & helpful
  const fallbacks = [
    "That's an interesting question! 🤔 While I'm best at career and tech guidance, here are some things I can help with:\n\n• **Career paths** — Ask about any tech role\n• **Skills & roadmaps** — What to learn and in what order\n• **Resume tips** — How to stand out\n• **Interview prep** — Practice and tips\n• **Salary info** — What to expect\n• **Project ideas** — Build your portfolio\n\nTry asking something like: \"How do I become a data scientist?\" or \"What skills do I need for web development?\"",
    "I'd love to help! 😊 Could you tell me more about what you're looking for? For example:\n\n• \"What career is best for me?\"\n• \"How do I learn Python?\"\n• \"What skills do I need for AI?\"\n• \"Give me resume tips\"\n• \"How to prepare for interviews?\"\n\nThe more specific your question, the better advice I can give!",
    "Great question! Let me point you in the right direction 🎯\n\nI can help with:\n🗺️ Career roadmaps for any tech role\n📊 Skill requirements and learning timelines\n💡 Project ideas to build your portfolio\n🎤 Interview and resume advice\n💰 Salary expectations\n\nWhat aspect of your career would you like to explore?",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi there! 👋 I'm your AI Career Mentor!\n\nI can help you with:\n🗺️ Career paths & roadmaps\n📊 Skill requirements\n💡 Project ideas\n🎤 Interview tips\n📄 Resume advice\n\nWhat would you like to explore today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || typing) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setTyping(true);

    // Simulate thinking time (shorter for greetings)
    const isShort = msg.length < 15;
    await new Promise((r) => setTimeout(r, isShort ? 600 : 1000 + Math.random() * 800));

    const reply = findResponse(msg);
    setMessages((p) => [...p, { role: "assistant", content: reply }]);
    setTyping(false);
  };

  const quickQuestions = [
    "How do I become an AI Engineer?",
    "Which programming language should I learn?",
    "Give me resume tips",
    "What career paths are in demand?",
  ];

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_25px_-5px_hsl(174_72%_50%/0.5)] hover:shadow-[0_0_35px_-5px_hsl(174_72%_50%/0.7)] transition-all ${open ? "scale-0" : "scale-100"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">Career AI Mentor</p>
                  <p className="text-xs text-primary">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-accent/20" : "bg-primary/20"}`}>
                      {m.role === "user" ? <User className="h-3.5 w-3.5 text-accent" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className={`rounded-xl px-3 py-2 text-sm whitespace-pre-line ${m.role === "user" ? "bg-accent/15 text-foreground" : "bg-secondary text-foreground"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="h-3.5 w-3.5 text-primary" /></div>
                  <div className="bg-secondary rounded-xl px-4 py-2 flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => send(q)} className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors truncate max-w-full">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about careers, skills, interviews..."
                  className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button type="submit" variant="hero" size="icon" className="h-9 w-9 shrink-0" disabled={typing}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
