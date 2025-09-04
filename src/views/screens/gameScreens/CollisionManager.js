import { playSound } from "./SoundManager.js";
import { eventBus } from "./EventBus.js";

export function setupCollisions(k, player) {
    k.onUpdate(() => {
        k.get("danger").forEach(tile => {
            if (player.isColliding(tile)) {
                eventBus.emit("playerDead");
            }
        });

        k.get("hit").forEach(tile => {
            if (player.isColliding(tile)) {
                player.jump(380);
                player.move(-1200, 0);
                playSound(k, "hitSound");
                eventBus.emit("playerHit");
            }
        });

        k.get("coin").forEach(tile => {
            if (player.isColliding(tile)) {
                tile.destroy();
                playSound(k, "coinSound");
                eventBus.emit("coinCollected");
            }
        });

        k.get("diamond").forEach(tile => {
            if (player.isColliding(tile)) {
                tile.destroy();
                playSound(k, "diamondSound");
                eventBus.emit("diamondCollected");
            }
        });
    });
}