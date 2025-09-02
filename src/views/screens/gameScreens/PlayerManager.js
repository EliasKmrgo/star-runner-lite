export function createPlayer(k) {
    const player = k.add([
        k.sprite("playerImg"),
        k.pos(50, 50),   // posición inicial
        k.area(),
        k.body(),
        k.scale(4 / 6),
    ]);

    // Animación automática
    k.onUpdate(() => {
        if (!player.isGrounded()) {
            player.use(k.sprite("playerJump"));
        } else {
            player.use(k.sprite("playerImg"));
        }
    });

    // Funciones de movimiento (sin controles de teclado)
    function moveLeft() {
        player.move(-120, 0);
    }

    function moveRight() {
        player.move(120, 0);
    }

    function jump() {
        if (player.isGrounded()) {
            player.jump(350);
        }
    }

    return {
        player,
        moveLeft,
        moveRight,
        jump,
    };
}
