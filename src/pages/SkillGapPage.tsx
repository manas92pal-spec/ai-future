import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, CheckCircle2, XCircle, BookOpen, Briefcase, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const careers = [
  "Data Scientist",
  "Software Developer",
  "AI Engineer",
  "Product Manager",
  "Cybersecurity Analyst",
  "UX Designer",
  "DevOps Engineer",
  "Full Stack Developer",
];

const careerData: Record<string, any> = {
  "Data Scientist": {
    required: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization", "Deep Learning", "TensorFlow", "Pandas", "NumPy"],
    courses: ["Andrew Ng's Machine Learning (Coursera)", "IBM Data Science Professional Certificate", "Statistics with Python (Coursera)", "Kaggle Learn"],
    projects: ["Build a recommendation system", "Predict housing prices with regression", "Customer churn analysis dashboard", "NLP sentiment analysis tool"],
    timeEstimate: "6–12 months",
  },
  "Software Developer": {
    required: ["JavaScript", "TypeScript", "React", "Node.js", "Git", "REST APIs", "SQL", "Data Structures", "Algorithms", "System Design"],
    courses: ["CS50 by Harvard", "The Odin Project", "freeCodeCamp Full Stack", "LeetCode Problem Solving"],
    projects: ["Build a full-stack e-commerce app", "Create a real-time chat application", "Develop a personal portfolio", "Open-source contribution"],
    timeEstimate: "4–8 months",
  },
  "AI Engineer": {
    required: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Computer Vision", "MLOps", "Docker", "Kubernetes", "Mathematics"],
    courses: ["Deep Learning Specialization (Coursera)", "Fast.ai Practical Deep Learning", "Stanford CS231n", "Hugging Face NLP Course"],
    projects: ["Build a chatbot with transformers", "Image classification model", "Text-to-speech system", "Deploy an ML model to production"],
    timeEstimate: "8–14 months",
  },
  "Product Manager": {
    required: ["Product Strategy", "User Research", "Data Analysis", "SQL", "Agile/Scrum", "Wireframing", "A/B Testing", "Communication", "Roadmap Planning", "Stakeholder Management"],
    courses: ["Product Management by Google (Coursera)", "Product School courses", "Inspired by Marty Cagan (Book)", "Analytics for PMs (Udemy)"],
    projects: ["Define a product roadmap for a startup", "Conduct user research study", "Write a PRD for a new feature", "Analyze product metrics dashboard"],
    timeEstimate: "3–6 months",
  },
  "Cybersecurity Analyst": {
    required: ["Network Security", "Linux", "Python", "Ethical Hacking", "SIEM Tools", "Firewalls", "Incident Response", "Cryptography", "Risk Assessment", "CompTIA Security+"],
    courses: ["CompTIA Security+ (Udemy)", "TryHackMe Learning Paths", "Hack The Box Academy", "Google Cybersecurity Certificate"],
    projects: ["Set up a home lab for penetration testing", "Build a vulnerability scanner", "Analyze network traffic with Wireshark", "Create a security audit report"],
    timeEstimate: "6–10 months",
  },
  "UX Designer": {
    required: ["Figma", "User Research", "Wireframing", "Prototyping", "Information Architecture", "Usability Testing", "Design Systems", "Typography", "Color Theory", "Accessibility"],
    courses: ["Google UX Design Certificate", "Interaction Design Foundation", "Figma Academy", "Don Norman's Design of Everyday Things (Book)"],
    projects: ["Redesign a popular app's UX", "Create a design system from scratch", "Conduct a usability study", "Design a mobile-first dashboard"],
    timeEstimate: "3–6 months",
  },
  "DevOps Engineer": {
    required: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS/GCP/Azure", "Terraform", "Ansible", "Git", "Python/Bash", "Monitoring (Prometheus/Grafana)"],
    courses: ["Docker Mastery (Udemy)", "Kubernetes for Beginners", "AWS Solutions Architect", "Linux Administration Bootcamp"],
    projects: ["Set up a CI/CD pipeline", "Deploy a microservices app on K8s", "Infrastructure as Code with Terraform", "Build a monitoring dashboard"],
    timeEstimate: "5–9 months",
  },
  "Full Stack Developer": {
    required: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB/PostgreSQL", "REST APIs", "Git", "Deployment"],
    courses: ["Full Stack Open (Helsinki)", "The Odin Project", "MERN Stack (Udemy)", "Next.js Documentation"],
    projects: ["Build a social media platform", "Create an e-commerce store", "Develop a project management tool", "Build a real-time collaboration app"],
    timeEstimate: "5–10 months",
  },
};

export default function SkillGapPage() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !userSkills.includes(s)) {
      setUserSkills([...userSkills, s]);
      setSkillInput("");
    }
  };

  const analyze = async () => {
    if (!selectedCareer || userSkills.length === 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    const data = careerData[selectedCareer];
    const matched = userSkills.filter((s) =>
      data.required.some((r: string) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
    );
    const missing = data.required.filter(
      (r: string) => !userSkills.some((s) => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

          {/* User Skills Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 mb-6">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Your Current Skills</h3>
            <div className="flex gap-2 mb-3">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button variant="hero" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs border border-primary/30 flex items-center gap-1">
                  {s}
                  <button onClick={() => setUserSkills(userSkills.filter((x) => x !== s))} className="hover:text-accent ml-1">&times;</button>
                </span>
              ))}
            </div>
          </motion.div>

          {selectedCareer && userSkills.length > 0 && (
            <div className="text-center mb-8">
              <Button variant="hero" size="lg" onClick={analyze} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : "Analyze Skill Gap"}
              </Button>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Match Score */}
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
                      <CheckCircle2 className="h-5 w-5 text-primary" /> Skills You Have
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
                      <p className="text-sm text-muted-foreground">None of your skills matched. Don't worry — everyone starts somewhere!</p>
                    )}
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-accent" /> Skills to Learn
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
