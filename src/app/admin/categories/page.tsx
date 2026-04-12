import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  async function createCategory(formData: FormData) {
    "use server";
    const name = formData.get('name') as string
    if (!name) return;
    
    // Convert to slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const sb = await createClient();
    await sb.from('categories').insert({ name, slug })
    revalidatePath('/admin/categories')
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight">Categories</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to Create Category */}
        <div className="rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-6 h-fit shadow-sm">
          <h2 className="mb-4 text-xl font-display text-[var(--color-cohere-black)]">Add Category</h2>
          <form action={createCategory} className="flex flex-col gap-4">
             <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-[var(--color-near-black)]">Category Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="rounded-md border border-[var(--color-border-cool)] p-2 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50" 
                />
             </div>
             <button type="submit" className="rounded-full bg-[var(--color-cohere-black)] p-2 text-sm font-medium text-white transition hover:bg-[var(--color-interaction-blue)]">
               Save Category
             </button>
          </form>
        </div>

        {/* List of Categories */}
        <div className="lg:col-span-2 rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-display text-[var(--color-cohere-black)]">Existing Categories</h2>
          {categories?.length === 0 ? (
             <p className="text-sm text-[var(--color-muted-slate)]">No categories found.</p>
          ) : (
             <ul className="divide-y divide-[var(--color-border-light)]">
               {categories?.map((cat) => (
                 <li key={cat.id} className="py-4 flex justify-between items-center group">
                   <span className="text-sm font-medium text-[var(--color-near-black)] group-hover:text-[var(--color-interaction-blue)] transition">{cat.name}</span>
                   <span className="text-xs font-mono text-[var(--color-muted-slate)] uppercase tracking-wider">{cat.slug}</span>
                 </li>
               ))}
             </ul>
          )}
        </div>
      </div>
    </div>
  )
}
