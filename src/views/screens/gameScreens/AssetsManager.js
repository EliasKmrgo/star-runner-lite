export async function loadAssets(k) {
    k.loadSprite("tiles", "../Resources/sprites/tilemap.png", {
        sliceX: 20,
        sliceY: 9,
        gridWidth: 18,
        gridHeight: 18,
        spacing: 1,
    });

    k.loadSprite("playerImg", "../Resources/sprites/player.png");
    k.loadSprite("playerJump", "../Resources/sprites/playerjump.png");

    k.loadSound("music", "../Resources/sounds/music.mp3");
    k.loadSound("coinSound", "../Resources/sounds/coinsound.mp3");
    k.loadSound("diamondSound", "../Resources/sounds/diamondsound.mp3");
    k.loadSound("hitSound", "../Resources/sounds/hit.mp3");
    k.loadSound("gameOverMusic", "../Resources/sounds/gameover.mp3");
}
