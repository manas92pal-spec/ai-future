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
  return [
    {
      title: "Stage 1: Foundations",
      timeline: "0–3 Months",
      skills: ["Core programming fundamentals", "Data Structures & Algorithms", "Version Control (Git)"],
      projects: ["Build a CLI tool", "Create a personal portfolio", "Contribute to open source"],
      tools: ["VS Code", "Git/GitHub", "Terminal"],
      resources: ["freeCodeCamp", "CS50", "The Odin Project"],
    },
    {
      title: "Stage 2: Intermediate Skills",
      timeline: "3–6 Months",
      skills: ["Framework proficiency", "Database management", "API development"],
      projects: ["Full-stack CRUD app", "REST API with auth", "Data pipeline project"],
      tools: ["PostgreSQL", "Docker", "Postman"],
      resources: ["Udemy courses", "Official documentation", "YouTube tutorials"],
    },
    {
      title: "Stage 3: Advanced Skills",
      timeline: "6–12 Months",
      skills: ["System design", "Performance optimization", "Cloud deployment"],
      projects: ["Scalable microservice", "Real-time application", "Production-grade project"],
      tools: ["AWS/GCP", "Kubernetes", "Monitoring tools"],
      resources: ["System Design Primer", "Cloud certifications", "Tech blogs"],
    },
    {
      title: "Stage 4: Industry Preparation",
      timeline: "1–3 Years",
      skills: ["Interview preparation", "Open source contributions", "Leadership & communication"],
      projects: ["Capstone portfolio project", "Open source contributions", "Freelance/internship work"],
      tools: ["LeetCode", "LinkedIn", "Portfolio website"],
      resources: ["Mock interviews", "Networking events", "Industry conferences"],
    },
  ];
}
