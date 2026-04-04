/* ============================
   CYRASENSE — Authentication
   ============================ */

function switchAuthTab(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signup-form').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
}

function handleLogin(e) {
  e.preventDefault();
  const user = {
    username: document.getElementById('login-username').value.trim(),
    age: document.getElementById('login-age').value,
    height: document.getElementById('login-height').value,
    weight: document.getElementById('login-weight').value
  };

  if (!user.username || !user.age) return;

  // For demo, we'll just use the entered data
  AppState.currentUser = user;
  localStorage.setItem('cyrasense_user', JSON.stringify(user));
  saveState();
  enterApp();
}

function handleSignup(e) {
  // Signup is now merged into Login for this demo
  handleLogin(e);
}

function enterApp() {
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  seedDemoLogs();
  initDashboard();
  updateCoinDisplays();
  navigateTo('dashboard');
}

function handleLogout() {
  if (!confirm('Are you sure you want to sign out?')) return;
  AppState.currentUser = null;
  saveState();
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('auth-page').classList.remove('hidden');
  switchAuthTab('login');
}
