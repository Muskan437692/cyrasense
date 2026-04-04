/* ============================
   CYRASENSE — Calendar
   (with Cycle Graph)
   ============================ */

let cycleChart = null;

function renderCalendar() {
  const year = AppState.calendarYear;
  const month = AppState.calendarMonth;
  const today = new Date();

  const monthNames = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  document.getElementById('cal-month-year').textContent = `${monthNames[month]} ${year}`;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  // Prev month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day other-month';
    dayEl.textContent = daysInPrev - i;
    grid.appendChild(dayEl);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    dayEl.textContent = d;

    const dateKey = `${year}-${month}-${d}`;
    const marks = AppState.calendarData[dateKey] || {};

    if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
      dayEl.classList.add('today');
    }
    if (marks.period) dayEl.classList.add('period');
    if (marks.symptom) dayEl.classList.add('symptom');
    if (marks.mood) dayEl.classList.add('mood-marked');

    const thisDate = new Date(year, month, d);
    
    // Check for saved first period to calculate ovulation
    const savedFirst = localStorage.getItem('cyrasense_first_period');
    if (savedFirst) {
      const start = new Date(savedFirst);
      const diffStart = Math.floor((thisDate - start) / (1000 * 60 * 60 * 24));
      // Ovulation usually occurs roughly 14 days after period start
      if (diffStart % 28 === 14) {
        dayEl.innerHTML = `${d}<span style="position:absolute; top:-5px; right:-2px; font-size:0.7rem;">🌸</span>`;
        dayEl.title = "Predicted Ovulation Day";
      }
    }

    const diffToToday = Math.round((thisDate - today) / (1000 * 60 * 60 * 24));
    if (diffToToday >= 24 && diffToToday <= 30 && !marks.period) {
      dayEl.classList.add('predicted');
    }

    dayEl.addEventListener('click', () => openDayDetail(year, month, d));
    grid.appendChild(dayEl);
  }

  // Next month filler
  const total = firstDay + daysInMonth;
  const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let i = 1; i <= remaining; i++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day other-month';
    dayEl.textContent = i;
    grid.appendChild(dayEl);
  }
}

function renderCycleGraph() {
  const ctx = document.getElementById('cycle-graph-canvas');
  if (!ctx) return;

  const labels = [];
  const painData = [];
  const moodMap = { '😊': 5, '😐': 3, '😢': 1, '😤': 2, '🥱': 4 };
  const moodData = [];

  // Get last 14 days of logs
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    labels.push(d.toLocaleDateString('en', { day: 'numeric', month: 'short' }));
    const log = AppState.logs.find(l => l.date === d.toDateString());
    painData.push(log ? log.pain : null);
    moodData.push(log ? (moodMap[log.mood] || 3) : null);
  }

  if (cycleChart) cycleChart.destroy();

  cycleChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Pain Level',
          data: painData,
          borderColor: '#f472b6',
          backgroundColor: 'rgba(244,114,182,0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: '#f472b6',
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4,
          spanGaps: true
        },
        {
          label: 'Mood Score',
          data: moodData,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168,85,247,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#a855f7',
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4,
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: '#a89ec0', font: { family: 'Outfit', size: 12 }, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: {
          backgroundColor: 'rgba(15,10,30,0.9)',
          borderColor: 'rgba(168,85,247,0.3)',
          borderWidth: 1,
          titleColor: '#f1e8ff',
          bodyColor: '#a89ec0',
          padding: 12
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#a89ec0', font: { family: 'Outfit', size: 10 }, maxRotation: 45 }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#a89ec0', font: { family: 'Outfit', size: 10 } },
          min: 0,
          max: 10
        }
      }
    }
  });
}

function changeMonth(delta) {
  AppState.calendarMonth += delta;
  if (AppState.calendarMonth > 11) { AppState.calendarMonth = 0; AppState.calendarYear++; }
  if (AppState.calendarMonth < 0) { AppState.calendarMonth = 11; AppState.calendarYear--; }
  renderCalendar();
}

function openDayDetail(year, month, day) {
  AppState.selectedCalendarDate = { year, month, day };
  const dateKey = `${year}-${month}-${day}`;
  const marks = AppState.calendarData[dateKey] || {};

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('selected-date-label').textContent = `${day} ${monthNames[month]} ${year}`;
  document.getElementById('mark-period').checked = !!marks.period;
  document.getElementById('mark-symptom').checked = !!marks.symptom;
  document.getElementById('mark-mood').checked = !!marks.mood;
  document.getElementById('symptom-note').value = marks.note || '';

  const panel = document.getElementById('day-detail-panel');
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth' });
}

function saveCalendarMark(type) {
  if (!AppState.selectedCalendarDate) return;
  const { year, month, day } = AppState.selectedCalendarDate;
  const dateKey = `${year}-${month}-${day}`;
  if (!AppState.calendarData[dateKey]) AppState.calendarData[dateKey] = {};
  AppState.calendarData[dateKey][type] = document.getElementById(`mark-${type}`).checked;
  saveState();
  renderCalendar();
}

function saveDayNote() {
  if (!AppState.selectedCalendarDate) return;
  const { year, month, day } = AppState.selectedCalendarDate;
  const dateKey = `${year}-${month}-${day}`;
  if (!AppState.calendarData[dateKey]) AppState.calendarData[dateKey] = {};
  AppState.calendarData[dateKey].note = document.getElementById('symptom-note').value;
  saveState();
  showToast('Note saved! 📋');
}

function tagSymptom(btn, sym) {
  btn.classList.toggle('selected');
  if (btn.classList.contains('selected')) AppState.selectedSymptoms.add(sym);
  else AppState.selectedSymptoms.delete(sym);

  const list = document.getElementById('sym-selected-list');
  list.textContent = AppState.selectedSymptoms.size === 0
    ? 'No symptoms selected'
    : 'Selected: ' + [...AppState.selectedSymptoms].join(', ');

  if (AppState.selectedCalendarDate) {
    const { year, month, day } = AppState.selectedCalendarDate;
    const dateKey = `${year}-${month}-${day}`;
    if (!AppState.calendarData[dateKey]) AppState.calendarData[dateKey] = {};
    AppState.calendarData[dateKey].symptom = AppState.selectedSymptoms.size > 0;
    AppState.calendarData[dateKey].symptoms = [...AppState.selectedSymptoms];
    saveState();
    renderCalendar();
  }
}

// Prediction Logic
function updatePeriodPrediction() {
  const input = document.getElementById('first-period-date');
  if (!input || !input.value) return;

  const startDate = new Date(input.value);
  localStorage.setItem('cyrasense_first_period', input.value);

  const nextDate = new Date(startDate);
  nextDate.setDate(startDate.getDate() + 28);

  const label = document.getElementById('prediction-label');
  const dateSpan = document.getElementById('predicted-date');
  
  if (label && dateSpan) {
    label.style.display = 'block';
    dateSpan.textContent = nextDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const today = new Date();
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cycleDay = (diffDays % 28) + 1;
  const cycleDayEl = document.getElementById('cycle-day');
  if (cycleDayEl) cycleDayEl.textContent = cycleDay > 0 ? cycleDay : 1;
  
  // Mark ovulation on dashboard with emoji
  const ovEl = document.getElementById('ovulation-indicator');
  if (ovEl) ovEl.textContent = "🌸 Day 14";
  renderHistory();
}

function saveCurrentPeriod() {
  const input = document.getElementById('current-period-date');
  if (!input || !input.value) return;

  const dateValue = input.value;
  localStorage.setItem('cyrasense_current_period', dateValue);
  
  // Add to history
  if (!AppState.periodHistory.includes(dateValue)) {
    AppState.periodHistory.unshift(dateValue); // Newest first
    if (AppState.periodHistory.length > 5) AppState.periodHistory.pop(); // Keep 5
  }

  // Mark in local calendar data
  const date = new Date(dateValue);
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  if (!AppState.calendarData[dateKey]) AppState.calendarData[dateKey] = {};
  AppState.calendarData[dateKey].period = true;
  saveState();
  renderCalendar();
  renderHistory();
  showToast('Current period start saved! 🩸');
}

function renderHistory() {
  const list = document.getElementById('period-history-list');
  if (!list) return;
  list.innerHTML = '';
  
  if (AppState.periodHistory.length === 0) {
    list.innerHTML = '<li>No history recorded yet.</li>';
    return;
  }

  AppState.periodHistory.forEach((h, idx) => {
    const li = document.createElement('li');
    const d = new Date(h);
    li.textContent = `${idx === 0 ? 'Current' : 'Previous'}: ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    list.appendChild(li);
  });
}

// Load saved data on init
document.addEventListener('DOMContentLoaded', () => {
  const savedDate = localStorage.getItem('cyrasense_first_period');
  if (savedDate) {
    const input = document.getElementById('first-period-date');
    if (input) {
      input.value = savedDate;
      setTimeout(updatePeriodPrediction, 500);
    }
  }
  const savedCurrent = localStorage.getItem('cyrasense_current_period');
  if (savedCurrent) {
    const input = document.getElementById('current-period-date');
    if (input) input.value = savedCurrent;
  }
  renderHistory();
});
