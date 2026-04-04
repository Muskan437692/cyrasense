/* ============================
   CYRASENSE — Main App Controller
   (Updated with Settings)
   ============================ */

window.addEventListener('load', () => {
  loadState();

  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    splash.classList.add('fade-out');

    setTimeout(() => {
      splash.style.display = 'none';
      const savedUser = localStorage.getItem('cyrasense_user');
      if (savedUser && AppState.currentUser) {
        AppState.currentUser = JSON.parse(savedUser);
        seedDemoLogs();
        initDashboard();
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        updateCoinDisplays();
        navigateTo('dashboard');
      } else {
        document.getElementById('auth-page').classList.remove('hidden');
      }
    }, 800);
  }, 3000);
});

function navigateTo(page) {
  document.querySelectorAll('.app-page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const targetPage = document.getElementById(`${page}-page`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
    targetPage.style.animation = 'none';
    targetPage.offsetHeight;
    targetPage.style.animation = '';
  }

  // Nav item mapping
  const navMap = { dashboard: 'home', calendar: 'calendar', chatbot: 'chatbot', games: 'games', yoga: 'yoga', store: 'store', settings: 'settings' };
  const navKey = navMap[page] || page;
  const navItem = document.getElementById(`nav-${navKey}`);
  if (navItem) navItem.classList.add('active');

  AppState.currentPage = page;

  switch (page) {
    case 'dashboard':
      initDashboard();
      break;
    case 'calendar':
      renderCalendar();
      renderCycleGraph();
      break;
    case 'chatbot':
      setTimeout(() => {
        const msgs = document.getElementById('chat-messages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }, 100);
      break;
    case 'games':
      document.getElementById('memory-game').classList.add('hidden');
      document.getElementById('bubble-game').classList.add('hidden');
      document.getElementById('games-menu').classList.remove('hidden');
      updateCoinDisplays();
      break;
    case 'yoga':
      renderYogaPage();
      break;
    case 'store':
      renderStore();
      updateCoinDisplays();
      break;
    case 'settings':
      renderSettings();
      break;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('keydown', (e) => {
  if (AppState.currentPage === 'games' && e.code === 'Space') e.preventDefault();
});

console.log('%cCyraSense 🌸', 'font-size:20px;color:#c084fc;font-weight:bold');
console.log('%cAI Menstrual Health & Wellness Platform', 'color:#f472b6');
console.log('%c🔒 Your data is secure and stored locally only.', 'color:#4ade80');
