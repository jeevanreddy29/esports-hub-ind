const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/database');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'esportshubindia_secret_2025';

// Memory store fallback for demo & resilience
const fallbackUsers = new Map();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, state, games } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check fallback store
    if (fallbackUsers.has(cleanEmail)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    let user = null;
    const hashed = await bcrypt.hash(password, 10);

    try {
      // Check if user exists in Supabase
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) return res.status(409).json({ error: 'Email already registered' });

      // Insert new user
      const { data: inserted, error: insertErr } = await supabase
        .from('users')
        .insert([
          {
            name: cleanName,
            email: cleanEmail,
            password: hashed,
            state: state || 'Maharashtra',
            games: games || []
          }
        ])
        .select()
        .single();
        
      if (!insertErr && inserted) {
        user = inserted;
      }
    } catch (dbErr) {
      console.warn('Supabase signup fallback:', dbErr.message);
    }

    // Fallback if Supabase table is unreachable/paused
    if (!user) {
      const fallbackId = 'user_' + Date.now();
      user = {
        id: fallbackId,
        name: cleanName,
        email: cleanEmail,
        password: hashed,
        state: state || 'Maharashtra',
        games: games || [],
        created_at: new Date().toISOString()
      };
      fallbackUsers.set(cleanEmail, user);
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: typeof err === 'string' ? err : (err.message || 'Signup failed. Please try again.') });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ error: 'Email or Username and password required' });

    const cleanId = identifier.trim().toLowerCase();
    let user = null;

    // Check Supabase by email first
    try {
      const { data: byEmail } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanId)
        .maybeSingle();

      if (byEmail) {
        user = byEmail;
      } else {
        const { data: byName } = await supabase
          .from('users')
          .select('*')
          .ilike('name', identifier.trim())
          .maybeSingle();
        if (byName) user = byName;
      }
    } catch (e) {
      console.warn('Supabase login lookup fallback:', e.message);
    }

    // Check fallback store
    if (!user && fallbackUsers.has(cleanId)) {
      user = fallbackUsers.get(cleanId);
    }
    if (!user) {
      for (const u of fallbackUsers.values()) {
        if (u.name.toLowerCase() === cleanId) {
          user = u;
          break;
        }
      }
    }

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: typeof err === 'string' ? err : (err.message || 'Login failed. Please try again.') });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    
    let user = null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, state, games, avatar_url, created_at')
        .eq('id', decoded.id)
        .maybeSingle();
      if (!error && data) user = data;
    } catch (e) {}

    if (!user && fallbackUsers.has(decoded.email?.toLowerCase())) {
      const u = fallbackUsers.get(decoded.email.toLowerCase());
      const { password: _, ...safe } = u;
      user = safe;
    }

    if (!user) {
      user = { id: decoded.id, name: decoded.name || 'Pro Gamer', email: decoded.email, state: 'India', games: ['BGMI', 'Valorant'] };
    }
    
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/update
router.post('/update', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);

    const { name, state, games, avatar_url } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (state !== undefined) updateData.state = state;
    if (games !== undefined) updateData.games = games;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    
    let user = null;
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', decoded.id)
        .select('id, name, email, state, games, avatar_url, created_at')
        .single();
      if (!error && data) user = data;
    } catch (e) {}

    if (!user) {
      user = { id: decoded.id, email: decoded.email, ...updateData };
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

module.exports = router;
