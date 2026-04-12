"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBookmark(formData: FormData) {
  const supabase = await createClient()

  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category_ids = formData.getAll('categories') as string[]
  const tagsStr = formData.get('tags') as string
  const is_public = formData.has('is_public')

  if (!url || !title) return;

  let image_url = null;
  const image_file = formData.get('image_file') as File | null;
  
  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('bookmark_covers')
      .upload(fileName, image_file);

    if (uploadError) {
      console.error("Upload error", uploadError);
    } else if (uploadData) {
      const { data: publicUrlData } = supabase
        .storage
        .from('bookmark_covers')
        .getPublicUrl(fileName);
        
      image_url = publicUrlData.publicUrl;
    }
  }

  // Insert bookmark
  const { data: bookmark, error } = await supabase
    .from('bookmarks')
    .insert({
      url,
      title,
      description,
      image_url,
      is_public
    })
    .select()
    .single()

  if (error || !bookmark) {
    console.error("Error inserting bookmark:", error)
    return;
  }

  // Handle categories
  if (category_ids && category_ids.length > 0) {
    const validCategoryIds = category_ids.filter(Boolean);
    if (validCategoryIds.length > 0) {
      await supabase
        .from('bookmark_categories')
        .insert(validCategoryIds.map(cid => ({
          bookmark_id: bookmark.id,
          category_id: cid
        })))
    }
  }

  // Handle tags
  if (tagsStr && tagsStr.trim() !== '') {
    const rawTags = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    
    for (const tagName of rawTags) {
      if (!tagName) continue;

      let tagId;

      // Check if tag exists
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single()

      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Insert new tag
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: tagName })
          .select()
          .single()
        
        if (newTag) tagId = newTag.id;
      }

      if (tagId) {
        // Link to bookmark
        await supabase
          .from('bookmark_tags')
          .insert({
            bookmark_id: bookmark.id,
            tag_id: tagId
          })
      }
    }
  }

  revalidatePath('/admin/bookmarks')
  revalidatePath('/')
  redirect('/admin/bookmarks')
}

export async function updateBookmark(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category_ids = formData.getAll('categories') as string[]
  const tagsStr = formData.get('tags') as string
  const is_public = formData.has('is_public')

  if (!id || !url || !title) return;

  const updateData: any = {
      url,
      title,
      description,
      is_public
  }

  const image_file = formData.get('image_file') as File | null;
  
  if (image_file && image_file.size > 0) {
    const fileExt = image_file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('bookmark_covers')
      .upload(fileName, image_file);

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase
        .storage
        .from('bookmark_covers')
        .getPublicUrl(fileName);
        
      updateData.image_url = publicUrlData.publicUrl;
    }
  }

  // Update bookmark
  const { error } = await supabase
    .from('bookmarks')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error("Error updating bookmark:", error)
    return;
  }

  // Delete all existing categories mappings
  await supabase.from('bookmark_categories').delete().eq('bookmark_id', id)

  // Handle new categories
  if (category_ids && category_ids.length > 0) {
    const validCategoryIds = category_ids.filter(Boolean);
    if (validCategoryIds.length > 0) {
      await supabase
        .from('bookmark_categories')
        .insert(validCategoryIds.map(cid => ({
          bookmark_id: id,
          category_id: cid
        })))
    }
  }

  // Delete all existing tags mappings
  await supabase.from('bookmark_tags').delete().eq('bookmark_id', id)

  // Handle new tags
  if (tagsStr && tagsStr.trim() !== '') {
    const rawTags = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    
    for (const tagName of rawTags) {
      if (!tagName) continue;

      let tagId;

      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single()

      if (existingTag) {
        tagId = existingTag.id;
      } else {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: tagName })
          .select()
          .single()
        
        if (newTag) tagId = newTag.id;
      }

      if (tagId) {
        await supabase
          .from('bookmark_tags')
          .insert({
            bookmark_id: id,
            tag_id: tagId
          })
      }
    }
  }

  revalidatePath('/admin/bookmarks')
  revalidatePath('/')
  redirect('/admin/bookmarks')
}

export async function deleteBookmark(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  if (!id) return;

  await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)

  revalidatePath('/admin/bookmarks')
  revalidatePath('/')
}
