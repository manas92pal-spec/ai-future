import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatBot from "@/components/ChatBot";
import Index from "./pages/Index.tsx";
import RoadmapPage from "./pages/RoadmapPage.tsx";
import ResumePage from "./pages/ResumePage.tsx";
import SkillGapPage from "./pages/SkillGapPage.tsx";
import CareerPathPage from "./pages/CareerPathPage.tsx";
import ProjectIdeasPage from "./pages/ProjectIdeasPage.tsx";
import CareerSimPage from "./pages/CareerSimPage.tsx";
import InterviewPage from "./pages/InterviewPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/skill-gap" element={<SkillGapPage />} />
          <Route path="/career-path" element={<CareerPathPage />} />
          <Route path="/project-ideas" element={<ProjectIdeasPage />} />
          <Route path="/career-sim" element={<CareerSimPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
