import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage helpers
export const STORAGE_BUCKET = 'blueprints'

export const uploadBlueprintImage = async (file, userId) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  
  // Get public URL - correct format
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path)
  
  return publicUrl
}

export const deleteBlueprintImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes(STORAGE_BUCKET)) return
  
  // Extract file path from URL
  const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`)
  if (urlParts.length < 2) return
  
  const filePath = urlParts[1]
  
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath])
  
  if (error) console.error('Error deleting image:', error)
}