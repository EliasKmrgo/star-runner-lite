export function createPlayer(k) {
    const player = k.add([
        k.sprite("playerImg"),
        k.pos(50, 50),   // posición inicial
        k.area(),
        k.body(),
        k.scale(4 / 6),
    ]);

    // Animación: cambia sprite según si está saltando o en suelo
    k.onUpdate(() => {
        if (!player.isGrounded()) {
            player.use(k.sprite("playerJump"));
        } else {
            player.use(k.sprite("playerImg"));
        }
    });

    // Controles
    k.onKeyDown("right", () => player.move(120, 0));
    k.onKeyDown("left", () => player.move(-120, 0));
    k.onKeyPress("up", () => {
        if (player.isGrounded()) player.jump(350);
    });

    return player;
}
