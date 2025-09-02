class ScoreService {
  constructor(repository) {
    this.repository = repository;
  }

  addScore(player, points) {
    const score = {
      player,
      points,
      date: Date.now()
    };
    this.repository.save(score);
  }

  getTopScores(limit = 10) {
    return this.repository
      .getAll()
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
}

