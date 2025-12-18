import { useState, useEffect } from 'react'
import { CRMService } from '../services/crmService'
import { Content, Category, Project } from '../lib/supabase'

export const useCRM = () => {
  const [content, setContent] = useState<Content[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadContent = async (options?: Parameters<typeof CRMService.getAllContent>[0]) => {
    try {
      setLoading(true)
      setError(null)
      const data = await CRMService.getAllContent(options)
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await CRMService.getAllCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    }
  }

  const loadProjects = async () => {
    try {
      const data = await CRMService.getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    }
  }

  const trackView = async (contentId: string) => {
    try {
      await CRMService.incrementViewCount(contentId)
    } catch (err) {
      console.error('Failed to track view:', err)
    }
  }

  const trackDownload = async (contentId: string) => {
    try {
      await CRMService.incrementDownloadCount(contentId)
    } catch (err) {
      console.error('Failed to track download:', err)
    }
  }

  useEffect(() => {
    loadCategories()
    loadProjects()
  }, [])

  return {
    content,
    categories,
    projects,
    loading,
    error,
    loadContent,
    loadCategories,
    loadProjects,
    trackView,
    trackDownload,
    CRMService
  }
}