const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'scores.json');

// CORS básico
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Aceptar texto plano como fallback (p. ej. Postman mal configurado)
app.use(express.text({ type: 'text/plain' }));

async function readScores() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const json = JSON.parse(data);
    return json && typeof json === 'object' && !Array.isArray(json) ? json : {};
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    throw err;
  }
}

async function writeScores(scores) {
  const json = JSON.stringify(scores, null, 2);
  await fs.writeFile(DATA_FILE, json, 'utf8');
}

app.post('/', async (req, res) => {
  try {
    let payload = req.body;
    console.log("POST / payload:", payload);

    // Si llegó como texto, intentar parsear JSON y ser tolerante con falta de llaves
    if (typeof payload === 'string') {
      const raw = payload.trim();
      try {
        payload = JSON.parse(raw);
      } catch (e1) {
        if (!raw.startsWith('{') && !raw.endsWith('}')) {
          try { payload = JSON.parse('{' + raw + '}'); } catch (e2) {}
        }
      }
    }

    const { player } = payload || {};
    let { score } = payload || {};

    // Aceptar score como string o número y normalizar
    if (typeof score === 'string' && score.trim() !== '') {
      score = Number(score);
    }

    if (
      typeof player !== 'string' || player.trim() === '' ||
      typeof score !== 'number' || !Number.isFinite(score)
    ) {
      return res.status(400).json({
        error: 'Formato inválido. Se requiere { player: string, score: number }'
      });
    }

    const name = player.trim();
    const scores = await readScores();
    const current = scores[name];

    if (typeof current !== 'number' || score > current) {
      scores[name] = score;
      await writeScores(scores);
    }

    return res.status(200).json(scores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/', async (_req, res) => {
  try {
    const scores = await readScores();
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
