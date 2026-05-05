import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import About from "./pages/About.tsx";
import Projects from "./pages/Projects.tsx";
import ProjectsByStatus from "./pages/ProjectsByStatus.tsx";
import Velocity from "./pages/Velocity.tsx";
import Career from "./pages/Career.tsx";
import Blogs from "./pages/Blogs.tsx";
import Contact from "./pages/Contact.tsx";
import { useLenis } from "@/hooks/useLenis";
import Loader from "@/components/ui/Loader";
import Concierge from "@/components/ui/Concierge";
import LeadPopup from "@/components/ui/LeadPopup";

const queryClient = new QueryClient();

const App = () => {
  useLenis();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Loader />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/ongoing" element={<ProjectsByStatus status="Ongoing" />} />
            <Route path="/projects/upcoming" element={<ProjectsByStatus status="Upcoming" />} />
            <Route path="/projects/completed" element={<ProjectsByStatus status="Completed" />} />
            <Route path="/velocity" element={<Velocity />} />
            <Route path="/career" element={<Career />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Concierge />
          <LeadPopup />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
