import { motion } from "framer-motion";
import { Brain, FileText, MessageCircle, Route, BarChart3, BookOpen } from "lucide-react";

const features = [
  { icon: Route, title: "AI Career Roadmap", desc: "Get a personalized step-by-step learning plan based on your skills, interests, and goals." },
  { icon: BarChart3, title: "Skill Gap Analysis", desc: "See which skills you have and which you need to learn, ranked by priority." },
  { icon: FileText, title: "Resume Analyzer", desc: "Upload your resume and get AI-powered feedback, scoring, and improvement tips." },
  { icon: Brain, title: "Project Recommendations", desc: "Get real-world project ideas tailored to your target career path." },
  { icon: MessageCircle, title: "AI Career Chatbot", desc: "Ask career questions and get instant guidance from our AI mentor." },
  { icon: BookOpen, title: "Learning Resources", desc: "Curated courses, tools, and resources for every stage of your journey." },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Launch Your Career</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Powered by AI, built for the next generation of professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 group hover:glow-border transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
