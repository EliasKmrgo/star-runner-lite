import { StartManager } from "./StartManager.js";
import { GameFacade } from "../gameScreens/GameFacade.js";

export class StartFacade {
    constructor(k) {
        this.k = k;
        this.ui = new StartManager(k); 
        this.facade = new GameFacade(k);
        this.playerName = "";
    }

    init() {
        const centerX = this.k.width() / 2;
        const centerY = this.k.height() / 2;

        const nombreInput = this.ui.addInput(this.k.vec2(centerX - 100, centerY - 40));

        this.ui.addButton("Aceptar", this.k.vec2(centerX - 60, centerY + 20), () => {
            this.playerName = nombreInput.getValue();
            console.log("Nombre del jugador: " + this.playerName);
            try { localStorage.setItem("playerName", this.playerName || "Player"); } catch {}
            this.facade.run();
        });
    }

    getPlayerName() {
        return this.playerName;
    }

    // Permite configurar la ruta de Top10 usada por GameOver
    setScoresPath(path) {
        if (this.facade && this.facade.gameOverFacade && typeof this.facade.gameOverFacade.setScores === "function") {
            this.facade.gameOverFacade.setScores(path);
        }
    }
}
