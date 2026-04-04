/* ============================
   CYRASENSE — Shared Data Store
   ============================ */

const AppState = {
  currentUser: null,
  currentPage: 'dashboard',
  coins: 0,
  calendarData: {},
  logs: [],
  periodHistory: [], // history of period start dates
  selectedMood: '😊',
  selectedSymptoms: new Set(),
  selectedCalendarDate: null,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth()
};

// Persist & load from localStorage
function saveState() {
  localStorage.setItem('cyrasense_state', JSON.stringify({
    currentUser: AppState.currentUser,
    coins: AppState.coins,
    calendarData: AppState.calendarData,
    logs: AppState.logs,
    periodHistory: AppState.periodHistory
  }));
}

function loadState() {
  try {
    const raw = localStorage.getItem('cyrasense_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      AppState.currentUser = parsed.currentUser || null;
      AppState.coins = parsed.coins || 0;
      AppState.calendarData = parsed.calendarData || {};
      AppState.logs = parsed.logs || [];
      AppState.periodHistory = parsed.periodHistory || [];
    }
  } catch (e) { console.warn('State load error', e); }
}

function addCoins(amount) {
  AppState.coins += amount;
  saveState();
  updateCoinDisplays();
  showToast(`+${amount} 🪙 coins earned!`);
}

function updateCoinDisplays() {
  const val = AppState.coins;
  ['coin-count', 'games-coin-count', 'store-coin-count'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Seed demo logs for graphs
function seedDemoLogs() {
  if (AppState.logs.length > 0) return;
  const moods = ['😊','😊','😐','😢','😊','😤','🥱'];
  const pains = [2, 4, 7, 5, 3, 6, 2];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    AppState.logs.push({
      date: d.toDateString(),
      pain: pains[6 - i],
      mood: moods[6 - i]
    });
  }
  saveState();
}

loadState();
