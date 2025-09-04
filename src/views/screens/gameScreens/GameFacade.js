import { loadAssets } from "./AssetsManager.js";
import { loadMap } from "./MapManager.js";
import { createPlayer } from "./PlayerManager.js";
import { setupCollisions } from "./CollisionManager.js";
import { playMusic } from "./SoundManager.js";
import { eventBus } from "./EventBus.js";
import { GameOverFacade } from "../gameOverScreens/GameOverFacade.js";
import { ApiService } from "../../services/ApiService.js";

export class GameFacade {
  constructor(k) {
    this.k = k;
    this.gameOverFacade = new GameOverFacade(k);
    this.player = null;
    this.musicInstance = null;
    this.score = 0;
    this.scoreText = null;
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

    // UI de puntaje fija en pantalla
    this.score = 0;
    this.scoreText = this.k.add([
      this.k.text(`Score: ${this.score}`),
      this.k.pos(12, 12),
      this.k.fixed(),
    ]);

    // Cámara sigue al jugador
    this.k.onUpdate(() => {
      this.k.camPos(player.pos);
    });

    // Controles
    this.k.onKeyDown("right", moveRight);
    this.k.onKeyDown("left", moveLeft);
    this.k.onKeyPress("up", jump);

    // Sumar puntaje por coleccionables (registrar funciones para poder desuscribir)
    this._onCoinCollected = () => {
      this.score += 1;
      if (this.scoreText) this.scoreText.text = `Score: ${this.score}`;
    };
    this._onDiamondCollected = () => {
      this.score += 5;
      if (this.scoreText) this.scoreText.text = `Score: ${this.score}`;
    };
    eventBus.on("coinCollected", this._onCoinCollected);
    eventBus.on("diamondCollected", this._onDiamondCollected);

    // Enviar puntaje al morir y, al recibir respuesta, ir a Game Over con Top 10 (one-shot)
    this._onPlayerDead = async () => {
      eventBus.off("playerDead", this._onPlayerDead);
      try { localStorage.setItem("lastScore", String(this.score)); } catch {}
      const name = (() => { try { return localStorage.getItem("playerName") || "Player"; } catch { return "Player"; } })();
      try {
        const top = await ApiService.sendScore(name, this.score);
        if (top && top.length) this.gameOverFacade.setPrefetchedScores(top);
      } catch (err) {
        console.error("Error enviando score:", err);
      }
      this.endGame();
    };
    eventBus.on("playerDead", this._onPlayerDead);

    eventBus.on("playerHit", () => {
      // se podría restar vida o aplicar efectos
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

    if (this.scoreText) {
      this.scoreText.destroy();
      this.scoreText = null;
    }

    this.k.camPos(0, 0);
    //this.k.go("emptyScene");

    // Limpiar listeners del EventBus global para evitar duplicados en próximas partidas
    if (this._onCoinCollected) { eventBus.off("coinCollected", this._onCoinCollected); this._onCoinCollected = null; }
    if (this._onDiamondCollected) { eventBus.off("diamondCollected", this._onDiamondCollected); this._onDiamondCollected = null; }
    if (this._onPlayerDead) { eventBus.off("playerDead", this._onPlayerDead); this._onPlayerDead = null; }
  }

  endGame() {
    this.stopGame();
    this.k.go("gameOver");
  }
}

// Envío de puntaje a endpoint configurable (lee /config.json)

