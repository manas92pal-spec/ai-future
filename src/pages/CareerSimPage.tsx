import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Clock, Heart, Flame, DollarSign, Wifi, Loader2, Sun, Coffee, Monitor, Users, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roles: Record<string, any> = {
  "Software Engineer": {
    schedule: [
      { time: "9:00 AM", icon: Coffee, activity: "Morning standup meeting with the team", detail: "Discuss progress, blockers, and today's priorities." },
      { time: "9:30 AM", icon: Monitor, activity: "Deep work — coding sprint", detail: "Work on feature development, bug fixes, or code reviews." },
      { time: "12:00 PM", icon: Sun, activity: "Lunch break & tech reading", detail: "Read tech blogs, Hacker News, or watch conference talks." },
      { time: "1:00 PM", icon: Users, activity: "Code review & pair programming", detail: "Review pull requests and collaborate with teammates." },
      { time: "3:00 PM", icon: Monitor, activity: "Architecture planning", detail: "Design system components, write documentation, plan sprints." },
      { time: "5:30 PM", icon: Moon, activity: "Wrap up & side projects", detail: "Push final commits, update tickets, work on personal projects." },
    ],
    environment: "Office or Remote — Most software teams offer hybrid/remote options with flexible hours.",
    workLifeBalance: 4,
    stressLevel: 3,
    avgSalary: "$85K – $165K",
    remoteOpportunity: "Very High — 70%+ of software roles offer remote options",
    growth: "Strong demand, 25% growth projected over next decade",
  },
  "Data Scientist": {
    schedule: [
      { time: "9:00 AM", icon: Coffee, activity: "Check model performance & dashboards", detail: "Review overnight model runs, check metrics and alerts." },
      { time: "10:00 AM", icon: Monitor, activity: "Data exploration & feature engineering", detail: "Analyze datasets, create new features, clean data." },
      { time: "12:00 PM", icon: Sun, activity: "Lunch & research papers", detail: "Read latest ML papers, attend journal clubs." },
      { time: "1:00 PM", icon: Users, activity: "Stakeholder meeting", detail: "Present findings to business teams, discuss requirements." },
      { time: "2:30 PM", icon: Monitor, activity: "Model training & experimentation", detail: "Train models, run A/B tests, optimize hyperparameters." },
      { time: "5:00 PM", icon: Moon, activity: "Documentation & learning", detail: "Document experiments, take online courses, Kaggle competitions." },
    ],
    environment: "Mostly office/hybrid with some fully remote roles. Data teams tend to be collaborative.",
    workLifeBalance: 4,
    stressLevel: 3,
    avgSalary: "$90K – $160K",
    remoteOpportunity: "High — 60%+ of data science roles offer remote",
    growth: "Very high demand, one of the fastest growing tech roles",
  },
  "Product Manager": {
    schedule: [
      { time: "8:30 AM", icon: Coffee, activity: "Review metrics & user feedback", detail: "Check product analytics, customer support tickets, NPS scores." },
      { time: "9:30 AM", icon: Users, activity: "Sprint planning / team sync", detail: "Prioritize backlog, assign tasks, resolve blockers." },
      { time: "11:00 AM", icon: Monitor, activity: "User research session", detail: "Conduct user interviews, analyze survey results." },
      { time: "12:00 PM", icon: Sun, activity: "Lunch with stakeholders", detail: "Build relationships, gather cross-functional input." },
      { time: "1:30 PM", icon: Monitor, activity: "Write PRDs & roadmap updates", detail: "Document product requirements, update roadmap." },
      { time: "4:00 PM", icon: Users, activity: "Design review & strategy", detail: "Review designs with UX team, plan go-to-market strategy." },
    ],
    environment: "Highly collaborative, mostly office/hybrid. Lots of meetings and cross-team coordination.",
    workLifeBalance: 3,
    stressLevel: 4,
    avgSalary: "$95K – $175K",
    remoteOpportunity: "Medium — 50% of PM roles offer remote options",
    growth: "Steady demand as companies become more product-led",
  },
  "Cybersecurity Analyst": {
    schedule: [
      { time: "8:00 AM", icon: Coffee, activity: "Review overnight security alerts", detail: "Check SIEM dashboards, triage alerts, identify threats." },
      { time: "9:30 AM", icon: Monitor, activity: "Vulnerability assessment", detail: "Run scans, analyze results, prioritize patches." },
      { time: "11:00 AM", icon: Users, activity: "Incident response meeting", detail: "Coordinate with teams on active security incidents." },
      { time: "12:00 PM", icon: Sun, activity: "Lunch & threat intelligence", detail: "Read threat reports, attend security briefings." },
      { time: "1:30 PM", icon: Monitor, activity: "Penetration testing", detail: "Test systems for vulnerabilities, write exploit reports." },
      { time: "4:00 PM", icon: Moon, activity: "Documentation & compliance", detail: "Update security policies, prepare audit reports." },
    ],
    environment: "Often requires on-site presence. May include on-call rotations for incident response.",
    workLifeBalance: 3,
    stressLevel: 4,
    avgSalary: "$75K – $140K",
    remoteOpportunity: "Medium — Some roles require on-site for sensitive environments",
    growth: "Extremely high demand due to rising cyber threats",
  },
  "UX Designer": {
    schedule: [
      { time: "9:00 AM", icon: Coffee, activity: "Design inspiration & research", detail: "Browse Dribbble, review competitor products, sketch ideas." },
      { time: "10:00 AM", icon: Monitor, activity: "Wireframing & prototyping", detail: "Create wireframes in Figma, build interactive prototypes." },
      { time: "12:00 PM", icon: Sun, activity: "Lunch & design community", detail: "Attend design meetups, read UX articles." },
      { time: "1:00 PM", icon: Users, activity: "Usability testing", detail: "Run user testing sessions, gather feedback." },
      { time: "3:00 PM", icon: Monitor, activity: "Design iteration", detail: "Refine designs based on feedback, update design system." },
      { time: "5:00 PM", icon: Moon, activity: "Handoff & documentation", detail: "Prepare design specs for developers, update style guides." },
    ],
    environment: "Creative studio atmosphere. Mix of individual focus time and collaborative workshops.",
    workLifeBalance: 4,
    stressLevel: 2,
    avgSalary: "$70K – $130K",
    remoteOpportunity: "High — Design work translates well to remote",
    growth: "Growing demand as companies prioritize user experience",
  },
};

function MeterBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={`h-2.5 w-6 rounded-full transition-all ${i < value ? `bg-${color}` : "bg-secondary"}`}
          style={i < value ? { backgroundColor: `hsl(var(--${color}))` } : undefined} />
      ))}
    </div>
  );
}

export default function CareerSimPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSim, setShowSim] = useState(false);

  const simulate = async (role: string) => {
    setSelected(role);
    setLoading(true);
    setShowSim(false);
    await new Promise((r) => setTimeout(r, 2000));
    setShowSim(true);
    setLoading(false);
  };

  const data = selected ? roles[selected] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Career Simulator</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Experience "A Day in the Life" of your dream career with detailed simulations.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Choose a Role to Simulate</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(roles).map((r) => (
                <Button key={r} variant={selected === r ? "hero" : "outline"} onClick={() => simulate(r)} disabled={loading}>
                  {r}
                </Button>
              ))}
            </div>
          </motion.div>

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Simulating a day as a {selected}...</p>
            </div>
          )}

          <AnimatePresence>
            {showSim && data && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Daily Schedule */}
                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> A Day in the Life: {selected}
                  </h3>
                  <div className="space-y-4">
                    {data.schedule.map((item: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div className="shrink-0 text-right w-20">
                          <span className="text-sm font-mono text-primary font-semibold">{item.time}</span>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.activity}</p>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Heart className="h-3 w-3" /> Work-Life Balance</p>
                    <MeterBar value={data.workLifeBalance} color="primary" />
                    <p className="text-xs text-muted-foreground mt-1">{data.workLifeBalance}/5</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Flame className="h-3 w-3" /> Stress Level</p>
                    <MeterBar value={data.stressLevel} color="accent" />
                    <p className="text-xs text-muted-foreground mt-1">{data.stressLevel}/5</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Average Salary</p>
                    <p className="font-display text-lg font-bold text-primary">{data.avgSalary}</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Wifi className="h-3 w-3" /> Remote Opportunity</p>
                    <p className="text-sm text-foreground">{data.remoteOpportunity}</p>
                  </div>
                  <div className="glass-card p-5 sm:col-span-2 lg:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Briefcase className="h-3 w-3" /> Work Environment</p>
                    <p className="text-sm text-foreground">{data.environment}</p>
                  </div>
                </div>

                <div className="glass-card p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Career Growth Outlook</p>
                  <p className="text-sm text-foreground">{data.growth}</p>
                </div>

                <div className="text-center">
                  <Button variant="hero-outline" onClick={() => { setSelected(null); setShowSim(false); }}>Simulate Another Career</Button>
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
