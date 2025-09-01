import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
import { GameFacade } from "./screens/gameScreens/Facade.js";

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

// 👉 Aquí solo usamos la fachada
const facade = new GameFacade(k);
facade.run();
