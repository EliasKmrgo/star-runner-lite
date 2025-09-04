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
        this.gameOverUI.show(
            () => {},
            async () => {
                console.log("Copa presionado");
                try {
                    // Enviar último puntaje a endpoint configurable (si existe)
                    try {
                        const name = localStorage.getItem("playerName") || "Player";
                        const score = Number(localStorage.getItem("lastScore") || 0);
                        await this.sendScore(name, score);
                    } catch {}

                    const scores = await ApiService.fetchTop10(this.scores);
                    this.gameOverUI.showTop10(scores, () => {
                        this.init();
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
