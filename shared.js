let dlpcTokens = parseInt(localStorage.getItem('dlpcTokens')) || 0;
let endingTriggered = localStorage.getItem('endingTriggered') === 'true';

const dlpcAmount = document.getElementById('dlpcAmount');
const dlpcGainEl = document.getElementById('dlpcGain');
dlpcAmount.textContent = dlpcTokens;
const gpuDlpcInit = document.getElementById('gpuDlpc');
if (gpuDlpcInit) gpuDlpcInit.textContent = dlpcTokens;

function addDlpc(amount, label) {
  dlpcTokens += amount;
  dlpcAmount.textContent = dlpcTokens;
  dlpcAmount.classList.remove('bump');
  void dlpcAmount.offsetWidth;
  dlpcAmount.classList.add('bump');
  dlpcGainEl.textContent = '+' + amount + ' DLPC 토큰' + (label ? ' ' + label : '');
  dlpcGainEl.classList.remove('show');
  void dlpcGainEl.offsetWidth;
  dlpcGainEl.classList.add('show');
  const gpuDlpcEl = document.getElementById('gpuDlpc');
  if (gpuDlpcEl) gpuDlpcEl.textContent = dlpcTokens;
  localStorage.setItem('dlpcTokens', dlpcTokens);
  checkEnding();
}

function checkEnding() {
  if (dlpcTokens >= 1000 && !endingTriggered) {
    endingTriggered = true;
    localStorage.setItem('endingTriggered', 'true');
    showEnding();
  }
}

function showEnding() {
  const modal = document.getElementById('endingModal');
  document.getElementById('endingProfName').textContent = typeof currentName !== 'undefined' ? currentName : '소융대';
  if (typeof score !== 'undefined') document.getElementById('endingScore').textContent = score;
  if (typeof bestCombo !== 'undefined') document.getElementById('endingCombo').textContent = bestCombo;
  if (typeof gpuScoreVal !== 'undefined') document.getElementById('endingGpuScore').textContent = gpuScoreVal;
  modal.classList.add('show');
}

function enterPostEnding() {
  const toilet = document.getElementById('toilet');
  const hint = document.querySelector('.tap-hint');
  const gradSchool = document.getElementById('gradSchool');
  if (toilet) toilet.style.display = 'none';
  if (hint) hint.style.display = 'none';
  if (gradSchool) {
    gradSchool.style.display = 'flex';
    gradSchool.classList.add('ending-burst');
  }
  const titleEl = document.getElementById('titleName');
  if (titleEl) titleEl.textContent = (typeof currentName !== 'undefined' ? currentName : '소융대') + ' 교수님 🎓';
  document.title = (typeof currentName !== 'undefined' ? currentName : '소융대') + ' 교수님의 대학원 진학!';
}

const shopCategories = [
  { id: 'toilet', name: '🚽 변기', },
  { id: 'gpu', name: '🐺 GPU 게임', },
  { id: 'combo', name: '💥 콤보', },
  { id: 'respect', name: '🙇 교수존경', },
  { id: 'special', name: '⭐ 특수', },
];

const shopItems = [
  { id: 'golden_toilet', icon: '🚽', name: '황금 변기', desc: '변기가 황금빛으로 빛나요!', price: 10, category: 'toilet', effect: 'golden', owned: false, active: false, togglable: true },
  { id: 'diamond_water', icon: '💎', name: '다이아몬드 물', desc: '물이 다이아몬드처럼 반짝!', price: 15, category: 'toilet', effect: 'diamond', owned: false, active: false, togglable: true },
  { id: 'turbo_flush', icon: '⚡', name: '터보 내리기', desc: '내릴 때마다 추가 DLPC 토큰', category: 'toilet', effect: 'turbo', owned: false, currentLevel: 0,
    levels: [
      { price: 20, bonus: 2, desc: 'Lv1: 내릴 때마다 +2 DLPC 토큰' },
      { price: 50, bonus: 4, desc: 'Lv2: 내릴 때마다 +4 DLPC 토큰' },
      { price: 120, bonus: 8, desc: 'Lv3: 내릴 때마다 +8 DLPC 토큰' },
    ]
  },
  { id: 'auto_speed_1', icon: '🐇', name: '빠른 넣기 I', desc: '자동 넣기 3초→2초', price: 20, category: 'toilet', effect: 'auto1', owned: false },
  { id: 'auto_speed_2', icon: '🐆', name: '빠른 넣기 II', desc: '자동 넣기 2초→1초', price: 50, category: 'toilet', effect: 'auto2', owned: false },
  { id: 'auto_flush_unlock', icon: '🚿', name: '자동 내리기', desc: '자동으로 물을 내려주는 기능 잠금해제', price: 30, category: 'toilet', effect: 'autoflush', owned: false },
  { id: 'keyboard_shortcut', icon: '⌨️', name: '단축키 해금', desc: 'Space=내리기, R=넣기!', price: 25, category: 'toilet', effect: 'shortcut', owned: false, active: false, togglable: true },
  { id: 'speed_boost', icon: '👟', name: '스피드 부스트', desc: 'GPU게임 이동속도 영구 증가', price: 15, category: 'gpu', effect: 'speed', owned: false },
  { id: 'dash_unlock', icon: '💨', name: '대쉬 해금', desc: 'GPU게임에서 SHIFT 대쉬 사용 가능!', price: 20, category: 'gpu', effect: 'dash', owned: false },
  { id: 'stun_weapon', icon: '⚡', name: '전기충격기', desc: 'Z/E키로 근처 경비 기절 (쿨타임 2초)', price: 30, category: 'gpu', effect: 'stun_weapon', owned: false },
  { id: 'extra_life', icon: '❤️', name: '추가 목숨', desc: 'GPU게임 목숨 +1 (구매 시마다)', price: 20, category: 'gpu', effect: 'life', owned: false },
  { id: 'gpu_spawn', icon: '🐢', name: '늑대GPU 출몰 증가', desc: 'GPU게임에서 늑대GPU 출몰 수 증가', category: 'gpu', effect: 'gpu_spawn', owned: false, currentLevel: 0,
    levels: [
      { price: 20, bonus: 2, desc: 'Lv1: GPU 2개 출몰' },
      { price: 50, bonus: 3, desc: 'Lv2: GPU 3개 출몰' },
      { price: 120, bonus: 4, desc: 'Lv3: GPU 4개 출몰' },
    ]
  },
  { id: 'combo_display', icon: '💥', name: '콤보 표시기', desc: '콤보 카운트와 텍스트를 표시!', price: 10, category: 'combo', effect: 'combo_display', owned: false },
  { id: 'combo_bar', icon: '⏱️', name: '콤보 타이머', desc: '콤보 타이머 바를 표시!', price: 15, category: 'combo', effect: 'combo_bar', owned: false },
  { id: 'combo_bonus', icon: '💰', name: '콤보 보너스', desc: '콤보 시 추가 DLPC 토큰 획득', category: 'combo', effect: 'combo_bonus', owned: false, currentLevel: 0,
    levels: [
      { price: 25, bonus: 1, desc: 'Lv1: 콤보당 +1 DLPC 토큰' },
      { price: 60, bonus: 2, desc: 'Lv2: 콤보당 +2 DLPC 토큰' },
      { price: 150, bonus: 3, desc: 'Lv3: 콤보당 +3 DLPC 토큰' },
    ]
  },
  { id: 'prof_hat', icon: '🎓', name: '학사모', desc: '교수님께 학사모를 씌워드려요!', price: 8, category: 'respect', effect: 'prof_hat', owned: false, active: false, togglable: true },
  { id: 'prof_flower', icon: '💐', name: '꽃다발', desc: '교수님께 바치는 꽃다발!', price: 12, category: 'respect', effect: 'prof_flower', owned: false, active: false, togglable: true },
  { id: 'prof_crown', icon: '👑', name: '왕관', desc: '교수님은 우리의 왕!', price: 20, category: 'respect', effect: 'prof_crown', owned: false, active: false, togglable: true },
  { id: 'prof_heart', icon: '💖', name: '하트 오라', desc: '교수님을 향한 사랑의 오라!', price: 25, category: 'respect', effect: 'prof_heart', owned: false, active: false, togglable: true },
  { id: 'prof_sparkle', icon: '✨', name: '반짝이 효과', desc: '교수님이 반짝반짝 빛나요!', price: 30, category: 'respect', effect: 'prof_sparkle', owned: false, active: false, togglable: true },
  { id: 'dlpc_booster', icon: '🔥', name: 'DLPC 부스터', desc: '모든 DLPC 토큰 획득량 2배!', price: 50, category: 'special', effect: 'booster', owned: false },
];

function getTurboBonus() {
  const item = shopItems.find(i => i.id === 'turbo_flush');
  if (!item.owned || !item.levels || item.currentLevel === 0) return 0;
  return item.levels[item.currentLevel - 1].bonus;
}

function getComboBonus() {
  const item = shopItems.find(i => i.id === 'combo_bonus');
  if (!item.owned || !item.levels || item.currentLevel === 0) return 0;
  return item.levels[item.currentLevel - 1].bonus;
}

function getGpuSpawnCount() {
  const item = shopItems.find(i => i.id === 'gpu_spawn');
  if (!item.owned || !item.levels || item.currentLevel === 0) return 1;
  return item.levels[item.currentLevel - 1].bonus;
}

function loadSaveData() {
  const saved = JSON.parse(localStorage.getItem('shopOwned') || '[]');
  for (const id of saved) {
    const item = shopItems.find(i => i.id === id);
    if (item) item.owned = true;
  }
  const savedLevels = JSON.parse(localStorage.getItem('shopLevels') || '{}');
  for (const [id, level] of Object.entries(savedLevels)) {
    const item = shopItems.find(i => i.id === id);
    if (item && item.levels) item.currentLevel = level;
    if (item && item.currentLevel > 0) item.owned = true;
  }
  const savedActive = JSON.parse(localStorage.getItem('shopActive') || '[]');
  for (const id of savedActive) {
    const item = shopItems.find(i => i.id === id);
    if (item && item.togglable) {
      item.active = true;
    }
  }
}

function saveShopData() {
  const owned = shopItems.filter(i => i.owned).map(i => i.id);
  localStorage.setItem('shopOwned', JSON.stringify(owned));
  const active = shopItems.filter(i => i.togglable && i.active).map(i => i.id);
  localStorage.setItem('shopActive', JSON.stringify(active));
  const levels = {};
  for (const item of shopItems) {
    if (item.levels && item.currentLevel > 0) {
      levels[item.id] = item.currentLevel;
    }
  }
  localStorage.setItem('shopLevels', JSON.stringify(levels));
}

let activeCategory = 'all';

function renderShop() {
  const shopBalance = document.getElementById('shopBalance');
  const shopGrid = document.getElementById('shopGrid');
  const shopTabs = document.getElementById('shopTabs');
  shopBalance.textContent = dlpcTokens;

  shopTabs.innerHTML = '';
  const allTab = document.createElement('button');
  allTab.className = 'shop-tab' + (activeCategory === 'all' ? ' active' : '');
  allTab.textContent = '🏪 전체';
  allTab.addEventListener('click', () => { activeCategory = 'all'; renderShop(); });
  shopTabs.appendChild(allTab);
  for (const cat of shopCategories) {
    const tab = document.createElement('button');
    tab.className = 'shop-tab' + (activeCategory === cat.id ? ' active' : '');
    tab.textContent = cat.name;
    tab.addEventListener('click', () => { activeCategory = cat.id; renderShop(); });
    shopTabs.appendChild(tab);
  }

  shopGrid.innerHTML = '';
  const filteredItems = activeCategory === 'all' ? shopItems : shopItems.filter(i => i.category === activeCategory);
  for (const item of filteredItems) {
    const div = document.createElement('div');
    const isMultiLevel = !!item.levels;
    const currentLevel = isMultiLevel ? item.currentLevel : 0;
    const maxLevel = isMultiLevel ? item.levels.length : 0;
    const isMaxed = isMultiLevel && currentLevel >= maxLevel;
    const isOwned = isMultiLevel ? isMaxed : item.owned;

    div.className = 'shop-item' + (isOwned && item.effect !== 'life' ? ' owned' : '');
    const isTogglable = item.togglable && item.owned;
    const isActive = item.togglable && item.active;
    const price = isMultiLevel ? (isMaxed ? 0 : item.levels[currentLevel].price) : item.price;
    const canBuy = !isMaxed && dlpcTokens >= price && !(item.owned && !isMultiLevel && item.effect !== 'life');
    const desc = isMultiLevel ? item.levels[Math.min(currentLevel, maxLevel - 1)].desc : item.desc;
    const nameWithLevel = isMultiLevel ? item.name + (currentLevel > 0 ? ' Lv' + currentLevel : '') : item.name;

    let btnHtml;
    if (isTogglable) {
      btnHtml = `<button class="item-buy toggle-btn" data-id="${item.id}">${isActive ? '✅ 켜짐' : '⬜ 꺼짐'}</button>`;
    } else if (isMaxed) {
      btnHtml = `<button class="item-buy" disabled>만렙!</button>`;
    } else if (isMultiLevel && currentLevel > 0) {
      btnHtml = `<button class="item-buy" data-id="${item.id}" ${canBuy ? '' : 'disabled'}>⬆️ 업그레이드 (${price}🪙)</button>`;
    } else {
      btnHtml = `<button class="item-buy" data-id="${item.id}" ${canBuy ? '' : 'disabled'}>${item.owned && item.effect !== 'life' ? '보유중' : '구매'}</button>`;
    }
    div.innerHTML = `
      <div class="item-icon">${item.icon}</div>
      <div class="item-name">${nameWithLevel}</div>
      <div class="item-desc">${desc}</div>
      ${isMultiLevel ? `<div class="item-price">🪙 ${price} DLPC 토큰 (${currentLevel}/${maxLevel})</div>` : `<div class="item-price">🪙 ${price} DLPC 토큰</div>`}
      ${isOwned && item.effect !== 'life' && !isTogglable ? '<div class="item-owned-badge">✅ 보유</div>' : ''}
      ${btnHtml}
    `;
    shopGrid.appendChild(div);
  }
  shopGrid.querySelectorAll('.item-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('toggle-btn')) {
        toggleEffect(btn.dataset.id);
      } else {
        buyItem(btn.dataset.id);
      }
    });
  });
}

function buyItem(id) {
  const item = shopItems.find(i => i.id === id);
  if (!item) return;
  const isMultiLevel = !!item.levels;
  if (isMultiLevel) {
    if (item.currentLevel >= item.levels.length) return;
    const price = item.levels[item.currentLevel].price;
    if (dlpcTokens < price) return;
    dlpcTokens -= price;
    dlpcAmount.textContent = dlpcTokens;
    const gpuDlpcEl = document.getElementById('gpuDlpc');
    if (gpuDlpcEl) gpuDlpcEl.textContent = dlpcTokens;
    localStorage.setItem('dlpcTokens', dlpcTokens);
    item.currentLevel++;
    item.owned = true;
    if (item.togglable) item.active = true;
    applyItemEffect(item, item.togglable ? item.active : undefined);
    saveShopData();
    renderShop();
    return;
  }
  if (item.owned && item.effect !== 'life') return;
  if (dlpcTokens < item.price) return;
  dlpcTokens -= item.price;
  dlpcAmount.textContent = dlpcTokens;
  const gpuDlpcEl = document.getElementById('gpuDlpc');
  if (gpuDlpcEl) gpuDlpcEl.textContent = dlpcTokens;
  localStorage.setItem('dlpcTokens', dlpcTokens);
  item.owned = true;
  if (item.togglable) item.active = true;
  applyItemEffect(item, item.togglable ? item.active : undefined);
  saveShopData();
  renderShop();
}

function applyItemEffect(item, enable) {
  if (item.effect === 'golden') {
    const bowl = document.getElementById('bowl');
    const tank = document.querySelector('.toilet-tank');
    const rim = document.querySelector('.toilet-rim');
    if (enable !== false) {
      bowl.style.background = 'linear-gradient(135deg, #ffd700, #ffec80)';
      bowl.style.borderColor = '#daa520';
      tank.style.background = 'linear-gradient(135deg, #ffd700, #ffec80)';
      tank.style.borderColor = '#daa520';
      rim.style.background = 'linear-gradient(135deg, #ffd700, #ffec80)';
      rim.style.borderColor = '#daa520';
    } else {
      bowl.style.background = '';
      bowl.style.borderColor = '';
      tank.style.background = '';
      tank.style.borderColor = '';
      rim.style.background = '';
      rim.style.borderColor = '';
    }
  } else if (item.effect === 'diamond') {
    const water = document.getElementById('water');
    if (enable !== false) {
      water.style.background = 'linear-gradient(135deg, rgba(0,255,255,0.7), rgba(255,0,255,0.5), rgba(0,200,255,0.6))';
    } else {
      water.style.background = '';
    }
  } else if (item.effect === 'speed') {
    item.owned = true;
    if (typeof gpuPlayer !== 'undefined') {
      gpuPlayer.speed = 2.8;
      gpuPlayer.dashSpeed = 5.2;
    }
  } else if (item.effect === 'dash') {
    item.owned = true;
    if (typeof dashUnlocked !== 'undefined') dashUnlocked = true;
  } else if (item.effect === 'stun_weapon') {
    item.owned = true;
    if (typeof weaponUnlocked !== 'undefined') weaponUnlocked = true;
  } else if (item.effect === 'life') {
    if (typeof gpuLives !== 'undefined' && gpuLives < 5) {
      gpuLives++;
      let h = '';
      for (let i = 0; i < gpuLives; i++) h += '❤️';
      const gpuLivesEl = document.getElementById('gpuLives');
      if (gpuLivesEl) gpuLivesEl.textContent = h || '💀';
    }
  } else if (item.effect === 'auto1') {
    item.owned = true;
    if (typeof autoInterval !== 'undefined') autoInterval = 2000;
  } else if (item.effect === 'auto2') {
    item.owned = true;
    shopItems.find(i => i.id === 'auto_speed_1').owned = true;
    if (typeof autoInterval !== 'undefined') autoInterval = 1000;
  } else if (item.effect === 'autoflush') {
    item.owned = true;
    if (typeof autoFlushOwned !== 'undefined') {
      autoFlushOwned = true;
      const autoFlushBtn = document.getElementById('autoFlushBtn');
      autoFlushBtn.classList.add('unlocked');
      autoFlushBtn.textContent = '🚿 자동 내리기';
      autoFlushBtn.title = '';
    }
} else if (item.effect === 'combo_display') {
    item.owned = true;
    const comboSection = document.getElementById('comboScoreSection');
    const comboDisplayEl = document.getElementById('comboDisplay');
    if (enable !== false) {
      if (comboSection) comboSection.style.display = '';
      if (comboDisplayEl) comboDisplayEl.style.display = '';
    } else {
      if (comboSection) comboSection.style.display = 'none';
      if (comboDisplayEl) comboDisplayEl.style.display = 'none';
    }
  } else if (item.effect === 'combo_bar') {
    item.owned = true;
    const comboBarContainer = document.querySelector('.combo-bar-container');
    if (enable !== false) {
      if (comboBarContainer) comboBarContainer.style.display = '';
    } else {
      if (comboBarContainer) comboBarContainer.style.display = 'none';
    }
  } else if (item.effect === 'prof_hat') {
    item.owned = true;
    toggleProfessorAccessory('prof_hat', '🎓', 'professor-hat', enable);
  } else if (item.effect === 'prof_flower') {
    item.owned = true;
    toggleProfessorAccessory('prof_flower', '💐', 'professor-flower', enable);
  } else if (item.effect === 'prof_crown') {
    item.owned = true;
    toggleProfessorAccessory('prof_crown', '👑', 'professor-crown', enable);
  } else if (item.effect === 'prof_heart') {
    item.owned = true;
    toggleProfessorAccessory('prof_heart', '💖', 'professor-heart', enable);
  } else if (item.effect === 'prof_sparkle') {
    item.owned = true;
    const professor = document.getElementById('professor');
    if (!professor) return;
    const existing = professor.querySelectorAll('[data-accessory="prof_sparkle"]');
    if (enable !== false) {
      if (existing.length === 0) {
        const positions = [{top:'-10px',left:'10%'}, {top:'5px',left:'80%'}, {top:'-15px',left:'55%'}];
        positions.forEach((pos, i) => {
          const el = document.createElement('span');
          el.className = 'professor-accessory professor-sparkle';
          el.setAttribute('data-accessory', 'prof_sparkle');
          el.textContent = '✨';
          el.style.top = pos.top;
          el.style.left = pos.left;
          el.style.animationDelay = (i * 0.5) + 's';
          professor.appendChild(el);
        });
      }
    } else {
      existing.forEach(el => el.remove());
    }
  }
}

function toggleProfessorAccessory(effectId, emoji, cssClass, enable) {
  const professor = document.getElementById('professor');
  if (!professor) return;
  const existing = professor.querySelector('[data-accessory="' + effectId + '"]');
  if (enable !== false) {
    if (!existing) {
      const el = document.createElement('span');
      el.className = 'professor-accessory ' + cssClass;
      el.setAttribute('data-accessory', effectId);
      el.textContent = emoji;
      professor.appendChild(el);
    }
  } else {
    if (existing) existing.remove();
  }
}

function toggleEffect(id) {
  const item = shopItems.find(i => i.id === id);
  if (!item || !item.togglable || !item.owned) return;
  item.active = !item.active;
  applyItemEffect(item, item.active);
  saveShopData();
  renderShop();
}

function applyLoadedEffects() {
  for (const item of shopItems) {
    if (!item.owned) continue;
    if (item.togglable) {
      applyItemEffect(item, item.active);
    } else if (item.effect === 'speed') {
      if (typeof gpuPlayer !== 'undefined') {
        gpuPlayer.speed = 2.8;
        gpuPlayer.dashSpeed = 5.2;
      }
    } else if (item.effect === 'dash') {
      if (typeof dashUnlocked !== 'undefined') dashUnlocked = true;
    } else if (item.effect === 'stun_weapon') {
      if (typeof weaponUnlocked !== 'undefined') weaponUnlocked = true;
    } else if (item.effect === 'auto1' && typeof autoInterval !== 'undefined') {
      autoInterval = 2000;
    } else if (item.effect === 'auto2' && typeof autoInterval !== 'undefined') {
      autoInterval = 1000;
    } else if (item.effect === 'autoflush' && typeof autoFlushOwned !== 'undefined') {
      autoFlushOwned = true;
      const autoFlushBtn = document.getElementById('autoFlushBtn');
      autoFlushBtn.classList.add('unlocked');
      autoFlushBtn.textContent = '🚿 자동 내리기';
      autoFlushBtn.title = '';
    } else if (item.effect === 'combo_display') {
      applyItemEffect(item);
    } else if (item.effect === 'combo_bar') {
      applyItemEffect(item);
    }
  }
}

loadSaveData();

if (endingTriggered) enterPostEnding();

document.getElementById('shopBtn').addEventListener('click', () => {
  renderShop();
  document.getElementById('shopModal').classList.add('show');
});
document.getElementById('shopClose').addEventListener('click', () => {
  document.getElementById('shopModal').classList.remove('show');
});
document.getElementById('shopModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('shopModal')) {
    document.getElementById('shopModal').classList.remove('show');
  }
});

function resetAllGame() {
  dlpcTokens = 0;
  dlpcAmount.textContent = 0;
  const gpuDlpcEl = document.getElementById('gpuDlpc');
  if (gpuDlpcEl) gpuDlpcEl.textContent = 0;
  for (const item of shopItems) {
    item.owned = false;
    if (item.togglable) item.active = false;
    if (item.currentLevel !== undefined) item.currentLevel = 0;
  }
  localStorage.removeItem('dlpcTokens');
  localStorage.removeItem('shopOwned');
  localStorage.removeItem('shopActive');
  localStorage.removeItem('shopLevels');
  localStorage.removeItem('endingTriggered');
  localStorage.removeItem('flushCount');
  localStorage.removeItem('bestFlush');
  localStorage.removeItem('bestCombo');
  localStorage.removeItem('gpuScoreVal');
  endingTriggered = false;
  const toilet = document.getElementById('toilet');
  const hint = document.querySelector('.tap-hint');
  const gradSchool = document.getElementById('gradSchool');
  if (toilet) toilet.style.display = '';
  if (hint) hint.style.display = '';
  if (gradSchool) { gradSchool.style.display = 'none'; gradSchool.classList.remove('ending-burst'); }
  if (typeof resetToiletGame === 'function') resetToiletGame();
  if (typeof resetGpuGame === 'function') resetGpuGame();
  applyLoadedEffects();
  renderShop();
}

document.getElementById('resetGameBtn').addEventListener('click', () => {
  document.getElementById('resetConfirmModal').classList.add('show');
});
document.getElementById('resetConfirmYes').addEventListener('click', () => {
  resetAllGame();
  document.getElementById('resetConfirmModal').classList.remove('show');
});
document.getElementById('resetConfirmNo').addEventListener('click', () => {
  document.getElementById('resetConfirmModal').classList.remove('show');
});
document.getElementById('resetConfirmModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('resetConfirmModal')) {
    document.getElementById('resetConfirmModal').classList.remove('show');
  }
});

document.getElementById('endingContinueBtn').addEventListener('click', () => {
  document.getElementById('endingModal').classList.remove('show');
  enterPostEnding();
});
document.getElementById('endingModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('endingModal')) {
    document.getElementById('endingModal').classList.remove('show');
    enterPostEnding();
  }
});

document.getElementById('gradSchool').addEventListener('click', showEnding);