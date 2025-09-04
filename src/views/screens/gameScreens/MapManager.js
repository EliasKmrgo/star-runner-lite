export async function loadMap(k) {
    const firstGid = 1;
    const totalFrames = 20 * 9;
    const FLIPPED_MASK = 0xE0000000;

    const mapRes = await fetch("../Resources/maps/Map.json");
    const mapData = await mapRes.json();

    const tilesetRes = await fetch("../Resources/maps/tiles.tsx");
    const tilesetText = await tilesetRes.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(tilesetText, "application/xml");

    const tilesetTiles = [...xml.querySelectorAll("tile")].map(t => {
        const id = parseInt(t.getAttribute("id"));
        const props = {};
        t.querySelectorAll("property").forEach(p => {
            props[p.getAttribute("name")] = p.getAttribute("value") === "true";
        });
        return { id, ...props };
    });

    const layer = mapData.layers.find(l => l.type === "tilelayer");
    const { width, height, data: tiles } = layer;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let gid = tiles[y * width + x];
            if (gid === 0) continue;

            const tileIndex = (gid & ~FLIPPED_MASK) - firstGid;
            if (tileIndex < 0 || tileIndex >= totalFrames) continue;

            const tileData = tilesetTiles.find(t => t.id === tileIndex);

            const tileComponents = [
                k.sprite("tiles", { frame: tileIndex }),
                k.pos(x * 18, y * 18),
                k.anchor("topleft"),
            ];

            if (tileData?.solid) tileComponents.push(k.area(), k.body({ isStatic: true }));
            if (tileData?.danger) tileComponents.push(k.area(), "danger");
            if (tileData?.coin) tileComponents.push(k.area(), "coin");
            if (tileData?.diamond) tileComponents.push(k.area(), "diamond");
            if (tileData?.hit) tileComponents.push(k.area(), "hit");

            k.add(tileComponents);
        }
    }
}
