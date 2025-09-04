// api/ApiService.js — dedup por clave, URLs seguras, normalización robusta

/** @typedef {{ apiBaseUrl?: string, protocol?: string, host?: string, port?: number|string, path?: string, top10Url?: string }} ApiConfig */
/** @typedef {{ name: string, score: number }} TopEntry */

let _configPromise = null;
/** @type {Map<string, Promise<any>>} */
const _inflight = new Map();

/** @returns {Promise<ApiConfig>} */
async function getConfig() {
  if (_configPromise) return _configPromise;
  const url = new URL("../../config.json", import.meta.url);
  _configPromise = fetchWithTimeout(url.toString())
    .then(async (r) => {
      if (!r.ok) throw new Error("No se pudo leer config.json");
      return r.json();
    })
    .catch((e) => {
      _configPromise = null; // permite reintento si falló
      throw e;
    });
  return _configPromise;
}

/** @param {ApiConfig} cfg */
function buildBaseUrl(cfg) {
  if (cfg.apiBaseUrl) return new URL(cfg.apiBaseUrl);
  if (!cfg.host) throw new Error("Config sin host");
  const protocol = cfg.protocol || "http";
  const host = String(cfg.host);
  const port = cfg.port ? `:${cfg.port}` : "";
  const path = (cfg.path || "/").startsWith("/") ? (cfg.path || "/") : `/${cfg.path}`;
  return new URL(`${protocol}://${host}${port}${path}`);
}

/** @param {unknown[]} list */
function normalizeTop(list) {
  if (!Array.isArray(list)) return [];
  const norm = list.map((x, i) => {
    const name = (x?.name ?? x?.player ?? x?.nick ?? `Player${i+1}`);
    const sRaw = (x?.score ?? x?.points ?? x?.value);
    const n = Number(sRaw);
    const score = Number.isFinite(n) ? n : 0;
    return { name: String(name).trim().slice(0, 50) || `Player${i+1}`, score };
  });
  norm.sort((a, b) => (b.score - a.score) || a.name.localeCompare(b.name));
  return norm.slice(0, 10);
}

function keyOf(...parts) {
  return parts.map(p => String(p)).join("|");
}

function fetchWithTimeout(input, init = {}, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(input, { ...init, signal: ctrl.signal })
    .finally(() => clearTimeout(t));
}

export const ApiService = {
  /** @returns {Promise<TopEntry[]|null>} */
  async sendScore(name, score) {
    // POSTs generalmente no deberían deduplicarse globalmente: se deduplica por payload
    const cfg = await getConfig();
    const base = buildBaseUrl(cfg); // puede apuntar a /api/score o similar
    const payload = { player: name, score };
    const k = keyOf("sendScore", base.toString(), name, score);

    if (_inflight.has(k)) return _inflight.get(k);

    const p = (async () => {
      const res = await fetchWithTimeout(base.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) return null;
      try {
        const data = await res.json();
        return normalizeTop(data);
      } catch {
        return null;
      }
    })().finally(() => _inflight.delete(k));

    _inflight.set(k, p);
    return p;
  },

  /** @returns {Promise<TopEntry[]>} */
  async fetchTop10(fallbackPath = null) {
    // Dedup por URL efectiva
    const cfg = await getConfig();
    const topUrlStr = cfg.top10Url
      ? new URL(cfg.top10Url, buildBaseUrl(cfg)).toString()
      : (fallbackPath ? new URL(fallbackPath, import.meta.url).toString() : null);

    const k = keyOf("fetchTop10", topUrlStr || "none");
    if (_inflight.has(k)) return _inflight.get(k);

    const p = (async () => {
      // 1) Intentar top10Url si existe
      if (cfg.top10Url) {
        try {
          const r = await fetchWithTimeout(topUrlStr, {}, 8000);
          if (!r.ok) throw new Error("Top10 no disponible");
          const data = await r.json();
          return normalizeTop(data);
        } catch (_) {
          // cae a fallback
        }
      }
      // 2) Fallback opcional
      if (fallbackPath) {
        try {
          const r = await fetchWithTimeout(new URL(fallbackPath, import.meta.url).toString(), {}, 8000);
          if (!r.ok) throw new Error("Fallback no disponible");
          const data = await r.json();
          return normalizeTop(data);
        } catch (_) {
          // continúa
        }
      }
      return [];
    })().finally(() => _inflight.delete(k));

    _inflight.set(k, p);
    return p;
  },
};
