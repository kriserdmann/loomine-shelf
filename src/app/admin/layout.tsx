import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    // If not admin, deny access
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-snow)]">
         <div className="rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-8 max-w-sm text-center">
            <h2 className="text-xl font-display text-[var(--color-cohere-black)] mb-2">Access Denied</h2>
            <p className="text-sm text-[var(--color-muted-slate)] mb-6">You need administrative privileges to view this area.</p>
            <form action="/auth/signout" method="post">
                <button className="rounded-full bg-[var(--color-cohere-black)] px-6 py-2 text-sm text-white hover:bg-[var(--color-deep-dark)] transition">Sign Out</button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-snow)]">
      <AdminSidebar />
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
