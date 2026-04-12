import { createClient } from "@/utils/supabase/server"
import Link from 'next/link'
import SearchFilter from "@/components/SearchFilter"

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const categoryId = typeof searchParams.category === 'string' ? searchParams.category : ''

  const supabase = await createClient()

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  let query = supabase
    .from('bookmarks')
    .select(`
      *, 
      bookmark_categories${categoryId ? '!inner' : ''}(category_id, categories(name)), 
      bookmark_tags(tags(name))
    `)
    .eq('is_public', true)
    
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,url.ilike.%${q}%`)
  }
  
  if (categoryId) {
    query = query.eq('bookmark_categories.category_id', categoryId)
  }

  const { data: bookmarks } = await query.order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-snow)]">
      {/* Header / Hero */}
      <header className="bg-[var(--color-deep-dark)] text-white pt-24 pb-20 px-8 rounded-b-[40px] md:rounded-b-[80px]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="mb-4 text-5xl md:text-7xl font-display tracking-tight text-white leading-[0.9]">
            Loomine Shelf
          </h1>
          <p className="mt-6 text-xl md:text-2xl font-body text-[var(--color-border-cool)] max-w-2xl mx-auto leading-relaxed">
            A curated collection of design inspiration, development tools, and AI resources.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 -mt-8">
        
        <SearchFilter categories={categories || []} />

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {(!bookmarks || bookmarks.length === 0) ? (
             <div className="col-span-full py-12 text-center text-[var(--color-muted-slate)]">
                No public bookmarks available yet or none match your search.
             </div>
          ) : bookmarks.map((bookmark) => (
             <Link 
               key={bookmark.id} 
               href={`/tool/${bookmark.id}`}
               className="group block rounded-[var(--radius-cohere)] border border-[var(--color-border-light)] bg-white overflow-hidden transition hover:border-[var(--color-border-cool)] hover:shadow-md h-full flex flex-col"
             >
               {bookmark.image_url ? (
                 <div className="aspect-video w-full bg-[var(--color-snow)] border-b border-[var(--color-border-light)] relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bookmark.image_url} alt={bookmark.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                 </div>
               ) : (
                 <div className="aspect-video w-full bg-[var(--color-snow)] border-b border-[var(--color-border-light)] flex items-center justify-center p-6 text-center text-[var(--color-muted-slate)] font-mono text-xs break-all">
                    {bookmark.url}
                 </div>
               )}
               <div className="p-6 flex flex-col flex-1">
                 <h2 className="mb-2 text-xl font-display text-[var(--color-cohere-black)] group-hover:text-[var(--color-interaction-blue)] transition leading-tight">
                   {bookmark.title || bookmark.url}
                 </h2>
                 <p className="mb-6 text-sm text-[var(--color-muted-slate)] line-clamp-3 leading-relaxed">
                   {bookmark.description}
                 </p>
                 <div className="mt-auto flex gap-4 justify-between items-center">
                   <div className="flex gap-2 flex-wrap">
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
                     {bookmark.bookmark_tags?.map((bt: any, idx: number) => bt.tags?.name && (
                       <span key={idx} className="rounded-full border border-[var(--color-border-light)] bg-transparent px-3 py-1 text-xs font-mono text-[var(--color-interaction-blue)]">
                          #{bt.tags.name}
                       </span>
                     ))}
                   </div>
                   <button 
                     className="text-[var(--color-muted-slate)] group-hover:text-[var(--color-interaction-blue)] transition p-2 shrink-0"
                   >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                   </button>
                 </div>
               </div>
             </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
