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
        const { width, height, vec2 } = this.k;
        const centerX = width() / 2;
        const centerY = height() / 2;

        const nameInput = this.ui.addInput(vec2(centerX - 100, centerY - 40));

        this.ui.addButton("Aceptar", vec2(centerX - 60, centerY + 20), () => {
            this._handleAccept(nameInput);
        });
    }

    _handleAccept(input) {
        this.playerName = input.getValue();

        if (!this.playerName || this.playerName.trim() === "") {
            console.warn("El nombre del jugador no puede estar vacío.");
            return;
        }

        console.log(`Nombre del jugador: ${this.playerName}`);
        this.facade.run();
    }

    getPlayerName() {
        return this.playerName;
    }
}
