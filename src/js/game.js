import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.querySelector("#logo");

let triesLeft;
let winCount

const createPlaceholdersHtml = () => {
  const word = sessionStorage.getItem("word");

  const wordArray = Array.from(word);
  const placeholdersHtml = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  );
  return `<div id ="placeholders" class="placeholders-wrapper">${placeholdersHtml}</div>`;
};

const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHtml = KEYBOARD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class="main-button keyboard-button" id="${curr}">${curr}</button>`
    );
  }, "");

  keyboard.innerHTML = keyboardHtml;
  return keyboard;
};

const createHangImg = () => {
  const img = document.createElement("img");
  img.src = "images/hg-0.png";
  img.alt = "hangman image";
  img.classList.add("hangman-img");
  img.id = "hangman-img";

  return img;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const lowerLetter = letter.toLowerCase();

  // no letter in string

  if (!word.includes(lowerLetter)) {
    const triesCounter = document.querySelector("#tries-left");
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.querySelector("#hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame('lose')
    }
    //  letter is in string
  } else {
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === lowerLetter) {
        winCount +=1
        if (winCount === word.length) {
          stopGame('win')
          return
        }
        document.querySelector(`#letter_${i}`).innerText = lowerLetter.toUpperCase();
      }
    });
  }
};
const stopGame = (status) => {
  document.querySelector("#placeholders").remove();
  document.querySelector("#tries").remove();
  document.querySelector("#keyboard").remove();
  document.querySelector("#quit").remove();
  const word = sessionStorage.getItem("word");
  if (status === "win") {
    document.querySelector("#hangman-img").src = "images/hg-win.png";
    document.querySelector("#game").innerHTML +=
      '<h2 class="result-header win">You won!</h2>';
  } else if (status === "lose") {
    document.querySelector("#game").innerHTML +=
      '<h2 class="result-header lose">You lost :(</h2>';
  }
  else if (status === "quit") {
    logoH1.classList.remove('logo-small')
    document.querySelector("#hangman-img").remove()
  }

  document.querySelector(
    "#game"
  ).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="main-button px-5 py-2 mt-5">Play again</button>`;
  document.querySelector('#play-again').onclick = startGame
};
export const startGame = () => {
  triesLeft = 10;
  winCount = 0

  logoH1.classList.add("logo-small");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);

  gameDiv.innerHTML = createPlaceholdersHtml();

  gameDiv.innerHTML +=
    '<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10</span></p>';
  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  const hangmanImg = createHangImg();
  gameDiv.prepend(hangmanImg);
  gameDiv.appendChild(keyboardDiv);
  gameDiv.insertAdjacentHTML('beforeend', '<button id="quit" class="quit-button px-2 py-1 mt-4">Quit</button>')
  document.querySelector('#quit').onclick = () => {
    const isQuit = confirm('Are you shure yoy=u want to quit and lose progress?')
    if (isQuit) {
      stopGame('quit')
    }
    
  }
};
