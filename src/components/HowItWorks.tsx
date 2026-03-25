import { motion } from "framer-motion";
import { ClipboardList, Cpu, Map, Rocket } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Enter Your Profile", desc: "Tell us about your skills, education, interests, and career goals." },
  { icon: Cpu, title: "AI Generates Roadmap", desc: "Our AI analyzes your profile and creates a personalized learning plan." },
  { icon: Map, title: "Follow the Path", desc: "Get a structured timeline with skills, projects, and resources for each stage." },
  { icon: Rocket, title: "Launch Your Career", desc: "Track your progress and build the skills employers are looking for." },
];

export default function HowItWorks() {
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
            How It <span className="gradient-text">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="relative mx-auto mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto glow-border">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground font-display">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-display font-semibold mb-2 text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
