import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Projects } from "@/components/Projects";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminProjects } from "@/components/AdminProjects";
import { AdminAbout } from "@/components/AdminAbout";
import type { AboutContent } from "@/components/AdminAbout";
import { AdminContactMessages } from "@/components/AdminContactMessages";
import { AdminContactInfo } from "@/components/AdminContactInfo";
import type { ContactInfo } from "@/components/AdminContactInfo";
import { AdminDocuments } from "@/components/AdminDocuments";
import { AdminSettings } from "@/components/AdminSettings";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LogOut,
  Settings,
  LayoutGrid,
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Lock,
  ArrowRight,
  Droplets,
  Zap,
  Wind,
  Bot,
  MessageCircle,
  Loader2,
} from "lucide-react";

interface Stats {
  projectCount: number;
  contactCount: number;
}

const defaultAboutContent: AboutContent = {
  heading: "Astrodev Builds Digital Solutions",
  pill: "About Astrodev",
  paragraphs: [
    "Astrodev adalah tempat saya meracik web modern dan solusi IoT. Berawal dari rasa penasaran bagaimana hal bekerja, berlanjut ke eksplorasi software dan hardware.",
    "Saya fokus membangun aplikasi React/TypeScript, layanan cloud, dan integrasi IoT yang menjembatani dunia digital dan fisik. Prinsipnya: kode bersih, UX jelas, dan hasil yang bisa dipakai.",
    "Di luar coding, saya bereksperimen dengan sensor baru, ikut open source, dan terus belajar tren cloud dan edge computing.",
  ],
  highlights: [
    { number: "3+", label: "Years Experience", description: "Building web apps & IoT solutions" },
    { number: "15+", label: "Projects Completed", description: "From concept to deployment" },
    { number: "10+", label: "Technologies", description: "Modern tech stack mastery" },
  ],
  profile: {
    name: "Astrodev",
    title: "Full Stack Lab & IoT Enthusiast",
    location: "Indonesia",
    education: "Computer Science / Engineering",
    focus: "Web Apps, IoT, Cloud",
    emoji: "👨‍💻",
  },
};

const defaultContactInfo: ContactInfo = {
  email: "your@email.com",
  location: "Indonesia",
  responseTime: "< 24 hours",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
};

export default function Admin() {
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const projectsSectionRef = useRef<HTMLDivElement | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [stats, setStats] = useState<Stats>({ projectCount: 0, contactCount: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessages, setContactMessages] = useState<Array<{ id: string; name: string; email: string; message: string; created_at: string }>>([]);
  const [authMessage, setAuthMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutSaving, setAboutSaving] = useState(false);
  const [aboutStatus, setAboutStatus] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [contactInfoLoading, setContactInfoLoading] = useState(false);
  const [contactInfoSaving, setContactInfoSaving] = useState(false);
  const [contactInfoStatus, setContactInfoStatus] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session) {
        await ensureProfile(data.session);
        const ok = await loadProfile(data.session);
        if (ok) {
          await Promise.all([fetchStats(), fetchContactMessages(), loadAboutContent(), loadContactInfo()]);
        }
      }

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        if (newSession) {
          await ensureProfile(newSession);
          const ok = await loadProfile(newSession);
          if (ok) {
            await Promise.all([fetchStats(), fetchContactMessages(), loadAboutContent(), loadContactInfo()]);
          }
        } else {
          setIsAdmin(false);
          setStats({ projectCount: 0, contactCount: 0 });
          setContactMessages([]);
          setContactLoading(false);
          setAboutStatus("");
          setAccessDenied(null);
        }
      });

      return () => listener.subscription.unsubscribe();
    };

    init();
  }, []);

  const ensureProfile = async (sess: Session) => {
    await supabase.from("profiles").upsert({ id: sess.user.id, email: sess.user.email });
  };

  const loadProfile = async (sess: Session) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", sess.user.id)
      .maybeSingle();
    const admin = (data?.role || "user") === "admin";
    setIsAdmin(admin);

    if (!admin) {
      setAccessDenied("Access ditolak. Hanya admin yang dapat mengakses konsol ini.");
      await supabase.auth.signOut();
      setSession(null);
      setStats({ projectCount: 0, contactCount: 0 });
    }

    return admin;
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const [{ count: projectCount }, { count: contactCount }] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true })
      ]);
      setStats({ projectCount: projectCount || 0, contactCount: contactCount || 0 });
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchContactMessages = async () => {
    setContactLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setContactMessages(data || []);
    } catch (err) {
      console.error("Error loading contact messages", err);
    } finally {
      setContactLoading(false);
    }
  };

  const loadAboutContent = async () => {
    setAboutLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "about")
        .maybeSingle();

      if (error) throw error;
      if (data?.content) {
        setAboutContent(data.content as AboutContent);
      } else {
        setAboutContent(defaultAboutContent);
      }
    } catch (err) {
      console.error("Error loading about content", err);
      setAboutStatus("Gagal memuat konten.");
    } finally {
      setAboutLoading(false);
    }
  };

  const saveAboutContent = async () => {
    setAboutSaving(true);
    setAboutStatus("");
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert(
          { section: "about", content: aboutContent },
          { onConflict: "section" }
        );

      if (error) throw error;
      setAboutStatus("Konten disimpan.");
      setTimeout(() => setAboutStatus(""), 2000);
    } catch (err) {
      console.error("Error saving about content", err);
      setAboutStatus("Gagal menyimpan konten.");
    } finally {
      setAboutSaving(false);
    }
  };

  const loadContactInfo = async () => {
    setContactInfoLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section", "contact_info")
        .maybeSingle();

      if (error) throw error;
      if (data?.content) {
        setContactInfo(data.content as ContactInfo);
      } else {
        setContactInfo(defaultContactInfo);
      }
    } catch (err) {
      console.error("Error loading contact info", err);
      setContactInfoStatus("Gagal memuat konten.");
    } finally {
      setContactInfoLoading(false);
    }
  };

  const saveContactInfo = async () => {
    setContactInfoSaving(true);
    setContactInfoStatus("");
    try {
      const { error } = await supabase
        .from("site_content")
        .upsert(
          { section: "contact_info", content: contactInfo },
          { onConflict: "section" }
        );

      if (error) throw error;
      setContactInfoStatus("Konten disimpan.");
      setTimeout(() => setContactInfoStatus(""), 2000);
    } catch (err) {
      console.error("Error saving contact info", err);
      setContactInfoStatus("Gagal menyimpan konten.");
    } finally {
      setContactInfoSaving(false);
    }
  };

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthMessage(null);
    setAccessDenied(null);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
      if (error) throw error;
      if (data?.session) {
        await ensureProfile(data.session);
        const ok = await loadProfile(data.session);
        if (ok) {
          await Promise.all([fetchStats(), fetchContactMessages(), loadAboutContent()]);
          setAuthMessage({ type: "success", text: "Signed in." });
        }
      }
    } catch (err) {
      console.error("Auth error", err);
      setAuthMessage({ type: "error", text: err?.message || "Authentication failed" });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    setStats({ projectCount: 0, contactCount: 0 });
  };

  const handleNav = (key: string) => {
    setActiveNav(key);
    if (key === "contacts" && contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (key === "projects" && projectsSectionRef.current) {
      projectsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (key === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-white text-foreground flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100 shadow-sm text-xs font-semibold text-slate-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM OPERATIONAL
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Astrodev</h1>
            <p className="text-sm text-slate-500 uppercase tracking-[0.22em]">Admin Console</p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-500/10 p-6 sm:p-7">
            <div className="text-center text-sm font-semibold text-slate-500 mb-4">Login</div>

            <div className="space-y-4">
              {accessDenied && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {accessDenied}
                </div>
              )}
              {authMessage && (
                <div
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    authMessage.type === "error"
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-emerald-400/40 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {authMessage.text}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="admin@astrodev.cloud"
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className="pl-9 h-10 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="••••••••"
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="pl-9 h-10 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>
              </div>
              <Button
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                disabled={authLoading}
                onClick={handleAuth}
              >
                {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure Encrypted Connection — Admin only
              </div>
            </div>
          </div>
        </div>
        <footer className="border-t border-border/60 bg-white py-6 px-6 sm:px-8 lg:px-12 text-sm text-muted-foreground">
          <div className="container mx-auto">© 2025 Astrodev. All rights reserved.</div>
        </footer>
        <Toaster />
      </div>
    );
  }

  if (session && !isAdmin) {
    return (
      <div className="min-h-screen bg-white text-foreground flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full space-y-4 rounded-2xl border border-amber-500/40 bg-amber-50 p-6 text-amber-800 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <div className="font-semibold">You are signed in but not an admin.</div>
            </div>
            <div className="text-sm text-amber-800/80">
              Set your role to admin in the public.profiles table to enable access. Current user: {session.user.email}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSignOut} variant="outline" className="border-amber-400 text-amber-700">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
        <footer className="border-t border-border/60 bg-white py-6 px-6 sm:px-8 lg:px-12 text-sm text-muted-foreground">
          <div className="container mx-auto">© 2025 Astrodev. All rights reserved.</div>
        </footer>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="flex min-h-screen">
        <AdminSidebar activeNav={activeNav} onNavClick={handleNav} />

        <main className="flex-1">
          <div className="border-b border-border/60 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent-blue">Admin Area</p>
                <h1 className="text-2xl font-semibold">Astrodev Control Panel</h1>
              </div>
              {session && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-right">
                    <div className="font-medium">{session.user.email}</div>
                    <div className="text-muted-foreground">{isAdmin ? "Admin" : "User"}</div>
                  </div>
                  <Button size="sm" variant="outline" className="border-border/70" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="space-y-6">
              {activeNav === "dashboard" && (
                <>
                  <AdminDashboard stats={stats} loadingStats={loadingStats} />
                  <AdminAbout
                    aboutContent={aboutContent}
                    onContentChange={setAboutContent}
                    aboutLoading={aboutLoading}
                    aboutSaving={aboutSaving}
                    aboutStatus={aboutStatus}
                    onSave={saveAboutContent}
                  />
                  <AdminContactInfo
                    contactInfo={contactInfo}
                    onContactInfoChange={setContactInfo}
                    contactInfoLoading={contactInfoLoading}
                    contactInfoSaving={contactInfoSaving}
                    contactInfoStatus={contactInfoStatus}
                    onSave={saveContactInfo}
                  />
                </>
              )}

              {activeNav === "projects" && <AdminProjects projectsRef={projectsSectionRef} />}

              {activeNav === "documents" && <AdminDocuments />}

              {activeNav === "contacts" && <AdminContactMessages contactMessages={contactMessages} contactLoading={contactLoading} contactsRef={contactSectionRef} />}

              {activeNav === "settings" && <AdminSettings />}
            </div>
          </div>
        </main>
      </div>
      <footer className="border-t border-border/60 bg-white py-6 px-6 sm:px-8 lg:px-12 text-sm text-muted-foreground">
        <div className="container mx-auto">© 2025 Astrodev. All rights reserved.</div>
      </footer>
      <Toaster />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="group p-3 bg-white/70 border border-white/60 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 backdrop-blur-sm flex items-start gap-3">
      <div className="mt-1 p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-slate-800 text-sm">{title}</div>
        <div className="text-[11px] text-slate-600 leading-tight mt-1">{desc}</div>
      </div>
    </div>
  );
}
