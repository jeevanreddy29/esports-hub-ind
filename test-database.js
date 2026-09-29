// Database Connection Test for Esports Hub India
// Run this with: node test-database.js

require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

async function testDatabaseConnection() {
  console.log('🧪 Testing Esports Hub Database Connection...\n');

  // Check environment variables
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  console.log('📋 Environment Check:');
  console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SUPABASE_KEY: ${SUPABASE_KEY ? `✅ Set (${SUPABASE_KEY.length} chars)` : '❌ Missing'}`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('\n❌ Missing required environment variables!');
    console.log('   Please check your backend/.env file');
    return false;
  }

  try {
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Test 1: Basic connection
    console.log('\n🔌 Testing basic connection...');
    const { data, error } = await supabase.from('tournaments').select('count').limit(1);

    if (error) {
      console.log(`❌ Connection failed: ${error.message}`);
      return false;
    }

    console.log('✅ Basic connection successful!');

    // Test 2: Check if tournaments table exists and has data
    console.log('\n📊 Checking tournaments table...');
    const { data: tournaments, error: tourError } = await supabase
      .from('tournaments')
      .select('id, title, game, status')
      .limit(5);

    if (tourError) {
      console.log(`❌ Tournament query failed: ${tourError.message}`);
      console.log('   This might mean the tournaments table doesn\'t exist');
      return false;
    }

    console.log(`✅ Found ${tournaments.length} tournaments`);
    if (tournaments.length > 0) {
      console.log('   Sample tournaments:');
      tournaments.forEach(t => {
        console.log(`   - ${t.title} (${t.game}) - ${t.status}`);
      });
    } else {
      console.log('   ⚠️  No tournaments found - database might need seeding');
    }

    // Test 3: Check if users table exists
    console.log('\n👥 Checking users table...');
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (userError) {
      console.log(`❌ Users table check failed: ${userError.message}`);
      return false;
    }

    console.log('✅ Users table exists and is accessible');

    console.log('\n🎉 All database tests passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. If no tournaments found, run: node backend/db/database.js');
    console.log('   2. Start backend: npm run start');
    console.log('   3. Start frontend: npm run dev --prefix frontend');

    return true;

  } catch (err) {
    console.log(`\n❌ Unexpected error: ${err.message}`);
    return false;
  }
}

// Run the test
testDatabaseConnection().then(success => {
  process.exit(success ? 0 : 1);
});