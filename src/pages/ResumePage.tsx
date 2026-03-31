import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Loader2, CheckCircle2, AlertTriangle, Star,
  XCircle, Briefcase, Lightbulb, TrendingUp, Shield, BookOpen,
  Award, BarChart3, Target, RefreshCw, FileWarning, Sparkles,
  Zap, Eye, ChevronRight, ArrowUpRight, Brain, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { extractText } from "@/lib/pdfParser";
import { analyzeResume, type ResumeAnalysis } from "@/lib/resumeAnalyzer";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "skills" | "advice">("overview");
  const [analyzing, setAnalyzing] = useState(false);

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
    setAnalyzing(true);
    setError(null);
    try {
      const text = await extractText(file);
      if (!text || text.trim().length < 30) {
        setError("Could not extract text from this file. It may be a scanned image or empty document. Try a text-based PDF.");
        setLoading(false);
        setAnalyzing(false);
        return;
      }
      // Simulate brief analysis delay for UX
      await new Promise((r) => setTimeout(r, 1500));
      const analysis = analyzeResume(text);
      setResult(analysis);
      setActiveTab("overview");
    } catch (err: any) {
      setError(err.message || "Failed to analyze the file.");
    }
    setLoading(false);
    setAnalyzing(false);
  };

  const reset = () => { setFile(null); setResult(null); setError(null); };

  const getScoreColor = (score: number) =>
    score >= 80 ? "text-green-400" : score >= 60 ? "text-accent" : score >= 40 ? "text-orange-400" : "text-destructive";

  const getScoreBg = (score: number) =>
    score >= 80 ? "from-green-500/20 to-green-500/5" : score >= 60 ? "from-accent/20 to-accent/5" : score >= 40 ? "from-orange-500/20 to-orange-500/5" : "from-destructive/20 to-destructive/5";

  const getGrade = (s: number) =>
    s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : s >= 50 ? "C+" : s >= 40 ? "C" : "D";

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: <Eye className="h-4 w-4" /> },
    { key: "sections" as const, label: "Sections", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "skills" as const, label: "Skills", icon: <Zap className="h-4 w-4" /> },
    { key: "advice" as const, label: "Advice", icon: <Lightbulb className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Animated Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm text-primary mb-6"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              AI-Powered Resume Intelligence
              <Sparkles className="h-4 w-4 animate-pulse" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Resume <span className="gradient-text">Analyzer</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Upload your resume and get instant, intelligent feedback — we detect skills, score sections, and tell you if it's even a resume.
            </p>
          </motion.div>

          {/* Upload Area */}
          <AnimatePresence mode="wait">
            {!result && !analyzing && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                transition={{ delay: 0.15 }}
              >
                <div
                  className={`relative group glass-card p-12 mb-6 border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden ${
                    dragOver ? "border-primary bg-primary/10 scale-[1.01]" : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {/* Animated background orbs */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-700" />
                  </div>

                  <div className="text-center relative z-10">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-6 glow-border"
                    >
                      <Upload className="h-10 w-10 text-primary" />
                    </motion.div>

                    <p className="text-foreground font-display font-bold text-xl mb-2">
                      {file ? file.name : "Drop your resume here"}
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                      {file ? `${(file.size / 1024).toFixed(1)} KB — Ready to analyze` : "Supports PDF, TXT, DOCX • We extract real content and analyze it"}
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <label className="cursor-pointer">
                        <input type="file" accept=".pdf,.txt,.docx" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                        <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-secondary/50 text-sm text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-300 font-medium group-hover:shadow-lg">
                          <FileText className="h-4 w-4" /> Choose File
                        </span>
                      </label>
                      {file && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                          <Button variant="hero" onClick={analyze} disabled={loading} className="px-8 py-3 text-base">
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Brain className="h-4 w-4" /> Analyze Resume</>}
                          </Button>
                        </motion.div>
                      )}
                    </div>

                    {/* Feature pills */}
                    <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
                      {["Resume Detection", "Skill Analysis", "ATS Scoring", "Section Review"].map((f, i) => (
                        <motion.span
                          key={f}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="px-3 py-1.5 rounded-full bg-secondary/60 text-xs text-muted-foreground border border-border/50"
                        >
                          {f}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzing Animation */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-16 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary mx-auto mb-6"
                />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Analyzing Your Resume...</h3>
                <p className="text-muted-foreground">Detecting skills, scoring sections, checking ATS compatibility</p>
                <div className="flex items-center justify-center gap-1 mt-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [1, 2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      className="w-2 h-4 rounded-full bg-primary/60"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card p-6 mb-6 border-destructive/40 flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-xl bg-destructive/15 flex items-center justify-center shrink-0">
                  <FileWarning className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground mb-1">Analysis Failed</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Not a Resume — Rejection Screen */}
          <AnimatePresence>
            {result && !result.isResume && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 text-center overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent pointer-events-none" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  <div className="h-24 w-24 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-12 w-12 text-destructive" />
                  </div>
                </motion.div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-3">Not a Resume</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-3">{result.rejectReason}</p>
                <div className="flex items-center justify-center gap-2 mb-8">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-destructive/60 rounded-full" style={{ width: `${100 - (result.confidence ?? 0)}%` }} />
                  </div>
                  <span className="text-xs text-destructive font-bold">{100 - (result.confidence ?? 0)}% not a resume</span>
                </div>
                <div className="glass-card p-5 max-w-md mx-auto mb-8 text-left">
                  <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-accent" /> What we look for in a resume:</p>
                  <ul className="space-y-2">
                    {["Contact info (email, phone)", "Experience or internship section", "Education details", "Skills or technologies list", "Projects or achievements"].map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" /> {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <Button variant="hero" onClick={reset} className="px-8">
                  <RefreshCw className="h-4 w-4" /> Try Another File
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ RESULTS ═══ */}
          <AnimatePresence>
            {result && result.isResume && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {/* Hero Score Card */}
                <motion.div variants={fadeUp} className="glass-card p-8 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl bg-gradient-to-br ${getScoreBg(result.overallScore)}`} />
                  </div>
                  <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                    {/* Big circular score */}
                    <div className="text-center">
                      <CircularScore score={result.overallScore} size={150} />
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                        <span className={`font-display font-bold text-xl ${getScoreColor(result.overallScore)}`}>
                          Grade: {getGrade(result.overallScore)}
                        </span>
                      </motion.div>
                    </div>

                    {/* Mini scores grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                      {[
                        { label: "Skills", score: result.skillScore, icon: <Target className="h-4 w-4" />, delay: 0.3 },
                        { label: "Experience", score: result.experienceScore, icon: <Briefcase className="h-4 w-4" />, delay: 0.4 },
                        { label: "Projects", score: result.projectScore, icon: <Lightbulb className="h-4 w-4" />, delay: 0.5 },
                        { label: "ATS Ready", score: result.atsScore, icon: <Shield className="h-4 w-4" />, delay: 0.6 },
                        { label: "Education", score: result.educationScore, icon: <BookOpen className="h-4 w-4" />, delay: 0.7 },
                        { label: "Achievements", score: result.achievementScore, icon: <Award className="h-4 w-4" />, delay: 0.8 },
                        { label: "Formatting", score: result.formattingScore, icon: <FileText className="h-4 w-4" />, delay: 0.9 },
                        { label: "Confidence", score: result.confidence ?? 0, icon: <Flame className="h-4 w-4" />, delay: 1.0 },
                      ].map((item) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: item.delay }}
                          className={`p-4 rounded-xl bg-gradient-to-b ${getScoreBg(item.score)} border border-border/30 text-center group hover:scale-105 transition-transform duration-300`}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-primary mb-2">{item.icon}<span className="text-xs text-muted-foreground">{item.label}</span></div>
                          <p className={`font-display text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div variants={fadeUp} className="flex gap-1 p-1.5 rounded-2xl bg-secondary/50 overflow-x-auto backdrop-blur-sm border border-border/30">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {activeTab === tab.key && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-primary shadow-lg"
                          transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">{tab.icon}{tab.label}</span>
                    </button>
                  ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Strengths */}
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2 text-foreground">
                          <div className="h-8 w-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          </div>
                          Strengths
                        </h3>
                        <ul className="space-y-3">
                          {result.strengths.map((s, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-start gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-green-500/5 border border-green-500/10"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" /> {s}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      {/* Improvements */}
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2 text-foreground">
                          <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-accent" />
                          </div>
                          Areas to Improve
                        </h3>
                        <ul className="space-y-3">
                          {result.improvements.map((s, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-start gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-accent/5 border border-accent/10"
                            >
                              <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {s}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "sections" && (
                    <motion.div key="sections" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="glass-card p-6">
                      <h3 className="font-display text-lg font-semibold mb-6 text-foreground">Section-by-Section Analysis</h3>
                      <div className="space-y-5">
                        {Object.entries(result.sections).map(([key, val], idx) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="group"
                          >
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/20 transition-all duration-300">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${val.found ? 'bg-green-500/15' : 'bg-destructive/10'}`}>
                                {val.found ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-destructive/60" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="capitalize text-sm font-semibold text-foreground">{key}</span>
                                  <span className={`text-sm font-bold ${getScoreColor(val.score)}`}>{val.score}%</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${val.score}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className="h-full rounded-full"
                                    style={{ background: "var(--gradient-primary)" }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">{val.note}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "skills" && (
                    <motion.div key="skills" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                            <Target className="h-4 w-4 text-primary" />
                          </div>
                          Detected Skills ({result.detectedSkills.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.detectedSkills.map((s, i) => (
                            <motion.span
                              key={s}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.03 }}
                              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/25 hover:bg-primary/20 hover:scale-105 transition-all duration-200 cursor-default"
                            >
                              {s}
                            </motion.span>
                          ))}
                          {result.detectedSkills.length === 0 && (
                            <p className="text-sm text-muted-foreground p-4 text-center w-full">No skills detected — add a skills section to your resume</p>
                          )}
                        </div>
                      </div>
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-accent" />
                          </div>
                          Missing Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((s, i) => (
                            <motion.span
                              key={s}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.03 }}
                              className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/25 hover:bg-accent/20 hover:scale-105 transition-all duration-200 cursor-default"
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "advice" && (
                    <motion.div key="advice" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          Suggested Roles
                        </h3>
                        <div className="space-y-2">
                          {result.suggestedRoles.map((r, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40 hover:border-primary/30 hover:bg-secondary/60 transition-all duration-300 group"
                            >
                              <Award className="h-5 w-5 text-primary shrink-0" />
                              <span className="text-sm text-foreground font-medium flex-1">{r}</span>
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="glass-card p-6">
                        <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-accent" />
                          </div>
                          Suggested Projects
                        </h3>
                        <div className="space-y-2">
                          {result.suggestedProjects.map((p, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40 hover:border-accent/30 hover:bg-secondary/60 transition-all duration-300 group"
                            >
                              <Lightbulb className="h-5 w-5 text-accent shrink-0" />
                              <span className="text-sm text-foreground flex-1">{p}</span>
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset Button */}
                <motion.div variants={fadeUp} className="text-center pt-6">
                  <Button variant="hero-outline" onClick={reset} className="px-8 py-3">
                    <RefreshCw className="h-4 w-4" /> Analyze Another Resume
                  </Button>
                </motion.div>
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
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#4ade80" : score >= 60 ? "hsl(var(--accent))" : score >= 40 ? "#fb923c" : "hsl(var(--destructive))";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="font-display text-4xl font-bold text-foreground"
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
