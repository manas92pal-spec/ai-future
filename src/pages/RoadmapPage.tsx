import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, BookOpen, Code, Wrench, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoadmapDisplay from "@/components/RoadmapDisplay";

const educationLevels = ["Class 10-12", "Undergraduate", "Graduate", "Post Graduate"];
const fieldOptions = ["Computer Science", "Electronics", "Mechanical", "Business", "Design", "Data Science", "Finance", "Other"];
const skillOptions = ["Python", "JavaScript", "Java", "C/C++", "HTML/CSS", "React", "Node.js", "SQL", "Machine Learning", "Data Analysis", "Git", "Docker", "Cloud (AWS/GCP)", "UI/UX Design", "Excel", "Communication"];
const interestOptions = ["Artificial Intelligence", "Web Development", "Mobile Development", "Cybersecurity", "Data Science", "Cloud Computing", "Game Development", "Blockchain", "Product Management", "Digital Marketing", "Robotics", "DevOps"];
const careerGoals = ["AI/ML Engineer", "Data Scientist", "Full Stack Developer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Cybersecurity Analyst", "Product Manager", "UX Designer", "Cloud Architect", "Mobile Developer", "Data Analyst"];
const learningStyles = ["Video Tutorials", "Hands-on Projects", "Online Courses", "Reading Documentation", "Mentorship"];

export default function RoadmapPage() {
  const [form, setForm] = useState({
    name: "", age: "", education: "", field: "", skills: [] as string[],
    interests: [] as string[], careerGoal: "", learningStyle: "", hoursPerDay: "2",
  });
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const toggleMulti = (key: "skills" | "interests", val: string) => {
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((v) => v !== val) : [...p[key], val],
    }));
  };

  const generateRoadmap = async () => {
    setLoading(true);
    // Simulate AI generation with structured mock data
    await new Promise((r) => setTimeout(r, 2500));
    
    const goal = form.careerGoal || "Software Developer";
    const currentSkills = form.skills.length > 0 ? form.skills : ["HTML/CSS"];
    
    setRoadmap({
      career: goal,
      overview: `Based on your profile, here's your personalized roadmap to become a ${goal}. This plan considers your current skills in ${currentSkills.join(", ")} and provides a structured path forward.`,
      currentSkills,
      requiredSkills: getRequiredSkills(goal),
      skillGap: getSkillGap(goal, currentSkills),
      stages: getStages(goal),
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI Career <span className="gradient-text">Roadmap Generator</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Tell us about yourself and let AI create your personalized career path.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!roadmap ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-8">
                <div className="grid gap-6">
                  {/* Name & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                      <input className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Age</label>
                      <input type="number" className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Your age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                    </div>
                  </div>

                  {/* Education & Field */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Education Level</label>
                      <select className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })}>
                        <option value="">Select level</option>
                        {educationLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Field of Study</label>
                      <select className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })}>
                        <option value="">Select field</option>
                        {fieldOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Current Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((s) => (
                        <button key={s} onClick={() => toggleMulti("skills", s)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.skills.includes(s) ? "border-primary bg-primary/20 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((i) => (
                        <button key={i} onClick={() => toggleMulti("interests", i)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.interests.includes(i) ? "border-accent bg-accent/20 text-accent" : "border-border bg-secondary/30 text-muted-foreground hover:border-accent/50"}`}>
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Career Goal & Learning Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Career Goal</label>
                      <select className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.careerGoal} onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}>
                        <option value="">Select career</option>
                        {careerGoals.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Learning Style</label>
                      <select className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" value={form.learningStyle} onChange={(e) => setForm({ ...form, learningStyle: e.target.value })}>
                        <option value="">Select style</option>
                        {learningStyles.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Hours per day */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Hours available per day: {form.hoursPerDay}h</label>
                    <input type="range" min="1" max="10" value={form.hoursPerDay} onChange={(e) => setForm({ ...form, hoursPerDay: e.target.value })} className="w-full accent-primary" />
                  </div>

                  <Button variant="hero" size="lg" onClick={generateRoadmap} disabled={loading} className="w-full text-base">
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating Your Roadmap...</> : <>Generate My Roadmap <ArrowRight className="ml-1 h-5 w-5" /></>}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RoadmapDisplay data={roadmap} onReset={() => setRoadmap(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Mock data functions
function getRequiredSkills(goal: string): string[] {
  const map: Record<string, string[]> = {
    "AI/ML Engineer": ["Python", "Machine Learning", "Deep Learning", "TensorFlow/PyTorch", "Mathematics", "Statistics", "Data Structures", "NLP", "Computer Vision", "MLOps"],
    "Data Scientist": ["Python", "R", "SQL", "Statistics", "Machine Learning", "Data Visualization", "Pandas", "Scikit-learn", "A/B Testing", "Big Data"],
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "TypeScript", "Docker", "CI/CD", "System Design"],
    "Frontend Developer": ["JavaScript", "React", "CSS", "HTML", "TypeScript", "Responsive Design", "Testing", "Git", "Performance", "Accessibility"],
    "Backend Developer": ["Python", "Java", "SQL", "REST APIs", "Docker", "System Design", "Microservices", "Caching", "Message Queues", "Security"],
    "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud (AWS/GCP)", "Terraform", "Monitoring", "Scripting", "Networking", "Security"],
    "Cybersecurity Analyst": ["Networking", "Linux", "Python", "SIEM Tools", "Penetration Testing", "Cryptography", "Incident Response", "Compliance", "Firewalls", "Forensics"],
    "Product Manager": ["User Research", "Analytics", "SQL", "Communication", "Roadmapping", "A/B Testing", "Agile", "Data Analysis", "Wireframing", "Strategy"],
  };
  return map[goal] || ["Programming", "Problem Solving", "Data Structures", "Algorithms", "System Design", "Git", "Communication", "Cloud Basics", "Databases", "Testing"];
}

function getSkillGap(goal: string, current: string[]): { have: string[]; need: string[]; } {
  const required = getRequiredSkills(goal);
  const have = current.filter((s) => required.some((r) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())));
  const need = required.filter((r) => !current.some((s) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase())));
  return { have, need };
}

function getStages(goal: string) {
  const stagesMap: Record<string, ReturnType<typeof getStages>> = {
    "AI/ML Engineer": [
      { title: "Stage 1: Math & Python Foundations", timeline: "0–3 Months", skills: ["Python programming", "Linear Algebra & Calculus", "Probability & Statistics"], projects: ["NumPy matrix operations library", "Statistical analysis dashboard", "Data visualization with Matplotlib"], tools: ["Python", "Jupyter Notebook", "NumPy", "Pandas"], resources: ["Khan Academy Math", "MIT OpenCourseWare", "Python for Data Science (Coursera)"] },
      { title: "Stage 2: Machine Learning Core", timeline: "3–6 Months", skills: ["Supervised & Unsupervised Learning", "Feature Engineering", "Model Evaluation & Tuning"], projects: ["House price predictor", "Customer segmentation system", "Spam classifier with NLP"], tools: ["Scikit-learn", "XGBoost", "Kaggle", "Weights & Biases"], resources: ["Andrew Ng ML Course", "Hands-On ML (O'Reilly)", "Kaggle Competitions"] },
      { title: "Stage 3: Deep Learning & Specialization", timeline: "6–12 Months", skills: ["Neural Networks & CNNs", "RNNs & Transformers", "NLP or Computer Vision specialization"], projects: ["Image classifier (CNN)", "Chatbot with Transformers", "Object detection system"], tools: ["TensorFlow", "PyTorch", "Hugging Face", "CUDA"], resources: ["Deep Learning Specialization (Coursera)", "Fast.ai", "Papers With Code"] },
      { title: "Stage 4: MLOps & Production", timeline: "1–2 Years", skills: ["Model deployment & serving", "ML pipeline automation", "A/B testing & monitoring"], projects: ["End-to-end ML pipeline", "Model serving API with FastAPI", "Automated retraining system"], tools: ["MLflow", "Docker", "Kubernetes", "AWS SageMaker"], resources: ["Made With ML", "Full Stack Deep Learning", "ML Engineering (Andriy Burkov)"] },
    ],
    "Data Scientist": [
      { title: "Stage 1: Data Fundamentals", timeline: "0–3 Months", skills: ["Python & R basics", "SQL & Database querying", "Descriptive Statistics"], projects: ["Exploratory data analysis on public datasets", "SQL dashboard for sales data", "Census data visualization"], tools: ["Python", "R Studio", "PostgreSQL", "Excel"], resources: ["DataCamp", "Mode Analytics SQL Tutorial", "Statistics for Data Science (Coursera)"] },
      { title: "Stage 2: Analysis & Visualization", timeline: "3–6 Months", skills: ["Data wrangling with Pandas", "Data visualization (Matplotlib, Seaborn, Plotly)", "Hypothesis testing & A/B testing"], projects: ["Interactive dashboard with Plotly", "A/B test analysis report", "Web scraping & analysis pipeline"], tools: ["Pandas", "Seaborn", "Plotly", "Tableau"], resources: ["Python for Data Analysis (O'Reilly)", "Storytelling with Data", "Kaggle Learn"] },
      { title: "Stage 3: Machine Learning for Data Science", timeline: "6–12 Months", skills: ["Regression & Classification", "Clustering & Dimensionality Reduction", "Time Series Forecasting"], projects: ["Customer churn prediction model", "Recommendation engine", "Stock price forecasting"], tools: ["Scikit-learn", "Statsmodels", "Prophet", "Spark"], resources: ["ISLR Book", "Applied DS with Python (Coursera)", "Towards Data Science blog"] },
      { title: "Stage 4: Advanced & Business Impact", timeline: "1–2 Years", skills: ["Big Data tools (Spark, Hadoop)", "Deep Learning for analytics", "Communication & stakeholder management"], projects: ["Big data pipeline with PySpark", "NLP sentiment analysis for business", "End-to-end data product"], tools: ["Apache Spark", "Airflow", "Looker", "dbt"], resources: ["Data Science for Business (O'Reilly)", "Google Data Analytics Certificate", "Industry conferences"] },
    ],
    "Full Stack Developer": [
      { title: "Stage 1: Web Foundations", timeline: "0–3 Months", skills: ["HTML5 & CSS3", "JavaScript ES6+", "Responsive Design"], projects: ["Personal portfolio website", "Landing page clone", "CSS animation gallery"], tools: ["VS Code", "Chrome DevTools", "Figma", "Git"], resources: ["freeCodeCamp", "The Odin Project", "MDN Web Docs"] },
      { title: "Stage 2: Frontend Framework", timeline: "3–6 Months", skills: ["React.js & component architecture", "State management (Redux/Zustand)", "TypeScript"], projects: ["Task management app (React)", "E-commerce storefront", "Real-time chat UI"], tools: ["React", "TypeScript", "Tailwind CSS", "Vite"], resources: ["React.dev docs", "Frontend Masters", "Epic React (Kent C. Dodds)"] },
      { title: "Stage 3: Backend & Databases", timeline: "6–12 Months", skills: ["Node.js & Express/Fastify", "PostgreSQL & MongoDB", "Authentication & Authorization"], projects: ["REST API with JWT auth", "Blog platform with CRUD", "Real-time app with WebSockets"], tools: ["Node.js", "PostgreSQL", "Prisma", "Postman"], resources: ["Node.js docs", "The Net Ninja", "Fullstack Open (Helsinki)"] },
      { title: "Stage 4: DevOps & Production", timeline: "1–2 Years", skills: ["Docker & containerization", "CI/CD pipelines", "Cloud deployment (AWS/Vercel)"], projects: ["Microservices architecture app", "CI/CD pipeline for portfolio", "SaaS product MVP"], tools: ["Docker", "GitHub Actions", "AWS/Vercel", "Nginx"], resources: ["Docker docs", "AWS Certified Developer", "System Design Primer"] },
    ],
    "Frontend Developer": [
      { title: "Stage 1: HTML, CSS & JS Mastery", timeline: "0–3 Months", skills: ["Semantic HTML5", "CSS Grid & Flexbox", "JavaScript DOM manipulation"], projects: ["Responsive landing page", "Interactive quiz app", "Animated portfolio site"], tools: ["VS Code", "Chrome DevTools", "CodePen", "Git"], resources: ["freeCodeCamp", "CSS-Tricks", "JavaScript.info"] },
      { title: "Stage 2: React & Modern Tooling", timeline: "3–6 Months", skills: ["React hooks & patterns", "Component libraries (shadcn/ui)", "Build tools (Vite, Webpack)"], projects: ["Dashboard with charts", "E-commerce product page", "Social media feed clone"], tools: ["React", "Tailwind CSS", "Storybook", "Figma"], resources: ["React.dev", "Frontend Masters", "UI.dev"] },
      { title: "Stage 3: Advanced Frontend", timeline: "6–12 Months", skills: ["TypeScript advanced patterns", "Testing (Jest, Cypress)", "Performance optimization"], projects: ["Design system library", "PWA with offline support", "Accessible component library"], tools: ["TypeScript", "Jest", "Lighthouse", "Playwright"], resources: ["Testing Library docs", "Web.dev", "Smashing Magazine"] },
      { title: "Stage 4: Specialization & Leadership", timeline: "1–2 Years", skills: ["Micro-frontends", "Animation (Framer Motion, GSAP)", "Accessibility (WCAG)"], projects: ["Micro-frontend architecture", "Animation-heavy portfolio", "Open source UI library"], tools: ["Framer Motion", "Next.js", "Turborepo", "Chromatic"], resources: ["Patterns.dev", "Frontend conferences", "A11y Project"] },
    ],
    "Backend Developer": [
      { title: "Stage 1: Programming & Databases", timeline: "0–3 Months", skills: ["Python or Java or Go", "SQL & relational databases", "Data structures & algorithms"], projects: ["CLI task manager", "REST API for todo app", "Database schema design project"], tools: ["Python/Java", "PostgreSQL", "SQLite", "Terminal"], resources: ["CS50", "LeetCode", "SQLZoo"] },
      { title: "Stage 2: APIs & Architecture", timeline: "3–6 Months", skills: ["RESTful API design", "Authentication (JWT, OAuth)", "ORM & database migrations"], projects: ["User auth system with OAuth", "Blog API with pagination", "File upload service"], tools: ["FastAPI/Spring Boot", "Prisma/SQLAlchemy", "Postman", "Redis"], resources: ["REST API Design Rulebook", "Auth0 docs", "Real Python"] },
      { title: "Stage 3: Scalability & Infrastructure", timeline: "6–12 Months", skills: ["Message queues (RabbitMQ, Kafka)", "Caching strategies", "Microservices patterns"], projects: ["Event-driven microservice", "Rate limiter middleware", "Distributed task queue"], tools: ["Docker", "RabbitMQ", "Redis", "gRPC"], resources: ["Designing Data-Intensive Applications", "Martin Fowler's blog", "ByteByteGo"] },
      { title: "Stage 4: Cloud & DevOps Integration", timeline: "1–2 Years", skills: ["Cloud services (AWS/GCP)", "Kubernetes & orchestration", "Monitoring & observability"], projects: ["Cloud-native app on AWS", "Kubernetes deployment pipeline", "Observability dashboard"], tools: ["AWS", "Kubernetes", "Prometheus", "Terraform"], resources: ["AWS Solutions Architect cert", "Cloud Native Patterns", "SRE Book (Google)"] },
    ],
    "DevOps Engineer": [
      { title: "Stage 1: Linux & Scripting", timeline: "0–3 Months", skills: ["Linux administration", "Bash scripting", "Networking fundamentals"], projects: ["Automated backup script", "Server setup automation", "Network monitoring tool"], tools: ["Linux", "Bash", "SSH", "Vim"], resources: ["Linux Academy", "LPIC-1 cert prep", "Networking basics (Cisco)"] },
      { title: "Stage 2: Containerization & CI/CD", timeline: "3–6 Months", skills: ["Docker & Docker Compose", "CI/CD pipelines", "Infrastructure as Code basics"], projects: ["Dockerize a multi-service app", "GitHub Actions CI/CD pipeline", "Automated testing pipeline"], tools: ["Docker", "GitHub Actions", "Jenkins", "GitLab CI"], resources: ["Docker docs", "GitHub Actions docs", "DevOps Roadmap (roadmap.sh)"] },
      { title: "Stage 3: Orchestration & Cloud", timeline: "6–12 Months", skills: ["Kubernetes management", "Cloud platforms (AWS/GCP/Azure)", "Terraform & IaC"], projects: ["Kubernetes cluster deployment", "Multi-cloud infrastructure with Terraform", "Auto-scaling application"], tools: ["Kubernetes", "Terraform", "Helm", "AWS EKS"], resources: ["Kubernetes docs", "Terraform Up & Running", "AWS DevOps cert"] },
      { title: "Stage 4: SRE & Observability", timeline: "1–2 Years", skills: ["Monitoring & alerting", "Incident response", "Chaos engineering"], projects: ["Full observability stack", "Chaos testing framework", "SLA/SLO dashboard"], tools: ["Prometheus", "Grafana", "PagerDuty", "Datadog"], resources: ["SRE Book (Google)", "Observability Engineering", "ChaosConf talks"] },
    ],
    "Cybersecurity Analyst": [
      { title: "Stage 1: IT & Networking Foundations", timeline: "0–3 Months", skills: ["Networking (TCP/IP, DNS, HTTP)", "Linux system administration", "Basic scripting (Python/Bash)"], projects: ["Home lab network setup", "Packet capture analysis", "Port scanner in Python"], tools: ["Wireshark", "Nmap", "Linux VM", "VirtualBox"], resources: ["CompTIA Network+", "TryHackMe", "Professor Messer"] },
      { title: "Stage 2: Security Fundamentals", timeline: "3–6 Months", skills: ["Security concepts (CIA triad)", "Vulnerability assessment", "SIEM & log analysis"], projects: ["Vulnerability scan report", "SIEM dashboard setup", "Phishing detection system"], tools: ["Nessus", "Splunk", "Snort", "OpenVAS"], resources: ["CompTIA Security+", "Cybrary", "SANS Reading Room"] },
      { title: "Stage 3: Offensive & Defensive Security", timeline: "6–12 Months", skills: ["Penetration testing", "Incident response", "Malware analysis basics"], projects: ["CTF competition participation", "Penetration test report", "Incident response playbook"], tools: ["Metasploit", "Burp Suite", "Kali Linux", "YARA"], resources: ["Hack The Box", "OSCP prep", "Blue Team Handbook"] },
      { title: "Stage 4: Advanced Security & Compliance", timeline: "1–2 Years", skills: ["Cloud security (AWS/Azure)", "Compliance frameworks (ISO, NIST)", "Threat hunting & forensics"], projects: ["Cloud security audit", "Compliance assessment report", "Digital forensics investigation"], tools: ["AWS Security Hub", "Autopsy", "ELK Stack", "CrowdStrike"], resources: ["CISSP prep", "AWS Security Specialty", "DFIR training"] },
    ],
    "Product Manager": [
      { title: "Stage 1: Product Thinking Basics", timeline: "0–3 Months", skills: ["User research methods", "Problem framing", "Basic analytics & SQL"], projects: ["User interview report", "Competitive analysis document", "Feature prioritization framework"], tools: ["Notion", "Google Analytics", "SQL", "Miro"], resources: ["Inspired (Marty Cagan)", "Product School YouTube", "Strategyzer"] },
      { title: "Stage 2: Roadmapping & Execution", timeline: "3–6 Months", skills: ["Product roadmap creation", "Agile & Scrum methodology", "Wireframing & prototyping"], projects: ["Product roadmap for a startup idea", "Sprint planning simulation", "Low-fi prototype for an app"], tools: ["Jira", "Figma", "Aha!", "Linear"], resources: ["Scrum Guide", "PM Exercises", "Figma tutorials"] },
      { title: "Stage 3: Data-Driven Decisions", timeline: "6–12 Months", skills: ["A/B testing & experimentation", "Funnel analysis", "KPI definition & tracking"], projects: ["A/B test design & analysis", "Metrics dashboard for a product", "Growth experiment plan"], tools: ["Amplitude", "Mixpanel", "Looker", "Optimizely"], resources: ["Lean Analytics", "Reforge", "Product Analytics (Coursera)"] },
      { title: "Stage 4: Strategy & Leadership", timeline: "1–2 Years", skills: ["Product strategy & vision", "Stakeholder management", "Go-to-market planning"], projects: ["Product strategy document", "Go-to-market plan", "Portfolio management framework"], tools: ["Notion", "Confluence", "Productboard", "Slack"], resources: ["Good Strategy Bad Strategy", "Lenny's Newsletter", "Product conferences"] },
    ],
    "UX Designer": [
      { title: "Stage 1: Design Foundations", timeline: "0–3 Months", skills: ["Design principles & typography", "Color theory & layout", "User-centered design thinking"], projects: ["Redesign a mobile app screen", "Style guide creation", "Design thinking workshop"], tools: ["Figma", "Adobe XD", "Canva", "Miro"], resources: ["Google UX Design Certificate", "Refactoring UI", "Laws of UX"] },
      { title: "Stage 2: Research & Prototyping", timeline: "3–6 Months", skills: ["User research & interviews", "Wireframing & information architecture", "Interactive prototyping"], projects: ["User research study", "Wireframe for an e-commerce app", "Clickable prototype"], tools: ["Figma", "Maze", "UserTesting", "Optimal Workshop"], resources: ["Don't Make Me Think", "Nielsen Norman Group", "UX Design Institute"] },
      { title: "Stage 3: UI Design & Systems", timeline: "6–12 Months", skills: ["UI design patterns", "Design systems & component libraries", "Responsive & adaptive design"], projects: ["Complete design system", "Mobile app UI design", "Dashboard design"], tools: ["Figma", "Storybook", "Zeplin", "Abstract"], resources: ["Material Design guidelines", "Apple HIG", "Designbetter.co"] },
      { title: "Stage 4: UX Strategy & Leadership", timeline: "1–2 Years", skills: ["UX metrics & analytics", "Accessibility (WCAG)", "Design leadership"], projects: ["Accessibility audit & improvements", "UX metrics dashboard", "Design portfolio case studies"], tools: ["Hotjar", "FullStory", "Contrast checkers", "axe DevTools"], resources: ["Measuring the User Experience", "A11y Project", "UX conferences"] },
    ],
    "Cloud Architect": [
      { title: "Stage 1: Cloud & Linux Basics", timeline: "0–3 Months", skills: ["Linux fundamentals", "Cloud computing concepts", "Networking basics"], projects: ["Deploy a website on AWS EC2", "S3 static hosting setup", "VPC network design"], tools: ["AWS Free Tier", "Linux", "SSH", "AWS CLI"], resources: ["AWS Cloud Practitioner", "Linux Academy", "A Cloud Guru"] },
      { title: "Stage 2: Core Cloud Services", timeline: "3–6 Months", skills: ["Compute, storage, & database services", "IAM & security best practices", "Serverless architecture"], projects: ["Serverless API with Lambda", "Auto-scaling web app", "Multi-region database setup"], tools: ["AWS Lambda", "DynamoDB", "CloudFormation", "S3"], resources: ["AWS Solutions Architect Associate", "Serverless Framework docs", "AWS Well-Architected"] },
      { title: "Stage 3: Infrastructure as Code & DevOps", timeline: "6–12 Months", skills: ["Terraform & CloudFormation", "CI/CD for infrastructure", "Container orchestration"], projects: ["Multi-environment Terraform config", "EKS cluster deployment", "Blue-green deployment pipeline"], tools: ["Terraform", "Kubernetes", "Ansible", "GitHub Actions"], resources: ["Terraform Up & Running", "Kubernetes patterns", "AWS DevOps cert"] },
      { title: "Stage 4: Enterprise Architecture", timeline: "1–2 Years", skills: ["Multi-cloud strategy", "Cost optimization", "Disaster recovery & high availability"], projects: ["Multi-cloud architecture design", "Cost optimization audit", "DR plan & failover testing"], tools: ["AWS", "GCP", "Azure", "CloudHealth"], resources: ["AWS Solutions Architect Professional", "Cloud Architecture Patterns", "re:Invent talks"] },
    ],
    "Mobile Developer": [
      { title: "Stage 1: Programming Foundations", timeline: "0–3 Months", skills: ["JavaScript/TypeScript or Swift/Kotlin", "UI layout fundamentals", "Version control with Git"], projects: ["Simple calculator app", "To-do list app", "Weather app with API"], tools: ["VS Code/Xcode/Android Studio", "Git", "Expo", "Simulator"], resources: ["React Native docs", "Swift Playgrounds", "Kotlin Koans"] },
      { title: "Stage 2: Mobile Framework Mastery", timeline: "3–6 Months", skills: ["React Native or Flutter or SwiftUI", "Navigation & state management", "API integration & data fetching"], projects: ["Social media feed app", "E-commerce mobile app", "Chat app with real-time updates"], tools: ["React Native", "Redux/Zustand", "Axios", "Firebase"], resources: ["React Native docs", "Flutter.dev", "CS193p (Stanford)"] },
      { title: "Stage 3: Advanced Mobile Development", timeline: "6–12 Months", skills: ["Push notifications & background tasks", "Offline storage & sync", "App performance optimization"], projects: ["Offline-first note-taking app", "Fitness tracker with health APIs", "Location-based service app"], tools: ["SQLite", "Firebase", "Detox/Appium", "Flipper"], resources: ["Mobile Dev Weekly", "React Native Performance", "WWDC/Google I/O talks"] },
      { title: "Stage 4: Publishing & Growth", timeline: "1–2 Years", skills: ["App Store optimization", "Analytics & crash reporting", "CI/CD for mobile"], projects: ["Published app on App Store/Play Store", "A/B tested feature rollout", "Cross-platform app with shared codebase"], tools: ["Fastlane", "Firebase Analytics", "Sentry", "TestFlight"], resources: ["App Store Review Guidelines", "Mobile Growth Handbook", "Indie dev communities"] },
    ],
    "Data Analyst": [
      { title: "Stage 1: Spreadsheets & SQL", timeline: "0–3 Months", skills: ["Advanced Excel/Google Sheets", "SQL querying & joins", "Basic statistics"], projects: ["Sales data analysis in Excel", "SQL queries on sample database", "Statistical summary report"], tools: ["Excel", "Google Sheets", "PostgreSQL", "SQLite"], resources: ["Google Data Analytics Certificate", "SQLZoo", "Khan Academy Statistics"] },
      { title: "Stage 2: Python & Visualization", timeline: "3–6 Months", skills: ["Python for data analysis", "Data visualization (Matplotlib, Seaborn)", "Data cleaning & wrangling"], projects: ["Exploratory data analysis notebook", "Interactive dashboard with Plotly", "Data cleaning pipeline"], tools: ["Python", "Pandas", "Matplotlib", "Jupyter"], resources: ["Python for Data Analysis (O'Reilly)", "DataCamp", "Kaggle Learn"] },
      { title: "Stage 3: BI Tools & Storytelling", timeline: "6–12 Months", skills: ["Tableau or Power BI", "Data storytelling & presentation", "A/B testing fundamentals"], projects: ["Business dashboard in Tableau", "A/B test analysis presentation", "Automated reporting pipeline"], tools: ["Tableau", "Power BI", "Looker", "Google Data Studio"], resources: ["Storytelling with Data", "Tableau Public Gallery", "Measure What Matters"] },
      { title: "Stage 4: Advanced Analytics", timeline: "1–2 Years", skills: ["Predictive analytics basics", "Big data tools", "Domain expertise development"], projects: ["Predictive model for business KPI", "Big data analysis with Spark", "Industry-specific analytics project"], tools: ["Scikit-learn", "Apache Spark", "Airflow", "dbt"], resources: ["Data Science for Business", "Analytics Vidhya", "Industry conferences"] },
    ],
  };
  return stagesMap[goal] || [
    { title: "Stage 1: Foundations", timeline: "0–3 Months", skills: ["Core programming", "Problem solving", "Version control"], projects: ["Portfolio website", "CLI tool", "Open source contribution"], tools: ["VS Code", "Git", "Terminal"], resources: ["freeCodeCamp", "CS50", "The Odin Project"] },
    { title: "Stage 2: Intermediate", timeline: "3–6 Months", skills: ["Framework proficiency", "Database management", "API development"], projects: ["Full-stack app", "REST API", "Data pipeline"], tools: ["PostgreSQL", "Docker", "Postman"], resources: ["Udemy", "Official docs", "YouTube"] },
    { title: "Stage 3: Advanced", timeline: "6–12 Months", skills: ["System design", "Performance tuning", "Cloud deployment"], projects: ["Scalable service", "Real-time app", "Production project"], tools: ["AWS/GCP", "Kubernetes", "Monitoring"], resources: ["System Design Primer", "Cloud certs", "Tech blogs"] },
    { title: "Stage 4: Career Ready", timeline: "1–2 Years", skills: ["Interview prep", "Open source", "Leadership"], projects: ["Capstone project", "OSS contributions", "Freelance work"], tools: ["LeetCode", "LinkedIn", "Portfolio"], resources: ["Mock interviews", "Networking", "Conferences"] },
  ];
}
