import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, CheckCircle2, AlertTriangle, Lightbulb, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const interviewData: Record<string, { questions: { q: string; hint: string; ideal: string }[] }> = {
  "Software Engineer": {
    questions: [
      { q: "Explain the difference between REST and GraphQL. When would you choose one over the other?", hint: "Think about data fetching efficiency, over-fetching, and use cases.", ideal: "REST uses fixed endpoints returning predefined data structures, while GraphQL uses a single endpoint where clients specify exactly what data they need. Choose REST for simple CRUD APIs and caching. Choose GraphQL for complex data relationships, mobile apps needing minimal data, or when multiple clients need different data shapes." },
      { q: "How would you design a URL shortener like bit.ly?", hint: "Consider hashing, database design, scalability, and redirection.", ideal: "Use a base62 encoding of an auto-incrementing ID or a hash function for short codes. Store mappings in a database with the short code as the primary key. Use caching (Redis) for popular URLs. Handle redirects with 301/302 HTTP codes. Consider rate limiting, analytics tracking, and custom aliases." },
      { q: "Tell me about a challenging bug you fixed. What was your debugging process?", hint: "Use the STAR method: Situation, Task, Action, Result.", ideal: "Describe a specific bug with context. Explain how you reproduced it, the tools you used (debugger, logs, profiler), your hypothesis testing approach, the root cause discovered, and the fix implemented. Mention what you learned and any process improvements made." },
    ],
  },
  "Data Scientist": {
    questions: [
      { q: "Explain the bias-variance tradeoff. How do you handle it in practice?", hint: "Think about model complexity, underfitting, overfitting.", ideal: "Bias is error from simplifying assumptions (underfitting). Variance is sensitivity to training data fluctuations (overfitting). The tradeoff means reducing one often increases the other. In practice: use cross-validation, regularization (L1/L2), ensemble methods, and adjust model complexity. Monitor both training and validation metrics." },
      { q: "How would you handle a dataset with 40% missing values?", hint: "Consider the pattern of missingness and impact on analysis.", ideal: "First analyze the missing pattern (MCAR, MAR, MNAR). Options: drop columns with >70% missing, impute using mean/median/mode for numerical, KNN or MICE for complex patterns, create 'is_missing' indicator features. For tree models, some handle missing values natively. Always validate that imputation doesn't introduce bias." },
      { q: "Describe a data project where your analysis influenced a business decision.", hint: "Focus on business impact and how you communicated findings.", ideal: "Describe the business problem, data sources used, analysis methodology, key findings, how you presented results to stakeholders (visualizations, dashboards), the decision made, and measurable business impact (revenue, efficiency, user satisfaction)." },
    ],
  },
  "Product Manager": {
    questions: [
      { q: "How would you prioritize features when you have limited engineering resources?", hint: "Think about frameworks like RICE, MoSCoW, or Impact/Effort.", ideal: "Use a structured framework like RICE (Reach × Impact × Confidence / Effort). Consider business goals alignment, user research data, technical feasibility, and dependencies. Communicate tradeoffs clearly to stakeholders. Create a scoring matrix and involve the team in prioritization decisions." },
      { q: "A key metric dropped 15% this week. Walk me through your investigation.", hint: "Think systematically: data, segments, changes, external factors.", ideal: "First verify the data is correct (no tracking bugs). Check if the drop is across all segments or specific ones. Look at recent releases, A/B tests, or infrastructure changes. Check external factors (seasonality, competitors, news). Form hypotheses, test each with data. Communicate findings and action plan to stakeholders." },
      { q: "How do you measure the success of a product feature?", hint: "Think beyond vanity metrics — focus on outcomes.", ideal: "Define success metrics before launch: primary metric (north star), secondary metrics, and guardrail metrics. Use both quantitative (adoption rate, retention, revenue impact) and qualitative (user satisfaction, NPS) measures. Set targets, run A/B tests, and measure long-term impact not just launch metrics." },
    ],
  },
  "Cybersecurity Analyst": {
    questions: [
      { q: "Explain the difference between symmetric and asymmetric encryption. Give use cases for each.", hint: "Think about key management, speed, and common protocols.", ideal: "Symmetric uses one shared key (AES, DES) — fast, used for bulk data encryption. Asymmetric uses public/private key pairs (RSA, ECC) — slower, used for key exchange, digital signatures, and TLS handshakes. In practice, TLS uses asymmetric for initial handshake then switches to symmetric for data transfer (hybrid approach)." },
      { q: "You notice unusual outbound traffic from a server at 3 AM. What steps do you take?", hint: "Think about incident response procedures and containment.", ideal: "1) Alert the incident response team. 2) Capture network traffic for analysis. 3) Check server logs, running processes, and open connections. 4) Determine if it's data exfiltration, C2 communication, or legitimate. 5) If malicious: isolate the server, preserve evidence, identify attack vector. 6) Contain, eradicate, recover, and document lessons learned." },
      { q: "How would you secure a web application against the OWASP Top 10?", hint: "Cover injection, auth, XSS, and other key vulnerabilities.", ideal: "Implement parameterized queries (SQL injection), proper authentication/session management, input validation and output encoding (XSS), access controls, security headers (CSP, HSTS), dependency scanning, logging/monitoring, CSRF tokens, and secure API design. Use WAF, regular penetration testing, and security code reviews." },
    ],
  },
};

export default function InterviewPage() {
  const [role, setRole] = useState<string | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentQ = role ? interviewData[role]?.questions[qIndex] : null;

  const evaluate = async () => {
    if (!answer.trim() || !currentQ) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));

    const wordCount = answer.trim().split(/\s+/).length;
    const hasKeywords = currentQ.ideal.toLowerCase().split(" ").filter((w) => w.length > 4).slice(0, 10);
    const matchedKeywords = hasKeywords.filter((kw) => answer.toLowerCase().includes(kw));
    const keywordScore = Math.min(100, Math.round((matchedKeywords.length / hasKeywords.length) * 100));
    const lengthScore = Math.min(100, Math.round((wordCount / 80) * 100));
    const score = Math.round(keywordScore * 0.6 + lengthScore * 0.4);

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (wordCount > 50) strengths.push("Detailed response with good depth");
    else weaknesses.push("Answer could be more detailed — aim for 50+ words");

    if (keywordScore > 50) strengths.push("Covers key concepts well");
    else weaknesses.push("Missing some important concepts — review the suggested answer");

    if (answer.includes("example") || answer.includes("instance") || answer.includes("e.g.")) strengths.push("Good use of examples");
    else weaknesses.push("Consider adding specific examples to strengthen your answer");

    if (score > 70) strengths.push("Strong overall answer");
    if (score < 40) weaknesses.push("Review the ideal answer and restructure your response");

    setEvaluation({ score, strengths, weaknesses, idealAnswer: currentQ.ideal });
    setLoading(false);
  };

  const nextQuestion = () => {
    if (role && qIndex < interviewData[role].questions.length - 1) {
      setQIndex(qIndex + 1);
      setAnswer("");
      setEvaluation(null);
    }
  };

  const restart = () => {
    setRole(null);
    setQIndex(0);
    setAnswer("");
    setEvaluation(null);
  };

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
              Practice with realistic interview questions and get AI-powered feedback on your answers.
            </p>
          </motion.div>

          {!role ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> Select a Role to Practice
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.keys(interviewData).map((r) => (
                  <button key={r} onClick={() => { setRole(r); setQIndex(0); setAnswer(""); setEvaluation(null); }}
                    className="p-4 rounded-lg bg-secondary/50 text-foreground text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all text-left border border-border/50 hover:border-primary/30">
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={`${role}-${qIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Question */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                      Question {qIndex + 1} of {interviewData[role].questions.length}
                    </span>
                    <span className="text-xs text-muted-foreground">{role}</span>
                  </div>
                  <p className="text-foreground font-medium text-lg mb-3">{currentQ?.q}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-accent" /> Hint: {currentQ?.hint}
                  </p>
                </div>

                {/* Answer Input */}
                <div className="glass-card p-6">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="w-full bg-secondary/50 border border-border rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-muted-foreground">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
                    <Button variant="hero" onClick={evaluate} disabled={loading || !answer.trim()}>
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</> : <><Send className="h-4 w-4" /> Submit Answer</>}
                    </Button>
                  </div>
                </div>

                {/* Evaluation */}
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
                        <h4 className="font-display text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" /> Strengths
                        </h4>
                        <ul className="space-y-1.5">
                          {evaluation.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="glass-card p-5">
                        <h4 className="font-display text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-accent" /> Improvements
                        </h4>
                        <ul className="space-y-1.5">
                          {evaluation.weaknesses.map((s: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <AlertTriangle className="h-3 w-3 text-accent mt-0.5 shrink-0" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="glass-card p-5">
                      <h4 className="font-display text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" /> Suggested Answer
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.idealAnswer}</p>
                    </div>

                    <div className="flex justify-center gap-3">
                      {qIndex < interviewData[role].questions.length - 1 && (
                        <Button variant="hero" onClick={nextQuestion}>Next Question</Button>
                      )}
                      <Button variant="hero-outline" onClick={restart}>
                        <RotateCcw className="h-4 w-4" /> Start Over
                      </Button>
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
