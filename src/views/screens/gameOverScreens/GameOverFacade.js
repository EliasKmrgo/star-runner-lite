import { GameOverManager } from "./GameOverManager.js";

export class GameOverFacade {
    constructor(k) {
        this.k = k;
        this.gameOverUI = new GameOverManager(k);
        this.scores = "";
    }

    init() {
        this.gameOverUI.show(
            () => { window.location.reload();},
            async () => {
                console.log("Copa presionado");
                try {
                    const response = await fetch(this.scores);
                    const scores = await response.json();
                    this.gameOverUI.showTop10(scores, () => {
                        this.init(); 
                    });
                } catch (err) {
                    console.error("Error cargando JSON de top 10:", err);
                }
            }
        );
    }

    setScores(scores) {
        this.scores = scores;
    }
}