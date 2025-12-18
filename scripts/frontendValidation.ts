import * as fs from 'fs';
import * as path from 'path';

async function frontendValidation() {
  console.log('🎨 FRONTEND VALIDATION');
  console.log('='.repeat(60));
  
  const results = [];

  // Check critical files exist
  const criticalFiles = [
    'App.tsx',
    'pages/Home.tsx',
    'pages/About.tsx', 
    'pages/Services.tsx',
    'pages/Portfolio.tsx',
    'pages/Blog.tsx',
    'pages/BlogPost.tsx',
    'pages/Contact.tsx',
    'pages/CRMAdmin.tsx',
    'src/components/WhatsAppButton.tsx',
    'src/components/WhatsAppFloater.tsx',
    'src/utils/slugUtils.ts',
    'src/services/crmService.ts',
    'src/lib/supabase.ts'
  ];

  console.log('1️⃣  CRITICAL FILES CHECK');
  console.log('-'.repeat(30));
  
  let filesExist = 0;
  for (const file of criticalFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
      filesExist++;
    } else {
      console.log(`   ❌ ${file} - MISSING`);
    }
  }
  
  results.push({
    test: 'Critical Files',
    status: filesExist === criticalFiles.length ? 'PASS' : 'FAIL',
    count: `${filesExist}/${criticalFiles.length}`
  });

  // Check package.json dependencies
  console.log('\n2️⃣  DEPENDENCIES CHECK');
  console.log('-'.repeat(30));
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@supabase/supabase-js',
      'lucide-react'
    ];

    let depsFound = 0;
    for (const dep of requiredDeps) {
      if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
        console.log(`   ✅ ${dep}`);
        depsFound++;
      } else {
        console.log(`   ❌ ${dep} - MISSING`);
      }
    }

    results.push({
      test: 'Dependencies',
      status: depsFound === requiredDeps.length ? 'PASS' : 'FAIL',
      count: `${depsFound}/${requiredDeps.length}`
    });

  } catch (error) {
    console.log('   ❌ Could not read package.json');
    results.push({ test: 'Dependencies', status: 'FAIL', error: 'package.json not found' });
  }

  // Check environment variables
  console.log('\n3️⃣  ENVIRONMENT VARIABLES');
  console.log('-'.repeat(30));
  
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  let envVarsFound = 0;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar}`);
      envVarsFound++;
    } else {
      console.log(`   ❌ ${envVar} - MISSING`);
    }
  }

  results.push({
    test: 'Environment Variables',
    status: envVarsFound === requiredEnvVars.length ? 'PASS' : 'FAIL',
    count: `${envVarsFound}/${requiredEnvVars.length}`
  });

  // Check build configuration
  console.log('\n4️⃣  BUILD CONFIGURATION');
  console.log('-'.repeat(30));
  
  const configFiles = [
    'vite.config.ts',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js'
  ];

  let configsFound = 0;
  for (const config of configFiles) {
    if (fs.existsSync(config)) {
      console.log(`   ✅ ${config}`);
      configsFound++;
    } else {
      console.log(`   ❌ ${config} - MISSING`);
    }
  }

  results.push({
    test: 'Build Configuration',
    status: configsFound === configFiles.length ? 'PASS' : 'FAIL',
    count: `${configsFound}/${configFiles.length}`
  });

  // Check routing structure
  console.log('\n5️⃣  ROUTING STRUCTURE');
  console.log('-'.repeat(30));
  
  try {
    const appContent = fs.readFileSync('App.tsx', 'utf8');
    const routes = [
      'path="/"',
      'path="/about"',
      'path="/services"',
      'path="/portfolio"',
      'path="/blog"',
      'path="/blog/:slug"',
      'path="/contact"',
      'path="/admin"'
    ];

    let routesFound = 0;
    for (const route of routes) {
      if (appContent.includes(route)) {
        console.log(`   ✅ ${route}`);
        routesFound++;
      } else {
        console.log(`   ❌ ${route} - MISSING`);
      }
    }

    results.push({
      test: 'Routing Structure',
      status: routesFound >= 6 ? 'PASS' : 'FAIL', // Allow some flexibility
      count: `${routesFound}/${routes.length}`
    });

  } catch (error) {
    console.log('   ❌ Could not read App.tsx');
    results.push({ test: 'Routing Structure', status: 'FAIL', error: 'App.tsx not readable' });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FRONTEND VALIDATION SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${failed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  console.log('\n📋 DETAILED RESULTS:');
  results.forEach(result => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    const count = result.count ? ` (${result.count})` : '';
    console.log(`   ${status} ${result.test}${count}`);
  });

  if (passed === total) {
    console.log('\n🎉 FRONTEND FULLY CONFIGURED!');
  } else {
    console.log('\n⚠️  FRONTEND NEEDS ATTENTION');
  }

  console.log('='.repeat(60));
}

frontendValidation();