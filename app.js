// --- DURUM YÖNETİMİ ---
let currentStage = 1;
let currentStageWords = [];
let currentCategory = null;
let lastGameMode = null;
let unlockedStage = 1; // Açık olan en yüksek aşama

// --- KULLANICI VE DİL ---
let selectedLanguage = 'arabic';
let activeWords = []; // Seçilen dilin kelimeleri

// --- ÖDÜL SİSTEMİ ---
let totalStars = 0;
let gameStars = 0;

// --- DİL SEÇİMİ ---
const LANGUAGE_CONFIG = {
    arabic: {
        words: () => arabicWords,
        voice: 'ar'
    },
    english: {
        words: () => englishWords,
        voice: 'en'
    }
};

let isAnimatingSelection = false;

function prepareLanguageSelection(lang, event) {
    if (isAnimatingSelection) return;
    isAnimatingSelection = true;

    // Ses
    playClickSound();

    const archer = document.getElementById('archer-container');
    const arrow = document.getElementById('flying-arrow');
    const targetEl = event.currentTarget.querySelector('.balloon-body');

    // Get positions
    const archerRect = archer.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // Arrow start position (center of archer)
    const startX = archerRect.left + archerRect.width / 2;
    const startY = archerRect.top + archerRect.height / 2;

    // Target position (center of balloon body)
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    // Calculate angle
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    // Set start position and rotation
    arrow.style.left = startX + 'px';
    arrow.style.top = startY + 'px';
    arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    arrow.style.display = 'block';

    // Archer anticipation
    archer.style.transform = 'scale(1.2)';

    // Animate arrow
    setTimeout(() => {
        const animation = arrow.animate([
            { left: startX + 'px', top: startY + 'px', transform: `translate(-50%, -50%) rotate(${angle}deg)` },
            { left: endX + 'px', top: endY + 'px', transform: `translate(-50%, -50%) rotate(${angle}deg)` }
        ], {
            duration: 400,
            easing: 'ease-in'
        });

        animation.onfinish = () => {
            arrow.style.display = 'none';
            archer.style.transform = 'scale(1)';

            targetEl.classList.add('pop-anim');
            playCorrectSound();

            // Gizle balon string vb
            const wrapper = event.currentTarget;
            const string = wrapper.querySelector('.balloon-string');
            if (string) string.style.opacity = '0';
            const content = wrapper.querySelector('.balloon-content');
            if (content) content.style.opacity = '0';

            setTimeout(() => {
                targetEl.classList.remove('pop-anim');
                if (string) string.style.opacity = '1';
                if (content) content.style.opacity = '1';
                isAnimatingSelection = false;
                selectLanguage(lang);
            }, 300);
        };
    }, 300);
}

function selectLanguage(lang, event) {
    try {
        playClickSound();
    } catch (e) { }

    // GÃ¼venli element tespiti (event, this veya doÄŸrudan arama)
    let wrapper = null;
    try {
        if (event) {
            if (event.currentTarget) {
                wrapper = event.currentTarget;
            } else if (event.target && event.target.closest) {
                wrapper = event.target.closest('.balloon-wrapper');
            } else if (event.nodeType) {
                wrapper = event;
            }
        }
        if (!wrapper) {
            wrapper = document.querySelector(`.balloon-wrapper[onclick*="${lang}"]`);
        }
    } catch (e) { }

    if (wrapper) {
        try {
            const balloonBody = wrapper.querySelector('.balloon-body');
            if (balloonBody) {
                balloonBody.style.transition = 'transform 0.25s ease';
                balloonBody.style.transform = 'scale(1.25)';
            }
            playCorrectSound();
            showConfetti();
        } catch (e) { }

        // AnÄ±nda ve akÄ±cÄ± geÃ§iÅŸ (1.5 sn bekleme yerine 300ms)
        setTimeout(() => {
            try {
                const balloonBody = wrapper.querySelector('.balloon-body');
                if (balloonBody) {
                    balloonBody.style.transition = '';
                    balloonBody.style.transform = '';
                }
            } catch (e) { }
            doSelectLanguage(lang);
        }, 300);
    } else {
        doSelectLanguage(lang);
    }
}

function doSelectLanguage(lang) {
    selectedLanguage = lang;

    // ÖNEMLİ: Dil değiştiğinde eski kelime verilerini temizle!
    currentStageWords = [];
    currentCategory = null;
    activeBalloonWords = [];

    // Aktif kelimeleri ayarla
    activeWords = LANGUAGE_CONFIG[lang].words();

    // Başlığı güncelle
    const langNames = { arabic: 'Arapça', english: 'İngilizce' };
    document.getElementById('main-title').textContent = `🌸 ELİF İNCİ'NİN DİLLER BAHÇESİ 🌺`;
    document.getElementById('main-subtitle').textContent = `${langNames[lang]} Öğrenmeye Hazır mısın?`;

    showScreen('main-menu');
}

// --- SES SENTEZÄ° (TTS) ---
let voicesLoaded = false;
let arabicVoice = null;

// --- AUDIO CONTEXT (Ses Efektleri) ---
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// DoÄŸru cevap sesi - NeÅŸeli ding
function playCorrectSound() {
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) { console.log('Ses Ã§alÄ±namadÄ±'); }
}

// YanlÄ±ÅŸ cevap sesi - Nazik boop
function playWrongSound() {
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) { console.log('Ses Ã§alÄ±namadÄ±'); }
}

// Tebrik sesi - Fanfare
function playCelebrationSound() {
    try {
        const ctx = initAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);

            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.3);
        });
    } catch (e) { console.log('Ses Ã§alÄ±namadÄ±'); }
}

// Buton tÄ±klama sesi
function playClickSound() {
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) { }
}

// --- KONFETİ EFEKTİ ---
function showConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9800', '#e91e63'];
    const emojis = ['🌟', '⭐', '✨', '🎉', '🎊', '💫'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 2) + 's';

        // Bazı konfetiler emoji olsun
        if (Math.random() > 0.7) {
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.backgroundColor = 'transparent';
            confetti.style.fontSize = '1.5rem';
        }

        container.appendChild(confetti);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 3000);
}

// --- YILDIZ SİSTEMİ ---
function addStar(count = 1) {
    gameStars += count;
    totalStars += count;
    updateStarDisplay();

    // Her 3 yıldızda konfeti göster
    if (gameStars % 3 === 0) {
        showConfetti();
    }
}

function updateStarDisplay() {
    const counter = document.getElementById('star-count');
    if (counter) {
        counter.textContent = gameStars;
        counter.parentElement.classList.add('star-pulse');
        setTimeout(() => counter.parentElement.classList.remove('star-pulse'), 300);
    }
}

function resetGameStars() {
    gameStars = 0;
    updateStarDisplay();
}

// Sesleri yükle
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        voicesLoaded = true;
        // Sadece Arapça ses ara
        arabicVoice = voices.find(v => v.lang.startsWith('ar')) ||
            voices.find(v => v.lang.toLowerCase().includes('ar-')) ||
            voices.find(v => v.name.toLowerCase().includes('arabic'));

        if (arabicVoice) {
            console.log('Arapça ses bulundu:', arabicVoice.name, arabicVoice.lang);
        } else {
            console.log('Arapça ses bulunamadı. Mevcut sesler:', voices.map(v => v.lang).join(', '));
        }
    }
}

// Sesler yüklendiğinde
if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

function speakArabic(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!voicesLoaded) loadVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;

    if (arabicVoice && arabicVoice.lang.startsWith('ar')) {
        utterance.voice = arabicVoice;
    }

    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 50);
}

// --- NAVİGASYON ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    const homeBtn = document.getElementById('home-btn');
    const starCounter = document.getElementById('star-counter');

    // Oyun ekranları dışına çıkıldığında oyunları durdur
    if (id !== 'game-colors') stopBalloonGame();
    if (id !== 'game-train' && typeof stopTrainGame === 'function') stopTrainGame();
    if (id !== 'game-pizza' && typeof stopPizzaGame === 'function') stopPizzaGame();

    // Ana menü veya dil seçiminde geri tuşu ve yıldız sayacı gizle
    if (id === 'main-menu' || id === 'language-screen') {
        homeBtn.style.display = 'none';
        starCounter.style.display = 'none';
    } else if (id === 'game-complete') {
        homeBtn.style.display = 'none';
        starCounter.style.display = 'none';
    } else {
        homeBtn.style.display = 'flex';
        starCounter.style.display = 'flex';
    }

    // Aşama seçimi ekranı açıldıysa gridi doldur
    if (id === 'stage-select') {
        initStageGrid();
    }

    // Emojileri tüm cihazlarda sabit vektörel görsel yap
    setTimeout(() => {
        if (window.twemoji) {
            twemoji.parse(document.body, {
                folder: 'svg',
                ext: '.svg'
            });
        }
    }, 50);
}

function goHome() {
    playClickSound();
    goToMainMenu();
}

function goToMainMenu() {
    playClickSound();
    currentCategory = null;
    showScreen('main-menu');
}

function showFeedback(text = "Harika! 🌟") {
    const fb = document.getElementById('feedback');
    fb.textContent = text;
    fb.style.display = 'block';
    setTimeout(() => { fb.style.display = 'none'; }, 1200);
}

// --- KATEGORİ SİSTEMİ ---
const CATEGORY_STAGES = {
    animals: [5, 6],  // Hayvanlar 1 ve 2
    colors: [4],      // Renkler
    fruits: [7],      // Meyveler/Yiyecekler
    family: [3],      // Aile
    numbers: [2],     // Sayılar
    shapes: [21],     // Şekiller
    kitchen: [22],    // Mutfak
    phrases: [23]     // Temel Cümleler
};

const CATEGORY_NAMES = {
    animals: '🦁 Hayvanlar',
    colors: '🌈 Renkler',
    fruits: '🍎 Meyveler',
    family: '👨‍👩‍👧 Aile',
    numbers: '🔢 Sayılar',
    shapes: '🔺 Şekiller',
    kitchen: '🥣 Mutfak',
    phrases: '💬 Temel Cümleler'
};

// --- YÃœKSEK Ã‡Ã–ZÃœNÃœRLÃœKLÃœ GÃ–RSEL VE Ä°KON SÄ°STEMÄ° ---
function getTwemojiUrl(emoji) {
    if (!emoji) return '';
    const codePoints = [];
    for (const char of emoji) {
        const cp = char.codePointAt(0);
        if (cp !== 0xFE0F) { // variation selector-16 temizle
            codePoints.push(cp.toString(16));
        }
    }
    if (codePoints.length === 0) return '';
    const hex = codePoints.join('-');
    return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${hex}.svg`;
}

function renderImageElement(item) {
    if (!item) return '';

    // 1. RENKLER (Canlı ve Net 3D Renk Küreleri)
    const colorMap = {
        'Kırmızı': { bg: 'radial-gradient(circle at 30% 30%, #FF5252, #D50000)', border: '#FF1744' },
        'Mavi': { bg: 'radial-gradient(circle at 30% 30%, #448AFF, #2962FF)', border: '#2979FF' },
        'Sarı': { bg: 'radial-gradient(circle at 30% 30%, #FFFD54, #FBC02D)', border: '#FDD835' },
        'Yeşil': { bg: 'radial-gradient(circle at 30% 30%, #69F0AE, #00C853)', border: '#00E676' },
        'Turuncu': { bg: 'radial-gradient(circle at 30% 30%, #FFAB40, #FF6D00)', border: '#FF9100' },
        'Mor': { bg: 'radial-gradient(circle at 30% 30%, #E040FB, #AA00FF)', border: '#D500F9' },
        'Pembe': { bg: 'radial-gradient(circle at 30% 30%, #FF80AB, #C51162)', border: '#FF4081' },
        'Siyah': { bg: 'radial-gradient(circle at 30% 30%, #616161, #000000)', border: '#212121' },
        'Beyaz': { bg: 'radial-gradient(circle at 30% 30%, #FFFFFF, #E0E0E0)', border: '#BDBDBD' },
        'Kahverengi': { bg: 'radial-gradient(circle at 30% 30%, #A1887F, #4E342E)', border: '#6D4C41' }
    };
    if (colorMap[item.tr]) {
        return `<div class="color-swatch-visual" style="background: ${colorMap[item.tr].bg}; border: 4px solid ${colorMap[item.tr].border}; width:75%; height:75%; margin:12.5% auto; border-radius:50%; box-shadow: inset 0 -5px 15px rgba(0,0,0,0.3), 0 6px 15px rgba(0,0,0,0.2);"></div>`;
    }

    // 2. SAYILAR (Büyük, Okunaklı 3D Sayı Balonları)
    const numMap = {
        'Bir': 1, 'İki': 2, 'Üç': 3, 'Dört': 4, 'Beş': 5,
        'Altı': 6, 'Yedi': 7, 'Sekiz': 8, 'Dokuz': 9, 'On': 10,
        'On bir': 11, 'On iki': 12, 'On üç': 13, 'On dört': 14, 'On beş': 15,
        'On altı': 16, 'On yedi': 17, 'On sekiz': 18, 'On dokuz': 19, 'Yirmi': 20
    };
    if (numMap[item.tr] !== undefined) {
        return `<div class="number-badge-visual" style="width:80%; height:80%; margin:10% auto; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #FF7043, #E64A19); color:white; font-size:2.8rem; font-weight:bold; border-radius:50%; box-shadow:0 6px 15px rgba(230,74,25,0.4), inset 0 2px 5px rgba(255,255,255,0.4); font-family:'Fredoka', sans-serif;">${numMap[item.tr]}</div>`;
    }

    // 3. ŞEKİLLER (Cam Gibi Vektörel SVG Şekilleri)
    const shapeMap = {
        'Daire': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><circle cx="50" cy="50" r="40" fill="#FF5722" stroke="#E64A19" stroke-width="4"/></svg>`,
        'Kare': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><rect x="15" y="15" width="70" height="70" rx="12" fill="#2196F3" stroke="#1976D2" stroke-width="4"/></svg>`,
        'Üçgen': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><polygon points="50,15 88,85 12,85" fill="#4CAF50" stroke="#388E3C" stroke-width="4"/></svg>`,
        'Dikdörtgen': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><rect x="10" y="25" width="80" height="50" rx="10" fill="#9C27B0" stroke="#7B1FA2" stroke-width="4"/></svg>`,
        'Yıldız': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><polygon points="50,10 63,38 93,38 68,56 78,86 50,67 22,86 32,56 7,38 37,38" fill="#FFEB3B" stroke="#FBC02D" stroke-width="3"/></svg>`,
        'Kalp': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><path d="M 50,85 C 50,85 15,55 15,35 C 15,20 28,15 38,22 C 45,27 50,33 50,33 C 50,33 55,27 62,22 C 72,15 85,20 85,35 C 85,55 50,85 50,85 Z" fill="#E91E63" stroke="#C2185B" stroke-width="4"/></svg>`,
        'Çizgi': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><line x1="15" y1="50" x2="85" y2="50" stroke="#FF9800" stroke-width="14" stroke-linecap="round"/></svg>`,
        'Nokta': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><circle cx="50" cy="50" r="22" fill="#673AB7" stroke="#512DA8" stroke-width="4"/></svg>`,
        'Elmas': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><polygon points="50,10 90,50 50,90 10,50" fill="#00BCD4" stroke="#00838F" stroke-width="4"/></svg>`,
        'Oval': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><ellipse cx="50" cy="50" rx="42" ry="28" fill="#FF4081" stroke="#C51162" stroke-width="4"/></svg>`,
        'Beşgen': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><polygon points="50,12 90,40 75,88 25,88 10,40" fill="#7C4DFF" stroke="#512DA8" stroke-width="4"/></svg>`,
        'Altıgen': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="#FF9800" stroke="#F57C00" stroke-width="4"/></svg>`,
        'Hilal': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><path d="M 65 15 A 35 35 0 1 0 65 85 A 28 28 0 1 1 65 15 Z" fill="#FFEB3B" stroke="#FBC02D" stroke-width="3"/></svg>`,
        'Küp': `<svg viewBox="0 0 100 100" style="width:100%;height:100%;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));"><polygon points="50,15 85,32 85,68 50,85 15,68 15,32" fill="#00E676" stroke="#00A152" stroke-width="3"/><polygon points="50,15 85,32 50,49 15,32" fill="#69F0AE"/><line x1="50" y1="49" x2="50" y2="85" stroke="#00A152" stroke-width="3"/></svg>`
    };
    if (shapeMap[item.tr]) {
        return shapeMap[item.tr];
    }

    // 4. AİLE BİREYLERİ (Son Derece Ayırt Edici Özel Vektörel Kartlar)
    const familyMap = {
        'Baba': `<div class="family-card-visual" style="background: linear-gradient(135deg, #1E88E5, #1565C0); border: 3px solid #0D47A1; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f468.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#0D47A1; font-family:'Fredoka', sans-serif;">👨 BABA</div>
                 </div>`,

        'Anne': `<div class="family-card-visual" style="background: linear-gradient(135deg, #EC407A, #C2185B); border: 3px solid #880E4F; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f469.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#880E4F; font-family:'Fredoka', sans-serif;">💖 ANNE</div>
                 </div>`,

        'Oğul': `<div class="family-card-visual" style="background: linear-gradient(135deg, #26C6DA, #00838F); border: 3px solid #006064; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f466.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#006064; font-family:'Fredoka', sans-serif;">👦 OĞUL</div>
                 </div>`,

        'Kız': `<div class="family-card-visual" style="background: linear-gradient(135deg, #AB47BC, #7B1FA2); border: 3px solid #4A148C; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f467.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#4A148C; font-family:'Fredoka', sans-serif;">🎀 KIZ</div>
                 </div>`,

        'Erkek kardeş': `<div class="family-card-visual" style="background: linear-gradient(135deg, #66BB6A, #2E7D32); border: 3px solid #1B5E20; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                            <div style="display:flex; justify-content:center; gap:4px; margin-bottom:8px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f466.svg" style="width:50px;height:50px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f466.svg" style="width:50px;height:50px;">
                            </div>
                            <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.75rem; font-weight:bold; background:#1B5E20; font-family:'Fredoka', sans-serif;">👦👦 ERKEK KARDEŞ</div>
                         </div>`,

        'Erkek Kardeş': `<div class="family-card-visual" style="background: linear-gradient(135deg, #66BB6A, #2E7D32); border: 3px solid #1B5E20; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                            <div style="display:flex; justify-content:center; gap:4px; margin-bottom:8px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f466.svg" style="width:50px;height:50px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f466.svg" style="width:50px;height:50px;">
                            </div>
                            <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.75rem; font-weight:bold; background:#1B5E20; font-family:'Fredoka', sans-serif;">👦👦 ERKEK KARDEŞ</div>
                         </div>`,

        'Kız kardeş': `<div class="family-card-visual" style="background: linear-gradient(135deg, #FFA726, #EF6C00); border: 3px solid #E65100; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                            <div style="display:flex; justify-content:center; gap:4px; margin-bottom:8px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f467.svg" style="width:50px;height:50px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f467.svg" style="width:50px;height:50px;">
                            </div>
                            <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.75rem; font-weight:bold; background:#E65100; font-family:'Fredoka', sans-serif;">👧👧 KIZ KARDEŞ</div>
                         </div>`,

        'Kız Kardeş': `<div class="family-card-visual" style="background: linear-gradient(135deg, #FFA726, #EF6C00); border: 3px solid #E65100; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                            <div style="display:flex; justify-content:center; gap:4px; margin-bottom:8px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f467.svg" style="width:50px;height:50px;">
                                <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f467.svg" style="width:50px;height:50px;">
                            </div>
                            <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.75rem; font-weight:bold; background:#E65100; font-family:'Fredoka', sans-serif;">👧👧 KIZ KARDEŞ</div>
                         </div>`,

        'Dede': `<div class="family-card-visual" style="background: linear-gradient(135deg, #78909C, #37474F); border: 3px solid #263238; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f474.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#263238; font-family:'Fredoka', sans-serif;">👴 DEDE</div>
                 </div>`,

        'Nine': `<div class="family-card-visual" style="background: linear-gradient(135deg, #B0BEC5, #546E7A); border: 3px solid #37474F; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f475.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#37474F; font-family:'Fredoka', sans-serif;">👵 NİNE</div>
                 </div>`,

        'Bebek': `<div class="family-card-visual" style="background: linear-gradient(135deg, #FFF176, #FBC02D); border: 3px solid #F57F17; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f476.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:#000; font-size:0.8rem; font-weight:bold; background:#F57F17; font-family:'Fredoka', sans-serif;">👶 BEBEK</div>
                 </div>`,

        'Aile': `<div class="family-card-visual" style="background: linear-gradient(135deg, #FF8A65, #D84315); border: 3px solid #BF360C; width:90%; height:90%; margin:5% auto; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; box-shadow: inset 0 2px 5px rgba(255,255,255,0.4), 0 6px 12px rgba(0,0,0,0.2);">
                    <div style="margin-bottom:8px;"><img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f46a.svg" style="width:65px;height:65px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.3));"></div>
                    <div style="position:absolute; bottom:0; width:100%; padding:3px 0; text-align:center; color:white; font-size:0.8rem; font-weight:bold; background:#BF360C; font-family:'Fredoka', sans-serif;">👨‍👩‍👧‍👦 AİLE</div>
                 </div>`
    };
    if (familyMap[item.tr]) {
        return familyMap[item.tr];
    }

    // 4. TWEMOJI HIGH-RES VECTOR SVG (Hayvanlar, Meyveler, Aile, Mutfak)
    const twemojiUrl = getTwemojiUrl(item.e);
    if (twemojiUrl) {
        return `<img src="${twemojiUrl}" alt="${item.tr}" class="word-img" onerror="this.outerHTML='<div class=\\'emoji\\'>${item.e}</div>'" style="width:100%; height:100%; object-fit:contain; filter: drop-shadow(0 5px 8px rgba(0,0,0,0.15)); transition: transform 0.2s;">`;
    }

    return `<div class="emoji">${item.e}</div>`;
}

function selectCategory(category) {
    playClickSound();
    currentCategory = category;
    const stages = CATEGORY_STAGES[category];

    // Kategorideki tüm kelimeleri topla - doğrudan seçilen dilden
    const wordsSource = LANGUAGE_CONFIG[selectedLanguage].words();
    currentStageWords = wordsSource.filter(w => stages.includes(w.s));

    document.getElementById('dashboard-title').textContent = CATEGORY_NAMES[category];
    showScreen('stage-dashboard');
}

// --- AŞAMA SEÇİMİ ---
const TOTAL_STAGES = 20;

const STAGE_NAMES = {
    1: { name: 'Selamlaşma', icon: '👋' },
    2: { name: 'Sayılar', icon: '🔢' },
    3: { name: 'Aile', icon: '👨‍👩‍👧' },
    4: { name: 'Renkler', icon: '🌈' },
    5: { name: 'Hayvanlar 1', icon: '🦁' },
    6: { name: 'Hayvanlar 2', icon: '🦒' },
    7: { name: 'Meyveler', icon: '🍎' },
    8: { name: 'Yiyecekler', icon: '🍞' },
    9: { name: 'Vücut', icon: '🧠' },
    10: { name: 'Giysiler', icon: '👕' },
    11: { name: 'Ev', icon: '🏠' },
    12: { name: 'Ev Eşyaları', icon: '🪑' },
    13: { name: 'Okul', icon: '🏫' },
    14: { name: 'Meslekler', icon: '👨‍⚕️' },
    15: { name: 'Yerler', icon: '🕌' },
    16: { name: 'Ulaşım', icon: '🚗' },
    17: { name: 'Zaman', icon: '⏰' },
    18: { name: 'Günler', icon: '📅' },
    19: { name: 'Doğa', icon: '🌳' },
    20: { name: 'Hava Durumu', icon: '⛅' }
};

function initStageGrid() {
    const grid = document.getElementById('stage-grid');
    grid.innerHTML = ''; // Her seferinde yeniden oluştur

    for (let i = 1; i <= TOTAL_STAGES; i++) {
        const btn = document.createElement('button');
        const isLocked = i > unlockedStage;

        const stageInfo = STAGE_NAMES[i];
        btn.className = 'stage-btn' + (isLocked ? ' locked' : '');

        if (isLocked) {
            btn.innerHTML = `<span class="stage-icon">🔒</span><span class="stage-name">???</span>`;
        } else {
            btn.innerHTML = `<span class="stage-icon">${stageInfo.icon}</span><span class="stage-name">${stageInfo.name}</span>`;
        }
        btn.disabled = isLocked;

        if (!isLocked) {
            btn.onclick = () => selectStage(i);
        }

        grid.appendChild(btn);
    }
}

function selectStage(stageNum) {
    if (stageNum > unlockedStage) {
        showFeedback("Bu aşama kilitli! 🔒");
        return;
    }

    playClickSound();
    currentStage = stageNum;
    currentCategory = null;
    const wordsSource = LANGUAGE_CONFIG[selectedLanguage].words();
    currentStageWords = wordsSource.filter(w => w.s === stageNum);

    const stageInfo = STAGE_NAMES[stageNum];
    document.getElementById('dashboard-title').textContent = `${stageInfo.icon} ${stageInfo.name}`;
    showScreen('stage-dashboard');
}

// Artik kullanilmiyor - sadece kategoriler var


// --- ETKİNLİK 1: ÖĞRENME MODU ---
function startLearningMode() {
    playClickSound();
    showScreen('learn-screen');

    const title = currentCategory ? CATEGORY_NAMES[currentCategory] : `📖 Aşama ${currentStage}`;
    document.getElementById('learn-title').textContent = `${title} Kelimeleri`;

    const container = document.getElementById('learn-content');
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'learn-grid';

    currentStageWords.forEach(item => {
        const card = createLearnCard(item);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function createLearnCard(item) {
    const card = document.createElement('div');
    card.className = 'learn-card';
    const langClass = selectedLanguage === 'arabic' ? 'ar-text' : 'ar-text en-text';
    card.innerHTML = `
        <div class="image-container" style="width: 120px; height: 120px; margin: 0 auto 10px auto;">
            ${renderImageElement(item)}
        </div>
        <div class="${langClass}">${item.ar}</div>
        <div class="okunus">${item.ok}</div>
        <div class="tr-text">${item.tr}</div>
        <button class="sound-btn">🔊</button>
    `;

    card.querySelector('.sound-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound();
        speakWord(item.ar);
    });

    // Karta tıklayınca da ses çalsın
    card.addEventListener('click', () => speakWord(item.ar));

    return card;
}


// --- OYUN 1: KART EŞLEŞTİRME ---

function startMemoryGame() {
    playClickSound();
    lastGameMode = 'memory';
    showScreen('game-memory');
    resetGameStars();

    // Dil adını güncelle
    const langNames = { arabic: 'Arapça', english: 'İngilizce' };
    const subtitle = document.getElementById('memory-subtitle');
    if (subtitle) subtitle.textContent = `Resmi ${langNames[selectedLanguage]} ismiyle eşleştir!`;

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;

    // O anki kelimelerden rastgele 6 kelime seç
    let pool = [...currentStageWords];
    let selected = pool.sort(() => 0.5 - Math.random()).slice(0, 6);
    memoryTotalPairs = selected.length;

    let deck = [];
    selected.forEach(item => {
        deck.push({ id: item.ar, type: 'emoji', content: `<div style="width: 100%; height: 100%; padding: 10px; box-sizing: border-box;">${renderImageElement(item)}</div>`, data: item });
        const textClass = selectedLanguage === 'arabic' ? 'arabic-text' : 'foreign-text';
        deck.push({ id: item.ar, type: 'text', content: `<div class="${textClass}">${item.ar}</div><div style="font-size:0.6em">${item.ok}</div>`, data: item });
    });

    deck.sort(() => 0.5 - Math.random());

    deck.forEach(cardData => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="front">❓</div>
            <div class="back">${cardData.content}</div>
        `;
        card.onclick = () => flipCard(card, cardData);
        grid.appendChild(card);
    });
}

function flipCard(card, cardData) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    playClickSound();
    card.classList.add('flipped');
    flippedCards.push({ el: card, data: cardData });

    if (flippedCards.length === 2) {
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [c1, c2] = flippedCards;

    if (c1.data.id === c2.data.id) {
        setTimeout(() => {
            c1.el.classList.add('matched');
            c2.el.classList.add('matched');
            playCorrectSound();
            showFeedback("Doğru! 🎉");
            addStar(1);
            if (c1.data.type === 'text') speakWord(c1.data.data.ar);
            else speakWord(c2.data.data.ar);
        }, 500);
        matchedPairs++;

        // Oyun bitti mi?
        if (matchedPairs === memoryTotalPairs) {
            setTimeout(() => showGameComplete(), 1500);
        }
    } else {
        playWrongSound();
        setTimeout(() => {
            c1.el.classList.remove('flipped');
            c2.el.classList.remove('flipped');
        }, 1000);
    }
    flippedCards = [];
}


// --- OYUN 2: DİNLE VE BUL ---

function startListeningGame() {
    playClickSound();
    lastGameMode = 'listening';
    showScreen('game-listening');
    resetGameStars();
    listeningCorrectCount = 0;
    nextListeningQuestion();
}

function nextListeningQuestion() {
    // 3 seçenek sun
    let pool = [...currentStageWords];
    let options = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    let isAnswered = false; // Add flag to prevent multiple clicks

    currentQuestionItem = options[Math.floor(Math.random() * options.length)];

    const questionPrompt = currentCategory === 'phrases' ? 'Bu ifade hangisi?' : 'Bu ne?';
    const targetSize = currentQuestionItem.ar.length > 12 ? '2.2rem' : '3rem';
    const escapedAr = currentQuestionItem.ar.replace(/'/g, "\\'");

    const bubble = document.getElementById('listening-text');
    bubble.innerHTML = `
        <div>${questionPrompt}</div>
        <div class="target-text ${selectedLanguage === 'arabic' ? 'arabic-text' : ''}" 
             onclick="speakWord('${escapedAr}')" 
             style="color: #0288D1; font-size: ${targetSize}; margin-top:10px; cursor: pointer; user-select: none;">
             ${currentQuestionItem.ar}
        </div>
        <div style="font-size:1rem; color:#666;">(Ses için tıkla)</div>
    `;

    setTimeout(() => speakWord(currentQuestionItem.ar), 500);

    const container = document.getElementById('listening-options');
    container.innerHTML = '';

    options.forEach(opt => {
        const el = document.createElement('div');
        el.className = 'animal-option';
        el.innerHTML = renderImageElement(opt);
        el.onclick = () => {
            if (isAnswered) return; // Block if already answered

            if (opt.ar === currentQuestionItem.ar) {
                isAnswered = true; // Set flag
                playCorrectSound();
                showFeedback(`Aferin! 👍\n(${currentQuestionItem.tr})`);
                addStar(1);
                listeningCorrectCount++;

                if (listeningCorrectCount >= listeningTotalQuestions) {
                    setTimeout(() => showGameComplete(), 1500);
                } else {
                    setTimeout(nextListeningQuestion, 1500);
                }
            } else {
                playWrongSound();
                el.style.transform = "translateX(10px)";
                setTimeout(() => el.style.transform = "none", 200);
            }
        };
        container.appendChild(el);
    });
}


// --- OYUN 3: KELİME AVCISI (BOUNCING GAME) ---
let bouncingObjects = [];
let balloonTimerInterval = null;
let balloonTime = 0;
let balloonCorrectCount = 0;
let activeBalloonWords = [];
let rafId = null;
let currentBalloonTarget = null;

function startBalloonGame() {
    playClickSound();
    lastGameMode = 'balloon';
    showScreen('game-colors');
    resetGameStars();
    balloonCorrectCount = 0;

    // Önceki nesneleri temizle
    bouncingObjects.forEach(obj => { if (obj && obj.element) obj.element.remove(); });
    bouncingObjects = [];

    // Kelime havuzunu sınırla (Max 8 kelime)
    const poolSize = Math.min(8, currentStageWords.length);
    activeBalloonWords = currentStageWords.slice(0, poolSize);

    // Seçilen kelimelerden spawn et
    activeBalloonWords.forEach(word => {
        for (let i = 0; i < 2; i++) {
            spawnBouncingObject(word);
        }
    });

    // Hedef belirle (balonlar spawn edildikten SONRA!)
    setNewBalloonTarget();

    // Timer'ı başlat
    balloonTime = 0;
    const timerDisplay = document.getElementById('balloon-timer');
    if (timerDisplay) {
        timerDisplay.style.display = 'block';
        timerDisplay.textContent = `Süre: ${balloonTime}`;
    }

    if (balloonTimerInterval) clearInterval(balloonTimerInterval);
    balloonTimerInterval = setInterval(() => {
        balloonTime++;
        if (timerDisplay) {
            timerDisplay.textContent = `Süre: ${balloonTime}`;
        }
    }, 1000);

    // Animation loop başlat
    if (rafId) cancelAnimationFrame(rafId);
    animateBouncingObjects();
}

function stopBalloonGame() {
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (balloonTimerInterval) {
        clearInterval(balloonTimerInterval);
        balloonTimerInterval = null;
    }
    const timerDisplay = document.getElementById('balloon-timer');
    if (timerDisplay) {
        timerDisplay.style.display = 'none';
    }
    if (Array.isArray(bouncingObjects)) {
        bouncingObjects.forEach(obj => {
            if (obj && obj.element) obj.element.remove();
        });
        bouncingObjects = [];
    }
}

function setNewBalloonTarget() {
    // Sadece aktif (ekranda olan) balonlardan hedef seç
    // bouncingObjects boşsa hata vermesin diye kontrol ekle
    if (bouncingObjects.length === 0) {
        return;
    }

    // Benzersiz kelimeleri al
    const availableWords = [...new Set(bouncingObjects.map(obj => obj.word))];
    targetBalloonItem = availableWords[Math.floor(Math.random() * availableWords.length)];

    const targetDisplay = document.getElementById('color-target-display');
    const targetTextClass = selectedLanguage === 'arabic' ? 'arabic-text' : 'foreign-text';
    targetDisplay.innerHTML = `
        <div style="width: 100px; height: 100px; margin: 0 auto 5px auto;">${renderImageElement(targetBalloonItem)}</div>
        <div style="text-align: center;">
            Hedef: <span class="${targetTextClass}" style="font-weight:bold; color:#0288D1; font-size:1.6rem;">${targetBalloonItem.ar}</span> 
            <br><span style="font-size: 0.9rem; color: #555;">(${targetBalloonItem.ok})</span>
        </div>
    `;

    speakWord(targetBalloonItem.ar);
}

// --- ÇOK DİLLİ SES SENTEZİ ---
function speakWord(text) {
    if (!text) return;

    // Web Speech API desteği kontrolü
    if (!window.speechSynthesis) return;

    // Önceki konuşmayı iptal et
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = LANGUAGE_CONFIG[selectedLanguage].voice; // 'ar', 'en', 'de'

    utterance.lang = langCode;
    utterance.rate = 0.9; // Biraz yavaş konuşsun

    // Uygun sesi bulmaya çalış
    const voices = window.speechSynthesis.getVoices();
    const specificVoice = voices.find(v => v.lang.startsWith(langCode));
    if (specificVoice) {
        utterance.voice = specificVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Sesleri yükle (bazı tarayıcılar için gerekli)
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

function spawnBouncingObject(wordItem) {
    const container = document.getElementById('game-colors');
    const el = document.createElement('div');
    el.className = 'bouncing-object';
    el.style.width = '100px';
    el.style.height = '100px';
    el.innerHTML = renderImageElement(wordItem);

    // Rastgele başlangıç pozisyonu ve hız
    const obj = {
        element: el,
        word: wordItem,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
        vx: (Math.random() - 0.5) * 2 + (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() - 0.5) * 2 + (Math.random() < 0.5 ? -1 : 1)
    };

    el.onclick = () => handleBouncingClick(obj);
    container.appendChild(el);
    bouncingObjects.push(obj);

    // İlk pozisyonu ayarla
    el.style.left = obj.x + 'px';
    el.style.top = obj.y + 'px';
}

function handleBouncingClick(obj) {
    if (obj.word.ar === targetBalloonItem.ar) {
        playCorrectSound();
        obj.element.classList.add('pop-anim');
        showFeedback("Yakaladın! ✨");
        addStar(1);
        balloonCorrectCount++;

        setTimeout(() => {
            const index = bouncingObjects.indexOf(obj);
            if (index > -1) {
                obj.element.remove();
                bouncingObjects.splice(index, 1);
            }
        }, 300);

        if (balloonCorrectCount >= balloonTotalTargets) {
            setTimeout(() => showGameComplete(), 1500);
        } else {
            setTimeout(() => setNewBalloonTarget(), 1000);
        }
    } else {
        playWrongSound();
        // Yanlış nesne - titret
        obj.element.style.opacity = '0.5';
        setTimeout(() => {
            obj.element.style.opacity = '1';
        }, 200);
    }
}

function animateBouncingObjects() {
    if (!document.getElementById('game-colors').classList.contains('active')) {
        stopBalloonGame();
        return;
    }

    const container = document.getElementById('game-colors');
    const bounds = container.getBoundingClientRect();

    bouncingObjects.forEach(obj => {
        // Pozisyon güncelle
        obj.x += obj.vx;
        obj.y += obj.vy;

        const size = 80;

        // Kenar çarpma kontrolü
        if (obj.x <= 0) {
            obj.x = 0;
            obj.vx *= -1;
        } else if (obj.x >= bounds.width - size) {
            obj.x = bounds.width - size;
            obj.vx *= -1;
        }

        if (obj.y <= 0) {
            obj.y = 0;
            obj.vy *= -1;
        } else if (obj.y >= bounds.height - size) {
            obj.y = bounds.height - size;
            obj.vy *= -1;
        }

        // DOM güncelle
        obj.element.style.left = obj.x + 'px';
        obj.element.style.top = obj.y + 'px';
    });

    rafId = requestAnimationFrame(animateBouncingObjects);
}


// --- OYUN BİTTİ ---
function showGameComplete() {
    stopBalloonGame();
    playCelebrationSound();
    showConfetti();

    // AÅŸama modundaysa sonraki aÅŸamayÄ± aÃ§
    if (!currentCategory && currentStage >= unlockedStage && currentStage < TOTAL_STAGES) {
        unlockedStage = currentStage + 1;
    }

    const messages = [
        "Harika iş çıkardın! 🌟",
        "Sen bir yıldızsın! ⭐",
        "Muhteşemsin! 🏆",
        "Çok güzel! 👍",
        "Aferin sana! 🎉"
    ];

    document.getElementById('complete-message').textContent =
        messages[Math.floor(Math.random() * messages.length)];

    showScreen('game-complete');
}

function playAgain() {
    playClickSound();

    switch (lastGameMode) {
        case 'memory':
            startMemoryGame();
            break;
        case 'listening':
            startListeningGame();
            break;
        case 'balloon':
            startBalloonGame();
            break;
        case 'train':
            startTrainGame();
            break;
        case 'pizza':
            startPizzaGame();
            break;
        default:
            showScreen('stage-dashboard');
    }
}

// --- OYUN 4: NEÅžELÄ° KELÄ°ME TRENÄ° ---
let trainWagonItems = [];
let currentTrainTarget = null;
let trainLoadedCount = 0;
let trainTotalWagons = 5;
let isTrainProcessing = false;
let isTrainDeparting = false;

// BuharlÄ± tren dÃ¼dÃ¼ÄŸÃ¼ sesi
function playTrainWhistleSound() {
    try {
        const ctx = initAudioContext();
        const now = ctx.currentTime;
        const freqs = [440, 554.37]; // A4 ve C#5 - Klasik neÅŸeli tren akoru

        freqs.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, now);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 1.02, now + 0.15);
            osc.frequency.linearRampToValueAtTime(freq, now + 0.35);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.22);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.30);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

            osc.start(now);
            osc.stop(now + 0.65);
        });
    } catch (e) {
        console.log('DÃ¼dÃ¼k sesi Ã§alÄ±namadÄ±');
    }
}

function stopTrainGame() {
    isTrainProcessing = false;
    isTrainDeparting = false;
    const convoy = document.getElementById('train-convoy');
    if (convoy) {
        convoy.classList.remove('departing');
        convoy.style.transform = '';
    }
}

function startTrainGame() {
    playClickSound();
    lastGameMode = 'train';
    showScreen('game-train');
    resetGameStars();
    stopTrainGame();

    trainLoadedCount = 0;
    isTrainProcessing = false;
    isTrainDeparting = false;

    // Kategori kelimelerinden 5 tanesini seç (mobil ve masaüstü tam uyumlu)
    let pool = [...currentStageWords];
    trainWagonItems = pool.sort(() => 0.5 - Math.random()).slice(0, 5);
    trainTotalWagons = trainWagonItems.length;

    // VagonlarÄ± oluÅŸtur
    renderTrainWagons();

    // Ä°lk hedefi belirle
    setNextTrainTarget();

    // BaÅŸlangÄ±Ã§ dÃ¼dÃ¼ÄŸÃ¼
    setTimeout(() => {
        playTrainWhistleSound();
    }, 300);
}

function renderTrainWagons() {
    const list = document.getElementById('train-wagons-list');
    if (!list) return;
    list.innerHTML = '';

    const wagonColors = [
        { top: '#FF5252', body: '#D32F2F' }, // Kırmızı
        { top: '#FFA726', body: '#F57C00' }, // Turuncu
        { top: '#FFEE58', body: '#FBC02D' }, // Sarı
        { top: '#66BB6A', body: '#388E3C' }, // Yeşil
        { top: '#26A69A', body: '#00796B' }, // Turkuaz
        { top: '#42A5F5', body: '#1976D2' }, // Mavi
        { top: '#AB47BC', body: '#7B1FA2' }, // Mor
        { top: '#EC407A', body: '#C2185B' }, // Pembe
        { top: '#8D6E63', body: '#5D4037' }, // Kahve
        { top: '#78909C', body: '#455A64' }  // Çelik Mavi
    ];

    trainWagonItems.forEach((item, index) => {
        const wagonColor = wagonColors[index % wagonColors.length];
        const wagonEl = document.createElement('div');
        wagonEl.className = 'train-wagon';
        wagonEl.id = `wagon-${index}`;
        wagonEl.dataset.index = index;

        wagonEl.innerHTML = `
            <div class="wagon-coupling"></div>
            <div class="wagon-box" style="background: linear-gradient(180deg, ${wagonColor.top}, ${wagonColor.body});">
                <div class="wagon-roof-rim"></div>
                <div class="wagon-number-badge">${index + 1}</div>
                <div class="wagon-cargo-slot">
                    <div class="wagon-visual">${renderImageElement(item)}</div>
                    <div class="wagon-loaded-badge">✅</div>
                </div>
                <div class="wagon-label-slot">${item.tr}</div>
            </div>
            <div class="wagon-wheels-bar">
                <div class="wagon-wheel w1"></div>
                <div class="wagon-wheel w2"></div>
            </div>
        `;

        wagonEl.onclick = () => handleWagonClick(index, item, wagonEl);
        list.appendChild(wagonEl);
    });

    if (window.twemoji) {
        twemoji.parse(list, {
            folder: 'svg',
            ext: '.svg'
        });
    }

    updateTrainProgressDisplay();
}

function updateTrainProgressDisplay() {
    const badge = document.getElementById('train-progress');
    if (badge) {
        badge.textContent = `⭐ Vagonlar: ${trainLoadedCount} / ${trainTotalWagons} Doldu`;
    }
}

function setNextTrainTarget() {
    // Henüz yüklenmemiş vagonların kelimelerini bul
    const unfilled = trainWagonItems.filter((_, idx) => {
        const el = document.getElementById(`wagon-${idx}`);
        return el && !el.classList.contains('loaded');
    });

    if (unfilled.length === 0) {
        animateTrainDeparture();
        return;
    }

    currentTrainTarget = unfilled[Math.floor(Math.random() * unfilled.length)];

    const wordEl = document.getElementById('train-target-word');
    const phoneticEl = document.getElementById('train-target-phonetic');
    const balloonWrapper = document.getElementById('train-balloon-target');

    if (wordEl && phoneticEl) {
        wordEl.textContent = currentTrainTarget.ar;
        phoneticEl.textContent = `(${currentTrainTarget.ok})`;

        if (selectedLanguage === 'arabic') {
            wordEl.className = 'balloon-word arabic-text';
        } else {
            wordEl.className = 'balloon-word';
        }
    }

    // Balon zıplama animasyonu
    if (balloonWrapper) {
        balloonWrapper.classList.remove('bounce-target');
        void balloonWrapper.offsetWidth; // Reflow
        balloonWrapper.classList.add('bounce-target');
    }

    // Hedef vagonu ekranda görünür kıl
    const targetIdx = trainWagonItems.indexOf(currentTrainTarget);
    const targetWagon = document.getElementById(`wagon-${targetIdx}`);
    if (targetWagon) {
        targetWagon.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    // Sesli oku
    setTimeout(() => {
        speakWord(currentTrainTarget.ar);
    }, 400);
}

function pronounceTrainTarget() {
    if (!currentTrainTarget) return;
    playClickSound();
    speakWord(currentTrainTarget.ar);
}

function handleWagonClick(index, item, wagonEl) {
    if (isTrainProcessing || isTrainDeparting) return;
    if (wagonEl.classList.contains('loaded')) return;

    if (!currentTrainTarget) return;

    if (item.ar === currentTrainTarget.ar) {
        // Doğru vagon!
        isTrainProcessing = true;
        playCorrectSound();
        playTrainWhistleSound();

        // Vagona yüklendi işaretini ver
        wagonEl.classList.add('loaded');
        addStar(1);
        trainLoadedCount++;
        updateTrainProgressDisplay();
        showFeedback("Harika! Vagon yüklendi 🚂✨");

        // Lokomotif sevinsin
        const loco = document.getElementById('train-locomotive');
        if (loco) {
            loco.classList.add('happy-bounce');
            setTimeout(() => loco.classList.remove('happy-bounce'), 600);
        }

        if (trainLoadedCount >= trainTotalWagons) {
            // Tüm vagonlar doldu, tren hareket etsin!
            setTimeout(() => {
                animateTrainDeparture();
            }, 800);
        } else {
            setTimeout(() => {
                setNextTrainTarget();
                isTrainProcessing = false;
            }, 1200);
        }
    } else {
        // Yanlış vagon
        playWrongSound();
        wagonEl.classList.add('shake');
        setTimeout(() => wagonEl.classList.remove('shake'), 400);
        showFeedback("Başka bir vagonu dene! 😊");
    }
}

function animateTrainDeparture() {
    isTrainDeparting = true;
    playCelebrationSound();
    playTrainWhistleSound();
    showConfetti();
    showFeedback("Bütün vagonlar doldu! Tren zafer turu atıyor! 🚂💨🎉");

    const convoy = document.getElementById('train-convoy');
    if (!convoy) {
        setTimeout(showGameComplete, 2200);
        return;
    }

    const locomotive = document.getElementById('train-locomotive');
    const wagons = Array.from(document.querySelectorAll('.train-wagon'));
    const trainElements = [locomotive, ...wagons];

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 20;

    document.body.classList.add('train-perimeter-lap');
    convoy.style.display = 'none';

    const waypoints = [
        { x: padding, y: vh - 140, rot: 0 },
        { x: vw - 160, y: vh - 140, rot: 0 },
        { x: vw - 160, y: padding, rot: -90 },
        { x: padding, y: padding, rot: -180 },
        { x: padding, y: vh - 140, rot: -270 }
    ];

    let startTime = null;
    const totalDuration = 4500;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / totalDuration, 1);

        trainElements.forEach((el, index) => {
            if (!el) return;
            const elementDelay = index * 0.04;
            const elProgress = Math.max(0, Math.min(progress - elementDelay, 1));
            
            const segmentProgress = elProgress * 4;
            const segIndex = Math.min(Math.floor(segmentProgress), 3);
            const segT = segmentProgress - segIndex;

            const p1 = waypoints[segIndex];
            const p2 = waypoints[segIndex + 1];

            const currentX = p1.x + (p2.x - p1.x) * segT;
            const currentY = p1.y + (p2.y - p1.y) * segT;
            const currentRot = p1.rot + (p2.rot - p1.rot) * segT;

            el.style.position = 'fixed';
            el.style.left = currentX + 'px';
            el.style.top = currentY + 'px';
            el.style.transform = `rotate(${currentRot}deg)`;
            el.style.zIndex = '9999';
        });

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            document.body.classList.remove('train-perimeter-lap');
            trainElements.forEach(el => {
                if (el) {
                    el.style.position = '';
                    el.style.left = '';
                    el.style.top = '';
                    el.style.transform = '';
                    el.style.zIndex = '';
                }
            });
            convoy.style.display = '';
            showGameComplete();
        }
    }

    requestAnimationFrame(step);
}

// --- BAÅLANGIÃ‡ OLAY DÄ°NLEYÄ°CÄ°LERÄ° (DOÄRUDAN TIKLAMA GARANTÄ°SÄ°) ---
function initWelcomeEvents() {
    const bindBalloon = (selector, lang) => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.cursor = 'pointer';
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                selectLanguage(lang, e);
            });
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectLanguage(lang, e);
            });
        }
    };

    bindBalloon('.balloon-wrapper[data-lang="arabic"]', 'arabic');
    bindBalloon('.balloon-wrapper[data-lang="english"]', 'english');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWelcomeEvents);
} else {
    initWelcomeEvents();
}

// ==========================================================================
// --- OYUN 5: KELİME PİZZASI (GERÇEK DİLİMLER, UÇUŞ ANİMASYONU VE NET GÖRSELLER) ---
// ==========================================================================

let pizzaSliceItems = [];
let currentPizzaTarget = null;
let pizzaPlacedCount = 0;
const pizzaTotalSlices = 8;
let isPizzaProcessing = false;
let isPizzaSpinning = false;
let pizzaSlotOccupants = new Array(8).fill(null);

function stopPizzaGame() {
    isPizzaProcessing = false;
    isPizzaSpinning = false;
    // Varsa ekranda kalan uçan pizza dilimlerini temizle
    document.querySelectorAll('.flying-pizza-slice').forEach(el => el.remove());
    const board = document.getElementById('pizza-center-board');
    if (board) {
        board.classList.remove('spinning');
    }
}

function startPizzaGame() {
    playClickSound();
    lastGameMode = 'pizza';
    showScreen('game-pizza');
    resetGameStars();
    stopPizzaGame();

    pizzaPlacedCount = 0;
    isPizzaProcessing = false;
    isPizzaSpinning = false;
    pizzaSlotOccupants = new Array(8).fill(null);

    // Kategori veya mevcut aşama kelimelerinden 8 adet seç (yoksa genel havuzdan tamamla)
    let pool = [...currentStageWords];
    if (pool.length < 8 && activeWords && activeWords.length > 0) {
        const extraPool = activeWords.filter(w => !pool.some(p => p.ar === w.ar));
        pool = pool.concat(extraPool);
    }
    pizzaSliceItems = pool.sort(() => 0.5 - Math.random()).slice(0, 8);

    // 1. Ortadaki kesik çizgili pizza tepsisini çiz
    renderPizzaCenterBoard();

    // 2. Dışarıdaki 8 pizza dilimini oluştur (Üst, Alt, Sol, Sağ kümelere 2'şer adet)
    renderOuterSlices();

    // 3. İlk hedef kelimeyi belirle ve seslendir
    setNextPizzaTarget();
}

// Ortadaki Kesik Çizgili Pizza Tepsisi ve 8 Slotun Çizimi
function renderPizzaCenterBoard() {
    const svg = document.getElementById('pizza-svg');
    const overlay = document.getElementById('pizza-center-overlay');
    const board = document.getElementById('pizza-center-board');
    if (!svg || !overlay || !board) return;

    board.classList.remove('spinning');
    overlay.innerHTML = '';

    // 280x280 SVG içerisinde merkez (140, 140), yarıçap 126
    const cx = 140;
    const cy = 140;
    const r = 126;

    let svgHtml = `
        <defs>
            <radialGradient id="pizzaCheeseGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFF59D" />
                <stop offset="50%" stop-color="#FFD54F" />
                <stop offset="90%" stop-color="#FFB300" />
                <stop offset="100%" stop-color="#FF8F00" />
            </radialGradient>
            <linearGradient id="pizzaBoardCrust" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#8D6E63" />
                <stop offset="100%" stop-color="#5D4037" />
            </linearGradient>
        </defs>
        <!-- Tepsi Tabanı Çemberi -->
        <circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="none" stroke="#BCAAA4" stroke-width="3" />
    `;

    // 8 adet kesik çizgili dilim dilim slotu (45 derece)
    for (let i = 0; i < 8; i++) {
        const startAngle = (i * 45) * Math.PI / 180;
        const endAngle = ((i + 1) * 45) * Math.PI / 180;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);

        const d = `M ${cx},${cy} L ${x1.toFixed(2)},${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;

        svgHtml += `
            <path id="pizza-slot-${i}" 
                  class="pizza-slot-empty" 
                  d="${d}" 
                  data-slot="${i}">
            </path>
        `;
    }

    svg.innerHTML = svgHtml;
    updatePizzaProgressDisplay();
}

// Gerçek Pizza Dilimi SVG'si (Kıvrımlı Kabuk, Erimiş Peynir ve Sucuk Parçaları)
function getPizzaSliceSvg(index) {
    return `
        <svg class="slice-bg-svg" viewBox="0 0 88 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="crust-grad-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#8D6E63"/>
                    <stop offset="35%" stop-color="#D7CCC8"/>
                    <stop offset="70%" stop-color="#BCAAA4"/>
                    <stop offset="100%" stop-color="#5D4037"/>
                </linearGradient>
                <linearGradient id="cheese-grad-${index}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFF59D"/>
                    <stop offset="40%" stop-color="#FFD54F"/>
                    <stop offset="85%" stop-color="#FFB300"/>
                    <stop offset="100%" stop-color="#FF8F00"/>
                </linearGradient>
            </defs>
            <!-- Alt Dilim Gövdesi (Peynir) -->
            <path d="M 6,24 Q 44,14 82,24 L 47,97 Q 44,99 41,97 Z" 
                  fill="url(#cheese-grad-${index})" 
                  stroke="#FFA000" 
                  stroke-width="1.5" />
            <!-- Üstteki Pişmiş Kabuk (Crust) -->
            <path d="M 4,24 Q 44,4 84,24 Q 44,16 4,24 Z" 
                  fill="url(#crust-grad-${index})" 
                  stroke="#4E342E" 
                  stroke-width="1.5" />
            <!-- Sucuk ve Malzemeler -->
            <circle cx="26" cy="46" r="6" fill="#D32F2F" stroke="#B71C1C" stroke-width="1.5"/>
            <circle cx="62" cy="50" r="5.5" fill="#D32F2F" stroke="#B71C1C" stroke-width="1.5"/>
            <circle cx="44" cy="76" r="5" fill="#D32F2F" stroke="#B71C1C" stroke-width="1.5"/>
            <!-- Baharat Puanları -->
            <circle cx="36" cy="62" r="1.5" fill="#388E3C"/>
            <circle cx="52" cy="66" r="1.5" fill="#2E7D32"/>
            <circle cx="48" cy="38" r="1.5" fill="#388E3C"/>
        </svg>
    `;
}

// Dışarıdaki 8 Dilimi 4 Kümeye (Üst, Alt, Sol, Sağ) 2'şer Adet Dağıtma
function renderOuterSlices() {
    const clusters = {
        top: document.getElementById('cluster-top'),
        bottom: document.getElementById('cluster-bottom'),
        left: document.getElementById('cluster-left'),
        right: document.getElementById('cluster-right')
    };

    Object.values(clusters).forEach(c => { if (c) c.innerHTML = ''; });

    const distribution = [
        { cluster: 'top', items: [pizzaSliceItems[0], pizzaSliceItems[1]] },
        { cluster: 'right', items: [pizzaSliceItems[2], pizzaSliceItems[3]] },
        { cluster: 'bottom', items: [pizzaSliceItems[4], pizzaSliceItems[5]] },
        { cluster: 'left', items: [pizzaSliceItems[6], pizzaSliceItems[7]] }
    ];

    distribution.forEach(({ cluster, items }) => {
        const container = clusters[cluster];
        if (!container) return;

        items.forEach((item, idx) => {
            if (!item) return;
            const globalIndex = pizzaSliceItems.indexOf(item);
            const card = document.createElement('div');
            card.className = 'pizza-slice-card';
            card.id = `pizza-slice-${globalIndex}`;
            card.dataset.index = globalIndex;

            card.innerHTML = `
                ${getPizzaSliceSvg(globalIndex)}
                <div class="slice-badge-content">
                    <div class="slice-icon-badge">
                        ${renderImageElement(item)}
                    </div>
                    <div class="slice-label-badge">${item.tr}</div>
                </div>
            `;

            card.onclick = () => handlePizzaSliceClick(item, card);
            container.appendChild(card);
        });
    });

    if (window.twemoji) {
        twemoji.parse(document.getElementById('pizza-table-container'), {
            folder: 'svg',
            ext: '.svg'
        });
    }
}

// İlerleme Durumu Metni
function updatePizzaProgressDisplay() {
    const badge = document.getElementById('pizza-progress');
    if (badge) {
        badge.textContent = `⭐ Dilimler: ${pizzaPlacedCount} / ${pizzaTotalSlices} Yerleşti`;
    }
}

// Yeni Hedef Kelime Belirleme ve Seslendirme
function setNextPizzaTarget() {
    const unplaced = pizzaSliceItems.filter((item, idx) => {
        const card = document.getElementById(`pizza-slice-${idx}`);
        return card && !card.classList.contains('placed');
    });

    if (unplaced.length === 0) {
        animatePizzaCompletion();
        return;
    }

    currentPizzaTarget = unplaced[Math.floor(Math.random() * unplaced.length)];

    const wordEl = document.getElementById('pizza-target-word');
    const phoneticEl = document.getElementById('pizza-target-phonetic');
    const targetCard = document.getElementById('pizza-target-card');

    if (wordEl && phoneticEl) {
        wordEl.textContent = currentPizzaTarget.ar;
        phoneticEl.textContent = `(${currentPizzaTarget.ok})`;

        if (selectedLanguage === 'arabic') {
            wordEl.className = 'pizza-target-word arabic-text';
        } else {
            wordEl.className = 'pizza-target-word';
        }
    }

    if (targetCard) {
        targetCard.classList.remove('pulse-target');
        void targetCard.offsetWidth;
        targetCard.classList.add('pulse-target');
    }

    setTimeout(() => {
        speakWord(currentPizzaTarget.ar);
    }, 350);
}

function pronouncePizzaTarget() {
    if (!currentPizzaTarget) return;
    playClickSound();
    speakWord(currentPizzaTarget.ar);
}

// Pizza Dilimi Tıklama Kontrolü
function handlePizzaSliceClick(item, cardEl) {
    if (isPizzaProcessing || isPizzaSpinning) return;
    if (cardEl.classList.contains('placed')) return;
    if (!currentPizzaTarget) return;

    if (item.ar === currentPizzaTarget.ar) {
        // Doğru Dilim!
        isPizzaProcessing = true;

        // İlk boş slotu bul
        let targetSlot = pizzaSlotOccupants.indexOf(null);
        if (targetSlot === -1) targetSlot = pizzaPlacedCount % 8;
        pizzaSlotOccupants[targetSlot] = item;

        // Dilimin Tepsiye Uçuş Animasyonu
        animateFlyingSliceToCenter(cardEl, targetSlot, item, () => {
            // Slotu doldur
            fillPizzaSlot(targetSlot, item);
            playCorrectSound();
            addStar(1);
            pizzaPlacedCount++;
            updatePizzaProgressDisplay();
            showFeedback("Harika! Dilim yerine oturdu 🍕✨");

            if (pizzaPlacedCount >= pizzaTotalSlices) {
                setTimeout(animatePizzaCompletion, 700);
            } else {
                setTimeout(() => {
                    setNextPizzaTarget();
                    isPizzaProcessing = false;
                }, 1000);
            }
        });
    } else {
        // Yanlış Dilim
        playWrongSound();
        cardEl.classList.add('shake');
        setTimeout(() => cardEl.classList.remove('shake'), 450);
        showFeedback("Başka bir dilimi dene! 🍕");
    }
}

// Pizza Diliminin Tepsinin Üzerine Uçup Tamamlama Animasyonu
function animateFlyingSliceToCenter(cardEl, targetSlot, item, onComplete) {
    const cardRect = cardEl.getBoundingClientRect();
    const boardEl = document.getElementById('pizza-center-board');
    if (!boardEl) {
        cardEl.classList.add('placed');
        onComplete();
        return;
    }

    const boardRect = boardEl.getBoundingClientRect();

    // Hedef slotun merkez koordinatlarını ve dönüş açısını hesapla
    const midAngleDeg = targetSlot * 45 + 22.5;
    const midAngleRad = midAngleDeg * (Math.PI / 180);
    const radius = (boardRect.width / 2) * 0.58;
    const targetCenterX = boardRect.left + (boardRect.width / 2) + radius * Math.cos(midAngleRad);
    const targetCenterY = boardRect.top + (boardRect.height / 2) + radius * Math.sin(midAngleRad);

    // Kartı klonlayıp ekranda uçur
    const flying = cardEl.cloneNode(true);
    flying.classList.add('flying-pizza-slice');
    flying.style.position = 'fixed';
    flying.style.left = cardRect.left + 'px';
    flying.style.top = cardRect.top + 'px';
    flying.style.width = cardRect.width + 'px';
    flying.style.height = cardRect.height + 'px';
    flying.style.margin = '0';
    flying.style.zIndex = '99999';
    flying.style.transition = 'none';

    // Orijinal kartı gizle ve yerleşti işaretle
    cardEl.classList.add('placed');
    cardEl.style.visibility = 'hidden';

    document.body.appendChild(flying);
    void flying.offsetWidth; // Force Reflow

    // Uçuş hedefi
    const targetLeft = targetCenterX - (cardRect.width / 2);
    const targetTop = targetCenterY - (cardRect.height / 2);
    const targetRotation = midAngleDeg - 90; // Dilim ucunu merkeze hizala

    flying.style.transition = 'all 0.65s cubic-bezier(0.2, 0.9, 0.3, 1)';
    flying.style.left = targetLeft + 'px';
    flying.style.top = targetTop + 'px';
    flying.style.transform = `scale(0.8) rotate(${targetRotation}deg)`;

    setTimeout(() => {
        if (flying.parentNode) flying.parentNode.removeChild(flying);
        onComplete();
    }, 650);
}

// Tepsiyi Doldurma ve Merkeze Net Rozet Yerleştirme
function fillPizzaSlot(slotIndex, item) {
    const slotPath = document.getElementById(`pizza-slot-${slotIndex}`);
    if (slotPath) {
        slotPath.setAttribute('class', 'pizza-slot-filled');
    }

    const overlay = document.getElementById('pizza-center-overlay');
    if (!overlay) return;

    // Slotun merkez açısı ve yüzde konumu
    const midAngleRad = (slotIndex * 45 + 22.5) * (Math.PI / 180);
    const posX = 50 + 31 * Math.cos(midAngleRad);
    const posY = 50 + 31 * Math.sin(midAngleRad);

    const placedBadge = document.createElement('div');
    placedBadge.className = 'placed-slice-item';
    placedBadge.style.left = posX + '%';
    placedBadge.style.top = posY + '%';
    placedBadge.style.transform = 'translate(-50%, -50%)';

    placedBadge.innerHTML = `
        <div class="placed-slice-badge">
            ${renderImageElement(item)}
        </div>
    `;

    overlay.appendChild(placedBadge);

    if (window.twemoji) {
        twemoji.parse(placedBadge, {
            folder: 'svg',
            ext: '.svg'
        });
    }
}

// Tüm Dilimler Bitince Pizzanın Dönmesi, Konfetiler ve Bitiş
function animatePizzaCompletion() {
    isPizzaSpinning = true;
    playCelebrationSound();
    showConfetti();
    showFeedback("Tebrikler! Bütün dilimler yerleşti, pizza hazır! 🍕🎉");

    const board = document.getElementById('pizza-center-board');
    if (board) {
        board.classList.add('spinning');
    }

    setTimeout(() => {
        showGameComplete();
    }, 2700);
}


