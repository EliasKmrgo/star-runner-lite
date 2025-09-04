const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // por defecto 3001
const DATA_FILE = path.join(__dirname, 'scores.json');

// CORS básico (permite llamadas desde http://localhost:3000)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/plain' })); // fallback si llega texto plano

// Leer scores (devuelve objeto { playerName: score, ... })
async function readScores() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    return {};
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

async function writeScores(scores) {
  await fs.writeFile(DATA_FILE, JSON.stringify(scores, null, 2), 'utf8');
}

// Helper: intenta normalizar payloads (JSON string, texto, etc.)
function normalizePayload(body) {
  let payload = body;
  if (typeof payload === 'string') {
    const raw = payload.trim();
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      // si no es JSON completo, intentar rodearlo con { } (tolerancia)
      if (!raw.startsWith('{') && !raw.endsWith('}')) {
        try { payload = JSON.parse('{' + raw + '}'); } catch (e2) { payload = {}; }
      } else {
        payload = {};
      }
    }
  }
  return payload || {};
}

// Handler que guarda el puntaje (compatible con varias formas de campo)
async function handleScorePost(req, res) {
  try {
    let payload = normalizePayload(req.body);
    console.log('POST payload:', payload);

    // Acepta 'player' o 'name' (o variantes)
    const name =
      (payload.player || payload.name || payload.playerName || payload.player_name || '')
        .toString()
        .trim();

    // score puede venir como string o number; normalizamos
    let score = payload.score ?? payload.points ?? payload.value;
    if (typeof score === 'string' && score.trim() !== '') score = Number(score);

    if (!name || typeof score !== 'number' || !Number.isFinite(score)) {
      return res.status(400).json({
        error: 'Formato inválido. Se requiere { player | name: string, score: number }'
      });
    }

    const scores = await readScores();
    const current = scores[name];

    // Guardar solo si es nuevo o mayor que el actual
    if (typeof current !== 'number' || score > current) {
      scores[name] = score;
      await writeScores(scores);
    }

    // Responder con el top 10 (array) y el objeto completo por compatibilidad
    const topArray = Object.entries(scores)
      .map(([n, s]) => ({ name: n, score: s }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return res.json({ ok: true, top10: topArray, byName: scores });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

// Rutas
app.post('/score', handleScorePost); // endpoint recomendado
app.post('/', handleScorePost);       // compatibilidad con tu versión previa

// Obtener top 10 (array)
app.get('/scores', async (_req, res) => {
  try {
    const scores = await readScores();
    const topArray = Object.entries(scores)
      .map(([n, s]) => ({ name: n, score: s }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    res.json(topArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Raíz (puede ser usada por frontend como top10Url)
app.get('/', async (_req, res) => {
  try {
    const scores = await readScores();
    const topArray = Object.entries(scores)
      .map(([n, s]) => ({ name: n, score: s }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    res.json(topArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
