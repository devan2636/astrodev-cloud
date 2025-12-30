import { ReactNode } from "react";
import {
  LayoutGrid,
  PlusCircle,
  MessageCircle,
  FileText,
  Settings,
} from "lucide-react";

interface AdminSidebarProps {
  activeNav: string;
  onNavClick: (key: string) => void;
}

export function AdminSidebar({ activeNav, onNavClick }: AdminSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-white/80 backdrop-blur">
      <div className="px-6 py-6 border-b border-border/60">
        <div className="text-xs uppercase tracking-[0.3em] text-accent-blue mb-2">Astrodev</div>
        <div className="text-xl font-semibold">Operations Console</div>
        <p className="text-sm text-muted-foreground mt-2">Manage projects, content, and access.</p>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        <SidebarItem icon={<LayoutGrid className="w-4 h-4" />} label="Dashboard" active={activeNav === "dashboard"} onClick={() => onNavClick("dashboard")} />
        <SidebarItem icon={<PlusCircle className="w-4 h-4" />} label="Projects" active={activeNav === "projects"} onClick={() => onNavClick("projects")} />
        <SidebarItem icon={<FileText className="w-4 h-4" />} label="Documents" active={activeNav === "documents"} onClick={() => onNavClick("documents")} />
        <SidebarItem icon={<MessageCircle className="w-4 h-4" />} label="Contact messages" active={activeNav === "contacts"} onClick={() => onNavClick("contacts")} />
        <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" active={activeNav === "settings"} onClick={() => onNavClick("settings")} />
      </nav>
      <div className="px-4 pb-6">
        <div className="rounded-lg border border-border/60 bg-white px-4 py-3 text-sm text-muted-foreground">
          <div className="font-medium text-foreground mb-1">Need admin role?</div>
          Ask the owner to set your profile role to <span className="text-accent-blue font-semibold">admin</span> in Supabase.
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer transition border border-transparent ${
        active ? "bg-accent-blue/10 text-foreground border-accent-blue/20" : "text-muted-foreground hover:text-foreground hover:border-border/60"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
