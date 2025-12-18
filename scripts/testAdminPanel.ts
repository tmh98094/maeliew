/**
 * Admin Panel CRUD Test Script
 * Tests all database operations to ensure admin panel functionality
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.local
try {
  const envPath = join(process.cwd(), '.env.local')
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value
    }
  })
} catch (error) {
  console.warn('Warning: Could not load .env.local file')
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL'
  error?: string
  data?: any
}

const results: TestResult[] = []

function logTest(test: string, status: 'PASS' | 'FAIL', error?: string, data?: any) {
  results.push({ test, status, error, data })
  const icon = status === 'PASS' ? '✅' : '❌'
  console.log(`${icon} ${test}`)
  if (error) console.log(`   Error: ${error}`)
  if (data) console.log(`   Data:`, JSON.stringify(data, null, 2))
}

async function testCategories() {
  console.log('\n📋 Testing Categories CRUD...')
  
  try {
    // READ - Get all categories
    const { data: categories, error: readError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (readError) throw readError
    logTest('Categories: READ all', 'PASS', undefined, { count: categories?.length })
    
    // CREATE - Add new category
    const newCategory = {
      name: `Test Category ${Date.now()}`,
      description: 'Test category for validation',
      color: '#FF6B6B'
    }
    
    const { data: created, error: createError } = await supabase
      .from('categories')
      .insert(newCategory)
      .select()
      .single()
    
    if (createError) throw createError
    logTest('Categories: CREATE', 'PASS', undefined, { id: created.id })
    
    // UPDATE - Modify category
    const { data: updated, error: updateError } = await supabase
      .from('categories')
      .update({ description: 'Updated description' })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    logTest('Categories: UPDATE', 'PASS', undefined, { id: updated.id })
    
    // DELETE - Remove test category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    logTest('Categories: DELETE', 'PASS')
    
  } catch (error: any) {
    logTest('Categories: CRUD Operations', 'FAIL', error.message)
  }
}

async function testProjects() {
  console.log('\n📁 Testing Projects CRUD...')
  
  try {
    // READ - Get all projects
    const { data: projects, error: readError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (readError) throw readError
    logTest('Projects: READ all', 'PASS', undefined, { count: projects?.length })
    
    // CREATE - Add new project
    const newProject = {
      name: `Test Project ${Date.now()}`,
      description: 'Test project for validation',
      status: 'planning',
      client_name: 'Test Client',
      budget: 5000
    }
    
    const { data: created, error: createError } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single()
    
    if (createError) throw createError
    logTest('Projects: CREATE', 'PASS', undefined, { id: created.id })
    
    // UPDATE - Modify project
    const { data: updated, error: updateError } = await supabase
      .from('projects')
      .update({ status: 'active', budget: 7500 })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    logTest('Projects: UPDATE', 'PASS', undefined, { id: updated.id })
    
    // DELETE - Remove test project (optional - keep for now)
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    logTest('Projects: DELETE', 'PASS')
    
  } catch (error: any) {
    logTest('Projects: CRUD Operations', 'FAIL', error.message)
  }
}

async function testContent() {
  console.log('\n🖼️  Testing Content/Portfolio CRUD...')
  
  try {
    // Get a category for testing
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .limit(1)
      .single()
    
    if (!categories) throw new Error('No categories found for testing')
    
    // READ - Get all content
    const { data: content, error: readError } = await supabase
      .from('content')
      .select(`
        *,
        categories(name, color),
        projects(name)
      `)
      .order('created_at', { ascending: false })
    
    if (readError) throw readError
    logTest('Content: READ all', 'PASS', undefined, { count: content?.length })
    
    // CREATE - Add new content
    const newContent = {
      title: `Test Portfolio Item ${Date.now()}`,
      description: 'Test portfolio item for validation',
      type: 'image',
      status: 'draft',
      category_id: categories.id,
      file_path: '/test/image.jpg',
      file_name: 'test-image.jpg',
      alt_text: 'Test image',
      tags: ['test', 'validation'],
      keywords: ['test', 'portfolio']
    }
    
    const { data: created, error: createError } = await supabase
      .from('content')
      .insert(newContent)
      .select()
      .single()
    
    if (createError) throw createError
    logTest('Content: CREATE', 'PASS', undefined, { id: created.id })
    
    // UPDATE - Modify content
    const { data: updated, error: updateError } = await supabase
      .from('content')
      .update({ 
        status: 'published',
        description: 'Updated test description'
      })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    logTest('Content: UPDATE', 'PASS', undefined, { id: updated.id })
    
    // DELETE - Remove test content
    const { error: deleteError } = await supabase
      .from('content')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    logTest('Content: DELETE', 'PASS')
    
  } catch (error: any) {
    logTest('Content: CRUD Operations', 'FAIL', error.message)
  }
}

async function testDatabaseFunctions() {
  console.log('\n⚙️  Testing Database Functions...')
  
  try {
    // Test search_content function
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_content', {
        search_term: 'test',
        limit_count: 10
      })
    
    if (searchError) throw searchError
    logTest('Function: search_content', 'PASS', undefined, { results: searchResults?.length })
    
    // Test get_content_analytics_summary function
    const { data: analytics, error: analyticsError } = await supabase
      .rpc('get_content_analytics_summary', {
        content_uuid: null,
        days_back: 30
      })
    
    if (analyticsError) throw analyticsError
    logTest('Function: get_content_analytics_summary', 'PASS', undefined, analytics?.[0])
    
  } catch (error: any) {
    logTest('Database Functions', 'FAIL', error.message)
  }
}

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...')
  
  try {
    // Check current session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (session) {
      logTest('Authentication: Session exists', 'PASS', undefined, { user: session.user.email })
    } else {
      logTest('Authentication: No active session', 'PASS', undefined, { note: 'Login required for admin panel' })
    }
    
  } catch (error: any) {
    logTest('Authentication', 'FAIL', error.message)
  }
}

async function testRLSPolicies() {
  console.log('\n🛡️  Testing Row Level Security...')
  
  try {
    // Test if we can read from tables (should work with anon key)
    const tables = ['categories', 'projects', 'content']
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
      
      if (error) {
        logTest(`RLS: ${table} read access`, 'FAIL', error.message)
      } else {
        logTest(`RLS: ${table} read access`, 'PASS')
      }
    }
    
  } catch (error: any) {
    logTest('RLS Policies', 'FAIL', error.message)
  }
}

async function runAllTests() {
  console.log('🧪 Starting Admin Panel CRUD Tests...\n')
  console.log('=' .repeat(60))
  
  await testAuthentication()
  await testRLSPolicies()
  await testCategories()
  await testProjects()
  await testContent()
  await testDatabaseFunctions()
  
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Test Summary:')
  console.log('=' .repeat(60))
  
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const total = results.length
  
  console.log(`\nTotal Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`)
    })
  }
  
  console.log('\n' + '='.repeat(60))
  
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error)
  process.exit(1)
})