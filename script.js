/* =========================================================
   КОНФИГ — здесь легко менять фото, подписи, текст, музыку
   ========================================================= */
const PHOTOS = [
  { src: "assets/photo1.jpg", caption: "" },
  { src: "assets/photo2.jpg", caption: "" },
  { src: "assets/photo3.jpg", caption: "" },
  { src: "assets/photo4.jpg", caption: "" },
  { src: "assets/photo5.jpg", caption: "" },
  { src: "assets/photo6.jpg", caption: "" },
  { src: "assets/photo7.jpg", caption: "" },
  { src: "assets/photo8.jpg", caption: "" },
];

const WISH_TEXT = `Вот и наступил этот особенный день — день твоего рождения.

Я очень хочу пожелать тебе бесконечного счастья, реализации всех твоих идей и желаний. Спасибо тебе за то, что ты есть в моей жизни, за твою невероятную любовь, поддержку и за все безумно яркие моменты, которые мы проживаем вместе.

Я искренне верю, что впереди нас ждёт удивительная жизнь, полная любви, взаимопонимания, путешествий, счастливых событий и незабываемых моментов. Мне хочется прожить с тобой ещё множество прекрасных лет, вместе осуществлять мечты, радоваться каждому дню и создавать нашу собственную счастливую историю.

Пусть абсолютно каждый день будет наполнен радостью, смехом и теплом самых близких людей. А я обещаю делать всё, чтобы ты чувствовала себя любимой, счастливой и самой особенной девочкой на свете.

Ещё раз с днём рождения, моя любимая Яна 🌸

Люблю тебя безумно и с нетерпением жду всего прекрасного, что ждёт нас впереди. 
P.S. ХАВПХАХПА, пиздец мы упоротые чут чут, ну зато самые лучшие, оставайся такой всегда, моей самой любимой`;


const YT_VIDEO_ID = "BLtlUYy7rkM";

/* =========================================================
   ПЕЛЕПЕСТКИ / FLOATING PETALS
   ========================================================= */
(function petals() {
  const container = document.getElementById('petals');
  const emojis = ['🌸', '🌷', '✨', '💗'];
  const count = window.innerWidth < 600 ? 10 : 16;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.fontSize = (14 + Math.random() * 14) + 'px';
    const duration = 10 + Math.random() * 12;
    const delay = Math.random() * -duration;
    p.style.animationDuration = `${duration}s, ${3 + Math.random() * 2}s`;
    p.style.animationDelay = `${delay}s, ${delay}s`;
    container.appendChild(p);
  }
})();

/* =========================================================
   SCROLL CUE
   ========================================================= */
document.getElementById('scrollCue').addEventListener('click', () => {
  document.getElementById('album').scrollIntoView({ behavior: 'smooth' });
});

/* =========================================================
   ALBUM / CAROUSEL
   ========================================================= */
const track = document.getElementById('albumTrack');
const dotsWrap = document.getElementById('albumDots');
const currentLabel = document.getElementById('albumCurrent');
const totalLabel = document.getElementById('albumTotal');

let current = 0;
let autoTimer = null;

function buildAlbum() {
  PHOTOS.forEach((p, i) => {
    const slide = document.createElement('div');
    slide.className = 'album-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `<img src="${p.src}" alt="Фото ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">` +
      (p.caption ? `<div class="album-caption">${p.caption}</div>` : '');
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'album-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Перейти к фото ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  totalLabel.textContent = PHOTOS.length;
}

function goTo(index) {
  const slides = track.querySelectorAll('.album-slide');
  const dots = dotsWrap.querySelectorAll('.album-dot');

  slides[current].classList.remove('active');
  slides[current].classList.add('prev');
  dots[current].classList.remove('active');

  current = (index + PHOTOS.length) % PHOTOS.length;

  slides.forEach((s, i) => { if (i !== current) s.classList.remove('active'); });
  slides[current].classList.add('active');
  slides[current].classList.remove('prev');
  dots[current].classList.add('active');

  currentLabel.textContent = current + 1;

  setTimeout(() => {
    slides.forEach((s, i) => { if (i !== current) s.classList.remove('prev'); });
  }, 700);

  restartAutoplay();
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);

function restartAutoplay() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(next, 4500);
}

/* swipe support */
const windowEl = document.getElementById('albumWindow');
let touchStartX = 0;
windowEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
windowEl.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 40) diff < 0 ? next() : prev();
}, { passive: true });

/* keyboard support */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

buildAlbum();
restartAutoplay();

/* =========================================================
   WISH TEXT INJECT
   ========================================================= */
document.getElementById('wishText').textContent = WISH_TEXT;

/* =========================================================
   MUSIC — hidden YouTube player, autoplay muted -> unmute on
   first user interaction (works reliably across browsers)
   ========================================================= */
let ytPlayer = null;
let ytReady = false;
let userWantsSound = true;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '1',
    width: '1',
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: YT_VIDEO_ID,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: (e) => {
        ytReady = true;
        e.target.mute();
        e.target.playVideo();
        attemptUnmute();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        }
      }
    }
  });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

const musicToggle = document.getElementById('musicToggle');
const iconMuted = document.getElementById('iconMuted');
const iconOn = document.getElementById('iconOn');
const musicLabel = document.getElementById('musicLabel');

function setUIPlaying(isOn) {
  iconMuted.style.display = isOn ? 'none' : 'block';
  iconOn.style.display = isOn ? 'block' : 'none';
  musicLabel.textContent = isOn ? 'звук включён' : 'включить звук';
}

function attemptUnmute() {
  if (!ytReady) return;
  try {
    ytPlayer.unMute();
    ytPlayer.setVolume(70);
    ytPlayer.playVideo();
    setUIPlaying(true);
  } catch (err) {
    setUIPlaying(false);
  }
}

/* try to unmute on the very first interaction anywhere on the page */
function firstInteractionUnmute() {
  attemptUnmute();
  window.removeEventListener('click', firstInteractionUnmute);
  window.removeEventListener('touchstart', firstInteractionUnmute);
  window.removeEventListener('keydown', firstInteractionUnmute);
}
window.addEventListener('click', firstInteractionUnmute, { once: true });
window.addEventListener('touchstart', firstInteractionUnmute, { once: true });
window.addEventListener('keydown', firstInteractionUnmute, { once: true });

musicToggle.addEventListener('click', () => {
  if (!ytReady) return;
  const muted = ytPlayer.isMuted();
  if (muted) {
    ytPlayer.unMute();
    ytPlayer.setVolume(70);
    ytPlayer.playVideo();
    setUIPlaying(true);
  } else {
    ytPlayer.mute();
    setUIPlaying(false);
  }
});
