import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import { StartFacade } from "./screens/startScreen/StartFacade.js";
import { GameOverFacade } from "./screens/gameOverScreens/GameOverFacade.js";
import { GamePresenter } from "./GamePresenter.js";

const baseWidth = window.innerWidth;
const baseHeight = window.innerHeight - (window.innerHeight * 0.6);
const scaleFactor = (window.innerHeight / baseHeight) - ((window.innerWidth / baseWidth) / 1.95);

const k = kaboom({
    width: baseWidth,
    height: baseHeight,
    scale: scaleFactor,
    background: [92, 148, 252],
});


k.setGravity(900);
const facade = new StartFacade(k);
facade.init();

export function getPlayerName() {
    return facade.getPlayerName();
}

// ⏺ Crear presentador y pasarlo a la vista (GameOverFacade actuará como vista de scores)
const gameOverFacade = new GameOverFacade(k);
const presenter = new GamePresenter(gameOverFacade);

// Cargar los scores al iniciar
presenter.loadScores();

// Pasar presentador a la vista
gameOverFacade.setPresenter(presenter);