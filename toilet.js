const professor = document.getElementById('professor');
const water = document.getElementById('water');
const whirlpool = document.getElementById('whirlpool');
const message = document.getElementById('message');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const bowl = document.getElementById('bowl');
const resetBtn = document.getElementById('resetBtn');
const changeBtn = document.getElementById('changeBtn');
const modal = document.getElementById('modal');
const nameInput = document.getElementById('nameInput');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const profNameEl = professor.querySelector('.professor-name');
const titleName = document.getElementById('titleName');
const comboCountEl = document.getElementById('comboCount');
const bestComboEl = document.getElementById('bestCombo');
const autoBtn = document.getElementById('autoBtn');
const autoFlushBtn = document.getElementById('autoFlushBtn');
const comboDisplay = document.getElementById('comboDisplay');
const comboBar = document.getElementById('comboBar');

let currentName = localStorage.getItem('profName') || '소융대';
let score = 0, best = 0, isFlushing = false;
let autoMode = false, autoTimer = null, autoInterval = 3000;
let autoFlushMode = false, autoFlushTimer = null, autoFlushOwned = false;
let combo = 0, bestCombo = 0, comboTimer = null;
const COMBO_TIMEOUT = 3000;

const comboMsgs = [
  "싸악~ 🌊", "잘 가요 교수님! 👋", "꼬르륵~ 🌀",
  "물 아껴주세요!", "푸우웅~", "교수님 안녕! 😱",
  "소용돌이!!! 🌪️", "냄새 날라도 괜찮아? 😷",
  "급행 열차 출발~ 🚄", "다음 역: 하수구 🚇",
];
const comboSpecials = [
  "", "", "🔥 더블!", "🔥 트리플!!",
  "🔥 쿼드!!", "🔥 펜타!!", "🔥 헥사!!!",
  "🔥 미친 콤보!!!!", "🔥 초강력!!!!!", "🔥 전설!!!!!!",
];

function hasComboDisplay() {
  return shopItems.find(i => i.id === 'combo_display').owned;
}
function hasComboBar() {
  return shopItems.find(i => i.id === 'combo_bar').owned;
}
function hasComboBonus() {
  return shopItems.find(i => i.id === 'combo_bonus').owned;
}

changeBtn.addEventListener('click', () => {
  nameInput.value = currentName;
  modal.classList.add('show');
  nameInput.focus();
});
confirmBtn.addEventListener('click', () => {
  const newName = nameInput.value.trim();
  if (newName) {
    currentName = newName;
    profNameEl.textContent = currentName;
    titleName.textContent = currentName + ' 교수님';
document.title = currentName + ' 교수님을 변기에 넣고 내려!';
profNameEl.textContent = currentName;
titleName.textContent = currentName + ' 교수님';
    localStorage.setItem('profName', currentName);
    if (typeof gpuPlayer !== 'undefined') gpuPlayer.targetName = currentName;
  }
  modal.classList.remove('show');
});
cancelBtn.addEventListener('click', () => modal.classList.remove('show'));
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmBtn.click();
  if (e.key === 'Escape') cancelBtn.click();
});

function updateComboDisplay() {
  if (!hasComboDisplay()) return;
  comboCountEl.textContent = combo;
  bestComboEl.textContent = bestCombo;
  if (combo >= 2) {
    comboDisplay.textContent = combo + ' COMBO!';
    comboDisplay.classList.add('show');
  } else {
    comboDisplay.classList.remove('show');
  }
}
function resetComboBar() {
  if (!hasComboBar()) return;
  comboBar.style.width = '100%';
  let start = Date.now();
  (function tick() {
    let remaining = Math.max(0, 1 - (Date.now() - start) / COMBO_TIMEOUT);
    comboBar.style.width = (remaining * 100) + '%';
    if (remaining > 0 && combo >= 1) requestAnimationFrame(tick);
  })();
}
function breakCombo() {
  combo = 0;
  if (hasComboDisplay()) comboDisplay.classList.remove('show');
  if (hasComboBar()) comboBar.style.width = '0%';
}

autoBtn.addEventListener('click', () => {
  autoMode = !autoMode;
  autoBtn.classList.toggle('active', autoMode);
  autoBtn.textContent = autoMode ? '⏹ 자동 넣기 끄기' : '🔄 자동 넣기';
  if (autoMode) startAutoInsert();
  else { clearTimeout(autoTimer); autoTimer = null; }
});

autoFlushBtn.addEventListener('click', () => {
  if (!autoFlushOwned) return;
  autoFlushMode = !autoFlushMode;
  autoFlushBtn.classList.toggle('active', autoFlushMode);
  autoFlushBtn.textContent = autoFlushMode ? '⏹ 자동 내리기 끄기' : '🚿 자동 내리기';
  if (autoFlushMode) startAutoFlush();
  else { clearTimeout(autoFlushTimer); autoFlushTimer = null; }
});

function startAutoFlush() {
  if (!autoFlushMode) return;
  if (isFlushing) {
    clearTimeout(autoFlushTimer);
    autoFlushTimer = setTimeout(startAutoFlush, 300);
    return;
  }
  flush();
  autoFlushTimer = setTimeout(startAutoFlush, 1800);
}

function startAutoInsert() {
  if (!autoMode) return;
  if (isFlushing) reset();
  autoTimer = setTimeout(startAutoInsert, autoInterval);
}

function flush() {
  if (isFlushing) return;
  isFlushing = true;
  professor.classList.add('flushing');
  water.classList.add('flushing');
  whirlpool.classList.add('active');
  combo++;
  if (combo > bestCombo) bestCombo = combo;
  clearTimeout(comboTimer);
  comboTimer = setTimeout(breakCombo, COMBO_TIMEOUT);
  resetComboBar();
  updateComboDisplay();
  let msg;
  if (hasComboDisplay() && combo >= 2) msg = comboSpecials[Math.min(combo, comboSpecials.length - 1)];
  else msg = comboMsgs[Math.floor(Math.random() * comboMsgs.length)];
  message.textContent = msg;
  message.classList.add('show');
  score++;
  scoreEl.textContent = score;
  if (score > best) { best = score; bestEl.textContent = best; }
  let dlpcReward = 1;
  if (hasComboBonus()) dlpcReward += getComboBonus() * combo;
  if (getTurboBonus() > 0) dlpcReward += getTurboBonus();
  if (shopItems.find(i => i.id === 'dlpc_booster').owned) dlpcReward *= 2;
  addDlpc(dlpcReward, hasComboBonus() && combo >= 2 ? 'x' + combo + ' 콤보!' : '');
  createSplash();
  setTimeout(() => {
    whirlpool.classList.remove('active');
    message.classList.remove('show');
    if (autoMode || autoFlushMode) setTimeout(reset, 300);
  }, 1500);
}

function createSplash() {
  const splashes = ['💧', '💦', '🌊', '🫧'];
  for (let i = 0; i < 4; i++) {
    const el = document.createElement('div');
    el.className = 'splash';
    el.textContent = splashes[Math.floor(Math.random() * splashes.length)];
    el.style.left = (80 + Math.random() * 80) + 'px';
    el.style.bottom = (100 + Math.random() * 40) + 'px';
    bowl.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }
}

function reset() {
  isFlushing = false;
  professor.classList.remove('flushing');
  water.classList.remove('flushing');
  whirlpool.classList.remove('active');
  message.classList.remove('show');
}

bowl.addEventListener('click', flush);
resetBtn.addEventListener('click', reset);

document.addEventListener('keydown', (e) => {
  if (typeof gpuRunning !== 'undefined' && gpuRunning) return;
  const shortcutItem = shopItems.find(i => i.id === 'keyboard_shortcut');
  if (!shortcutItem || !shortcutItem.owned || !shortcutItem.active) return;
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    flush();
  } else if (e.key === 'r' || e.key === 'R') {
    reset();
  }
});

if (typeof applyLoadedEffects === 'function') applyLoadedEffects();

document.title = currentName + ' 교수님을 변기에 넣고 내려!';

function resetToiletGame() {
  currentName = '소융대';
  profNameEl.textContent = currentName;
  titleName.textContent = currentName + ' 교수님';
  document.title = currentName + ' 교수님을 변기에 넣고 내려!';
  if (typeof gpuPlayer !== 'undefined') gpuPlayer.targetName = currentName;
  localStorage.removeItem('profName');
  score = 0; best = 0; combo = 0; bestCombo = 0;
  scoreEl.textContent = 0; bestEl.textContent = 0;
  autoMode = false; autoFlushMode = false;
  autoInterval = 3000;
  clearTimeout(autoTimer); clearTimeout(autoFlushTimer); clearTimeout(comboTimer);
  autoTimer = null; autoFlushTimer = null;
  autoBtn.classList.remove('active');
  autoBtn.textContent = '🔄 자동 넣기';
  autoFlushBtn.classList.remove('active');
  autoFlushBtn.textContent = '🔒 자동 내리기 (🔒)';
  autoFlushBtn.classList.remove('unlocked');
  autoFlushOwned = false;
  autoFlushBtn.title = '상점에서 구매 필요';
  reset();
  updateComboDisplay();
}