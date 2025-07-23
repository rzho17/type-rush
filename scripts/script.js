class Game {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.hiScore = 0;
    this.wordWidth = 175;
    this.wordHeight = 40;
    this._elementSelectors();
    this._test();
    // this._randomCoord();
    this._placeWord();
  }

  _elementSelectors() {
    this.el = {};
    this.el.startBtn = document.querySelector(".start-btn");
    // this.titleScreen = document.querySelector(".title-screen");
    this.el.gameScreen = document.querySelector("#game-screen");
    // this.hiScoreContainer = document.querySelector("#high-score .score");
    // this.currentScoreContainer = document.querySelector("#score .score");
  }

  _test() {
    this.el.startBtn.addEventListener("click", () => {
      console.log("hey");
    });
  }
  // score
  // high score

  //   get word list from api

  //   set loading screen while waiting for api

  // remove loading screen once api loads

  //   gets width and height of game board
  //   get width
  _getScreenWidth() {
    const width = this.el.gameScreen.clientWidth;

    return width;
  }

  // get height
  _getScreenHeight() {
    const height = this.el.gameScreen.clientHeight;

    return height;
  }

  //   get random coord on game board
  _randomCoord() {
    const width = this._getScreenWidth() - this.wordWidth;
    const height = this._getScreenHeight() - this.wordHeight;

    const randomX = this._generateRandomCoord(width);
    const randomY = this._generateRandomCoord(height);

    console.log(randomX, randomY);
    return [randomX, randomY];
  }

  _generateRandomCoord(max) {
    return Math.floor(Math.random() * max);
  }

  // function to place word onto game board randomly
  _placeWord(text) {
    const word = this._createWord("text");

    const coords = this._randomCoord();

    const x = coords[0];
    const y = coords[1];

    console.log(x);
    console.log(y);

    this.el.gameScreen.append(word);
    word.style.left = `${x}px`;
    word.style.top = `${y}px`;
  }

  // create word component
  _createWord(word) {
    const wordBg = document.createElement("div");
    const overlay = document.createElement("div");
    const text = document.createElement("span");

    wordBg.classList.add("word");
    overlay.classList.add("overlay");
    text.innerText = word;

    wordBg.append(overlay, text);
    return wordBg;
  }

  // place word on game board

  // typing elements

  // check if word typed === a current word on screen

  // remove word from dom

  // increase score
  _increaseScore() {
    this.score += 100;
  }

  // remove life
  _removeLife() {
    this.lives--;
  }

  // check gameover

  // play again or go home
}

const wordUrl = "https://random-word-api.herokuapp.com/word?length=5&number=10";

const getData = async () => {
  try {
    const response = await fetch(wordUrl);

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

getData();
const game = new Game();

// game._createWord("heyyyyasdfa");
