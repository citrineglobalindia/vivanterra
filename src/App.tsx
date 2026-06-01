import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import AdminGuard from "@/components/admin/AdminGuard";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLenis } from "@/hooks/useLenis";
import Loader from "@/components/ui/Loader";
import Concierge from "@/components/ui/Concierge";
import LeadPopup from "@/components/ui/LeadPopup";
import ScrollProgress from "@/components/ui/ScrollProgress";

// Route-level code splitting — each page becomes its own chunk.
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const ProjectsByStatus = lazy(() => import("./pages/ProjectsByStatus.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const Velocity = lazy(() => import("./pages/Velocity.tsx"));
const Career = lazy(() => import("./pages/Career.tsx"));
const Blogs = lazy(() => import("./pages/Blogs.tsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));

// Admin
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects.tsx"));
const AdminProjectEdit = lazy(() => import("./pages/admin/AdminProjectEdit.tsx"));
const AdminBlogs = lazy(() => import("./pages/admin/AdminBlogs.tsx"));
const AdminBlogEdit = lazy(() => import("./pages/admin/AdminBlogEdit.tsx"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews.tsx"));
const AdminPress = lazy(() => import("./pages/admin/AdminPress.tsx"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery.tsx"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries.tsx"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads.tsx"));
const AdminCareers = lazy(() => import("./pages/admin/AdminCareers.tsx"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications.tsx"));
const AdminEnquiry = lazy(() => import("./pages/admin/AdminEnquiry.tsx"));
const AdminSubscribers = lazy(() => import("./pages/admin/AdminSubscribers.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));

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
        <Suspense fallback={<div className="min-h-[100svh] bg-paper" />}>
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

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/projects" element={<AdminGuard><AdminProjects /></AdminGuard>} />
            <Route path="/admin/projects/new" element={<AdminGuard><AdminProjectEdit /></AdminGuard>} />
            <Route path="/admin/projects/:id/edit" element={<AdminGuard><AdminProjectEdit /></AdminGuard>} />
            <Route path="/admin/blogs" element={<AdminGuard><AdminBlogs /></AdminGuard>} />
            <Route path="/admin/blogs/new" element={<AdminGuard><AdminBlogEdit /></AdminGuard>} />
            <Route path="/admin/blogs/:id/edit" element={<AdminGuard><AdminBlogEdit /></AdminGuard>} />
            <Route path="/admin/news" element={<AdminGuard><AdminNews /></AdminGuard>} />
            <Route path="/admin/press" element={<AdminGuard><AdminPress /></AdminGuard>} />
            <Route path="/admin/gallery" element={<AdminGuard><AdminGallery /></AdminGuard>} />
            <Route path="/admin/enquiries" element={<AdminGuard><AdminEnquiries /></AdminGuard>} />
            <Route path="/admin/enquiries/:id" element={<AdminGuard><AdminEnquiry /></AdminGuard>} />
            <Route path="/admin/leads" element={<AdminGuard><AdminLeads /></AdminGuard>} />
            <Route path="/admin/careers" element={<AdminGuard><AdminCareers /></AdminGuard>} />
            <Route path="/admin/applications" element={<AdminGuard><AdminApplications /></AdminGuard>} />
            <Route path="/admin/subscribers" element={<AdminGuard><AdminSubscribers /></AdminGuard>} />
            <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => {
  useLenis();
  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
};

export default App;
