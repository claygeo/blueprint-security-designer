import { supabase, uploadBlueprintImage, deleteBlueprintImage } from './supabaseClient'

export const blueprintService = {
  // Get all blueprints for current user
  async getBlueprints() {
    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get single blueprint by ID
  async getBlueprint(id) {
    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new blueprint
  async createBlueprint(blueprint, imageFile = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let imageUrl = blueprint.image_url

    // Upload image if provided
    if (imageFile && typeof imageFile !== 'string') {
      imageUrl = await uploadBlueprintImage(imageFile, user.id)
    }

    const { data, error } = await supabase
      .from('blueprints')
      .insert([{
        user_id: user.id,
        name: blueprint.name,
        description: blueprint.description || '',
        image_url: imageUrl,
        rooms: blueprint.rooms || [],
        equipment: blueprint.equipment || [],
        show_room_labels: blueprint.show_room_labels !== undefined ? blueprint.show_room_labels : true
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update existing blueprint
  async updateBlueprint(id, updates, newImageFile = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    let imageUrl = updates.image_url

    // Upload new image if provided
    if (newImageFile && typeof newImageFile !== 'string') {
      // Delete old image if exists
      if (updates.old_image_url) {
        await deleteBlueprintImage(updates.old_image_url)
      }
      imageUrl = await uploadBlueprintImage(newImageFile, user.id)
    }

    const { data, error } = await supabase
      .from('blueprints')
      .update({
        name: updates.name,
        description: updates.description,
        image_url: imageUrl,
        rooms: updates.rooms,
        equipment: updates.equipment,
        show_room_labels: updates.show_room_labels,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete blueprint
  async deleteBlueprint(id) {
    // First get the blueprint to get image URL
    const { data: blueprint } = await supabase
      .from('blueprints')
      .select('image_url')
      .eq('id', id)
      .single()
    
    // Delete the blueprint
    const { error } = await supabase
      .from('blueprints')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Delete associated image from storage
    if (blueprint?.image_url) {
      await deleteBlueprintImage(blueprint.image_url)
    }
    
    return true
  },

  // Convert base64 to file for upload
  async base64ToFile(base64String, fileName = 'blueprint.png') {
    // Remove data URL prefix if present
    const base64Data = base64String.split(',')[1] || base64String
    
    // Convert base64 to blob
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/png' })
    
    // Convert blob to File
    return new File([blob], fileName, { type: 'image/png' })
  }
}