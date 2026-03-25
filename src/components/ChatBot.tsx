import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "./ui/button";

type Msg = { role: "user" | "assistant"; content: string };

const quickReplies: Record<string, string> = {
  "What skills do I need to become an AI engineer?": "To become an AI Engineer, you'll need:\n\n**Core Skills:**\n- Python programming\n- Mathematics (Linear Algebra, Calculus, Statistics)\n- Machine Learning & Deep Learning\n- Frameworks: TensorFlow, PyTorch\n\n**Intermediate:**\n- NLP & Computer Vision\n- Data Engineering\n- MLOps & Model Deployment\n\n**Advanced:**\n- Research papers & implementation\n- System design for ML\n- Cloud ML services (AWS SageMaker, GCP AI)\n\nStart with Python and math fundamentals, then progress to ML frameworks!",
  "How long to become a data scientist?": "The timeline depends on your background:\n\n**With CS/Math background:** 6-12 months\n- Learn Python for data science\n- Master statistics & ML\n- Build portfolio projects\n\n**From scratch:** 12-24 months\n- Learn programming basics (3 months)\n- Statistics & Math (3 months)\n- ML & Data Analysis (6 months)\n- Portfolio & Interview prep (3 months)\n\n**Key milestones:**\n- Month 3: Basic data analysis\n- Month 6: ML models\n- Month 9: End-to-end projects\n- Month 12: Job-ready portfolio",
  "Which programming language should I learn first?": "It depends on your career goal:\n\n🐍 **Python** — Best for AI/ML, Data Science, Backend\n- Most versatile and beginner-friendly\n- Huge ecosystem for AI/data\n\n🌐 **JavaScript** — Best for Web Development\n- Full-stack capability (React + Node.js)\n- Largest job market\n\n☕ **Java** — Best for Enterprise, Android\n- Strong typing, great for large systems\n- Popular in corporate environments\n\n**My recommendation:** Start with **Python** if you're interested in AI/Data, or **JavaScript** if you want web development. Both have massive communities and job opportunities!",
};

const defaultResponse = "I'm your AI career mentor! I can help with questions about:\n\n• Career paths and skill requirements\n• Learning timelines and roadmaps\n• Technology and tool recommendations\n• Project ideas for your portfolio\n• Interview preparation tips\n\nTry asking something specific about your career goals!";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! 👋 I'm your AI Career Mentor. Ask me anything about career paths, skills, or learning strategies!" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200));

    const matchKey = Object.keys(quickReplies).find((k) => msg.toLowerCase().includes(k.toLowerCase().slice(0, 20)));
    const reply = matchKey ? quickReplies[matchKey] : defaultResponse;

    setMessages((p) => [...p, { role: "assistant", content: reply }]);
    setTyping(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_25px_-5px_hsl(174_72%_50%/0.5)] hover:shadow-[0_0_35px_-5px_hsl(174_72%_50%/0.7)] transition-all ${open ? "scale-0" : "scale-100"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">Career AI Mentor</p>
                  <p className="text-xs text-primary">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-accent/20" : "bg-primary/20"}`}>
                      {m.role === "user" ? <User className="h-3.5 w-3.5 text-accent" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className={`rounded-xl px-3 py-2 text-sm whitespace-pre-line ${m.role === "user" ? "bg-accent/15 text-foreground" : "bg-secondary text-foreground"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="h-3.5 w-3.5 text-primary" /></div>
                  <div className="bg-secondary rounded-xl px-4 py-2 flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {Object.keys(quickReplies).slice(0, 3).map((q, i) => (
                  <button key={i} onClick={() => send(q)} className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors truncate max-w-full">
                    {q.length > 35 ? q.slice(0, 35) + "..." : q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your career..."
                  className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button type="submit" variant="hero" size="icon" className="h-9 w-9 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
