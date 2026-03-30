import { motion } from "framer-motion";
import { Brain, FileText, MessageCircle, Route, BarChart3, BookOpen, Lightbulb, Briefcase, MessageSquare, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Route, title: "AI Career Roadmap", desc: "Get a personalized step-by-step learning plan based on your skills, interests, and goals.", to: "/roadmap" },
  { icon: FileText, title: "Resume Analyzer", desc: "Upload your resume and get AI-powered feedback, scoring, and improvement tips.", to: "/resume" },
  { icon: BarChart3, title: "Skill Gap Analyzer", desc: "Compare your skills against your dream career and get a learning plan.", to: "/skill-gap" },
  { icon: MapPin, title: "Career Path Visualizer", desc: "See your complete career journey from beginner to expert with salary ranges.", to: "/career-path" },
  { icon: Lightbulb, title: "Project Idea Generator", desc: "Get tailored project ideas with tech stacks and learning outcomes.", to: "/project-ideas" },
  { icon: Briefcase, title: "Career Simulator", desc: "Experience 'A Day in the Life' of your dream career role.", to: "/career-sim" },
  { icon: MessageSquare, title: "Interview Simulator", desc: "Practice with realistic interview questions and get AI feedback.", to: "/interview" },
  { icon: MessageCircle, title: "AI Career Chatbot", desc: "Ask career questions and get instant guidance from our AI mentor.", to: "/" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={f.to} className="block glass-card p-5 group hover:glow-border transition-all duration-300 h-full">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-semibold mb-1.5 text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
