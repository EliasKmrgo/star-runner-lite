import { InputAdapter } from "./InputAdapters.js";

export class KeyboardAdapter extends InputAdapter {
    constructor(k, actions) {
        super(k, actions);
        this.k = k;
        this.actions = actions;
    }

    setup() {
        this.k.onKeyDown("right",()=>this.actions.moveRight());

        this.k.onKeyDown("left",()=>this.actions.moveLeft());

        this.k.onKeyPress("up",()=>this.actions.jump());
    }
}
