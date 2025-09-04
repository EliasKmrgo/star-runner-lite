// GameOverManager.js
export class GameOverManager {
    constructor(k) {
        this.k = k;
        this.buttons = [];
        this.top10Nodes = [];
        this.gameOverNodes = [];
    }

    show(onVolver, onReload, onCopa) {
        this._clearUI();

        const width = this.k.width();
        const height = this.k.height();
        const centerX = width / 2;
        const centerY = height / 2;

        // Texto Game Over
        const title = this.k.add([
            this.k.text("GAME OVER", { size: Math.floor(width * 0.04) }),
            this.k.pos(centerX - (width * 0.1), centerY - (height * 0.2)),
            this.k.color(255, 0, 0),
        ]);
        this.gameOverNodes.push(title);

        const spacing = width * 0.25;
        const buttonY = centerY + (height * 0.1);

        // Botón Volver
        this._addButton("Volver", this.k.vec2(centerX - spacing, buttonY), onVolver);

        // Botón Reiniciar
        this._addButton("Reiniciar", this.k.vec2(centerX - (width * 0.08), buttonY), onReload);

        // Botón Top 10
        this._addButton("Top 10", this.k.vec2(centerX + spacing - (width * 0.15), buttonY), onCopa);
    }

    _addButton(txt, pos, callback) {
        const width = this.k.width();
        const height = this.k.height();

        const btnWidth = width * 0.15;
        const btnHeight = height * 0.2;

        const btn = this.k.add([
            this.k.rect(btnWidth, btnHeight),
            this.k.pos(pos),
            this.k.area(),
            this.k.outline(4),
            this.k.color(180, 180, 255),
        ]);

        const label = this.k.add([
            this.k.text(txt, { size: Math.floor(width * 0.025) }),
            this.k.pos(pos.x + (btnWidth * 0.1), pos.y + (btnHeight * 0.2)),
            this.k.color(0, 0, 0),
        ]);

        btn.onClick(() => { if (callback) callback(); });

        this.buttons.push(btn, label);
        this.gameOverNodes.push(btn, label);
    }

    // Mostrar Top 10
    showTop10(scores, onBack) {
        this._clearUI();

        const width = this.k.width();
        const height = this.k.height();
        const centerX = width / 2;
        const centerY = height / 2;

        // Título
        this.top10Nodes.push(this.k.add([
            this.k.text("TOP 10", { size: Math.floor(width * 0.035) }),
            this.k.pos(centerX - (width * 0.07), centerY - (height * 0.3)),
            this.k.color(255, 215, 0),
        ]));

        const colSpacing = width * 0.25;
        const rowSpacing = height * 0.08;
        const itemsPerCol = 5;

        scores.forEach((player, i) => {
            const col = Math.floor(i / itemsPerCol);
            const row = i % itemsPerCol;

            const x = (centerX - colSpacing + (col * colSpacing)) + 50;
            const y = centerY - (height * 0.15) + row * rowSpacing;

            const node = this.k.add([
                this.k.text(`${i + 1}. ${player.name} - ${player.score}`, { size: Math.floor(width * 0.02) }),
                this.k.pos(x, y),
                this.k.color(255, 255, 255),
            ]);

            this.top10Nodes.push(node);
        });

        // Botón volver
        const backBtn = this.k.add([
            this.k.rect(width * 0.15, height * 0.18),
            this.k.pos(centerX - (width * 0.08), centerY + (height * 0.3)),
            this.k.area(),
            this.k.outline(4),
            this.k.color(200, 200, 200),
        ]);

        const label = this.k.add([
            this.k.text("Volver", { size: Math.floor(width * 0.025) }),
            this.k.pos(centerX - (width * 0.05), centerY + (height * 0.32)),
            this.k.color(0, 0, 0),
        ]);

        backBtn.onClick(() => { if (onBack) onBack(); });

        this.top10Nodes.push(backBtn, label);
    }

    _clearUI() {
        [...this.buttons, ...this.top10Nodes, ...this.gameOverNodes].forEach(n => n.destroy());
        this.buttons = [];
        this.top10Nodes = [];
        this.gameOverNodes = [];
    }
}
