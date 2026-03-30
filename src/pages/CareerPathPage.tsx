import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, DollarSign, BookOpen, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const careerPaths: Record<string, any> = {
  "AI Engineer": {
    stages: [
      { title: "Student", duration: "0–6 months", skills: ["Python", "Math & Statistics", "Linear Algebra"], salary: "$0 (Learning)", resources: ["Khan Academy", "3Blue1Brown", "Python.org"] },
      { title: "ML Beginner", duration: "6–12 months", skills: ["Machine Learning", "Scikit-learn", "Pandas/NumPy"], salary: "$0–$30K (Internship)", resources: ["Andrew Ng ML Course", "Kaggle Learn", "Fast.ai"] },
      { title: "AI Developer", duration: "1–2 years", skills: ["Deep Learning", "TensorFlow/PyTorch", "NLP"], salary: "$70K–$100K", resources: ["Stanford CS231n", "Hugging Face", "Papers With Code"] },
      { title: "Senior AI Engineer", duration: "2–4 years", skills: ["MLOps", "System Design", "Research"], salary: "$120K–$180K", resources: ["MLOps Community", "ArXiv Papers", "Conferences"] },
      { title: "AI Lead / Researcher", duration: "5+ years", skills: ["Team Leadership", "Novel Research", "Architecture"], salary: "$180K–$300K+", resources: ["PhD Programs", "Research Labs", "Open Source Leadership"] },
    ],
  },
  "Full Stack Developer": {
    stages: [
      { title: "Beginner", duration: "0–3 months", skills: ["HTML", "CSS", "JavaScript Basics"], salary: "$0 (Learning)", resources: ["freeCodeCamp", "The Odin Project", "MDN Web Docs"] },
      { title: "Frontend Dev", duration: "3–8 months", skills: ["React", "TypeScript", "Tailwind CSS"], salary: "$0–$25K (Internship)", resources: ["React Docs", "Full Stack Open", "Scrimba"] },
      { title: "Full Stack Dev", duration: "8–18 months", skills: ["Node.js", "Databases", "REST APIs"], salary: "$60K–$90K", resources: ["Node.js Docs", "PostgreSQL Tutorial", "Docker Docs"] },
      { title: "Senior Developer", duration: "2–4 years", skills: ["System Design", "CI/CD", "Cloud Services"], salary: "$100K–$150K", resources: ["AWS Certification", "System Design Primer", "Tech Blogs"] },
      { title: "Tech Lead / Architect", duration: "5+ years", skills: ["Architecture", "Leadership", "Mentoring"], salary: "$150K–$250K+", resources: ["Staff Engineer Book", "Conference Speaking", "Open Source"] },
    ],
  },
  "Data Scientist": {
    stages: [
      { title: "Student", duration: "0–3 months", skills: ["Python", "Statistics", "SQL"], salary: "$0 (Learning)", resources: ["Khan Academy", "Mode Analytics SQL", "Codecademy"] },
      { title: "Data Analyst", duration: "3–9 months", skills: ["Pandas", "Data Visualization", "Excel"], salary: "$45K–$65K", resources: ["Kaggle", "Tableau Public", "Google Data Analytics"] },
      { title: "Junior Data Scientist", duration: "9–18 months", skills: ["Machine Learning", "Feature Engineering", "A/B Testing"], salary: "$70K–$95K", resources: ["Scikit-learn Docs", "Coursera ML", "DataCamp"] },
      { title: "Senior Data Scientist", duration: "2–4 years", skills: ["Deep Learning", "NLP", "Big Data (Spark)"], salary: "$110K–$160K", resources: ["Fast.ai", "Spark Documentation", "MLflow"] },
      { title: "Principal / Lead DS", duration: "5+ years", skills: ["Strategy", "Research", "Cross-team Impact"], salary: "$160K–$280K+", resources: ["Research Publications", "Conferences", "Mentorship"] },
    ],
  },
  "Cybersecurity Analyst": {
    stages: [
      { title: "Beginner", duration: "0–3 months", skills: ["Networking Basics", "Linux", "Security Concepts"], salary: "$0 (Learning)", resources: ["CompTIA Network+", "TryHackMe", "Linux Journey"] },
      { title: "SOC Analyst", duration: "3–9 months", skills: ["SIEM Tools", "Log Analysis", "Incident Response"], salary: "$50K–$70K", resources: ["Splunk Free", "Blue Team Labs", "SANS Reading Room"] },
      { title: "Penetration Tester", duration: "1–2 years", skills: ["Ethical Hacking", "Python Scripting", "Web App Security"], salary: "$75K–$110K", resources: ["Hack The Box", "OSCP Prep", "PortSwigger Academy"] },
      { title: "Senior Security Engineer", duration: "2–4 years", skills: ["Cloud Security", "Threat Modeling", "Security Architecture"], salary: "$120K–$170K", resources: ["AWS Security Specialty", "CISSP Prep", "Security Conferences"] },
      { title: "CISO / Security Lead", duration: "5+ years", skills: ["Risk Management", "Compliance", "Team Leadership"], salary: "$170K–$300K+", resources: ["Executive Education", "Board Presentations", "Industry Groups"] },
    ],
  },
  "Product Manager": {
    stages: [
      { title: "Associate PM", duration: "0–6 months", skills: ["User Research", "Communication", "Analytics"], salary: "$55K–$75K", resources: ["Product School", "Inspired (Book)", "Coursera PM Courses"] },
      { title: "Product Manager", duration: "6–18 months", skills: ["Roadmap Planning", "A/B Testing", "SQL"], salary: "$80K–$120K", resources: ["Amplitude Academy", "Mixpanel Tutorials", "PM Interview Prep"] },
      { title: "Senior PM", duration: "2–4 years", skills: ["Strategy", "Stakeholder Management", "P&L Ownership"], salary: "$130K–$180K", resources: ["Reforge", "Lenny's Newsletter", "HBS Online"] },
      { title: "Director of Product", duration: "4–6 years", skills: ["Vision Setting", "Org Design", "Executive Communication"], salary: "$180K–$250K+", resources: ["Executive Coaching", "Board Dynamics", "Industry Conferences"] },
      { title: "VP / CPO", duration: "7+ years", skills: ["Company Strategy", "M&A", "Culture Building"], salary: "$250K–$400K+", resources: ["CEO Mentorship", "Advisory Boards", "Thought Leadership"] },
    ],
  },
};

export default function CareerPathPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPath, setShowPath] = useState(false);

  const generate = async (career: string) => {
    setSelected(career);
    setLoading(true);
    setShowPath(false);
    await new Promise((r) => setTimeout(r, 1800));
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
              See your complete career journey from beginner to expert with skills, salary, and resources at each stage.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Choose a Career Path</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(careerPaths).map((c) => (
                <Button
                  key={c}
                  variant={selected === c ? "hero" : "outline"}
                  onClick={() => generate(c)}
                  disabled={loading}
                >
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
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="relative"
                  >
                    {/* Connector line */}
                    {i < path.stages.length - 1 && (
                      <div className="absolute left-6 top-full w-0.5 h-6 bg-gradient-to-b from-primary/50 to-primary/10 z-0" />
                    )}
                    <div className="glass-card p-6 mb-6 relative">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${
                            i === 0 ? "bg-primary/20 text-primary glow-border" : "bg-secondary text-muted-foreground"
                          }`}>
                            {i + 1}
                          </div>
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
                                {stage.skills.map((s: string) => (
                                  <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> Salary Range
                              </p>
                              <p className="text-sm text-foreground font-medium">{stage.salary}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1">
                                <BookOpen className="h-3 w-3" /> Resources
                              </p>
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
                  <Button variant="hero-outline" onClick={() => { setSelected(null); setShowPath(false); }}>
                    Explore Another Path
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
