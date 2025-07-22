class Game {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.hiScore = 0;
    this._elementSelectors();
  }

  _elementSelectors() {
    this.startBtn = document.querySelector(".start-btn button");
    this.titleScreen = document.querySelector(".title-screen");
    this.hiScoreContainer = document.querySelector("#high-score .score");
    this.currentScoreContainer = document.querySelector("#score .score");
  }
  // score
  // high score
}
