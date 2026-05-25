import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import BlogDetail from "./pages/BlogDetail.tsx";
import Contact from "./pages/Contact.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import { useLenis } from "@/hooks/useLenis";
import Loader from "@/components/ui/Loader";
import Concierge from "@/components/ui/Concierge";
import LeadPopup from "@/components/ui/LeadPopup";
import ScrollProgress from "@/components/ui/ScrollProgress";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/projects/ongoing"
            element={<ProjectsByStatus status="Ongoing" />}
          />
          <Route
            path="/projects/upcoming"
            element={<ProjectsByStatus status="Upcoming" />}
          />
          <Route
            path="/projects/completed"
            element={<ProjectsByStatus status="Completed" />}
          />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/velocity" element={<Velocity />} />
          <Route path="/career" element={<Career />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => {
  useLenis();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Loader />
        <BrowserRouter>
          <ScrollProgress />
          <AnimatedRoutes />
          <Concierge />
          <LeadPopup />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
