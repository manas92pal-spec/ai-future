import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Code2, Layers, BarChart3, Loader2, Github, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fields = ["AI / Machine Learning", "Web Development", "Cybersecurity", "Data Science"];
const levels = ["Beginner", "Intermediate", "Advanced"];

const projectBank: Record<string, Record<string, any[]>> = {
  "AI / Machine Learning": {
    Beginner: [
      { title: "Spam Email Classifier", desc: "Build a machine learning model that classifies emails as spam or not spam using Naive Bayes.", stack: ["Python", "Scikit-learn", "Pandas"], difficulty: "Easy", outcomes: ["Understand text classification", "Learn feature extraction", "Model evaluation"], structure: "spam-classifier/\n├── data/\n├── model.py\n├── preprocess.py\n├── train.py\n└── README.md" },
      { title: "Handwritten Digit Recognizer", desc: "Create a neural network that recognizes handwritten digits from the MNIST dataset.", stack: ["Python", "TensorFlow/Keras", "NumPy"], difficulty: "Easy", outcomes: ["Neural network basics", "Image classification", "Model training"], structure: "digit-recognizer/\n├── data/\n├── model.py\n├── train.py\n├── predict.py\n└── README.md" },
    ],
    Intermediate: [
      { title: "Sentiment Analysis Dashboard", desc: "Analyze social media sentiment in real-time with visualization dashboard.", stack: ["Python", "NLTK", "Streamlit", "Plotly"], difficulty: "Medium", outcomes: ["NLP fundamentals", "Real-time data processing", "Dashboard building"], structure: "sentiment-dashboard/\n├── app.py\n├── analyzer.py\n├── data_fetcher.py\n├── visualizer.py\n└── README.md" },
    ],
    Advanced: [
      { title: "AI-Powered Code Reviewer", desc: "Build an AI tool that reviews code, suggests improvements, and detects bugs using LLMs.", stack: ["Python", "OpenAI API", "FastAPI", "React"], difficulty: "Hard", outcomes: ["LLM integration", "Code analysis", "Full-stack development"], structure: "code-reviewer/\n├── backend/\n│   ├── main.py\n│   └── reviewer.py\n├── frontend/\n│   ├── src/\n│   └── package.json\n└── README.md" },
    ],
  },
  "Web Development": {
    Beginner: [
      { title: "Personal Portfolio Website", desc: "Build a responsive portfolio with project showcase, about section, and contact form.", stack: ["HTML", "CSS", "JavaScript"], difficulty: "Easy", outcomes: ["Responsive design", "DOM manipulation", "Form handling"], structure: "portfolio/\n├── index.html\n├── styles.css\n├── script.js\n├── assets/\n└── README.md" },
    ],
    Intermediate: [
      { title: "Real-Time Chat Application", desc: "Build a chat app with rooms, user authentication, and real-time messaging.", stack: ["React", "Node.js", "Socket.io", "MongoDB"], difficulty: "Medium", outcomes: ["WebSocket communication", "Authentication", "Database design"], structure: "chat-app/\n├── client/\n├── server/\n│   ├── routes/\n│   └── models/\n└── README.md" },
    ],
    Advanced: [
      { title: "E-Commerce Platform", desc: "Full-featured e-commerce with payments, admin dashboard, inventory management.", stack: ["Next.js", "Stripe", "PostgreSQL", "Prisma"], difficulty: "Hard", outcomes: ["Payment integration", "Admin systems", "Scalable architecture"], structure: "ecommerce/\n├── app/\n├── components/\n├── lib/\n├── prisma/\n└── README.md" },
    ],
  },
  "Cybersecurity": {
    Beginner: [
      { title: "Password Strength Checker", desc: "Build a tool that evaluates password strength and suggests improvements.", stack: ["Python", "Regex", "Tkinter"], difficulty: "Easy", outcomes: ["Security fundamentals", "Pattern matching", "UI basics"], structure: "password-checker/\n├── checker.py\n├── gui.py\n├── rules.py\n└── README.md" },
    ],
    Intermediate: [
      { title: "Network Vulnerability Scanner", desc: "Create a tool that scans networks for common vulnerabilities and open ports.", stack: ["Python", "Nmap", "Scapy", "Flask"], difficulty: "Medium", outcomes: ["Network scanning", "Vulnerability detection", "Report generation"], structure: "vuln-scanner/\n├── scanner.py\n├── reporter.py\n├── web/\n└── README.md" },
    ],
    Advanced: [
      { title: "Security Incident Response Platform", desc: "Build a platform to track, analyze, and respond to security incidents.", stack: ["React", "Node.js", "ElasticSearch", "Docker"], difficulty: "Hard", outcomes: ["Incident management", "Log analysis", "Containerization"], structure: "incident-platform/\n├── frontend/\n├── backend/\n├── docker-compose.yml\n└── README.md" },
    ],
  },
  "Data Science": {
    Beginner: [
      { title: "COVID-19 Data Dashboard", desc: "Visualize COVID-19 trends with interactive charts and filters.", stack: ["Python", "Pandas", "Plotly", "Streamlit"], difficulty: "Easy", outcomes: ["Data cleaning", "Visualization", "Dashboard building"], structure: "covid-dashboard/\n├── app.py\n├── data_loader.py\n├── charts.py\n└── README.md" },
    ],
    Intermediate: [
      { title: "Customer Churn Predictor", desc: "Build a model to predict which customers are likely to leave and why.", stack: ["Python", "Scikit-learn", "XGBoost", "Streamlit"], difficulty: "Medium", outcomes: ["Predictive modeling", "Feature importance", "Business insights"], structure: "churn-predictor/\n├── data/\n├── model.py\n├── app.py\n├── analysis.ipynb\n└── README.md" },
    ],
    Advanced: [
      { title: "Real-Time Analytics Pipeline", desc: "Build a streaming analytics pipeline processing millions of events.", stack: ["Apache Kafka", "Spark", "PostgreSQL", "Grafana"], difficulty: "Hard", outcomes: ["Stream processing", "Big data", "Infrastructure design"], structure: "analytics-pipeline/\n├── producer/\n├── consumer/\n├── dashboard/\n├── docker-compose.yml\n└── README.md" },
    ],
  },
};

export default function ProjectIdeasPage() {
  const [field, setField] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[] | null>(null);

  const generate = async () => {
    if (!field || !level) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setProjects(projectBank[field]?.[level] || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Project Idea Generator</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get tailored project ideas with tech stacks, structure, and learning outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" /> Choose Field
              </h3>
              <div className="space-y-2">
                {fields.map((f) => (
                  <button key={f} onClick={() => { setField(f); setProjects(null); }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      field === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" /> Skill Level
              </h3>
              <div className="space-y-2">
                {levels.map((l) => (
                  <button key={l} onClick={() => { setLevel(l); setProjects(null); }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      level === l ? "bg-accent text-accent-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {field && level && (
            <div className="text-center mb-8">
              <Button variant="hero" size="lg" onClick={generate} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Lightbulb className="h-4 w-4" /> Generate Project Ideas</>}
              </Button>
            </div>
          )}

          <AnimatePresence>
            {projects && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {projects.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display text-xl font-bold text-foreground">{p.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.difficulty === "Easy" ? "bg-primary/15 text-primary" : p.difficulty === "Medium" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                      }`}>{p.difficulty}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{p.desc}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1"><Code2 className="h-3 w-3" /> Tech Stack</p>
                        <div className="flex flex-wrap gap-1">
                          {p.stack.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Learning Outcomes</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                          {p.outcomes.map((o: string) => <li key={o}>• {o}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider flex items-center gap-1"><Github className="h-3 w-3" /> Project Structure</p>
                        <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2 overflow-x-auto">{p.structure}</pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center">
                  <Button variant="hero-outline" onClick={() => { setProjects(null); setField(null); setLevel(null); }}>Generate More Ideas</Button>
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
