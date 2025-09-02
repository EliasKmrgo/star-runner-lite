class GamePresenter {
  constructor(view, gameFacade, scoreService) {
    this.view = view;
    this.facade = gameFacade;
    this.scores = scoreService;
  }

  onGameOver(player, points) {
    this.scores.addScore(player, points);
    const topScores = this.scores.getTopScores();
    this.view.showGameOver(points, topScores);
  }

  onRestart() {
    this.facade.restart();
    this.view.reset();
  }
}


