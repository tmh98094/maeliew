import { supabase, Content, Category, Project, ContentCollection, ContentType, ContentStatus } from '../lib/supabase'

// Services interface
export interface ServicePackage {
  id: string;
  title: string;
  category: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal';
  price: number;
  currency: 'RM';
  features: string[];
  description?: string;
  duration?: string;
  note?: string;
  images?: string[];
  status: 'active' | 'inactive' | 'archived';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export class CRMService {
  // Check if Supabase is available
  private static checkSupabase() {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
    return supabase
  }

  // Content Management
  static async getAllContent(options?: {
    limit?: number
    offset?: number
    status?: ContentStatus
    type?: ContentType
    categoryId?: string
    projectId?: string
    orderBy?: 'created_at' | 'sort_order'
  }) {
    const client = this.checkSupabase()
    
    // Use direct query instead of RPC for better compatibility
    let query = client
      .from('content')
      .select(`
        *,
        category_name:categories(name),
        category_color:categories(color),
        project_name:projects(name)
      `)

    // Apply filters
    if (options?.status) {
      query = query.eq('status', options.status)
    }
    if (options?.type) {
      query = query.eq('type', options.type)
    }
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId)
    }
    if (options?.projectId) {
      query = query.eq('project_id', options.projectId)
    }

    // Apply ordering - default to sort_order for images, created_at for others
    const orderBy = options?.orderBy || (options?.type === 'image' ? 'sort_order' : 'created_at')
    query = query.order(orderBy, { ascending: orderBy === 'sort_order' })

    // Apply pagination
    const limit = options?.limit || 50
    const offset = options?.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error
    
    // Transform the data to match expected format
    const transformedData = data?.map(item => ({
      ...item,
      category_name: item.category_name?.[0]?.name || null,
      category_color: item.category_color?.[0]?.color || null,
      project_name: item.project_name?.[0]?.name || null
    })) || []

    return transformedData as Content[]
  }

  static async getContentById(id: string) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content')
      .select(`
        *,
        categories(name, color),
        projects(name)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async createContent(content: Omit<Content, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'download_count'>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content')
      .insert(content)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateContent(id: string, updates: Partial<Content>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteContent(id: string) {
    const client = this.checkSupabase()
    const { error } = await client
      .from('content')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async searchContent(searchTerm: string, limit = 20) {
    const client = this.checkSupabase()
    const { data, error } = await client.rpc('search_content', {
      search_term: searchTerm,
      limit_count: limit
    })

    if (error) throw error
    return data
  }

  // Sort Order Management
  static async updateSortOrder(id: string, sortOrder: number) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content')
      .update({ sort_order: sortOrder })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateBatchSortOrder(items: { id: string; sort_order: number }[]) {
    const client = this.checkSupabase()
    
    // Use Promise.all for batch updates
    const updates = items.map(item =>
      client
        .from('content')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
    )

    const results = await Promise.all(updates)
    const errors = results.filter(r => r.error)
    
    if (errors.length > 0) {
      throw new Error(`Failed to update ${errors.length} items`)
    }
  }

  // Featured Content Management
  static async getFeaturedContent(type?: ContentType) {
    const client = this.checkSupabase()
    
    let query = client
      .from('content')
      .select(`
        *,
        category_name:categories(name),
        category_color:categories(color),
        project_name:projects(name)
      `)
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('sort_order', { ascending: true })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) throw error
    
    const transformedData = data?.map(item => ({
      ...item,
      category_name: item.category_name?.[0]?.name || null,
      category_color: item.category_color?.[0]?.color || null,
      project_name: item.project_name?.[0]?.name || null
    })) || []

    return transformedData as Content[]
  }

  static async toggleFeatured(id: string, isFeatured: boolean) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content')
      .update({ is_featured: isFeatured })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Category Management
  static async getAllCategories() {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Category[]
  }

  static async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateCategory(id: string, updates: Partial<Category>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteCategory(id: string) {
    const client = this.checkSupabase()
    const { error } = await client
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Project Management
  static async getAllProjects() {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateProject(id: string, updates: Partial<Project>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics
  static async incrementViewCount(contentId: string) {
    const client = this.checkSupabase()
    const { error } = await client.rpc('increment_view_count', {
      content_uuid: contentId
    })

    if (error) throw error
  }

  static async incrementDownloadCount(contentId: string) {
    const client = this.checkSupabase()
    const { error } = await client.rpc('increment_download_count', {
      content_uuid: contentId
    })

    if (error) throw error
  }

  static async getAnalyticsSummary(contentId?: string, daysBack = 30) {
    const client = this.checkSupabase()
    const { data, error } = await client.rpc('get_content_analytics_summary', {
      content_uuid: contentId || null,
      days_back: daysBack
    })

    if (error) throw error
    return data?.[0] || { total_views: 0, total_downloads: 0, unique_visitors: 0, top_referrers: [] }
  }

  // Collections
  static async getAllCollections() {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content_collections')
      .select('*')
      .order('name')

    if (error) throw error
    return data as ContentCollection[]
  }

  static async createCollection(collection: Omit<ContentCollection, 'id' | 'created_at' | 'updated_at'>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content_collections')
      .insert(collection)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async addContentToCollection(collectionId: string, contentId: string, sortOrder = 0) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content_collection_items')
      .insert({
        collection_id: collectionId,
        content_id: contentId,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getCollectionContent(collectionId: string) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('content_collection_items')
      .select(`
        *,
        content:content_id(*)
      `)
      .eq('collection_id', collectionId)
      .order('sort_order')

    if (error) throw error
    return data
  }

  // Services Management
  static async getAllServices(options?: {
    category?: string;
    status?: string;
  }) {
    const client = this.checkSupabase()
    
    let query = client
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })

    // Apply filters
    if (options?.category) {
      query = query.eq('category', options.category)
    }
    if (options?.status) {
      query = query.eq('status', options.status)
    }

    const { data, error } = await query

    if (error) throw error
    return data as ServicePackage[]
  }

  static async getServiceById(id: string) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as ServicePackage
  }

  static async createService(service: Omit<ServicePackage, 'id' | 'created_at' | 'updated_at'>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('services')
      .insert(service)
      .select()
      .single()

    if (error) throw error
    return data as ServicePackage
  }

  static async updateService(id: string, updates: Partial<ServicePackage>) {
    const client = this.checkSupabase()
    const { data, error } = await client
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as ServicePackage
  }

  static async deleteService(id: string) {
    const client = this.checkSupabase()
    const { error } = await client
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async getServicesByCategory(category?: string) {
    const client = this.checkSupabase()
    const { data, error } = await client.rpc('get_services_by_category', {
      filter_category: category || null,
      filter_status: 'active'
    })

    if (error) throw error
    return data as ServicePackage[]
  }
}