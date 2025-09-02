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

        const { player, moveLeft, moveRight, jump } = createPlayer(this.k);

        playMusic(this.k, "music", true, 0.4);   // música de fondo
        setupCollisions(this.k, player);         // colisiones

        // Cámara sigue al jugador
        this.k.onUpdate(() => {
            this.k.camPos(player.pos);
        });

        // Controles (definidos aquí, no en PlayerManager)
        this.k.onKeyDown("right", moveRight);
        this.k.onKeyDown("left", moveLeft);
        this.k.onKeyPress("up", jump);
    }

    run() {
        this.initScenes();
        this.k.go("game");
    }
}
