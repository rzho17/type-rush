class Game {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.hiScore = 0;
    this._elementSelectors();
    this._test();
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

  //   get random coord on game board

  // create word component
  _createWord(word) {
    const wordBg = document.createElement("div");
    const bg = document.createElement("div");
    const overlay = document.createElement("div");
    const text = document.createElement("span");

    wordBg.classList.add("word");
    bg.classList.add("bg");
    text.innerText = word;

    wordBg.append(bg, overlay, text);

    this.el.gameScreen.append(wordBg);
  }

  // place word on game board

  // typing elements

  // check if word typed === a current word on screen

  // remove word from dom

  // increase score

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
