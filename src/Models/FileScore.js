import fs from "fs";
import IScore from "./IScore.js";

class FileScore extends IScore {
  constructor(filePath = "scores.json") {
    super();
    this.filePath = filePath;
  }

  save(score) {
    const scores = this.getAll();
    scores.push(score);
    fs.writeFileSync(this.filePath, JSON.stringify(scores, null, 2));
  }

  getAll() {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }
}

