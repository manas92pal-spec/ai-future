import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Code, GraduationCap, Wrench, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface RoadmapData {
  career: string;
  overview: string;
  currentSkills: string[];
  requiredSkills: string[];
  skillGap: { have: string[]; need: string[] };
  stages: {
    title: string;
    timeline: string;
    skills: string[];
    projects: string[];
    tools: string[];
    resources: string[];
  }[];
}

export default function RoadmapDisplay({ data, onReset }: { data: RoadmapData; onReset: () => void }) {
  const gapPercent = Math.round((data.skillGap.have.length / (data.skillGap.have.length + data.skillGap.need.length)) * 100) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onReset}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Your Roadmap: <span className="text-primary">{data.career}</span></h2>
          <p className="text-sm text-muted-foreground">{data.overview}</p>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Skill Gap Analysis</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Skills Coverage</span>
            <span className="text-primary font-semibold">{gapPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${gapPercent}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-primary mb-2 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Skills You Have</p>
            <div className="flex flex-wrap gap-1.5">
              {data.skillGap.have.length > 0 ? data.skillGap.have.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs border border-primary/30">{s}</span>
              )) : <span className="text-xs text-muted-foreground">No matching skills yet</span>}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-accent mb-2 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Skills to Learn</p>
            <div className="flex flex-wrap gap-1.5">
              {data.skillGap.need.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs border border-accent/30">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-accent hidden md:block" />
        {data.stages.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative md:pl-16 mb-8"
          >
            {/* Timeline dot */}
            <div className="hidden md:flex absolute left-3.5 top-6 h-5 w-5 rounded-full bg-primary/20 border-2 border-primary items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <div className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">{stage.title}</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 w-fit">{stage.timeline}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1 uppercase tracking-wider"><GraduationCap className="h-3.5 w-3.5" /> Skills</p>
                  <ul className="space-y-1">
                    {stage.skills.map((s, j) => <li key={j} className="text-sm text-muted-foreground">• {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent mb-2 flex items-center gap-1 uppercase tracking-wider"><Code className="h-3.5 w-3.5" /> Projects</p>
                  <ul className="space-y-1">
                    {stage.projects.map((p, j) => <li key={j} className="text-sm text-muted-foreground">• {p}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1 uppercase tracking-wider"><Wrench className="h-3.5 w-3.5" /> Tools</p>
                  <div className="flex flex-wrap gap-1">
                    {stage.tools.map((t, j) => <span key={j} className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">{t}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1 uppercase tracking-wider"><BookOpen className="h-3.5 w-3.5" /> Resources</p>
                  <ul className="space-y-1">
                    {stage.resources.map((r, j) => <li key={j} className="text-sm text-muted-foreground">• {r}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button variant="hero-outline" onClick={onReset}>Generate Another Roadmap</Button>
      </div>
    </div>
  );
}
