const express = require('express');
const { supabase, DEFAULT_LEADERBOARD } = require('../db/database');
const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const { game } = req.query;
    let players = [];
    try {
      let query = supabase.from('leaderboard').select('*').order('points', { ascending: false });
      if (game && game !== 'all') {
        query = query.eq('game', game);
      }
      const resDb = await query;
      if (!resDb.error && resDb.data && resDb.data.length > 0) {
        players = resDb.data;
      }
    } catch (e) {
      console.warn('Leaderboard query warning:', e.message);
    }

    if (!players || players.length === 0) {
      players = [...DEFAULT_LEADERBOARD];
      if (game && game !== 'all') {
        players = players.filter(p => p.game.toLowerCase() === game.toLowerCase());
      }
    }

    res.json({ players });
  } catch (err) {
    res.json({ players: DEFAULT_LEADERBOARD });
  }
});

module.exports = router;
