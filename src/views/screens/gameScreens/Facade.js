import { loadAssets } from "./AssetsManager.js";
import { loadMap } from "./MapManager.js";
import { createPlayer } from "./PlayerManager.js";
import { setupCollisions } from "./CollisionManager.js";
import { playMusic } from "./SoundManager.js";

export class GameFacade {
    constructor(k) {
        this.k = k;
    }

    initScenes() {
        this.k.scene("game", async () => {
            await this.startGame();
        });
    }

    async startGame() {
        await loadAssets(this.k);                // cargar sprites y sonidos
        await loadMap(this.k);                   // cargar mapa
        const player = createPlayer(this.k);     // crear jugador
        playMusic(this.k, "music", true, 0.4);   // música de fondo
        setupCollisions(this.k, player);         // colisiones

        // cámara sigue al jugador
        this.k.onUpdate(() => {
            this.k.camPos(player.pos);
        });
    }

    run() {
        this.initScenes();
        this.k.go("game");
    }


}
