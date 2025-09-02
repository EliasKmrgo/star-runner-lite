import { loadAssets } from "./AssetsManager.js";
import { loadMap } from "./MapManager.js";
import { createPlayer } from "./PlayerManager.js";
import { setupCollisions } from "./CollisionManager.js";
import { playMusic } from "./SoundManager.js";
import { eventBus } from "./EventBus.js";
import { GameOverFacade } from "../gameOverScreens/GameOverFacade.js";

export class GameFacade {
    constructor(k) {
        this.k = k;
        this.gameOverFacade = new GameOverFacade(k);
        this.player = null;
        this.musicInstance = null;
    }

    initScenes() {
        this.k.scene("game", async () => {
        await this.startGame();
        });

        this.k.scene("gameOver", () => {
        this.gameOverFacade.init();
        });

        this.k.scene("emptyScene", () => {});
    }


    async startGame() {
        await loadAssets(this.k);
        await loadMap(this.k);

        const { player, moveLeft, moveRight, jump } = createPlayer(this.k);
        this.player = player;

        this.musicInstance = playMusic(this.k, "music", true, 0.4);

        setupCollisions(this.k, player);

        // Cámara sigue al jugador
        this.k.onUpdate(() => {
            this.k.camPos(player.pos);
        });

        // Controles
        this.k.onKeyDown("right", moveRight);
        this.k.onKeyDown("left", moveLeft);
        this.k.onKeyPress("up", jump);

        // 📌 Suscribirse a eventos del EventBus
        eventBus.on("playerDead", () => {
            console.log("⚠ Jugador muerto");
            this.endGame();
        });

        eventBus.on("coinCollected", () => {
            console.log("💰 Moneda recogida");
            // aquí puedes sumar puntos
        });

        eventBus.on("diamondCollected", () => {
            console.log("💎 Diamante recogido");
            // aquí puedes sumar más puntos
        });

        eventBus.on("playerHit", () => {
            console.log("💥 Jugador golpeado");
        });
    }

    run() {
        this.initScenes();
        this.k.go("game");
    }

    stopGame() {
        if (this.musicInstance) {
            this.musicInstance.stop();
            this.musicInstance = null;
        }

        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        this.k.camPos(0, 0);
        //this.k.go("emptyScene");
    }

     endGame() {
    this.stopGame();
    this.k.go("gameOver");  // 👈 cambia de escena
}

}