/* ============================
   CYRASENSE — Dashboard
   ============================ */

let painChart = null;
let moodChart = null;
let pcosChart = null;
let pmsChart = null;

function initDashboard() {
  const user = AppState.currentUser;
  if (!user) return;

  // Greeting
  const hour = new Date().getHours();
  let greet = hour < 12 ? 'Good morning 🌸' : hour < 17 ? 'Good afternoon ☀️' : 'Good evening 🌙';
  const greetSub = document.querySelector('.greeting-sub');
  if (greetSub) greetSub.textContent = greet;

  const greetMain = document.getElementById('greeting-name');
  if (greetMain) greetMain.textContent = `Hello ${user.username}, welcome to CyraSense`;

  // Cycle info — simulated based on sign-up date
  const cycleDay = ((new Date().getDate() % 28) || 28);
  const daysUntil = 28 - cycleDay;
  const phaseNames = ['Menstrual','Follicular','Ovulation','Luteal'];
  const phaseIdx = cycleDay <= 5 ? 0 : cycleDay <= 13 ? 1 : cycleDay <= 16 ? 2 : 3;
  document.getElementById('cycle-day').textContent = cycleDay;
  document.getElementById('days-until').textContent = daysUntil;
  document.getElementById('current-phase').textContent = phaseNames[phaseIdx];
  document.getElementById('cycle-progress').style.width = `${(cycleDay / 28) * 100}%`;

  // Ovulation Indicator
  const ovulationDay = 14; 
  const ovContent = cycleDay === ovulationDay ? 'Today 🌟' : cycleDay < ovulationDay ? `Day ${ovulationDay}` : `Day ${ovulationDay}`;
  document.getElementById('ovulation-indicator').textContent = ovContent;

  updateRiskAnalysis();
  renderCharts();
  renderRiskCharts();
  updateCoinDisplays();
}

function renderRiskCharts() {
  const pcosCtx = document.getElementById('pcosChart');
  const pmsCtx = document.getElementById('pmsChart');
  const user = AppState.currentUser;
  
  if (pcosCtx) {
    if (pcosChart) pcosChart.destroy();
    const bmi = user ? (user.weight / ((user.height / 100) ** 2)) : 22;
    const cycleLength = 28; // fallback
    
    pcosChart = new Chart(pcosCtx, {
      type: 'radar',
      data: {
        labels: ['Cycle Length', 'BMI', 'Pain', 'Consistency', 'Age Factor'],
        datasets: [{
          label: 'Your Metrics',
          data: [cycleLength > 35 ? 10 : 5, bmi > 25 ? 8 : 4, 6, 8, user?.age > 30 ? 7 : 5],
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168,85,247,0.2)'
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: '#a89ec0', font: { size: 8 } },
            ticks: { display: false }
          }
        }
      }
    });
  }

  if (pmsCtx) {
    if (pmsChart) pmsChart.destroy();
    const last5 = AppState.logs.slice(-5).map(l => l.pain);
    while(last5.length < 5) last5.unshift(2);

    pmsChart = new Chart(pmsCtx, {
      type: 'line',
      data: {
        labels: ['D-4', 'D-3', 'D-2', 'D-1', 'Today'],
        datasets: [{
          data: last5,
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244,114,182,0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false, min: 0, max: 10 }
        }
      }
    });
  }
}

function renderCharts() {
  const labels = [];
  const painData = [];
  const moodData = [];
  const moodMap = { '😊': 5, '😐': 3, '😢': 1, '😤': 2, '🥱': 4 };

  const last7 = AppState.logs.slice(-7);
  last7.forEach(log => {
    const d = new Date(log.date);
    labels.push(d.toLocaleDateString('en', { weekday: 'short' }));
    painData.push(log.pain);
    moodData.push(moodMap[log.mood] || 3);
  });

  const chartDefaults = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a89ec0', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a89ec0', font: { size: 10 } }, beginAtZero: true }
    }
  };

  // Pain Chart
  const painCtx = document.getElementById('pain-chart');
  if (painCtx) {
    if (painChart) painChart.destroy();
    painChart = new Chart(painCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: painData,
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244,114,182,0.15)',
          borderWidth: 2.5,
          pointBackgroundColor: '#f472b6',
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, max: 10 } } }
    });
  }

  // Mood Chart
  const moodCtx = document.getElementById('mood-chart');
  if (moodCtx) {
    if (moodChart) moodChart.destroy();
    moodChart = new Chart(moodCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: moodData,
          backgroundColor: moodData.map(v => v >= 4 ? 'rgba(74,222,128,0.7)' : v >= 3 ? 'rgba(251,191,36,0.7)' : 'rgba(248,113,113,0.7)'),
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, max: 5 } } }
    });
  }
}

function updatePainDisplay(val) {
  document.getElementById('pain-val').textContent = val;
}

function selectMood(btn) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  AppState.selectedMood = btn.dataset.mood;
}

function saveLog() {
  const pain = parseInt(document.getElementById('pain-slider').value);
  const today = new Date().toDateString();
  const existing = AppState.logs.findIndex(l => l.date === today);
  const entry = { date: today, pain, mood: AppState.selectedMood };
  if (existing >= 0) AppState.logs[existing] = entry;
  else AppState.logs.push(entry);
  saveState();
  renderCharts();
  addCoins(5);
  showToast('Log saved! +5 🪙 coins');
  updateRiskAnalysis();
}

function updateRiskAnalysis() {
  const logs = AppState.logs;
  const user = AppState.currentUser;
  if (!user) return;

  const statusEl = document.getElementById('risk-status');
  const pcosEl = document.getElementById('risk-pcos');
  const pmsEl = document.getElementById('risk-pms');
  const detailEl = document.getElementById('risk-detail');

  if (logs.length < 3) {
    if (detailEl) detailEl.textContent = "Keep logging for at least 3 days to generate a detailed risk analysis.";
    return;
  }

  const avgPain = logs.reduce((acc, l) => acc + l.pain, 0) / logs.length;
  
  // Unique: Regularity Score calculation
  const savedFirst = localStorage.getItem('cyrasense_first_period');
  const savedCurrent = localStorage.getItem('cyrasense_current_period');
  let regularityScore = 100;
  let cycleLength = 28;

  if (savedFirst && savedCurrent) {
    const d1 = new Date(savedFirst);
    const d2 = new Date(savedCurrent);
    cycleLength = Math.max(1, Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)));
    // If cycle is not 28-30 days, regularity drops
    const deviation = Math.abs(cycleLength - 28);
    regularityScore = Math.max(0, 100 - (deviation * 5));
  }

  let pcosRisk = 'Low';
  let pmsRisk = 'Normal';
  let overallRisk = 'Low Risk';

  // PCOS Identification (Unique Logic)
  // Irregularity (>35 days) + Height/Weight factor + High Pain
  const isIrregular = cycleLength > 35 || cycleLength < 21;
  const bmiVal = (user.weight / ((user.height / 100) ** 2));
  
  if (isIrregular && bmiVal > 27 && avgPain > 4) {
    pcosRisk = 'High';
    overallRisk = 'High Risk (Consult Doctor)';
  } else if (isIrregular || bmiVal > 30) {
    pcosRisk = 'Moderate';
    overallRisk = 'Moderate Risk';
  }

  // PMS Identification
  if (avgPain > 7) {
    pmsRisk = 'Severe (PMDD Signs)';
    if (overallRisk === 'Low Risk') overallRisk = 'Moderate Risk';
  } else if (avgPain > 4) {
    pmsRisk = 'Moderate';
  }

  if (statusEl) {
    statusEl.textContent = overallRisk;
    statusEl.style.background = overallRisk.includes('High') ? 'rgba(239,68,68,0.2)' : overallRisk.includes('Moderate') ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)';
    statusEl.style.color = overallRisk.includes('High') ? '#ef4444' : overallRisk.includes('Moderate') ? '#f59e0b' : '#22c55e';
  }
  
  if (pcosEl) pcosEl.textContent = `${pcosRisk} (${regularityScore}% Regularity)`;
  if (pmsEl) pmsEl.textContent = pmsRisk;
  
  if (detailEl) {
    if (overallRisk.includes('High')) {
      detailEl.innerHTML = `<strong>Attention:</strong> Irregular cycle (${cycleLength} days) and physical markers suggest potential PCOS. We strongly recommend a consultation with a gynaecologist.`;
    } else if (overallRisk.includes('Moderate')) {
      detailEl.textContent = "Your patterns show some variability. Focus on a balanced diet and regular exercise to improve cycle regularity.";
    } else {
      detailEl.textContent = "Your cycle is stable and tracking well! Your regularity score is " + regularityScore + "%.";
    }
  }
}
