import { createClient } from "@/utils/supabase/server"
import { createBookmark } from "../actions"
import Link from 'next/link'
import CategorySelector from "../CategorySelector"

export default async function NewBookmarkPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight">Add New Bookmark</h1>
        <Link href="/admin/bookmarks" className="text-sm font-medium text-[var(--color-interaction-blue)] hover:underline">
          &larr; Back to all
        </Link>
      </div>
      
      <div className="rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-8 shadow-sm">
        <form action={createBookmark} className="flex flex-col gap-6">
           
           <div className="flex flex-col gap-2">
              <label htmlFor="url" className="text-sm font-medium text-[var(--color-near-black)]">URL <span className="text-red-500">*</span></label>
              <input 
                type="url" 
                id="url" 
                name="url" 
                placeholder="https://example.com" 
                required 
                className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50" 
              />
           </div>

           <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium text-[var(--color-near-black)]">Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="Website or Article Title" 
                required 
                className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50" 
              />
           </div>

           <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium text-[var(--color-near-black)]">Description</label>
              <textarea 
                id="description" 
                name="description" 
                rows={3}
                placeholder="Short summary of the resource..." 
                className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50" 
              />
           </div>

           <div className="flex flex-col gap-2">
              <label htmlFor="image_file" className="text-sm font-medium text-[var(--color-near-black)]">Cover Image</label>
              <input 
                type="file" 
                id="image_file" 
                name="image_file"
                accept="image/*"
                className="rounded-md border border-[var(--color-border-cool)] p-2 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50 bg-white" 
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
                <CategorySelector initialCategories={categories || []} />
             </div>

             <div className="flex flex-col gap-2">
                <label htmlFor="tags" className="text-sm font-medium text-[var(--color-near-black)]">Tags (comma separated)</label>
                <input 
                  type="text" 
                  id="tags" 
                  name="tags" 
                  placeholder="design, typography, tooling" 
                  className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50" 
                />
             </div>
           </div>

           <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="is_public" 
                name="is_public" 
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-interaction-blue)] focus:ring-[var(--color-interaction-blue)]" 
              />
              <label htmlFor="is_public" className="text-sm font-medium text-[var(--color-near-black)]">
                Make Public
              </label>
              <p className="ml-2 text-xs text-[var(--color-muted-slate)]">Visible on the landing page</p>
           </div>

           <div className="mt-4 pt-4 border-t border-[var(--color-border-light)] flex justify-end gap-3">
              <Link href="/admin/bookmarks" className="rounded-full border border-[var(--color-border-cool)] px-6 py-3 text-sm font-medium text-[var(--color-cohere-black)] transition hover:bg-[var(--color-snow)]">
                Cancel
              </Link>
              <button type="submit" className="rounded-full bg-[var(--color-cohere-black)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-interaction-blue)]">
                 Save Bookmark
              </button>
           </div>
        </form>
      </div>
    </div>
  )
}
