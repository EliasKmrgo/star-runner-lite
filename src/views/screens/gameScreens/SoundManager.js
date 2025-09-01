export function playMusic(k, name, loop = true, volume = 0.5) {
    return k.play(name, { loop, volume });
}

export function playSound(k, name, volume = 0.5) {
    return k.play(name, { loop: false, volume });
}
