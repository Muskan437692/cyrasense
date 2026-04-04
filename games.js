/* ============================
   CYRASENSE — New Wellness Games
   ============================ */

/* ======= HORMONE BALANCE GAME ======= */
let hormoneState = {
  score: 0,
  lives: 3,
  coins: 0,
  running: false,
  items: [],
  spawnInterval: null,
  gameLoop: null,
  playerX: 50 // percentage
};

const HEALTHY_ITEMS = [
  { emoji: '🥗', points: 10, type: 'good' },
  { emoji: '💧', points: 5, type: 'good' },
  { emoji: '🧘', points: 15, type: 'good' },
  { emoji: '🫐', points: 10, type: 'good' },
  { emoji: '😴', points: 10, type: 'good' }
];

const TOXIN_ITEMS = [
  { emoji: '🚬', points: -1, type: 'bad' },
  { emoji: '🍔', points: -1, type: 'bad' },
  { emoji: '🧂', points: -1, type: 'bad' },
  { emoji: '☕', points: -1, type: 'bad' } // Excess caffeine
];

function startHormoneGame() {
  document.getElementById('games-menu').classList.add('hidden');
  document.getElementById('hormone-game').classList.remove('hidden');
  document.getElementById('hormone-over').classList.add('hidden');
  restartHormoneGame();
}

function restartHormoneGame() {
  hormoneState = {
    score: 0,
    lives: 3,
    coins: 0,
    running: true,
    items: [],
    playerX: 50
  };
  document.getElementById('hormone-score').textContent = '0';
  document.getElementById('hormone-lives').textContent = '3';
  document.getElementById('hormone-coins').textContent = '0';
  document.getElementById('hormone-over').classList.add('hidden');
  
  const arena = document.getElementById('hormone-arena');
  const existingItems = arena.querySelectorAll('.falling-item');
  existingItems.forEach(i => i.remove());

  // Controls
  arena.onmousemove = (e) => {
    if (!hormoneState.running) return;
    const rect = arena.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    x = Math.max(5, Math.min(95, x));
    hormoneState.playerX = x;
    document.getElementById('hormone-player').style.left = x + '%';
  };

  arena.ontouchmove = (e) => {
    if (!hormoneState.running) return;
    const rect = arena.getBoundingClientRect();
    const touch = e.touches[0];
    let x = ((touch.clientX - rect.left) / rect.width) * 100;
    x = Math.max(5, Math.min(95, x));
    hormoneState.playerX = x;
    document.getElementById('hormone-player').style.left = x + '%';
    e.preventDefault();
  };

  clearInterval(hormoneState.spawnInterval);
  clearInterval(hormoneState.gameLoop);

  hormoneState.spawnInterval = setInterval(spawnHormoneItem, 1000);
  hormoneState.gameLoop = setInterval(updateHormoneGame, 50);
}

function spawnHormoneItem() {
  if (!hormoneState.running) return;
  const isHealthy = Math.random() > 0.3;
  const pool = isHealthy ? HEALTHY_ITEMS : TOXIN_ITEMS;
  const itemData = pool[Math.floor(Math.random() * pool.length)];

  const arena = document.getElementById('hormone-arena');
  const itemEl = document.createElement('div');
  itemEl.className = 'falling-item';
  itemEl.textContent = itemData.emoji;
  itemEl.style.position = 'absolute';
  itemEl.style.top = '-40px';
  const startX = Math.random() * 90 + 5;
  itemEl.style.left = startX + '%';
  itemEl.style.fontSize = '2rem';
  itemEl.dataset.type = itemData.type;
  itemEl.dataset.points = itemData.points;
  
  arena.appendChild(itemEl);
  hormoneState.items.push({
    el: itemEl,
    y: -40,
    x: startX,
    type: itemData.type,
    points: itemData.points
  });
}

function updateHormoneGame() {
  if (!hormoneState.running) return;
  const arenaHeight = 400;
  
  for (let i = hormoneState.items.length - 1; i >= 0; i--) {
    const item = hormoneState.items[i];
    item.y += 4; // speed
    item.el.style.top = item.y + 'px';

    // Collision check
    if (item.y > 340 && item.y < 380) {
      const dist = Math.abs(item.x - hormoneState.playerX);
      if (dist < 8) {
        // Hit!
        if (item.type === 'good') {
          hormoneState.score += item.points;
          createGameBurst(item.x, item.y, '✨');
        } else {
          hormoneState.lives--;
          createGameBurst(item.x, item.y, '💥');
          document.getElementById('hormone-lives').textContent = hormoneState.lives;
          if (hormoneState.lives <= 0) endHormoneGame();
        }
        item.el.remove();
        hormoneState.items.splice(i, 1);
        document.getElementById('hormone-score').textContent = hormoneState.score;
        hormoneState.coins = Math.floor(hormoneState.score / 10);
        document.getElementById('hormone-coins').textContent = hormoneState.coins;
        continue;
      }
    }

    // Missed
    if (item.y > arenaHeight) {
      item.el.remove();
      hormoneState.items.splice(i, 1);
    }
  }
}

function endHormoneGame() {
  hormoneState.running = false;
  clearInterval(hormoneState.spawnInterval);
  clearInterval(hormoneState.gameLoop);
  
  document.getElementById('hormone-final-score').textContent = hormoneState.score;
  const earned = Math.min(50, hormoneState.coins);
  document.getElementById('hormone-coins-earned').textContent = earned;
  document.getElementById('hormone-over').classList.remove('hidden');
  addCoins(earned);
}

/* ======= CYCLE CARE CHALLENGE ======= */
const CYCLE_CHALLENGES = [
  {
    phase: 'Menstrual 🩸',
    question: 'You feel low energy and have cramps. What should you do?',
    options: [
      { text: 'Intense HIIT Workout', correct: false },
      { text: 'Gentle Yoga & Warm Compress', correct: true },
      { text: 'Skip Water All Day', correct: false }
    ]
  },
  {
    phase: 'Follicular 🌱',
    question: 'Estrogen is rising and you feel creative. Best habit?',
    options: [
      { text: 'Try a new complex project', correct: true },
      { text: 'Social isolation', correct: false },
      { text: 'Heavy sedative rest', correct: false }
    ]
  },
  {
    phase: 'Ovulation 🌟',
    question: 'You are at your peak energy and confidence. Go for:',
    options: [
      { text: 'Public speaking or Karaoke', correct: true },
      { text: 'Staying in bed all day', correct: false },
      { text: 'Fried & oily food binge', correct: false }
    ]
  },
  {
    phase: 'Luteal 🌙',
    question: 'Progesterone is high, you feel like nesting. Best snack?',
    options: [
      { text: 'Sugary soda', correct: false },
      { text: 'Dark chocolate & Magnesium seeds', correct: true },
      { text: 'Extremely spicy wings', correct: false }
    ]
  },
  {
    phase: 'Global Wellness 🌸',
    question: 'What helps most in maintaining a healthy cycle?',
    options: [
      { text: 'Consistent Sleep & Hydration', correct: true },
      { text: 'Living on energy drinks', correct: false },
      { text: 'Ignoring all symptoms', correct: false }
    ]
  }
];

let cycleCareState = {
  currentIdx: 0,
  score: 0,
  coins: 0
};

function startCycleCareGame() {
  document.getElementById('games-menu').classList.add('hidden');
  document.getElementById('cycle-care-game').classList.remove('hidden');
  document.getElementById('cycle-care-over').classList.add('hidden');
  restartCycleCareGame();
}

function restartCycleCareGame() {
  cycleCareState = { currentIdx: 0, score: 0, coins: 0 };
  updateCycleCareUI();
}

function updateCycleCareUI() {
  if (cycleCareState.currentIdx >= CYCLE_CHALLENGES.length) {
    endCycleCareGame();
    return;
  }
  const challenge = CYCLE_CHALLENGES[cycleCareState.currentIdx];
  document.getElementById('cycle-phase-display').textContent = `Phase: ${challenge.phase}`;
  document.getElementById('cycle-question').textContent = challenge.question;
  document.getElementById('cycle-care-score').textContent = `${cycleCareState.score}/5`;

  const optionsContainer = document.getElementById('cycle-options');
  optionsContainer.innerHTML = '';
  challenge.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn-secondary';
    btn.style.width = '100%';
    btn.style.marginBottom = '8px';
    btn.textContent = opt.text;
    btn.onclick = () => handleCycleOption(opt.correct, btn);
    optionsContainer.appendChild(btn);
  });
}

function handleCycleOption(isCorrect, btn) {
  const btns = document.querySelectorAll('#cycle-options button');
  btns.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.style.background = '#22c55e';
    cycleCareState.score++;
  } else {
    btn.style.background = '#ef4444';
  }

  setTimeout(() => {
    cycleCareState.currentIdx++;
    updateCycleCareUI();
  }, 1000);
}

function endCycleCareGame() {
  const earned = cycleCareState.score * 8;
  document.getElementById('cycle-care-final-score').textContent = `${cycleCareState.score}/5`;
  document.getElementById('cycle-care-coins-earned').textContent = earned;
  document.getElementById('cycle-care-over').classList.remove('hidden');
  addCoins(earned);
}

function exitGame(game) {
  clearInterval(hormoneState.spawnInterval);
  clearInterval(hormoneState.gameLoop);
  hormoneState.running = false;
  
  document.getElementById('hormone-game').classList.add('hidden');
  document.getElementById('cycle-care-game').classList.add('hidden');
  document.getElementById('games-menu').classList.remove('hidden');
}

function createGameBurst(x, y, emoji) {
  const arena = document.getElementById('hormone-arena');
  const burst = document.createElement('div');
  burst.textContent = emoji;
  burst.style.position = 'absolute';
  burst.style.left = x + '%';
  burst.style.top = y + 'px';
  burst.style.fontSize = '1.5rem';
  burst.style.transition = 'all 0.5s ease-out';
  arena.appendChild(burst);
  
  setTimeout(() => {
    burst.style.top = (y - 50) + 'px';
    burst.style.opacity = '0';
    setTimeout(() => burst.remove(), 500);
  }, 10);
}

/* ======= MEMORY MATCH GAME ======= */
const MEMORY_EMOJIS = ['🌸','🌙','💊','🌿','🧘','💧','🫐','🍫'];
let memoryState = {
  cards: [], flipped: [], matched: new Set(), score: 0, coins: 0, timer: 60, timerInterval: null, locked: false, running: false
};

function startMemoryGame() {
  document.getElementById('games-menu').classList.add('hidden');
  document.getElementById('memory-game').classList.remove('hidden');
  document.getElementById('memory-over').classList.add('hidden');
  initMemoryGame();
}

function initMemoryGame() {
  memoryState.score = 0;
  memoryState.timer = 60;
  memoryState.flipped = [];
  memoryState.matched = new Set();
  memoryState.locked = false;
  memoryState.running = true;

  document.getElementById('memory-score').textContent = '0';
  document.getElementById('memory-timer').textContent = '60';

  const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  memoryState.cards = deck;
  renderMemoryGrid();

  clearInterval(memoryState.timerInterval);
  memoryState.timerInterval = setInterval(() => {
    memoryState.timer--;
    const timerVal = document.getElementById('memory-timer');
    if (timerVal) timerVal.textContent = memoryState.timer;
    if (memoryState.timer <= 0) endMemoryGame(false);
  }, 1000);
}

function renderMemoryGrid() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  grid.innerHTML = '';
  memoryState.cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = `<div class="memory-card-inner"><div class="memory-card-front">🌺</div><div class="memory-card-back">${emoji}</div></div>`;
    card.onclick = () => flipMemoryCard(index);
    grid.appendChild(card);
  });
}

function flipMemoryCard(idx) {
  if (!memoryState.running || memoryState.locked || memoryState.matched.has(idx) || memoryState.flipped.includes(idx)) return;
  
  const cards = document.querySelectorAll('.memory-card');
  cards[idx].classList.add('flipped');
  memoryState.flipped.push(idx);

  if (memoryState.flipped.length === 2) {
    memoryState.locked = true;
    const [a, b] = memoryState.flipped;
    if (memoryState.cards[a] === memoryState.cards[b]) {
      memoryState.matched.add(a);
      memoryState.matched.add(b);
      memoryState.score++;
      document.getElementById('memory-score').textContent = memoryState.score;
      
      memoryState.flipped = [];
      memoryState.locked = false;
      if (memoryState.matched.size === 16) endMemoryGame(true);
    } else {
      setTimeout(() => {
        cards[a].classList.remove('flipped');
        cards[b].classList.remove('flipped');
        memoryState.flipped = [];
        memoryState.locked = false;
      }, 1000);
    }
  }
}

function endMemoryGame(won) {
  clearInterval(memoryState.timerInterval);
  memoryState.running = false;
  const earned = won ? 40 : memoryState.score * 4;
  document.getElementById('memory-final-score').textContent = memoryState.score;
  document.getElementById('memory-coins-earned').textContent = earned;
  document.getElementById('memory-won-msg').textContent = won ? '🎉 Perfect Match! +40 coins!' : '⏰ Time\'s Up!';
  document.getElementById('memory-over').classList.remove('hidden');
  addCoins(earned);
}

function restartMemoryGame() {
  document.getElementById('memory-over').classList.add('hidden');
  initMemoryGame();
}

function exitGame(game) {
  clearInterval(hormoneState.spawnInterval);
  clearInterval(hormoneState.gameLoop);
  clearInterval(memoryState.timerInterval);
  
  hormoneState.running = false;
  memoryState.running = false;
  
  document.getElementById('hormone-game').classList.add('hidden');
  document.getElementById('cycle-care-game').classList.add('hidden');
  document.getElementById('memory-game').classList.add('hidden');
  document.getElementById('games-menu').classList.remove('hidden');
}
