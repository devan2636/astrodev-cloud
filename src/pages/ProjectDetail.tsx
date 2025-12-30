import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Menu, X, FileText, Youtube } from "lucide-react";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  content: string | null;
  category: string;
  tags: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  youtube_url?: string;
  created_at: string;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = '';

      // Handle youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v') || '';
      }
      // Handle youtu.be/VIDEO_ID
      else if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      }
      // Handle youtube.com/embed/VIDEO_ID
      else if (urlObj.pathname.includes('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1];
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 w-full z-50 glass-navbar shadow-sm">
          <div className="w-full px-6 sm:px-8 lg:px-12 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <motion.a
                href="/"
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                  <img src="/logo-astrodev.png" alt="Astrodev" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl text-foreground">Astrodev</span>
              </motion.a>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center px-4 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-foreground">Project Not Found</h1>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-60 pointer-events-none" />
      
      {/* Animated Gradient Blobs */}
      <div className="fixed top-20 -left-32 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="fixed top-40 right-0 w-80 h-80 bg-accent-purple/15 rounded-full blur-3xl animate-blob-delay pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 w-full z-50"
      >
        <div
          className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ${
            isScrolled ? "glass-navbar shadow-sm" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                <img src="/logo-astrodev.png" alt="Astrodev" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl text-foreground">Astrodev</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/#about" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                About
              </a>
              <a href="/#projects" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                Projects
              </a>
              <a href="/#contact" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex rounded-full px-6"
              >
                <a href="/share">
                  <FileText className="w-4 h-4 mr-2" />
                  Share
                </a>
              </Button>
              <Button
                asChild
                className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
              >
                <a href="/adminastrodev">Login</a>
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-full w-72 glass-card-strong z-50 md:hidden p-6 pt-20"
          >
            <div className="flex flex-col gap-4">
              <a
                href="/#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground font-medium py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
              >
                About
              </a>
              <a
                href="/#projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground font-medium py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
              >
                Projects
              </a>
              <a
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground font-medium py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
              >
                Contact
              </a>
              <div className="flex flex-col gap-2 mt-4">
                <Button asChild variant="outline" className="rounded-full">
                  <a href="/share" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Share
                  </a>
                </Button>
                <Button asChild className="rounded-full">
                  <a href="/adminastrodev" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-32 pb-20">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-8 rounded-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card-strong rounded-3xl overflow-hidden hover-lift"
        >
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-primary/10 via-accent-purple/5 to-accent-cyan/10 flex items-center justify-center">
              <div className="text-6xl font-bold text-primary/20">{project.title.charAt(0)}</div>
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {project.category}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-secondary/80 text-secondary-foreground"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mb-8 flex-wrap">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition shadow-md hover:shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border/60 rounded-full hover:bg-secondary transition"
                >
                  <Github className="w-4 h-4" /> Source Code
                </a>
              )}
              {project.youtube_url && (
                <a
                  href={project.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md hover:shadow-lg"
                >
                  <Youtube className="w-4 h-4" /> Watch Video
                </a>
              )}
            </div>

            {project.youtube_url && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-border/60">
                <iframe
                  className="w-full aspect-video"
                  src={getYouTubeEmbedUrl(project.youtube_url)}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            {project.content && (
              <div className="prose prose-slate max-w-none">
                <div className="border-t border-border/60 pt-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">About This Project</h2>
                  <div
                    className="text-foreground/80 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br />') }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.article>
      </div>

      <Footer />
    </div>
  );
}
