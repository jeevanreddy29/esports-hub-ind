import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaGamepad } from 'react-icons/fa';
import { tournamentAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import CountdownTimer from '../components/CountdownTimer';
import { GameIcon } from '../utils/gameLogos';
import toast from 'react-hot-toast';

const GAMES = ['all', 'Valorant', 'BGMI', 'MLBB', 'Free Fire Max', 'Pokemon Unite', 'Minecraft', 'CS2', 'Call of Duty Mobile', 'Tekken 8', 'Clash Royale', 'FC Mobile'];
const STATUSES = ['all', 'live', 'upcoming', 'past'];

function TournamentCard({ t, isSkeleton }) {
  if (isSkeleton) {
    return (
      <div className="glass-card" style={{ padding: 22 }}>
        <div className="skeleton" style={{ width: 44, height: 44, marginBottom: 14 }} />
        <Skeleton width="75%" height="20px" className="mb-2" />
        <Skeleton width="45%" height="15px" className="mb-4" />
        <Skeleton height="40px" borderRadius="8px" />
      </div>
    );
  }

  const pct = t.slots > 0 ? Math.round((t.slots_filled / t.slots) * 100) : 0;
  const isAlmostFull = pct >= 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{ height: '100%' }}
    >
      <Link to={`/tournaments/${t._id || t.id}`} style={{ display: 'block', height: '100%' }}>
        <div className="glass-card" style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 24px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle top indicator */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: t.status === 'live' 
              ? 'linear-gradient(90deg, #ef4444, #f5a623)' 
              : 'linear-gradient(90deg, #f5a623, #00d2ff)'
          }} />

          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 'var(--radius)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GameIcon game={t.game} size={26} />
            </div>

            {t.status === 'live' ? (
              <span className="badge badge-live">LIVE NOW</span>
            ) : (
              <span className="badge badge-upcoming">UPCOMING</span>
            )}
          </div>

          {/* Title & Game */}
          <h3 style={{
            fontFamily: 'Orbitron',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: '#fff',
            lineHeight: 1.3,
            marginBottom: 6
          }}>
            {t.title}
          </h3>
          <div style={{
            fontFamily: 'Rajdhani',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 18
          }}>
            {t.game} • {t.format || 'SQUAD'}
          </div>

          {/* Stats Box */}
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)',
            padding: '14px 16px',
            marginBottom: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Prize Pool
              </div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.15rem', color: 'var(--gold)' }}>
                {t.prize_pool}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Slots
              </div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.05rem', color: isAlmostFull ? '#ef4444' : '#fff' }}>
                {t.slots_filled} / {t.slots}
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div style={{ marginBottom: 18 }}>
            <CountdownTimer targetDate={t.start_date} status={t.status} />
          </div>

          {/* Action Button */}
          <div className="btn btn-primary" style={{
            width: '100%',
            marginTop: 'auto',
            textAlign: 'center'
          }}>
            {t.status === 'past' ? 'View Results' : 'View Tournament Details →'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Tournaments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [game, setGame] = useState(searchParams.get('game') || 'all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [minPrize, setMinPrize] = useState('');
  const [maxPrize, setMaxPrize] = useState('');
  const [format, setFormat] = useState('all');
  const [region, setRegion] = useState('all');

  const fetchTournaments = useCallback(() => {
    setLoading(true);
    tournamentAPI.getAll({
      game: game === 'all' ? undefined : game,
      status: status === 'all' ? undefined : status,
      search: search || undefined,
      minPrize: minPrize || undefined,
      maxPrize: maxPrize || undefined,
      format: format === 'all' ? undefined : format,
      region: region === 'all' ? undefined : region,
    })
      .then(r => {
        setTournaments(r.data?.tournaments || []);
        setLastUpdated(new Date());
      })
      .catch((err) => {
        console.error('❌ API Error:', err);
        toast.error('Failed to load tournaments: ' + (err.response?.data?.error || err.message));
        setTournaments([]);
      })
      .finally(() => setLoading(false));
  }, [game, status, search, minPrize, maxPrize, format, region]);

  useEffect(() => {
    fetchTournaments();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchTournaments, 60000);
    return () => clearInterval(interval);
  }, [fetchTournaments]);

  const liveCt = tournaments.filter(t => t.status === 'live').length;
  const upcomingCt = tournaments.filter(t => t.status === 'upcoming').length;
  
  const getUpdateString = () => {
    const mins = Math.floor((new Date() - lastUpdated) / 60000);
    if (mins < 1) return 'Just now';
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="page" style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Back Button */}
      <div className="container">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="glass-card"
          style={{
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'var(--cyan)',
            fontFamily: 'Rajdhani',
            fontWeight: 800,
            fontSize: '0.9rem',
            border: '1px solid rgba(0,243,255,0.2)',
            cursor: 'pointer',
            marginBottom: 30,
            background: 'rgba(0,243,255,0.05)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,243,255,0.1)'; e.currentTarget.style.borderColor = 'var(--cyan)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,243,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,243,255,0.2)'; }}
        >
          <FaArrowLeft /> BACK
        </motion.button>
      </div>

      {/* Header */}
      <div style={{
        padding: '56px 0 36px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(123,47,255,0.12) 0%, transparent 70%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.35)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--purple)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Tournament Hub
          </div>
          <h1 className="section-title"><span className="gradient-text">All Tournaments</span></h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
            {liveCt > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: 'rgba(255,45,120,0.12)', border: '1px solid rgba(255,45,120,0.4)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', color: '#ff2d78' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff2d78', animation: 'live-pulse 1s ease-in-out infinite', display: 'inline-block' }} />
                {liveCt} LIVE NOW
              </div>
            )}
            {upcomingCt > 0 && (
              <div style={{ padding: '5px 12px', borderRadius: 100, background: 'rgba(0,243,255,0.08)', border: '1px solid rgba(0,243,255,0.25)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', color: 'var(--cyan)' }}>
                {upcomingCt} Upcoming
              </div>
            )}
            <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {tournaments.length} total tournaments found
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Last updated: {getUpdateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Filters */}
        <div className="shape-oval" style={{
          padding: '30px', marginBottom: 32,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Main Filter Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}><FaSearch /></span>
              <input
                type="text" placeholder="Search tournaments..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="form-input shape-pill"
                style={{ paddingLeft: 44, width: '100%' }}
              />
            </div>

            {/* Region Select */}
            <select className="form-select shape-pill" value={region} onChange={e => setRegion(e.target.value)}>
              <option value="all">All Regions</option>
              {['Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Telangana'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Format Select */}
            <select className="form-select shape-pill" value={format} onChange={e => setFormat(e.target.value)}>
               <option value="all">All Formats</option>
               <option value="SOLO">Solo (1v1)</option>
               <option value="DUO">Duo (2v2)</option>
               <option value="SQUAD">Squad (4v4)</option>
            </select>
          </div>

          {/* Prize Range Row */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
             <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem', color: 'var(--yellow)' }}>PRIZE RANGE (₹):</span>
             <input type="number" placeholder="Min" className="form-input shape-pill" style={{ width: 100, height: 38 }} value={minPrize} onChange={e => setMinPrize(e.target.value)} />
             <span style={{ color: 'var(--text-muted)' }}>—</span>
             <input type="number" placeholder="Max" className="form-input shape-pill" style={{ width: 100, height: 38 }} value={maxPrize} onChange={e => setMaxPrize(e.target.value)} />
             
             <button onClick={() => { setSearch(''); setMinPrize(''); setMaxPrize(''); setFormat('all'); setRegion('all'); setGame('all'); setStatus('all'); }} 
               className="btn btn-secondary shape-pill" style={{ height: 38, padding: '0 20px', fontSize: '0.8rem' }}>
               RESET FILTERS
             </button>
          </div>

          {/* Type Tabs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
             {STATUSES.map(s => (
               <button key={s} onClick={() => setStatus(s)} className="shape-pill" style={{
                 padding: '8px 20px',
                 fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem',
                 background: status === s ? 'var(--cyan)' : 'rgba(255,255,255,0.05)',
                 color: status === s ? '#000' : 'var(--text-muted)',
                 border: 'none', cursor: 'pointer', transition: '0.3s'
               }}>
                 {s.toUpperCase()}
               </button>
             ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
             {GAMES.map(g => (
               <button key={g} onClick={() => setGame(g)} className="shape-pill" style={{
                 padding: '8px 20px',
                 fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem',
                 background: game === g ? 'var(--purple)' : 'rgba(255,255,255,0.03)',
                 color: game === g ? '#fff' : 'var(--text-muted)',
                 border: 'none', cursor: 'pointer', transition: '0.3s'
               }}>
                 {g}
               </button>
             ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {loading ? (
            [1,2,3,4,5,6].map(i => <TournamentCard key={i} isSkeleton />)
          ) : tournaments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16, color: 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}><FaGamepad /></div>
              <h3 style={{ fontFamily: 'Orbitron', marginBottom: 8 }}>No tournaments found</h3>
              <p>Try different filters or check back soon!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tournaments.map(t => <TournamentCard key={t._id || t.id} t={t} />)}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
