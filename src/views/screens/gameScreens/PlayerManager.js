export function createPlayer(k) {
    const player = k.add([
        k.sprite("playerImg"),
        k.pos(50, 50),   
        k.area(),
        k.body(),
        k.scale(4 / 6),
    ]);

    k.onUpdate(() => {
        if (!player.isGrounded()) {
            player.use(k.sprite("playerJump"));
        } else {
            player.use(k.sprite("playerImg"));
        }
    });

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
