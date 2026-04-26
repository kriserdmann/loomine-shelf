"use client";

import { useState } from "react";
import { createCategoryAjax } from "../categories/actions";

export default function CategorySelector({ 
  initialCategories, 
  selectedCategoryIds = [] 
}: { 
  initialCategories: any[], 
  selectedCategoryIds?: string[] 
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Track selected categories directly so we can check new ones automatically
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedCategoryIds));

  const handleToggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsLoading(true);
    try {
      const newCat = await createCategoryAjax(newCategoryName.trim());
      if (newCat) {
        setCategories([...categories, newCat]);
        // Auto select the new category
        setSelected(prev => new Set(prev).add(newCat.id));
        setNewCategoryName("");
        setIsAdding(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-near-black)]">Category (Select multiple)</label>
      <div className="flex flex-col gap-2 border border-[var(--color-border-cool)] rounded-md p-3 max-h-48 overflow-y-auto bg-white">
        {categories?.map(c => (
          <div key={c.id} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id={`cat_${c.id}`} 
              name="categories" 
              value={c.id}
              checked={selected.has(c.id)}
              onChange={() => handleToggle(c.id)}
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-interaction-blue)] focus:ring-[var(--color-interaction-blue)]" 
            />
            <label htmlFor={`cat_${c.id}`} className="text-sm text-[var(--color-muted-slate)]">{c.name}</label>
          </div>
        ))}
        {categories?.length === 0 && (
          <p className="text-sm text-[var(--color-muted-slate)]">No categories found.</p>
        )}
      </div>
      
      {!isAdding ? (
        <button 
          type="button" 
          onClick={() => setIsAdding(true)}
          className="text-sm text-[var(--color-interaction-blue)] hover:underline self-start mt-1"
        >
          + Add new category
        </button>
      ) : (
        <div className="flex gap-2 mt-1">
          <input 
            type="text" 
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="rounded-md border border-[var(--color-border-cool)] p-2 text-sm flex-1 focus:outline-none focus:border-[var(--color-focus-purple)]"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCategory();
              } else if (e.key === 'Escape') {
                setIsAdding(false);
              }
            }}
          />
          <button 
            type="button"
            onClick={handleAddCategory}
            disabled={isLoading || !newCategoryName.trim()}
            className="rounded-md bg-[var(--color-cohere-black)] px-3 py-2 text-sm text-white hover:bg-[var(--color-interaction-blue)] disabled:opacity-50"
          >
            {isLoading ? '...' : 'Add'}
          </button>
          <button 
            type="button"
            onClick={() => setIsAdding(false)}
            disabled={isLoading}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
