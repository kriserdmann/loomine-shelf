"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SearchFilter({ categories }: { categories: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialSearch = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)

  // Use a timeout to simulate debounced search routing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      
      let hasChanges = false;

      if (search !== params.get('q') || (search === '' && params.has('q'))) {
        hasChanges = true;
        if (search) {
          params.set('q', search)
        } else {
          params.delete('q')
        }
      }
      
      if (category !== params.get('category') || (category === '' && params.has('category'))) {
        hasChanges = true;
        if (category) {
          params.set('category', category)
        } else {
          params.delete('category')
        }
      }
      
      if (hasChanges) {
        router.push(`/?${params.toString()}`, { scroll: false })
      }
    }, 400)
    
    return () => clearTimeout(timeoutId)
  }, [search, category, router, searchParams])

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10 mt-6 lg:max-w-4xl mx-auto">
      <div className="flex-1 relative">
        <input 
          type="text" 
          placeholder="Search tools, design resources, articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-[var(--color-border-cool)] pl-12 pr-5 py-4 text-base focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50 bg-white shadow-sm transition"
        />
        <svg className="absolute left-5 top-4 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <div className="md:w-64 relative">
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-full border border-[var(--color-border-cool)] pl-5 pr-12 py-4 text-base focus:border-[var(--color-focus-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-interaction-blue)] focus:ring-opacity-50 bg-white shadow-sm appearance-none transition"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
             <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <svg className="absolute right-5 top-5 h-4 w-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
    </div>
  )
}
