import { StartManager } from "./StartManager.js";
import { GameFacade } from "../gameScreens/GameFacade.js";
import { KeyboardAdapter } from "../../../adapters/KeyboardAdapter.js";

export class StartFacade {
    constructor(k) {
        this.k = k;
        this.ui = new StartManager(k); 
        const keyboard = new KeyboardAdapter(k);
        this.facade = new GameFacade(k, keyboard);
        this.playerName = "";
    }

    init() {
        const centerX = this.k.width() / 2;
        const centerY = this.k.height() / 2;

        const nombreInput = this.ui.addInput(this.k.vec2(centerX - 100, centerY - 40));

        this.ui.addButton("Aceptar", this.k.vec2(centerX - 60, centerY + 20), () => {
            this.playerName = nombreInput.getValue();
            console.log("Nombre del jugador: " + this.playerName);
            this.facade.run();
        });
    }

    getPlayerName() {
        return this.playerName;
    }
}
