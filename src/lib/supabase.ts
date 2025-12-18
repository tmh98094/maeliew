import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a safe Supabase client that won't crash if env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey)

// Types for our CRM system
export type ContentType = 'image' | 'video' | 'document' | 'text' | 'blog' | 'partner' | 'featured'
export type ContentStatus = 'draft' | 'published' | 'archived' | 'deleted'
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold' | 'cancelled'

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  start_date?: string
  end_date?: string
  budget?: number
  client_name?: string
  client_email?: string
  client_phone?: string
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  title: string
  description?: string
  type: ContentType
  status: ContentStatus
  file_path?: string
  file_name?: string
  file_size?: number
  mime_type?: string
  width?: number
  height?: number
  alt_text?: string
  tags?: string[]
  keywords?: string[]
  meta_title?: string
  meta_description?: string
  category_id?: string
  project_id?: string
  view_count: number
  download_count: number
  created_at: string
  updated_at: string
  published_at?: string
  
  // Joined fields from get_content_with_details function
  category_name?: string
  category_color?: string
  project_name?: string
}

export interface ContentCollection {
  id: string
  name: string
  description?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ContentAnalytics {
  id: string
  content_id: string
  event_type: string
  user_agent?: string
  ip_address?: string
  referrer?: string
  created_at: string
}

export interface ServicePackage {
  id: string
  title: string
  category: 'wedding' | 'rom' | 'pre-wedding' | 'addon' | 'personal'
  price: number
  currency: 'RM'
  features: string[]
  description?: string
  duration?: string
  note?: string
  images?: string[]
  status: 'active' | 'inactive' | 'archived'
  sort_order: number
  created_at: string
  updated_at: string
}