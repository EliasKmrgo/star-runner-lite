import { playSound } from "./SoundManager.js";
import { eventBus } from "./EventBus.js";

export function setupCollisions(k, player) {
    k.onUpdate(() => {
        // tiles peligrosos => jugador muere (emitir una sola vez por frame)
        const dangerTiles = k.get("danger");
        for (const tile of dangerTiles) {
            if (player.isColliding(tile)) {
                eventBus.emit("playerDead");
                break;
            }
        }

        // tiles "hit"
        k.get("hit").forEach(tile => {
            if (player.isColliding(tile)) {
                player.jump(380);
                player.move(-1200, 0);
                playSound(k, "hitSound");
                eventBus.emit("playerHit");
            }
        });

        // monedas
        k.get("coin").forEach(tile => {
            if (player.isColliding(tile)) {
                tile.destroy();
                playSound(k, "coinSound");
                eventBus.emit("coinCollected");
            }
        });

        // diamantes
        k.get("diamond").forEach(tile => {
            if (player.isColliding(tile)) {
                tile.destroy();
                playSound(k, "diamondSound");
                eventBus.emit("diamondCollected");
            }
        });
    });
}

