interface Stats {
  projectCount: number;
  contactCount: number;
}

interface AdminDashboardProps {
  stats: Stats;
  loadingStats: boolean;
}

export function AdminDashboard({ stats, loadingStats }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Projects"
          value={loadingStats ? "…" : stats.projectCount.toString()}
          hint="Published items in portfolio"
        />
        <StatCard
          title="Contact msgs"
          value={loadingStats ? "…" : stats.contactCount.toString()}
          hint="Latest inquiries"
        />
        <StatCard title="Role" value="Admin" hint="Full write access" />
        <StatCard title="Status" value="Connected" hint="Supabase session active" />
      </div>
    </div>
  );
}

function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-4 shadow-inner">
      <p className="text-xs uppercase tracking-[0.2em] text-accent-blue">{title}</p>
      <div className="text-3xl font-semibold mt-2 mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}
