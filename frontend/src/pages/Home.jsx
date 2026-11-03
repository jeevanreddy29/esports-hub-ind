import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { tournamentAPI } from '../services/api';
import Skeleton from '../components/common/Skeleton';
import CountdownTimer from '../components/CountdownTimer';
import logo from '../assets/logo_final.png';
import { GameIcon } from '../utils/gameLogos';
import { FaEnvelope, FaPhone, FaTrophy, FaUsers, FaGamepad, FaMapMarkedAlt, FaUserCircle, FaSearch, FaCrosshairs, FaMedal, FaArrowRight } from 'react-icons/fa';

/* ─────────────── DATA ─────────────── */
const GAMES = [
  { name: 'Valorant', color: '#FF4655', players: '8K+', tournaments: 24 },
  { name: 'BGMI', color: '#FF6B35', players: '12K+', tournaments: 38 },
  { name: 'MLBB', color: '#06B6D4', players: '6K+', tournaments: 20 },
  { name: 'Free Fire Max', color: '#FF9500', players: '15K+', tournaments: 42 },
  { name: 'Pokemon Unite', color: '#8B5CF6', players: '2K+', tournaments: 9 },
  { name: 'Minecraft', color: '#10B981', players: '18K+', tournaments: 10 },
  { name: 'CS2', color: '#F59E0B', players: '5K+', tournaments: 16 },
  { name: 'Call of Duty Mobile', color: '#10B981', players: '9K+', tournaments: 28 },
  { name: 'Tekken 8', color: '#EC4899', players: '3K+', tournaments: 12 },
  { name: 'Clash Royale', color: '#3B82F6', players: '4K+', tournaments: 14 },
  { name: 'FC Mobile', color: '#2563EB', players: '1.5K+', tournaments: 5 },
];

const STATS = [
  { value: '50K+', label: 'Players', color: '#00f3ff', icon: <FaUsers /> },
  { value: '₹5Cr+', label: 'Total Prizes', color: '#ffd60a', icon: <FaTrophy /> },
  { value: '200+', label: 'Tournaments', color: '#7b2fff', icon: <FaGamepad /> },
  { value: '28', label: 'States', color: '#00ff88', icon: <FaMapMarkedAlt /> },
];

const TICKER_ITEMS = [
  'LIVE — Battlegrounds Mobile India Pro Series (BMPS) 2026 — ₹2 Cr Prize Pool',
  'COMPLETED — FFMIC 2026 Spring — Congratulations to Team Hind!',
  'UPCOMING — Free Fire MAX India Cup (FFMIC) Fall — Starting August 15',
  'UPCOMING — VALORANT Challengers South Asia Split 2 — Qualifiers in June',
  'LIVE — Skyesports Free Fire Max Grand Prix — Intense competition in Group Stages',
  'UPCOMING — ESL India CS2 Pro League S1 — Register now on official portal',
  'LEADERBOARD — GodL_Jonathan leads BGMI rankings with 15k+ points',
  'NEWS — Team Hind dominates FFMIC Spring Grand Finals in Ahmedabad',
];

const NEWS = [
  {
    id: 1,
    title: 'NODWIN Gaming Announces Masters Series Season 3',
    date: 'April 20, 2026',
    source: 'Esports Insider',
    category: 'Tournament',
    color: '#FF6B35',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80\u0026w=500',
  },
  {
    id: 2,
    title: 'India Wins Big at International Valorant Invitationals',
    date: 'April 18, 2026',
    source: 'AFK Gaming',
    category: 'News',
    color: '#FF4655',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80\u0026w=500',
  },
  {
    id: 3,
    title: 'Top 5 BGMI Strategies for the Upcoming Pro League',
    date: 'April 15, 2026',
    source: 'TalkEsport',
    category: 'Guide',
    color: '#00F3FF',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80\u0026w=500',
  },
];

// Removed GAME_ICONS object

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <FaUserCircle size={28} />,
    title: 'Create Your Profile',
    desc: 'Sign up in 60 seconds. Pick your games, set your state, and build your player card. Your esports identity starts here.',
    color: 'var(--cyan)',
  },
  {
    step: '02',
    icon: <FaSearch size={28} />,
    title: 'Discover Tournaments',
    desc: 'Browse 200+ live and upcoming tournaments filtered by game, prize pool, format, and region — all in one place.',
    color: 'var(--purple)',
  },
  {
    step: '03',
    icon: <FaCrosshairs size={28} />,
    title: 'Register & Compete',
    desc: 'Secure your slot instantly. Get countdown timers, real-time slot tracking, and AI match tips from NeuroGamer.',
    color: 'var(--pink)',
  },
  {
    step: '04',
    icon: <FaTrophy size={28} />,
    title: 'Win & Rise the Ranks',
    desc: 'Earn points, climb the all-India leaderboard, collect prize money, and earn recognition across 28 states.',
    color: '#ffd60a',
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun "Scout_GG" Singh',
    state: 'Punjab',
    game: 'BGMI',
    initial: 'A',
    color: '#FF6B35',
    quote: 'Won my first ₹1 Lakh prize through India Esports Hub. The tournament discovery feature is insane — I found 3 back-to-back tournaments in my city!',
    wins: 12,
    rank: '#1 BGMI India',
  },
  {
    name: 'Priya "StarViper" Nair',
    state: 'Kerala',
    game: 'Valorant',
    initial: 'P',
    color: '#FF4655',
    quote: 'As a female player in India, I finally found a platform that takes competitive gaming seriously. The community here is top tier.',
    wins: 7,
    rank: '#3 Valorant India',
  },
  {
    name: 'Rohan "Phantom" Mehta',
    state: 'Maharashtra',
    game: 'CS2',
    initial: 'R',
    color: '#F59E0B',
    quote: 'NeuroGamer AI gave me a clutch strat before my semi-final. We won the match. This platform is literally changing how we prep for tournaments.',
    wins: 9,
    rank: '#2 CS2 India',
  },
];

const STREAMERS = [
  { name: 'Mortal', game: 'BGMI', followers: '7.2M', platform: 'YouTube', color: '#FF6B35', handle: '@mortal' },
  { name: 'Jonathan Gaming', game: 'BGMI', followers: '10.5M', platform: 'YouTube', color: '#FF9500', handle: '@jonathan' },
  { name: 'GodLike Sc0utOP', game: 'BGMI/IND Team', followers: '5.1M', platform: 'YouTube', color: '#ffd60a', handle: '@sc0utop' },
  { name: 'Alpha Clasher', game: 'Free Fire Max', followers: '9.3M', platform: 'YouTube', color: '#10B981', handle: '@alphaclasher' },
  { name: 'Snax', game: 'Valorant India', followers: '1.8M', platform: 'Twitch', color: '#FF4655', handle: '@snaxval' },
  { name: 'Regaltos', game: 'BGMI', followers: '3.4M', platform: 'YouTube', color: '#8B5CF6', handle: '@regaltos' },
];



const TOP_CLANS = [
  { name: 'GodLike Esports', tag: 'GLE', game: 'BGMI', wins: 47, color: '#ffd60a' },
  { name: 'Team SouLs', tag: 'TMSL', game: 'BGMI/CODM', wins: 38, color: '#FF4655' },
  { name: 'Enigma Gaming', tag: 'ENM', game: 'Valorant', wins: 29, color: '#8B5CF6' },
  { name: 'S8UL Esports', tag: 'S8UL', game: 'Multi-title', wins: 52, color: '#FF6B35' },
  { name: 'Team Mayavi', tag: 'MYVI', game: 'Free Fire', wins: 33, color: '#10B981' },
];

/* ─────────────── TOURNAMENT CARD (OPTION A: FACEIT STYLE) ─────────────── */
function TournamentCard({ t, isSkeleton }) {
  if (isSkeleton) {
    return (
      <div className="glass-card" style={{ padding: 20 }}>
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
            {t.game} • {t.organizer || 'Official Circuit'}
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
            {t.status === 'live' ? 'Enter Match Arena' : 'View Tournament Details →'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [liveT, setLiveT] = useState([]);
  const [upcomingT, setUpcomingT] = useState([]);
  const [counter, setCounter] = useState({ players: 0, prize: 0, tournaments: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          tournamentAPI.getAll({ status: 'live' }),
          tournamentAPI.getAll({ status: 'upcoming' })
        ]);
        setLiveT(liveRes.data?.tournaments || []);
        setUpcomingT((upcomingRes.data?.tournaments || []).slice(0, 3));
      } catch (err) {
        console.error('API error, using empty state:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Count-up animation
    const targets = { players: 50000, prize: 200, tournaments: 200 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounter({
        players: Math.round(targets.players * ease),
        prize: Math.round(targets.prize * ease),
        tournaments: Math.round(targets.tournaments * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    // Auto-rotate testimonials
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => { clearInterval(timer); clearInterval(testimonialTimer); };
  }, []);

  return (
    <div>
      {/* ── TICKER ── */}
      <div style={{ paddingTop: 72 }}>
        <div className="ticker-wrap">
          <div className="ticker-content">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="ticker-item">
                <span className="dot" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="grid-2" style={{ gap: 60, alignItems: 'center' }}>
            <div className="hero-content">
              <div className="hero-tag anim-fade-up delay-100" style={{ background: 'rgba(0,243,255,0.08)', borderColor: 'rgba(0,243,255,0.2)', color: 'var(--cyan)' }}>
                <span className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', animation: 'live-pulse 1.5s infinite' }} />
                India's #1 Competitive Gaming Platform
              </div>
              <h1 className="hero-title anim-fade-up delay-200" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
                Track Every Game. <br />
                <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple), var(--pink))', WebkitBackgroundClip: 'text' }}>Follow Every Tournament.</span>
              </h1>
              <p className="hero-description anim-fade-up delay-300">
                Discover <strong>200+</strong> live tournaments across <strong>9 titles</strong>. Compete for <strong>₹2 Crore+</strong> prize pools. Powered by AI match prep from <strong>NeuroGamer</strong>.
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }} className="anim-fade-up delay-400 hero-btns">
                <Link to="/tournaments" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, var(--cyan), var(--purple))' }}>
                  Explore Tournaments →
                </Link>
                <Link to="/leaderboard" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(0,243,255,0.3)', color: 'var(--cyan)' }}>
                  View Leaderboard
                </Link>
              </div>
              <div className="hero-stats anim-fade-up delay-500" style={{ display: 'flex', gap: 16, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                {STATS.map(s => (
                  <div key={s.label} className="hero-stat shape-pill" style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, rgba(13,13,35,0.8), ${s.color}15)`,
                    border: `1px solid ${s.color}33`,
                    display: 'flex', alignItems: 'center', gap: 12,
                    boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 15px ${s.color}15`,
                    backdropFilter: 'blur(12px)',
                    transition: 'var(--transition)'
                  }}>
                    <div style={{ fontSize: '1.2rem', color: s.color, display: 'flex' }}>{s.icon}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div className="hero-stat-value" style={{ color: s.color, fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Rajdhani', marginBottom: 0 }}>
                        {s.label === 'Players' ? `${(counter.players / 1000).toFixed(0)}K+`
                          : s.label === 'Prize Pool' ? `₹${counter.prize}L+`
                            : s.label === 'Tournaments' ? `${counter.tournaments}+`
                              : s.value}
                      </div>
                      <div className="hero-stat-label" style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual: Option A Faceit Spotlight Card */}
            <div className="anim-slide-right delay-300 hero-visual-container" style={{ width: '100%', maxWidth: 440, margin: '0 auto' }}>
              <div className="glass-card" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--gold-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 166, 35, 0.15)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'live-pulse 1s infinite' }} />
                    <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.8rem', color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      FEATURED TOURNAMENT
                    </span>
                  </div>
                  <span style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--gold-border)', padding: '2px 8px', borderRadius: 4, fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.75rem' }}>
                    TIER 1 PRO
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.35rem', color: '#fff', marginBottom: 8 }}>
                  BMPS 2026 Pro Series
                </h3>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  KRAFTON Official • 64 Elite Invited Squads
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase' }}>Prize Pool</div>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', color: 'var(--gold)' }}>₹2,00,00,000</div>
                  </div>
                  <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700, textTransform: 'uppercase' }}>Region</div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>All India Finals</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: Group Stages Live</span>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem', color: '#10b981' }}>64 / 64 Teams</span>
                </div>

                <Link to="/tournaments" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Explore All Competitions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GAMES SECTION ── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up"><span className="gradient-text">Featured Games</span></h2>
          <p className="section-subtitle anim-fade-up delay-100">
            More games available — from battle royale to fighting games
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 24 }}>
            {GAMES.map((g, i) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/tournaments?game=${g.name}`}
                  className="game-card"
                  style={{
                    '--game-color': g.color, padding: '28px 16px', textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', transition: 'all 0.4s ease', display: 'block',
                  }}
                >
                  <div className="shape-hex" style={{
                    width: 76, height: 76, background: `${g.color}15`,
                    border: `1px solid ${g.color}44`, margin: '0 auto 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${g.color}20`,
                  }}>
                    <GameIcon game={g.name} size={42} />
                  </div>
                  <div className="game-name" style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>{g.name}</div>
                  <div style={{ color: g.color, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                    {g.players} players
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 600 }}>
                    {g.tournaments} tournaments
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: GAMES.length * 0.05 }}
            >
              <div
                className="game-card"
                style={{
                  '--game-color': '#FFFFFF', padding: '28px 16px', textAlign: 'center',
                  background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.2)',
                  position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200,
                  opacity: 0.7
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.5, fontFamily: 'Orbitron', fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>+</div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>MORE GAMES</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Coming Soon
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVE TOURNAMENTS ── */}
      {liveT.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <h2 className="section-title"><span className="gradient-text">Live Tournaments</span></h2>
              <span className="badge badge-live">LIVE</span>
            </div>
            <p className="section-subtitle">Happening right now — jump in before slots close!</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {liveT.map(t => <TournamentCard key={t.id} t={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING TOURNAMENTS ── */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.03)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 className="section-title"><span className="gradient-text">Upcoming Tournaments</span></h2>
            <Link to="/tournaments" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          <p className="section-subtitle">Register now before slots fill up — countdowns are ticking.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {isLoading
              ? [1, 2, 3].map(i => <TournamentCard key={i} isSkeleton />)
              : upcomingT.map(t => <TournamentCard key={t._id || t.id} t={t} />)
            }
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'rgba(0,243,255,0.02)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up" style={{ textAlign: 'center' }}>
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="section-subtitle anim-fade-up delay-100" style={{ textAlign: 'center' }}>
            From signup to champion — your esports journey in 4 steps
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, position: 'relative' }}>
            {/* connector line */}
            <div style={{
              position: 'absolute', top: 48, left: '12.5%', right: '12.5%', height: 2,
              background: 'linear-gradient(90deg, var(--cyan), var(--purple), var(--pink), #ffd60a)',
              opacity: 0.2, borderRadius: 100,
              display: 'none', // shown via media query would need CSS, skip for simplicity
            }} />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="glass-card shape-oval" style={{ padding: '36px 28px', textAlign: 'center', height: '100%' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                    background: `${step.color}15`, border: `2px solid ${step.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.color, boxShadow: `0 0 24px ${step.color}20`,
                    position: 'relative',
                  }}>
                    {step.icon}
                    <div style={{
                      position: 'absolute', top: -10, right: -10,
                      width: 28, height: 28, borderRadius: '50%',
                      background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Orbitron', fontWeight: 900, fontSize: '0.65rem', color: '#000',
                    }}>{step.step}</div>
                  </div>
                  <h3 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1rem', marginBottom: 12, color: step.color }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STREAMERS / PROS ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title anim-fade-up"><span className="gradient-text">Indian Esports Icons</span></h2>
          <p className="section-subtitle anim-fade-up delay-100">
            The pros who made Indian gaming go global — follow their journey and compete in their leagues
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {STREAMERS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className="glass-card" style={{
                  padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
                  border: `1px solid ${s.color}22`, borderRadius: 20,
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
                    background: `${s.color}15`, border: `2px solid ${s.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', color: '#fff',
                    boxShadow: `0 0 20px ${s.color}20`,
                  }}>{s.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.95rem', color: s.color, marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{s.game}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{s.followers}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>followers</span>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: '0.65rem',
                        fontFamily: 'Rajdhani', fontWeight: 700,
                        background: s.platform === 'YouTube' ? 'rgba(255,0,0,0.12)' : 'rgba(145,71,255,0.12)',
                        color: s.platform === 'YouTube' ? '#ff4444' : '#9147ff',
                        border: `1px solid ${s.platform === 'YouTube' ? 'rgba(255,0,0,0.25)' : 'rgba(145,71,255,0.25)'}`,
                      }}>{s.platform}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/leaderboard" className="btn btn-secondary">
              See Full Leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLAYER TESTIMONIALS ── */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.04)' }}>
        <div className="container">
          <h2 className="section-title anim-fade-up" style={{ textAlign: 'center' }}>
            <span className="gradient-text">Players Speak</span>
          </h2>
          <p className="section-subtitle anim-fade-up delay-100" style={{ textAlign: 'center' }}>
            Real stories from India's competitive gaming arena
          </p>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map((t, i) =>
                i === activeTestimonial ? (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="glass-card shape-oval" style={{ padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', top: -60, right: -60,
                        width: 200, height: 200, borderRadius: '50%',
                        background: `radial-gradient(circle, ${t.color}20, transparent 70%)`,
                        pointerEvents: 'none',
                      }} />
                      <div style={{ fontSize: '3rem', marginBottom: 20, opacity: 0.3, fontFamily: 'serif', lineHeight: 1 }}>"</div>
                      <p style={{ fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: 32, fontStyle: 'italic' }}>
                        {t.quote}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                          background: `${t.color}20`, border: `2px solid ${t.color}50`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', color: '#fff',
                        }}>{t.initial}</div>
                        <div>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '0.95rem', color: t.color }}>{t.name}</div>
                          <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.state} · {t.rank}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', color: '#ffd60a' }}>{t.wins}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>WINS</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? 28 : 8, height: 8, borderRadius: 100,
                    background: i === activeTestimonial ? 'var(--cyan)' : 'rgba(255,255,255,0.2)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ── NEWS SECTION ── */}
      <section className="section" style={{ background: 'rgba(5,5,16,0.6)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <h2 className="section-title"><span className="gradient-text">Latest in Arena</span></h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Fresh news, guides, and tournament updates</p>
            </div>
            <Link to="/community" className="btn btn-secondary btn-sm">Read More News</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {NEWS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="glass-card" style={{ height: '100%', overflow: 'hidden', padding: 0 }}>
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,16,0.9), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 16, padding: '4px 12px', borderRadius: 4, background: item.color, color: '#000', fontSize: '0.65rem', fontFamily: 'Orbitron', fontWeight: 900, textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.source}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Orbitron', fontWeight: 800, fontSize: '1.1rem', color: '#fff', lineHeight: 1.5, marginBottom: 20 }}>{item.title}</h3>
                    <Link to="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--cyan)', textDecoration: 'none', fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                      READ FULL ARTICLE <FaArrowRight style={{ fontSize: '0.7rem' }} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section" style={{ background: 'rgba(123,47,255,0.03)' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(0,243,255,0.08))',
            borderColor: 'rgba(0,243,255,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(123,47,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '2.5rem', marginBottom: 16, color: 'var(--cyan)', opacity: 0.7 }} className="anim-float"><FaTrophy /></div>
            <h2 className="section-title anim-fade-up" style={{ marginBottom: 16 }}>
              Ready to <span className="gradient-text">Compete?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.85, fontSize: '1.05rem' }}>
              Join <strong>50,000+ gamers</strong> already competing. Register for tournaments, win prizes up to <strong>₹5 Lakhs</strong>, climb the leaderboard, and make your mark in esports history!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Create Account</Link>
              <Link to="/tournaments" className="btn btn-secondary btn-lg">Browse Tournaments</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,16,0.9)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 32px' }}>
          {/* Top grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 1' }}>
              <img src={logo} alt="India Esports Hub" style={{ height: 48, marginBottom: 16, filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.3))' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 20 }}>
                Premier esports platform connecting players, tournaments, and communities.
              </p>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: <FaEnvelope />, color: '#ea4335', label: 'Gmail', href: 'mailto:esportshubindia@gmail.com' },
                  { icon: <FaPhone />, color: '#00F3FF', label: 'Phone', href: 'tel:+919876543210' },
                ].map(s => (
                  <a key={s.label} href={s.href} title={s.label} style={{
                    width: 38, height: 38, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    transition: 'all 0.3s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${s.color}25`; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = s.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Platform</div>
              {[
                { label: 'Tournaments', to: '/tournaments' },
                { label: 'Leaderboard', to: '/leaderboard' },
                { label: 'My Profile', to: '/profile' },
                { label: 'Sign Up Free', to: '/signup' },
                { label: 'Login', to: '/login' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 10,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{l.label}</Link>
              ))}
            </div>

            {/* Games */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: 'var(--purple)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Explore More Games</div>
              {GAMES.slice(0, 6).map(g => (
                <Link key={g.name} to={`/tournaments?game=${g.name}`} style={{
                  display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem',
                  fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 10,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = g.color}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{g.name}</Link>
              ))}
            </div>

            {/* Contact Us */}
            <div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: '0.8rem', color: 'var(--pink)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Contact Us</div>
              {[
                { label: 'esportshubindia@gmail.com', icon: <FaEnvelope />, href: 'mailto:esportshubindia@gmail.com' },
                { label: '+91 98765 43210', icon: <FaPhone />, href: 'tel:+919876543210' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '0.9rem',
                  fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 12,
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--pink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <span style={{ fontSize: '1.1rem' }}>{l.icon}</span>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,243,255,0.15), rgba(123,47,255,0.15), transparent)', marginBottom: 28 }} />

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Rajdhani', fontWeight: 600 }}>
              © {new Date().getFullYear()} India Esports Hub · All Rights Reserved
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              Proudly built in India · For Indian gamers, by Indian gamers
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                { label: 'About', to: '/about' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Contact Us', to: '/contact' }
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'Rajdhani', fontWeight: 600, transition: 'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
