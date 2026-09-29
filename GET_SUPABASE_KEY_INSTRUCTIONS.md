# How to Get Your Complete Supabase API Key

## The Issue
Your current Supabase key appears truncated: `sb_publishable_xH2TVjSgyvtnuBO8_kQGgQ_YW1_Qpr_`

A complete Supabase anon key should be much longer and look like:
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJwcm9qZWN0aWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNTIxOTkyNCwiZXhwIjoxOTMwNzk1OTI0fQ.example_signature_here`

## Steps to Get Your Complete Key

### Option 1: From Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `mkxmjvbxtymtsaupgopk`
3. Go to Settings → API
4. Copy the **"anon" "public"** key (not the service_role key)
5. It should be a very long string starting with `eyJ`

### Option 2: From Project Settings
1. In your Supabase dashboard
2. Click on your project
3. Go to Settings (gear icon) → API
4. Under "Project API keys", copy the "anon public" key
5. This key is safe to use in frontend applications

## What to Do Next
1. Get the complete key using steps above
2. Replace the key in your `backend/.env` file
3. The key should look like: `SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...very_long_string`
4. Run the test script to verify: `node test-database.js`

## Security Note
The anon/public key is safe to share and use in frontend applications. Do NOT share the service_role key as it has admin privileges.