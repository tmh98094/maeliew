import { supabase } from '../src/lib/supabase'
import { imageManifest } from '../src/data/imageManifest'

interface ExistingImage {
  id: string
  category: string
  filename: string
  alt: string
  tags?: string[]
}

// Map your existing image categories to CRM categories
const categoryMapping: Record<string, string> = {
  'about': 'About',
  'blog': 'Blog', 
  'general': 'General',
  'portfolio': 'Portfolio',
  'services': 'Services'
}

export async function migrateExistingImages() {
  console.log('Starting image migration to CRM...')
  
  try {
    // Get existing categories from Supabase
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
    
    if (!categories) {
      throw new Error('Could not fetch categories')
    }

    // Create category ID mapping
    const categoryIdMap: Record<string, string> = {}
    categories.forEach(cat => {
      categoryIdMap[cat.name] = cat.id
    })

    // Get the main project ID
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('name', 'Mae Liew Portfolio Website')
      .single()

    const projectId = projects?.id

    // Process each image from your existing manifest
    const imagesToMigrate = Object.entries(imageManifest).flatMap(([category, images]) => 
      Array.isArray(images) ? images.map(image => ({
        ...image,
        category: category
      })) : []
    )

    console.log(`Found ${imagesToMigrate.length} images to migrate`)

    for (const image of imagesToMigrate) {
      const categoryName = categoryMapping[image.category] || 'General'
      const categoryId = categoryIdMap[categoryName]
      
      if (!categoryId) {
        console.warn(`Category not found for: ${categoryName}`)
        continue
      }

      // Extract tags from filename or alt text
      const tags = [
        image.category,
        ...(image.alt.toLowerCase().split(' ').filter(word => word.length > 3))
      ]

      const contentData = {
        title: image.alt || image.filename.replace(/\.[^/.]+$/, ""), // Remove extension
        description: `Image from ${image.category} category`,
        type: 'image' as const,
        status: 'published' as const,
        file_path: `/public/images/${image.category}/${image.filename}`,
        file_name: image.filename,
        mime_type: image.filename.toLowerCase().endsWith('.jpg') || image.filename.toLowerCase().endsWith('.jpeg') 
          ? 'image/jpeg' 
          : image.filename.toLowerCase().endsWith('.png') 
          ? 'image/png' 
          : 'image/webp',
        alt_text: image.alt,
        tags: tags,
        keywords: tags,
        category_id: categoryId,
        project_id: projectId,
        meta_title: image.alt,
        meta_description: `${image.alt} - Mae Liew Portfolio`
      }

      const { error } = await supabase
        .from('content')
        .insert(contentData)

      if (error) {
        console.error(`Error inserting ${image.filename}:`, error)
      } else {
        console.log(`✓ Migrated: ${image.filename}`)
      }
    }

    console.log('Migration completed!')
    
    // Show summary
    const { data: contentCount } = await supabase
      .from('content')
      .select('id', { count: 'exact' })
    
    console.log(`Total content items in CRM: ${contentCount?.length || 0}`)

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateExistingImages()
}