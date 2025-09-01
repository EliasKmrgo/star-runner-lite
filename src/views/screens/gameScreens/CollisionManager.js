import { playSound } from "./SoundManager.js";

export function setupCollisions(k, player) {
    k.onUpdate(() => {
        // tiles peligrosos
        k.get("danger").forEach(tile => {
            if (player.isColliding(tile)) {
                k.destroy(player);
            }
        });

        // tiles "hit"
        k.get("hit").forEach(tile => {
            if (player.isColliding(tile)) {
                player.jump(380);
                player.move(-1200, 0);
                playSound(k, "hitSound");
            }
        });

        // monedas
        k.get("coin").forEach(tile => {
            if (player.isColliding(tile)) {
                tile.destroy();
                playSound(k, "coinSound");
            }
        });

        // diamantes
        k.get("diamond").forEach(tile => {
            if (player.isColliding(tile)) {
                tile.destroy();
                playSound(k, "diamondSound");
            }
        });
    });
}
