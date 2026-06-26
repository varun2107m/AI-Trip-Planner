import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Plane, Sparkles, Search, MapPin, CalendarDays, Users, Wallet, Hotel, Utensils, Compass, Car, ShieldCheck, CreditCard, Bell, UserRound, Star, Clock3, CheckCircle2, Edit3, Trash2, Eye, X, Plus, Loader2, ChevronRight, Luggage, Heart, SlidersHorizontal, BadgePercent, Route, Sunrise, Moon, CloudSun, Ticket, MessageCircle, Download, ArrowRight } from 'lucide-react';
import './styles.css';

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const profiles = [
  { id: 'meera', name: 'Meera', type: 'Leisure', loyalty: 'Gold', passport: 'Verified', seat: 'Window' },
  { id: 'arjun', name: 'Arjun', type: 'Business', loyalty: 'Silver', passport: 'Pending', seat: 'Aisle' }
];

const destinations = {
  Goa: { country: 'India', mood: 'Beach, cafés and nightlife', weather: '31°C sunny', visa: 'Not required', score: 94, hero: 'Coastal escape', safety: 'Moderate crowding near beach belts', bestFor: ['Friends', 'Relaxation', 'Food'], base: 5200, flight: 7800, image: '🏖️', hotels: ['Aurelia Beach Resort', 'Baga Bay Boutique', 'Casa Palm Grove'], experiences: ['Sunset cruise', 'Old Goa heritage walk', 'Beach café trail', 'Fort Aguada', 'Spice plantation'] },
  Jaipur: { country: 'India', mood: 'Forts, bazaars and royal stays', weather: '34°C dry', visa: 'Not required', score: 91, hero: 'Royal city break', safety: 'Plan early starts due to afternoon heat', bestFor: ['Culture', 'Shopping', 'Food'], base: 4300, flight: 6400, image: '🏰', hotels: ['Amber View Haveli', 'Pink City Palace Stay', 'C-Scheme Smart Hotel'], experiences: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Johari Bazaar', 'Rajasthani dinner'] },
  Singapore: { country: 'Singapore', mood: 'Urban, clean and family friendly', weather: '29°C humid', visa: 'Check e-visa eligibility', score: 96, hero: 'Premium city holiday', safety: 'Low risk, high walkability', bestFor: ['Family', 'Shopping', 'Food'], base: 11200, flight: 23500, image: '🌆', hotels: ['Marina Central Hotel', 'Sentosa Family Resort', 'Orchard Smart Stay'], experiences: ['Gardens by the Bay', 'Sentosa', 'Universal Studios', 'Hawker food trail', 'Marina Bay light show'] },
  Dubai: { country: 'UAE', mood: 'Luxury, desert and shopping', weather: '38°C hot', visa: 'Visa required', score: 89, hero: 'Luxury short break', safety: 'Hydration and midday heat alerts', bestFor: ['Luxury', 'Shopping', 'Family'], base: 9800, flight: 18800, image: '🏙️', hotels: ['Marina Skyline Hotel', 'Downtown Executive Suites', 'Jumeirah Bay Resort'], experiences: ['Burj Khalifa', 'Desert safari', 'Dubai Mall', 'Marina walk', 'Museum of the Future'] },
  Bali: { country: 'Indonesia', mood: 'Wellness, beaches and temples', weather: '28°C chance of rain', visa: 'Visa on arrival', score: 92, hero: 'Island wellness retreat', safety: 'Check rain windows for outdoor tours', bestFor: ['Couple', 'Nature', 'Relaxation'], base: 7900, flight: 26800, image: '🌴', hotels: ['Ubud Jungle Villa', 'Seminyak Pool Resort', 'Kuta Beach Stay'], experiences: ['Rice terraces', 'Temple tour', 'Waterfall day trip', 'Balinese spa', 'Beach club sunset'] },
  Tokyo: { country: 'Japan', mood: 'Culture, tech and food', weather: '16°C cool', visa: 'Visa required', score: 95, hero: 'Culture and tech discovery', safety: 'Reserve restaurants and trains early', bestFor: ['Culture', 'Food', 'Tech'], base: 13500, flight: 45600, image: '🗼', hotels: ['Shinjuku Urban Hotel', 'Asakusa Ryokan Stay', 'Ginza Business Inn'], experiences: ['Shibuya Crossing', 'Asakusa Temple', 'Akihabara', 'Tsukiji food walk', 'Tokyo Skytree'] }
};

const interests = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Luxury', 'Family', 'Nightlife', 'Wellness'];
const addons = ['Airport pickup', 'Travel insurance', 'Local SIM', 'Fast-track tickets', 'Restaurant reservations'];

const blank = { from: 'Delhi', destination: '', startDate: '', endDate: '', adults: 2, children: 0, budget: 45000, pace: 'Balanced', profile: 'meera', interests: ['Food'], addons: [] };

function daysBetween(start, end) {
  if (!start || !end) return 0;
  return Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
}

function buildPlan(form) {
  const d = destinations[form.destination] || destinations.Goa;
  const days = Math.max(1, daysBetween(form.startDate, form.endDate));
  const people = Number(form.adults) + Number(form.children);
  const perPersonDaily = d.base;
  const stay = perPersonDaily * days * Math.max(1, form.adults);
  const flights = d.flight * people;
  const food = days * people * Math.round(d.base * 0.28);
  const transport = days * Math.round(d.base * 0.22);
  const activities = days * people * Math.round(d.base * 0.34);
  const addonsTotal = form.addons.length * 1800;
  // Intentional hidden issue: children are counted for flights but not for stay.
  const total = stay + flights + food + transport + activities + addonsTotal;
  const itinerary = Array.from({ length: Math.min(days, 10) }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? 'Arrival, check-in and neighbourhood orientation' : `${d.hero} — curated local route`,
    morning: i === 0 ? `Fly from ${form.from} and transfer to ${d.hotels[0]}` : d.experiences[i % d.experiences.length],
    afternoon: `${form.interests[i % form.interests.length] || 'Local'} focused experience with flexible buffer`,
    evening: i % 2 ? 'Dinner reservation and relaxed return' : 'Signature viewpoint, market walk and café stop',
    alert: i === 2 ? 'Reserve tickets early for this day.' : 'Optimised for low travel fatigue.'
  }));
  return {
    id: crypto.randomUUID(), ...form, days, people, country: d.country, mood: d.mood, weather: d.weather, visa: d.visa,
    match: d.score, hero: d.hero, image: d.image, safety: d.safety, hotels: d.hotels, experiences: d.experiences,
    flights: [`${form.from} → ${form.destination} Morning Saver`, `${form.from} → ${form.destination} Flexi Prime`, `${form.from} → ${form.destination} Red-eye Value`],
    budget: { stay, flights, food, transport, activities, addonsTotal, total }, itinerary,
    status: 'Draft', createdAt: new Date().toLocaleString(), confirmation: null
  };
}

function validate(form) {
  const errors = {};
  const days = daysBetween(form.startDate, form.endDate);
  if (!form.from.trim()) errors.from = 'Origin city is required.';
  if (!form.destination) errors.destination = 'Choose a destination.';
  if (form.from.trim() && form.destination && form.from.trim().toLowerCase() === form.destination.toLowerCase()) errors.destination = 'Destination cannot be the same as origin.';
  if (!form.startDate) errors.startDate = 'Select start date.';
  else if (form.startDate < new Date().toISOString().split('T')[0]) errors.startDate = 'Departure date cannot be in the past.';
  if (!form.endDate) errors.endDate = 'Select return date.';
  if (form.startDate && form.endDate && days <= 0) errors.endDate = 'Return date must be after departure date.';
  if (days > 14) errors.endDate = 'Trips longer than 14 days need concierge review.';
  if (Number(form.adults) < 1) errors.adults = 'At least one adult is required.';
  // Intentional hidden issue: maximum travellers rule is displayed in UI but not enforced here.
  if (Number(form.budget) < 10000) errors.budget = 'Minimum total budget should be ₹10,000.';
  if (!form.interests.length) errors.interests = 'Select at least one interest.';
  return errors;
}

/* --- Status Badge Component --- */
function StatusBadge({ status }) {
  const label = status || 'Draft';
  const cls = label.toLowerCase();
  return <span className={`statusBadge ${cls}`} data-testid={`status-badge-${cls}`}>{label}</span>;
}

function App() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [active, setActive] = useState('home');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('summary');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [promo, setPromo] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  const filtered = useMemo(() => saved.filter(t => `${t.destination} ${t.country} ${t.status}`.toLowerCase().includes(query.toLowerCase())), [saved, query]);
  const recommended = useMemo(() => Object.entries(destinations).sort((a,b) => b[1].score - a[1].score).slice(0,4), []);
  const stats = useMemo(() => ({
    trips: saved.length,
    confirmed: saved.filter(t => t.status === 'Confirmed').length,
    spend: saved.reduce((s,t) => s + t.budget.total, 0),
    favourite: saved[0]?.destination || 'Explore now'
  }), [saved]);

  /* --- Auto-dismiss toast after 4 seconds --- */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleList = (key, item) => update(key, form[key].includes(item) ? form[key].filter(x => x !== item) : [...form[key], item]);

  /* --- Navigate to a section and scroll into view --- */
  const contentRef = useRef(null);
  const navigateTo = useCallback((view) => {
    setActive(view);
    // Wait for React to render the section, then scroll to it
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }, []);

  const showToast = useCallback((msg) => {
    setToast('');
    // Small delay to re-trigger animation if a toast is already visible
    setTimeout(() => setToast(msg), 50);
  }, []);

  const generate = () => {
    const next = validate(form);
    setErrors(next);
    setToast('');
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      const result = buildPlan(form);
      setPlan(result);
      setTab('summary');
      setLoading(false);
      if (result.budget.total > Number(form.budget)) {
        showToast(`Plan ready. Note: estimated cost ${INR.format(result.budget.total)} exceeds your budget of ${INR.format(Number(form.budget))}.`);
      } else {
        showToast('Your smart travel plan is ready.');
      }
    }, 850);
  };

  const save = () => {
    if (!plan) return showToast('Create a plan first.');
    // Intentional hidden issue: same trip can be saved repeatedly without duplicate warning.
    setSaved(prev => [{ ...plan, status: 'Saved' }, ...prev]);
    showToast('Trip saved to My Trips.');
  };

  const confirm = () => {
    if (!plan) return showToast('Create a plan first.');
    let total = plan.budget.total;
    // Intentional hidden issue: expired promo code still applies discount.
    if (promo.trim().toUpperCase() === 'EARLYBIRD') total = Math.round(total * 0.9);
    const confirmed = { ...plan, status: 'Confirmed', payable: total, confirmation: `WM-${Date.now().toString().slice(-6)}` };
    setPlan(confirmed);
    setSaved(prev => {
      const withoutOld = prev.filter(t => t.id !== plan.id);
      return [confirmed, ...withoutOld];
    });
    setTab('checkout');
    showToast('Trip confirmed successfully.');
  };

  const editTrip = (trip) => {
    setForm({ from: trip.from, destination: trip.destination, startDate: trip.startDate, endDate: trip.endDate, adults: trip.adults, children: trip.children, budget: trip.budget.total, pace: trip.pace, profile: trip.profile, interests: trip.interests, addons: trip.addons });
    setPlan(trip);
    setActive('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeTrip = (id) => {
    if (!window.confirm('Are you sure you want to delete this trip? This cannot be undone.')) return;
    // Intentional hidden issue: detail panel remains open for deleted trip until manually closed.
    setSaved(prev => prev.filter(t => t.id !== id));
    showToast('Trip removed.');
  };

  const cancelTrip = (id) => {
    if (!window.confirm('Cancel this trip? You will not be able to undo this action.')) return;
    setSaved(prev => prev.map(t => t.id === id ? { ...t, status: 'Cancelled' } : t));
    showToast('Trip cancelled. Refund estimate will be visible shortly.');
  };

  return <main>
    <nav className="topbar" data-testid="navbar">
      <a className="brand" href="#home" data-testid="brand-link" onClick={(e) => { e.preventDefault(); setActive('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Plane/><span>WanderMind AI</span></a>
      <div className="navlinks">
        <button data-testid="nav-plan" className={active === 'planner' ? 'navActive' : ''} onClick={() => navigateTo('planner')}>Plan</button>
        <button data-testid="nav-trips" className={active === 'trips' ? 'navActive' : ''} onClick={() => navigateTo('trips')}>My Trips</button>
        <button data-testid="nav-insights" className={active === 'insights' ? 'navActive' : ''} onClick={() => navigateTo('insights')}>Insights</button>
        <button data-testid="nav-profile" onClick={() => setShowProfile(true)}><UserRound size={17}/>Profile</button>
      </div>
    </nav>

    {active === 'home' && <>
      <section id="home" className="hero" data-testid="hero-section">
        <div className="heroCopy"><span className="pill"><Sparkles size={16}/> AI travel workspace</span><h1>From idea to confirmed itinerary in minutes.</h1><p>Compare destinations, build day-wise plans, review stays, flights, budgets and travel readiness from one polished planning dashboard.</p><div className="heroActions"><button onClick={() => navigateTo('planner')} className="primary" data-testid="hero-start-planning">Start planning <ArrowRight size={17}/></button><button onClick={() => navigateTo('trips')} className="secondary" data-testid="hero-view-trips">View trips</button></div></div>
        <div className="heroCard" data-testid="hero-recommendations"><div className="cardTop"><span>Recommended now</span><BadgePercent/></div>{recommended.slice(0,3).map(([name,d]) => <button className="rec" key={name} data-testid={`rec-${name.toLowerCase()}`} onClick={() => {update('destination', name); navigateTo('planner')}}><span className="emoji">{d.image}</span><span><b>{name}</b><small>{d.mood}</small></span><strong>{d.score}%</strong></button>)}</div>
      </section>

      <section className="dashboard" data-testid="dashboard-stats">
        <article><Luggage/><span>Total trips</span><b data-testid="stat-total-trips">{stats.trips}</b></article>
        <article><CheckCircle2/><span>Confirmed</span><b data-testid="stat-confirmed">{stats.confirmed}</b></article>
        <article><Wallet/><span>Planned spend</span><b data-testid="stat-spend">{INR.format(stats.spend)}</b></article>
        <article><Heart/><span>Favourite</span><b data-testid="stat-favourite">{stats.favourite}</b></article>
      </section>
    </>}

    {toast && <div className="toast" data-testid="toast-notification" role="alert"><CheckCircle2 size={18}/>{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={16}/></button></div>}

    {active === 'planner' && <section id="planner" className="workspace" data-testid="planner-section" ref={contentRef}>
      <div className="plannerPanel glass">
        <div className="sectionTitle"><span><SlidersHorizontal/> Trip preferences</span><small>Traveller limit shown: 1–9 people</small></div>
        <div className="grid2">
          <label>From<input data-testid="input-from" value={form.from} onChange={e=>update('from', e.target.value)} placeholder="Delhi" />{errors.from && <small className="err">{errors.from}</small>}</label>
          <label>Destination<select data-testid="select-destination" value={form.destination} onChange={e=>update('destination', e.target.value)}><option value="">Select destination</option>{Object.keys(destinations).map(d=><option key={d}>{d}</option>)}</select>{errors.destination && <small className="err">{errors.destination}</small>}</label>
        </div>
        <div className="grid2">
          <label>Departure<input data-testid="input-departure" type="date" value={form.startDate} onChange={e=>update('startDate', e.target.value)} />{errors.startDate && <small className="err">{errors.startDate}</small>}</label>
          <label>Return<input data-testid="input-return" type="date" value={form.endDate} onChange={e=>update('endDate', e.target.value)} />{errors.endDate && <small className="err">{errors.endDate}</small>}</label>
        </div>
        <div className="grid3">
          <label>Adults<input data-testid="input-adults" type="number" min="1" max="9" value={form.adults} onChange={e=>update('adults', e.target.value)} />{errors.adults && <small className="err">{errors.adults}</small>}</label>
          <label>Children<input data-testid="input-children" type="number" min="0" max="8" value={form.children} onChange={e=>update('children', e.target.value)} /></label>
          <label>Total budget<input data-testid="input-budget" type="number" value={form.budget} onChange={e=>update('budget', e.target.value)} />{errors.budget && <small className="err">{errors.budget}</small>}</label>
        </div>
        <label>Travel profile<select data-testid="select-profile" value={form.profile} onChange={e=>update('profile', e.target.value)}>{profiles.map(p=><option key={p.id} value={p.id}>{p.name} • {p.type} • {p.loyalty}</option>)}</select></label>
        <div className="chips" data-testid="interests-group"><b>Interests</b>{interests.map(i=><button key={i} data-testid={`interest-${i.toLowerCase()}`} onClick={()=>toggleList('interests', i)} className={form.interests.includes(i)?'chip on':'chip'}>{i}</button>)}{errors.interests && <small className="err wide">{errors.interests}</small>}</div>
        <div className="chips" data-testid="addons-group"><b>Add-ons</b>{addons.map(i=><button key={i} data-testid={`addon-${i.toLowerCase().replace(/\s+/g, '-')}`} onClick={()=>toggleList('addons', i)} className={form.addons.includes(i)?'chip on':'chip'}>{i}</button>)}</div>
        <div className="actions"><button className="primary" data-testid="btn-generate" onClick={generate}>{loading ? <Loader2 className="spin"/> : <Sparkles/>} Generate plan</button><button className="secondary" data-testid="btn-reset" onClick={()=>{setForm(blank); setPlan(null); setErrors({})}}>Reset</button></div>
      </div>

      <div className="resultPanel glass" data-testid="result-panel">
        {!plan && !loading && <div className="empty"><CloudSun size={46}/><h3>Your itinerary will appear here</h3><p>Choose a destination and preferences to generate hotel, flight, route and budget suggestions.</p></div>}
        {loading && <div className="empty"><Loader2 className="spin big"/><h3>Designing your travel plan</h3><p>Analysing route comfort, budget range, traveller preferences and local experiences.</p></div>}
        {plan && !loading && <>
          <div className="planHero" data-testid="plan-hero"><div><span className="emoji bigEmoji">{plan.image}</span><h2 data-testid="plan-title">{plan.days}-day {plan.destination} itinerary</h2><p>{plan.mood} • {plan.weather} • {plan.visa}</p></div><div className="score"><b data-testid="plan-match-score">{plan.match}%</b><span>match</span></div></div>
          <div className="tabs" data-testid="plan-tabs">{['summary','itinerary','options','checkout'].map(t=><button key={t} data-testid={`tab-${t}`} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
          {tab==='summary' && <div className="summary" data-testid="tab-summary-content"><article><Route/><b>{plan.hero}</b><span>{plan.safety}</span></article><article><Users/><b>{plan.people} travellers</b><span>{plan.pace} pace</span></article><article><Wallet/><b data-testid="summary-total">{INR.format(plan.budget.total)}</b><span>Estimated payable</span></article></div>}
          {tab==='itinerary' && <div className="itinerary" data-testid="tab-itinerary-content">{plan.itinerary.map(day=><article key={day.day} data-testid={`itinerary-day-${day.day}`}><div className="dayNo">Day {day.day}</div><h4>{day.title}</h4><p><Sunrise/> {day.morning}</p><p><Compass/> {day.afternoon}</p><p><Moon/> {day.evening}</p><small>{day.alert}</small></article>)}</div>}
          {tab==='options' && <div className="options" data-testid="tab-options-content"><div><h3><Hotel/> Hotels</h3>{plan.hotels.map(h=><p key={h}><Star size={15}/> {h}</p>)}</div><div><h3><Plane/> Flights</h3>{plan.flights.map(f=><p key={f}><Clock3 size={15}/> {f}</p>)}</div><div><h3><Ticket/> Experiences</h3>{plan.experiences.slice(0,4).map(e=><p key={e}><Compass size={15}/> {e}</p>)}</div></div>}
          {tab==='checkout' && <div className="checkout" data-testid="tab-checkout-content"><h3><CreditCard/> Booking summary</h3>{Object.entries(plan.budget).filter(([k])=>k!=='total').map(([k,v])=><div className="line" key={k} data-testid={`checkout-line-${k}`}><span>{k}</span><b>{INR.format(v)}</b></div>)}<label>Promo code<input data-testid="input-promo" value={promo} onChange={e=>setPromo(e.target.value)} placeholder="Enter code" /></label><div className="pay" data-testid="checkout-total"><span>Total</span><b>{INR.format(plan.payable || plan.budget.total)}</b></div>{plan.confirmation && <div className="confirm" data-testid="confirmation-id"><BadgePercent/> Confirmation: {plan.confirmation}</div>}</div>}
          <div className="actions">
            <button className="primary" data-testid="btn-save" onClick={save}><Plus/> Save trip</button>
            <button className="secondary" data-testid="btn-confirm" onClick={confirm}><ShieldCheck/> Confirm itinerary</button>
            <button className="secondary" data-testid="btn-download" aria-label="Download itinerary"><Download/> Download</button>
          </div>
        </>}
      </div>
    </section>}

    {active === 'trips' && <section className="myTrips glass" data-testid="my-trips-section" ref={contentRef}>
      <div className="sectionTitle"><span><Luggage/> My Trips</span><label className="search"><Search size={16}/><input data-testid="input-search-trips" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search destination or status" /></label></div>
      {!filtered.length && <div className="empty slim"><MapPin/><h3>No trips found</h3><p>Saved and confirmed itineraries will be available here.</p></div>}
      <div className="tripGrid" data-testid="trip-grid">{filtered.map(t=><article className="tripCard" key={t.id} data-testid={`trip-card-${t.id}`}>
        <span className="emoji">{t.image}</span>
        <h3>{t.destination}</h3>
        <p>{t.days} days • {t.people} travellers • <StatusBadge status={t.status} /></p>
        <b>{INR.format(t.payable || t.budget.total)}</b>
        <div>
          <button data-testid={`btn-view-${t.id}`} onClick={()=>setSelected(t)}><Eye size={15}/>View</button>
          <button data-testid={`btn-edit-${t.id}`} onClick={()=>editTrip(t)}><Edit3 size={15}/>Edit</button>
          <button data-testid={`btn-cancel-${t.id}`} onClick={()=>cancelTrip(t.id)} disabled={t.status === 'Cancelled'}>Cancel</button>
          <button data-testid={`btn-delete-${t.id}`} onClick={()=>removeTrip(t.id)} aria-label={`Delete ${t.destination} trip`}><Trash2 size={15}/>Delete</button>
        </div>
      </article>)}</div>
    </section>}

    {active === 'insights' && <section className="insights" data-testid="insights-section" ref={contentRef}><div className="sectionTitle"><span><Bell/> Travel Insights</span><small>Live-style intelligence for smarter planning</small></div><div className="insightGrid">{Object.entries(destinations).map(([name,d])=><article key={name} data-testid={`insight-${name.toLowerCase()}`}><span className="emoji">{d.image}</span><h3>{name}</h3><p>{d.mood}</p><div className="meter"><i style={{width: `${d.score}%`}} /></div><small>{d.safety}</small></article>)}</div></section>}

    {selected && <div className="modal" data-testid="trip-detail-modal"><div className="modalBox"><button className="close" data-testid="btn-close-modal" onClick={()=>setSelected(null)} aria-label="Close trip details"><X/></button><h2>{selected.destination} trip details</h2><p>{selected.days} days • <StatusBadge status={selected.status} /> • {selected.confirmation || 'Not confirmed'}</p><div className="summary"><article><CalendarDays/><b data-testid="modal-departure">{selected.startDate}</b><span>Departure</span></article><article><Wallet/><b data-testid="modal-total">{INR.format(selected.payable || selected.budget.total)}</b><span>Total</span></article><article><Hotel/><b data-testid="modal-hotel">{selected.hotels[0]}</b><span>Suggested stay</span></article></div></div></div>}

    {showProfile && <div className="modal" data-testid="profile-modal"><div className="modalBox"><button className="close" data-testid="btn-close-profile" onClick={()=>setShowProfile(false)} aria-label="Close profile"><X/></button><h2>Traveller profile</h2>{profiles.map(p=><article className="profile" key={p.id} data-testid={`profile-${p.id}`}><UserRound/><div><b>{p.name}</b><p>{p.type} traveller • {p.loyalty} member • Passport {p.passport}</p></div></article>)}<button className="primary" data-testid="btn-chat-concierge" onClick={() => { setShowProfile(false); showToast('Concierge chat is coming soon. Use email support for now.'); }}><MessageCircle/> Chat with concierge</button></div></div>}

    <footer data-testid="footer"><b>WanderMind AI</b><span>Personalised travel planning, trip management and booking readiness.</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
