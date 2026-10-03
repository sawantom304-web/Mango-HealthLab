import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, ArrowRight, Bell, CalendarDays, Check, Clock3, Download, FileText, 
  FlaskConical, HeartPulse, Home, LogIn, MapPin, Menu, Search, ShieldCheck, 
  Sparkles, TestTube2, UserRound, X, HelpCircle, Heart, Droplet, Dna, 
  Stethoscope, CheckCircle2, PhoneCall, ChevronRight, ShoppingCart, Filter,
  ChevronDown, SlidersHorizontal, Trash2, Tag, ChevronUp
} from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:4000/api');

const categories = ['All Tests', 'Full Body', 'Diabetes', 'Heart', 'Thyroid', 'Vitamins', 'Kidney', 'Liver', 'Men\'s Health', 'Women\'s Health'];

const starterTests = [
  { 
    _id: 'demo-full', 
    name: 'Full Body Checkup - Essential', 
    category: 'Full Body', 
    description: 'Comprehensive preventive health panel covering blood sugar, cholesterol, liver, kidney and thyroid markers.', 
    price: 1599, 
    originalPrice: 4999,
    discountText: '68% OFF',
    parametersCount: 62,
    parameterGroups: [
      { name: 'Complete Blood Health', count: 24, items: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count', 'PCV', 'MCV', 'MCH', 'MCHC'] },
      { name: 'Lipid & Heart Profile', count: 8, items: ['Total Cholesterol', 'HDL Good Cholesterol', 'LDL Bad Cholesterol', 'Triglycerides', 'VLDL'] },
      { name: 'Liver Function Panel', count: 11, items: ['SGOT (AST)', 'SGPT (ALT)', 'Bilirubin Total', 'Bilirubin Direct', 'Alkaline Phosphatase', 'Total Protein'] },
      { name: 'Kidney Function Panel', count: 10, items: ['Serum Creatinine', 'Blood Urea Nitrogen', 'Uric Acid', 'eGFR', 'BUN/Creatinine Ratio'] },
      { name: 'Thyroid & Diabetes Screening', count: 9, items: ['Fasting Blood Sugar', 'HbA1c', 'TSH (Thyroid Stimulating Hormone)'] }
    ],
    preparation: '8-10 hours overnight fasting required', 
    sampleType: 'Blood + Urine', 
    turnaroundHours: 12, 
    popular: true 
  },
  { 
    _id: 'demo-cbc', 
    name: 'CBC (Complete Blood Count)', 
    category: 'Full Body', 
    description: 'Checks key blood health markers including hemoglobin, red blood cells, white blood cells, and infection markers.', 
    price: 399, 
    originalPrice: 999,
    discountText: '60% OFF',
    parametersCount: 24,
    parameterGroups: [
      { name: 'Complete Blood Parameters', count: 24, items: ['Hemoglobin', 'RBC', 'WBC', 'Platelet Count', 'DLC', 'Absolute Neutrophil Count'] }
    ],
    preparation: 'No special preparation needed', 
    sampleType: 'Blood', 
    turnaroundHours: 6, 
    popular: true 
  },
  { 
    _id: 'demo-diabetes', 
    name: 'Diabetes Check (HbA1c + Sugar)', 
    category: 'Diabetes', 
    description: 'Understands your average blood sugar over the last 3 months along with current fasting glucose.', 
    price: 499, 
    originalPrice: 1200,
    discountText: '58% OFF',
    parametersCount: 3,
    parameterGroups: [
      { name: 'Diabetes Markers', count: 3, items: ['HbA1c (Glycosylated Hemoglobin)', 'Average Blood Glucose (eAG)', 'Fasting Blood Sugar'] }
    ],
    preparation: '8 hours fasting required for fasting sugar', 
    sampleType: 'Blood', 
    turnaroundHours: 6, 
    popular: true 
  },
  { 
    _id: 'demo-thyroid', 
    name: 'Thyroid Profile (T3, T4, TSH)', 
    category: 'Thyroid', 
    description: 'Screens essential thyroid hormones to evaluate metabolism, energy levels, and hormonal balance.', 
    price: 599, 
    originalPrice: 1499,
    discountText: '60% OFF',
    parametersCount: 3,
    parameterGroups: [
      { name: 'Thyroid Hormone Panel', count: 3, items: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'] }
    ],
    preparation: 'No special preparation needed', 
    sampleType: 'Blood', 
    turnaroundHours: 8, 
    popular: true 
  },
  { 
    _id: 'demo-vitd', 
    name: 'Vitamin D & B12 Panel', 
    category: 'Vitamins', 
    description: 'Evaluates vitamin D and B12 deficiency levels crucial for bone strength, nerve health, and immunity.', 
    price: 999, 
    originalPrice: 2499,
    discountText: '60% OFF',
    parametersCount: 2,
    parameterGroups: [
      { name: 'Essential Vitamin Panel', count: 2, items: ['Vitamin D 25-Hydroxy', 'Vitamin B12 (Cyanocobalamin)'] }
    ],
    preparation: 'No special preparation needed', 
    sampleType: 'Blood', 
    turnaroundHours: 24, 
    popular: true 
  },
  { 
    _id: 'demo-lipid', 
    name: 'Heart & Lipid Profile', 
    category: 'Heart', 
    description: 'Measures total cholesterol, good HDL, bad LDL, and triglycerides to assess cardiovascular risk.', 
    price: 699, 
    originalPrice: 1800,
    discountText: '61% OFF',
    parametersCount: 8,
    parameterGroups: [
      { name: 'Lipid Risk Panel', count: 8, items: ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL Cholesterol', 'Cholesterol/HDL Ratio'] }
    ],
    preparation: '10-12 hours overnight fasting required', 
    sampleType: 'Blood', 
    turnaroundHours: 8 
  },
  { 
    _id: 'demo-liver', 
    name: 'Liver Function Panel', 
    category: 'Liver', 
    description: 'Evaluates liver enzymes, proteins, and bilirubin markers to check liver tissue health and function.', 
    price: 799, 
    originalPrice: 1999,
    discountText: '60% OFF',
    parametersCount: 11,
    parameterGroups: [
      { name: 'Liver Enzymes & Proteins', count: 11, items: ['SGOT / AST', 'SGPT / ALT', 'Bilirubin Total & Direct', 'Alkaline Phosphatase', 'Gamma GT'] }
    ],
    preparation: '8 hours fasting recommended', 
    sampleType: 'Blood', 
    turnaroundHours: 12 
  },
  { 
    _id: 'demo-kidney', 
    name: 'Kidney Function Test', 
    category: 'Kidney', 
    description: 'Checks serum creatinine, blood urea, uric acid, and filtration rate for complete kidney wellness.', 
    price: 750, 
    originalPrice: 1750,
    discountText: '57% OFF',
    parametersCount: 10,
    parameterGroups: [
      { name: 'Renal Function Panel', count: 10, items: ['Serum Creatinine', 'Blood Urea', 'Uric Acid', 'eGFR', 'Sodium', 'Potassium', 'Chloride'] }
    ],
    preparation: 'Drink normal water before test', 
    sampleType: 'Blood + Urine', 
    turnaroundHours: 12 
  }
];

const starterLabs = [
  { _id: 'demo-lab', name: 'Mango HealthLab Andheri Centre', city: 'Mumbai', address: '18 Link Road, Andheri West', homeCollectionAvailable: true },
  { _id: 'demo-lab2', name: 'Mango HealthLab Indiranagar Centre', city: 'Bengaluru', address: '42 12th Main, Indiranagar', homeCollectionAvailable: true }
];

const healthGoals = [
  { id: 'general', title: 'General Health', desc: 'Full body preventive checkups', icon: Stethoscope, tag: 'Full Body' },
  { id: 'diabetes', title: 'Diabetes Check', desc: 'Blood sugar & HbA1c screening', icon: Droplet, tag: 'Diabetes' },
  { id: 'heart', title: 'Heart & Cholesterol', desc: 'Lipid profile & cardiac risk', icon: Heart, tag: 'Heart' },
  { id: 'thyroid', title: 'Thyroid Check', desc: 'TSH, T3 & T4 hormone panel', icon: Activity, tag: 'Thyroid' },
  { id: 'vitamins', title: 'Vitamins & Energy', desc: 'Vitamin D & B12 screening', icon: Dna, tag: 'Vitamins' },
  { id: 'kidney', title: 'Kidney Health', desc: 'Creatinine & filtration test', icon: TestTube2, tag: 'Kidney' },
  { id: 'liver', title: 'Liver Health', desc: 'Enzymes & liver wellness', icon: FlaskConical, tag: 'Liver' },
  { id: 'men', title: "Men's Health", desc: 'Tailored male wellness check', icon: UserRound, tag: 'Full Body' },
  { id: 'women', title: "Women's Health", desc: 'Comprehensive female health', icon: HeartPulse, tag: 'Full Body' }
];

const faqs = [
  {
    q: 'How does doorstep home sample collection work?',
    a: 'Once you complete your booking, a trained and certified Mango HealthLab phlebotomist is assigned. They visit your provided home address at your chosen date and time slot using sterile, single-use medical kits.'
  },
  {
    q: 'When and how will I receive my digital report?',
    a: 'Your diagnostic reports are generated within 6 to 24 hours (depending on test turnaround time). As soon as verified by our lab doctors, you can download your official PDF report directly from your Mango HealthLab dashboard.'
  },
  {
    q: 'Is fasting required before taking my health checkup?',
    a: 'Fasting requirements vary by test. Tests like Full Body Panels or Lipid Profiles require 8-10 hours overnight fasting. Tests like HbA1c or CBC require no fasting. Clear preparation guidelines are displayed on each test page.'
  },
  {
    q: 'Can I book a test for a family member or senior citizen?',
    a: 'Yes! You can easily enter the patient’s name, contact details, and home address during step 3 of the booking flow.'
  },
  {
    q: 'Are your diagnostic lab partners certified?',
    a: 'All Mango HealthLab samples are processed strictly in 100% NABL-accredited diagnostic laboratories with stringent quality control standards.'
  }
];

async function api(path, options = {}) {
  const token = localStorage.getItem('mango-token');
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Something went wrong');
  return body;
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-icon"><Sparkles size={24} /></span>
      <span>Mango <strong>HealthLab</strong></span>
    </div>
  );
}

function Button({ children, variant = 'primary', icon: Icon, size = 'medium', ...props }) {
  return (
    <button className={`button ${variant} button-${size}`} {...props}>
      {Icon && <Icon size={size === 'large' ? 22 : 19} />}
      {children}
    </button>
  );
}

function Status({ status }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status.replaceAll('_', ' ')}</span>;
}

function Shell({ user, page, setPage, cartCount, onOpenCart, onLogin, onLogout, onOpenFinder, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`app-shell page-${page}`}>
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <span>⚡ Free Home Sample Collection on all health checkups | Trusted by 100,000+ families</span>
        <span className="helpline"><PhoneCall size={15} /> Care Helpline: 1800-MANGO-HEALTH</span>
      </div>

      <header className="topbar">
        <div className="topbar-inner">
          <Brand />
          
          <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <button className={page === 'catalogue' ? 'active' : ''} onClick={() => { setPage('catalogue'); setMobileMenuOpen(false); }}>Find a Test</button>
            <button onClick={() => { setPage('catalogue'); const el = document.getElementById('tests-catalogue'); if (el) el.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}>Health Checkups</button>
            <button onClick={() => { setPage('catalogue'); onOpenFinder(); setMobileMenuOpen(false); }}>Test Finder</button>
            {user && <button className={page === 'dashboard' ? 'active' : ''} onClick={() => { setPage('dashboard'); setMobileMenuOpen(false); }}>My Bookings</button>}
            {user?.role === 'ADMIN' && <button className={page === 'admin' ? 'active' : ''} onClick={() => { setPage('admin'); setMobileMenuOpen(false); }}>Operations</button>}
            {user?.role === 'PHLEBOTOMIST' && <button className={page === 'staff' ? 'active' : ''} onClick={() => { setPage('staff'); setMobileMenuOpen(false); }}>Collections</button>}
          </nav>

          <div className="top-actions">
            <div className="location-chip">
              <MapPin size={18} />
              <span>Mumbai</span>
            </div>

            <button className="cart-button" onClick={onOpenCart} aria-label="View Cart">
              <ShoppingCart size={22} />
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {user ? (
              <>
                <button className="icon-button" aria-label="Notifications" title="Notifications"><Bell size={22} /></button>
                <button className="account-button" onClick={onLogout} title="Click to Logout">
                  <span className="account-avatar">{user.name?.[0]}</span>
                  <span className="account-name">{user.name?.split(' ')[0]}</span>
                </button>
              </>
            ) : (
              <Button variant="quiet" icon={LogIn} onClick={onLogin}>Log in / Register</Button>
            )}

            <button className="mobile-menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      <div className="page-content">{children}</div>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button className={page === 'catalogue' ? 'active' : ''} onClick={() => setPage('catalogue')}>
          <Home size={24} />
          <span>Home</span>
        </button>
        <button onClick={onOpenFinder}>
          <Search size={24} />
          <span>Find Test</span>
        </button>
        <button onClick={onOpenCart} className="cart-mobile-link">
          <ShoppingCart size={24} />
          <span>Cart ({cartCount})</span>
        </button>
        {user ? (
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>
            <CalendarDays size={24} />
            <span>My Health</span>
          </button>
        ) : (
          <button onClick={onLogin}>
            <UserRound size={24} />
            <span>Log In</span>
          </button>
        )}
      </nav>

      <footer>
        <div className="section-container">
          <div className="footer-inner">
            <div className="footer-brand-col">
              <Brand />
              <p className="footer-tagline">Simple, reliable diagnostic testing at your doorstep. Transparent pricing, NABL partner labs, and fast digital reports.</p>
              <div className="contact-chip">
                <PhoneCall size={20} />
                <span>24/7 Helpline: 1800-MANGO-HEALTH</span>
              </div>
            </div>
            <div className="footer-links-col">
              <h4>Quick Links</h4>
              <button onClick={() => setPage('catalogue')}>Explore All Tests</button>
              <button onClick={onOpenFinder}>Interactive Test Finder</button>
              {user && <button onClick={() => setPage('dashboard')}>My Reports & Bookings</button>}
            </div>
            <div className="footer-links-col">
              <h4>Popular Checkups</h4>
              <span>Full Body Checkup Essential</span>
              <span>Diabetes Check (HbA1c)</span>
              <span>Thyroid Profile (T3, T4, TSH)</span>
              <span>Vitamin D & B12 Screening</span>
            </div>
            <div className="footer-links-col">
              <h4>Trust & Safety</h4>
              <span>100% NABL Partner Labs</span>
              <span>Sterile Single-Use Kits</span>
              <span>Encrypted Digital Reports</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Mango HealthLab. All rights reserved.</span>
            <span>Healthcare made simple, trustworthy & transparent.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'patient@mangohealthlab.test', phone: '', password: 'Mango@123' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };
      const result = await api(`/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(payload) });
      localStorage.setItem('mango-token', result.data.token);
      onSuccess(result.data.user);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Unable to reach the Mango HealthLab API. Please check the deployment API URL.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal auth-modal">
        <button className="close-button" onClick={onClose} aria-label="Close"><X size={24} /></button>
        <div className="modal-icon"><ShieldCheck size={32} /></div>
        <p className="overline">MANGO HEALTHLAB</p>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="muted">{mode === 'login' ? 'Sign in to access your digital reports and test bookings.' : 'Create an account to book tests and keep your reports in one place.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label>Full Name
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required minLength="2" autoComplete="name" />
              </label>
              <label>Phone Number
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required minLength="8" autoComplete="tel" />
              </label>
            </>
          )}
          <label>Email Address
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
          </label>
          <label>Password
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>
          {error && <div className="error-message">{error}</div>}
          <Button type="submit" size="large" disabled={busy}>
            {busy ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign in to my account' : 'Create my account')}
            <ArrowRight size={22} />
          </Button>
        </form>
        <button type="button" className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'New to Mango HealthLab? Create an account' : 'Already have an account? Sign in'}
        </button>
        {mode === 'login' && <div className="demo-note">
          <strong>Quick Demo Logins</strong>
          <div className="demo-buttons">
            <button type="button" onClick={() => setForm({ ...form, email: 'patient@mangohealthlab.test', password: 'Mango@123' })}>Patient Demo</button>
            <button type="button" onClick={() => setForm({ ...form, email: 'admin@mangohealthlab.test', password: 'Mango@123' })}>Admin Demo</button>
            <button type="button" onClick={() => setForm({ ...form, email: 'staff@mangohealthlab.test', password: 'Mango@123' })}>Staff Demo</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

function TestFinderModal({ tests, onClose, onAddToCart }) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [method, setMethod] = useState('HOME');

  const recommendedTests = useMemo(() => {
    if (!goal) return tests.slice(0, 3);
    const searchKey = goal.toLowerCase();
    const matches = tests.filter(t => 
      t.name.toLowerCase().includes(searchKey) || 
      t.category.toLowerCase().includes(searchKey) ||
      t.description.toLowerCase().includes(searchKey)
    );
    return matches.length ? matches : tests.slice(0, 3);
  }, [tests, goal]);

  return (
    <div className="modal-backdrop">
      <div className="modal finder-modal">
        <button className="close-button" onClick={onClose} aria-label="Close"><X size={24} /></button>
        
        <div className="finder-header">
          <div className="badge-pill">Interactive Test Finder</div>
          <h2>Find the right test for your health concern</h2>
          <p className="muted">Answer 2 simple questions to get personalized diagnostic recommendations.</p>
        </div>

        <div className="stepper-dots">
          <span className={step >= 1 ? 'active' : ''}>1. Health Goal</span>
          <span className={step >= 2 ? 'active' : ''}>2. Collection Preference</span>
          <span className={step >= 3 ? 'active' : ''}>3. Test Recommendations</span>
        </div>

        {step === 1 && (
          <div className="finder-step">
            <h3>What are you looking to check today?</h3>
            <div className="goal-options-grid">
              {[
                { label: 'Routine Health Checkup', sub: 'Overall full body preventive check', val: 'Full Body', icon: Stethoscope },
                { label: 'Diabetes & Blood Sugar', sub: 'HbA1c & sugar levels', val: 'Diabetes', icon: Droplet },
                { label: 'Thyroid & Metabolism', sub: 'Thyroid hormone balance', val: 'Thyroid', icon: Activity },
                { label: 'Vitamins & Immunity', sub: 'Vitamin D & B12 screening', val: 'Vitamins', icon: Dna },
                { label: 'Heart & Cholesterol', sub: 'Lipid profile & BP health', val: 'Heart', icon: Heart },
                { label: 'Kidney or Liver Health', sub: 'Enzymes & organ wellness', val: 'Liver', icon: FlaskConical }
              ].map(opt => {
                const IconComp = opt.icon;
                return (
                  <button 
                    key={opt.val} 
                    className={`goal-option-card ${goal === opt.val ? 'selected' : ''}`}
                    onClick={() => setGoal(opt.val)}
                  >
                    <IconComp size={26} className="option-icon" />
                    <div>
                      <strong>{opt.label}</strong>
                      <small>{opt.sub}</small>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="finder-actions">
              <Button size="large" disabled={!goal} onClick={() => setStep(2)}>
                Next Step <ChevronRight size={22} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="finder-step">
            <h3>How would you prefer to give your sample?</h3>
            <div className="method-grid">
              <button 
                className={`method-card ${method === 'HOME' ? 'selected' : ''}`}
                onClick={() => setMethod('HOME')}
              >
                <Home size={34} />
                <strong>At Home Sample Collection</strong>
                <span>Certified collector comes to your doorstep at your preferred time.</span>
              </button>
              <button 
                className={`method-card ${method === 'LAB' ? 'selected' : ''}`}
                onClick={() => setMethod('LAB')}
              >
                <MapPin size={34} />
                <strong>Visit Nearby Lab Centre</strong>
                <span>Walk into a certified partner diagnostic centre near you.</span>
              </button>
            </div>
            <div className="finder-actions">
              <Button variant="quiet" onClick={() => setStep(1)}>Back</Button>
              <Button size="large" onClick={() => setStep(3)}>
                Show Recommendations <ArrowRight size={22} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="finder-step">
            <h3>Recommended Diagnostic Tests for You</h3>
            <p className="muted">Based on your focus area ({goal || 'General Health'}):</p>
            <div className="recommendations-list">
              {recommendedTests.map(test => (
                <div className="rec-card" key={test._id}>
                  <div className="rec-info">
                    <span className="test-category-badge">{test.category}</span>
                    <h4>{test.name}</h4>
                    <p>{test.description}</p>
                    <div className="rec-meta">
                      <span><Droplet size={16} /> {test.sampleType}</span>
                      <span><Clock3 size={16} /> Report in {test.turnaroundHours}h</span>
                      <span><CheckCircle2 size={16} /> {test.preparation}</span>
                    </div>
                  </div>
                  <div className="rec-price-action">
                    <strong>₹{test.price.toLocaleString('en-IN')}</strong>
                    <Button onClick={() => { onClose(); onAddToCart(test); }}>
                      Add to Cart <ShoppingCart size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="finder-actions">
              <Button variant="quiet" onClick={() => setStep(2)}>Back</Button>
              <Button variant="quiet" onClick={onClose}>Close Finder</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TestDetailModal({ test, onClose, onAddToCart }) {
  const [openGroupIndex, setOpenGroupIndex] = useState(0);
  if (!test) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal detail-modal">
        <button className="close-button" onClick={onClose} aria-label="Close"><X size={24} /></button>

        <div className="breadcrumb-trail">
          <span>Home</span> <ChevronRight size={16} />
          <span>Health Checkups</span> <ChevronRight size={16} />
          <span className="active">{test.name}</span>
        </div>

        <div className="detail-header">
          <span className="test-category-tag">{test.category}</span>
          <h2>{test.name}</h2>
          <p className="detail-subtitle">{test.description}</p>
        </div>

        <div className="detail-body">
          <div className="detail-highlight-grid">
            <div className="highlight-item">
              <Droplet size={24} />
              <div>
                <strong>Sample Required</strong>
                <span>{test.sampleType}</span>
              </div>
            </div>
            <div className="highlight-item">
              <Clock3 size={24} />
              <div>
                <strong>Report Delivery</strong>
                <span>Within {test.turnaroundHours} hours</span>
              </div>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={24} />
              <div>
                <strong>Preparation Required</strong>
                <span>{test.preparation}</span>
              </div>
            </div>
            <div className="highlight-item">
              <ShieldCheck size={24} />
              <div>
                <strong>Lab Quality</strong>
                <span>100% NABL Accredited</span>
              </div>
            </div>
          </div>

          {/* Parameter Breakdown Accordion */}
          {test.parameterGroups && test.parameterGroups.length > 0 && (
            <div className="parameters-breakdown-section">
              <h3>What's Included in This Package ({test.parametersCount || 10} Parameters)</h3>
              <div className="parameter-accordion-list">
                {test.parameterGroups.map((group, idx) => (
                  <div key={group.name} className="parameter-group-card">
                    <button 
                      className="group-header-btn" 
                      onClick={() => setOpenGroupIndex(openGroupIndex === idx ? -1 : idx)}
                    >
                      <div className="group-title-info">
                        <strong>{group.name}</strong>
                        <span className="count-tag">{group.count} parameters</span>
                      </div>
                      {openGroupIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {openGroupIndex === idx && (
                      <div className="group-items-body">
                        <ul className="item-pills-list">
                          {group.items.map(item => (
                            <li key={item}><Check size={16} /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Why book this test?</h3>
            <p>This panel evaluates critical blood and organ parameters, enabling early detection of deficiencies and proactive monitoring of your health.</p>
          </div>
        </div>

        <div className="detail-footer">
          <div className="detail-price">
            <small>Package Price</small>
            <strong>₹{test.price.toLocaleString('en-IN')}</strong>
            {test.originalPrice && <span className="original-strikethrough">₹{test.originalPrice.toLocaleString('en-IN')}</span>}
          </div>
          <Button size="large" onClick={() => { onClose(); onAddToCart(test); }}>
            Add to Cart <ShoppingCart size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove, onProceedToBooking }) {
  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);
  const totalSavings = useMemo(() => cart.reduce((acc, item) => acc + ((item.originalPrice || item.price * 2) - item.price), 0), [cart]);

  return (
    <div className="modal-backdrop">
      <div className="modal cart-drawer">
        <button className="close-button" onClick={onClose} aria-label="Close"><X size={24} /></button>
        
        <div className="cart-header">
          <h2>Your Health Basket ({cart.length})</h2>
          <p className="muted">Review selected health tests and proceed to booking.</p>
        </div>

        {cart.length > 0 ? (
          <>
            <div className="cart-items-list">
              {cart.map(item => (
                <div className="cart-item-row" key={item._id}>
                  <div>
                    <span className="cart-item-category">{item.category}</span>
                    <h4>{item.name}</h4>
                    <span className="cart-item-meta">Report in {item.turnaroundHours}h · {item.sampleType}</span>
                  </div>
                  <div className="cart-item-right">
                    <strong>₹{item.price.toLocaleString('en-IN')}</strong>
                    <button className="remove-item-btn" onClick={() => onRemove(item._id)} aria-label="Remove item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="savings-banner">
              <Tag size={20} />
              <span>You are saving <strong>₹{totalSavings.toLocaleString('en-IN')}</strong> on this booking!</span>
            </div>

            <div className="cart-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="summary-row">
                <span>Home Sample Collection</span>
                <strong className="free-text">FREE</strong>
              </div>
              <div className="summary-row total">
                <span>Total Payable</span>
                <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="cart-actions">
              <Button size="large" onClick={onProceedToBooking}>
                Proceed to Checkout <ArrowRight size={22} />
              </Button>
            </div>
          </>
        ) : (
          <div className="empty-cart-state">
            <ShoppingCart size={52} />
            <h3>Your basket is empty</h3>
            <p>Explore our diagnostic packages and add tests to continue.</p>
            <Button onClick={onClose}>Explore Health Checkups</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FAQSection() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="faq-section">
      <div className="section-container">
        <div className="section-header center">
          <p className="overline">GOT QUESTIONS?</p>
          <h2>Frequently Asked Questions</h2>
          <p className="section-sub">Everything you need to know about booking diagnostic tests with Mango HealthLab.</p>
        </div>

        <div className="faq-accordion-container">
          {faqs.map((faq, idx) => (
            <div className={`faq-card ${openFaq === idx ? 'open' : ''}`} key={faq.q}>
              <button className="faq-question-btn" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
              {openFaq === idx && (
                <div className="faq-answer-body">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Catalogue({ tests, user, onLogin, onAddToCart, onOpenFinder }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Tests');
  const [selectedDetailTest, setSelectedDetailTest] = useState(null);
  
  // Filter states
  const [selectedGoalFilter, setSelectedGoalFilter] = useState('ALL');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('ALL');
  const [selectedTurnaroundFilter, setSelectedTurnaroundFilter] = useState('ALL');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = tests;

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(test => 
        test.name.toLowerCase().includes(q) || 
        test.category.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q)
      );
    }

    // Category filter bar
    if (category !== 'All Tests') {
      result = result.filter(test => test.category === category);
    }

    // Goal filter sidebar
    if (selectedGoalFilter !== 'ALL') {
      result = result.filter(test => test.category === selectedGoalFilter);
    }

    // Price filter
    if (selectedPriceFilter === 'UNDER_1000') {
      result = result.filter(t => t.price < 1000);
    } else if (selectedPriceFilter === '1000_2500') {
      result = result.filter(t => t.price >= 1000 && t.price <= 2500);
    } else if (selectedPriceFilter === 'ABOVE_2500') {
      result = result.filter(t => t.price > 2500);
    }

    // Report time filter
    if (selectedTurnaroundFilter === '6') {
      result = result.filter(t => t.turnaroundHours <= 6);
    } else if (selectedTurnaroundFilter === '12') {
      result = result.filter(t => t.turnaroundHours <= 12);
    }

    return result;
  }, [tests, query, category, selectedGoalFilter, selectedPriceFilter, selectedTurnaroundFilter]);

  const handleGoalClick = (goalTag) => {
    setQuery('');
    setCategory(goalTag);
    setSelectedGoalFilter(goalTag);
    const catalogueEl = document.getElementById('tests-catalogue');
    if (catalogueEl) catalogueEl.scrollIntoView({ behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setQuery('');
    setCategory('All Tests');
    setSelectedGoalFilter('ALL');
    setSelectedPriceFilter('ALL');
    setSelectedTurnaroundFilter('ALL');
  };

  return (
    <main>
      {/* 1. PRIMARY HERO SECTION */}
      <section className="hero">
        <div className="section-container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <ShieldCheck size={20} /> Simple testing. Trusted care. At your doorstep.
              </div>
              <h1>
                Find the right health test <em>for you.</em>
              </h1>
              <p className="hero-lede">
                Book trusted diagnostic tests and health checkups with convenient home sample collection and fast digital reports.
              </p>
              
              <div className="hero-cta-group">
                <Button size="large" icon={Search} onClick={onOpenFinder}>
                  Find a test →
                </Button>
                <Button variant="quiet" size="large" onClick={() => {
                  const catalogueEl = document.getElementById('tests-catalogue');
                  if (catalogueEl) catalogueEl.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore health checkups
                </Button>
              </div>

              <div className="hero-reassurance-row">
                <span><Check size={20} /> Home sample collection</span>
                <span><Check size={20} /> Transparent pricing</span>
                <span><Check size={20} /> Digital reports</span>
                <span><Check size={20} /> Trusted NABL labs</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="image-window">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85" 
                  alt="Medical professional taking home blood sample safely" 
                />
                <div className="image-note">
                  <span className="pulse-dot" /> NABL Certified Labs & Doorstep Collection
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & PROMINENT TOP BAR */}
      <section className="search-bar-section">
        <div className="section-container">
          <div className="top-search-card">
            <div className="search-box">
              <Search size={24} className="search-icon" />
              <input 
                aria-label="Search tests or health concerns" 
                placeholder="Search tests, health checkups or health concerns (e.g. CBC, Diabetes, Vitamin D, Thyroid)..." 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
              />
              {query && <button className="clear-search" onClick={() => setQuery('')}><X size={20} /></button>}
            </div>
            <div className="search-suggestions">
              <small>Popular searches:</small>
              {['Full Body', 'CBC', 'Diabetes', 'Thyroid', 'Vitamin D', 'Cholesterol'].map(chip => (
                <button key={chip} className="chip" onClick={() => { setQuery(chip); setCategory('All Tests'); }}>{chip}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HEALTH GOAL SELECTION GRID */}
      <section className="goals-section">
        <div className="section-container">
          <div className="section-header">
            <p className="overline">QUICK CATEGORY SELECTION</p>
            <h2>What are you looking for today?</h2>
            <p className="section-sub">Select your health goal to explore recommended preventive health packages.</p>
          </div>

          <div className="goals-grid">
            {healthGoals.map(goal => {
              const IconComp = goal.icon;
              return (
                <button 
                  key={goal.id} 
                  className="goal-card"
                  onClick={() => handleGoalClick(goal.tag)}
                >
                  <div className="goal-icon-wrapper">
                    <IconComp size={32} />
                  </div>
                  <h3>{goal.title}</h3>
                  <p>{goal.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE TEST FINDER BANNER */}
      <section className="finder-banner-section">
        <div className="section-container">
          <div className="finder-banner-card">
            <div className="finder-banner-content">
              <span className="banner-badge">30-Second Guided Finder</span>
              <h2>Not sure which test you need?</h2>
              <p>Answer a few quick questions about your symptoms or goals and get instant personalized checkup recommendations.</p>
              <Button size="large" onClick={onOpenFinder}>
                Help me find a test <ArrowRight size={22} />
              </Button>
            </div>
            <div className="finder-banner-icon">
              <HelpCircle size={130} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. HEALTH CHECKUP MARKETPLACE & SIDEBAR FILTERS WITH FULL RESPONSIVE GRID */}
      <section className="catalogue-section" id="tests-catalogue">
        <div className="section-container">
          <div className="catalogue-top">
            <div>
              <p className="overline">HEALTH CHECKUP MARKETPLACE</p>
              <h2>Diagnostic Tests & Preventive Checkups</h2>
              <p className="section-sub">Browse, compare and add diagnostic tests with transparent package pricing.</p>
            </div>

            <button className="mobile-filter-trigger" onClick={() => setShowMobileFilters(!showMobileFilters)}>
              <SlidersHorizontal size={20} />
              <span>Filters ({filtered.length})</span>
            </button>
          </div>

          {/* Category Bar */}
          <div className="category-row">
            {categories.map(item => (
              <button 
                key={item} 
                className={category === item ? 'selected' : ''} 
                onClick={() => { setCategory(item); setSelectedGoalFilter(item === 'All Tests' ? 'ALL' : item); }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Marketplace Layout: Left Sidebar + Right Responsive Grid */}
          <div className="marketplace-layout">
            <aside className={`filter-sidebar ${showMobileFilters ? 'open' : ''}`}>
              <div className="sidebar-head">
                <h3><Filter size={22} /> Filters</h3>
                <button className="clear-filter-link" onClick={clearAllFilters}>Clear all</button>
              </div>

              <div className="filter-group">
                <h4>Health Goal</h4>
                {['ALL', 'Full Body', 'Diabetes', 'Heart', 'Thyroid', 'Vitamins', 'Liver', 'Kidney'].map(goal => (
                  <label key={goal} className="filter-radio-label">
                    <input 
                      type="radio" 
                      name="goalFilter" 
                      checked={selectedGoalFilter === goal} 
                      onChange={() => setSelectedGoalFilter(goal)} 
                    />
                    <span>{goal === 'ALL' ? 'All Goals' : goal}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                {[
                  { label: 'All Prices', val: 'ALL' },
                  { label: 'Under ₹1,000', val: 'UNDER_1000' },
                  { label: '₹1,000 – ₹2,500', val: '1000_2500' },
                  { label: 'Above ₹2,500', val: 'ABOVE_2500' }
                ].map(p => (
                  <label key={p.val} className="filter-radio-label">
                    <input 
                      type="radio" 
                      name="priceFilter" 
                      checked={selectedPriceFilter === p.val} 
                      onChange={() => setSelectedPriceFilter(p.val)} 
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h4>Report Time</h4>
                {[
                  { label: 'Any Timeframe', val: 'ALL' },
                  { label: 'Within 6 hours', val: '6' },
                  { label: 'Within 12 hours', val: '12' }
                ].map(t => (
                  <label key={t.val} className="filter-radio-label">
                    <input 
                      type="radio" 
                      name="timeFilter" 
                      checked={selectedTurnaroundFilter === t.val} 
                      onChange={() => setSelectedTurnaroundFilter(t.val)} 
                    />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </aside>

            <div className="marketplace-main">
              <div className="results-count-bar">
                <span>Showing <strong>{filtered.length}</strong> diagnostic checkups</span>
                {(selectedGoalFilter !== 'ALL' || selectedPriceFilter !== 'ALL' || selectedTurnaroundFilter !== 'ALL' || query) && (
                  <button className="reset-chip" onClick={clearAllFilters}>Reset Filters <X size={16} /></button>
                )}
              </div>

              {/* Standard Responsive Grid Layout (Restored & Clean) */}
              <div className="test-grid">
                {filtered.map(test => (
                  <article className="test-card" key={test._id}>
                    <div className="test-card-top">
                      <span className="test-category-badge">{test.category}</span>
                      {test.discountText && <span className="discount-badge">{test.discountText}</span>}
                    </div>
                    
                    <h3 className="test-title">{test.name}</h3>
                    <p className="test-desc">{test.description}</p>

                    {test.parametersCount && (
                      <div className="parameters-pill">
                        <CheckCircle2 size={16} /> Includes {test.parametersCount} Parameters
                      </div>
                    )}
                    
                    <div className="test-features">
                      <span><Droplet size={16} /> {test.sampleType}</span>
                      <span><Clock3 size={16} /> Report in {test.turnaroundHours}h</span>
                      <span><Home size={16} /> Home collection</span>
                    </div>

                    <div className="test-card-bottom">
                      <div className="test-price-tag">
                        <small>Package Price</small>
                        <div className="price-line">
                          <strong>₹{test.price.toLocaleString('en-IN')}</strong>
                          {test.originalPrice && <span className="original-strikethrough">₹{test.originalPrice.toLocaleString('en-IN')}</span>}
                        </div>
                      </div>

                      <div className="test-card-actions">
                        <button className="text-link" onClick={() => setSelectedDetailTest(test)}>
                          View details
                        </button>
                        <Button size="medium" onClick={() => onAddToCart(test)}>
                          Add to Cart <ShoppingCart size={18} />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="empty-state">
                  <Search size={40} />
                  <h3>No matching tests found</h3>
                  <p>Try adjusting your search query or clearing sidebar filters.</p>
                  <Button variant="quiet" onClick={clearAllFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header center">
            <p className="overline">SIMPLE PROCESS</p>
            <h2>How Mango HealthLab Works</h2>
            <p className="section-sub">Four easy steps from booking your checkup to receiving your verified report.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h3>Choose your test</h3>
              <p>Select from popular diagnostic packages or use our guided 30-second test finder.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h3>Select collection method</h3>
              <p>Pick doorstep home sample collection or visit a nearby certified lab centre.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h3>Choose your time</h3>
              <p>Select a convenient date and morning/evening time slot that fits your schedule.</p>
            </div>
            <div className="step-card">
              <span className="step-num">04</span>
              <h3>Receive your report</h3>
              <p>Download your verified PDF health report directly online or via WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUST SECTION */}
      <section className="trust-section">
        <div className="section-container">
          <div className="trust-box">
            <div className="trust-left">
              <p className="overline">WHY CHOOSE MANGO HEALTHLAB</p>
              <h2>Healthcare made convenient, transparent & simple.</h2>
              <p className="muted">We combine certified laboratory standards with comfortable doorstep service for your complete peace of mind.</p>
            </div>
            <div className="trust-points-grid">
              <div className="trust-card">
                <Home size={32} className="trust-icon" />
                <h4>Home sample collection</h4>
                <p>Trained medical collectors visit your home at your exact preferred time slot using single-use sterile kits.</p>
              </div>
              <div className="trust-card">
                <ShieldCheck size={32} className="trust-icon" />
                <h4>Transparent pricing</h4>
                <p>No hidden home visit charges or surprise lab fees. Pay clear, transparent package rates.</p>
              </div>
              <div className="trust-card">
                <FileText size={32} className="trust-icon" />
                <h4>Fast digital reports</h4>
                <p>Easy-to-read, NABL doctor-verified health reports stored securely in your dashboard forever.</p>
              </div>
              <div className="trust-card">
                <FlaskConical size={32} className="trust-icon" />
                <h4>Trusted diagnostic partners</h4>
                <p>Sample processing in 100% NABL-accredited diagnostic facilities with strict quality controls.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <FAQSection />

      {/* Test Detail Modal */}
      {selectedDetailTest && (
        <TestDetailModal 
          test={selectedDetailTest} 
          onClose={() => setSelectedDetailTest(null)} 
          onAddToCart={onAddToCart} 
        />
      )}
    </main>
  );
}

function BookingModal({ cart, labs, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('HOME');
  const [labId, setLabId] = useState(labs[0]?._id || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  useEffect(() => {
    if (!labId || !date || labId.startsWith('demo-')) {
      setSlots([
        { time: '07:00 - 08:00 AM', remaining: 4 },
        { time: '08:00 - 09:00 AM', remaining: 5 },
        { time: '09:00 - 10:00 AM', remaining: 3 },
        { time: '10:00 - 11:00 AM', remaining: 2 },
        { time: '05:00 - 06:00 PM', remaining: 5 }
      ]);
      return;
    }
    api(`/labs/${labId}/slots?date=${date}&collectionType=${type}`)
      .then(result => setSlots(result.data.slots))
      .catch(() => setSlots([
        { time: '08:00 - 09:00 AM', remaining: 5 },
        { time: '09:00 - 10:00 AM', remaining: 5 },
        { time: '10:00 - 11:00 AM', remaining: 5 }
      ]));
  }, [labId, date, type]);

  const next = () => {
    setError('');
    if (step === 1 && !patientName.trim()) return setError('Please enter patient full name');
    if (step === 3 && !time) return setError('Please choose an available time slot to continue');
    if (step === 4 && type === 'HOME' && (!address.trim() || !phone.trim())) {
      return setError('Please provide a complete address and 10-digit contact phone number');
    }
    setStep(Math.min(5, step + 1));
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await api('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          testIds: cart.map(t => t._id),
          labId,
          collectionType: type,
          appointmentDate: date,
          appointmentTime: time,
          address: type === 'HOME' ? address : undefined,
          contactNumber: phone || undefined
        })
      });
      onSuccess(result.data.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal booking-modal">
        <button className="close-button" onClick={onClose} aria-label="Close"><X size={24} /></button>
        
        <div className="booking-header">
          <div>
            <p className="overline">CHECKOUT BOOKING</p>
            <h2>{cart.length > 1 ? `${cart.length} Checkups Selected` : cart[0]?.name}</h2>
          </div>
          <span className="booking-price-pill">₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="stepper">
          {['1. Patient', '2. Collection', '3. Schedule', '4. Details', '5. Confirm'].map((label, index) => (
            <div className={step > index + 1 ? 'done' : step === index + 1 ? 'current' : ''} key={label}>
              <span>{step > index + 1 ? <Check size={14} /> : index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="booking-panel">
            <h3>Enter Patient Information</h3>
            <label className="form-label">
              Patient Full Name
              <input 
                type="text" 
                placeholder="e.g. Rahul Sharma" 
                value={patientName} 
                onChange={e => setPatientName(e.target.value)} 
                required 
              />
            </label>
            <label className="form-label">
              Contact Phone Number
              <input 
                type="tel" 
                placeholder="10-digit mobile number" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="booking-panel">
            <h3>How would you like to give your sample?</h3>
            <div className="choice-grid">
              <button 
                className={type === 'HOME' ? 'choice selected' : 'choice'} 
                onClick={() => setType('HOME')}
              >
                <Home size={30} />
                <strong>Home Sample Collection</strong>
                <span>Trained phlebotomist collects sample safely at your home.</span>
              </button>
              <button 
                className={type === 'LAB' ? 'choice selected' : 'choice'} 
                onClick={() => setType('LAB')}
              >
                <MapPin size={30} />
                <strong>Visit Diagnostic Lab</strong>
                <span>Visit our nearest lab facility with priority assistance.</span>
              </button>
            </div>
            
            <label className="form-label">
              Select preferred diagnostic lab location
              <select value={labId} onChange={e => setLabId(e.target.value)}>
                {labs.map(lab => (
                  <option key={lab._id} value={lab._id}>
                    {lab.name} — {lab.city} ({lab.address})
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="booking-panel">
            <h3>Select Date & Convenient Time Slot</h3>
            <label className="form-label">
              Appointment Date
              <input 
                type="date" 
                min={new Date().toISOString().slice(0, 10)} 
                value={date} 
                onChange={e => { setDate(e.target.value); setTime(''); }} 
              />
            </label>
            
            <div className="slot-selection">
              <label className="form-label">Available Time Slots</label>
              <div className="slot-grid">
                {slots.map(slot => (
                  <button 
                    disabled={!slot.remaining} 
                    className={time === slot.time ? 'slot selected' : 'slot'} 
                    key={slot.time} 
                    onClick={() => setTime(slot.time)}
                  >
                    <strong>{slot.time}</strong>
                    <small>{slot.remaining ? `${slot.remaining} slots open` : 'Full'}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="booking-panel">
            <h3>Patient Address Details</h3>
            {type === 'HOME' ? (
              <label className="form-label">
                Home Collection Address
                <textarea 
                  rows="3" 
                  placeholder="House/Flat No., Building Name, Street, Landmark" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  required
                />
              </label>
            ) : (
              <div className="lab-summary-box">
                <MapPin size={28} />
                <div>
                  <strong>{labs.find(lab => lab._id === labId)?.name}</strong>
                  <p>{labs.find(lab => lab._id === labId)?.address}, {labs.find(lab => lab._id === labId)?.city}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="booking-panel review-panel">
            <h3>Review Your Order & Confirm</h3>
            <div className="review-box">
              <div className="review-row">
                <span>Patient</span>
                <strong>{patientName} ({phone})</strong>
              </div>
              <div className="review-row">
                <span>Tests Booked</span>
                <strong>{cart.map(c => c.name).join(', ')}</strong>
              </div>
              <div className="review-row">
                <span>Collection Mode</span>
                <strong>{type === 'HOME' ? 'Home Sample Collection' : 'Lab Visit'}</strong>
              </div>
              <div className="review-row">
                <span>Appointment Time</span>
                <strong>{date} · {time}</strong>
              </div>
              {type === 'HOME' && (
                <div className="review-row">
                  <span>Address</span>
                  <strong>{address}</strong>
                </div>
              )}
              <div className="review-row total">
                <span>Total Payable Amount</span>
                <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          {step > 1 && (
            <Button variant="quiet" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 5 ? (
            <Button size="large" onClick={next}>
              Continue <ArrowRight size={22} />
            </Button>
          ) : (
            <Button size="large" onClick={confirm} disabled={busy}>
              {busy ? 'Confirming appointment…' : 'Confirm & Place Order'}
              <Check size={22} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Confirmation({ booking, onClose, onDashboard }) {
  return (
    <div className="modal-backdrop">
      <div className="modal confirmation-modal">
        <div className="success-icon"><Check size={40} /></div>
        <p className="overline">BOOKING CONFIRMED</p>
        <h2>Your appointment is booked!</h2>
        <p className="muted">We have sent confirmation details. Your sample collector will reach out before appointment time.</p>
        
        <div className="booking-code-box">
          <span>Booking Reference Code</span>
          <strong>{booking.bookingCode}</strong>
        </div>

        <div className="confirmation-details-grid">
          <div><CalendarDays size={20} /> <strong>{booking.appointmentDate}</strong></div>
          <div><Clock3 size={20} /> <strong>{booking.appointmentTime}</strong></div>
          <div><Home size={20} /> <strong>{booking.collectionType === 'HOME' ? 'Home Collection' : 'Lab Visit'}</strong></div>
        </div>

        <div className="modal-actions">
          <Button variant="quiet" onClick={onClose}>Find another test</Button>
          <Button size="large" onClick={onDashboard}>
            View my bookings & reports <ArrowRight size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onBook }) {
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api('/bookings').then(r => setBookings(r.data.bookings)).catch(() => {});
    api('/reports').then(r => setReports(r.data.reports)).catch(() => {});
  }, []);

  const active = bookings.find(b => !['CANCELLED', 'COMPLETED'].includes(b.status));
  const timeline = ['CONFIRMED', 'COLLECTION_ASSIGNED', 'SAMPLE_COLLECTED', 'PROCESSING', 'REPORT_READY', 'COMPLETED'];

  const downloadReport = async report => {
    const response = await fetch(`${API}/reports/${report._id}/download`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('mango-token')}` }
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.testId?.name || 'MangoHealthLab'}_Report.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="dashboard-page">
      <div className="section-container">
        <div className="dashboard-intro">
          <div>
            <p className="overline">MY HEALTH DASHBOARD</p>
            <h1>Welcome back, <em>{user.name?.split(' ')[0]}.</em></h1>
            <p className="muted">Track your live sample collection journey and download health reports.</p>
          </div>
          <Button size="large" onClick={onBook} icon={Sparkles}>
            Book a new test
          </Button>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-main">
            <div className="panel-head">
              <div>
                <p className="overline">UPCOMING APPOINTMENT</p>
                <h2>{active ? 'Sample Journey Status' : 'No Active Test Pending'}</h2>
              </div>
              {active && <Status status={active.status} />}
            </div>

            {active ? (
              <div className="active-booking-card">
                <div className="booking-summary-header">
                  <div className="summary-icon"><TestTube2 size={28} /></div>
                  <div>
                    <strong>{active.items?.[0]?.name || 'Diagnostic Check'}</strong>
                    <p>{active.bookingCode} · Appointment: {active.appointmentDate} ({active.appointmentTime})</p>
                  </div>
                </div>

                <div className="timeline-tracker">
                  {timeline.map((item, index) => {
                    const isReached = timeline.indexOf(active.status) >= index;
                    return (
                      <div className={`timeline-step ${isReached ? 'reached' : ''}`} key={item}>
                        <div className="step-circle">{isReached ? <Check size={14} /> : index + 1}</div>
                        <small>{item.replaceAll('_', ' ')}</small>
                      </div>
                    );
                  })}
                </div>

                {['PENDING', 'CONFIRMED'].includes(active.status) && (
                  <button 
                    className="cancel-link" 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to cancel this booking?')) {
                        await api(`/bookings/${active._id}`, { method: 'DELETE' });
                        setBookings(bookings.map(item => item._id === active._id ? { ...item, status: 'CANCELLED' } : item));
                      }
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ) : (
              <div className="empty-dashboard-card">
                <Sparkles size={36} />
                <h3>No active tests in progress</h3>
                <p>Stay on top of your health with routine preventive checkups.</p>
                <Button onClick={onBook}>Browse Available Tests</Button>
              </div>
            )}

            <div className="panel-head history-head">
              <div>
                <p className="overline">APPOINTMENT HISTORY</p>
                <h2>Past Test Bookings</h2>
              </div>
            </div>

            <div className="history-list">
              {bookings.length ? (
                bookings.map(booking => (
                  <div className="history-row" key={booking._id}>
                    <span className="history-icon"><TestTube2 size={22} /></span>
                    <div>
                      <strong>{booking.items?.[0]?.name || 'Test booking'}</strong>
                      <small>{booking.bookingCode} · Date: {booking.appointmentDate}</small>
                    </div>
                    <Status status={booking.status} />
                  </div>
                ))
              ) : (
                <p className="muted">Your past booking history will display here.</p>
              )}
            </div>
          </section>

          <aside className="dashboard-side">
            <div className="side-panel">
              <div className="panel-head">
                <h3>Digital Health Reports</h3>
                <FileText size={22} />
              </div>
              {reports.length ? (
                reports.map(report => (
                  <div className="report-row" key={report._id}>
                    <div>
                      <strong>{report.testId?.name || 'Diagnostic Report'}</strong>
                      <small>Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN')}</small>
                    </div>
                    <Button size="small" onClick={() => downloadReport(report)} aria-label="Download report PDF">
                      <Download size={16} /> PDF
                    </Button>
                  </div>
                ))
              ) : (
                <div className="side-empty">
                  <FileText size={28} />
                  <p>Your verified PDF reports will appear here as soon as your sample is tested.</p>
                </div>
              )}
            </div>

            <div className="help-card">
              <PhoneCall size={26} />
              <h3>Need help with your report?</h3>
              <p>Our medical care support is active daily from 8:00 AM to 8:00 PM.</p>
              <a href="mailto:care@mangohealthlab.local" className="help-link">
                Contact Care Desk <ArrowRight size={18} />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Operations({ role = 'ADMIN' }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api('/bookings').then(r => setBookings(r.data.bookings)).catch(() => {});
  }, []);

  const update = async (id, status) => {
    try {
      const r = await api(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      setBookings(bookings.map(item => item._id === id ? r.data.booking : item));
    } catch (e) {
      window.alert(e.message);
    }
  };

  const readyReport = async booking => {
    try {
      await api('/reports', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: booking._id,
          testId: booking.testIds[0],
          results: [{ parameter: 'Primary marker', value: 14.2, unit: 'g/dL', refMin: 12, refMax: 17 }]
        })
      });
      const r = await api('/bookings');
      setBookings(r.data.bookings);
    } catch (e) {
      window.alert(e.message);
    }
  };

  return (
    <main className="operations-page">
      <div className="section-container">
        <div className="operations-heading">
          <div>
            <p className="overline">{role === 'ADMIN' ? 'OPERATIONS DESK' : 'COLLECTION DESK'}</p>
            <h1>{role === 'ADMIN' ? 'Lab Operations & Tracking' : 'Today’s Phlebotomy Collections'}</h1>
            <p className="muted">Real-time status tracking for every sample journey.</p>
          </div>
          <div className="ops-metrics">
            <div><strong>{bookings.length}</strong><span>Total Bookings</span></div>
            <div><strong>{bookings.filter(b => b.status === 'PROCESSING').length}</strong><span>Processing</span></div>
            <div><strong>{bookings.filter(b => b.status === 'REPORT_READY').length}</strong><span>Reports Ready</span></div>
          </div>
        </div>

        <div className="ops-panel">
          <div className="panel-head">
            <div>
              <p className="overline">LIVE WORKFLOW QUEUE</p>
              <h2>{role === 'ADMIN' ? 'All Sample Orders' : 'Assigned Patient Collections'}</h2>
            </div>
          </div>

          <div className="booking-table">
            <div className="table-row table-head">
              <span>Patient</span>
              <span>Test Name</span>
              <span>Collection</span>
              <span>Status</span>
              <span>Next Action</span>
            </div>
            {bookings.map(booking => (
              <div className="table-row" key={booking._id}>
                <span>
                  <strong>{booking.patientId?.name || 'Patient'}</strong>
                  <small>{booking.bookingCode}</small>
                </span>
                <span>{booking.items?.[0]?.name || 'Diagnostic test'}</span>
                <span>{booking.collectionType === 'HOME' ? 'Home Collection' : 'Lab Visit'}</span>
                <span><Status status={booking.status} /></span>
                <span>
                  {booking.status === 'CONFIRMED' && role === 'ADMIN' && (
                    <Button size="small" onClick={() => update(booking._id, 'COLLECTION_ASSIGNED')}>Assign Collector</Button>
                  )}
                  {booking.status === 'COLLECTION_ASSIGNED' && (
                    <Button size="small" onClick={() => update(booking._id, 'SAMPLE_COLLECTED')}>Mark Collected</Button>
                  )}
                  {booking.status === 'SAMPLE_COLLECTED' && role === 'ADMIN' && (
                    <Button size="small" onClick={() => update(booking._id, 'PROCESSING')}>Start Processing</Button>
                  )}
                  {booking.status === 'PROCESSING' && role === 'ADMIN' && (
                    <Button size="small" onClick={() => readyReport(booking)}>Generate Report</Button>
                  )}
                  {booking.status === 'REPORT_READY' && (
                    <span className="done-tag"><Check size={18} /> Completed</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {!bookings.length && (
            <div className="empty-state">
              <FlaskConical size={36} />
              <p>No active bookings in queue.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mango-user')) || null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState('catalogue');
  const [tests, setTests] = useState(starterTests);
  const [labs, setLabs] = useState(starterLabs);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [finderOpen, setFinderOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    api('/tests').then(r => setTests(r.data.tests)).catch(() => {});
    api('/labs').then(r => setLabs(r.data.labs)).catch(() => {});
  }, []);

  const loginSuccess = next => {
    setUser(next);
    localStorage.setItem('mango-user', JSON.stringify(next));
    setLoginOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('mango-token');
    localStorage.removeItem('mango-user');
    setUser(null);
    setPage('catalogue');
  };

  const addToCart = test => {
    if (!cart.some(item => item._id === test._id)) {
      setCart([...cart, test]);
    }
    setCartOpen(true);
  };

  const removeFromCart = testId => {
    setCart(cart.filter(item => item._id !== testId));
  };

  const startCheckout = () => {
    setCartOpen(false);
    if (!user) {
      setLoginOpen(true);
    } else {
      setBookingModalOpen(true);
    }
  };

  return (
    <Shell 
      user={user} 
      page={page} 
      setPage={setPage} 
      cartCount={cart.length}
      onOpenCart={() => setCartOpen(true)}
      onLogin={() => setLoginOpen(true)} 
      onLogout={logout}
      onOpenFinder={() => setFinderOpen(true)}
    >
      {page === 'catalogue' && (
        <Catalogue 
          tests={tests} 
          user={user} 
          onLogin={() => setLoginOpen(true)} 
          onAddToCart={addToCart} 
          onOpenFinder={() => setFinderOpen(true)}
        />
      )}
      {page === 'dashboard' && user && <Dashboard user={user} onBook={() => setPage('catalogue')} />}
      {page === 'admin' && user?.role === 'ADMIN' && <Operations role="ADMIN" />}
      {page === 'staff' && user?.role === 'PHLEBOTOMIST' && <Operations role="PHLEBOTOMIST" />}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSuccess={loginSuccess} />}
      {finderOpen && <TestFinderModal tests={tests} onClose={() => setFinderOpen(false)} onAddToCart={addToCart} />}
      {cartOpen && (
        <CartDrawer 
          cart={cart} 
          onClose={() => setCartOpen(false)} 
          onRemove={removeFromCart} 
          onProceedToBooking={startCheckout} 
        />
      )}
      {bookingModalOpen && (
        <BookingModal 
          cart={cart} 
          labs={labs} 
          onClose={() => setBookingModalOpen(false)} 
          onSuccess={booking => {
            setBookingModalOpen(false);
            setCart([]);
            setConfirmation(booking);
          }} 
        />
      )}
      {confirmation && (
        <Confirmation 
          booking={confirmation} 
          onClose={() => setConfirmation(null)} 
          onDashboard={() => {
            setConfirmation(null);
            setPage('dashboard');
          }} 
        />
      )}
    </Shell>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
