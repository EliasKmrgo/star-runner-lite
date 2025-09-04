// GameOverFacade.js
import { GameOverManager } from "./GameOverManager.js";
import { ApiService } from "../../services/ApiService.js";

export class GameOverFacade {
    constructor(k) {
        this.k = k;
        this.gameOverUI = new GameOverManager(k);
        this.scores = "";
        this.prefetchedScores = null;
    }

    init() {
        // Si ya hay Top 10 recibido del servidor, muéstralo directamente
        if (this.prefetchedScores) {
            const scores = this.prefetchedScores;
            this.prefetchedScores = null;
            this.gameOverUI.showTop10(scores, () => {
                this.init();
            });
            return;
        }

        // Mostrar pantalla Game Over
        this.gameOverUI.show(
            () => {
                console.log("Volver presionado");
                this.k.go("start"); // volver al menú principal
            },
            () => {
                console.log("Reiniciar presionado");
                this.k.go("game"); // reiniciar la partida
            },
            async () => {
                console.log("Top 10 presionado");
                try {
                    // Enviar último puntaje
                    try {
                        const name = localStorage.getItem("playerName") || "Player";
                        const score = Number(localStorage.getItem("lastScore") || 0);
                        await this.sendScore(name, score);
                    } catch (e) {
                        console.error("Error enviando puntaje:", e);
                    }

                    // Obtener top 10
                    const scores = await ApiService.fetchTop10(this.scores);
                    this.gameOverUI.showTop10(scores, () => {
                        this.init(); // volver al menú de Game Over
                    });
                } catch (err) {
                    console.error("Error cargando JSON de top 10:", err);
                }
            }
        );
    }

    async sendScore(name, score) {
        try {
            await ApiService.sendScore(name, score);
        } catch (e) {
            console.error("sendScore (GameOverFacade) failed:", e);
        }
    }

    setScores(scores) {
        this.scores = scores;
    }

    setPrefetchedScores(scores) {
        this.prefetchedScores = scores;
    }
}
