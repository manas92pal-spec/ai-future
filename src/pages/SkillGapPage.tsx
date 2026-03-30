import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, CheckCircle2, XCircle, BookOpen, Briefcase, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allSkills = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
  "HTML/CSS", "React", "Angular", "Vue.js", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring Boot",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase",
  "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "Bash",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision",
  "Data Analysis", "Pandas", "NumPy", "Scikit-learn", "R", "Tableau", "Power BI", "Excel",
  "REST APIs", "GraphQL", "Microservices", "System Design", "Data Structures", "Algorithms",
  "Figma", "Adobe XD", "UI/UX Design", "Wireframing", "Prototyping",
  "Agile/Scrum", "JIRA", "Communication", "Leadership", "Problem Solving", "Teamwork",
  "Network Security", "Ethical Hacking", "Cryptography", "SIEM Tools", "Firewalls", "Penetration Testing",
  "CI/CD", "Terraform", "Ansible", "Jenkins", "GitHub Actions",
  "Product Strategy", "User Research", "A/B Testing", "Roadmap Planning", "Stakeholder Management",
  "Statistics", "Probability", "Linear Algebra", "Calculus",
  "Blockchain", "Solidity", "Web3", "Smart Contracts",
  "Unity", "Unreal Engine", "Game Design", "3D Modeling",
  "Android", "iOS", "React Native", "Flutter", "Mobile Development",
  "SEO", "Content Marketing", "Digital Marketing", "Google Analytics",
  "Photoshop", "Illustrator", "After Effects", "Video Editing",
  "Technical Writing", "Public Speaking", "Project Management",
];

const careers = [
  "Data Scientist", "Software Developer", "AI Engineer", "Product Manager", "Cybersecurity Analyst",
  "UX Designer", "DevOps Engineer", "Full Stack Developer", "Mobile App Developer", "Cloud Architect",
  "Machine Learning Engineer", "Data Analyst", "Backend Developer", "Frontend Developer",
  "Blockchain Developer", "Game Developer", "QA Engineer", "Site Reliability Engineer",
  "Technical Writer", "Digital Marketer", "Business Analyst", "Database Administrator",
  "Network Engineer", "Embedded Systems Engineer", "AR/VR Developer",
];

const careerData: Record<string, any> = {
  "Data Scientist": {
    required: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Analysis", "Deep Learning", "TensorFlow", "Pandas", "NumPy", "Tableau", "Probability"],
    courses: ["Andrew Ng's Machine Learning (Coursera)", "IBM Data Science Professional Certificate", "Statistics with Python (Coursera)", "Kaggle Learn", "Google Data Analytics Certificate", "DataCamp Data Scientist Track"],
    projects: ["Build a recommendation system", "Predict housing prices with regression", "Customer churn analysis dashboard", "NLP sentiment analysis tool", "Time series forecasting model", "A/B test analysis platform"],
    timeEstimate: "6–12 months",
  },
  "Software Developer": {
    required: ["JavaScript", "TypeScript", "React", "Node.js", "Git", "REST APIs", "SQL", "Data Structures", "Algorithms", "System Design", "Docker", "CI/CD"],
    courses: ["CS50 by Harvard", "The Odin Project", "freeCodeCamp Full Stack", "LeetCode Problem Solving", "System Design Primer", "Clean Code by Robert Martin (Book)"],
    projects: ["Build a full-stack e-commerce app", "Create a real-time chat application", "Develop a personal portfolio", "Open-source contribution", "Build a task management tool", "Create a REST API with authentication"],
    timeEstimate: "4–8 months",
  },
  "AI Engineer": {
    required: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Computer Vision", "Machine Learning", "Docker", "Kubernetes", "Linear Algebra", "Statistics", "MLOps"],
    courses: ["Deep Learning Specialization (Coursera)", "Fast.ai Practical Deep Learning", "Stanford CS231n", "Hugging Face NLP Course", "MLOps Specialization", "Mathematics for ML (Imperial College)"],
    projects: ["Build a chatbot with transformers", "Image classification model", "Text-to-speech system", "Deploy an ML model to production", "Build a RAG application", "Fine-tune an LLM"],
    timeEstimate: "8–14 months",
  },
  "Product Manager": {
    required: ["Product Strategy", "User Research", "Data Analysis", "SQL", "Agile/Scrum", "Wireframing", "A/B Testing", "Communication", "Roadmap Planning", "Stakeholder Management", "JIRA", "Excel"],
    courses: ["Product Management by Google (Coursera)", "Product School courses", "Inspired by Marty Cagan (Book)", "Analytics for PMs (Udemy)", "Reforge Growth Series", "SVPG Workshops"],
    projects: ["Define a product roadmap for a startup", "Conduct user research study", "Write a PRD for a new feature", "Analyze product metrics dashboard", "Run a mock A/B test", "Create a go-to-market strategy"],
    timeEstimate: "3–6 months",
  },
  "Cybersecurity Analyst": {
    required: ["Network Security", "Linux", "Python", "Ethical Hacking", "SIEM Tools", "Firewalls", "Cryptography", "Penetration Testing", "Bash", "Problem Solving", "Communication", "Risk Assessment"],
    courses: ["CompTIA Security+ (Udemy)", "TryHackMe Learning Paths", "Hack The Box Academy", "Google Cybersecurity Certificate", "OSCP Preparation", "SANS SEC504"],
    projects: ["Set up a home lab for penetration testing", "Build a vulnerability scanner", "Analyze network traffic with Wireshark", "Create a security audit report", "Build a password cracker", "Develop an IDS system"],
    timeEstimate: "6–10 months",
  },
  "UX Designer": {
    required: ["Figma", "User Research", "Wireframing", "Prototyping", "UI/UX Design", "Adobe XD", "Communication", "Problem Solving", "Teamwork", "HTML/CSS", "Accessibility", "Design Systems"],
    courses: ["Google UX Design Certificate", "Interaction Design Foundation", "Figma Academy", "Don Norman's Design of Everyday Things (Book)", "Nielsen Norman Group Courses", "Coursera UI/UX Specialization"],
    projects: ["Redesign a popular app's UX", "Create a design system from scratch", "Conduct a usability study", "Design a mobile-first dashboard", "Build an accessible portfolio", "Design a SaaS product from concept to prototype"],
    timeEstimate: "3–6 months",
  },
  "DevOps Engineer": {
    required: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Ansible", "Git", "Python", "Bash", "Jenkins", "GitHub Actions"],
    courses: ["Docker Mastery (Udemy)", "Kubernetes for Beginners", "AWS Solutions Architect", "Linux Administration Bootcamp", "Terraform Up and Running (Book)", "GitHub Actions CI/CD"],
    projects: ["Set up a CI/CD pipeline", "Deploy a microservices app on K8s", "Infrastructure as Code with Terraform", "Build a monitoring dashboard", "Automate server provisioning", "Create a self-healing infrastructure"],
    timeEstimate: "5–9 months",
  },
  "Full Stack Developer": {
    required: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "REST APIs", "Git", "Docker", "System Design", "MongoDB"],
    courses: ["Full Stack Open (Helsinki)", "The Odin Project", "MERN Stack (Udemy)", "Next.js Documentation", "Prisma ORM Tutorial", "Fullstack Academy Bootcamp"],
    projects: ["Build a social media platform", "Create an e-commerce store", "Develop a project management tool", "Build a real-time collaboration app", "Create a blog platform with CMS", "Build a job board application"],
    timeEstimate: "5–10 months",
  },
  "Mobile App Developer": {
    required: ["React Native", "Flutter", "JavaScript", "TypeScript", "Mobile Development", "iOS", "Android", "REST APIs", "Git", "Firebase", "UI/UX Design", "Problem Solving"],
    courses: ["React Native - The Practical Guide (Udemy)", "Flutter & Dart Complete Guide", "iOS Development with Swift (Apple)", "Android Basics with Kotlin (Google)", "CS50 Mobile", "Mobile App Design (Coursera)"],
    projects: ["Build a weather app", "Create a fitness tracker", "Develop a food delivery app", "Build a social networking app", "Create an expense tracker", "Build a real-time messaging app"],
    timeEstimate: "4–8 months",
  },
  "Cloud Architect": {
    required: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Linux", "Networking", "System Design", "Microservices", "CI/CD", "Python"],
    courses: ["AWS Solutions Architect Professional", "Azure Solutions Architect Expert", "GCP Professional Cloud Architect", "Cloud Design Patterns (Book)", "Terraform Associate Certification", "Cloud Security Alliance Training"],
    projects: ["Design a multi-region cloud architecture", "Migrate a monolith to microservices", "Build a serverless application", "Create a disaster recovery plan", "Implement cloud cost optimization", "Design a zero-trust security architecture"],
    timeEstimate: "8–14 months",
  },
  "Machine Learning Engineer": {
    required: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Docker", "Kubernetes", "SQL", "Data Structures", "Algorithms", "Statistics", "MLOps"],
    courses: ["Machine Learning Engineering for Production (Coursera)", "Made With ML", "Full Stack Deep Learning", "Designing ML Systems (Book)", "MLflow Tutorial", "Weights & Biases Course"],
    projects: ["Build an end-to-end ML pipeline", "Deploy a model with FastAPI", "Create a feature store", "Build an A/B testing framework", "Implement model monitoring", "Create an AutoML tool"],
    timeEstimate: "8–12 months",
  },
  "Data Analyst": {
    required: ["SQL", "Excel", "Python", "Tableau", "Power BI", "Data Analysis", "Statistics", "Pandas", "Communication", "Problem Solving", "R", "Google Analytics"],
    courses: ["Google Data Analytics Certificate", "SQL for Data Analysis (Mode)", "Tableau Desktop Specialist", "Power BI Guided Learning", "Excel Skills for Business (Coursera)", "Statistics for Data Science (edX)"],
    projects: ["Build a sales analytics dashboard", "Analyze customer segmentation", "Create a financial reporting tool", "Web traffic analysis report", "Survey data analysis project", "Build an automated reporting pipeline"],
    timeEstimate: "3–6 months",
  },
  "Backend Developer": {
    required: ["Python", "Node.js", "Java", "SQL", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Docker", "Git", "System Design", "Microservices"],
    courses: ["Backend Developer Roadmap (roadmap.sh)", "Node.js Complete Guide (Udemy)", "Java Spring Boot Masterclass", "Database Design (Stanford)", "API Design Patterns (Book)", "Microservices with Docker"],
    projects: ["Build a REST API with authentication", "Create a microservices architecture", "Build a real-time notification system", "Develop a payment processing system", "Create a message queue system", "Build a rate limiter"],
    timeEstimate: "4–8 months",
  },
  "Frontend Developer": {
    required: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Vue.js", "Next.js", "Git", "REST APIs", "Figma", "Accessibility", "Performance Optimization", "Testing"],
    courses: ["Frontend Masters Learning Paths", "React Documentation", "CSS for JavaScript Developers", "Testing JavaScript (Kent C. Dodds)", "Web Performance Fundamentals", "Accessibility (a11y) Course"],
    projects: ["Build a component library", "Create an accessible portfolio", "Build a dashboard with data visualization", "Create a progressive web app", "Build a design system", "Develop a real-time collaborative editor"],
    timeEstimate: "3–7 months",
  },
  "Blockchain Developer": {
    required: ["Solidity", "JavaScript", "Web3", "Smart Contracts", "Blockchain", "React", "Node.js", "Cryptography", "Git", "Data Structures", "Python", "Rust"],
    courses: ["CryptoZombies", "Ethereum Developer Bootcamp", "Solidity by Example", "Blockchain Specialization (Coursera)", "Alchemy University", "Patrick Collins Solidity Course"],
    projects: ["Build a decentralized voting app", "Create an NFT marketplace", "Develop a DeFi protocol", "Build a token launchpad", "Create a DAO governance system", "Build a cross-chain bridge"],
    timeEstimate: "6–10 months",
  },
  "Game Developer": {
    required: ["C++", "C#", "Unity", "Unreal Engine", "Game Design", "3D Modeling", "Mathematics", "Data Structures", "Git", "Problem Solving", "Physics", "Algorithms"],
    courses: ["Unity Learn", "Unreal Engine Learning Portal", "CS50 Game Development", "Game Design (Coursera)", "3D Math Primer for Graphics", "Blender Fundamentals"],
    projects: ["Build a 2D platformer", "Create a 3D first-person game", "Develop a mobile puzzle game", "Build a multiplayer game", "Create a game engine from scratch", "Design a VR experience"],
    timeEstimate: "6–12 months",
  },
  "QA Engineer": {
    required: ["Python", "JavaScript", "Git", "SQL", "REST APIs", "Selenium", "Cypress", "JIRA", "Agile/Scrum", "Problem Solving", "Communication", "Linux"],
    courses: ["ISTQB Foundation Level", "Selenium WebDriver with Python", "Cypress End-to-End Testing", "API Testing with Postman", "Performance Testing with JMeter", "Test Automation University"],
    projects: ["Build a test automation framework", "Create API test suites", "Develop a CI/CD testing pipeline", "Build a performance testing tool", "Create a bug tracking system", "Automate mobile app testing"],
    timeEstimate: "3–6 months",
  },
  "Site Reliability Engineer": {
    required: ["Linux", "Python", "Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Monitoring", "Bash", "System Design", "Networking", "Git"],
    courses: ["Google SRE Book (Free)", "SRE Workbook", "Linux Foundation SysAdmin", "Prometheus & Grafana Monitoring", "Chaos Engineering (O'Reilly)", "Incident Management Course"],
    projects: ["Build an observability platform", "Create a chaos engineering tool", "Implement SLOs and error budgets", "Build an incident response system", "Create auto-scaling infrastructure", "Develop a deployment pipeline"],
    timeEstimate: "6–10 months",
  },
  "Technical Writer": {
    required: ["Technical Writing", "HTML/CSS", "Git", "Markdown", "Communication", "Problem Solving", "API Documentation", "User Research", "SEO", "Content Strategy"],
    courses: ["Google Technical Writing Course (Free)", "Write the Docs Community", "API Documentation (Tom Johnson)", "Content Strategy (Coursera)", "Information Architecture Course"],
    projects: ["Write API documentation", "Create a developer guide", "Build a documentation site", "Write technical blog posts", "Create video tutorials", "Develop a style guide"],
    timeEstimate: "2–4 months",
  },
  "Digital Marketer": {
    required: ["SEO", "Content Marketing", "Digital Marketing", "Google Analytics", "Social Media Marketing", "Email Marketing", "PPC Advertising", "Communication", "Data Analysis", "A/B Testing", "Excel", "Copywriting"],
    courses: ["Google Digital Marketing Certificate", "HubSpot Inbound Marketing", "Meta Social Media Marketing", "SEO Specialization (Coursera)", "Google Ads Certification", "Content Marketing Institute"],
    projects: ["Create an SEO audit report", "Build a social media strategy", "Run a PPC campaign", "Develop an email marketing funnel", "Create a content calendar", "Build a marketing analytics dashboard"],
    timeEstimate: "3–5 months",
  },
  "Business Analyst": {
    required: ["SQL", "Excel", "Data Analysis", "Communication", "Problem Solving", "JIRA", "Agile/Scrum", "Wireframing", "Stakeholder Management", "Power BI", "Tableau", "Project Management"],
    courses: ["IIBA ECBA Certification", "Business Analysis Fundamentals (Udemy)", "SQL for Business Analysts", "Agile Business Analysis", "Requirements Engineering (Coursera)", "Lean Six Sigma Yellow Belt"],
    projects: ["Write a business requirements document", "Create process flow diagrams", "Build a KPI dashboard", "Conduct a gap analysis", "Create a cost-benefit analysis", "Develop a business case"],
    timeEstimate: "3–6 months",
  },
  "Database Administrator": {
    required: ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Linux", "Python", "Bash", "AWS", "Performance Tuning", "Backup & Recovery", "Data Modeling", "Security"],
    courses: ["Oracle DBA Certification", "PostgreSQL Administration", "MongoDB University", "AWS Database Specialty", "SQL Performance Explained (Book)", "Database Reliability Engineering"],
    projects: ["Set up a high-availability database cluster", "Create a backup and recovery system", "Optimize query performance", "Build a data migration tool", "Implement database monitoring", "Design a sharding strategy"],
    timeEstimate: "5–9 months",
  },
  "Network Engineer": {
    required: ["Networking", "Linux", "Firewalls", "Cisco IOS", "Python", "Bash", "Cloud Networking", "Network Security", "DNS/DHCP", "Load Balancing", "VPN", "Troubleshooting"],
    courses: ["CompTIA Network+", "CCNA Certification", "Network Automation with Python", "AWS Advanced Networking", "Palo Alto Firewall Training", "SDN Fundamentals"],
    projects: ["Set up a corporate network lab", "Automate network configuration", "Build a network monitoring system", "Design a secure campus network", "Implement SD-WAN solution", "Create a network troubleshooting toolkit"],
    timeEstimate: "5–10 months",
  },
  "Embedded Systems Engineer": {
    required: ["C", "C++", "Python", "Microcontrollers", "RTOS", "Electronics", "I2C/SPI/UART", "Linux", "Assembly", "PCB Design", "Debugging", "IoT"],
    courses: ["Embedded Systems Shape the World (edX)", "ARM Cortex-M Programming", "FreeRTOS Tutorial", "PCB Design with KiCad", "IoT Specialization (Coursera)", "Embedded Linux"],
    projects: ["Build a weather station with sensors", "Create a smart home controller", "Develop a drone flight controller", "Build a real-time data logger", "Create a wearable health monitor", "Build a CAN bus communication system"],
    timeEstimate: "6–12 months",
  },
  "AR/VR Developer": {
    required: ["Unity", "C#", "3D Modeling", "C++", "Unreal Engine", "Mathematics", "Computer Vision", "Spatial Computing", "UI/UX Design", "Shader Programming", "Git", "Physics"],
    courses: ["Unity XR Development", "Meta Quest Developer Hub", "Apple Vision Pro Development", "3D Graphics Programming", "ARCore/ARKit Fundamentals", "Shader Programming Basics"],
    projects: ["Build an AR furniture placement app", "Create a VR training simulation", "Develop a mixed reality game", "Build a virtual classroom", "Create an AR navigation app", "Design an immersive data visualization"],
    timeEstimate: "6–12 months",
  },
};

export default function SkillGapPage() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const filteredSkills = allSkills.filter(
    (s) => s.toLowerCase().includes(searchQuery.toLowerCase()) && !userSkills.includes(s)
  );

  const toggleSkill = (skill: string) => {
    if (userSkills.includes(skill)) {
      setUserSkills(userSkills.filter((s) => s !== skill));
    } else {
      setUserSkills([...userSkills, skill]);
    }
    setResult(null);
  };

  const analyze = async () => {
    if (!selectedCareer || userSkills.length === 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    const data = careerData[selectedCareer];
    if (!data) { setLoading(false); return; }
    const matched = userSkills.filter((s) =>
      data.required.some((r: string) => r.toLowerCase() === s.toLowerCase())
    );
    const missing = data.required.filter(
      (r: string) => !userSkills.some((s) => r.toLowerCase() === s.toLowerCase())
    );
    setResult({ matched, missing, courses: data.courses, projects: data.projects, timeEstimate: data.timeEstimate });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Skill Gap Analyzer</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Compare your skills against your dream career and get a personalized learning plan.
            </p>
          </motion.div>

          {/* Career Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" /> Select Target Career
            </h3>
            <div className="flex flex-wrap gap-2">
              {careers.map((c) => (
                <button
                  key={c}
                  onClick={() => { setSelectedCareer(c); setResult(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCareer === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Skill Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mb-6">
            <h3 className="font-display text-lg font-semibold mb-2 text-foreground">Your Current Skills</h3>
            <p className="text-xs text-muted-foreground mb-3">Click to select the skills you already have</p>

            {/* Selected skills */}
            {userSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-border/50">
                {userSkills.map((s) => (
                  <button key={s} onClick={() => toggleSkill(s)}
                    className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/40 flex items-center gap-1 hover:bg-primary/30 transition-colors">
                    {s} <span className="text-primary/60">✕</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
            />

            {/* Available skills grid */}
            <div className="max-h-48 overflow-y-auto rounded-lg">
              <div className="flex flex-wrap gap-1.5">
                {filteredSkills.slice(0, 60).map((s) => (
                  <button key={s} onClick={() => toggleSkill(s)}
                    className="px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-border/50">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{userSkills.length} skills selected</p>
          </motion.div>

          {selectedCareer && userSkills.length > 0 && (
            <div className="text-center mb-8">
              <Button variant="hero" size="lg" onClick={analyze} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : "Analyze Skill Gap"}
              </Button>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card p-6 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Skill Match Score</p>
                  <p className="font-display text-5xl font-bold text-primary">
                    {Math.round((result.matched.length / (result.matched.length + result.missing.length)) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Estimated time to job-ready: <span className="text-accent font-semibold">{result.timeEstimate}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" /> Skills You Have ({result.matched.length})
                    </h3>
                    {result.matched.length > 0 ? (
                      <ul className="space-y-2">
                        {result.matched.map((s: string) => (
                          <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">None matched yet — everyone starts somewhere!</p>
                    )}
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-accent" /> Skills to Learn ({result.missing.length})
                    </h3>
                    <ul className="space-y-2">
                      {result.missing.map((s: string) => (
                        <li key={s} className="text-sm text-muted-foreground flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-accent shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Recommended Courses
                  </h3>
                  <ul className="space-y-2">
                    {result.courses.map((c: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" /> Recommended Projects
                  </h3>
                  <ul className="space-y-2">
                    {result.projects.map((p: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Briefcase className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <Button variant="hero-outline" onClick={() => { setResult(null); setUserSkills([]); setSelectedCareer(null); }}>
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
