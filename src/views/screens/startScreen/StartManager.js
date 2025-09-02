export class StartManager {
    constructor(k) {
        this.k = k; 
        this.inputs = [];
        this.buttons = [];
    }

    addInput(pos, w = 200, h = 40) {
        let value = "";
        let focused = false;

        const box = this.k.add([this.k.rect(w, h), this.k.pos(pos), this.k.outline(4), this.k.area(), this.k.color(255, 255, 255)]);
        const label = this.k.add([this.k.text("", { size: 20 }), this.k.pos(pos.x + 8, pos.y + 8), this.k.color(0, 0, 0)]);
        const cursor = this.k.add([this.k.text("|", { size: 20 }), this.k.pos(pos.x + 8, pos.y + 8), this.k.color(0, 0, 0)]);

        box.onClick(() => { focused = true; cursor.hidden = false; });
        this.k.onClick(() => { if (!box.isHovering()) { focused = false; cursor.hidden = true; } });
        this.k.onCharInput((ch) => { if (focused) { value += ch; label.text = value; cursor.pos.x = pos.x + 8 + label.width; } });
        this.k.onKeyPress("backspace", () => { if (focused) { value = value.slice(0, -1); label.text = value; cursor.pos.x = pos.x + 8 + label.width; } });
        this.k.onKeyPress("enter", () => { if (focused) { debug.log("Texto ingresado: " + value); focused = false; cursor.hidden = true; } });

        const inputObj = {
            getValue: () => value,
            setValue: (v) => { value = v; label.text = value; cursor.pos.x = pos.x + 8 + label.width; }
        };

        this.inputs.push(inputObj);
        return inputObj;
    }

    addButton(txt, pos, onClickHandler) {
        const btn = this.k.add([this.k.rect(120, 40), this.k.pos(pos), this.k.area(), this.k.outline(4), this.k.color(180, 180, 255)]);
        this.k.add([this.k.text(txt, { size: 18 }), this.k.pos(pos.x + 10, pos.y + 8), this.k.color(255, 255, 255)]);
        btn.onClick(() => { if (onClickHandler) onClickHandler(); });

        this.buttons.push(btn);
        return btn;
    }
}
