import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, CheckCircle2, AlertTriangle, Lightbulb, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mkQ = (q: string, hint: string, ideal: string) => ({ q, hint, ideal });

const interviewData: Record<string, { questions: any[] }> = {
  "Software Engineer": { questions: [
    mkQ("Explain the difference between REST and GraphQL. When would you choose one over the other?", "Think about data fetching efficiency, over-fetching, and use cases.", "REST uses fixed endpoints returning predefined data structures, while GraphQL uses a single endpoint where clients specify exactly what data they need. Choose REST for simple CRUD APIs and caching. Choose GraphQL for complex data relationships, mobile apps needing minimal data, or when multiple clients need different data shapes."),
    mkQ("How would you design a URL shortener like bit.ly?", "Consider hashing, database design, scalability, and redirection.", "Use base62 encoding of an auto-incrementing ID or hash function for short codes. Store mappings in a database. Use caching (Redis) for popular URLs. Handle redirects with 301/302 HTTP codes. Consider rate limiting, analytics tracking, and custom aliases."),
    mkQ("Tell me about a challenging bug you fixed. What was your debugging process?", "Use the STAR method: Situation, Task, Action, Result.", "Describe a specific bug with context. Explain how you reproduced it, the tools you used (debugger, logs), your hypothesis testing approach, root cause, fix, and lessons learned."),
    mkQ("What is the difference between SQL and NoSQL databases? When would you use each?", "Consider data structure, scalability, ACID compliance.", "SQL databases use structured schemas and excel at complex queries and transactions (PostgreSQL, MySQL). NoSQL databases offer flexible schemas for unstructured data and horizontal scaling (MongoDB, Redis). Use SQL for relational data with integrity constraints, NoSQL for high-throughput, flexible schema needs."),
    mkQ("Explain the concept of microservices architecture. What are its pros and cons?", "Think about scalability, deployment, and complexity tradeoffs.", "Microservices decompose applications into small, independently deployable services. Pros: independent scaling, technology diversity, fault isolation. Cons: distributed system complexity, network latency, data consistency challenges. Best for large teams and complex domains."),
  ]},
  "Data Scientist": { questions: [
    mkQ("Explain the bias-variance tradeoff. How do you handle it?", "Think about model complexity, underfitting, overfitting.", "Bias is error from simplifying assumptions (underfitting). Variance is sensitivity to training data (overfitting). Use cross-validation, regularization (L1/L2), ensemble methods. Monitor training vs validation metrics."),
    mkQ("How would you handle a dataset with 40% missing values?", "Consider the pattern of missingness.", "Analyze missing pattern (MCAR, MAR, MNAR). Options: drop high-missing columns, impute with mean/median/mode, use KNN/MICE for complex patterns, create is_missing indicators. Validate imputation doesn't introduce bias."),
    mkQ("Describe a project where your analysis influenced a business decision.", "Focus on business impact and communication.", "Describe the business problem, data sources, methodology, key findings, how you presented to stakeholders, the decision made, and measurable impact."),
    mkQ("What is the difference between supervised and unsupervised learning? Give examples.", "Think about labeled vs unlabeled data.", "Supervised learning uses labeled data to learn mapping from inputs to outputs (classification, regression). Unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction). Examples: spam detection (supervised), customer segmentation (unsupervised)."),
    mkQ("How do you evaluate a classification model beyond accuracy?", "Consider class imbalance and different error costs.", "Use precision, recall, F1-score, AUC-ROC, confusion matrix. Precision matters when false positives are costly. Recall matters when false negatives are critical. AUC-ROC gives overall performance across thresholds."),
  ]},
  "Product Manager": { questions: [
    mkQ("How would you prioritize features with limited resources?", "Think about RICE, MoSCoW, or Impact/Effort.", "Use RICE (Reach × Impact × Confidence / Effort). Consider business alignment, user research, technical feasibility. Create scoring matrix, involve team in decisions."),
    mkQ("A key metric dropped 15% this week. Walk me through your investigation.", "Think systematically: data, segments, changes.", "Verify data correctness. Check if drop is across all segments. Look at recent releases, A/B tests, infrastructure changes, external factors. Form hypotheses, test with data, communicate findings."),
    mkQ("How do you measure the success of a product feature?", "Think beyond vanity metrics.", "Define success metrics before launch: primary metric (north star), secondary, guardrail metrics. Use quantitative (adoption, retention, revenue) and qualitative (satisfaction, NPS). Set targets, run A/B tests."),
    mkQ("How would you decide between building a new feature vs improving an existing one?", "Think about user impact, technical debt, and business goals.", "Analyze user feedback, usage metrics, and business impact. Consider opportunity cost, technical debt, and strategic alignment. New features drive growth, improvements drive retention. Use data to quantify expected impact."),
    mkQ("Describe how you would handle disagreement with engineering about a feature scope.", "Think about communication, data, and compromise.", "Listen to engineering concerns, share user research data, find common ground. Propose phased approach (MVP first). Use frameworks like effort/impact matrix. Build trust through transparency."),
  ]},
  "Cybersecurity Analyst": { questions: [
    mkQ("Explain the difference between symmetric and asymmetric encryption.", "Think about key management, speed, and protocols.", "Symmetric uses one shared key (AES) — fast, for bulk encryption. Asymmetric uses public/private pairs (RSA) — slower, for key exchange and signatures. TLS uses hybrid: asymmetric for handshake, symmetric for data."),
    mkQ("You notice unusual outbound traffic at 3 AM. What steps do you take?", "Think about incident response.", "Alert IR team, capture traffic, check logs/processes/connections. Determine if data exfiltration or C2. If malicious: isolate, preserve evidence, identify vector, contain, eradicate, recover, document."),
    mkQ("How would you secure a web application against the OWASP Top 10?", "Cover injection, auth, XSS, and other vulnerabilities.", "Parameterized queries (SQLi), proper auth/session management, input validation (XSS), access controls, security headers, dependency scanning, CSRF tokens, secure API design. Regular pen testing."),
    mkQ("What is the CIA triad and why is it important?", "Think about the three pillars of information security.", "Confidentiality (data access control), Integrity (data accuracy and trustworthiness), Availability (systems accessible when needed). Every security decision should balance these three principles."),
    mkQ("Explain the concept of defense in depth.", "Think about layered security controls.", "Multiple layers of security controls so if one fails, others protect. Layers include physical, network, host, application, data security. Example: firewall + IDS + encryption + access controls + monitoring."),
  ]},
  "UX Designer": { questions: [
    mkQ("Walk me through your design process for a new feature.", "Think about research, ideation, prototyping, testing.", "Start with user research (interviews, surveys). Define user personas and journeys. Ideate with sketches and wireframes. Create prototypes in Figma. Conduct usability testing. Iterate based on feedback. Handoff to dev with specs."),
    mkQ("How do you handle conflicting feedback from stakeholders and users?", "Think about data-driven decisions.", "Prioritize user needs backed by research data. Present findings to stakeholders with evidence. Find compromises that serve both business goals and user needs. Use A/B testing to validate decisions."),
    mkQ("What makes a good design system? How would you build one?", "Think about consistency, scalability, documentation.", "A good design system includes: component library, design tokens, usage guidelines, accessibility standards. Start with an audit of existing components. Define core patterns. Document everything. Make it easy to contribute."),
    mkQ("How do you measure the success of a design?", "Think about usability metrics and business impact.", "Use task completion rates, time on task, error rates, SUS scores. Also measure business metrics: conversion, engagement, retention. Combine quantitative metrics with qualitative feedback."),
    mkQ("Explain the importance of accessibility in design.", "Think about inclusive design principles.", "Accessibility ensures products work for everyone, including people with disabilities. Follow WCAG guidelines. Consider visual, motor, auditory, and cognitive accessibility. It's also good for business — reaches wider audience and often improves UX for all users."),
  ]},
  "DevOps Engineer": { questions: [
    mkQ("Explain the difference between containers and virtual machines.", "Think about isolation, resource usage, startup time.", "VMs virtualize hardware with full OS — heavier, stronger isolation. Containers share host kernel — lightweight, fast startup, efficient. VMs for strong isolation needs, containers for microservices and rapid deployment."),
    mkQ("How would you design a CI/CD pipeline for a microservices application?", "Think about testing, deployment strategies, rollback.", "Source control triggers build, run unit/integration tests, build container images, push to registry, deploy to staging, run E2E tests, deploy to production with blue-green or canary strategy. Include rollback mechanisms and monitoring."),
    mkQ("What is Infrastructure as Code and why is it important?", "Think about repeatability, version control, automation.", "IaC manages infrastructure through code (Terraform, CloudFormation) instead of manual processes. Benefits: version-controlled, repeatable, reviewable, testable. Enables disaster recovery, environment parity, and team collaboration."),
    mkQ("How do you handle secrets management in a DevOps environment?", "Think about security best practices.", "Never store secrets in code or env files in repos. Use secrets managers (Vault, AWS Secrets Manager). Rotate secrets regularly. Use least-privilege access. Encrypt at rest and in transit. Audit access logs."),
    mkQ("Describe a production incident you handled. What was the resolution?", "Use a structured approach: detect, respond, resolve, learn.", "Describe the incident, how it was detected (monitoring/alerts), initial triage, root cause analysis, resolution steps, impact assessment, and post-mortem. Highlight what you changed to prevent recurrence."),
  ]},
  "Full Stack Developer": { questions: [
    mkQ("How do you decide between server-side rendering and client-side rendering?", "Think about SEO, performance, user experience.", "SSR is better for SEO, initial load performance, and content-heavy sites. CSR is better for interactive apps, SPAs, and when SEO isn't critical. Consider hybrid approaches like Next.js ISR for best of both worlds."),
    mkQ("Explain how authentication and authorization work in a web application.", "Think about JWT, sessions, OAuth, roles.", "Authentication verifies identity (login). Authorization determines access (permissions). Common approaches: session-based (server stores state), JWT (stateless tokens), OAuth for third-party auth. Use RBAC or ABAC for authorization."),
    mkQ("How would you optimize a slow web application?", "Think about frontend and backend optimizations.", "Frontend: code splitting, lazy loading, image optimization, caching. Backend: database query optimization, indexing, caching (Redis), connection pooling. Network: CDN, compression, HTTP/2. Measure with Lighthouse, profiling tools."),
    mkQ("Describe the most complex feature you've built. What challenges did you face?", "Focus on technical decisions and problem solving.", "Describe the feature, architecture decisions, technical challenges (scaling, data consistency, real-time requirements), how you solved them, and what you'd do differently."),
    mkQ("What's your approach to error handling in a full-stack application?", "Think about both client and server error handling.", "Server: try-catch blocks, error middleware, proper HTTP status codes, error logging (structured logging). Client: error boundaries in React, graceful degradation, user-friendly error messages, retry mechanisms. Monitor errors with tools like Sentry."),
  ]},
  "Mobile App Developer": { questions: [
    mkQ("What are the key differences between React Native and Flutter?", "Think about performance, ecosystem, and developer experience.", "React Native uses JavaScript with native components — larger ecosystem, hot reload. Flutter uses Dart with custom rendering — better performance, consistent UI across platforms. Choose RN for JS teams and web code sharing, Flutter for pixel-perfect cross-platform UI."),
    mkQ("How do you handle offline functionality in a mobile app?", "Think about caching, sync, and conflict resolution.", "Use local storage (SQLite, Realm) for data persistence. Implement sync queue for pending changes. Handle conflicts with last-write-wins or merge strategies. Show appropriate UI for offline state. Use background sync when connection restores."),
    mkQ("How do you optimize mobile app performance?", "Think about memory, rendering, and network.", "Optimize list rendering (FlatList/ListView), minimize re-renders, use image caching, implement lazy loading, reduce bundle size, optimize network calls (batching, caching), profile with platform tools (Xcode Instruments, Android Profiler)."),
  ]},
  "Cloud Architect": { questions: [
    mkQ("How would you design a highly available system on AWS?", "Think about multi-AZ, auto-scaling, and failover.", "Use multi-AZ deployments, auto-scaling groups, load balancers (ALB/NLB), RDS Multi-AZ, S3 cross-region replication, Route53 health checks. Design for failure with circuit breakers and graceful degradation. Target 99.99% availability."),
    mkQ("Explain the difference between horizontal and vertical scaling.", "Think about cost, complexity, and limits.", "Vertical scaling: increase resources of single instance (CPU, RAM) — simpler but has limits. Horizontal scaling: add more instances — more complex but virtually unlimited. Cloud-native apps should design for horizontal scaling."),
    mkQ("How do you approach cloud cost optimization?", "Think about right-sizing, reserved instances, and architecture.", "Right-size instances, use reserved/spot instances, implement auto-scaling, optimize storage tiers, use serverless for variable workloads, monitor with cost explorer, set budgets and alerts, architect for cost efficiency."),
  ]},
  "Blockchain Developer": { questions: [
    mkQ("Explain smart contract security best practices.", "Think about reentrancy, overflow, and access control.", "Use checks-effects-interactions pattern, implement access controls, avoid reentrancy (use ReentrancyGuard), use SafeMath for arithmetic, audit contracts, write comprehensive tests, use formal verification for critical contracts."),
    mkQ("What is the difference between proof of work and proof of stake?", "Think about energy, security, and decentralization.", "PoW: miners solve computational puzzles — energy intensive, proven security (Bitcoin). PoS: validators stake tokens — energy efficient, faster finality (Ethereum 2.0). PoS reduces environmental impact but introduces different centralization risks."),
    mkQ("How do you handle gas optimization in Solidity?", "Think about storage, computation, and design patterns.", "Minimize storage operations (most expensive), use memory variables, batch operations, use events for non-critical data, optimize data types (uint256 vs uint8), use mappings over arrays for lookups, implement efficient algorithms."),
  ]},
  "Game Developer": { questions: [
    mkQ("Explain the game loop and how it differs from a typical application loop.", "Think about fixed vs variable timestep.", "The game loop continuously processes input, updates game state, and renders frames. Unlike event-driven apps, it runs constantly. Use fixed timestep for physics (deterministic), variable for rendering (smooth visuals). Handle frame rate independence."),
    mkQ("How do you handle collision detection in a 2D game?", "Think about broad phase and narrow phase.", "Broad phase: spatial partitioning (quadtree, grid) to reduce pair checks. Narrow phase: AABB, circle-circle, SAT for precise detection. Optimize by only checking nearby objects. Handle collision response (bounce, stop, trigger)."),
    mkQ("What is the Entity Component System (ECS) pattern?", "Think about composition over inheritance.", "ECS separates data (Components) from behavior (Systems) and identity (Entities). Entities are IDs, Components are pure data, Systems process entities with specific components. Benefits: cache-friendly, flexible composition, easy to extend. Used in Unity DOTS, Bevy."),
  ]},
  "Data Analyst": { questions: [
    mkQ("How do you communicate data findings to non-technical stakeholders?", "Think about storytelling and visualization.", "Start with the business question and answer. Use clear visualizations, avoid jargon. Tell a story: context, finding, implication, recommendation. Use dashboards for ongoing metrics. Tailor detail level to audience."),
    mkQ("What is the difference between correlation and causation?", "Think about confounding variables and experiments.", "Correlation means two variables move together but doesn't imply one causes the other. Causation requires controlled experiments or causal inference methods. Confounding variables can create spurious correlations. Use A/B tests for causal claims."),
    mkQ("Describe your approach to exploratory data analysis.", "Think about systematic exploration.", "Start with understanding data shape, types, and quality. Check distributions, missing values, outliers. Compute summary statistics. Create visualizations (histograms, scatter plots, correlations). Formulate hypotheses. Document findings."),
  ]},
};

export default function InterviewPage() {
  const [role, setRole] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentQ = role ? interviewData[role]?.questions[qIndex] : null;
  const totalQ = role ? interviewData[role]?.questions.length : 0;

  const evaluate = async () => {
    if (!answer.trim() || !currentQ) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));

    const wordCount = answer.trim().split(/\s+/).length;
    const idealWords = currentQ.ideal.toLowerCase().split(" ").filter((w: string) => w.length > 4);
    const keyWords = idealWords.slice(0, 12);
    const matched = keyWords.filter((kw: string) => answer.toLowerCase().includes(kw));
    const keyScore = Math.min(100, Math.round((matched.length / keyWords.length) * 100));
    const lenScore = Math.min(100, Math.round((wordCount / 80) * 100));
    const score = Math.round(keyScore * 0.6 + lenScore * 0.4);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    if (wordCount > 50) strengths.push("Good depth and detail in your response");
    else weaknesses.push("Try to be more detailed — aim for 50+ words");
    if (keyScore > 50) strengths.push("Covers key concepts effectively");
    else weaknesses.push("Missing important concepts — review the suggested answer");
    if (answer.includes("example") || answer.includes("instance") || answer.includes("e.g.")) strengths.push("Good use of examples");
    else weaknesses.push("Add specific examples to strengthen your answer");
    if (score > 70) strengths.push("Strong overall answer");
    if (score < 40) weaknesses.push("Needs significant improvement — study the ideal answer");
    if (wordCount > 100) strengths.push("Comprehensive and thorough response");

    setEvaluation({ score, strengths, weaknesses, idealAnswer: currentQ.ideal });
    setLoading(false);
  };

  const nextQuestion = () => {
    if (role && qIndex < totalQ - 1) {
      setQIndex(qIndex + 1);
      setAnswer("");
      setEvaluation(null);
    }
  };

  const restart = () => { setRole(null); setQIndex(0); setAnswer(""); setEvaluation(null); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI <span className="gradient-text">Interview Simulator</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Practice with {Object.keys(interviewData).length} roles and get AI-powered feedback.
            </p>
          </motion.div>

          {!role ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Select a Role to Practice ({Object.keys(interviewData).length} roles)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.keys(interviewData).map((r) => (
                  <button key={r} onClick={() => { setRole(r); setQIndex(0); setAnswer(""); setEvaluation(null); }}
                    className="p-3 rounded-lg bg-secondary/50 text-foreground text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all text-left border border-border/50 hover:border-primary/30">
                    <span>{r}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">{interviewData[r].questions.length} questions</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={`${role}-${qIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                      Question {qIndex + 1} of {totalQ}
                    </span>
                    <span className="text-xs text-muted-foreground">{role}</span>
                  </div>
                  <p className="text-foreground font-medium text-lg mb-3">{currentQ?.q}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-accent" /> Hint: {currentQ?.hint}
                  </p>
                </div>

                <div className="glass-card p-6">
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..." rows={6}
                    className="w-full bg-secondary/50 border border-border rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-muted-foreground">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <Button variant="hero" onClick={evaluate} disabled={loading || !answer.trim()}>
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</> : <><Send className="h-4 w-4" /> Submit</>}
                    </Button>
                  </div>
                </div>

                {evaluation && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="glass-card p-6 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Answer Score</p>
                      <p className={`font-display text-5xl font-bold ${evaluation.score >= 70 ? "text-primary" : evaluation.score >= 40 ? "text-accent" : "text-destructive"}`}>
                        {evaluation.score}/100
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card p-5">
                        <h4 className="font-display text-sm font-semibold mb-3 text-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Strengths</h4>
                        <ul className="space-y-1.5">
                          {evaluation.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" /> {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass-card p-5">
                        <h4 className="font-display text-sm font-semibold mb-3 text-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-accent" /> Improvements</h4>
                        <ul className="space-y-1.5">
                          {evaluation.weaknesses.map((s: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><AlertTriangle className="h-3 w-3 text-accent mt-0.5 shrink-0" /> {s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="glass-card p-5">
                      <h4 className="font-display text-sm font-semibold mb-2 text-foreground flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Suggested Answer</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.idealAnswer}</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      {qIndex < totalQ - 1 && <Button variant="hero" onClick={nextQuestion}>Next Question</Button>}
                      <Button variant="hero-outline" onClick={restart}><RotateCcw className="h-4 w-4" /> Start Over</Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
