const canvas = document.getElementById('gpuCanvas');
const ctx = canvas.getContext('2d');
const gpuStartBtn = document.getElementById('gpuStartBtn');
const gpuLevelEl = document.getElementById('gpuLevel');
const gpuLivesEl = document.getElementById('gpuLives');
const gpuScoreEl = document.getElementById('gpuScore');

const TILE = 40;
const COLS = canvas.width / TILE;
const ROWS = canvas.height / TILE;

const gpuPlayer = { x: 1, y: 1, speed: 1.8, dashSpeed: 3.8, gpuCount: 0, targetName: '소융대' };
let dashUnlocked = false;
let weaponUnlocked = false;
let weaponCooldown = 0;
const WEAPON_COOLDOWN_MAX = 120;
const WEAPON_RANGE = TILE * 1.5;
const WEAPON_STUN_DURATION = 150;
let gpuLives = 3, gpuLevelNum = 1, gpuScoreVal = 0, gpuRunning = false;
let guards = [], gpuItems = [], professorTarget = null, walls = new Set();
let keysDown = {};
let gpuAnimId = null;
let caughtCooldown = 0;
let winCooldown = 0;

const gpuLevels = [
  { guards: 3, guardSpeed: 0.5, layout: 'simple' },
  { guards: 4, guardSpeed: 0.65, layout: 'medium' },
  { guards: 5, guardSpeed: 0.8, layout: 'hard' },
  { guards: 6, guardSpeed: 0.95, layout: 'harder' },
  { guards: 8, guardSpeed: 1.1, layout: 'insane' },
];

function buildWalls(layout) {
  walls.clear();
  for (let x = 0; x < COLS; x++) { walls.add(x + ',' + 0); walls.add(x + ',' + (ROWS-1)); }
  for (let y = 0; y < ROWS; y++) { walls.add(0 + ',' + y); walls.add((COLS-1) + ',' + y); }
  const addBlock = (cx, cy, w, h) => {
    for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < h; dy++) {
      walls.add((cx+dx) + ',' + (cy+dy));
    }
  };
  if (layout === 'simple') {
    addBlock(5, 3, 3, 1); addBlock(12, 3, 2, 1);
    addBlock(8, 6, 1, 4); addBlock(14, 5, 1, 4);
    addBlock(4, 8, 4, 1); addBlock(13, 8, 3, 1);
  } else if (layout === 'medium') {
    addBlock(5, 2, 2, 2); addBlock(12, 2, 2, 2);
    addBlock(8, 4, 1, 3); addBlock(14, 4, 1, 3);
    addBlock(3, 7, 3, 1); addBlock(13, 7, 3, 1);
    addBlock(8, 8, 1, 3); addBlock(18, 6, 1, 3);
    addBlock(5, 9, 2, 1); addBlock(15, 9, 2, 1);
  } else if (layout === 'hard') {
    addBlock(4, 2, 3, 1); addBlock(12, 2, 2, 1);
    addBlock(7, 3, 1, 2); addBlock(15, 3, 1, 2);
    addBlock(3, 5, 2, 1); addBlock(10, 5, 3, 1);
    addBlock(17, 5, 1, 3); addBlock(5, 7, 1, 2);
    addBlock(13, 7, 1, 2); addBlock(8, 8, 2, 1);
    addBlock(16, 9, 2, 1); addBlock(3, 9, 3, 1);
  } else {
    addBlock(4, 2, 2, 2); addBlock(10, 2, 2, 2);
    addBlock(17, 2, 1, 2); addBlock(7, 4, 1, 3);
    addBlock(14, 4, 1, 3); addBlock(3, 6, 2, 1);
    addBlock(10, 6, 2, 1); addBlock(17, 6, 1, 3);
    addBlock(5, 8, 1, 2); addBlock(8, 9, 2, 1);
    addBlock(13, 8, 2, 1); addBlock(16, 9, 1, 2);
    addBlock(3, 10, 2, 1); addBlock(6, 10, 1, 1);
  }
}

function placeGPU() {
  gpuItems = [];
  const count = typeof getGpuSpawnCount === 'function' ? getGpuSpawnCount() : 1;
  for (let i = 0; i < count; i++) {
    let x, y, attempts = 0;
    do {
      x = Math.floor(COLS * 0.3 + Math.random() * (COLS * 0.6));
      y = Math.floor(ROWS * 0.2 + Math.random() * (ROWS * 0.5));
      attempts++;
    } while (walls.has(x+','+y) && attempts < 100);
    if (attempts < 100) gpuItems.push({ x, y });
  }
}

function placeProfessor() {
  let x, y, attempts = 0;
  do {
    x = Math.floor(COLS * 0.5 + Math.random() * (COLS * 0.35));
    y = Math.floor(ROWS * 0.6 + Math.random() * (ROWS * 0.3));
    attempts++;
  } while ((walls.has(x+','+y) || gpuItems.some(g => g.x === x && g.y === y)) && attempts < 100);
  professorTarget = { x, y };
}

function createGuards(count, speed) {
  guards = [];
  for (let i = 0; i < count; i++) {
    let gx, gy;
    do {
      gx = 2 + Math.floor(Math.random() * (COLS - 4));
      gy = 2 + Math.floor(Math.random() * (ROWS - 4));
    } while (walls.has(gx+','+gy) || (gx === 2 && gy === 2));
    let dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
    let d = dirs[Math.floor(Math.random() * dirs.length)];
    guards.push({ x: gx * TILE + TILE/2, y: gy * TILE + TILE/2, dx: d.dx, dy: d.dy, speed, changeTimer: Math.random() * 120, stunned: 0 });
  }
}

function initGpuLevel() {
  const lv = gpuLevels[Math.min(gpuLevelNum - 1, gpuLevels.length - 1)];
  buildWalls(lv.layout);
  gpuPlayer.x = 2 * TILE + TILE / 2;
  gpuPlayer.y = 2 * TILE + TILE / 2;
  gpuPlayer.gpuCount = 0;
  placeGPU();
  placeProfessor();
  createGuards(lv.guards, lv.guardSpeed);
  caughtCooldown = 0;
  winCooldown = 0;
  weaponCooldown = 0;
}

function canMove(px, py) {
  const r = 12;
  const checks = [
    {x: px - r, y: py - r}, {x: px + r, y: py - r},
    {x: px - r, y: py + r}, {x: px + r, y: py + r}
  ];
  for (const c of checks) {
    const tx = Math.floor(c.x / TILE);
    const ty = Math.floor(c.y / TILE);
    if (walls.has(tx + ',' + ty)) return false;
  }
  return true;
}

function gx_playerCenter() { return gpuPlayer.x; }
function gy_playerCenter() { return gpuPlayer.y; }

function drawGpuGame() {
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1a1a3e';
  ctx.font = '10px monospace';
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (!walls.has(x+','+y)) {
        ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = '#1e1e42';
          ctx.fillRect(x * TILE + 1, y * TILE + 1, TILE - 2, TILE - 2);
          ctx.fillStyle = '#1a1a3e';
        }
      }
    }
  }

  ctx.font = '8px monospace';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText('🏛️ 미래관', COLS * TILE / 2, ROWS * TILE - 5);

  ctx.fillStyle = '#445';
  for (const key of walls) {
    const [wx, wy] = key.split(',');
    ctx.fillRect(wx * TILE, wy * TILE, TILE, TILE);
    ctx.fillStyle = '#556';
    ctx.fillRect(wx * TILE + 2, wy * TILE + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = '#445';
  }

  if (gpuItems.length > 0) {
    ctx.font = (TILE - 8) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const gi of gpuItems) {
      ctx.fillText('🐢', gi.x * TILE + TILE/2, gi.y * TILE + TILE/2);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.fillText('GPU', gi.x * TILE + TILE/2, gi.y * TILE + TILE/2 + 16);
      ctx.font = (TILE - 8) + 'px serif';
    }
  }

  if (professorTarget) {
    ctx.font = (TILE - 8) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏠', professorTarget.x * TILE + TILE/2, professorTarget.y * TILE + TILE/2);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#2ecc71';
    ctx.fillText(gpuPlayer.targetName + ' 교수님 집', professorTarget.x * TILE + TILE/2, professorTarget.y * TILE + TILE/2 + 16);
  }

  ctx.font = (TILE - 10) + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const g of guards) {
    const dist = Math.hypot(gx_playerCenter() - g.x, gy_playerCenter() - g.y);
    const alertDist = TILE * 3.5;
    if (dist < alertDist && g.stunned <= 0) {
      ctx.beginPath();
      ctx.arc(g.x, g.y, TILE * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = dist < TILE * 2 ? 'rgba(255,0,0,0.1)' : 'rgba(255,165,0,0.07)';
      ctx.fill();
    }
    if (g.stunned > 0) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(g.x, g.y, TILE * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,150,255,0.4)';
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillText('🔵', g.x, g.y);
      ctx.font = '8px sans-serif';
      ctx.fillStyle = '#5dade2';
      ctx.fillText('기절', g.x, g.y + 16);
      ctx.font = (TILE - 10) + 'px serif';
    } else {
      ctx.fillText('🔴', g.x, g.y);
      ctx.font = '8px sans-serif';
      ctx.fillStyle = '#ff6b6b';
      ctx.fillText('경비', g.x, g.y + 16);
      ctx.font = (TILE - 10) + 'px serif';
    }
  }

  const px = gpuPlayer.x, py = gpuPlayer.y;
  ctx.font = (TILE - 10) + 'px serif';
  if (gpuPlayer.gpuCount > 0) {
    ctx.fillText('🎒', px, py);
    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('GPU x' + gpuPlayer.gpuCount, px, py + 16);
  } else {
    ctx.fillText('🧑‍💻', px, py);
  }
  if (weaponUnlocked) {
    const wCd = weaponCooldown / WEAPON_COOLDOWN_MAX;
    ctx.beginPath();
    ctx.arc(px, py + 22, 8, -Math.PI / 2, -Math.PI / 2 + (1 - wCd) * Math.PI * 2);
    ctx.strokeStyle = wCd <= 0 ? '#2ecc71' : '#555';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  if (weaponCooldown > 0 && weaponCooldown > WEAPON_COOLDOWN_MAX - 8) {
    ctx.beginPath();
    ctx.arc(px, py, WEAPON_RANGE, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,150,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  if (caughtCooldown > 0) {
    ctx.fillStyle = 'rgba(255,0,0,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#ff4444';
    ctx.textAlign = 'center';
    ctx.fillText('💸 경비에게 걸렸다!', canvas.width / 2, canvas.height / 2);
    ctx.font = '16px sans-serif';
    ctx.fillText('다시 시도...', canvas.width / 2, canvas.height / 2 + 30);
  }

  if (winCooldown > 0) {
    ctx.fillStyle = 'rgba(0,200,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#2ecc71';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 GPU 배달 성공!', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '16px sans-serif';
    ctx.fillText('레벨 ' + gpuLevelNum + ' 클리어!', canvas.width / 2, canvas.height / 2 + 20);
  }
}

function updateGpuGame() {
  if (caughtCooldown > 0) { caughtCooldown--; if (caughtCooldown === 0) initGpuLevel(); return; }
  if (winCooldown > 0) { winCooldown--; if (winCooldown === 0) { gpuLevelNum++; initGpuLevel(); } return; }

  if (weaponCooldown > 0) weaponCooldown--;

  const spd = (dashUnlocked && keysDown['ShiftLeft'] || dashUnlocked && keysDown['ShiftRight']) ? gpuPlayer.dashSpeed : gpuPlayer.speed;
  let nx = gpuPlayer.x, ny = gpuPlayer.y;
  if (keysDown['ArrowUp'] || keysDown['KeyW']) ny -= spd;
  if (keysDown['ArrowDown'] || keysDown['KeyS']) ny += spd;
  if (keysDown['ArrowLeft'] || keysDown['KeyA']) nx -= spd;
  if (keysDown['ArrowRight'] || keysDown['KeyD']) nx += spd;

  if (canMove(nx, gpuPlayer.y)) gpuPlayer.x = nx;
  if (canMove(gpuPlayer.x, ny)) gpuPlayer.y = ny;

  gpuPlayer.x = Math.max(TILE + 14, Math.min(canvas.width - TILE - 14, gpuPlayer.x));
  gpuPlayer.y = Math.max(TILE + 14, Math.min(canvas.height - TILE - 14, gpuPlayer.y));

  for (let i = gpuItems.length - 1; i >= 0; i--) {
    const gi = gpuItems[i];
    const dx = gpuPlayer.x - (gi.x * TILE + TILE/2);
    const dy = gpuPlayer.y - (gi.y * TILE + TILE/2);
    if (Math.sqrt(dx*dx + dy*dy) < TILE * 0.6) {
      gpuPlayer.gpuCount++;
      gpuItems.splice(i, 1);
    }
  }

  if (gpuPlayer.gpuCount > 0 && professorTarget) {
    const dx = gpuPlayer.x - (professorTarget.x * TILE + TILE/2);
    const dy = gpuPlayer.y - (professorTarget.y * TILE + TILE/2);
    if (Math.sqrt(dx*dx + dy*dy) < TILE * 0.7) {
      const delivered = gpuPlayer.gpuCount;
      gpuPlayer.gpuCount = 0;
      gpuScoreVal += gpuLevelNum * 100;
      gpuScoreEl.textContent = gpuScoreVal;
      let gpuDlpcReward = (5 + gpuLevelNum * 3) * delivered;
      if (shopItems.find(i => i.id === 'dlpc_booster').owned) gpuDlpcReward *= 2;
      addDlpc(gpuDlpcReward, delivered + '개 GPU 레벨' + gpuLevelNum + ' 배달!');
      winCooldown = 90;
      return;
    }
  }

  for (const g of guards) {
    if (g.stunned > 0) { g.stunned--; continue; }
    g.changeTimer--;
    if (g.changeTimer <= 0) {
      const dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
      const angleToPlayer = Math.atan2(gpuPlayer.y - g.y, gpuPlayer.x - g.x);
      const toward = angleToPlayer > -Math.PI/4 && angleToPlayer < Math.PI/4 ? {dx:1,dy:0} :
                     angleToPlayer > Math.PI/4 && angleToPlayer < 3*Math.PI/4 ? {dx:0,dy:1} :
                     angleToPlayer < -Math.PI/4 && angleToPlayer > -3*Math.PI/4 ? {dx:0,dy:-1} :
                     {dx:-1,dy:0};
      if (Math.random() < 0.3 + gpuLevelNum * 0.08) {
        g.dx = toward.dx; g.dy = toward.dy;
      } else {
        const d = dirs[Math.floor(Math.random() * dirs.length)];
        g.dx = d.dx; g.dy = d.dy;
      }
      g.changeTimer = 40 + Math.random() * 80;
    }

    const nx = g.x + g.dx * g.speed;
    const ny = g.y + g.dy * g.speed;
    const tx = Math.floor(nx / TILE);
    const ty = Math.floor(ny / TILE);
    if (walls.has(tx+','+ty) || nx < TILE || nx > canvas.width - TILE || ny < TILE || ny > canvas.height - TILE) {
      g.dx = -g.dx; g.dy = -g.dy;
      g.changeTimer = 20 + Math.random() * 40;
    } else {
      g.x = nx; g.y = ny;
    }

    const pdist = Math.hypot(gpuPlayer.x - g.x, gpuPlayer.y - g.y);
    if (pdist < TILE * 0.7) {
      gpuLives--;
      let h = '';
      for (let i = 0; i < gpuLives; i++) h += '❤️';
      gpuLivesEl.textContent = h || '💀';
      if (gpuLives <= 0) {
        gpuRunning = false;
        gpuStartBtn.textContent = '💀 게임 오버! 다시 시작';
        return;
      }
      caughtCooldown = 60;
      return;
    }
  }
}

function gpuGameLoop() {
  if (!gpuRunning) return;
  updateGpuGame();
  drawGpuGame();
  gpuAnimId = requestAnimationFrame(gpuGameLoop);
}

gpuStartBtn.addEventListener('click', () => {
  if (gpuRunning) {
    gpuRunning = false;
    cancelAnimationFrame(gpuAnimId);
    gpuStartBtn.textContent = '🎮 미래관 침투 시작!';
    return;
  }
  if (gpuLives <= 0) {
    gpuLives = 3;
    gpuLevelNum = 1;
    gpuScoreVal = 0;
    gpuScoreEl.textContent = 0;
    gpuLevelEl.textContent = 1;
    let h = '';
    for (let i = 0; i < gpuLives; i++) h += '❤️';
    gpuLivesEl.textContent = h;
  }
  gpuRunning = true;
  gpuStartBtn.textContent = '⏸ 일시정지';
  initGpuLevel();
  gpuGameLoop();
});

document.addEventListener('keydown', (e) => {
  keysDown[e.code] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code) && gpuRunning) e.preventDefault();
  if ((e.code === 'KeyZ' || e.code === 'KeyE') && gpuRunning && weaponUnlocked && weaponCooldown <= 0) {
    weaponCooldown = WEAPON_COOLDOWN_MAX;
    for (const g of guards) {
      const dist = Math.hypot(gpuPlayer.x - g.x, gpuPlayer.y - g.y);
      if (dist < WEAPON_RANGE) g.stunned = WEAPON_STUN_DURATION;
    }
  }
});
document.addEventListener('keyup', (e) => { keysDown[e.code] = false; });

buildWalls('simple');
initGpuLevel();
drawGpuGame();

if (typeof applyLoadedEffects === 'function') applyLoadedEffects();

function resetGpuGame() {
  gpuLives = 3; gpuLevelNum = 1; gpuScoreVal = 0;
  gpuRunning = false; dashUnlocked = false; weaponUnlocked = false;
  cancelAnimationFrame(gpuAnimId);
  gpuScoreEl.textContent = 0;
  gpuLevelEl.textContent = 1;
  let h = '';
  for (let i = 0; i < gpuLives; i++) h += '❤️';
  gpuLivesEl.textContent = h;
  gpuStartBtn.textContent = '🎮 미래관 침투 시작!';
  gpuPlayer.speed = 1.8; gpuPlayer.dashSpeed = 3.8;
  gpuPlayer.gpuCount = 0;
  initGpuLevel();
  drawGpuGame();
}