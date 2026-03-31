import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Loader2, CheckCircle2, AlertTriangle, Star,
  XCircle, Briefcase, Lightbulb, TrendingUp, Shield, BookOpen,
  Award, BarChart3, Target, RefreshCw, FileWarning
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { extractText } from "@/lib/pdfParser";
import { analyzeResume, type ResumeAnalysis } from "@/lib/resumeAnalyzer";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "skills" | "advice">("overview");

  const handleFile = (f: File) => {
    const valid = f.name.endsWith(".pdf") || f.name.endsWith(".txt") || f.name.endsWith(".docx");
    if (f && valid) {
      setFile(f);
      setResult(null);
      setError(null);
    } else {
      setError("Please upload a PDF, TXT, or DOCX file.");
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
    setError(null);
    try {
      const text = await extractText(file);
      if (!text || text.trim().length < 30) {
        setError("Could not extract text from this file. Please ensure it's a valid, text-based document.");
        setLoading(false);
        return;
      }
      const analysis = analyzeResume(text);
      setResult(analysis);
      setActiveTab("overview");
    } catch (err: any) {
      setError(err.message || "Failed to analyze the file.");
    }
    setLoading(false);
  };

  const reset = () => { setFile(null); setResult(null); setError(null); };

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-400" : score >= 60 ? "text-accent" : score >= 40 ? "text-orange-400" : "text-destructive";

  const getGrade = (s: number) =>
    s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : s >= 50 ? "C+" : s >= 40 ? "C" : "D";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-4">
              <Shield className="h-4 w-4" /> Smart Resume Analysis
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Resume Analyzer</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload your resume and get intelligent, personalized feedback with real scoring based on your content.
            </p>
          </motion.div>

          {/* Upload Area */}
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`glass-card p-10 mb-6 border-2 border-dashed transition-all duration-300 ${
                dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 glow-border">
                  <Upload className="h-9 w-9 text-primary" />
                </div>
                <p className="text-foreground font-display font-semibold text-lg mb-1">
                  {file ? file.name : "Drop your resume here"}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {file ? `${(file.size / 1024).toFixed(1)} KB — Ready to analyze` : "Supports PDF, TXT, DOCX — we extract and analyze real content"}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <label className="cursor-pointer">
                    <input type="file" accept=".pdf,.txt,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-secondary/50 text-sm text-foreground hover:bg-secondary transition-colors font-medium">
                      <FileText className="h-4 w-4" /> Choose File
                    </span>
                  </label>
                  {file && (
                    <Button variant="hero" onClick={analyze} disabled={loading} className="px-8">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><BarChart3 className="h-4 w-4" /> Analyze Resume</>}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 mb-6 border-destructive/30 flex items-start gap-3">
              <FileWarning className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Analysis Failed</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Not a Resume Warning */}
          <AnimatePresence>
            {result && !result.isResume && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-8 text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">Not a Resume</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">{result.rejectReason}</p>
                <Button variant="hero-outline" onClick={reset}><RefreshCw className="h-4 w-4" /> Try Another File</Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && result.isResume && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Big Score + Tab Nav */}
                <div className="glass-card p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center">
                      <CircularScore score={result.overallScore} size={120} />
                      <p className="font-display text-sm text-muted-foreground mt-2">Overall Score</p>
                      <span className={`font-display font-bold text-lg ${getScoreColor(result.overallScore)}`}>Grade: {getGrade(result.overallScore)}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                      <MiniScore label="Skills" score={result.skillScore} icon={<Target className="h-4 w-4" />} />
                      <MiniScore label="Experience" score={result.experienceScore} icon={<Briefcase className="h-4 w-4" />} />
                      <MiniScore label="Projects" score={result.projectScore} icon={<Lightbulb className="h-4 w-4" />} />
                      <MiniScore label="ATS Ready" score={result.atsScore} icon={<Shield className="h-4 w-4" />} />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-secondary/50 overflow-x-auto">
                  {(["overview", "sections", "skills", "advice"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${
                        activeTab === tab ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <CheckCircle2 className="h-5 w-5 text-green-400" /> Strengths
                        </h3>
                        <ul className="space-y-3">
                          {result.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                          <AlertTriangle className="h-5 w-5 text-accent" /> Areas to Improve
                        </h3>
                        <ul className="space-y-3">
                          {result.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "sections" && (
                    <motion.div key="sections" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="glass-card p-6">
                      <h3 className="font-display text-lg font-semibold mb-5 text-foreground">Section-by-Section Analysis</h3>
                      <div className="space-y-4">
                        {Object.entries(result.sections).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-4">
                            <div className="w-28 shrink-0">
                              <span className="capitalize text-sm font-medium text-foreground">{key}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${val.score}%` }}
                                    transition={{ duration: 0.8 }}
                                    className="h-full rounded-full"
                                    style={{ background: "var(--gradient-primary)" }}
                                  />
                                </div>
                                <span className={`text-sm font-bold w-10 text-right ${getScoreColor(val.score)}`}>{val.score}%</span>
                                {val.found ? <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /> : <XCircle className="h-4 w-4 text-destructive/60 shrink-0" />}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{val.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "skills" && (
                    <motion.div key="skills" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" /> Detected Skills ({result.detectedSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.detectedSkills.map((s) => (
                            <span key={s} className="px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-medium border border-primary/30">{s}</span>
                          ))}
                          {result.detectedSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills detected — add a skills section</p>}
                        </div>
                      </div>
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-accent" /> Missing Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((s) => (
                            <span key={s} className="px-3 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-medium border border-accent/30">{s}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "advice" && (
                    <motion.div key="advice" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" /> Suggested Roles
                        </h3>
                        <div className="space-y-2">
                          {result.suggestedRoles.map((r, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                              <Award className="h-5 w-5 text-primary shrink-0" />
                              <span className="text-sm text-foreground font-medium">{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-accent" /> Suggested Projects
                        </h3>
                        <div className="space-y-2">
                          {result.suggestedProjects.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                              <Lightbulb className="h-5 w-5 text-accent shrink-0" />
                              <span className="text-sm text-foreground">{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="glass-card p-6 md:col-span-2">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Detailed Score Breakdown</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: "Education", score: result.educationScore },
                            { label: "Achievements", score: result.achievementScore },
                            { label: "Formatting", score: result.formattingScore },
                            { label: "ATS Score", score: result.atsScore },
                          ].map((item) => (
                            <div key={item.label} className="text-center p-4 rounded-lg bg-secondary/30 border border-border/30">
                              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{item.label}</p>
                              <p className={`font-display text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                              <p className="text-xs text-muted-foreground mt-1">/ 100</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset */}
                <div className="text-center pt-4">
                  <Button variant="hero-outline" onClick={reset} className="px-8">
                    <RefreshCw className="h-4 w-4" /> Analyze Another Resume
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

function CircularScore({ score, size = 100 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "hsl(var(--accent))" : score >= 40 ? "#fb923c" : "hsl(var(--destructive))";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute font-display text-3xl font-bold text-foreground">{score}</span>
    </div>
  );
}

function MiniScore({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const color = score >= 80 ? "text-green-400" : score >= 60 ? "text-accent" : score >= 40 ? "text-orange-400" : "text-destructive";
  return (
    <div className="p-4 rounded-xl bg-secondary/40 border border-border/30 text-center">
      <div className="flex items-center justify-center gap-1.5 text-primary mb-2">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
      <p className={`font-display text-2xl font-bold ${color}`}>{score}</p>
    </div>
  );
}
