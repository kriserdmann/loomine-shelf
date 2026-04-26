"use client";

import { useState } from "react";
import { updateCategory, deleteCategory } from "./actions";

export default function CategoryItem({ category }: { category: { id: string; name: string; slug: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);

  const handleSave = async () => {
    await updateCategory(category.id, name);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      await deleteCategory(category.id);
    }
  };

  if (isEditing) {
    return (
      <li className="py-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-[var(--color-border-cool)] p-2 text-sm focus:border-[var(--color-focus-purple)] focus:outline-none flex-1"
        />
        <div className="flex gap-2">
          <button onClick={handleSave} className="text-sm px-3 py-1 bg-[var(--color-cohere-black)] text-white rounded-md transition hover:bg-[var(--color-interaction-blue)]">Salvar</button>
          <button onClick={() => setIsEditing(false)} className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-md transition hover:bg-gray-300">Cancelar</button>
        </div>
      </li>
    );
  }

  return (
    <li className="py-4 flex flex-col sm:flex-row gap-4 justify-between sm:items-center group">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[var(--color-near-black)] group-hover:text-[var(--color-interaction-blue)] transition">{category.name}</span>
        <span className="text-xs font-mono text-[var(--color-muted-slate)] uppercase tracking-wider">{category.slug}</span>
      </div>
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-xs font-medium text-[var(--color-interaction-blue)] hover:underline">Editar</button>
        <button onClick={handleDelete} className="text-xs font-medium text-red-500 hover:underline">Excluir</button>
      </div>
    </li>
  );
}
