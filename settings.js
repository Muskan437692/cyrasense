/* ============================
   CYRASENSE — Settings Page
   ============================ */

function renderSettings() {
  const user = AppState.currentUser || {};

  const nameEl = document.getElementById('settings-name');
  const ageEl = document.getElementById('settings-dob'); // Reusing DOB el for Age label
  const heightEl = document.getElementById('settings-height');
  const weightEl = document.getElementById('settings-weight');
  const coinsEl = document.getElementById('settings-coins');
  const joinEl = document.getElementById('settings-joined');
  const labelAge = document.querySelector('.settings-info-label'); // First label

  if (nameEl) nameEl.textContent = user.username || '—';
  if (ageEl) ageEl.textContent = user.age ? `${user.age} years` : '—';
  
  // Update label if it's DOB
  const ageCard = document.querySelector('.settings-info-card');
  if (ageCard) {
    const label = ageCard.querySelector('.settings-info-label');
    if (label) label.textContent = 'Age';
  }

  if (heightEl) heightEl.textContent = user.height ? `${user.height} cm` : '—';
  if (weightEl) weightEl.textContent = user.weight ? `${user.weight} kg` : '—';
  if (coinsEl) coinsEl.textContent = `🪙 ${AppState.coins}`;
  if (joinEl) joinEl.textContent = `April 2026`; // demo

  // BMI calculation
  const bmiEl = document.getElementById('settings-bmi');
  if (bmiEl && user.height && user.weight) {
    const h = parseFloat(user.height) / 100;
    const bmi = (parseFloat(user.weight) / (h * h)).toFixed(1);
    let cat = bmi < 18.5 ? 'Underweight' : bmi < 24.9 ? 'Normal ✅' : bmi < 29.9 ? 'Overweight' : 'Obese';
    bmiEl.textContent = `${bmi} (${cat})`;
  } else if (bmiEl) {
    bmiEl.textContent = '—';
  }

  updateCoinDisplays();
}

function editProfile() {
  const user = AppState.currentUser || {};
  
  const newName = prompt('Enter new username:', user.username || '');
  const newAge = prompt('Enter Age:', user.age || '');
  const newHeight = prompt('Enter Height (cm):', user.height || '');
  const newWeight = prompt('Enter Weight (kg):', user.weight || '');

  if (newName !== null && newAge !== null && newHeight !== null && newWeight !== null) {
    AppState.currentUser = {
      ...user,
      username: newName.trim() || user.username,
      age: newAge.trim() || user.age,
      height: newHeight.trim() || user.height,
      weight: newWeight.trim() || user.weight
    };
    
    localStorage.setItem('cyrasense_user', JSON.stringify(AppState.currentUser));
    saveState();
    renderSettings();
    initDashboard();
    showToast('Profile updated! ✨');
  }
}
