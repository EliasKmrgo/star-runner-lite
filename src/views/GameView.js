import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import { StartFacade } from "./screens/startScreen/StartFacade.js";


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

// Configurar ruta de Top10 para la instancia real usada en juego
try {
  facade.setScoresPath("scores.json");
} catch {}
