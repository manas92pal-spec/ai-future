import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle2, AlertTriangle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf") || f.name.endsWith(".txt") || f.name.endsWith(".docx"))) {
      setFile(f);
      setResult(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setResult({
      score: 72,
      strengths: ["Clear project descriptions", "Relevant technical skills listed", "Good education section"],
      improvements: ["Add quantifiable achievements (numbers, metrics)", "Include more action verbs", "Add a professional summary", "Optimize for ATS keywords", "Include links to projects/portfolio"],
      skillsDetected: ["Python", "JavaScript", "React", "SQL", "Git", "Machine Learning"],
      missingKeywords: ["TypeScript", "Docker", "CI/CD", "Agile", "REST API", "System Design"],
      atsScore: 65,
      sections: {
        contact: { score: 90, note: "Good — includes email and phone" },
        experience: { score: 60, note: "Add metrics and impact to bullet points" },
        skills: { score: 80, note: "Good technical skills, add soft skills" },
        education: { score: 85, note: "Well formatted" },
        projects: { score: 70, note: "Add tech stack and live links" },
      },
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
              AI <span className="gradient-text">Resume Analyzer</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload your resume and get instant AI-powered feedback, scoring, and actionable improvement tips.
            </p>
          </motion.div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`glass-card p-8 mb-8 border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                {file ? file.name : "Drop your resume here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">Supports PDF, TXT, DOCX</p>
              <div className="flex items-center justify-center gap-3">
                <label className="cursor-pointer">
                  <input type="file" accept=".pdf,.txt,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary/50 text-sm text-foreground hover:bg-secondary transition-colors">
                    <FileText className="h-4 w-4" /> Choose File
                  </span>
                </label>
                {file && (
                  <Button variant="hero" onClick={analyze} disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : "Analyze Resume"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ScoreCard label="Overall Score" score={result.score} color="primary" />
                  <ScoreCard label="ATS Compatibility" score={result.atsScore} color="accent" />
                  <ScoreCard label="Keyword Match" score={Math.round((result.skillsDetected.length / (result.skillsDetected.length + result.missingKeywords.length)) * 100)} color="primary" />
                </div>

                {/* Section Scores */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Section Analysis</h3>
                  <div className="space-y-3">
                    {Object.entries(result.sections).map(([key, val]: any) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-foreground">{key}</span>
                          <span className="text-primary">{val.score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${val.score}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{val.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Strengths</h3>
                    <ul className="space-y-2">
                      {result.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-accent" /> Improvements</h3>
                    <ul className="space-y-2">
                      {result.improvements.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Keywords */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold mb-3 text-foreground">Keyword Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Detected Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.skillsDetected.map((s: string) => <span key={s} className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs border border-primary/30">{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent mb-2 uppercase tracking-wider">Missing Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingKeywords.map((s: string) => <span key={s} className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs border border-accent/30">{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button variant="hero-outline" onClick={() => { setResult(null); setFile(null); }}>Analyze Another Resume</Button>
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

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  const getGrade = (s: number) => s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : s >= 50 ? "C" : "D";
  return (
    <div className="glass-card p-6 text-center">
      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{label}</p>
      <div className="relative h-20 w-20 mx-auto mb-2">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
          <motion.path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={`hsl(var(--${color}))`}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${score}, 100` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1">
        <Star className="h-3.5 w-3.5 text-primary" />
        <span className="text-sm font-medium text-foreground">Grade: {getGrade(score)}</span>
      </div>
    </div>
  );
}
