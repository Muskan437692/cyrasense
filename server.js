const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/'))); // Serve static files from root

// Simple persistence (JSON file)
const DATA_FILE = path.join(__dirname, 'db.json');

// Initial Data Structure
const initializeDb = () => {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            users: [],
            logs: []
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
};

const readDb = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeDb = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

initializeDb();

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
    const { username } = req.body;
    const db = readDb();
    let user = db.users.find(u => u.username === username);
    
    if (!user) {
        // Simple "signup on login" for this demo
        user = { ...req.body, id: Date.now() };
        db.users.push(user);
        writeDb(db);
    }
    
    res.json({ success: true, user });
});

// --- Health Logs Routes ---
app.get('/api/logs/:username', (req, res) => {
    const { username } = req.params;
    const db = readDb();
    const userLogs = db.logs.filter(log => log.username === username);
    res.json(userLogs);
});

app.post('/api/logs', (req, res) => {
    const log = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
    const db = readDb();
    db.logs.push(log);
    writeDb(db);
    res.json({ success: true, log });
});

// --- Chatbot Route ---
// Currently a rule-based proxy, easy to swap with OpenAI/Gemini
const botKnowledge = {
    cramp: "🩸 Period Cramps... (Simplified)",
    pcos: "🔬 PCOS... (Simplified)",
    default: "🌸 I'm here to help with your health journey!"
};

app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const msg = message.toLowerCase();
    let response = botKnowledge.default;

    if (msg.includes('cramp')) response = botKnowledge.cramp;
    if (msg.includes('pcos')) response = botKnowledge.pcos;

    res.json({ response });
});

// Fallback to index.html for SPA routing (Catch-all)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`CyraSense Server running at http://localhost:${PORT}`);
});
