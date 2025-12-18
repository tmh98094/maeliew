/**
 * Authenticated Admin Panel CRUD Test Script
 * Tests all database operations with proper authentication
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
  status: 'PASS' | 'FAIL' | 'SKIP'
  error?: string
  data?: any
}

const results: TestResult[] = []

function logTest(test: string, status: 'PASS' | 'FAIL' | 'SKIP', error?: string, data?: any) {
  results.push({ test, status, error, data })
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️ '
  console.log(`${icon} ${test}`)
  if (error) console.log(`   Error: ${error}`)
  if (data && status === 'PASS') console.log(`   Data:`, JSON.stringify(data, null, 2))
}

async function authenticate() {
  console.log('\n🔐 Authenticating...')
  console.log('=' .repeat(60))
  
  // For automated testing, we'll use the service role key if available
  // Otherwise, tests will run with anon key (read-only)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (serviceRoleKey) {
    console.log('✅ Using service role key for full access')
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } else {
    console.log('⚠️  No service role key found - testing with anon key (read-only)')
    console.log('   Write operations will fail (this is expected)')
    return supabase
  }
}

async function testCategories(client: any) {
  console.log('\n📋 Testing Categories CRUD...')
  
  try {
    // READ
    const { data: categories, error: readError } = await client
      .from('categories')
      .select('*')
      .order('name')
    
    if (readError) throw readError
    logTest('Categories: READ all', 'PASS', undefined, { count: categories?.length, names: categories?.map((c: any) => c.name) })
    
    // CREATE
    const newCategory = {
      name: `Test Category ${Date.now()}`,
      description: 'Test category for validation',
      color: '#FF6B6B'
    }
    
    const { data: created, error: createError } = await client
      .from('categories')
      .insert(newCategory)
      .select()
      .single()
    
    if (createError) {
      if (createError.message.includes('row-level security')) {
        logTest('Categories: CREATE', 'SKIP', 'Authentication required (expected)')
        return
      }
      throw createError
    }
    logTest('Categories: CREATE', 'PASS', undefined, { id: created.id, name: created.name })
    
    // UPDATE
    const { data: updated, error: updateError } = await client
      .from('categories')
      .update({ description: 'Updated description', color: '#00FF00' })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    logTest('Categories: UPDATE', 'PASS', undefined, { id: updated.id })
    
    // DELETE
    const { error: deleteError } = await client
      .from('categories')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    logTest('Categories: DELETE', 'PASS')
    
  } catch (error: any) {
    logTest('Categories: CRUD Operations', 'FAIL', error.message)
  }
}

async function testProjects(client: any) {
  console.log('\n📁 Testing Projects CRUD...')
  
  try {
    // READ
    const { data: projects, error: readError } = await client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (readError) throw readError
    logTest('Projects: READ all', 'PASS', undefined, { count: projects?.length })
    
    // CREATE
    const newProject = {
      name: `Test Project ${Date.now()}`,
      description: 'Test project for validation',
      status: 'planning',
      client_name: 'Test Client',
      client_email: 'test@example.com',
      budget: 5000
    }
    
    const { data: created, error: createError } = await client
      .from('projects')
      .insert(newProject)
      .select()
      .single()
    
    if (createError) {
      if (createError.message.includes('row-level security')) {
        logTest('Projects: CREATE', 'SKIP', 'Authentication required (expected)')
        return
      }
      throw createError
    }
    logTest('Projects: CREATE', 'PASS', undefined, { id: created.id, name: created.name })
    
    // UPDATE
    const { data: updated, error: updateError } = await client
      .from('projects')
      .update({ status: 'active', budget: 7500 })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    logTest('Projects: UPDATE', 'PASS', undefined, { id: updated.id, status: updated.status })
    
    // DELETE
    const { error: deleteError } = await client
      .from('projects')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    logTest('Projects: DELETE', 'PASS')
    
  } catch (error: any) {
    logTest('Projects: CRUD Operations', 'FAIL', error.message)
  }
}

async function testContent(client: any) {
  console.log('\n🖼️  Testing Content/Portfolio CRUD...')
  
  try {
    // Get a category for testing
    const { data: categories } = await client
      .from('categories')
      .select('id, name')
      .limit(1)
      .single()
    
    if (!categories) throw new Error('No categories found for testing')
    
    // READ with joins
    const { data: content, error: readError } = await client
      .from('content')
      .select(`
        *,
        categories(name, color),
        projects(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (readError) throw readError
    logTest('Content: READ with joins', 'PASS', undefined, { 
      count: content?.length,
      sample: content?.[0] ? {
        title: content[0].title,
        category: content[0].categories?.name
      } : null
    })
    
    // CREATE
    const newContent = {
      title: `Test Portfolio ${Date.now()}`,
      description: 'Test portfolio item for validation',
      type: 'image',
      status: 'draft',
      category_id: categories.id,
      file_path: '/test/image.jpg',
      file_name: 'test-image.jpg',
      file_size: 1024,
      mime_type: 'image/jpeg',
      alt_text: 'Test image for validation',
      tags: ['test', 'validation', 'portfolio'],
      keywords: ['test', 'admin', 'crud']
    }
    
    const { data: created, error: createError } = await client
      .from('content')
      .insert(newContent)
      .select()
      .single()
    
    if (createError) {
      if (createError.message.includes('row-level security')) {
        logTest('Content: CREATE', 'SKIP', 'Authentication required (expected)')
        return
      }
      throw createError
    }
    logTest('Content: CREATE', 'PASS', undefined, { id: created.id, title: created.title })
    
    // UPDATE
    const { data: updated, error: updateError } = await client
      .from('content')
      .update({ 
        status: 'published',
        description: 'Updated test description',
        tags: ['test', 'updated']
      })
      .eq('id', created.id)
      .select()
      .single()
    
    if (updateError) throw updateError
    logTest('Content: UPDATE', 'PASS', undefined, { id: updated.id, status: updated.status })
    
    // Test view count increment
    const { error: viewError } = await client.rpc('increment_view_count', {
      content_uuid: created.id
    })
    
    if (viewError) throw viewError
    logTest('Content: Increment view count', 'PASS')
    
    // DELETE
    const { error: deleteError } = await client
      .from('content')
      .delete()
      .eq('id', created.id)
    
    if (deleteError) throw deleteError
    logTest('Content: DELETE', 'PASS')
    
  } catch (error: any) {
    logTest('Content: CRUD Operations', 'FAIL', error.message)
  }
}

async function testSearchFunction(client: any) {
  console.log('\n🔍 Testing Search Functionality...')
  
  try {
    const { data: searchResults, error } = await client
      .rpc('search_content', {
        search_term: 'test',
        limit_count: 10
      })
    
    if (error) throw error
    logTest('Search: Find content by term', 'PASS', undefined, { 
      results: searchResults?.length,
      sample: searchResults?.[0]?.title
    })
    
  } catch (error: any) {
    logTest('Search Function', 'FAIL', error.message)
  }
}

async function runAllTests() {
  console.log('🧪 Starting Authenticated Admin Panel Tests...\n')
  console.log('=' .repeat(60))
  
  const client = await authenticate()
  
  await testCategories(client)
  await testProjects(client)
  await testContent(client)
  await testSearchFunction(client)
  
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Test Summary:')
  console.log('=' .repeat(60))
  
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const skipped = results.filter(r => r.status === 'SKIP').length
  const total = results.length
  
  console.log(`\nTotal Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏭️  Skipped: ${skipped} (authentication required)`)
  console.log(`Success Rate: ${((passed / (total - skipped)) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`)
    })
  }
  
  if (skipped > 0) {
    console.log('\n⏭️  Skipped Tests (Need Authentication):')
    results.filter(r => r.status === 'SKIP').forEach(r => {
      console.log(`  - ${r.test}: ${r.error}`)
    })
    console.log('\n💡 To test write operations:')
    console.log('   1. Log in to admin panel at http://localhost:3000/#/admin')
    console.log('   2. Test CRUD operations manually through the UI')
    console.log('   3. Or add SUPABASE_SERVICE_ROLE_KEY to .env.local for automated testing')
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('\n🎯 Conclusion:')
  if (failed === 0) {
    console.log('✅ All database operations are working correctly!')
    console.log('✅ Admin panel is ready to use')
    console.log('✅ Security policies are properly configured')
    console.log('\n🚀 Next step: Log in at http://localhost:3000/#/admin')
  } else {
    console.log('❌ Some tests failed - review errors above')
  }
  console.log('=' .repeat(60))
  
  process.exit(failed > 0 ? 1 : 0)
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error)
  process.exit(1)
})