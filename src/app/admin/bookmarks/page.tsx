import { createClient } from "@/utils/supabase/server"
import Link from 'next/link'
import { deleteBookmark } from './actions'

export default async function BookmarksPage() {
  const supabase = await createClient()
  
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, bookmark_categories(categories(name)), bookmark_tags(tags(name))')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight">Bookmarks</h1>
        <Link href="/admin/bookmarks/new" className="rounded-full bg-[var(--color-cohere-black)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-interaction-blue)]">
          + Add New Bookmark
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookmarks?.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-slate)] p-2">No bookmarks found.</p>
        ) : bookmarks?.map((bookmark: any) => (
          <div key={bookmark.id} className="rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white p-6 flex flex-col gap-3 shadow-sm hover:border-[var(--color-border-cool)] transition overflow-hidden relative group">
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition z-10">
              <Link href={`/admin/bookmarks/${bookmark.id}/edit`} className="rounded-full bg-white/90 p-2 text-[var(--color-muted-slate)] hover:text-[var(--color-interaction-blue)] shadow-sm border border-[var(--color-border-light)] backdrop-blur-sm transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </Link>
              <form action={deleteBookmark}>
                <input type="hidden" name="id" value={bookmark.id} />
                <button type="submit" className="rounded-full bg-white/90 p-2 text-[var(--color-muted-slate)] hover:text-red-600 shadow-sm border border-[var(--color-border-light)] backdrop-blur-sm transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </form>
            </div>
            
            {bookmark.image_url && (
              <div className="w-full h-32 bg-[var(--color-snow)] -mt-6 -mx-6 mb-2 overflow-hidden border-b border-[var(--color-border-light)]">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={bookmark.image_url} alt={bookmark.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <h3 className="font-display text-lg text-[var(--color-cohere-black)] leading-tight">{bookmark.title || bookmark.url}</h3>
            
            {bookmark.description && (
              <p className="text-sm text-[var(--color-muted-slate)] line-clamp-3 leading-relaxed">{bookmark.description}</p>
            )}
            
            <div className="mt-auto pt-4 flex gap-2 flex-wrap">
              {bookmark.bookmark_categories?.map((bc: any, idx: number) => bc.categories?.name && (
                 <span key={`cat_${idx}`} className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-snow)] px-3 py-1 text-xs font-mono text-[var(--color-near-black)]">
                   {bc.categories.name}
                 </span>
              ))}
              {(!bookmark.bookmark_categories || bookmark.bookmark_categories.length === 0) && (
                <span className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-snow)] px-3 py-1 text-xs font-mono text-[var(--color-near-black)]">
                  Uncategorized
                </span>
              )}
              <span className={`rounded-full border px-3 py-1 text-xs font-mono ${bookmark.is_public ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                {bookmark.is_public ? 'Public' : 'Draft'}
              </span>
              
              {bookmark.bookmark_tags?.map((bt: any, idx: number) => bt.tags?.name && (
                 <span key={`tag_${idx}`} className="rounded-full border border-[var(--color-border-light)] bg-transparent px-3 py-1 text-xs font-mono text-[var(--color-interaction-blue)]">
                    #{bt.tags.name}
                 </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
