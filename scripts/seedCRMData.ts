import { supabase } from '../src/lib/supabase'

export async function seedCRMData() {
  console.log('Seeding CRM with sample data...')
  
  try {
    // Get category IDs
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
    
    if (!categories) {
      throw new Error('No categories found')
    }

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.id
      return acc
    }, {} as Record<string, string>)

    // Get project ID
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('name', 'Mae Liew Portfolio Website')
      .single()

    if (!project) {
      throw new Error('Project not found')
    }

    // Sample content data
    const sampleContent = [
      {
        title: 'Professional Headshot',
        description: 'Professional portrait photography for business use',
        type: 'image' as const,
        status: 'published' as const,
        file_path: '/public/images/about/headshot.jpg',
        file_name: 'headshot.jpg',
        mime_type: 'image/jpeg',
        alt_text: 'Professional headshot of Mae Liew',
        tags: ['portrait', 'professional', 'headshot'],
        keywords: ['photography', 'portrait', 'professional'],
        category_id: categoryMap['About'],
        project_id: project.id,
        meta_title: 'Mae Liew - Professional Headshot',
        meta_description: 'Professional portrait photography showcasing Mae Liew\'s expertise'
      },
      {
        title: 'Wedding Photography Sample',
        description: 'Beautiful wedding photography capturing special moments',
        type: 'image' as const,
        status: 'published' as const,
        file_path: '/public/images/portfolio/wedding-01.jpg',
        file_name: 'wedding-01.jpg',
        mime_type: 'image/jpeg',
        alt_text: 'Elegant wedding photography by Mae Liew',
        tags: ['wedding', 'photography', 'couples'],
        keywords: ['wedding', 'photography', 'romantic', 'couples'],
        category_id: categoryMap['Portfolio'],
        project_id: project.id,
        meta_title: 'Wedding Photography - Mae Liew',
        meta_description: 'Capturing beautiful wedding moments with artistic flair'
      },
      {
        title: 'Photography Services Overview',
        description: 'Comprehensive overview of photography services offered',
        type: 'image' as const,
        status: 'published' as const,
        file_path: '/public/images/services/photography-services.jpg',
        file_name: 'photography-services.jpg',
        mime_type: 'image/jpeg',
        alt_text: 'Photography services by Mae Liew',
        tags: ['services', 'photography', 'professional'],
        keywords: ['services', 'photography', 'professional', 'portfolio'],
        category_id: categoryMap['Services'],
        project_id: project.id,
        meta_title: 'Photography Services - Mae Liew',
        meta_description: 'Professional photography services for all occasions'
      },
      {
        title: 'Latest Blog Post Image',
        description: 'Featured image for the latest blog post about photography techniques',
        type: 'image' as const,
        status: 'published' as const,
        file_path: '/public/images/blog/photography-tips.jpg',
        file_name: 'photography-tips.jpg',
        mime_type: 'image/jpeg',
        alt_text: 'Photography tips and techniques',
        tags: ['blog', 'tips', 'photography', 'education'],
        keywords: ['photography', 'tips', 'techniques', 'education'],
        category_id: categoryMap['Blog'],
        project_id: project.id,
        meta_title: 'Photography Tips - Mae Liew Blog',
        meta_description: 'Learn professional photography techniques and tips'
      }
    ]

    // Insert sample content
    for (const content of sampleContent) {
      const { error } = await supabase
        .from('content')
        .insert(content)

      if (error) {
        console.error(`Error inserting ${content.title}:`, error)
      } else {
        console.log(`✓ Added: ${content.title}`)
      }
    }

    // Create a sample collection
    const { data: collection, error: collectionError } = await supabase
      .from('content_collections')
      .insert({
        name: 'Featured Portfolio',
        description: 'Curated selection of best portfolio pieces',
        is_public: true
      })
      .select()
      .single()

    if (collectionError) {
      console.error('Error creating collection:', collectionError)
    } else {
      console.log('✓ Created collection: Featured Portfolio')
      
      // Add some content to the collection
      const { data: portfolioContent } = await supabase
        .from('content')
        .select('id')
        .eq('category_id', categoryMap['Portfolio'])
        .limit(3)

      if (portfolioContent) {
        for (let i = 0; i < portfolioContent.length; i++) {
          await supabase
            .from('content_collection_items')
            .insert({
              collection_id: collection.id,
              content_id: portfolioContent[i].id,
              sort_order: i
            })
        }
        console.log('✓ Added content to collection')
      }
    }

    console.log('CRM seeding completed!')
    
    // Show summary
    const { data: contentCount } = await supabase
      .from('content')
      .select('id', { count: 'exact' })
    
    console.log(`Total content items: ${contentCount?.length || 0}`)

  } catch (error) {
    console.error('Seeding failed:', error)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedCRMData()
}