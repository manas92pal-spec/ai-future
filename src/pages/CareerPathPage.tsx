import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, DollarSign, BookOpen, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mkStage = (title: string, duration: string, skills: string[], salary: string, resources: string[]) => ({ title, duration, skills, salary, resources });

const careerPaths: Record<string, { stages: any[] }> = {
  "AI Engineer": { stages: [
    mkStage("Student", "0–6 mo", ["Python", "Math", "Linear Algebra"], "$0 (Learning)", ["Khan Academy", "3Blue1Brown", "Python.org"]),
    mkStage("ML Beginner", "6–12 mo", ["Machine Learning", "Scikit-learn", "Pandas"], "$0–$30K", ["Andrew Ng ML", "Kaggle", "Fast.ai"]),
    mkStage("AI Developer", "1–2 yr", ["Deep Learning", "TensorFlow/PyTorch", "NLP"], "$70K–$100K", ["Stanford CS231n", "Hugging Face", "Papers With Code"]),
    mkStage("Senior AI Engineer", "2–4 yr", ["MLOps", "System Design", "Research"], "$120K–$180K", ["MLOps Community", "ArXiv", "Conferences"]),
    mkStage("AI Lead / Researcher", "5+ yr", ["Team Leadership", "Novel Research", "Architecture"], "$180K–$300K+", ["PhD Programs", "Research Labs"]),
  ]},
  "Full Stack Developer": { stages: [
    mkStage("Beginner", "0–3 mo", ["HTML", "CSS", "JavaScript"], "$0 (Learning)", ["freeCodeCamp", "The Odin Project"]),
    mkStage("Frontend Dev", "3–8 mo", ["React", "TypeScript", "Tailwind"], "$0–$25K", ["React Docs", "Full Stack Open"]),
    mkStage("Full Stack Dev", "8–18 mo", ["Node.js", "Databases", "REST APIs"], "$60K–$90K", ["Node.js Docs", "PostgreSQL Tutorial"]),
    mkStage("Senior Developer", "2–4 yr", ["System Design", "CI/CD", "Cloud"], "$100K–$150K", ["AWS Cert", "System Design Primer"]),
    mkStage("Tech Lead", "5+ yr", ["Architecture", "Leadership", "Mentoring"], "$150K–$250K+", ["Staff Engineer Book"]),
  ]},
  "Data Scientist": { stages: [
    mkStage("Student", "0–3 mo", ["Python", "Statistics", "SQL"], "$0", ["Khan Academy", "Codecademy"]),
    mkStage("Data Analyst", "3–9 mo", ["Pandas", "Visualization", "Excel"], "$45K–$65K", ["Kaggle", "Google Data Analytics"]),
    mkStage("Junior DS", "9–18 mo", ["ML", "Feature Engineering", "A/B Testing"], "$70K–$95K", ["Scikit-learn", "DataCamp"]),
    mkStage("Senior DS", "2–4 yr", ["Deep Learning", "NLP", "Spark"], "$110K–$160K", ["Fast.ai", "MLflow"]),
    mkStage("Principal DS", "5+ yr", ["Strategy", "Research", "Cross-team Impact"], "$160K–$280K+", ["Conferences", "Mentorship"]),
  ]},
  "Cybersecurity Analyst": { stages: [
    mkStage("Beginner", "0–3 mo", ["Networking", "Linux", "Security Concepts"], "$0", ["CompTIA Network+", "TryHackMe"]),
    mkStage("SOC Analyst", "3–9 mo", ["SIEM", "Log Analysis", "Incident Response"], "$50K–$70K", ["Splunk", "Blue Team Labs"]),
    mkStage("Pen Tester", "1–2 yr", ["Ethical Hacking", "Python", "Web Security"], "$75K–$110K", ["Hack The Box", "OSCP"]),
    mkStage("Senior Security Eng", "2–4 yr", ["Cloud Security", "Threat Modeling", "Architecture"], "$120K–$170K", ["AWS Security", "CISSP"]),
    mkStage("CISO", "5+ yr", ["Risk Management", "Compliance", "Leadership"], "$170K–$300K+", ["Executive Ed"]),
  ]},
  "Product Manager": { stages: [
    mkStage("Associate PM", "0–6 mo", ["User Research", "Analytics", "Communication"], "$55K–$75K", ["Product School", "Inspired (Book)"]),
    mkStage("Product Manager", "6–18 mo", ["Roadmapping", "A/B Testing", "SQL"], "$80K–$120K", ["Amplitude", "Mixpanel"]),
    mkStage("Senior PM", "2–4 yr", ["Strategy", "Stakeholders", "P&L"], "$130K–$180K", ["Reforge", "Lenny's Newsletter"]),
    mkStage("Director of Product", "4–6 yr", ["Vision Setting", "Org Design", "Exec Comm"], "$180K–$250K+", ["Executive Coaching"]),
    mkStage("VP / CPO", "7+ yr", ["Company Strategy", "M&A", "Culture"], "$250K–$400K+", ["Advisory Boards"]),
  ]},
  "UX Designer": { stages: [
    mkStage("Beginner", "0–3 mo", ["Figma Basics", "Design Principles", "Color Theory"], "$0", ["Google UX Cert", "Figma Academy"]),
    mkStage("Junior UX", "3–9 mo", ["Wireframing", "Prototyping", "User Research"], "$45K–$65K", ["IDF Courses", "Nielsen Norman"]),
    mkStage("UX Designer", "9–18 mo", ["Design Systems", "Usability Testing", "Accessibility"], "$65K–$95K", ["Storybook", "A11y Project"]),
    mkStage("Senior UX", "2–4 yr", ["Strategy", "Motion Design", "Leadership"], "$95K–$140K", ["Framer Tutorials", "Design Leadership"]),
    mkStage("Design Director", "5+ yr", ["Brand Strategy", "Team Management", "Vision"], "$140K–$200K+", ["IDEO Courses"]),
  ]},
  "DevOps Engineer": { stages: [
    mkStage("Beginner", "0–3 mo", ["Linux", "Git", "Bash"], "$0", ["Linux Journey", "Pro Git"]),
    mkStage("Junior DevOps", "3–9 mo", ["Docker", "CI/CD", "Cloud Basics"], "$55K–$75K", ["Docker Docs", "GitHub Actions"]),
    mkStage("DevOps Engineer", "9–18 mo", ["Kubernetes", "Terraform", "Monitoring"], "$80K–$120K", ["K8s Docs", "Terraform Tutorials"]),
    mkStage("Senior DevOps", "2–4 yr", ["Architecture", "Security", "Cost Optimization"], "$120K–$170K", ["AWS Well-Architected"]),
    mkStage("Platform Lead", "5+ yr", ["Platform Engineering", "Strategy", "Leadership"], "$170K–$250K+", ["Platform Eng Community"]),
  ]},
  "Mobile App Developer": { stages: [
    mkStage("Beginner", "0–3 mo", ["JavaScript", "React Basics", "UI Fundamentals"], "$0", ["React Docs", "Codecademy"]),
    mkStage("Junior Mobile Dev", "3–9 mo", ["React Native", "Flutter", "APIs"], "$45K–$65K", ["RN Docs", "Flutter Codelabs"]),
    mkStage("Mobile Developer", "9–18 mo", ["Native Modules", "State Management", "Testing"], "$70K–$100K", ["Redux Docs", "Detox Testing"]),
    mkStage("Senior Mobile Dev", "2–4 yr", ["Performance", "Architecture", "CI/CD"], "$100K–$150K", ["WWDC", "Google I/O"]),
    mkStage("Mobile Lead", "5+ yr", ["Team Management", "Platform Strategy", "Mentoring"], "$150K–$220K+", ["Tech Conferences"]),
  ]},
  "Cloud Architect": { stages: [
    mkStage("Beginner", "0–6 mo", ["Linux", "Networking", "Cloud Basics"], "$0", ["AWS Free Tier", "Cloud Academy"]),
    mkStage("Cloud Engineer", "6–12 mo", ["AWS/GCP/Azure", "Docker", "IaC"], "$70K–$95K", ["Cloud Certifications"]),
    mkStage("Senior Cloud Eng", "1–3 yr", ["Kubernetes", "Microservices", "Security"], "$100K–$140K", ["K8s Certified"]),
    mkStage("Cloud Architect", "3–5 yr", ["Multi-cloud", "Cost Optimization", "Compliance"], "$140K–$190K", ["Well-Architected Framework"]),
    mkStage("Principal Architect", "5+ yr", ["Enterprise Strategy", "Innovation", "Leadership"], "$190K–$300K+", ["re:Invent", "Advisory"]),
  ]},
  "Machine Learning Engineer": { stages: [
    mkStage("Student", "0–6 mo", ["Python", "Statistics", "Math"], "$0", ["Coursera ML", "3Blue1Brown"]),
    mkStage("Junior ML Eng", "6–12 mo", ["Scikit-learn", "Feature Eng", "SQL"], "$60K–$85K", ["Kaggle", "Made With ML"]),
    mkStage("ML Engineer", "1–2 yr", ["TensorFlow/PyTorch", "Pipelines", "Docker"], "$90K–$130K", ["Full Stack DL"]),
    mkStage("Senior ML Eng", "2–4 yr", ["MLOps", "Model Serving", "System Design"], "$130K–$180K", ["MLflow", "Kubeflow"]),
    mkStage("Staff ML Eng", "5+ yr", ["Research", "Architecture", "Leadership"], "$180K–$280K+", ["NeurIPS", "ICML"]),
  ]},
  "Blockchain Developer": { stages: [
    mkStage("Beginner", "0–3 mo", ["JavaScript", "Crypto Basics", "Git"], "$0", ["CryptoZombies", "Ethereum Docs"]),
    mkStage("Smart Contract Dev", "3–9 mo", ["Solidity", "Web3.js", "Testing"], "$50K–$80K", ["Alchemy University"]),
    mkStage("Blockchain Dev", "9–18 mo", ["DeFi", "Security Auditing", "Subgraphs"], "$80K–$130K", ["OpenZeppelin", "Foundry"]),
    mkStage("Senior Blockchain Dev", "2–4 yr", ["Protocol Design", "Layer 2", "Cross-chain"], "$130K–$200K", ["ETH Research"]),
    mkStage("Protocol Architect", "5+ yr", ["Token Economics", "Governance", "Leadership"], "$200K–$400K+", ["ETH Global"]),
  ]},
  "Game Developer": { stages: [
    mkStage("Beginner", "0–3 mo", ["C# Basics", "Unity Fundamentals", "2D Design"], "$0", ["Unity Learn", "Brackeys"]),
    mkStage("Junior Game Dev", "3–9 mo", ["3D Mechanics", "Physics", "UI Systems"], "$40K–$60K", ["Game Dev TV", "CS50 Games"]),
    mkStage("Game Developer", "9–18 mo", ["Networking", "AI Systems", "Optimization"], "$60K–$90K", ["Unreal Engine Docs"]),
    mkStage("Senior Game Dev", "2–4 yr", ["Engine Architecture", "Shader Programming", "Tools Dev"], "$90K–$140K", ["GDC Talks"]),
    mkStage("Lead / Director", "5+ yr", ["Team Management", "Game Design Vision", "Production"], "$140K–$220K+", ["Game Industry Events"]),
  ]},
  "Data Analyst": { stages: [
    mkStage("Beginner", "0–3 mo", ["Excel", "SQL Basics", "Statistics"], "$0", ["Google Data Analytics"]),
    mkStage("Junior Analyst", "3–9 mo", ["Python/R", "Visualization", "Dashboards"], "$40K–$55K", ["Tableau Public", "Mode SQL"]),
    mkStage("Data Analyst", "9–18 mo", ["Advanced SQL", "A/B Testing", "Storytelling"], "$55K–$80K", ["DataCamp", "Storytelling with Data"]),
    mkStage("Senior Analyst", "2–4 yr", ["Predictive Models", "Strategy", "Leadership"], "$80K–$110K", ["Analytics Conferences"]),
    mkStage("Analytics Manager", "5+ yr", ["Team Management", "Business Strategy", "Executive Reporting"], "$110K–$160K+", ["MBA Programs"]),
  ]},
  "QA Engineer": { stages: [
    mkStage("Beginner", "0–3 mo", ["Manual Testing", "Bug Reporting", "Test Cases"], "$0", ["ISTQB Foundation", "Test Automation U"]),
    mkStage("Junior QA", "3–9 mo", ["Selenium", "API Testing", "CI/CD"], "$40K–$55K", ["Postman Academy"]),
    mkStage("QA Engineer", "9–18 mo", ["Cypress", "Performance Testing", "Mobile Testing"], "$55K–$80K", ["Cypress Docs", "JMeter"]),
    mkStage("Senior QA", "2–4 yr", ["Test Architecture", "Strategy", "Automation Frameworks"], "$80K–$115K", ["Quality Engineering"]),
    mkStage("QA Lead / Manager", "5+ yr", ["Team Management", "Quality Strategy", "DevOps Integration"], "$115K–$160K+", ["QA Conferences"]),
  ]},
  "Backend Developer": { stages: [
    mkStage("Beginner", "0–3 mo", ["Python/Node.js", "HTTP Basics", "SQL"], "$0", ["roadmap.sh", "MDN"]),
    mkStage("Junior Backend", "3–9 mo", ["REST APIs", "Auth", "ORM"], "$50K–$70K", ["Express Docs", "Django Tutorial"]),
    mkStage("Backend Developer", "9–18 mo", ["Microservices", "Caching", "Message Queues"], "$70K–$100K", ["Redis Docs", "RabbitMQ"]),
    mkStage("Senior Backend", "2–4 yr", ["System Design", "Scalability", "Security"], "$100K–$150K", ["DDIA Book"]),
    mkStage("Principal Engineer", "5+ yr", ["Architecture", "Technical Vision", "Mentoring"], "$150K–$230K+", ["Staff Eng Book"]),
  ]},
  "Frontend Developer": { stages: [
    mkStage("Beginner", "0–3 mo", ["HTML", "CSS", "JavaScript"], "$0", ["freeCodeCamp", "MDN"]),
    mkStage("Junior Frontend", "3–9 mo", ["React/Vue", "TypeScript", "Responsive Design"], "$45K–$65K", ["React Docs", "CSS Tricks"]),
    mkStage("Frontend Developer", "9–18 mo", ["State Mgmt", "Testing", "Performance"], "$65K–$95K", ["Kent C. Dodds", "Web.dev"]),
    mkStage("Senior Frontend", "2–4 yr", ["Architecture", "Design Systems", "Accessibility"], "$95K–$140K", ["Frontend Masters"]),
    mkStage("Frontend Lead", "5+ yr", ["Technical Vision", "Team Management", "Innovation"], "$140K–$200K+", ["JSConf", "CSSConf"]),
  ]},
};

export default function CareerPathPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPath, setShowPath] = useState(false);

  const generate = async (career: string) => {
    setSelected(career);
    setLoading(true);
    setShowPath(false);
    await new Promise((r) => setTimeout(r, 1500));
    setShowPath(true);
    setLoading(false);
  };

  const path = selected ? careerPaths[selected] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Career Path Visualizer</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              See your complete career journey from beginner to expert with skills, salary, and resources.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Choose a Career Path ({Object.keys(careerPaths).length} available)</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(careerPaths).map((c) => (
                <Button key={c} size="sm" variant={selected === c ? "hero" : "outline"} onClick={() => generate(c)} disabled={loading}>
                  {c}
                </Button>
              ))}
            </div>
          </motion.div>

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Generating career path...</p>
            </div>
          )}

          <AnimatePresence>
            {showPath && path && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0">
                {path.stages.map((stage: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative">
                    {i < path.stages.length - 1 && (
                      <div className="absolute left-6 top-full w-0.5 h-6 bg-gradient-to-b from-primary/50 to-primary/10 z-0" />
                    )}
                    <div className="glass-card p-6 mb-6 relative">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${
                            i === 0 ? "bg-primary/20 text-primary glow-border" : "bg-secondary text-muted-foreground"
                          }`}>{i + 1}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display text-xl font-bold text-foreground">{stage.title}</h3>
                            {i < path.stages.length - 1 && <ArrowRight className="h-4 w-4 text-primary hidden sm:block" />}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {stage.duration}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">Skills</p>
                              <div className="flex flex-wrap gap-1">
                                {stage.skills.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>)}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider flex items-center gap-1"><DollarSign className="h-3 w-3" /> Salary</p>
                              <p className="text-sm text-foreground font-medium">{stage.salary}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1"><BookOpen className="h-3 w-3" /> Resources</p>
                              <ul className="text-xs text-muted-foreground space-y-0.5">
                                {stage.resources.map((r: string) => <li key={r}>• {r}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center mt-4">
                  <Button variant="hero-outline" onClick={() => { setSelected(null); setShowPath(false); }}>Explore Another Path</Button>
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
