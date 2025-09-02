export class Coins {
    constructor() {
        this.count = this.load();
    }

    addCoin(value = 1) {
        this.total += value;       
    }

    getTotal() {
        return this.total;
    }
}