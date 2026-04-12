import { createClient } from "@/utils/supabase/server"
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: bookmark } = await supabase
    .from('bookmarks')
    .select('*, bookmark_categories(categories(name)), bookmark_tags(tags(name))')
    .eq('id', id)
    .single()

  if (!bookmark || !bookmark.is_public) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--color-snow)] font-sans flex flex-col">
      <header className="bg-white border-b border-[var(--color-border-light)] py-4 sticky top-0 z-10 transition-all">
        <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
          <Link href="/" className="text-xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight hover:opacity-80 transition">
            Loomine Shelf
          </Link>
          <div className="flex gap-4">
             <Link href="/" className="rounded-full bg-[var(--color-snow)] px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 border border-[var(--color-border-light)]">
               &larr; Back to Home
             </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-4xl py-12 flex-1">
         <div className="bg-white border border-[var(--color-border-light)] rounded-[var(--radius-cohere)] p-8 md:p-12 shadow-sm">
            {bookmark.image_url && (
              <div className="w-[calc(100%+4rem)] h-48 md:h-80 bg-[var(--color-snow)] -mt-8 -ml-8 mb-8 overflow-hidden border-b border-[var(--color-border-light)] rounded-t-[var(--radius-cohere)] md:w-[calc(100%+6rem)] md:-mt-12 md:-ml-12">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={bookmark.image_url} alt={bookmark.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-display font-medium text-[var(--color-cohere-black)] tracking-tight mb-4">{bookmark.title || bookmark.url}</h1>
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                   {bookmark.bookmark_categories?.map((bc: any, idx: number) => bc.categories?.name && (
                     <span key={`cat_${idx}`} className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-snow)] px-3 py-1 text-sm font-mono text-[var(--color-near-black)]">
                       {bc.categories.name}
                     </span>
                   ))}
                   {(!bookmark.bookmark_categories || bookmark.bookmark_categories.length === 0) && (
                     <span className="rounded-full border border-[var(--color-border-light)] bg-[var(--color-snow)] px-3 py-1 text-sm font-mono text-[var(--color-near-black)]">
                       Uncategorized
                     </span>
                   )}
                   {bookmark.bookmark_tags?.map((bt: any, idx: number) => bt.tags?.name && (
                      <span key={idx} className="rounded-full border border-[var(--color-border-light)] bg-transparent px-3 py-1 text-sm font-mono text-[var(--color-interaction-blue)]">
                         #{bt.tags.name}
                      </span>
                   ))}
                </div>
              </div>
              
              <div className="shrink-0 flex flex-col gap-3">
                 <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full md:w-auto items-center justify-center rounded-full bg-[var(--color-cohere-black)] px-8 py-4 text-base font-medium text-white transition hover:bg-[var(--color-interaction-blue)] shadow-sm">
                    Visit Website
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                 </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--color-border-light)]">
               <h2 className="text-xl font-display font-medium text-[var(--color-cohere-black)] mb-4">About</h2>
               <p className="text-base md:text-lg text-[var(--color-muted-slate)] leading-relaxed whitespace-pre-line">
                 {bookmark.description || "No description provided for this resource."}
               </p>
            </div>
         </div>
      </main>
    </div>
  )
}
