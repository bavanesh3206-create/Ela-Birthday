/* JavaScript Interactivity for Happy Birthday Appu Website */

// Database reset utility via URL parameter (?clear=true)
if (window.location.search.includes('clear=true')) {
  localStorage.removeItem('birthdaySiteAllAnswers');
  localStorage.removeItem('birthdaySiteWishes');
  localStorage.removeItem('birthdaySiteUnlocked');
  localStorage.removeItem('birthdaySiteUser');
  
  // Also clear the cloud database
  const targetBucket = "https://kvdb.io/A4PNJL8vAQBd23uWKJZLDu";
  fetch(`${targetBucket}/wishes`, { method: 'POST', body: JSON.stringify([]) });
  fetch(`${targetBucket}/answers`, { method: 'POST', body: JSON.stringify([]) });

  window.location.href = window.location.pathname; // Redirect to clean URL
}

const DB_URL = "https://kvdb.io/A4PNJL8vAQBd23uWKJZLDu";

// One-time automatic reset of legacy test data/wishes
if (!localStorage.getItem('birthdaySiteCleanResetDone')) {
  localStorage.removeItem('birthdaySiteAllAnswers');
  localStorage.removeItem('birthdaySiteWishes');
  localStorage.removeItem('birthdaySiteUnlocked');
  localStorage.removeItem('birthdaySiteUser');
  localStorage.setItem('birthdaySiteCleanResetDone', 'true');
}

// 1. Memory Assets configuration
const MEMORY_PHOTOS = [
  "Ela_Pic/1651499041164-01.jpg",
  "Ela_Pic/School_Pic_1.jpg",
  "Ela_Pic/School_Pic_2.jpg",
  "Ela_Pic/School_Pic_3.jpg",
  "Ela_Pic/School_Pic_4.jpg",
  "Ela_Pic/School_Pic_5.jpg",
  "Ela_Pic/20190811_143901~2.jpg",
  "Ela_Pic/20250829_081902.jpg",
  "Ela_Pic/20260130_231923.jpg",
  "Ela_Pic/IMG-20220425-WA0007.jpg",
  "Ela_Pic/IMG-20260524-WA0002.jpg",
  "Ela_Pic/IMG20230504170135_02.jpg",
  "Ela_Pic/IMG_20200308_131718.jpg",
  "Ela_Pic/IMG_20220612_125801_463.jpg",
  "Ela_Pic/IMG_20230610_183203_172.jpg",
  "Ela_Pic/IMG_20260105_132523.jpg",
  "Ela_Pic/Little_Appu.png",
  "Ela_Pic/MCE_0847_1.jpg",
  "Ela_Pic/Me_Amma_2.png",
  "Ela_Pic/Me_Amma.png",
  "Ela_Pic/Me_Dad.png",
  "Ela_Pic/Pic_Bhunaa.png",
  "Ela_Pic/Pic_Pavi.png",
  "Ela_Pic/PicsArt_05-21-07.57.49.jpg",
  "Ela_Pic/Profile.jpg",
  "Ela_Pic/RUID1528872e0e374e7487f54dea6a4a0891.jpeg",
  "Ela_Pic/Schl_Pic.jpeg",
  "Ela_Pic/Screenshot_20251213_093551_Photos.jpg",
  "Ela_Pic/WA_1779603428885.jpeg",
  "Ela_Pic/WA_1779603709926.jpeg",
  "Ela_Pic/WA_1779603987467.jpeg",
  "Ela_Pic/WA_1779604022984.jpeg",
  "Ela_Pic/WA_1779604382271.jpeg",
  "Ela_Pic/WA_1780641603037.jpeg",
  "Ela_Pic/WA_1780642268013.jpeg",
  "Ela_Pic/WA_1780642621824.jpeg",
  "Ela_Pic/WA_1780642951176.jpeg",
  "Ela_Pic/WA_1780642963315.jpeg",
  "Ela_Pic/WA_1780643004867.jpeg",
  "Ela_Pic/WA_1780643029835.jpeg",
  "Ela_Pic/WA_1780644634262.jpeg",
  "Ela_Pic/We_Three.jpeg",
  "Ela_Pic/We_Two.jpg",
  "Ela_Pic/file_00000000321c71fa91782097f8d1abcd.png",
  "Ela_Pic/file_0000000050fc7206aa6be77d98e80233.png",
  "Ela_Pic/file_000000005dec71fabfe2cff397e2df01.png",
  "Ela_Pic/file_000000007a1c71fa83a24bb21fbfa53d.png",
  "Ela_Pic/file_00000000ea887207bd81d0f5fad3776b.png",
  "Ela_Pic/our_First_movie.png"
];

const MEMORY_VIDEOS = [];

const SLIDE_IMAGES = [
  { class: 'slide-childhood', url: 'Ela_Pic/Little_Appu.png', label: 'Childhood Memories' },
  { class: 'slide-school', url: 'Ela_Pic/Schl_Pic.jpeg', label: 'School Days' },
  { class: 'slide-family', url: 'Ela_Pic/We_Three.jpeg', label: 'Family Time' },
  { class: 'slide-recent', url: 'Ela_Pic/Profile.jpg', label: 'Recent Highlights' }
];

// Onboarding Quiz Questions Pool (again and again ask new question - dynamic 3 questions selected)
const QUESTIONS_POOL = [
  "What is your favorite memory of us growing up together?",
  "What is a dream or career goal you want to achieve this year?",
  "If you have chance to travel anywhere, where would you go and why?",
  "What makes you Happy?",
  "What is one thing you want to achieve this year?",
  "What is the happiest moment you've experienced recently?",
  "Do you tell Something for me?",
  "Ask Gift For your Birthday,I will definitely buy you-Annaa think and tell",
  "What's one thing you will never forget about our childhood?",
  "Who has had the biggest impact on your life and why?"
];
let GATE_QUESTIONS = [];

function selectRandomQuestions() {
  const shuffled = [...QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  GATE_QUESTIONS = shuffled.slice(0, 3);
}

// 2. State & Variables
let currentQuestionIndex = 0;
const userAnswers = [];
let slideInterval = null;
let currentSlideIndex = 0;
let isAudioPlaying = false;
let floatInterval = null;
let currentUserName = "Elavarasan (Appu)";
let currentUserRelation = "Birthday Boy";

// DOM Elements
const body = document.body;
const gateOverlay = document.getElementById('gateOverlay');
const gateStepWelcome = document.getElementById('gateStepWelcome');
const gateStepGuestInfo = document.getElementById('gateStepGuestInfo');
const gateSubmitGuestInfo = document.getElementById('gateSubmitGuestInfo');
const gateGuestName = document.getElementById('gateGuestName');
const gateGuestRelation = document.getElementById('gateGuestRelation');
const gateStepWait = document.getElementById('gateStepWait');
const gateStepQuestion = document.getElementById('gateStepQuestion');
const gateStepCelebrate = document.getElementById('gateStepCelebrate');
const gateUserEla = document.getElementById('gateUserEla');
const gateUserGuest = document.getElementById('gateUserGuest');
const gateWaitMsg = document.getElementById('gateWaitMsg');
const gateProgressBar = document.getElementById('gateProgressBar');
const gateTimerSec = document.getElementById('gateTimerSec');
const gateQuestionProgress = document.getElementById('gateQuestionProgress');
const gateQuestionText = document.getElementById('gateQuestionText');
const gateAnswer = document.getElementById('gateAnswer');
const gateCharCount = document.getElementById('gateCharCount');
const gateSubmitAnswer = document.getElementById('gateSubmitAnswer');
const gateLetsCelebrate = document.getElementById('gateLetsCelebrate');
const blastFlash = document.getElementById('blastFlash');
const mainSite = document.getElementById('mainSite');
const savedAnswersList = document.getElementById('savedAnswersList');
const answersEmpty = document.getElementById('answersEmpty');
const logoutBtn = document.getElementById('logoutBtn');

// Nav & Music Elements
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

// Countdown variables
const countdownGrid = document.getElementById('countdownGrid');
const countdownComplete = document.getElementById('countdownComplete');
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins = document.getElementById('cdMins');
const cdSecs = document.getElementById('cdSecs');

// Form Elements
const wishForm = document.getElementById('wishForm');
const wishName = document.getElementById('wishName');
const wishRelation = document.getElementById('wishRelation');
const wishMessage = document.getElementById('wishMessage');
const wishFormNote = document.getElementById('wishFormNote');
const messagesWall = document.getElementById('messagesWall');
const messagesEmpty = document.getElementById('messagesEmpty');

// Canvas Fireworks
const fireworksCanvas = document.getElementById('fireworks');
const ctx = fireworksCanvas.getContext('2d');
let fireworks = [];
let particles = [];
let fireworksAnimationId = null;

// Initial load check
document.addEventListener('DOMContentLoaded', () => {
  // Create dynamic scroll progress indicator
  const scrollBar = document.createElement('div');
  scrollBar.className = 'scroll-progress';
  document.body.appendChild(scrollBar);
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      scrollBar.style.width = scrolled + '%';
    }
  });

  initScrollReveals();
  setupCountdown();
  setupSlider();
  setupMemoriesGrid();
  loadCloudData();

  const isUnlocked = localStorage.getItem('birthdaySiteUnlocked') === 'true';
  if (isUnlocked) {
    unlockSiteInstant();
  } else {
    setupGateParticles();
    // Role bindings
    gateUserEla.addEventListener('click', startElaOnboarding);
    gateUserGuest.addEventListener('click', goToGuestInfoFlow);
  }

  // Set up events
  logoutBtn.addEventListener('click', lockSite);
  musicBtn.addEventListener('click', toggleMusic);
  wishForm.addEventListener('submit', handleWishSubmit);
  navToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when nav link is clicked
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-active');
    });
  });

  // Lightbox container for media expansion
  createLightbox();

  // Celebrate again button
  document.getElementById('celebrateBtn').addEventListener('click', () => {
    triggerCelebrationEffects();
  });
});

// 3. Onboarding Gate Logic
function setupGateParticles() {
  const gateParticlesContainer = document.getElementById('gateParticles');
  if (!gateParticlesContainer) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('span');
    const size = Math.random() * 3 + 1;
    p.style.position = 'absolute';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.backgroundColor = 'rgba(255, 255, 255, ' + (Math.random() * 0.3 + 0.1) + ')';
    p.style.borderRadius = '50%';
    p.style.top = Math.random() * 100 + '%';
    p.style.left = Math.random() * 100 + '%';
    p.style.animation = `floatStar ${Math.random() * 10 + 10}s infinite linear`;
    gateParticlesContainer.appendChild(p);
  }
}

// Custom style for floating stars
const styleElement = document.createElement('style');
styleElement.innerHTML = `
@keyframes floatStar {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}`;
document.head.appendChild(styleElement);

function startElaOnboarding() {
  currentUserName = "Mr.Elavarasan";
  currentUserRelation = "Birthday Boy";
  startGateOnboarding();
}

function goToGuestInfoFlow() {
  gateStepWelcome.classList.remove('gate-step-active');
  gateStepWelcome.style.display = 'none';

  gateStepGuestInfo.style.display = 'block';
  setTimeout(() => gateStepGuestInfo.classList.add('gate-step-active'), 50);

  gateSubmitGuestInfo.onclick = () => {
    const nameVal = gateGuestName.value.trim();
    const relVal = gateGuestRelation.value.trim();
    if (!nameVal || !relVal) return;

    currentUserName = nameVal;
    currentUserRelation = relVal;

    gateStepGuestInfo.classList.remove('gate-step-active');
    gateStepGuestInfo.style.display = 'none';

    // Transition guest directly to celebrate step, skipping wait loader and questions
    const titleEl = gateStepCelebrate.querySelector('.gate-title-sm');
    const hintEl = gateStepCelebrate.querySelector('.gate-hint');
    if (titleEl) titleEl.innerHTML = `Welcome, ${currentUserName}! 🎉`;
    if (hintEl) hintEl.innerHTML = "Get ready — the website will blast with celebration!";

    gateStepCelebrate.style.display = 'block';
    setTimeout(() => gateStepCelebrate.classList.add('gate-step-active'), 50);

    gateLetsCelebrate.onclick = unlockCelebration;
  };
}

function startGateOnboarding() {
  // Select 3 random questions from the pool
  selectRandomQuestions();

  // Make sure to hide welcome/guest info if active
  gateStepWelcome.classList.remove('gate-step-active');
  gateStepWelcome.style.display = 'none';
  if (gateStepGuestInfo) {
    gateStepGuestInfo.classList.remove('gate-step-active');
    gateStepGuestInfo.style.display = 'none';
  }
  
  gateStepWait.style.display = 'block';
  setTimeout(() => gateStepWait.classList.add('gate-step-active'), 50);

  let waitTime = 10;
  let elapsed = 0;
  gateTimerSec.textContent = waitTime;
  
  const loadingMessages = [
    "Loading childhood photos...",
    "Arranging memory mosaic grid...",
    "Gathering messages from family & friends...",
    "Whispering wishes to the universe...",
    "Polishing fireworks display...",
    "Syncing background melodies...",
    "Writing cosmic letters...",
    "Preparing the celebration blast..."
  ];

  const waitInterval = setInterval(() => {
    elapsed += 0.2;
    const progress = (elapsed / waitTime) * 100;
    gateProgressBar.style.width = progress + '%';
    
    const secondsLeft = Math.ceil(waitTime - elapsed);
    gateTimerSec.textContent = secondsLeft > 0 ? secondsLeft : 0;

    // Random loading text update
    if (Math.round(elapsed * 5) % 8 === 0) {
      const idx = Math.floor(Math.random() * loadingMessages.length);
      gateWaitMsg.textContent = loadingMessages[idx];
    }

    if (elapsed >= waitTime) {
      clearInterval(waitInterval);
      transitionToQuestion(0);
    }
  }, 200);
}

function transitionToQuestion(index) {
  currentQuestionIndex = index;
  
  gateStepWait.classList.remove('gate-step-active');
  gateStepWait.style.display = 'none';
  gateStepQuestion.style.display = 'block';
  setTimeout(() => gateStepQuestion.classList.add('gate-step-active'), 50);

  // Setup question step UI
  gateQuestionProgress.textContent = `Quick Question ${index + 1} of ${GATE_QUESTIONS.length}`;
  gateQuestionText.textContent = GATE_QUESTIONS[index];
  gateAnswer.value = '';
  gateCharCount.textContent = "0 characters";
  gateSubmitAnswer.textContent = index === GATE_QUESTIONS.length - 1 ? "Finish Quiz 🎂" : "Next Question →";
  gateSubmitAnswer.disabled = false; // Always enabled (no limit)

  // Add event input listener to update characters count
  gateAnswer.oninput = (e) => {
    const val = e.target.value.trim();
    gateCharCount.textContent = `${val.length} characters`;
    gateSubmitAnswer.disabled = false; // Always enabled (no limit)
  };

  gateSubmitAnswer.onclick = submitAnswer;
}

function submitAnswer() {
  const ans = gateAnswer.value.trim() || "Happy Birthday!"; // Default if empty

  userAnswers.push({
    question: GATE_QUESTIONS[currentQuestionIndex],
    answer: ans
  });

  if (currentQuestionIndex < GATE_QUESTIONS.length - 1) {
    transitionToQuestion(currentQuestionIndex + 1);
  } else {
    // End questions, transition to celebrate step
    gateStepQuestion.classList.remove('gate-step-active');
    gateStepQuestion.style.display = 'none';

    // Customize celebrate screen
    const titleEl = gateStepCelebrate.querySelector('.gate-title-sm');
    const hintEl = gateStepCelebrate.querySelector('.gate-hint');
    if (currentUserName === "Elavarasan") {
      if (titleEl) titleEl.innerHTML = "All done, Annaa! 🎉";
      if (hintEl) hintEl.innerHTML = "Your answers are saved.<br />Get ready — the website will blast with celebration!";
    } else {
      if (titleEl) titleEl.innerHTML = `All done, ${currentUserName}! 🎉`;
      if (hintEl) hintEl.innerHTML = "Your answers are saved.<br />Get ready — the website will blast with celebration!";
    }

    gateStepCelebrate.style.display = 'block';
    setTimeout(() => gateStepCelebrate.classList.add('gate-step-active'), 50);

    gateLetsCelebrate.onclick = unlockCelebration;
  }
}

async function saveAnswersPermanently(name, relation, answers) {
  let list = [];
  try {
    console.log("Fetching latest answers from cloud to merge...");
    const res = await fetch(`${DB_URL}/answers`);
    if (res.ok) {
      list = await res.json();
    } else {
      const allData = localStorage.getItem('birthdaySiteAllAnswers');
      list = allData ? JSON.parse(allData) : [];
    }
  } catch (e) {
    const allData = localStorage.getItem('birthdaySiteAllAnswers');
    list = allData ? JSON.parse(allData) : [];
  }
  
  list.push({
    name: name,
    relation: relation,
    answers: answers,
    time: Date.now()
  });
  
  localStorage.setItem('birthdaySiteAllAnswers', JSON.stringify(list));
  console.log("Saved to local storage. Current list:", list);

  try {
    await fetch(`${DB_URL}/answers`, {
      method: 'POST',
      body: JSON.stringify(list)
    });
    console.log("Saved answers to cloud successfully!");
  } catch (e) {
    console.error("Failed to save answers to cloud:", e);
  }
}

function renderAllAnswers() {
  // Migration safeguard for legacy answers
  const allData = localStorage.getItem('birthdaySiteAllAnswers');
  if (!allData) {
    const legacyAnswers = localStorage.getItem('birthdaySiteAnswers');
    if (legacyAnswers) {
      saveAnswersPermanently("Elavarasan (Appu)", "Birthday Boy", JSON.parse(legacyAnswers));
    }
  }

  const updatedData = localStorage.getItem('birthdaySiteAllAnswers');
  const list = updatedData ? JSON.parse(updatedData) : [];
  console.log("Rendering all answers. Current list loaded:", list);
  
  if (list.length === 0) {
    answersEmpty.classList.remove('hidden');
    savedAnswersList.innerHTML = '';
    return;
  }
  
  answersEmpty.classList.add('hidden');
  
  savedAnswersList.innerHTML = list.map(userEntry => {
    const name = userEntry.name || "Elavarasan (Appu)";
    const relation = userEntry.relation || "Birthday Boy";
    const cleanedName = name.replace(/[^a-zA-Z0-9\s]/g, '');
    const initials = cleanedName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || "🎂";
    
    const qaHtml = (userEntry.answers || []).map(qa => `
      <div class="answer-item" style="margin-top: 14px; border-left: 2px solid rgba(255, 255, 255, 0.08); padding-left: 14px; text-align: left;">
        <p class="answer-question" style="font-family: var(--font-serif); font-size: 16px; color: var(--primary); margin-bottom: 4px; font-weight: 500;">Q: ${qa.question}</p>
        <p class="answer-response" style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5; font-style: italic;">"${qa.answer}"</p>
      </div>
    `).join('');
    
    return `
      <div class="answer-card glass-card" style="padding: 24px; margin-bottom: 20px;">
        <div class="message-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
          <div class="message-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: var(--bg-color); flex-shrink: 0;">${initials}</div>
          <div class="message-meta" style="flex-grow: 1; min-width: 0; text-align: left;">
            <div class="message-name" style="font-size: 14px; font-weight: 600; color: var(--text-primary);">${name}</div>
            <div class="message-rel" style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">${relation}</div>
          </div>
        </div>
        ${qaHtml}
      </div>
    `;
  }).join('');
}

async function loadCloudData() {
  try {
    console.log("Loading wishes from cloud DB...");
    const wishesRes = await fetch(`${DB_URL}/wishes`);
    let wishes = [];
    if (wishesRes.ok) {
      wishes = await wishesRes.json();
      console.log("Loaded wishes from cloud successfully:", wishes);
      saveLocalWishes(wishes);
    } else {
      console.log("Wishes key not found or error. Loading local wishes fallback.");
      wishes = getLocalWishes();
      if (wishes.length === 0) {
        wishes = DEFAULT_WISHES;
      }
    }
    renderWishes(wishes);
  } catch (e) {
    console.error("Failed to load wishes from cloud, falling back to local:", e);
    renderWishes(getLocalWishes());
  }

  try {
    console.log("Loading quick answers from cloud DB...");
    const answersRes = await fetch(`${DB_URL}/answers`);
    if (answersRes.ok) {
      const answers = await answersRes.json();
      console.log("Loaded quick answers from cloud successfully:", answers);
      localStorage.setItem('birthdaySiteAllAnswers', JSON.stringify(answers));
    } else {
      console.log("No answers found in cloud DB or error:", answersRes.status);
    }
    renderAllAnswers();
  } catch (e) {
    console.error("Failed to load answers from cloud, falling back to local:", e);
    renderAllAnswers();
  }
}

async function saveCloudWishes(wishesArray) {
  saveLocalWishes(wishesArray);
  try {
    await fetch(`${DB_URL}/wishes`, {
      method: 'POST',
      body: JSON.stringify(wishesArray)
    });
    console.log("Saved wishes to cloud successfully!");
  } catch (e) {
    console.error("Failed to save wishes to cloud:", e);
  }
}

async function unlockCelebration() {
  console.log("Unlocking celebration. Current user:", currentUserName, "Relation:", currentUserRelation, "Answers count:", userAnswers.length);
  // Store Answers (only if Elavarasan, because guests skip quiz)
  const isEla = currentUserName.includes("Elavarasan") || currentUserRelation === "Birthday Boy";
  if (isEla && userAnswers.length > 0) {
    await saveAnswersPermanently(currentUserName, currentUserRelation, userAnswers);
  }
  localStorage.setItem('birthdaySiteUnlocked', 'true');
  localStorage.setItem('birthdaySiteUser', isEla ? 'elavarasan' : 'guest');

  // Trigger unlock animations
  gateOverlay.style.opacity = '0';
  setTimeout(() => {
    gateOverlay.style.visibility = 'hidden';
    gateOverlay.classList.remove('gate-step-active');
  }, 800);

  // Flash white blast
  blastFlash.style.opacity = '1';
  setTimeout(() => {
    blastFlash.style.transition = 'opacity 1.5s ease-out';
    blastFlash.style.opacity = '0';
  }, 100);

  // Unlock site
  body.classList.remove('site-locked');
  mainSite.removeAttribute('aria-hidden');

  // Render answers
  renderAllAnswers();
  
  // Render wishes from localStorage
  renderWishes(getLocalWishes());

  // Play background music
  bgMusic.volume = 0.5;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.music-label').textContent = 'Playing';
    }).catch(error => {
      console.warn("Autoplay was prevented. Click the Music button in navigation to enable.", error);
    });
  }

  // Trigger animation elements
  triggerCelebrationEffects();
  startFloatShuffle();
}

function unlockSiteInstant() {
  body.classList.remove('site-locked');
  gateOverlay.style.display = 'none';
  gateOverlay.style.visibility = 'hidden';
  mainSite.removeAttribute('aria-hidden');

  // Render all answers
  renderAllAnswers();
  // Render wishes
  renderWishes(getLocalWishes());
  startFloatShuffle();
}

function lockSite() {
  localStorage.removeItem('birthdaySiteUnlocked');
  localStorage.removeItem('birthdaySiteUser');
  
  // Pause audio
  bgMusic.pause();
  isAudioPlaying = false;
  musicBtn.classList.remove('playing');
  musicBtn.querySelector('.music-label').textContent = 'Music';

  // Reload page to reset states and show welcome overlay again
  window.location.reload();
}

// 4. Music Management
function toggleMusic() {
  if (isAudioPlaying) {
    bgMusic.pause();
    isAudioPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.querySelector('.music-label').textContent = 'Music';
  } else {
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      isAudioPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.music-label').textContent = 'Playing';
    }).catch(err => {
      console.error("Audio failed to play", err);
    });
  }
}

// 5. Countdown System (Dynamic Year Rollover)
function setupCountdown() {
  function getTargetDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Target birthday this year: June 9, currentYear
    let target = new Date(`${currentYear}-06-09T00:00:00`).getTime();
    
    // We let the birthday complete screen show on June 9 (till 23:59:59)
    const birthdayEnd = new Date(`${currentYear}-06-09T23:59:59`).getTime();
    
    if (now.getTime() > birthdayEnd) {
      // Roll over target to June 9 of the next year
      target = new Date(`${currentYear + 1}-06-09T00:00:00`).getTime();
    }
    
    return target;
  }

  let targetDate = getTargetDate();

  function updateTimer() {
    const now = new Date().getTime();
    targetDate = getTargetDate(); // Recalculate dynamically
    
    const diff = targetDate - now;

    // Check if it is currently June 9 (birthday)
    const today = new Date();
    if (today.getMonth() === 5 && today.getDate() === 9) { // 5 is June (0-indexed)
      countdownGrid.classList.add('hidden');
      countdownComplete.classList.remove('hidden');
      return;
    }

    if (diff <= 0) {
      countdownGrid.classList.add('hidden');
      countdownComplete.classList.remove('hidden');
      return;
    }

    countdownGrid.classList.remove('hidden');
    countdownComplete.classList.add('hidden');

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent = String(mins).padStart(2, '0');
    cdSecs.textContent = String(secs).padStart(2, '0');
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

// 6. Photo & Video Slider Setup (Single Static Frame)
function setupSlider() {
  const photoSlider = document.getElementById('photoSlider');
  if (!photoSlider) return;

  photoSlider.innerHTML = `
    <div class="slider-slide active" style="background-image: url('${SLIDE_IMAGES[3].url}')"></div>
  `;
}

// 7. Background Floaters Shuffling
function startFloatShuffle() {
  if (floatInterval) clearInterval(floatInterval);
  
  const memoryLayer = document.getElementById('memoryShuffleLayer');
  if (!memoryLayer) return;
  
  // Clear any existing photos
  memoryLayer.innerHTML = '';
  
  // Get correct document height
  const documentHeight = Math.max(
    document.body.scrollHeight, 
    document.documentElement.scrollHeight,
    mainSite.offsetHeight || 5000
  );
  
  // We want multiple images visible in every place (e.g. at every Y coordinate interval)
  // Let's divide the document height into segments of about 450px.
  // In each segment, we place one left and one right photo (ensuring "two or more images in every place").
  const segmentHeight = 450;
  const numSegments = Math.ceil(documentHeight / segmentHeight);
  
  const spawnedPhotos = [];
  
  for (let i = 0; i < numSegments; i++) {
    // Generate both a left photo and a right photo for this segment (ensuring at least 2 images per section/viewport)
    const positions = [
      { isLeft: true, xMin: 2, xMax: 15 },
      { isLeft: false, xMin: 65, xMax: 78 }
    ];
    
    positions.forEach(pos => {
      const startX = Math.random() * (pos.xMax - pos.xMin) + pos.xMin;
      const startY = i * segmentHeight + Math.random() * (segmentHeight - 240); // Random Y offset in this segment
      
      if (startY + 240 > documentHeight) return; // Don't overflow the document bottom boundary
      
      const randomPhoto = MEMORY_PHOTOS[Math.floor(Math.random() * MEMORY_PHOTOS.length)];
      const floater = document.createElement('div');
      floater.className = 'floating-photo';
      floater.style.backgroundImage = `url('${randomPhoto}')`;
      
      // Dynamic size: little big (240px to 340px)
      const size = Math.random() * 100 + 240;
      floater.style.width = size + 'px';
      floater.style.height = size + 'px';
      
      // Scale and rotation
      const scale = Math.random() * 0.2 + 0.9; // Scale between 0.9 and 1.1
      const rot = Math.random() * 24 - 12; // rotation between -12deg and 12deg
      
      floater.style.left = startX + '%';
      floater.style.top = startY + 'px';
      floater.style.transform = `scale(${scale}) rotate(${rot}deg)`;
      
      memoryLayer.appendChild(floater);
      spawnedPhotos.push(floater);
      
      // Fade in smoothly with small stagger
      setTimeout(() => {
        floater.classList.add('visible');
      }, i * 40);
    });
  }

  // Shuffle logic: every 3 seconds, pick one photo randomly, fade it out, replace it with a new photo, and fade it back in.
  floatInterval = setInterval(() => {
    if (spawnedPhotos.length === 0) return;
    
    const randomIdx = Math.floor(Math.random() * spawnedPhotos.length);
    const targetFloater = spawnedPhotos[randomIdx];
    
    // Fade out transition
    targetFloater.style.transition = 'opacity 1.5s ease-in-out, transform 12s cubic-bezier(0.16, 1, 0.3, 1)';
    targetFloater.style.opacity = '0';
    
    setTimeout(() => {
      // Pick another random photo
      const newPhoto = MEMORY_PHOTOS[Math.floor(Math.random() * MEMORY_PHOTOS.length)];
      targetFloater.style.backgroundImage = `url('${newPhoto}')`;
      
      // Fade back in (restores class opacity)
      targetFloater.style.opacity = '';
    }, 1500);
  }, 3000);

  // Monitor document height expansion (e.g. if new wishes are dynamically loaded or size changes)
  // Re-run startFloatShuffle if document height changes significantly to ensure coverage.
  setTimeout(() => {
    const currentDocHeight = document.documentElement.scrollHeight;
    if (Math.abs(currentDocHeight - documentHeight) > 400) {
      startFloatShuffle();
    }
  }, 1500);
}

// 8. Memories Mosaic Shuffling Grid
function setupMemoriesGrid() {
  const memoriesMosaic = document.getElementById('memoriesMosaic');
  if (!memoriesMosaic) return;

  // Let's pair and compile media files (shuffle images first)
  const shuffledImages = [...MEMORY_PHOTOS].sort(() => Math.random() - 0.5);
  const mediaList = [];

  // Interleave videos into the photos
  let photoIdx = 0;
  let videoIdx = 0;

  for (let i = 0; i < shuffledImages.length + MEMORY_VIDEOS.length; i++) {
    // Add a video card every 6 elements, if videos remain
    if (i > 0 && i % 6 === 0 && videoIdx < MEMORY_VIDEOS.length) {
      mediaList.push({
        type: 'video',
        url: MEMORY_VIDEOS[videoIdx],
        title: `Moment ${videoIdx + 1}`,
        era: 'Videos'
      });
      videoIdx++;
    } else if (photoIdx < shuffledImages.length) {
      // Add photos
      const filename = shuffledImages[photoIdx].split('/').pop();
      let label = '';
      let tag = 'Appu';

      if (filename === 'School_Pic_1.jpg') { label = 'College Friends'; tag = '2022'; }
      else if (filename === 'School_Pic_2.jpg') { label = 'School Life - XII "C"'; tag = '2019'; }
      else if (filename === 'School_Pic_3.jpg') { label = 'School Life - 8th "C"'; tag = '2015'; }
      else if (filename === 'School_Pic_4.jpg') { label = 'School Life - 9th "B"'; tag = '2016'; }
      else if (filename === 'School_Pic_5.jpg') { label = 'School Life - 10th "D"'; tag = '2017'; }
      else if (filename.includes('IMG_2020')) { label = 'College Days'; tag = '2020'; }
      else if (filename.includes('IMG_2022') || filename.includes('WA0007')) { label = 'School/Friends'; tag = '2022'; }
      else if (filename.includes('2025')) { label = 'Family Travels'; tag = '2025'; }
      else if (filename.includes('2026') || filename.includes('WA0001')) { label = 'Recent Memory'; tag = '2026'; }

      mediaList.push({
        type: 'image',
        url: shuffledImages[photoIdx],
        title: label,
        era: tag
      });
      photoIdx++;
    }
  }

  // Create layout templates (classes) for mosaic grid
  memoriesMosaic.innerHTML = mediaList.map((media, index) => {
    let spanClass = '';
    // Custom template structure based on indexes for variety
    if (index % 7 === 0) spanClass = 'large';
    else if (index % 5 === 0) spanClass = 'wide';
    else if (index % 3 === 0) spanClass = 'tall';

    if (media.type === 'video') {
      return `
        <div class="mosaic-card premium-frame ${spanClass} reveal" data-type="video" data-url="${media.url}">
          <div class="premium-inner">
            <video class="mosaic-video" muted loop playsinline preload="metadata">
              <source src="${media.url}" type="video/mp4">
            </video>
            <span class="mosaic-badge">Video 🎥</span>
          </div>
          <div class="premium-caption">
            <h3>${media.title}</h3>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="mosaic-card premium-frame ${spanClass} reveal" data-type="image" data-url="${media.url}">
          <div class="premium-inner">
            <img class="mosaic-image" src="${media.url}" alt="Memory photo for Appu" loading="lazy" />
          </div>
          ${media.title ? `
          <div class="premium-caption">
            <h3>${media.title}</h3>
          </div>` : ''}
        </div>
      `;
    }
  }).join('');

  // Add Hover play/pause video listeners
  const videoCards = memoriesMosaic.querySelectorAll('.mosaic-card[data-type="video"]');
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => {
      video.play().catch(e => console.log('Autoplay blocked hover', e));
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
    });
  });

  // Lightbox triggers
  const cards = memoriesMosaic.querySelectorAll('.mosaic-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-type');
      const url = card.getAttribute('data-url');
      openLightbox(type, url);
    });
  });

  // Re-init reveals after rendering the grid
  initScrollReveals();
}

// 9. Lightbox Modal Creator
function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightboxOverlay';
  lightbox.style.position = 'fixed';
  lightbox.style.top = '0';
  lightbox.style.left = '0';
  lightbox.style.width = '100%';
  lightbox.style.height = '100%';
  lightbox.style.backgroundColor = 'rgba(8, 5, 20, 0.95)';
  lightbox.style.zIndex = '99999';
  lightbox.style.display = 'none';
  lightbox.style.justifyContent = 'center';
  lightbox.style.alignItems = 'center';
  lightbox.style.padding = '40px';
  lightbox.style.cursor = 'zoom-out';
  lightbox.style.backdropFilter = 'blur(10px)';

  lightbox.innerHTML = `
    <button id="lightboxClose" style="position: absolute; top: 25px; right: 25px; background: none; border: none; font-size: 32px; color: #fff; cursor: pointer; transition: color 0.2s;">×</button>
    <div id="lightboxContent" style="max-width: 100%; max-height: 90vh; pointer-events: auto; display: flex; align-items: center; justify-content: center;"></div>
  `;

  document.body.appendChild(lightbox);

  lightbox.addEventListener('click', closeLightbox);
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  
  // Hover close effects
  document.getElementById('lightboxClose').onmouseenter = (e) => e.target.style.color = '#a78bfa';
  document.getElementById('lightboxClose').onmouseleave = (e) => e.target.style.color = '#fff';
}

function openLightbox(type, url) {
  const lightbox = document.getElementById('lightboxOverlay');
  const content = document.getElementById('lightboxContent');
  if (!lightbox || !content) return;

  content.innerHTML = '';
  
  if (type === 'video') {
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.autoplay = true;
    video.style.maxWidth = '90vw';
    video.style.maxHeight = '80vh';
    video.style.borderRadius = '12px';
    video.style.border = '1px solid rgba(255,255,255,0.1)';
    video.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
    content.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '80vh';
    img.style.borderRadius = '12px';
    img.style.objectFit = 'contain';
    img.style.border = '1px solid rgba(255,255,255,0.1)';
    img.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
    content.appendChild(img);
  }

  lightbox.style.display = 'flex';
  body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightboxOverlay');
  const content = document.getElementById('lightboxContent');
  if (!lightbox) return;

  lightbox.style.display = 'none';
  content.innerHTML = '';
  
  // Re-enable scroll only if site is unlocked
  if (!body.classList.contains('site-locked')) {
    body.style.overflow = '';
  }
}

// 10. Wish Wall system
const DEFAULT_WISHES = [];

function setupWishWall() {
  let wishes = getLocalWishes();
  if (wishes.length === 0) {
    wishes = DEFAULT_WISHES;
    saveLocalWishes(wishes);
  }

  renderWishes(wishes);
}

function getLocalWishes() {
  const data = localStorage.getItem('birthdaySiteWishes');
  let wishes = data ? JSON.parse(data) : [];
  // Clean up legacy quiz answers that were previously saved as wishes
  return wishes.filter(w => !(w.name === "Elavarasan" && w.relation === "Birthday Boy" && w.message.startsWith("Q:")));
}

function saveLocalWishes(wishesArray) {
  localStorage.setItem('birthdaySiteWishes', JSON.stringify(wishesArray));
}

function renderWishes(wishesArray) {
  messagesWall.innerHTML = '';

  if (wishesArray.length === 0) {
    messagesEmpty.classList.remove('hidden');
    return;
  }
  
  messagesEmpty.classList.add('hidden');

  // Render cards sorted by timestamp descending
  [...wishesArray].sort((a,b) => b.time - a.time).forEach(wish => {
    const card = document.createElement('div');
    card.className = 'message-card reveal';
    
    // Create initials
    const initials = wish.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    card.innerHTML = `
      <div class="message-header">
        <div class="message-avatar">${initials}</div>
        <div class="message-meta">
          <div class="message-name">${wish.name}</div>
          <div class="message-rel">${wish.relation}</div>
        </div>
      </div>
      <p class="message-text">"${wish.message}"</p>
    `;

    messagesWall.appendChild(card);
  });

  initScrollReveals();
}

async function handleWishSubmit(e) {
  e.preventDefault();

  const name = wishName.value.trim();
  const rel = wishRelation.value.trim();
  const type = 'wish';
  const msg = wishMessage.value.trim();

  if (!name || !rel || !msg) return;

  const newWish = {
    name,
    relation: rel,
    type,
    message: msg,
    time: Date.now()
  };

  // Get current cloud wishes first
  let wishes = [];
  try {
    const res = await fetch(`${DB_URL}/wishes`);
    wishes = res.ok ? await res.json() : getLocalWishes();
  } catch (err) {
    wishes = getLocalWishes();
  }

  wishes.push(newWish);
  await saveCloudWishes(wishes);
  
  renderWishes(wishes);

  // Clear Form fields
  wishName.value = '';
  wishRelation.value = '';
  wishMessage.value = '';

  // Show success message
  wishFormNote.textContent = "Wish saved and posted successfully! ❤️";
  wishFormNote.style.color = '#f59e0b';
  setTimeout(() => {
    wishFormNote.textContent = '';
  }, 4000);
}

// 11. Scroll Reveals Manager
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(rev => {
    observer.observe(rev);
  });
}

// 12. Celebration Effects: Balloons, Confetti, Fireworks
function triggerCelebrationEffects() {
  startFireworks();
  createBalloons();
  createConfetti();
}

// Canvas Fireworks engine
function startFireworks() {
  if (fireworksAnimationId) {
    cancelAnimationFrame(fireworksAnimationId);
  }

  // Set sizing
  const resizeCanvas = () => {
    fireworksCanvas.width = fireworksCanvas.parentElement.clientWidth;
    fireworksCanvas.height = fireworksCanvas.parentElement.clientHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  fireworks = [];
  particles = [];

  class Firework {
    constructor(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = randomRange(50, 70);
      this.targetRadius = 1;
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
      } else {
        this.targetRadius = 1;
      }

      this.speed *= this.acceleration;

      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${randomRange(0, 360)}, 100%, ${this.brightness}%)`;
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = randomRange(0, Math.PI * 2);
      this.speed = randomRange(1, 10);
      this.friction = 0.95;
      this.gravity = 1;
      this.hue = randomRange(0, 360);
      this.brightness = randomRange(50, 80);
      this.alpha = 1;
      this.decay = randomRange(0.015, 0.03);
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.stroke();
    }
  }

  function calculateDistance(p1x, p1y, p2x, p2y) {
    return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticles(x, y) {
    let particleCount = 30;
    while (particleCount--) {
      particles.push(new Particle(x, y));
    }
  }

  let counter = 0;
  function loop() {
    fireworksAnimationId = requestAnimationFrame(loop);
    
    // Clear trails
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let i = fireworks.length;
    while (i--) {
      fireworks[i].draw();
      fireworks[i].update(i);
    }

    let j = particles.length;
    while (j--) {
      particles[j].draw();
      particles[j].update(j);
    }

    // Launch random firework
    if (counter >= 15) {
      const sx = fireworksCanvas.width / 2;
      const sy = fireworksCanvas.height;
      const tx = randomRange(50, fireworksCanvas.width - 50);
      const ty = randomRange(50, fireworksCanvas.height / 2);
      fireworks.push(new Firework(sx, sy, tx, ty));
      counter = 0;
    } else {
      counter++;
    }
  }

  loop();

  // Stop canvas animation loop after 15 seconds to save battery/perf
  setTimeout(() => {
    cancelAnimationFrame(fireworksAnimationId);
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  }, 15000);
}

// Balloons creator
function createBalloons() {
  const container = document.getElementById('balloons');
  if (!container) return;
  
  // Clear any existing balloons
  container.innerHTML = '';
  
  const colors = [
    'rgba(167, 139, 250, 0.85)', // primary
    'rgba(96, 165, 250, 0.85)',  // secondary
    'rgba(245, 158, 11, 0.85)',  // accent
    'rgba(244, 63, 94, 0.85)',   // heart
    'rgba(52, 211, 153, 0.85)',  // green
    'rgba(244, 114, 182, 0.85)'  // pink
  ];

  for (let i = 0; i < 20; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon-element';
    
    const sizeWidth = Math.random() * 15 + 40; // 40 - 55 px
    const sizeHeight = sizeWidth * 1.2;
    const startX = Math.random() * 90; // Left offset
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * 5; // Start delays
    const speed = Math.random() * 4 + 8; // Seconds of rise animation

    balloon.style.width = sizeWidth + 'px';
    balloon.style.height = sizeHeight + 'px';
    balloon.style.left = startX + '%';
    balloon.style.background = color;
    balloon.style.animationDelay = delay + 's';
    balloon.style.animationDuration = speed + 's';
    
    // Add visual balloon shine highlight
    const shine = document.createElement('span');
    shine.style.position = 'absolute';
    shine.style.top = '6px';
    shine.style.left = '8px';
    shine.style.width = '8px';
    shine.style.height = '12px';
    shine.style.borderRadius = '50%';
    shine.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    balloon.appendChild(shine);

    container.appendChild(balloon);
  }
}

// Confetti creator
function createConfetti() {
  const container = document.getElementById('confetti');
  if (!container) return;

  container.innerHTML = '';

  const confettiColors = ['#a78bfa', '#60a5fa', '#f59e0b', '#f43f5e', '#34d399', '#f472b6', '#38bdf8', '#fb7185'];
  
  for (let i = 0; i < 90; i++) {
    const particle = document.createElement('div');
    const sizeWidth = Math.random() * 8 + 6;
    const sizeHeight = Math.random() * 12 + 6;
    
    particle.style.position = 'absolute';
    particle.style.width = sizeWidth + 'px';
    particle.style.height = sizeHeight + 'px';
    particle.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    
    // Place randomly at top
    particle.style.top = '-20px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.opacity = Math.random() * 0.7 + 0.3;
    
    // Fall Animation parameters
    const animName = 'fall' + i;
    const endX = Math.random() * 200 - 100; // Left/right drift
    const duration = Math.random() * 3 + 3.5; // Speed
    const delay = Math.random() * 3.5;
    
    const keyframes = `
      @keyframes ${animName} {
        0% { transform: translateY(0) rotate(0deg); top: -20px; }
        100% { transform: translateY(115vh) translateX(${endX}px) rotate(${Math.random() * 720 - 360}deg); }
      }
    `;

    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);

    particle.style.animation = `${animName} ${duration}s linear ${delay}s forwards`;
    container.appendChild(particle);
  }
}

// 13. Mobile Menu handler
function toggleMobileMenu() {
  nav.classList.toggle('menu-active');
}
