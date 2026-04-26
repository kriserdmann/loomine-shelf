import { createClient } from "@/utils/supabase/server"
import { updateBookmark } from "../../actions"
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategorySelector from "../../CategorySelector"

export default async function EditBookmarkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  
  const { data: bookmark } = await supabase
    .from('bookmarks')
    .select('*, bookmark_tags(tags(name)), bookmark_categories(category_id)')
    .eq('id', id)
    .single()

  if (!bookmark) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Parse tags into a single string
  const tagsString = bookmark.bookmark_tags
    ?.map((bt: any) => bt.tags?.name)
    .filter(Boolean)
    .join(', ') || ''

  const selectedCategories = bookmark.bookmark_categories?.map((bc: any) => bc.category_id) || [];

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight">Edit Bookmark</h1>
        <Link href="/admin/bookmarks" className="text-sm font-medium text-[var(--color-interaction-blue)] hover:underline">
          &larr; Back to all
        </Link>
      </div>
      
      <div className="rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-8 shadow-sm">
        <form action={updateBookmark} className="flex flex-col gap-6">
           <input type="hidden" name="id" value={bookmark.id} />
           
           <div className="flex flex-col gap-2">
              <label htmlFor="url" className="text-sm font-medium text-[var(--color-near-black)]">URL <span className="text-red-500">*</span></label>
              <input 
                type="url" 
                id="url" 
                name="url" 
                defaultValue={bookmark.url}
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
                defaultValue={bookmark.title}
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
                defaultValue={bookmark.description || ''}
                className="rounded-md border border-[var(--color-border-cool)] p-3 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50" 
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--color-near-black)]">Current Cover Image</label>
              {bookmark.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bookmark.image_url} alt="Cover" className="h-24 w-auto rounded-md object-cover border border-[var(--color-border-light)] mb-2 inline-block object-left" />
              ) : (
                <p className="text-sm text-[var(--color-muted-slate)] mb-2">No image currently.</p>
              )}
              <label htmlFor="image_file" className="text-sm font-medium text-[var(--color-interaction-blue)] cursor-pointer hover:underline">Upload a new image to replace</label>
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
                <CategorySelector initialCategories={categories || []} selectedCategoryIds={selectedCategories} />
             </div>

             <div className="flex flex-col gap-2">
                <label htmlFor="tags" className="text-sm font-medium text-[var(--color-near-black)]">Tags (comma separated)</label>
                <input 
                  type="text" 
                  id="tags" 
                  name="tags" 
                  defaultValue={tagsString}
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
                defaultChecked={bookmark.is_public}
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-interaction-blue)] focus:ring-[var(--color-interaction-blue)]" 
              />
              <label htmlFor="is_public" className="text-sm font-medium text-[var(--color-near-black)]">
                Make Public
              </label>
           </div>

           <div className="mt-4 pt-4 border-t border-[var(--color-border-light)] flex justify-end gap-3">
              <Link href="/admin/bookmarks" className="rounded-full border border-[var(--color-border-cool)] px-6 py-3 text-sm font-medium text-[var(--color-cohere-black)] transition hover:bg-[var(--color-snow)]">
                Cancel
              </Link>
              <button type="submit" className="rounded-full bg-[var(--color-cohere-black)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-interaction-blue)]">
                 Update Bookmark
              </button>
           </div>
        </form>
      </div>
    </div>
  )
}
