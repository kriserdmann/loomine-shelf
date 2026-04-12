import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-[var(--color-border-light)] bg-white p-6 flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-display text-[var(--color-cohere-black)] tracking-tight">Loomine Shelf</h2>
        <span className="text-xs uppercase tracking-wider text-[var(--color-muted-slate)] font-mono">Admin</span>
      </div>
      <nav className="flex flex-col gap-4">
        <Link href="/admin" className="text-sm font-medium text-[var(--color-near-black)] hover:text-[var(--color-interaction-blue)] transition">Dashboard</Link>
        <Link href="/admin/bookmarks" className="text-sm font-medium text-[var(--color-near-black)] hover:text-[var(--color-interaction-blue)] transition">Bookmarks</Link>
        <Link href="/admin/categories" className="text-sm font-medium text-[var(--color-near-black)] hover:text-[var(--color-interaction-blue)] transition">Categories</Link>
      </nav>
      <div className="mt-auto pt-10">
        <form action="/auth/signout" method="post">
          <button className="text-sm font-medium text-[var(--color-muted-slate)] hover:text-[var(--color-cohere-black)] transition">Sign Out</button>
        </form>
      </div>
    </aside>
  );
}
