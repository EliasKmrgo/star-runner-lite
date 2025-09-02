export class Players {
  constructor(name) {
    this.name = name;
    this.score = 1;
  }

  setName(name="Player") {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  addScore(points) {
    this.score += points;
  }

  getScore() {
    return this.score;
  }
}
