//TODOs
//Fix where gamesPlayed is added and subtracted

// Import arrays of solutions and start positions
import { SOLUTIONS } from "./storedArrayofArraysOfWords.js";
import { SPUNSOLUTIONS } from "./storedArrayofArraysOfWords.js";

// Global variables
const body = document.querySelector("body");
const main = document.querySelector("main");
const stats = document.querySelector("#stats")

// for spinning letters
let zerothRing = [];
let innerRing = [];
let middleRing = [];
let outerRing = [];
const letters = [zerothRing, innerRing, middleRing, outerRing];
const degrees = [300, 0, 60, 120, 180, 240];
const animateCounterClockwise = [330, 30, 90, 150, 210, 270];
const animateClockwise = [270, 330, 30, 90, 150, 210];
const layers = ["outer", "middle", "inner", "zeroth"];
const rings = [];
let direction;
let animatedDegree;

// for updating score
let ring = 0;
let spins = 0;
let checks = 0;
let timeDisplay = "00:00:00";
let elapsedTimeInSeconds = 0;
let carriedTime = 0;
let won = false;
let wonThisOpening = false;
let sharable = false;

// for data storage
let playedBefore = false;
let gamesPlayed = 0;
let gamesPlayedArray = [];
let gamesWon = [];
let gamesWonSoFar = [];
let positions = [];
const havePlayedBefore = localStorage.getItem("playedBefore");
const previousGamesPlayed = localStorage.getItem("gamesPlayed");
const previousGamesPlayedArray = localStorage.getItem("gamesPlayedArray");
const previousGamesWon = localStorage.getItem("gamesWon");
const runningPostions = localStorage.getItem("positions");
const runningSpins = localStorage.getItem("spins");
const runningChecks = localStorage.getItem("checks");
const runningTime = localStorage.getItem("time");

// Checks for stored data and updates global variables accordingly
if (havePlayedBefore) {
  playedBefore = true;
}
if (previousGamesPlayed) {
  gamesPlayed = JSON.parse(previousGamesPlayed) + 1;
} else {
  gamesPlayed = 1;
}
if (previousGamesPlayedArray) {
  gamesPlayedArray = gamesPlayedArray.concat(
    JSON.parse(previousGamesPlayedArray)
  );
}

if (previousGamesWon) {
  gamesWonSoFar = gamesWon.concat(JSON.parse(previousGamesWon));
}

// for chosing today's words and time to tomorrow, learned from MDN
const zeroDate = new Date("July 10, 2023");
const todaysDate = new Date();
const todaysIndex = Math.floor(
  (todaysDate.getTime() - zeroDate.getTime()) / (1000 * 60 * 60 * 24)
);
const tomorrow = new Date(todaysDate.getTime() + 1000 * 60 * 60 * 24);
const midnightTomorrow = new Date(
  tomorrow.getFullYear(),
  tomorrow.getMonth(),
  tomorrow.getDate()
);

if (gamesWonSoFar.includes(todaysIndex)) {
  won = true;
  gamesPlayed--;
  if (runningPostions) {
    positions = JSON.parse(JSON.stringify(SOLUTIONS[todaysIndex]));
  }
  if (runningSpins) {
    spins = JSON.parse(runningSpins);
  }
  if (runningChecks) {
    checks = JSON.parse(runningChecks);
  }
  if (runningTime) {
    carriedTime = JSON.parse(runningTime);
  }
} else if (
  !gamesWonSoFar.includes(todaysIndex) &&
  gamesPlayedArray.includes(todaysIndex)
) {
  gamesPlayed--;
  if (runningPostions) {
    positions = positions.concat(JSON.parse(runningPostions));
  }
  if (runningSpins) {
    spins = JSON.parse(runningSpins);
  }
  if (runningChecks) {
    checks = JSON.parse(runningChecks);
  }
  if (runningTime) {
    carriedTime = JSON.parse(runningTime);
  }
}

if (
  !gamesPlayedArray.includes(todaysIndex) &&
  gamesWonSoFar.includes(todaysIndex - 1)
) {
  gamesPlayedArray.unshift(todaysIndex);
  const gamesPlayedArrayNow = JSON.stringify(gamesPlayedArray);
  localStorage.setItem("gamesPlayedArray", gamesPlayedArrayNow);
  localStorage.removeItem("postions");
  localStorage.removeItem("spins");
  localStorage.removeItem("checks");
  localStorage.removeItem("time");
} else if (
  !gamesPlayedArray.includes(todaysIndex) &&
  !gamesWonSoFar.includes(todaysIndex - 1)
) {
  localStorage.clear();
  gamesPlayedArray.unshift(todaysIndex);
  const gamesPlayedArrayNow = JSON.stringify(gamesPlayedArray);
  localStorage.setItem("gamesPlayedArray", gamesPlayedArrayNow);
  gamesPlayed = 1;
  playedBefore = false;
}

const gamesPlayedNow = JSON.stringify(gamesPlayed);
localStorage.setItem("gamesPlayed", gamesPlayedNow);

// for timer
let timerInterval;
let startTime;
const startTimer = () => {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
};
const updateTimer = () => {
  const currentTime = new Date().getTime();
  if (carriedTime === 0) {
    elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
  } else {
    elapsedTimeInSeconds = Math.floor(
      (currentTime - startTime) / 1000 + carriedTime
    );
  }

  const hoursTimer = Math.floor(elapsedTimeInSeconds / 3600);
  const minutesTimer = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const secondsTimer = Math.floor(elapsedTimeInSeconds % 60);

  hoursCounterTimer.innerHTML = String(hoursTimer).padStart(2, "0");
  minutesCounterTimer.innerHTML = String(minutesTimer).padStart(3, ":0");
  secondsCounterTimer.innerHTML = String(secondsTimer).padStart(3, ":0");
  timeDisplay = timer.innerText;
  score.innerHTML = `Spins: ${spins} </br> </br> Checks: ${checks} </br> </br> Time: ${timeDisplay} </br> </br> Games Played: ${gamesPlayed}`;
  const elapsedTime = JSON.stringify(elapsedTimeInSeconds);
  localStorage.setItem("time", elapsedTime);
};
const stopTimer = () => {
  clearInterval(timerInterval);
  timeDisplay = timer.innerText;
};
window.addEventListener("load", () => {
  if (!won) {
    startTimer();
  }
});

// Rounds averages to nearest hundredth
// Copied with slight modification from https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
const round = (num) => {
  let p = Math.pow(10, 2);
  let n = (num * p).toPrecision(15);
  return Math.round(n) / p;
};

// Copies todays score to clipboard, learned from MDN
let todaysScore = "";
const copyTodaysScore = () => {
  todaysScore = `#Spinensky ${todaysIndex}\n\nSpins: ${spins}\nChecks: ${checks}\nTime: ${timeDisplay}\n\nhttps://dansinensky.github.io/spinensky/`;
  navigator.clipboard.writeText(todaysScore);
};

const nav = document.createElement("nav")
nav.className = "navbar bg-body-light"
const navContainer = document.createElement("div")
navContainer.className = "container-fluid"
nav.appendChild(navContainer)
const timer = document.createElement("a")
timer.className = "timer text-black"
const hoursCounterTimer = document.createElement("span");
hoursCounterTimer.setAttribute("id", "hours-timer");
timer.appendChild(hoursCounterTimer);
const minutesCounterTimer = document.createElement("span");
minutesCounterTimer.setAttribute("id", "minutes-timer");
timer.appendChild(minutesCounterTimer);
const secondsCounterTimer = document.createElement("span");
secondsCounterTimer.setAttribute("id", "seconds-timer");
timer.appendChild(secondsCounterTimer);
if (carriedTime !== 0) {
  const hoursTimer = Math.floor(carriedTime / 3600);
  const minutesTimer = Math.floor((carriedTime % 3600) / 60);
  const secondsTimer = Math.floor(carriedTime % 60);
  hoursCounterTimer.innerHTML = String(hoursTimer).padStart(2, "0");
  minutesCounterTimer.innerHTML = String(minutesTimer).padStart(3, ":0");
  secondsCounterTimer.innerHTML = String(secondsTimer).padStart(3, ":0");
  timeDisplay = timer.innerText;
} else {
  hoursCounterTimer.innerHTML = String(0).padStart(2, "0");
  minutesCounterTimer.innerHTML = String(0).padStart(3, ":0");
  secondsCounterTimer.innerHTML = String(0).padStart(3, ":0");
  timeDisplay = timer.innerText;
}
navContainer.appendChild(timer)
const title = document.createElement("a")
title.innerHTML = "Spinensky"
title.className = "title text-black"
navContainer.appendChild(title)
const dropdown = document.createElement("div")
dropdown.className = "dropdown"
dropdown.setAttribute("data-bs-theme", "light")
navContainer.appendChild(dropdown)
const menuButton = document.createElement("button")
menuButton.className = "btn btn-dark dropdown-toggle"
menuButton.setAttribute("type", "button")
menuButton.setAttribute("data-bs-toggle", "dropdown")
menuButton.setAttribute("aria-expanded", "false")
menuButton.innerHTML = "Menu"
dropdown.appendChild(menuButton)
const menuOptions = document.createElement("ul")
menuOptions.className = "dropdown-menu"
const infoLI = document.createElement("li")
menuOptions.appendChild(infoLI)
const infoA = document.createElement("a")
infoA.className = "dropdown-item"
infoA.setAttribute("data-bs-toggle", "modal")
infoA.setAttribute("data-bs-target", "#info-modal")
infoA.innerHTML = "Info"
infoLI.appendChild(infoA)
const statsLI = document.createElement("li")
menuOptions.appendChild(statsLI)
const statsA = document.createElement("a")
statsA.className = "dropdown-item"
statsA.setAttribute("data-bs-toggle", "modal")
statsA.setAttribute("data-bs-target", "#stats-modal")
statsA.innerHTML = "Stats"
statsLI.appendChild(statsA)
dropdown.appendChild(menuOptions)
body.prepend(nav)

const infoModal = document.createElement("div")
infoModal.className = "modal fade"
infoModal.setAttribute("id", "info-modal")
infoModal.setAttribute("tabindex", "-1")
const infoModalDialog = document.createElement("div")
infoModalDialog.className = "modal-dialog"
infoModal.appendChild(infoModalDialog)
const infoModalContent = document.createElement("div")
infoModalContent.className = "modal-content"
infoModalDialog.appendChild(infoModalContent)
const infoModalHeader = document.createElement("div")
infoModalHeader.className = "modal-header"
infoModalContent.appendChild(infoModalHeader)
const infoModalTitle = document.createElement("h5")
infoModalTitle.className = "modal-title"
infoModalTitle.innerHTML = "Info"
infoModalHeader.appendChild(infoModalTitle)
const infoModalButton = document.createElement("button")
infoModalButton.className = "btn-close"
infoModalButton.setAttribute("type", "button")
infoModalButton.setAttribute("data-bs-dismiss", "modal")
infoModalButton.setAttribute("aria-label", "Close")
infoModalHeader.appendChild(infoModalButton)
const infoModalBody = document.createElement("div")
infoModalBody.className = "modal-body position-relative"
infoModalBody.innerHTML = '<p>Rotate the three rings of six letters to spell six four-letter words from left to right (three end with the center letter and three start with the center letter). Select one of the three rings of six letters by clicking the corresponding button, then click the "Check" button to determine if it is in the right position or how many positions that ring is off by.</p><p>After selecting a ring, rotate the letters in it either clockwise or clockwise by clicking the respective button. Click it once for every time you want to rotate the letters.</p><p>When all of the letters are in the correct position and six words are spelled out, clicking the "Check" button will give a winning score with the number of Checks and Spins performed and how long it took to win. The countdown shows how long until midnight when the new Spinensky is available to play. Click the "Copy score to clipboard" button so you can paste your score in a message or social media post to share with friends!</p>'
infoModalContent.appendChild(infoModalBody)
const infoGIF = document.createElement("img")
infoGIF.setAttribute("src", "FullVideo.gif")
infoGIF.setAttribute("alt", "GIF of gameplay")
infoGIF.className = "d-block w-100"
infoModalContent.appendChild(infoGIF)
body.appendChild(infoModal)

const statsModal = document.createElement("div")
statsModal.className = "modal fade"
statsModal.setAttribute("id", "stats-modal")
statsModal.setAttribute("tabindex", "-1")
const statsModalDialog = document.createElement("div")
statsModalDialog.className = "modal-dialog"
statsModal.appendChild(statsModalDialog)
const statsModalContent = document.createElement("div")
statsModalContent.className = "modal-content"
statsModalDialog.appendChild(statsModalContent)
const statsModalHeader = document.createElement("div")
statsModalHeader.className = "modal-header"
statsModalContent.appendChild(statsModalHeader)
const statsModalTitle = document.createElement("h5")
statsModalTitle.className = "modal-title"
statsModalTitle.innerHTML = "Stats"
statsModalHeader.appendChild(statsModalTitle)
const statsModalButton = document.createElement("button")
statsModalButton.className = "btn-close"
statsModalButton.setAttribute("type", "button")
statsModalButton.setAttribute("data-bs-dismiss", "modal")
statsModalButton.setAttribute("aria-label", "Close")
statsModalHeader.appendChild(statsModalButton)
const statsModalBody = document.createElement("div")
statsModalBody.className = "modal-body position-relative"
statsModalContent.appendChild(statsModalBody)
const score = document.createElement("p");
score.className = "score";
score.innerHTML = `Spins: ${spins} </br> </br> Checks: ${checks} </br> </br> Time: ${timeDisplay} </br> </br> Games Played: ${gamesPlayed}`;
statsModalBody.appendChild(score)
const countdown = document.createElement("div");
countdown.className = "countdown";
const hoursCounter = document.createElement("span");
hoursCounter.setAttribute("id", "hours");
countdown.appendChild(hoursCounter);
const minutesCounter = document.createElement("span");
minutesCounter.setAttribute("id", "minutes");
countdown.appendChild(minutesCounter);
const secondsCounter = document.createElement("span");
secondsCounter.setAttribute("id", "seconds");
countdown.appendChild(secondsCounter);
statsModalBody.appendChild(countdown);
const shareAndTimer = () => {
  if (sharable === false) {
    const shareButton = document.createElement("button");
    shareButton.setAttribute("id", "share")
    shareButton.classList = "btn btn-dark share-button";
    shareButton.innerText = "Copy score to clipboard"
    statsModalBody.appendChild(shareButton);
    shareButton.addEventListener("click", copyTodaysScore)
    sharable = true;
  }
  // Function to update the countdown clock
  function updateClock() {
    const { hours, minutes, seconds } = timeToNewGame();

    hoursCounter.innerHTML = String(hours).padStart(2, "0");
    minutesCounter.innerHTML = String(minutes).padStart(3, ":0");
    secondsCounter.innerHTML = String(seconds).padStart(3, ":0");

    if (hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(countdownInterval);
    }
  }

  // Update the countdown immediately and then every 1 second
  updateClock();
  const countdownInterval = setInterval(updateClock, 1000);

  // Function to calculate time to new game
  function timeToNewGame() {
    const timeRemaining = midnightTomorrow.getTime() - new Date().getTime();
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    return {
      total: timeRemaining,
      hours,
      minutes,
      seconds,
    };
  }
}
if (won === true) {
  shareAndTimer()
}
body.appendChild(statsModal)

// Chooses today's solution and start positions
// Modeled off of lesson on local storage
const solution = JSON.parse(JSON.stringify(SOLUTIONS[todaysIndex]));
const importLetters = JSON.parse(JSON.stringify(SPUNSOLUTIONS[todaysIndex]));

if (positions.length === 0) {
  positions = importLetters;
}

let carriedFromYesterdayCounter = 0;
for (let i = 0; i < letters.length; i++) {
  const todaysI = JSON.parse(JSON.stringify(positions[i]));
  const yesterdaysI = JSON.parse(
    JSON.stringify(SPUNSOLUTIONS[todaysIndex - 1][i])
  );
  console.log(todaysI, yesterdaysI);
  if (todaysI.sort().join(",") === yesterdaysI.sort().join(",")) {
    carriedFromYesterdayCounter++;
    console.log("played yesterday, haven't played yet today");
  }
}

if (carriedFromYesterdayCounter === 4) {
  localStorage.removeItem("postions");
  localStorage.removeItem("spins");
  localStorage.removeItem("checks");
  localStorage.removeItem("time");
  positions = [];
  spins = 0;
  checks = 0;
  elapsedTimeInSeconds = elapsedTimeInSeconds - carriedTime;
  carriedTime = 0;
}

console.log(positions.length);
// Updates common variable for today's start positions
for (let i = 0; i < letters.length; i++) {
  for (let j = 0; j < solution[i].length; j++) {
    if (positions.length === 0) {
      letters[i][j] = importLetters[i][j];
      console.log("positions.length === 0");
    } else if (won === true) {
      letters[i][j] = SOLUTIONS[todaysIndex][i][j];
      console.log("won === true");
    } else {
      letters[i][j] = positions[i][j];
      console.log("else");
    }
  }
  if (won === true) {
    const thisRing = letters[i];
    const correction = Math.round(thisRing.length / 2);
    const rotatedRing = thisRing.splice(
      correction,
      thisRing.length - correction
    );
    const newRing = [];
    for (let j = 0; j < rotatedRing.length; j++) {
      newRing.push(rotatedRing[j]);
    }
    for (let j = 0; j < thisRing.length; j++) {
      newRing.push(thisRing[j]);
    }
    letters[i] = newRing;
  }
}

// Makes DOM element for first ring that contains other rings and letter
const outerRingElement = document.createElement("div");
outerRingElement.className = "ring spinny";
outerRingElement.setAttribute("id", `${layers[0]}`);
rings.unshift(outerRingElement);
main.appendChild(outerRingElement);

// Makes DOM elements for rings besides outermost ring
for (let i = 1; i < layers.length; i++) {
  const layer = document.createElement("div");
  layer.className = "ring spinny";
  layer.setAttribute("id", layers[i]);
  rings.push(layer);
  rings[i - 1].appendChild(layer);
}

// Makes DOM element for central letter
let center = document.createElement("a");
center.className = "center";
rings[0].append(center);
center.innerText = zerothRing[0].toUpperCase();

// Makes DOM elements for all other letters, including empty keyframes
// Modeled off of code on how to make wordle from https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
for (let i = 1; i < letters.length; i++) {
  const ring = `ring-${i}-letter`;
  for (let j = 0; j < degrees.length; j++) {
    const degree = degrees[j];
    const letter = document.createElement("a");
    letter.className = `deg${degree}-${i} deg${degree} ${ring} spinny`;
    letter.innerHTML = letters[i][j].toUpperCase();
    rings[0].append(letter);
    animatedDegree = animateCounterClockwise[j];
    const animatedLetter = document.createElement("a");
    animatedLetter.className = `deg${animatedDegree}-${i} deg${animatedDegree} ${ring} spinny`;
    animatedLetter.innerHTML = "";
    rings[0].append(animatedLetter);
  }
}

const ringSelectorDiv = document.createElement("div")
ringSelectorDiv.className = "ring-selector-div"
const innerButton = document.createElement("button")
innerButton.className = "btn btn-dark ring-button"
innerButton.setAttribute("type", "button")
innerButton.setAttribute("id", "inner-button")
innerButton.innerText = "Inner Ring"
ringSelectorDiv.appendChild(innerButton)
const middleButton = document.createElement("button")
middleButton.className = "btn btn-dark ring-button"
middleButton.setAttribute("type", "button")
middleButton.setAttribute("id", "middle-button")
middleButton.innerText = "Middle Ring"
ringSelectorDiv.appendChild(middleButton)
const outerButton = document.createElement("button")
outerButton.className = "btn btn-dark ring-button"
outerButton.setAttribute("type", "button")
outerButton.setAttribute("id", "outer-button")
outerButton.innerText = "Outer Ring"
ringSelectorDiv.appendChild(outerButton)
main.appendChild(ringSelectorDiv)
const directionDiv = document.createElement("div")
directionDiv.className = "direction-div"
const counterClockwiseButton = document.createElement("button")
counterClockwiseButton.className = "btn btn-dark spin-button"
counterClockwiseButton.setAttribute("type", "button")
counterClockwiseButton.setAttribute("id", "counterclockwise-button")
counterClockwiseButton.innerText = "Counterclockwise"
directionDiv.appendChild(counterClockwiseButton)
const clockwiseButton = document.createElement("button")
clockwiseButton.className = "btn btn-dark spin-button"
clockwiseButton.setAttribute("type", "button")
clockwiseButton.setAttribute("id", "clockwise-button")
clockwiseButton.innerText = "Clockwise"
directionDiv.appendChild(clockwiseButton)
main.appendChild(directionDiv)
const ringCheckedDiv = document.createElement("div")
ringCheckedDiv.className = "ring-checked-div"
ringCheckedDiv.innerHTML = `<div class="ring-title-and-checked"><h3><span id="ring-title">Select a</span> ring</h3><p id="checked"> </p></div></br><p class="spins-and-checks">Spins: <span id="spins">${spins}</span> Checks: <span id="checks">${checks}</span></p>` 
main.appendChild(ringCheckedDiv)
const checkDiv = document.createElement("div")
checkDiv.className = "check-div"
main.appendChild(checkDiv)
const checkButton = document.createElement("button")
checkButton.className = "btn btn-dark check-button"
checkButton.setAttribute("type", "button")
checkButton.setAttribute("id", "check")
if (won === true) {
  checkButton.setAttribute("data-bs-toggle", "modal");
  checkButton.setAttribute("data-bs-target", "#stats-modal");
}
checkButton.innerText = "Check"
checkDiv.appendChild(checkButton)

if (playedBefore === false) {
  const tempButton = document.createElement("div")
  tempButton.setAttribute("data-bs-toggle", "modal")
  tempButton.setAttribute("data-bs-target", "#info-modal")
  main.appendChild(tempButton)
  tempButton.click()
  tempButton.remove()
  playedBefore = true;
  const setPlayedBefore = JSON.stringify(playedBefore);
  localStorage.setItem("playedBefore", setPlayedBefore);
}

const setRing = (e) => {
  if (e.target.getAttribute("id") === "inner-button") {
    ring = 1;
  } else if (e.target.getAttribute("id") === "middle-button") {
    ring = 2;
  } else if (e.target.getAttribute("id") === "outer-button") {
    ring = 3;
  }

  ring_title.innerHTML = `${
    layers[3 - ring].charAt(0).toUpperCase() + layers[3 - ring].slice(1)
  }`;
  checked.innerHTML = "";
};

// Selects all DOM element needed to update spins and checks in events
const ring_title = document.querySelector("#ring-title");
const spinsText = document.querySelector("#spins");
const checksText = document.querySelector("#checks");

// Creates a pause
// Copied from https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const spin = (d) => {
  checked.innerHTML = "";
  if (direction === "counterclockwise") {
    animatedDegree = animateCounterClockwise[d];
  } else if (direction === "clockwise") {
    animatedDegree = animateClockwise[d];
  }
  const degree = degrees[d];
  const letter = document.querySelector(`.deg${degree}-${ring}`);
  const animatedLetter = document.querySelector(
    `.deg${animatedDegree}-${ring}`
  );
  letter.innerHTML = "";
  animatedLetter.innerHTML = letters[ring][d].toUpperCase();
  setTimeout(() => {
    animatedLetter.innerHTML = "";
    letter.innerHTML = letters[ring][d].toUpperCase();
  }, 500);
};

// Resets rings and updates spin count once per button click
// stopPropagation learned from bubbling lesson
const spinFinish = (e) => {
  zerothRing = letters[0];
  innerRing = letters[1];
  middleRing = letters[2];
  outerRing = letters[3];
  positions = letters;
  if (won === false) {
    spins++;
    spinsText.innerText = spins;
    const madeSpins = JSON.stringify(spins);
    localStorage.setItem("spins", madeSpins);
    const currentPositions = JSON.stringify(positions);
    localStorage.setItem("positions", currentPositions);
  }
  score.innerHTML = `Spins: ${spins} </br> </br> Checks: ${checks} </br> </br> Time: ${timeDisplay} </br> </br> Games Played: ${gamesPlayed}`;
};

const spinCounterClockwise = (e) => {
  const firstLetter = letters[ring][0];
  letters[ring].shift();
  letters[ring].push(firstLetter);
  direction = "counterclockwise";
  for (let d = 0; d < degrees.length; d++) {
    spin(d);
  }
  spinFinish(e);
};

const spinClockwise = (e) => {
  const lastLetter = letters[ring][5];
  letters[ring].pop();
  letters[ring].unshift(lastLetter);
  direction = "clockwise";
  for (let d = 0; d < degrees.length; d++) {
    spin(d);
  }
  spinFinish(e);
};

// Selects DOM elements that update when checked
const checked = document.querySelector("#checked");

// Updates checks if the selected ring is not zero
const updateChecks = () => {
  if (ring !== 0) {
    checks++;
    checksText.innerText = checks;
    const madeChecks = JSON.stringify(checks);
    localStorage.setItem("checks", madeChecks);
    score.innerHTML = `Spins: ${spins} </br> </br> Checks: ${checks} </br> </br> Time: ${timeDisplay} </br> </br> Games Played: ${gamesPlayed}`;
  }
};

const checkRing = () => {
  if (won === false) {
    let right = true;
    for (let i = 1; i < letters.length; i++) {
      if (
        letters[i][0] !== solution[i][3] ||
        letters[i][1] !== solution[i][4] ||
        letters[i][2] !== solution[i][5] ||
        letters[i][3] !== solution[i][0] ||
        letters[i][4] !== solution[i][1] ||
        letters[i][5] !== solution[i][2]
      ) {
        right = false;
      }
    }
    if (right === true) {
      checked.innerHTML = "You win!";
      won = true;
      wonThisOpening = true;
      updateChecks();
    } else if (
      solution[ring][0] === letters[ring][0] &&
      solution[ring][1] === letters[ring][1] &&
      solution[ring][2] === letters[ring][2] &&
      solution[ring][3] === letters[ring][3] &&
      solution[ring][4] === letters[ring][4] &&
      solution[ring][5] === letters[ring][5] &&
      ring !== 0
    ) {
      checked.innerHTML = `is off by three`;
    } else if (
      (solution[ring][0] === letters[ring][1] &&
        solution[ring][1] === letters[ring][2] &&
        solution[ring][2] === letters[ring][3] &&
        solution[ring][3] === letters[ring][4] &&
        solution[ring][4] === letters[ring][5] &&
        solution[ring][5] === letters[ring][0] &&
        ring !== 0) ||
      (solution[ring][0] === letters[ring][5] &&
        solution[ring][1] === letters[ring][0] &&
        solution[ring][2] === letters[ring][1] &&
        solution[ring][3] === letters[ring][2] &&
        solution[ring][4] === letters[ring][3] &&
        solution[ring][5] === letters[ring][4] &&
        ring !== 0)
    ) {
      checked.innerHTML = `is off by two`;
    } else if (
      (solution[ring][0] === letters[ring][2] &&
        solution[ring][1] === letters[ring][3] &&
        solution[ring][2] === letters[ring][4] &&
        solution[ring][3] === letters[ring][5] &&
        solution[ring][4] === letters[ring][0] &&
        solution[ring][5] === letters[ring][1] &&
        ring !== 0) ||
      (solution[ring][0] === letters[ring][4] &&
        solution[ring][1] === letters[ring][5] &&
        solution[ring][2] === letters[ring][0] &&
        solution[ring][3] === letters[ring][1] &&
        solution[ring][4] === letters[ring][2] &&
        solution[ring][5] === letters[ring][3] &&
        ring !== 0)
    ) {
      checked.innerHTML = `is off by one`;
    } else if (
      solution[ring][0] === letters[ring][3] &&
      solution[ring][1] === letters[ring][4] &&
      solution[ring][2] === letters[ring][5] &&
      solution[ring][3] === letters[ring][0] &&
      solution[ring][4] === letters[ring][1] &&
      solution[ring][5] === letters[ring][2] &&
      ring !== 0
    ) {
      checked.innerHTML = `is right`;
    }
  }
  if (won === false) {
    updateChecks();
  }
  // Updates stored data
  if (won === true) {
    stopTimer();
    if (!gamesWonSoFar.includes(todaysIndex)) {
      gamesWonSoFar.unshift(todaysIndex);
      const gamesWonNow = JSON.stringify(gamesWonSoFar);
      localStorage.setItem("gamesWon", gamesWonNow);
    }
    // Creates pop-up with stats
    sleep(750).then(() => {
      score.innerHTML = `Spins: ${spins} </br> </br> Checks: ${checks} </br> </br> Time: ${timeDisplay} </br> </br> Games Played: ${gamesPlayed}`;
      if (checkButton.getAttribute("data-bs-target") !== "#stats-modal") {
        const tempButton = document.createElement("div")
        tempButton.setAttribute("data-bs-toggle", "modal")
        tempButton.setAttribute("data-bs-target", "#stats-modal")
        main.appendChild(tempButton)
        tempButton.click()
        tempButton.remove()
        checkButton.setAttribute("data-bs-toggle", "modal");
        checkButton.setAttribute("data-bs-target", "#stats-modal");
      }
    });
  }
  if (won === true) {
    shareAndTimer()
  }
};

counterClockwiseButton.addEventListener("click", spinCounterClockwise);
clockwiseButton.addEventListener("click", spinClockwise);
document.querySelectorAll(".ring-button").forEach((ringButton) => {
  ringButton.addEventListener("click", setRing);
});
checkButton.addEventListener("click", checkRing);
infoA.addEventListener("click", () => {
  playedBefore = true;
  const setPlayedBefore = JSON.stringify(playedBefore);
  localStorage.setItem("playedBefore", setPlayedBefore);
})