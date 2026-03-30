import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Clock, Heart, Flame, DollarSign, Wifi, Loader2, Sun, Coffee, Monitor, Users, Moon, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mkTime = (time: string, icon: any, activity: string, detail: string) => ({ time, icon, activity, detail });

const roles: Record<string, any> = {
  "Software Engineer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Morning standup", "Discuss progress, blockers, and priorities."),
      mkTime("9:30 AM", Monitor, "Deep work — coding", "Feature development, bug fixes, code reviews."),
      mkTime("12:00 PM", Sun, "Lunch & tech reading", "Read blogs, Hacker News, conference talks."),
      mkTime("1:00 PM", Users, "Code review & pairing", "Review PRs and collaborate with teammates."),
      mkTime("3:00 PM", Monitor, "Architecture planning", "Design systems, write docs, plan sprints."),
      mkTime("5:30 PM", Moon, "Wrap up", "Push commits, update tickets, side projects."),
    ],
    environment: "Office or Remote — Most teams offer hybrid/remote with flexible hours.",
    workLifeBalance: 4, stressLevel: 3, avgSalary: "$85K–$165K",
    remoteOpportunity: "Very High — 70%+ roles offer remote", growth: "Strong demand, 25% growth projected.",
  },
  "Data Scientist": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Check model performance", "Review overnight runs, metrics, alerts."),
      mkTime("10:00 AM", Monitor, "Data exploration", "Analyze datasets, create features, clean data."),
      mkTime("12:00 PM", Sun, "Lunch & research", "Read ML papers, journal clubs."),
      mkTime("1:00 PM", Users, "Stakeholder meeting", "Present findings, discuss requirements."),
      mkTime("2:30 PM", Monitor, "Model training", "Train models, A/B tests, hyperparameters."),
      mkTime("5:00 PM", Moon, "Documentation", "Document experiments, Kaggle, online courses."),
    ],
    environment: "Mostly hybrid. Collaborative data teams.",
    workLifeBalance: 4, stressLevel: 3, avgSalary: "$90K–$160K",
    remoteOpportunity: "High — 60%+", growth: "Very high demand, fastest growing tech role.",
  },
  "Product Manager": {
    schedule: [
      mkTime("8:30 AM", Coffee, "Review metrics", "Check analytics, support tickets, NPS."),
      mkTime("9:30 AM", Users, "Sprint planning", "Prioritize backlog, assign tasks."),
      mkTime("11:00 AM", Monitor, "User research", "Conduct interviews, analyze surveys."),
      mkTime("12:00 PM", Sun, "Lunch with stakeholders", "Build relationships, gather input."),
      mkTime("1:30 PM", Monitor, "Write PRDs", "Document requirements, update roadmap."),
      mkTime("4:00 PM", Users, "Design review", "Review with UX, plan GTM strategy."),
    ],
    environment: "Highly collaborative, lots of meetings. Mostly hybrid.",
    workLifeBalance: 3, stressLevel: 4, avgSalary: "$95K–$175K",
    remoteOpportunity: "Medium — 50%", growth: "Steady demand as companies go product-led.",
  },
  "Cybersecurity Analyst": {
    schedule: [
      mkTime("8:00 AM", Coffee, "Review alerts", "Check SIEM, triage alerts, identify threats."),
      mkTime("9:30 AM", Monitor, "Vulnerability assessment", "Run scans, prioritize patches."),
      mkTime("11:00 AM", Users, "Incident response", "Coordinate on active incidents."),
      mkTime("12:00 PM", Sun, "Lunch & threat intel", "Read threat reports, briefings."),
      mkTime("1:30 PM", Monitor, "Penetration testing", "Test systems, write exploit reports."),
      mkTime("4:00 PM", Moon, "Documentation", "Update policies, audit reports."),
    ],
    environment: "Often on-site. May include on-call rotations.",
    workLifeBalance: 3, stressLevel: 4, avgSalary: "$75K–$140K",
    remoteOpportunity: "Medium — some require on-site", growth: "Extremely high demand.",
  },
  "UX Designer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Design research", "Browse Dribbble, competitor analysis, sketches."),
      mkTime("10:00 AM", Monitor, "Wireframing", "Create wireframes in Figma, prototypes."),
      mkTime("12:00 PM", Sun, "Lunch & community", "Design meetups, UX articles."),
      mkTime("1:00 PM", Users, "Usability testing", "Run user testing, gather feedback."),
      mkTime("3:00 PM", Monitor, "Design iteration", "Refine designs, update design system."),
      mkTime("5:00 PM", Moon, "Handoff", "Prepare specs for developers."),
    ],
    environment: "Creative atmosphere. Mix of focus and workshops.",
    workLifeBalance: 4, stressLevel: 2, avgSalary: "$70K–$130K",
    remoteOpportunity: "High — design works well remote", growth: "Growing as companies prioritize UX.",
  },
  "DevOps Engineer": {
    schedule: [
      mkTime("8:30 AM", Coffee, "Check monitoring", "Review dashboards, alerts, system health."),
      mkTime("9:00 AM", Monitor, "Infrastructure work", "Terraform, Kubernetes, CI/CD pipelines."),
      mkTime("11:00 AM", Users, "Incident post-mortem", "Review recent incidents, improve processes."),
      mkTime("12:00 PM", Sun, "Lunch", "Community forums, tech blogs."),
      mkTime("1:00 PM", Monitor, "Automation", "Write scripts, improve deployment pipelines."),
      mkTime("4:00 PM", Moon, "Documentation & planning", "Update runbooks, capacity planning."),
    ],
    environment: "Often on-call rotations. Mix of proactive and reactive work.",
    workLifeBalance: 3, stressLevel: 4, avgSalary: "$90K–$160K",
    remoteOpportunity: "High — 65%+", growth: "Critical role, strong growth.",
  },
  "Mobile App Developer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Standup & planning", "Discuss sprint goals, review tickets."),
      mkTime("9:30 AM", Monitor, "Feature development", "Build screens, implement logic, integrate APIs."),
      mkTime("12:00 PM", Sun, "Lunch & learning", "Watch WWDC/Google I/O sessions."),
      mkTime("1:00 PM", Monitor, "Testing & debugging", "Write tests, fix platform-specific bugs."),
      mkTime("3:00 PM", Users, "Design handoff review", "Align with designers on pixel-perfect UI."),
      mkTime("5:00 PM", Moon, "App store & releases", "Prepare builds, manage releases."),
    ],
    environment: "Collaborative. Need to coordinate with backend and design teams.",
    workLifeBalance: 4, stressLevel: 3, avgSalary: "$80K–$150K",
    remoteOpportunity: "High — 65%+", growth: "Strong with mobile-first trends.",
  },
  "Cloud Architect": {
    schedule: [
      mkTime("8:30 AM", Coffee, "Review cloud costs", "Analyze spending, identify optimizations."),
      mkTime("9:30 AM", Monitor, "Architecture design", "Design cloud solutions, write proposals."),
      mkTime("11:00 AM", Users, "Stakeholder meeting", "Align on tech strategy with leadership."),
      mkTime("12:00 PM", Sun, "Lunch & certifications", "Study for cloud certs, read whitepapers."),
      mkTime("1:30 PM", Monitor, "Implementation", "Terraform modules, security configs."),
      mkTime("4:00 PM", Moon, "Mentoring & reviews", "Guide junior engineers, review architectures."),
    ],
    environment: "Strategic role with mix of hands-on and leadership work.",
    workLifeBalance: 4, stressLevel: 3, avgSalary: "$130K–$200K",
    remoteOpportunity: "High — mostly remote-friendly", growth: "Cloud spending growing 20%+ annually.",
  },
  "Machine Learning Engineer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Model monitoring", "Check production model performance, drift."),
      mkTime("10:00 AM", Monitor, "Pipeline development", "Build data and training pipelines."),
      mkTime("12:00 PM", Sun, "Lunch & papers", "Read latest ML research."),
      mkTime("1:00 PM", Users, "Cross-team sync", "Align with data science and engineering."),
      mkTime("2:30 PM", Monitor, "Experimentation", "Run experiments, evaluate models."),
      mkTime("5:00 PM", Moon, "Infrastructure", "Optimize serving, reduce latency."),
    ],
    environment: "Bridges research and production. Highly technical.",
    workLifeBalance: 3, stressLevel: 4, avgSalary: "$100K–$180K",
    remoteOpportunity: "High — 60%+", growth: "Booming with AI adoption.",
  },
  "Blockchain Developer": {
    schedule: [
      mkTime("10:00 AM", Coffee, "Check deployments", "Monitor smart contracts, gas costs."),
      mkTime("10:30 AM", Monitor, "Smart contract development", "Write Solidity, test on testnet."),
      mkTime("12:30 PM", Sun, "Lunch & community", "Discord, governance discussions."),
      mkTime("1:30 PM", Monitor, "Security auditing", "Review contracts for vulnerabilities."),
      mkTime("3:30 PM", Users, "Protocol design", "Discuss tokenomics, governance mechanisms."),
      mkTime("5:30 PM", Moon, "Open source", "Contribute to protocols, write docs."),
    ],
    environment: "Often remote-first. Fast-paced, startup culture.",
    workLifeBalance: 3, stressLevel: 4, avgSalary: "$100K–$200K",
    remoteOpportunity: "Very High — 80%+ remote", growth: "Volatile but growing long-term.",
  },
  "Game Developer": {
    schedule: [
      mkTime("10:00 AM", Coffee, "Team sync", "Discuss milestones, review builds."),
      mkTime("10:30 AM", Monitor, "Gameplay programming", "Implement mechanics, physics, AI."),
      mkTime("12:30 PM", Sun, "Lunch & playtesting", "Test builds, gather feedback."),
      mkTime("1:30 PM", Monitor, "Graphics & optimization", "Shaders, performance profiling."),
      mkTime("3:30 PM", Users, "Art & design review", "Collaborate with artists, review assets."),
      mkTime("5:30 PM", Moon, "Bug fixing", "Fix gameplay bugs, polish interactions."),
    ],
    environment: "Creative and intense. Crunch periods near launches.",
    workLifeBalance: 2, stressLevel: 4, avgSalary: "$60K–$130K",
    remoteOpportunity: "Medium — 40% remote", growth: "$200B+ industry, steady growth.",
  },
  "Data Analyst": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Dashboard review", "Check KPIs, identify anomalies."),
      mkTime("9:30 AM", Monitor, "SQL queries & analysis", "Pull data, run analyses."),
      mkTime("11:00 AM", Users, "Stakeholder meeting", "Present insights, take requirements."),
      mkTime("12:00 PM", Sun, "Lunch", "Online courses, SQL practice."),
      mkTime("1:00 PM", Monitor, "Report building", "Create visualizations, build dashboards."),
      mkTime("4:00 PM", Moon, "Documentation", "Document methodology, update reports."),
    ],
    environment: "Business-facing role. Lots of communication with non-technical teams.",
    workLifeBalance: 4, stressLevel: 2, avgSalary: "$55K–$95K",
    remoteOpportunity: "High — 60%+", growth: "Strong demand across all industries.",
  },
  "QA Engineer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Test planning", "Review new features, plan test cases."),
      mkTime("9:30 AM", Monitor, "Automated testing", "Write and maintain test suites."),
      mkTime("11:30 AM", Users, "Bug triage", "Discuss bugs with developers, prioritize."),
      mkTime("12:00 PM", Sun, "Lunch", "QA community, testing blogs."),
      mkTime("1:00 PM", Monitor, "Manual testing", "Exploratory testing, edge cases."),
      mkTime("4:00 PM", Moon, "CI/CD & reporting", "Integrate tests, generate reports."),
    ],
    environment: "Works closely with development. Detail-oriented culture.",
    workLifeBalance: 4, stressLevel: 3, avgSalary: "$60K–$110K",
    remoteOpportunity: "High — 60%+", growth: "Growing with shift-left testing.",
  },
  "Technical Writer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Content planning", "Review documentation backlog, prioritize."),
      mkTime("9:30 AM", Monitor, "Writing & editing", "Write API docs, tutorials, guides."),
      mkTime("11:30 AM", Users, "SME interviews", "Talk to engineers about features."),
      mkTime("12:00 PM", Sun, "Lunch & reading", "Read other docs, writing communities."),
      mkTime("1:00 PM", Monitor, "Review & publish", "Incorporate feedback, publish docs."),
      mkTime("4:00 PM", Moon, "Analytics", "Check doc usage, identify gaps."),
    ],
    environment: "Usually remote-friendly. Collaborative with engineering teams.",
    workLifeBalance: 5, stressLevel: 2, avgSalary: "$65K–$120K",
    remoteOpportunity: "Very High — 75%+", growth: "Growing with dev tools and APIs.",
  },
  "Digital Marketer": {
    schedule: [
      mkTime("9:00 AM", Coffee, "Analytics review", "Check campaign performance, KPIs."),
      mkTime("9:30 AM", Monitor, "Content creation", "Write copy, design social media posts."),
      mkTime("11:00 AM", Users, "Team meeting", "Discuss strategy, review campaigns."),
      mkTime("12:00 PM", Sun, "Lunch & trends", "Marketing blogs, competitor analysis."),
      mkTime("1:00 PM", Monitor, "Campaign optimization", "A/B tests, bid adjustments, SEO."),
      mkTime("4:00 PM", Moon, "Reporting", "Build reports, plan next week."),
    ],
    environment: "Fast-paced, creative. Mix of data and creativity.",
    workLifeBalance: 3, stressLevel: 3, avgSalary: "$50K–$100K",
    remoteOpportunity: "High — 65%+", growth: "Strong with digital transformation.",
  },
};

function MeterBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className="h-2.5 w-6 rounded-full transition-all"
          style={{ backgroundColor: i < value ? `hsl(var(--${color}))` : `hsl(var(--secondary))` }} />
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
    await new Promise((r) => setTimeout(r, 1800));
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
              Experience "A Day in the Life" of {Object.keys(roles).length} different career roles.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-8">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Choose a Role ({Object.keys(roles).length} available)</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(roles).map((r) => (
                <Button key={r} size="sm" variant={selected === r ? "hero" : "outline"} onClick={() => simulate(r)} disabled={loading}>
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
                <div className="glass-card p-6">
                  <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" /> A Day in the Life: {selected}
                  </h3>
                  <div className="space-y-3">
                    {data.schedule.map((item: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div className="shrink-0 text-right w-20">
                          <span className="text-sm font-mono text-primary font-semibold">{item.time}</span>
                        </div>
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.activity}</p>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

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
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Salary</p>
                    <p className="font-display text-lg font-bold text-primary">{data.avgSalary}</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Wifi className="h-3 w-3" /> Remote</p>
                    <p className="text-sm text-foreground">{data.remoteOpportunity}</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><Briefcase className="h-3 w-3" /> Environment</p>
                    <p className="text-sm text-foreground">{data.environment}</p>
                  </div>
                  <div className="glass-card p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Growth</p>
                    <p className="text-sm text-foreground">{data.growth}</p>
                  </div>
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
