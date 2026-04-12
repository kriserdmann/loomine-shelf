export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-[var(--radius-cohere)] border border-[var(--color-border-cool)] bg-white p-6">
           <h3 className="text-sm font-mono text-[var(--color-muted-slate)] uppercase">Total Bookmarks</h3>
           <p className="mt-2 text-3xl font-display text-[var(--color-cohere-black)]">0</p>
        </div>
      </div>
    </div>
  )
}
