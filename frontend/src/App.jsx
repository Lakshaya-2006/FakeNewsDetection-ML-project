import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'




function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // User auth state (null means guest user, login is optional)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('healthVerifyUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Dropdown menu state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // History list from localstorage or default empty
  const [history, setHistory] = useState([]);

  const [newsInput, setNewsInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  
  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist history
 useEffect(() => {

  const loadHistory = async () => {

    try {

      const response = await fetch(
  "https://laks2006-fakesnews-dl.hf.space/history"
);

      const data = await response.json();


      const formattedHistory = data.map((item, index) => ({
        
        id: index,

        statement: item.text,

        verdict: item.prediction,

        confidence: item.confidence,

        date: new Date(item.date).toLocaleString()

      }));


      setHistory(formattedHistory);


    } catch(error) {

      console.log("History loading failed", error);

    }

  };


  loadHistory();


}, []);

  // Persist user auth session
  useEffect(() => {
    if (user) {
      localStorage.setItem('healthVerifyUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('healthVerifyUser');
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewsInput(event.target.result);
    };
    reader.readAsText(file);
  };

  // Trigger file click
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle analysis simulation
  // Handle real backend AI analysis
const handleVerify = async (textToVerify) => {

  const queryText = textToVerify || newsInput;

  if (!queryText.trim()) return;


  setIsAnalyzing(true);
  setCurrentResult(null);
  setActiveTab("checker");


  try {

    const response = await fetch(
  "https://laks2006-fakesnews-dl.hf.space/predict",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          text: queryText
        })
      }
    );


    const data = await response.json();



    const result = {

      statement: queryText,

      verdict: data.prediction,

      confidence: data.confidence,

      summary:
      "Prediction generated using trained DistilBERT health fake news detection model.",


      references: [
        "DistilBERT NLP Model",
        "NewsAPI Verification"
      ],


      breakdown: {

        consensus:
        "AI Model Classification",

        datasetSize:
        "Health Tips Dataset",

        updatedAt:
        "2026"

      }

    };



    setCurrentResult(result);


// Reload history from MongoDB

const historyResponse = await fetch(
  "https://laks2006-fakesnews-dl.hf.space/history"
);


const historyData = await historyResponse.json();


const formattedHistory = historyData.map((item,index)=>({

  id:index,

  statement:item.text,

  verdict:item.prediction,

  confidence:item.confidence,

  date:new Date(item.date).toLocaleString()

}));


setHistory(formattedHistory);



  }
  catch(error){

    console.log(error);

    alert(
      "Backend is not running"
    );

  }


  setIsAnalyzing(false);

};

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your verification history?")) {
      setHistory([]);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfileMenu(false);
    setCurrentResult(null);
    setNewsInput('');
    setActiveTab('home');
  };

  const handleLoginSuccess = (userInfo) => {
    setUser(userInfo);
    setActiveTab('home');
  };

  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <header className="main-header">
        <div className="header-logo" onClick={() => setActiveTab('home')}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="12 8 12 12 14 14"></polyline>
            </svg>
          </div>
          <span className="logo-text">Health Fake News Detection</span>
        </div>
        
        <nav className="header-nav">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveTab('home'); setCurrentResult(null); }}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === 'checker' ? 'active' : ''}`}
            onClick={() => setActiveTab('checker')}
          >
            Health Checker
          </button>
          <button 
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>

        <div className="header-actions">
          <button 
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          
          {/* Render User Menu or optional Sign In Button */}
          {user ? (
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button 
                className={`profile-btn ${showProfileMenu ? 'active' : ''}`} 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="User Profile"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-details">
                      <span className="profile-name">{user.name}</span>
                      <span className="profile-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="profile-dropdown-body">
                    <div className="dropdown-info">
                      <span className="info-label">Account Level</span>
                      <span className="info-badge">Verified Member</span>
                    </div>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              className={`btn btn-secondary btn-sm header-signin-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="tab-pane home-pane">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <div className="hero-tag">AI HEALTH VERIFICATION</div>
                <h1 className="hero-title">
                  AI Health Fake <br />
                  <span className="gradient-text">News Detection</span>
                </h1>
                <p className="hero-subtitle">
                  Verify health tips and medical information instantly with AI
                </p>
                <p className="hero-description">
                  Protect yourself from misleading health claims and misinformation. Our advanced precision AI validates medical content against peer-reviewed databases in seconds.
                </p>
                <div className="hero-actions">
                  <button className="btn btn-primary" onClick={() => setActiveTab('checker')}>
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Check Health News
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('about')}>
                    Learn More
                  </button>
                </div>
              </div>

              <div className="hero-visual">
                <div className="dashboard-card">
                  <div className="dashboard-header">
                    <div className="pulse-indicator"></div>
                    <span className="dashboard-tag">LIVE REPORTING SYSTEM</span>
                  </div>
                  
                  <div className="status-display">
                    <div className="status-shield">
                      <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <polyline points="12 22 12 12"></polyline>
                        <path d="M12 12h8"></path>
                        <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
                      </svg>
                    </div>
                    <div className="status-text-block">
                      <span className="status-label">STATUS</span>
                      <h3 className="status-value">Monitoring Active</h3>
                    </div>
                  </div>

                  <div className="recent-ticker-container">
                    <h4 className="ticker-title">Recent System Detections</h4>
                    <div className="ticker-list">
                      <div className="ticker-item fake">
                        <div className="ticker-dot"></div>
                        <div className="ticker-info">
                          <span className="ticker-statement">"Celery juice cures chronic eczema..."</span>
                          <span className="ticker-tag">FAKE (95%)</span>
                        </div>
                      </div>
                      <div className="ticker-item real">
                        <div className="ticker-dot"></div>
                        <div className="ticker-info">
                          <span className="ticker-statement">"Daily walk reduces stroke risk..."</span>
                          <span className="ticker-tag">REAL (99%)</span>
                        </div>
                      </div>
                      <div className="ticker-item fake">
                        <div className="ticker-dot"></div>
                        <div className="ticker-info">
                          <span className="ticker-statement">"Apple cider dissolves kidney stones..."</span>
                          <span className="ticker-tag">FAKE (87%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Features Grid */}
            <section className="features-section">
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-container">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="feature-title">AI Powered Analysis</h3>
                  <p className="feature-desc">
                    Advanced AI model detects medical misinformation across vast clinical datasets.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-container">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h3 className="feature-title">Real or Fake Detection</h3>
                  <p className="feature-desc">
                    Trustworthy vs misleading classification for mental peace and safety.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-container">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3 className="feature-title">Confidence Score</h3>
                  <p className="feature-desc">
                    Shows clear prediction percentage breakdown and reasoning details.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-container">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <h3 className="feature-title">Instant Verification</h3>
                  <p className="feature-desc">
                    Get accurate clinical verification results in a matter of seconds.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'checker' && (
          <div className="tab-pane checker-pane">
            {isAnalyzing && (
              <div className="card loading-card centered-checker-card">
                <div className="scanning-radar">
                  <div className="radar-circle circle-1"></div>
                  <div className="radar-circle circle-2"></div>
                  <div className="radar-circle circle-3"></div>
                  <div className="radar-scanner"></div>
                </div>
                <h3>Performing Clinical Analysis...</h3>
                <p className="text-muted">
                  Consulting PubMed abstracts, World Health Organization databases, FDA declarations, and Cochrane systematic reviews...
                </p>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{width: `${analysisProgress}%`}}></div>
                </div>
              </div>
            )}

            {!isAnalyzing && currentResult && (
              <div className="card result-card centered-checker-card">
                <div className="result-header">
                  <span className="result-tag">AI ANALYSIS REPORT</span>
                  <span className="result-date">Just now</span>
                </div>

                <div className="result-verdict-section">
                  <div className="verdict-block">
                    <span className="verdict-title">CLINICAL VERDICT</span>
                    <div className={`verdict-badge ${currentResult.verdict.toLowerCase()}`}>
                      {currentResult.verdict}
                    </div>
                  </div>
                  
                  <div className="score-block">
                    <div className="gauge-container">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className={`circle stroke-${currentResult.verdict.toLowerCase()}`}
                          strokeDasharray={`${currentResult.confidence}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="percentage">{currentResult.confidence}%</text>
                      </svg>
                    </div>
                    <span className="score-label">Confidence Score</span>
                  </div>
                </div>

                <div className="result-statement-box">
                  <span className="box-label">Claim Text</span>
                  <blockquote className="claim-quote">
                    "{currentResult.statement}"
                  </blockquote>
                </div>

                <div className="result-summary">
                  <h4>Evidence Summary</h4>
                  <p>{currentResult.summary}</p>
                </div>

                <div className="result-grid">
                  <div className="grid-item">
                    <span className="grid-label">Scientific Consensus</span>
                    <span className="grid-value">{currentResult.breakdown.consensus}</span>
                  </div>
                  <div className="grid-item">
                    <span className="grid-label">Clinical Study Pool</span>
                    <span className="grid-value">{currentResult.breakdown.datasetSize}</span>
                  </div>
                </div>

                <div className="result-references">
                  <h4>Database References Verified</h4>
                  <ul>
                    {currentResult.references.map((ref, idx) => (
                      <li key={idx}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', color: 'var(--primary)'}}>
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        {ref}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="result-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`Health Verification: "${currentResult.statement}" classified as ${currentResult.verdict} (${currentResult.confidence}% confidence).`);
                      alert("Report summary copied to clipboard!");
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share Report
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setCurrentResult(null);
                      setNewsInput('');
                    }}
                  >
                    Verify Another Claim
                  </button>
                </div>
              </div>
            )}

            {!isAnalyzing && !currentResult && (
              <div className="checker-new-container">
                {/* Microscope Circular Icon */}
                <div className="microscope-icon-outer">
                  <div className="microscope-icon-inner">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 18h12" />
                      <path d="M3 22h18" />
                      <path d="M14 22a7 7 0 1 0-14 0" />
                      <path d="M14 14a6 6 0 1 0-12 0" />
                      <path d="M14 20h.01" />
                      <path d="M17 3l3 3" />
                      <path d="M12 12l2.5 2.5" />
                    </svg>
                  </div>
                </div>

                <h1 className="checker-new-title">Check Your Health Information</h1>
                <p className="checker-new-subtitle">
                  Paste any medical news, advice, or claims below for AI-powered verification against trusted medical sources.
                </p>

                {/* Main Textarea Container Card */}
                <div className="checker-new-card card">
                  <div className="textarea-relative-wrapper">
                    <textarea
                      className="checker-new-textarea"
                      placeholder="Paste your health tip or medical news here..."
                      value={newsInput}
                      onChange={(e) => setNewsInput(e.target.value)}
                      maxLength={500}
                    />
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept=".txt" 
                      onChange={handleFileUpload} 
                    />
                    
                    <button 
                      className="textarea-upload-btn" 
                      onClick={triggerFileSelect}
                      title="Upload text file (.txt)"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                    </button>
                  </div>

                  <div className="checker-btn-wrapper">
                    <button
                      className="btn btn-primary check-news-submit-btn"
                      onClick={() => handleVerify()}
                      disabled={!newsInput.trim()}
                    >
                      Analyze Health News
                    </button>
                  </div>
                </div>

                {/* Preset Suggestions Teaser */}
                <div className="checker-new-presets-row">
                  <span className="presets-row-label">Try analyzing these claims:</span>
                  <div className="presets-row-buttons">
                    <button className="preset-row-btn" onClick={() => { setNewsInput("Drinking hot lemon water cures cancer."); handleVerify("Drinking hot lemon water cures cancer."); }}>Lemon Cancer Claim</button>
                    <button className="preset-row-btn" onClick={() => { setNewsInput("Vitamin C reduces cold duration."); handleVerify("Vitamin C reduces cold duration."); }}>Vitamin C Colds</button>
                    <button className="preset-row-btn" onClick={() => { setNewsInput("Intermittent fasting improves insulin sensitivity."); handleVerify("Intermittent fasting improves insulin sensitivity."); }}>Fasting & Insulin</button>
                  </div>
                </div>

                {/* Mockup Tags / Badges */}
                <div className="checker-badges-container">
                  <div className="checker-badge-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 11 12 14 16 10" />
                    </svg>
                    <span>Evidence Based</span>
                  </div>

                  <div className="checker-badge-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Privacy Preserved</span>
                  </div>

                  <div className="checker-badge-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>Real-time Analysis</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tab-pane history-pane">
            <div className="card">
              <div className="card-header-flex">
                <div>
                  <h2 className="section-title">Analysis Log History {!user && "(Guest mode)"}</h2>
                  <p className="section-subtitle">
                    {user ? "A permanent record of statements synced to your profile." : "A local browser log. Sign In in the header to save logs permanently."}
                  </p>
                </div>
                {history.length > 0 && (
                  <button className="btn btn-secondary btn-sm btn-danger-hover" onClick={handleClearHistory}>
                    Clear Logs
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="empty-history">
                  <svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '16px'}}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <h3>No logs recorded</h3>
                  <p className="text-muted">Start checking health statements in the Health Checker tab to compile a history registry.</p>
                  <button className="btn btn-primary" style={{marginTop: '16px'}} onClick={() => setActiveTab('checker')}>
                    Go to Health Checker
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Statement Claim</th>
                        <th>Classification</th>
                        <th>Confidence</th>
                        <th>Verified Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td className="table-statement">"{item.statement}"</td>
                          <td>
                            <span className={`table-badge ${item.verdict.toLowerCase()}`}>
                              {item.verdict}
                            </span>
                          </td>
                          <td className="table-confidence">{item.confidence}%</td>
                          <td className="table-date">{item.date}</td>
                          <td>
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={() => {
                                setNewsInput(item.statement);
                                handleVerify(item.statement);
                              }}
                            >
                              Re-Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="tab-pane about-pane">
            <div className="about-layout">
              <section className="about-card card">
                <h2>System Methodology & Data Integrity</h2>
                <p>
                  The AI Health Fake News Detection portal runs state-of-the-art Natural Language Processing (NLP) classifiers specialized in analyzing biochemical, pathological, and wellness-related statements. By comparing user statements against real-time medical knowledge indexes, our models trace claims back to peer-reviewed source literature.
                </p>
                
                <h3 style={{marginTop: '24px', marginBottom: '12px'}}>Verification Pipeline</h3>
                <div className="methodology-steps">
                  <div className="method-step">
                    <div className="step-num">1</div>
                    <h4>Semantic Extraction</h4>
                    <p>Extracts chemical compositions, diseases, therapies, and wellness assertions from the sentence input.</p>
                  </div>
                  <div className="method-step">
                    <div className="step-num">2</div>
                    <h4>Database Cross-Referencing</h4>
                    <p>Searches and compares terms against verified digital libraries including PMC, Cochrane, and WHO.</p>
                  </div>
                  <div className="method-step">
                    <div className="step-num">3</div>
                    <h4>Logical Consensus Alignment</h4>
                    <p>Analyzes the sentiment and medical claims of the references to score the validity (Real, Fake, Unverified).</p>
                  </div>
                </div>
              </section>

              <section className="sources-card card">
                <h2>Our Data Partners & Verification Sources</h2>
                <p className="text-muted" style={{marginBottom: '20px'}}>
                  We align our machine learning parameters with scientific evidence collected from the world's most trusted medical databases:
                </p>
                <div className="sources-grid">
                  <div className="source-item">
                    <h4>PubMed / MEDLINE</h4>
                    <p>National Library of Medicine's database containing 35+ million biomedical citations.</p>
                  </div>
                  <div className="source-item">
                    <h4>Cochrane Collaboration</h4>
                    <p>Systematic reviews and meta-analyses compiling evidence-based clinical outcomes.</p>
                  </div>
                  <div className="source-item">
                    <h4>World Health Organization (WHO)</h4>
                    <p>Global wellness registry and emerging epidemiological crisis reports.</p>
                  </div>
                  <div className="source-item">
                    <h4>US Food & Drug Administration (FDA)</h4>
                    <p>Public regulatory actions, drug approval transcripts, and dietary warning notices.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="tab-pane login-pane">
            <AuthPage 
              onLogin={handleLoginSuccess}
              onCancel={() => setActiveTab('home')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-title">Health Fake News Detection</span>
            <span className="footer-tagline">Precision Humanism in AI.</span>
          </div>
          <div className="footer-links">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Mockup Privacy Policy: Your analysis statements are processed client-side and not logged externally."); }}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Mockup Terms: This tool is for informational validation support and does not replace medical advice from qualified healthcare professionals."); }}>Terms of Service</a>
            <a href="#methodology" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }}>Scientific Methodology</a>
            <a href="#support" onClick={(e) => { e.preventDefault(); alert("For developer support or connection to a custom backend model, contact support@fakenewsdetector.ai"); }}>Contact Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">&copy; 2026 Health Fake News Detection. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
  )
}

// Sub-Component: AuthPage (handles login and signup views)
function AuthPage({ onLogin, onCancel }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {

    const endpoint = isSignUp
  ? "https://laks2006-fakesnews-dl.hf.space/register"
  : "https://laks2006-fakesnews-dl.hf.space/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || "Something went wrong");
      setIsLoading(false);
      return;
    }

    onLogin({
      name: data.name || name,
      email: email
    });

  } catch (error) {
    console.log(error);
    setError("Cannot connect to backend");
  }

  setIsLoading(false);
};

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: `${provider} User`,
        email: `${provider.toLowerCase()}user@example.com`
      });
    }, 1000);
  };

  return (
    <div className="auth-view-wrapper">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="12 8 12 12 14 14"></polyline>
            </svg>
          </div>
          <h1 className="auth-brand-text">Health Fake News Detection</h1>
          <p className="auth-brand-sub">Advanced AI verification framework for medical media</p>
        </div>

        {/* Auth form */}
        <div className="auth-form-wrapper">
          <div className="auth-tabs">
            <button 
              className={`auth-tab-link ${!isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(false); setError(''); }}
              disabled={isLoading}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab-link ${isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(true); setError(''); }}
              disabled={isLoading}
            >
              New Account
            </button>
          </div>

          {error && <div className="auth-error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="auth-name">Your Full Name</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    id="auth-name"
                    type="text"
                    className="auth-input-field"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="auth-email">Email Address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="auth-email"
                  type="email"
                  className="auth-input-field"
                  placeholder="e.g. name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="auth-password">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  id="auth-password"
                  type="password"
                  className="auth-input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="auth-form-buttons">
              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn" 
                disabled={isLoading}
                style={{ flex: 2 }}
              >
                {isLoading ? (
                  <div className="btn-loading-content">
                    <div className="spinner"></div>
                    <span>Securing...</span>
                  </div>
                ) : (
                  <>{isSignUp ? 'Create Account' : 'Sign In'}</>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onCancel}
                disabled={isLoading}
                style={{ flex: 1, borderRadius: '50px' }}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-text">Or Connect With</span>
          </div>

          {/* Social buttons */}
          <div className="auth-social-buttons">
            <button className="auth-social-btn" onClick={() => handleSocialLogin('Google')} disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.524 0-6.386-2.862-6.386-6.386 0-3.524 2.862-6.386 6.386-6.386 1.63 0 3.117.61 4.267 1.62l3.053-3.053C19.23 2.507 15.932 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.8 0 10.714-4.148 10.714-11 0-.707-.067-1.393-.186-2.057H12.24z"></path>
              </svg>
              Google
            </button>
            <button className="auth-social-btn" onClick={() => handleSocialLogin('Apple')} disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.63.72-1.18 1.86-1.03 2.97 1.12.09 2.26-.59 2.96-1.41z"></path>
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
