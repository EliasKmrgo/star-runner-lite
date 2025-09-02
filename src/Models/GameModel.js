import fs from "fs";
import path from "path";

export class ScoreModel {
    constructor(filePath = "./scores.json") {
        this.filePath = path.resolve(filePath);
        this.ensureFile();
    }

    ensureFile() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    getScores() {
        try {
            const data = fs.readFileSync(this.filePath, "utf8");
            return JSON.parse(data);
        } catch (err) {
            console.error("Error leyendo scores:", err);
            return [];
        }
    }

    addScore(playerName, score) {
        const scores = this.getScores();
        scores.push({ playerName, score, date: new Date().toISOString() });
        fs.writeFileSync(this.filePath, JSON.stringify(scores, null, 2));
        return scores;
    }

    updateScore(playerName, newScore) {
        const scores = this.getScores();
        const index = scores.findIndex(s => s.playerName === playerName);
        if (index !== -1) {
            scores[index].score = newScore;
        } else {
            scores.push({ playerName, score: newScore, date: new Date().toISOString() });
        }
        fs.writeFileSync(this.filePath, JSON.stringify(scores, null, 2));
        return scores;
    }
}
