/* ============================
   CYRASENSE — AI Chatbot
   ============================ */

const botKnowledge = {
  cramp: {
    keywords: ['cramp', 'cramps', 'period pain', 'menstrual pain', 'stomach pain', 'stomach ache'],
    response: `🩸 **Period Cramps (Dysmenorrhea)**\n\n**Symptoms:** Sharp or dull aching pain in the lower abdomen, radiating to the lower back and thighs.\n**Causes:** High levels of prostaglandins, which cause uterine muscle contractions.\n**Effects:** Fatigue, irritability, and sometimes nausea or headaches.\n**Prevention:** Regular exercise, staying hydrated, and reducing caffeine intake.\n**Remedies:** Heating pads, gentle stretching (Child's Pose), and OTC pain relievers (Ibuprofen).\n**Diet:** Magnesium-rich foods like dark chocolate, nuts, and leafy greens. Avoid salty foods to reduce bloating.`
  },
  vomit: {
    keywords: ['vomit', 'vomiting', 'nausea', 'nauseous', 'sick', 'throw up'],
    response: `🤢 **Nausea & Vomiting**\n\n**Symptoms:** Feeling sick to your stomach, dizziness, and actual vomiting during the first 1-2 days of your period.\n**Causes:** Excess prostaglandins entering the bloodstream and affecting the gastrointestinal tract.\n**Effects:** Dehydration, weakness, and loss of appetite.\n**Prevention:** Eat smaller, more frequent meals before and during your period.\n**Remedies:** Ginger tea, peppermint oil, and acupressure (P6 point on the wrist).\n**Diet:** Bland foods like crackers, toast, and bananas. Sip water or electrolyte drinks slowly.`
  },
  headache: {
    keywords: ['headache', 'head pain', 'migraine', 'head ache'],
    response: `🤕 **Menstrual Headaches & Migraines**\n\n**Symptoms:** Pulsating pain usually on one side of the head, sensitivity to light/sound.\n**Causes:** A sharp drop in estrogen levels just before the period starts.\n**Effects:** Difficulty focusing, vision changes, and extreme fatigue.\n**Prevention:** Maintain a consistent sleep schedule and manage stress levels.\n**Remedies:** Cold compress on the forehead, resting in a dark room, and stay hydrated.\n**Diet:** Limit sugar and processed foods. Ensure adequate intake of Vitamin B2 and Magnesium.`
  },
  dizziness: {
    keywords: ['dizzy', 'dizziness', 'lightheaded', 'faint', 'fainting'],
    response: `😵 **Dizziness & Lightheadedness**\n\n**Symptoms:** Feeling unsteady, room spinning, or nearing fainting when standing up suddenly.\n**Causes:** Fluctuating hormones, low blood sugar, or iron-deficiency anemia due to heavy bleeding.\n**Effects:** Risk of falls and general physical weakness.\n**Prevention:** Do not skip meals; rise slowly from sitting or lying down.\n**Remedies:** Lie down with feet elevated, drink plenty of fluids immediately.\n**Diet:** Iron-rich foods like spinach, lentils, and red meat. Increase Vitamin C to improve iron absorption.`
  },
  pcos: {
    keywords: ['pcos', 'polycystic', 'irregular period', 'irregular cycle', 'pcos symptoms'],
    response: `🔬 **PCOS (Polycystic Ovary Syndrome)**\n\n**Symptoms:** Irregular periods, excess facial/body hair, severe acne, and weight gain.\n**Causes:** Hormonal imbalance (elevated androgens) and insulin resistance.\n**Effects:** Higher risk of diabetes, heart disease, and fertility challenges.\n**Prevention:** Leading an active lifestyle and early medical consultation.\n**Remedies:** Weight management, stress reduction, and prescribed hormonal treatments.\n**Diet:** Low-glycemic index (GI) foods (whole grains, beans), proteins, and fiber. Limit refined sugars and carbs.`
  },
  pms: {
    keywords: ['pms', 'premenstrual', 'mood swings', 'irritable', 'bloating before period'],
    response: `💊 **PMS (Premenstrual Syndrome)**\n\n**Symptoms:** Mood swings, irritability, bloating, and breast tenderness occurring 5-11 days before menstruation.\n**Causes:** Changes in brain chemistry (serotonin) triggered by hormonal shifts.\n**Effects:** Emotional distress and social withdrawal.\n**Prevention:** Regular aerobic exercise and adequate sleep.\n**Remedies:** Relaxation techniques like yoga or meditation, and warm baths.\n**Diet:** Reduce salt to prevent bloating. Increase calcium intake (milk, yogurt, calcium-fortified plant milks).`
  },
  infection: {
    keywords: ['vaginal infection', 'discharge', 'itching', 'yeast infection', 'uti', 'odour', 'odor', 'vaginal'],
    response: `🏥 **Vaginal Infections**\n\n**Symptoms:** Unusual discharge (grey, green, or chunky white), strong odour, and persistent itching.\n**Causes:** Overgrowth of bacteria or yeast, often triggered by pH changes or antibiotics.\n**Effects:** Discomfort, pain during urination, and potential pelvic inflammation.\n**Prevention:** Wear cotton underwear, avoid douching, and wipe front-to-back.\n**Remedies:** Consult a doctor for antifungal creams or antibiotics. Do not self-treat.\n**Diet:** Probiotic-rich foods like yogurt, kefir, and fermented vegetables to support healthy flora.`
  },
  weight: {
    keywords: ['weight gain', 'weight loss', 'gaining weight', 'losing weight', 'metabolism'],
    response: `⚖️ **Weight Changes & Hormones**\n\n**Symptoms:** Noticeable weight gain or difficulty losing weight, specifically around the abdomen.\n**Causes:** Water retention (temporary) or metabolic changes due to PCOS/Insulin resistance.\n**Effects:** Reduced self-esteem and physical lethargy.\n**Prevention:** Tracking calories and maintaining a consistent workout routine.\n**Remedies:** Strength training to boost metabolism and managing stress cortisol.\n**Diet:** High-protein, high-fiber diet. Avoid late-night snacking and sugary beverages.`
  },
  default: {
    response: `🌸 I'm here to help with your health journey! Ask me about:\n\n• 🩸 **Cramps & Pain**\n• 🤢 **Nausea & Vomiting**\n• 🤕 **Headaches**\n• 🔬 **PCOS & PMS**\n• 🏥 **Infections**\n• 🥗 **Diet & Weight**\n\nI'll provide symptoms, causes, effects, and remedies for any topic! ✨`
  }
};

function getBotResponse(message) {
  const msg = message.toLowerCase();
  for (const [key, data] of Object.entries(botKnowledge)) {
    if (key === 'default') continue;
    if (data.keywords.some(k => msg.includes(k))) {
      return data.response;
    }
  }
  // Contextual fallback
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hi there! 👋 I'm CyraBot, your menstrual health assistant. What would you like to know today?`;
  }
  if (msg.includes('thank')) {
    return `You're so welcome! 🌸 Remember, I'm always here when you need health guidance. Take care of yourself!`;
  }
  return botKnowledge.default.response;
}

function formatBotMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function appendMessage(text, sender) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = sender === 'bot' ? '🌸' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = formatBotMessage(text);

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function showTyping() {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-msg bot typing';
  msg.id = 'typing-indicator';
  msg.innerHTML = `
    <div class="chat-avatar">🌸</div>
    <div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>
  `;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMessage(text, 'user');
  showTyping();

  setTimeout(() => {
    removeTyping();
    const response = getBotResponse(text);
    appendMessage(response, 'bot');
  }, 900 + Math.random() * 600);
}

function sendQuickQ(question) {
  document.getElementById('chat-input').value = question;
  sendMessage();
}

function clearChat() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = '';
  appendMessage("Hi! I'm CyraBot 🌸 — your health assistant. How can I help you today?", 'bot');
}
