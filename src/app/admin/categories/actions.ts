"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const sb = await createClient();
  await sb.from('categories').insert({ name, slug })
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function createCategoryAjax(name: string) {
  if (!name) return null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const sb = await createClient();
  const { data, error } = await sb.from('categories').insert({ name, slug }).select('*').single();
  
  if (error) {
    console.error(error);
    return null;
  }
  
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/admin/bookmarks/new');
  return data;
}

export async function updateCategory(id: string, name: string) {
  if (!name) return;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const sb = await createClient();
  await sb.from('categories').update({ name, slug }).eq('id', id);
  revalidatePath('/admin/categories')
  revalidatePath('/')
}

export async function deleteCategory(id: string) {
  const sb = await createClient();
  await sb.from('categories').delete().eq('id', id);
  revalidatePath('/admin/categories')
  revalidatePath('/')
}
