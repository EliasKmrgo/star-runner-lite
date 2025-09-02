import { ScoreModel } from "./ScoreModel.js";

export class GamePresenter {
    constructor(view, filePath = "./scores.json") {
        this.view = view;
        this.model = new ScoreModel(filePath);
    }

    getScores() {
        return this.model.getScores();
    }

    saveScore(playerName, score) {
        this.model.addScore(playerName, score);
        this.view.showScores(this.getScores());
    }

    updateScore(playerName, score) {
        this.model.updateScore(playerName, score);
        this.view.showScores(this.getScores());
    }
}


