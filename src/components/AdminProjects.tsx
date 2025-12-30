import { Projects } from "@/components/Projects";

interface AdminProjectsProps {
  projectsRef?: React.RefObject<HTMLDivElement>;
}

export function AdminProjects({ projectsRef }: AdminProjectsProps) {
  return (
    <div ref={projectsRef} className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-accent-blue font-semibold">Projects</p>
          <h3 className="text-xl font-semibold">Manage portfolio entries</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or delete projects shown on the main site.</p>
        </div>
      </div>
      <Projects showAuthControls={true} enableAdminPanel={true} />
    </div>
  );
}
