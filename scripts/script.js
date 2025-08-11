import { shuffleCards, defaultWords } from "./defaultWords.js";
class Game {
  constructor() {
    this.default = defaultWords;
    this.sound = new Sound();
    this.score = 0;
    this.lives = 1;
    this.hiScore = JSON.parse(localStorage.getItem("hiscore"));
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
    this._elementSelectors();
    this.gameInterval;
    this._updateHiScore();
    this._clickEvents();
  }

  // set game element selectors
  _elementSelectors() {
    this.el = {};
    // start screen
    this.el.startBtn = document.querySelector(".start-btn");
    this.el.titleContent = document.querySelector(".title-content");
    this.el.titleImg = document.querySelector("#game-screen img");
    this.el.gameScreen = document.querySelector("#game-screen");

    // score container
    this.el.livesContainer = document.querySelector("#lives");
    this.el.numOfLives = document.querySelector(".num-of-lives");
    this.el.currentScore = document.querySelector("#score .score");
    this.el.hiScore = document.querySelector("#high-score .score");

    // lose-screen
    this.el.loseScreen = document.querySelector(".lose-screen");
    this.el.home = document.querySelector(".home");
    this.el.playAgain = document.querySelector(".play-again");
    this.el.finalScore = document.querySelector(".final-score span");

    // loading
    this.el.loadingScreen = document.querySelector(".loading");

    // current word span
    this.el.currentWordContainer = document.querySelector(".current-word");
    this.el.currentWord = document.querySelector(".current-word span");
  }

  // initializes game click events
  _clickEvents() {
    this.el.startBtn.addEventListener("click", () => this._gameFlow());

    this.el.home.addEventListener("click", () => this._setTitleScreen());
    this.el.playAgain.addEventListener("click", () =>
      this._setPlayAgainScreen()
    );
  }

  // gets word from api
  // if api fails resorts to default imported word list
  _getWordsApi(amount = 500) {
    const wordUrl = `https://random-word-api.vercel.app/api?words=${amount}`;

    const getData = async () => {
      try {
        const response = await fetch(wordUrl);

        const data = await response.json();

        this.masterArray = [...data];

        setTimeout(() => {
          this.el.loadingScreen.style.display = "none";
        }, 2000);
      } catch (error) {
        alert("Could not grab new words, using default words");

        setTimeout(() => {
          this.el.loadingScreen.style.display = "none";
        }, 2000);

        const shuffled = shuffleCards(defaultWords);
        this.masterArray = [...shuffled];

        console.error(error);
      }
    };

    getData();
  }

  // sets loading screen
  _setLoadScreen() {
    this._updateHiScore();
    this._setLivesDisplay();
    this._updateCurrentScore();
    this.el.titleImg.style.display = "none";
    this.el.titleContent.style.display = "none";
    this.el.loadingScreen.style.display = "flex";
    this.el.currentWordContainer.style.display = "block";
    this.el.currentWord.innerHTML = "";

    this.el.livesContainer.style.display = "block";
  }

  // set play again screen
  _setPlayAgainScreen() {
    this._resetGame();
    this.el.loseScreen.style.display = "none";
    this.el.currentWord.innerHTML = "";
    this._gameFlow();
  }

  // remove all word elements from dom
  _removeAllWords() {
    const words = document.querySelectorAll(".word");

    words.forEach((word) => {
      console.log(word);
      word.remove();
    });
  }

  // sets title screen elements
  _setTitleScreen() {
    this.el.titleContent.style.display = "flex";
    this.el.loseScreen.style.display = "none";
    this.el.currentWordContainer.style.display = "none";

    this.el.livesContainer.style.display = "none";
    this._resetGame();

    this._updateCurrentScore();
  }

  // sets gameflow
  _gameFlow() {
    // loading screen to allow api to get words
    // once api finishes load the game
    // load the player keydown

    this._setLoadScreen();
    this._getWordsApi();
    this._playerKeydown();
    this.gameInterval = setInterval(this._addWordsInterval, 3000);
  }

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

    this.coords.x = randomX;
    this.coords.y = randomY;
  }

  // creates random num
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

  // clears letters from letter filter
  _clearLetterFilter() {
    const wordList = document.querySelectorAll(".word span");

    wordList.forEach((word) => {
      word.innerHTML = word.textContent;
    });
  }

  // finds index if word is in the on screen words
  _findWordIndex(word) {
    const index = this.wordsOnScreen.indexOf(word);

    if (index >= 0) {
      this.playerInput = "";
      this.el.currentWord.innerText = "";
      this._clearLetterFilter();
      return index;
    }
  }

  // main game element
  // takes key input from user into string
  // if the string matches a word in the array
  // remove it and increase game score
  _playerKeydown() {
    this._keydown = this._keydown = (e) => {
      const letter = e.key;
      const length = e.key.length;
      this.sound.playSound();

      const isLetter = this.regex.test(letter);

      if (letter === "Backspace") {
        this.playerInput = this.playerInput.slice(
          0,
          this.playerInput.length - 1
        );
        this.el.currentWord.innerHTML = this.playerInput;
      }

      if (isLetter && length === 1) {
        this.playerInput += letter;
        this.el.currentWord.innerHTML = this.playerInput;
      }

      this._letterFilter();

      const index = this._findWordIndex(this.playerInput);

      if (index >= 0) {
        this._removeWord(index);

        this._increaseScore();
        this._updateCurrentScore();
      }
    };

    window.addEventListener("keydown", this._keydown);
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

    // removes the word once the overlay animation ends
    overlay.addEventListener("animationend", () => {
      console.log("i have ended");
      wordBg.remove();
      this.wordsOnScreen.shift();

      this._removeLife();
      this._setLivesDisplay();

      if (this.lives <= 0) {
        this._gameLost();
      }
    });

    return wordBg;
  }

  // updates the animation duration for each word element
  _setWordTimer(time) {
    const overlay = document.querySelectorAll(".overlay");

    overlay.forEach((item) => {
      item.style.animationDuration = time;
    });
  }

  // changes interval and animation duration for word elements
  _changeWordTimes(interval, seconds) {
    this._changeInterval(interval);
    this._setWordTimer(seconds);
  }

  // removes word from master array
  // adds it to words on screen
  // places word
  // changes difficulty as master length decreases
  _addWordsInterval = () => {
    const poppedWord = this.masterArray.pop();
    this.wordsOnScreen.push(poppedWord);
    this._placeWord(poppedWord);

    const arrayLength = this.masterArray.length;

    if (arrayLength <= 500 && arrayLength >= 490) {
      this._changeWordTimes(3000, "20s");
    } else if (arrayLength >= 470) {
      this._changeWordTimes(1800, "16s");
    } else {
      this._changeWordTimes(1300, "12s");
    }
  };

  // changes interval
  _changeInterval(time) {
    clearInterval(this.gameInterval);

    this.gameInterval = setInterval(this._addWordsInterval, time);
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

  // remove words based on array index where words were typed
  _removeWord(index) {
    const gameScreenChildren = this.el.gameScreen.children.length;
    const permanentItems = 4;

    if (gameScreenChildren > permanentItems) {
      // we need to also splice the array so the index matches with node list
      this.el.gameScreen.children[index + permanentItems].remove();
      this._removeWordArray(index);
    }
  }

  // remove words from array
  _removeWordArray(index) {
    this.wordsOnScreen.splice(index, 1);
  }

  // increase score
  _increaseScore() {
    this.score += 100;

    this._setHiScore();
  }

  // updates current score
  _updateCurrentScore() {
    this.el.currentScore.innerHTML = this.score;
  }

  // updates hiscore
  _updateHiScore() {
    this.el.hiScore.innerText = this.hiScore;
  }

  // get the hiscore from local
  // if current score > hiscore
  // update hiscore
  // set hiscore
  _setHiScore() {
    if (this.score >= this.hiScore) {
      this.hiScore = this.score;

      this._updateHiScore();
      localStorage.setItem("hiscore", JSON.stringify(this.hiScore));
    }
  }

  // remove life
  _removeLife() {
    this.lives--;
  }

  _setLivesDisplay() {
    this.el.numOfLives.innerHTML = this.lives;
  }

  // set lose screens
  _gameLost() {
    this._removeAllWords();
    this._endgame();
    this.el.loseScreen.style.display = "flex";
    this.el.finalScore.innerText = this.score;
  }

  // removes all words and event listener
  // clears intervals
  _endgame() {
    window.removeEventListener("keydown", this._keydown);
    clearInterval(this.gameInterval);
  }

  // resets game values so user can play again
  _resetGame() {
    this.score = 0;
    this.lives = 3;
    this.masterArray = [];
    this.wordsOnScreen = [];
    this.playerInput = "";
    clearInterval(this.gameInterval);
  }
}

// sound class
// plays a keyboard click sound when called
class Sound {
  playSound() {
    const audio = new Audio("../assets/keyboard-click.mp3");

    audio.play();
  }
}

const game = new Game();
