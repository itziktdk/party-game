const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const SCORES_FILE = path.join(__dirname, 'scores.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readScores() {
  try { return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8')); } catch { return []; }
}
function writeScores(scores) { fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2)); }

app.get('/api/scores', (req, res) => {
  const scores = readScores().sort((a, b) => b.score - a.score);
  res.json(scores);
});

app.post('/api/score', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') return res.status(400).json({ error: 'Invalid' });
  const scores = readScores();
  const idx = scores.findIndex(s => s.name === name);
  if (idx >= 0) scores[idx].score = score; else scores.push({ name, score });
  writeScores(scores);
  res.json({ ok: true });
});

app.post('/api/reset', (req, res) => {
  writeScores([]);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Party game running on port ${PORT}`));
