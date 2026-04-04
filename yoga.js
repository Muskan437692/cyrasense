/* ============================
   CYRASENSE — Yoga & Wellness
   (Fixed: thumbnail + YouTube new tab)
   ============================ */

const yogaVideos = [
  {
    title: 'Period Pain Relief Yoga',
    desc: 'Gentle poses to ease menstrual cramps and lower back pain. Perfect for day 1–2 of your cycle.',
    tag: 'Period Phase',
    duration: '12 min',
    level: 'Beginner',
    emoji: '🌸',
    bg: 'linear-gradient(135deg, #3b0764, #86198f)',
    youtubeId: 'g_tea8ZNk5A',
    youtubeUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A'
  },
  {
    title: 'Stress & Anxiety Relief Yoga',
    desc: 'Calming breathing exercises and restorative poses to reduce cortisol and PMS-related stress.',
    tag: 'Luteal Phase',
    duration: '15 min',
    level: 'Beginner',
    emoji: '🧘',
    bg: 'linear-gradient(135deg, #1e1b4b, #4338ca)',
    youtubeId: 'COp7BR_Dvps',
    youtubeUrl: 'https://www.youtube.com/watch?v=COp7BR_Dvps'
  },
  {
    title: 'Hormonal Balance Yoga Flow',
    desc: 'A complete flow targeting the endocrine system to naturally balance estrogen and progesterone.',
    tag: 'Follicular Phase',
    duration: '20 min',
    level: 'Intermediate',
    emoji: '🌿',
    bg: 'linear-gradient(135deg, #064e3b, #059669)',
    youtubeId: 'sTANio_2E0Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=sTANio_2E0Q'
  },
  {
    title: 'Yoga for PCOS & Hormone Health',
    desc: 'Specific sequences designed to improve insulin sensitivity, reduce testosterone, and support ovulation.',
    tag: 'PCOS Support',
    duration: '25 min',
    level: 'Intermediate',
    emoji: '💜',
    bg: 'linear-gradient(135deg, #4c0519, #be123c)',
    youtubeId: 'oj2pQSGEGFg',
    youtubeUrl: 'https://www.youtube.com/watch?v=oj2pQSGEGFg'
  },
  {
    title: 'Yin Yoga for Deep Relaxation',
    desc: 'Hold passive poses for 2–5 minutes to release deep connective tissue tension and calm the nervous system.',
    tag: 'All Phases',
    duration: '30 min',
    level: 'All Levels',
    emoji: '🌙',
    bg: 'linear-gradient(135deg, #1a0a30, #3730a3)',
    youtubeId: 'EvtDFTaA2AI',
    youtubeUrl: 'https://www.youtube.com/watch?v=EvtDFTaA2AI'
  },
  {
    title: 'Yoga for Cramps (Quick Fix)',
    desc: 'A short, effective sequence by Yoga with Adriene to help you find relief when you need it most.',
    tag: 'Period Phase',
    duration: '10 min',
    level: 'Beginner',
    emoji: '⚡',
    bg: 'linear-gradient(135deg, #7c2d12, #ea580c)',
    youtubeId: '1v_u1n77x74',
    youtubeUrl: 'https://www.youtube.com/watch?v=1v_u1n77x74'
  },
  {
    title: 'Bedtime Yoga for Menstrual Comfort',
    desc: 'Wind down with SarahBethYoga. Perfect for improving sleep quality during your period.',
    tag: 'Restorative',
    duration: '15 min',
    level: 'Beginner',
    emoji: '☁️',
    bg: 'linear-gradient(135deg, #1e293b, #334155)',
    youtubeId: 'hJbRpHZr_d0',
    youtubeUrl: 'https://www.youtube.com/watch?v=hJbRpHZr_d0'
  },
  {
    title: 'Yoga for Ovulation Support',
    desc: 'Nurture your fertility and energy levels with this focused practice from Yoga with Kassandra.',
    tag: 'Ovulation Phase',
    duration: '20 min',
    level: 'Intermediate',
    emoji: '✨',
    bg: 'linear-gradient(135deg, #78350f, #d97706)',
    youtubeId: 'U9-883K5KCc',
    youtubeUrl: 'https://www.youtube.com/watch?v=U9-883K5KCc'
  },
  {
    title: 'Deep Relief for Period Pain',
    desc: 'A deep-stretch session by Boho Beautiful to release pelvic tension and improve mood.',
    tag: 'Period Phase',
    duration: '25 min',
    level: 'Intermediate',
    emoji: '🌊',
    bg: 'linear-gradient(135deg, #134e4a, #0d9488)',
    youtubeId: 'P9fNoW_VNo8',
    youtubeUrl: 'https://www.youtube.com/watch?v=P9fNoW_VNo8'
  },
  {
    title: 'Luteal Phase Self-Care Flow',
    desc: 'Slow down and honor your body\'s need for care in the days leading up to your period.',
    tag: 'Luteal Phase',
    duration: '18 min',
    level: 'Beginner',
    emoji: '🕯️',
    bg: 'linear-gradient(135deg, #450a0a, #991b1b)',
    youtubeId: '8N1fP_t7_44',
    youtubeUrl: 'https://www.youtube.com/watch?v=8N1fP_t7_44'
  }
];

function renderYogaPage() {
  const grid = document.getElementById('yoga-grid');
  if (!grid) return;
  grid.innerHTML = '';

  yogaVideos.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'yoga-card';

    card.innerHTML = `
      <div class="yoga-thumb-placeholder" style="background:${v.bg}; position:relative; cursor:pointer;" onclick="playYogaVideo(${i}, this)">
        <span style="font-size: 4.5rem;">${v.emoji}</span>
        <div class="yoga-play-btn" id="yoga-play-${i}">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)"/>
            <polygon points="18,14 38,24 18,34" fill="white"/>
          </svg>
        </div>
      </div>

      <!-- Inline embed (shown on play click) -->
      <div id="yoga-embed-${i}" class="yoga-embed-wrap" style="display:none;">
        <iframe
          id="yoga-iframe-${i}"
          class="yoga-embed"
          src=""
          title="${v.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
        <button class="yoga-close-btn" onclick="closeYogaVideo(${i})">✕ Close Video</button>
      </div>

      <div class="yoga-card-body">
        <span class="yoga-tag">${v.tag}</span>
        <h3 class="yoga-card-title">${v.title}</h3>
        <p class="yoga-card-desc">${v.desc}</p>
        <div class="yoga-meta">
          <span>⏱ ${v.duration}</span>
          <span>📊 ${v.level}</span>
        </div>
        <div style="display:flex;gap:10px;margin-top:8px;">
          <button class="btn-primary" style="flex:1;" onclick="playYogaVideo(${i}, null)">
            ▶ Play Here
          </button>
          <a href="${v.youtubeUrl}" target="_blank" rel="noopener noreferrer"
            style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
            background:rgba(255,0,0,0.15);border:1px solid rgba(255,0,0,0.35);
            border-radius:50px;padding:12px;font-size:0.85rem;font-weight:600;
            color:#fca5a5;text-decoration:none;transition:all 0.2s;"
            onmouseover="this.style.background='rgba(255,0,0,0.3)'"
            onmouseout="this.style.background='rgba(255,0,0,0.15)'">
            ▶ YouTube
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function playYogaVideo(index, thumbEl) {
  const v = yogaVideos[index];
  const embedWrap = document.getElementById(`yoga-embed-${index}`);
  const iframe = document.getElementById(`yoga-iframe-${index}`);

  if (!embedWrap || !iframe) return;

  if (embedWrap.style.display === 'none') {
    // Load iframe src
    iframe.src = `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    embedWrap.style.display = 'block';
    embedWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    closeYogaVideo(index);
  }
}

function closeYogaVideo(index) {
  const embedWrap = document.getElementById(`yoga-embed-${index}`);
  const iframe = document.getElementById(`yoga-iframe-${index}`);
  if (embedWrap) embedWrap.style.display = 'none';
  if (iframe) iframe.src = ''; // stop playback
}
