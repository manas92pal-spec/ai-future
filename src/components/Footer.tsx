import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-semibold text-foreground">
            CareerRoadmap <span className="text-primary">AI</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          &ldquo;Your AI Mentor for the Future.&rdquo; &middot; Built by Team PathFinder for HACK-O-NIT 2026
        </p>
      </div>
    </footer>
  );
}
