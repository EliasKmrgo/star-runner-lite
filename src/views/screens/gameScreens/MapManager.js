const FLIPPED_MASK = 0xE0000000;
const FIRST_GID = 1;
const TILE_SIZE = 18;

async function loadJson(path) {
    const res = await fetch(path);
    return await res.json();
}

async function loadXml(path) {
    const res = await fetch(path);
    const text = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(text, "application/xml");
}

function parseTileset(xml) {
    return [...xml.querySelectorAll("tile")].map(t => {
        const id = parseInt(t.getAttribute("id"));
        const props = {};
        t.querySelectorAll("property").forEach(p => {
            props[p.getAttribute("name")] = p.getAttribute("value") === "true";
        });
        return { id, ...props };
    });
}

function createTileComponents(k, tileIndex, x, y, tileData) {
    const components = [
        k.sprite("tiles", { frame: tileIndex }),
        k.pos(x * TILE_SIZE, y * TILE_SIZE),
        k.anchor("topleft"),
    ];

    if (tileData?.solid) components.push(k.area(), k.body({ isStatic: true }));
    if (tileData?.danger) components.push(k.area(), "danger");
    if (tileData?.coin) components.push(k.area(), "coin");
    if (tileData?.diamond) components.push(k.area(), "diamond");
    if (tileData?.hit) components.push(k.area(), "hit");

    return components;
}

export async function loadMap(k) {
    const mapData = await loadJson("../Resources/maps/Map.json");
    const xml = await loadXml("../Resources/maps/tiles.tsx");
    const tilesetTiles = parseTileset(xml);

    const layer = mapData.layers.find(l => l.type === "tilelayer");
    const { width, height, data: tiles } = layer;
    const totalFrames = 20 * 9;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let gid = tiles[y * width + x];
            if (gid === 0) continue;

            const tileIndex = (gid & ~FLIPPED_MASK) - FIRST_GID;
            if (tileIndex < 0 || tileIndex >= totalFrames) continue;

            const tileData = tilesetTiles.find(t => t.id === tileIndex);
            const tileComponents = createTileComponents(k, tileIndex, x, y, tileData);

            k.add(tileComponents);
        }
    }
}
