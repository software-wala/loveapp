/* ======================================================
   FLOATING BACKGROUND HEARTS
   ====================================================== */
const heartEmojis = ['💖','💗','💓','💞','💕','❤️','🩷','💝','💘','🌸'];
const bgHearts = document.getElementById('bgHearts');

function spawnBgHeart() {
  const el = document.createElement('span');
  el.className = 'bg-heart';
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 2) + 'rem';
  const dur = 5 + Math.random() * 9;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = (Math.random() * 2) + 's';
  bgHearts.appendChild(el);
  setTimeout(() => el.remove(), (dur + 4) * 1000);
}
for (let i = 0; i < 14; i++) setTimeout(spawnBgHeart, i * 300);
setInterval(spawnBgHeart, 600);


/* ======================================================
   NO BUTTON — CONTINUOUS AUTO-MOVEMENT + MOUSE DODGE
   ====================================================== */
const noBtn   = document.getElementById('noBtn');
const counter = document.getElementById('noCounter');

let nx = 0, ny = 0, vx = 0, vy = 0;
let mouseX = -999, mouseY = -999;
let noBtnRunning = false;

const taunts = [
  "Nope, can't touch this! 🕺",
  "I'm too fast for you! 💨",
  "You'll never catch me! 😝",
  "Try harder… or just say YES! 😭",
  "WHEEE! 🎉",
  "I live here now 🏠",
  "Just say Yes already! 🥺",
  "Hahaha! 😂",
  "Pleaseee pick Yes 👉👈",
  "I'm literally flying 🚀",
  "This is my cardio 🏃💨",
  "Still running… ♾️",
  "Catch me if you can 😏",
];
let tauntIdx = 0;

function startNoBtn() {
  if (noBtnRunning) return;
  noBtnRunning = true;

  const bw = noBtn.offsetWidth  || 110;
  const bh = noBtn.offsetHeight || 52;
  nx = window.innerWidth  * 0.72 - bw / 2;
  ny = window.innerHeight * 0.50 - bh / 2;
  vx = 2.5 * (Math.random() > .5 ? 1 : -1);
  vy = 2.5 * (Math.random() > .5 ? 1 : -1);

  noBtn.style.left = nx + 'px';
  noBtn.style.top  = ny + 'px';
  requestAnimationFrame(animateNo);
}

function animateNo() {
  if (!noBtnRunning) return;

  const bw = noBtn.offsetWidth  || 110;
  const bh = noBtn.offsetHeight || 52;
  const W  = window.innerWidth;
  const H  = window.innerHeight;
  const M  = 10;
  const REPEL = 170;

  const cx = nx + bw / 2, cy = ny + bh / 2;
  const dx = cx - mouseX,  dy = cy - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < REPEL && dist > 0) {
    const force = ((REPEL - dist) / REPEL) * 9;
    vx += (dx / dist) * force;
    vy += (dy / dist) * force;
  }

  const spd = Math.sqrt(vx * vx + vy * vy);
  const MAX = 10, MIN = 1.8;
  if (spd > MAX) { vx = (vx/spd)*MAX; vy = (vy/spd)*MAX; }
  if (spd < MIN && dist > REPEL) { vx += (Math.random()-.5)*.6; vy += (Math.random()-.5)*.6; }

  vx *= 0.98; vy *= 0.98;
  nx += vx;   ny += vy;

  if (nx < M)         { nx = M;         vx =  Math.abs(vx)*1.05; }
  if (nx > W-bw-M)    { nx = W-bw-M;    vx = -Math.abs(vx)*1.05; }
  if (ny < M)         { ny = M;         vy =  Math.abs(vy)*1.05; }
  if (ny > H-bh-M)    { ny = H-bh-M;    vy = -Math.abs(vy)*1.05; }

  noBtn.style.left = nx + 'px';
  noBtn.style.top  = ny + 'px';

  requestAnimationFrame(animateNo);
}

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
document.addEventListener('touchmove', e => {
  mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY;
}, { passive: true });

setInterval(() => {
  if (!noBtnRunning) return;
  counter.textContent = taunts[tauntIdx % taunts.length];
  tauntIdx++;
}, 2400);

setTimeout(startNoBtn, 900);


/* ======================================================
   YES — trigger full celebration sequence
   ====================================================== */
function onYes() {
  noBtnRunning = false;
  noBtn.style.display = 'none';
  document.getElementById('mainCard').style.display = 'none';

  const screen = document.getElementById('celebrateScreen');
  screen.classList.add('show');

  // Rapid confetti right away
  launchConfetti();

  // Sparkle burst on screen centre
  for (let i = 0; i < 18; i++) {
    setTimeout(() => spawnSparkle(), i * 60);
  }

  // Mini hearts raining on celebrate screen
  startMiniFloats();

  // Extra bg hearts
  for (let i = 0; i < 30; i++) setTimeout(spawnBgHeart, i * 80);
}


/* ======================================================
   CONFETTI
   ====================================================== */
const confettiColors = [
  '#ff4d8d','#ff1a6e','#ffd700','#c44dff','#ff9de2',
  '#7b00ff','#00e5ff','#fff','#ff6b6b','#ffa07a','#f9a8d4','#86efac',
];
const confettiContainer = document.getElementById('confettiContainer');

function launchConfetti() {
  fire(200, 0);
  setTimeout(() => fire(120, 0),  700);
  setTimeout(() => fire(100, 0), 1500);
  setTimeout(() => fire(80,  0), 2600);
}

function fire(count, base) {
  for (let i = 0; i < count; i++) setTimeout(createPiece, base + i * 12);
}

function createPiece() {
  const el = document.createElement('div');
  el.className = 'confetti-piece';
  const color  = confettiColors[Math.floor(Math.random() * confettiColors.length)];
  const size   = 7 + Math.random() * 13;
  const circle = Math.random() > .45;
  el.style.cssText = `
    left:${Math.random()*100}vw;
    width:${size}px;
    height:${circle ? size : size*(0.35+Math.random()*.65)}px;
    border-radius:${circle?'50%':'3px'};
    background:${color};
    animation-duration:${2+Math.random()*3.5}s;
    animation-delay:${Math.random()*.4}s;
  `;
  confettiContainer.appendChild(el);
  setTimeout(() => el.remove(), 7000);
}


/* ======================================================
   SPARKLES (centre burst on Yes)
   ====================================================== */
const sparkleContainer = document.getElementById('sparkleContainer');
const sparkleEmojis = ['✨','⭐','🌟','💫','🔥','🎆','🎇','💥'];

function spawnSparkle() {
  const el = document.createElement('span');
  el.className = 'sparkle';
  el.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
  el.style.left = (20 + Math.random() * 60) + 'vw';
  el.style.top  = (10 + Math.random() * 70) + 'vh';
  const dur = 0.7 + Math.random() * 0.8;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = Math.random() * 0.3 + 's';
  sparkleContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 0.5) * 1000);
}

// Keep spawning sparkles for a while after yes
let sparkleTimer = null;
function startSparkles() {
  let count = 0;
  sparkleTimer = setInterval(() => {
    spawnSparkle();
    count++;
    if (count > 60) clearInterval(sparkleTimer);
  }, 180);
}


/* ======================================================
   MINI HEART FLOATS ON CELEBRATE SCREEN
   ====================================================== */
const miniFloats = document.getElementById('miniFloats');
let miniTimer = null;

function startMiniFloats() {
  startSparkles();
  let count = 0;
  miniTimer = setInterval(() => {
    spawnMini();
    count++;
    if (count > 50) clearInterval(miniTimer);
  }, 250);
}

function spawnMini() {
  const el = document.createElement('span');
  el.className = 'mini-float';
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  el.style.left = (5 + Math.random() * 90) + '%';
  el.style.bottom = '0';
  const dur = 2.5 + Math.random() * 3;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay   = Math.random() * 1 + 's';
  miniFloats.appendChild(el);
  setTimeout(() => el.remove(), (dur + 1.5) * 1000);
}


/* ======================================================
   RESTART
   ====================================================== */
function restart() {
  noBtnRunning = false;
  clearInterval(miniTimer);
  clearInterval(sparkleTimer);

  tauntIdx = 0;
  counter.textContent = '';
  noBtn.style.display = '';
  document.getElementById('mainCard').style.display = '';
  document.getElementById('celebrateScreen').classList.remove('show');

  setTimeout(startNoBtn, 400);
}
