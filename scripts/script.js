class Game {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.hiScore = 0;
    this.wordWidth = 175;
    this.wordHeight = 40;
    this.coords = {
      x: 0,
      y: 0,
    };
    this.regex = /^[a-zA-Z]+$/;
    this.masterArray = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
    ];
    this.wordsOnScreen = [];
    this.playerInput = "";
    // this.playerInput = document.createElement("input");
    // this.playerInput = [];
    this._elementSelectors();
    this._test();
    // this._randomCoord();
    // this._placeWord();
    // this._gameInterval();
    this._playerKeydown();
  }

  _elementSelectors() {
    this.el = {};
    this.el.startBtn = document.querySelector(".start-btn");
    this.el.titleContent = document.querySelector(".title-content");
    this.el.titleImg = document.querySelector("#game-screen img");
    this.el.gameScreen = document.querySelector("#game-screen");
    // this.hiScoreContainer = document.querySelector("#high-score .score");
    // this.currentScoreContainer = document.querySelector("#score .score");
  }

  _gameFlow() {}
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
    this.coords.x = randomX;
    this.coords.y = randomY;
  }

  _generateRandomCoord(max) {
    return Math.floor(Math.random() * max);
  }

  // highlights letter if being typed correctly on words
  _letterFilter() {
    const joinedWord = this.playerInput;
    const result = new RegExp(joinedWord, "i");
    const wordList = document.querySelectorAll(".word span");

    wordList.forEach((word) => {
      if (result.test(word.textContent)) {
        word.innerHTML = word.textContent.replace(
          result,
          '<b class="highlight">$&</b>'
        );
      }
    });
  }

  // clears the letter filter
  _clearLetterFilter() {
    const wordList = document.querySelectorAll(".word span");

    wordList.forEach((word) => {
      word.innerHTML = word.textContent;
    });

    // console.log("cleared");
  }

  // finds index if word is in the on screen words
  _findWordIndex(word) {
    const index = this.wordsOnScreen.indexOf(word);

    console.log(index);
    if (index >= 0) {
      this.playerInput = "";
      this._clearLetterFilter();
      return index;
    }
  }

  _playerKeydown() {
    // this._findWordIndex();
    window.addEventListener("keydown", (e) => {
      const letter = e.key;
      const length = e.key.length;

      const isLetter = this.regex.test(letter);

      if (letter === "Backspace") {
        this.playerInput = this.playerInput.slice(
          0,
          this.playerInput.length - 1
        );
        console.log(this.playerInput);
      }
      if (isLetter && length === 1) {
        this.playerInput += letter;
        console.log(this.playerInput);
      }

      // start of game flow, will need to refactor this into its own function
      this._letterFilter();
      const index = this._findWordIndex(this.playerInput);
      if (index >= 0) {
        this._removeWord(index);
      }
    });
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

  _gameInterval() {
    setInterval(() => {
      const poppedWord = this.masterArray.pop();
      this.wordsOnScreen.push(poppedWord);
      console.log(this.wordsOnScreen);
      this._placeWord(poppedWord);
    }, 3000);
  }

  // function to place word onto game board randomly
  _placeWord(text = "placeholder") {
    const word = this._createWord(text);

    this._randomCoord();
    const x = this.coords.x;
    const y = this.coords.y;

    this.el.gameScreen.append(word);
    word.style.left = `${x}px`;
    word.style.top = `${y}px`;
  }

  //   game flow
  // get array of words from api
  // start creating word elements from the create word function using values from array
  // will either pop or shift to get the last or first index of word array

  // not sure how to do this part, im thinking locking the user in to only type the first word on screen
  // but i would rather have the user be able to type whatever word they see on screen
  // im thinking about adding those pop/shift words into another array
  // and then have a document event listener to listen to keyboard keydown
  // those key down will be pushed into a seperate array or turned into a string

  // then that array or string will be compared to see if there is a match inside the pop/shift words array
  // if there is a match then it will slice and remove that index from the word array
  // then it will remove the word element from the dom somehow
  // maybe can remove based on the node list inner text === to the word or something
  // and clear the string/array for the next word

  // store the popped words into array
  // find index of current word popped
  // use that index for the node list of game screen and remove it

  // I also would like the to have the word being typed highlight the current letters that have been typed
  // on the matched word but im not sure how to do that part

  //   remove word from game screen
  // store the popped words into array
  // find index of current word popped
  // use that index for the node list of game screen and remove it
  _removeWord(index) {
    const gameScreenChildren = this.el.gameScreen.children.length;

    if (gameScreenChildren > 2) {
      // we need to also splice the array so the index matches with node list
      this.el.gameScreen.children[index + 2].remove();
      this._removeWordArray(index);
    }
  }

  _removeWordArray(index) {
    this.wordsOnScreen.splice(index, 1);
  }
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
