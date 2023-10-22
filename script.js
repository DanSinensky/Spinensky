// Import arrays of solutions and start positions
import { SOLUTIONS } from "./storedArrayofArraysOfWords.js";
import { SPUNSOLUTIONS } from "./storedArrayofArraysOfWords.js";

// Global variables
const body = document.querySelector("body")

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

// for spinning letters
let isDragging = false;
let startX;
let startY;
let dragElement = null;
let shiftX;
let shiftY;
let startPointerX;
let startPointerY;
let xAxis = 0;
let yAxis = 0;
let radius = 0;
let newRingX;
let newRingY;
let initialMouseX;
let initialMouseY;
let currentElement;
let deltaX;
let deltaY;
let newX;
let newY;

  // for making spin buttons
const turn = ["counterclockwise", "clockwise"];
const position = ["left", "top", "right", "bottom"];
const arrows = ["triangle-down", "triangle-left", "triangle-up", "triangle-right"];

// for making hamburger menu
const bars = ["bar1", "bar2", "bar3"];

  // for updating score
let ring = 0;
let spins = 0;
let checks = 0;
let timeDisplay = "00:00:00";
let elapsedTimeInSeconds = 0;
let won = false;

  // for data storage
let playedBefore = false;
let averageSpins = 0;
let averageChecks = 0;
let averageTime = 0;
let gamesPlayed = 0;
let gamesWon = [];
let gamesWonSoFar = [];
let positions = [];
console.log(positions)
const havePlayedBefore = localStorage.getItem("playedBefore");
const getAverageSpins = localStorage.getItem("averageSpins");
const getAverageChecks = localStorage.getItem("averageChecks");
const getAverageTime = localStorage.getItem("averageTime");
const previousGamesPlayed = localStorage.getItem("gamesPlayed");
const previousGamesWon = localStorage.getItem("gamesWon");
const runningPostions = localStorage.getItem("positions");
const runningSpins = localStorage.getItem("spins");
const runningChecks = localStorage.getItem("checks");
const runningTime = localStorage.getItem("time");

// Checks for stored data and updates global variables accordingly
// TODO - Save daily data (where letters were left if stopped playing before winning, if already won today, etc.)
if (havePlayedBefore) {
  playedBefore = true
}
if (getAverageSpins) {
  averageSpins = JSON.parse(getAverageSpins)
}
if (getAverageChecks) {
  averageChecks = JSON.parse(getAverageChecks)
}
if (getAverageTime) {
  averageTime = JSON.parse(getAverageTime)
}
if (previousGamesPlayed) {
  gamesPlayed = JSON.parse(previousGamesPlayed) + 1
} else {
  gamesPlayed = 1
}
const gamesPlayedNow = JSON.stringify(gamesPlayed)
localStorage.setItem("gamesPlayed", gamesPlayedNow)

if (previousGamesWon) {
  gamesWonSoFar = gamesWon.concat(JSON.parse(previousGamesWon))
}

// for timer
let timerInterval;
let startTime;
const startTimer = () => {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
};
const updateTimer = () => {
  const currentTime = new Date().getTime();
  elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);

  const hoursTimer = Math.floor(elapsedTimeInSeconds / 3600);
  const minutesTimer = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const secondsTimer = Math.floor(elapsedTimeInSeconds % 60);

  hoursCounterTimer.innerHTML = String(hoursTimer).padStart(2, '0');
  minutesCounterTimer.innerHTML = String(minutesTimer).padStart(3, ':0');
  secondsCounterTimer.innerHTML = String(secondsTimer).padStart(3, ':0');
  timeDisplay = timer.innerText
};
const stopTimer = () => {
  clearInterval(timerInterval);
  timeDisplay = timer.innerText
};
window.addEventListener('load', () => {
  if (!won) {
    startTimer();
  }
});

 // for chosing today's words and time to tomorrow, learned from MDN
const zeroDate = new Date('July 10, 2023');
const todaysDate = new Date();
const todaysIndex = Math.floor((todaysDate.getTime() - zeroDate.getTime()) / (1000 * 60 * 60 * 24));
const tomorrow = new Date(todaysDate.getTime() + (1000 * 60 * 60 * 24));
const midnightTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

// Rounds averages to nearest hundredth
// Copied with slight modification from https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
const round = num => {
  let p = Math.pow(10, 2);
  let n = (num * p).toPrecision(15);
  return Math.round(n) / p;
}


const averageCountdown = () => {
  const tempAverageTime = round((averageTime * previousGamesPlayed + elapsedTimeInSeconds) / gamesPlayed)
  const tempHours = Math.floor(tempAverageTime / 3600)
  const tempMinutes = Math.floor((tempAverageTime % 3600) / 60)
  const tempSeconds = Math.floor(tempAverageTime % 60)
  const tempDisplayHours = String(tempHours).padStart(2, '0')
  const tempDisplayMinutes = String(tempMinutes).padStart(3, ':0')
  const tempDisplaySeconds = String(tempSeconds).padStart(3, ':0')
  return `${tempDisplayHours}${tempDisplayMinutes}${tempDisplaySeconds}`
}

// Copies todays score to clipboard, learned from MDN
let todaysScore = ""
const copyTodaysScore = () => {
  todaysScore = `#Spinensky ${todaysIndex}\n\nSpins: ${spins}\nChecks: ${checks}\nTime: ${timeDisplay}\n\nhttps://dansinensky.github.io/spinensky/`
  navigator.clipboard.writeText(todaysScore)
}


// Generates DOM element with info about game, but only if first game
// TODO - make DRYer (a modal?)
const infoPopUp = document.createElement("section")
infoPopUp.className = "info-pop-up"
if (playedBefore === false) {
  infoPopUp.style.visibility = "visible"
}
const fakeHeader = document.createElement("div")
fakeHeader.className = "fake-header"
infoPopUp.appendChild(fakeHeader)
const emptyDiv = document.createElement("div")
emptyDiv.className = "empty-div"
fakeHeader.appendChild(emptyDiv)
const exit = document.createElement("button")
exit.innerText = "X"
exit.className = "exit"
fakeHeader.appendChild(exit)
const info = document.createElement("p")
info.className = "info"
info.innerHTML = `Spin rings of letters in order to unscramble four-letter words using as few spins as possible. The central letter is the last letter of the words on the left and the first letter of the words on the right. </br> </br> Click on a ring to select it, then spin it counterclockwise or clockwise by clicking the button with that symbol. Click "Check" to see how close that ring is to the correct position. </br> </br> If you click "Check" when all of the rings are in the correct position, you win! </br> </br> Have fun!`
infoPopUp.appendChild(info)
body.appendChild(infoPopUp)


const statsPopUp = document.createElement("section")
statsPopUp.className = "stats-pop-up"
const fakeHeader1 = document.createElement("div")
fakeHeader1.className = "fake-header"
statsPopUp.appendChild(fakeHeader1)
const emptyDiv1 = document.createElement("div")
emptyDiv1.className = "empty-div"
fakeHeader1.appendChild(emptyDiv1)
const exit1 = document.createElement("button")
exit1.innerText = "X"
exit1.className = "exit"
fakeHeader1.appendChild(exit1)
const score = document.createElement("p")
score.className = "score"
score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Time: ${timeDisplay} </br> Average Time: ${averageCountdown()} </br> </br> Games Played: ${gamesPlayed}`
statsPopUp.appendChild(score)
const countdown = document.createElement("div")
countdown.className = "countdown"
const hoursCounter = document.createElement("span")
hoursCounter.setAttribute("id", "hours")
countdown.appendChild(hoursCounter)
const minutesCounter = document.createElement("span")
minutesCounter.setAttribute("id", "minutes")
countdown.appendChild(minutesCounter)
const secondsCounter = document.createElement("span")
secondsCounter.setAttribute("id", "seconds")
countdown.appendChild(secondsCounter)
statsPopUp.appendChild(countdown)
body.appendChild(statsPopUp)

const updateScore = () => {
  score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Time: ${timeDisplay} </br> Average Time: ${averageCountdown()} </br> </br> Games Played: ${gamesPlayed}`
}
const averageInterval = setInterval(updateScore, 1000)

exit.addEventListener("click", e => {
  infoPopUp.style.visibility = "hidden"
  whole.style.display = "block"
})

exit1.addEventListener("click", e => {
  statsPopUp.style.visibility = "hidden"
  whole.style.display = "block"
})

  // Chooses today's solution and start positions
  // Modeled off of lesson on local storage
  const solution = JSON.parse(JSON.stringify(SOLUTIONS[todaysIndex]))
  const importLetters = JSON.parse(JSON.stringify(SPUNSOLUTIONS[todaysIndex]))

  // Updates common variable for today's start positions
  for (let i = 0; i < letters.length; i++){
    for (let j = 0; j < solution[i].length; j++){
      letters[i][j] = importLetters[i][j]
    }
  }

  // Creates main, but only displays if have played before
  const whole = document.createElement("main")
  if (playedBefore === true) {
    whole.style.display = "block"
  }
  body.appendChild(whole)
  // Creates dropdown menu
  const aside = document.createElement("aside")
  aside.innerHTML = `<ul><a class="information"><li>Info</li></a><a class="stats"><li>Stats</li></a><a class="settings"><li>Settings</li></a></ul>`
  aside.className = "hidden"
  whole.appendChild(aside)
  const information = document.querySelector(".information")
  // Generates DOM element with info about game identical to start DOM element
  // TODO - make DRYer (a modal?)
  information.addEventListener("click", e => {
    whole.style.display = "none"
    infoPopUp.style.visibility = "visible"
  })
  // Generates DOM element with stats for current game and running stats, identical to one generated on winning
  // TODO - make DRYer (a modal?)
  const stats = document.querySelector(".stats")
  stats.addEventListener("click", e => {
    whole.style.display = "none"
    statsPopUp.style.visibility = "visible"
  })
  // TODO - make settings popup that lets you play in dark mode, maybe other settings???
  const settings = document.querySelector(".settings")

  // Makes DOM element for first ring that contains other rings and letter
  const outerRingElement = document.createElement("div")
  outerRingElement.className = "ring spinny"
  outerRingElement.setAttribute("id", `${layers[0]}`);
  rings.unshift(outerRingElement)
  whole.appendChild(outerRingElement)

  // Makes header with title and hamburger menu
  const header = document.createElement("header")
  const title = document.createElement("h1")
  title.className = "title"
  title.innerText = "Spinensky"
  const hamburger = document.createElement("div")
  hamburger.className = "hamburger"
  const timer = document.createElement("div")
  timer.className = "timer"
  const hoursCounterTimer = document.createElement("span")
  hoursCounterTimer.setAttribute("id", "hours-timer")
  hoursCounterTimer.innerHTML = String(0).padStart(2, '0')
  timer.appendChild(hoursCounterTimer)
  const minutesCounterTimer = document.createElement("span")
  minutesCounterTimer.setAttribute("id", "minutes-timer")
  minutesCounterTimer.innerHTML = String(0).padStart(3, ':0')
  timer.appendChild(minutesCounterTimer)
  const secondsCounterTimer = document.createElement("span")
  secondsCounterTimer.setAttribute("id", "seconds-timer")
  secondsCounterTimer.innerHTML = String(0).padStart(3, ':0')
  timer.appendChild(secondsCounterTimer)
  header.appendChild(timer)
  whole.prepend(header)

  header.appendChild(title)
  header.appendChild(hamburger)
  bars.forEach(bar => {
    const newBar = document.createElement("div")
    newBar.className = bar
    hamburger.appendChild(newBar)
  })
hamburger.addEventListener("click", e => {
  hamburger.classList.toggle("change")
  aside.classList.toggle("hidden")
  })
  
  // Makes DOM elements for rings besides outermost ring
  for (let i = 1; i < layers.length; i++) {
    const layer = document.createElement("div")
    layer.className = "ring spinny"
    layer.setAttribute("id", layers[i])
    rings.push(layer)
    rings[i - 1].appendChild(layer)
  }

  // Makes DOM elements for information that will update during game
  const notes = document.createElement("div")
  notes.className = "notes"
  notes.innerHTML = '<div class="ring-title-and-checked"><h3><span id="ring-title">Click on a</span> ring</h3><p id="checked"> </p></div></br><p>Spins: <span id="spins">0</span> Checks: <span id="checks">0</span></p></br><div class="check-button"><button id="check">Check</button></div></br>'
  whole.appendChild(notes)

  // Makes DOM element for central letter
  let center = document.createElement("a")
  center.className = "center"
  rings[0].append(center)
  center.innerText = zerothRing[0].toUpperCase()
  
  radius = (outerRingElement.getBoundingClientRect().right - outerRingElement.getBoundingClientRect().left)/2
  yAxis = center.getBoundingClientRect().left + (center.getBoundingClientRect().right - center.getBoundingClientRect().left)/2
  xAxis = center.getBoundingClientRect().top + (center.getBoundingClientRect().bottom - center.getBoundingClientRect().top) / 2
  
console.log(xAxis, yAxis, radius)
  
// for resize
function set_body_size() {
  let w = window.innerWidth;
  let h = window.innerHeight;
  body.setAttribute("style", `width: ${w}; height: ${h}`);
  yAxis = center.getBoundingClientRect().left + (center.getBoundingClientRect().right - center.getBoundingClientRect().left)/2
  xAxis = center.getBoundingClientRect().top + (center.getBoundingClientRect().bottom - center.getBoundingClientRect().top) / 2
  console.log("Resize")
}

set_body_size();
window.addEventListener("resize", resizeThrottler, false);
var resizeTimeout;

function resizeThrottler() {
  // ignore resize events as long as a deferred execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(function () {
      resizeTimeout = null;
      set_body_size();
    }, 100);
  }
}

// Define a function that will be called when the screen scrolls
function handleScrollEvent() {
  yAxis = center.getBoundingClientRect().left + (center.getBoundingClientRect().right - center.getBoundingClientRect().left)/2
  xAxis = center.getBoundingClientRect().top + (center.getBoundingClientRect().bottom - center.getBoundingClientRect().top) / 2
  console.log("Scrolling...");
}

// Attach the scroll event listener to the window
window.addEventListener('scroll', handleScrollEvent);


  // Makes DOM elements for all other letters, including empty keyframes
  // Modeled off of code on how to make wordle from https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
  for (let i = 1; i < letters.length; i++) {
    const ring = `ring-${i}-letter`
    for (let j = 0; j < degrees.length; j++) {
      const degree = degrees[j]
      const letter = document.createElement("a")
      letter.className = `deg${degree}-${i} deg${degree} ${ring} spinny`
      letter.innerHTML = letters[i][j].toUpperCase()
      rings[0].append(letter)
      animatedDegree = animateCounterClockwise[j]
      const animatedLetter = document.createElement("a")
      animatedLetter.className = `deg${animatedDegree}-${i} deg${animatedDegree} ${ring} spinny`
      animatedLetter.innerHTML = ""
      rings[0].append(animatedLetter)
    }
  }

  // Makes container for spin buttons
  // const buttons = document.createElement("div")
  // buttons.className = "buttons"
  // whole.append(buttons)

  // Makes spin buttons
  // for (let i = 0; i < turn.length; i++) {
  //   const button = document.createElement("div")
  //   button.className = `button ${turn[i]}`
  //   buttons.appendChild(button)
  //   const tail = document.createElement("div")
  //   tail.className = `tail ${turn[i]}`
  //   button.appendChild(tail)
  //   const middle = document.createElement("div")
  //   middle.className = `middle ${turn[i]}`
  //   tail.appendChild(middle)
  //   const middleText = document.createElement("p")
  //   middleText.innerText = "Spin"
  //   middleText.className = "middle-text"
  //   middle.appendChild(middleText)
  //   for (let j = 0; j < position.length; j++) {
  //     const arrow = document.createElement("div")
  //     arrow.className = `arrow ${turn[i]} ${position[j]}`
  //     if (arrow.classList.contains("counterclockwise")) {
  //       arrow.classList.add(`${arrows[j]}`)
  //     } else if (arrow.classList.contains("clockwise")) {
  //       if (j < 2) {
  //         arrow.classList.add(`${arrows[j + 2]}`)
  //       } else if (j > 1) {
  //         arrow.classList.add(`${arrows[j - 2]}`)
  //       }
  //     }
  //     tail.appendChild(arrow)
  //   }
  // }

  // Adds event listener to all exit buttons for info and stat screens
    exit.addEventListener("click", e => {
      infoPopUp.style.zIndex = -1
      statsPopUp.style.zIndex = -2
      whole.style.display = "block"
      playedBefore = true
      const setPlayedBefore = JSON.stringify(playedBefore)
      localStorage.setItem("playedBefore", setPlayedBefore)
    })

// Selects all DOM element needed to update spins and checks in events
const ring_title = document.querySelector("#ring-title")
const counterclockwise = document.querySelectorAll('.counterclockwise');
const clockwise = document.querySelectorAll('.clockwise')
const spinsText = document.querySelector("#spins")
const checksText = document.querySelector("#checks")

// Creates a pause
// Copied from https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Updates letters with animation
const rotate = d => {
  checked.innerHTML = ""
  if (direction === turn[0]) {
    animatedDegree = animateCounterClockwise[d]
  } else if (direction === turn[1]) {
    animatedDegree = animateClockwise[d]
  }
  const degree = degrees[d]
  const letter = document.querySelector(`.deg${degree}-${ring}`)
  const animatedLetter = document.querySelector(`.deg${animatedDegree}-${ring}`)
  letter.innerHTML = ""
  animatedLetter.innerHTML = letters[ring][d].toUpperCase()
  setTimeout(() => {
    animatedLetter.innerHTML = ""
    letter.innerHTML = letters[ring][d].toUpperCase()
  }, 500)
}

const spin1 = d => {
  checked.innerHTML = ""
  if (direction === turn[0]) {
    animatedDegree = animateCounterClockwise[d]
  } else if (direction === turn[1]) {
    animatedDegree = animateClockwise[d]
  }
  const degree = degrees[d]
  const letter = document.querySelector(`.deg${degree}-${ring}`)
  const animatedLetter = document.querySelector(`.deg${animatedDegree}-${ring}`)
  letter.innerHTML = ""
  animatedLetter.innerHTML = letters[1][d].toUpperCase()
  setTimeout(() => {
    animatedLetter.innerHTML = ""
    letter.innerHTML = letters[1][d].toUpperCase()
  }, 500)
}

const spin2 = d => {
  checked.innerHTML = ""
  if (direction === turn[0]) {
    animatedDegree = animateCounterClockwise[d]
  } else if (direction === turn[1]) {
    animatedDegree = animateClockwise[d]
  }
  const degree = degrees[d]
  const letter = document.querySelector(`.deg${degree}-${ring}`)
  const animatedLetter = document.querySelector(`.deg${animatedDegree}-${ring}`)
  letter.innerHTML = ""
  animatedLetter.innerHTML = letters[2][d].toUpperCase()
  setTimeout(() => {
    animatedLetter.innerHTML = ""
    letter.innerHTML = letters[2][d].toUpperCase()
  }, 500)
}

const spin3 = d => {
  checked.innerHTML = ""
  if (direction === turn[0]) {
    animatedDegree = animateCounterClockwise[d]
  } else if (direction === turn[1]) {
    animatedDegree = animateClockwise[d]
  }
  const degree = degrees[d]
  const letter = document.querySelector(`.deg${degree}-${ring}`)
  const animatedLetter = document.querySelector(`.deg${animatedDegree}-${ring}`)
  letter.innerHTML = ""
  animatedLetter.innerHTML = letters[3][d].toUpperCase()
  setTimeout(() => {
    animatedLetter.innerHTML = ""
    letter.innerHTML = letters[3][d].toUpperCase()
  }, 500)
}

// Resets rings and updates spin count once per button click
// stopPropagation learned from bubbling lesson
const rotateFinish = (e) => {
  zerothRing = letters[0]
  innerRing = letters[1]
  middleRing = letters[2]
  outerRing = letters[3]
  if (won === false) {
    spins++
    spinsText.innerText = spins
  }
  //e.stopPropagation()
}

// Spins counterclockwise by moving a letter from the beginning of the array to the end and choosing correct animation
const rotateCounterClockwise = (e) => {
  const firstLetter = letters[ring][0]
  letters[ring].shift()
  letters[ring].push(firstLetter)
  direction = turn[0]
  for (let d = 0; d < degrees.length; d++){
    rotate(d)
  }
  rotateFinish(e)
}

const spinCounterClockwise1 = (e) => {
  const firstLetter = letters[1][0]
  letters[1].shift()
  letters[1].push(firstLetter)
  direction = turn[0]
  for (let d = 0; d < degrees.length; d++){
    spin1(d)
  }
  rotateFinish(e)
}

const spinCounterClockwise2 = (e) => {
  const firstLetter = letters[2][0]
  letters[2].shift()
  letters[2].push(firstLetter)
  direction = turn[0]
  for (let d = 0; d < degrees.length; d++){
    spin2(d)
  }
  rotateFinish(e)
}

const spinCounterClockwise3 = (e) => {
  const firstLetter = letters[3][0]
  letters[3].shift()
  letters[3].push(firstLetter)
  direction = turn[0]
  for (let d = 0; d < degrees.length; d++){
    spin3(d)
  }
  rotateFinish(e)
}

// Spins clockwise by moving a letter from the end of the array to the beginning and choosing correct animation
const rotateClockwise = (e) => {
  const lastLetter = letters[ring][5]
  letters[ring].pop()
  letters[ring].unshift(lastLetter)
  direction = turn[1]
  for (let d = 0; d < degrees.length; d++){
    rotate(d)
  }
  rotateFinish(e)
}

const spinClockwise1 = (e) => {
  const lastLetter = letters[1][5]
  letters[1].pop()
  letters[1].unshift(lastLetter)
  direction = turn[1]
  for (let d = 0; d < degrees.length; d++){
    spin1(d)
  }
  rotateFinish(e)
}


const spinClockwise2 = (e) => {
  const lastLetter = letters[2][5]
  letters[2].pop()
  letters[2].unshift(lastLetter)
  direction = turn[1]
  for (let d = 0; d < degrees.length; d++){
    spin2(d)
  }
  rotateFinish(e)
}

const spinClockwise3 = (e) => {
  const lastLetter = letters[3][5]
  letters[3].pop()
  letters[3].unshift(lastLetter)
  direction = turn[1]
  for (let d = 0; d < degrees.length; d++){
    spin3(d)
  }
  rotateFinish(e)
}

// Adds event listener to every element in spin buttons when a ring with multiple letters or one of those letters is clicked
const updateAndAdd = () => {
  ring_title.innerHTML = `${layers[3-ring].charAt(0).toUpperCase() + layers[3-ring].slice(1)}`
  checked.innerHTML = ""
  for (let i=0; i<counterclockwise.length; i++){
    counterclockwise[i].addEventListener("click", rotateCounterClockwise)
  }
  for (let i=0; i<clockwise.length; i++){
    clockwise[i].addEventListener("click", rotateClockwise)
  }
}

// Removes event listener from every element in spin buttons when the central ring or the letter in it is clicked
const updateAndRemove = () => {
  ring_title.innerHTML = "Click on a"
  checked.innerHTML = ""
  ring = 0
      for (let i=0; i<counterclockwise.length; i++){
          counterclockwise[i].removeEventListener("click", rotateCounterClockwise)
      }
      for (let i=0; i<clockwise.length; i++){
          clockwise[i].removeEventListener("click", rotateClockwise)
      }
}

  // // adds drag function to each letter
  // document.querySelectorAll('.letter').forEach(letter => {
  //   letter.addEventListener('pointerdown', startDrag);
  // });

document.addEventListener('pointerdown', function(event) {
  dragElement = event.target.closest('.spinny');

  if (!dragElement) return;

  event.preventDefault();

  dragElement.ondragstart = function() {
    return false;
  };

  startX = dragElement.getBoundingClientRect().left;
  startY = dragElement.getBoundingClientRect().top;
  startDrag1(event.clientX, event.clientY, event);
});

// LEAVE AS IS
function onPointerUp1(event) {
  finishDrag1();
}

// LEAVE AS IS
function onPointerMove(event) {
  moveAt(event.clientX, event.clientY, );
}

function startDrag1(clientX, clientY, event) {
  if (isDragging) {
    return;
  }

  isDragging = true;

  if (dragElement.classList.contains("ring-1-letter") || dragElement.id === "inner") {
    ring = 1
  } else if (dragElement.classList.contains("ring-2-letter") || dragElement.id === "middle") {
    ring = 2
  } else if (dragElement.classList.contains("ring-3-letter") || dragElement.id === "outer") {
    ring = 3
  }

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp1);

  shiftX = clientX - dragElement.getBoundingClientRect().left;
  shiftY = clientY - dragElement.getBoundingClientRect().top;
  startPointerX = event.clientX;
  startPointerY = event.clientY;

  console.log(startX, startPointerX)
  console.log(startY, startPointerY)

  // dragElement.style.position = 'fixed';

  moveAt(clientX, clientY, startPointerX, startPointerY);
}

function finishDrag1() {
  if (!isDragging) {
    return;
  }

  isDragging = false;

  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp1);

  console.log(newRingX, newRingY)
  
  if (dragElement.id === "inner" || dragElement.classList.contains("ring-1-letter")) {
    if (startPointerX > yAxis && (startPointerY >= xAxis - 10 && startPointerY <= xAxis + 10)) {
      console.log("Center right")
      if (newRingY > startPointerY) {
        console.log("Down")
        spinClockwise1()
      } else if (newRingY < startPointerY) {
        console.log("Up")
        spinCounterClockwise1()
      }
    } else if (startPointerX < yAxis && (startPointerY >= xAxis - 10 && startPointerY <= xAxis + 10)) {
      console.log("Center left")
      if (newRingY < startPointerY) {
        console.log("Up")
        spinClockwise1()
      } else if (newRingY > startPointerY) {
        console.log("Down")
        spinCounterClockwise1()
      }
    } else if (startPointerY > xAxis && (startPointerX >= yAxis - 10 && startPointerX <= yAxis + 10)) {
      console.log("Bottom center")
      if (newRingX < startPointerX) {
        console.log("Left")
        spinClockwise1()
      } else if (newRingX > startPointerX) {
        console.log("Right")
        spinCounterClockwise1()
      }
    } else if (startPointerY < xAxis && (startPointerX >= yAxis - 10 && startPointerX <= yAxis + 10)) {
      console.log("Top center")
      if (newRingX > startPointerX) {
        console.log("Right")
        spinClockwise1()
      } else if (newRingX < startPointerX) {
        console.log("Left")
        spinCounterClockwise1()
      }
    } else if (startPointerX > yAxis && startPointerY < xAxis) {
      console.log("Top right")
      if ((newRingX > startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(startPointerY - newRingY))) || (newRingY > startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the right and/or mainly down")
        spinClockwise1()
      } else if ((newRingX < startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(startPointerY - newRingY))) || (newRingY < startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the left and/or mainly up")
        spinCounterClockwise1()
      }
    } else if (startPointerX > yAxis && startPointerY > xAxis) {
      console.log("Bottom right")
      if ((newRingX < startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(startPointerY - newRingY))) || (newRingY > startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the left and/or mainly down")
        spinClockwise1()
      } else if ((newRingX > startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(startPointerY - newRingY))) || (newRingY < startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the right and/or mainly up")
        spinCounterClockwise1()
      }
    } else if (startPointerX < yAxis && startPointerY > xAxis) {
      console.log("Bottom left")
      if ((newRingX < startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(newRingY - startPointerY))) || (newRingY < startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the left and/or mainly up")
        spinClockwise1()
      } else if ((newRingX > startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(newRingY - startPointerY))) || (newRingY > startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the right and/or mainly down")
        spinCounterClockwise1()
      }
    } else if (startPointerX < yAxis && startPointerY < xAxis) {
      console.log("Top left")
      if ((newRingX > startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(newRingY - startPointerY))) || (newRingY < startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the right and/or mainly up")
        spinClockwise1()
      } else if ((newRingX < startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(newRingY - startPointerY))) || (newRingY > startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the left and/or mainly down")
        spinCounterClockwise1()
      }
    }
  } else if (dragElement.id === "middle" || dragElement.classList.contains("ring-2-letter")) {
    if (startPointerX > yAxis && (startPointerY >= xAxis - 10 && startPointerY <= xAxis + 10)) {
      console.log("Center right")
      if (newRingY > startPointerY) {
        console.log("Down")
        spinClockwise2()
      } else if (newRingY < startPointerY) {
        console.log("Up")
        spinCounterClockwise2()
      }
    } else if (startPointerX < yAxis && (startPointerY >= xAxis - 10 && startPointerY <= xAxis + 10)) {
      console.log("Center left")
      if (newRingY < startPointerY) {
        console.log("Up")
        spinClockwise2()
      } else if (newRingY > startPointerY) {
        console.log("Down")
        spinCounterClockwise2()
      }
    } else if (startPointerY > xAxis && (startPointerX >= yAxis - 10 && startPointerX <= yAxis + 10)) {
      console.log("Bottom center")
      if (newRingX < startPointerX) {
        console.log("Left")
        spinClockwise2()
      } else if (newRingX > startPointerX) {
        console.log("Right")
        spinCounterClockwise2()
      }
    } else if (startPointerY < xAxis && (startPointerX >= yAxis - 10 && startPointerX <= yAxis + 10)) {
      console.log("Top center")
      if (newRingX > startPointerX) {
        console.log("Right")
        spinClockwise2()
      } else if (newRingX < startPointerX) {
        console.log("Left")
        spinCounterClockwise2()
      }
    } else if (startPointerX > yAxis && startPointerY < xAxis) {
      console.log("Top right")
      if ((newRingX > startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(startPointerY - newRingY))) || (newRingY > startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the right and/or mainly down")
        spinClockwise2()
      } else if ((newRingX < startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(startPointerY - newRingY))) || (newRingY < startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the left and/or mainly up")
        spinCounterClockwise2()
      }
    } else if (startPointerX > yAxis && startPointerY > xAxis) {
      console.log("Bottom right")
      if ((newRingX < startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(startPointerY - newRingY))) || (newRingY > startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the left and/or mainly down")
        spinClockwise2()
      } else if ((newRingX > startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(startPointerY - newRingY))) || (newRingY < startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the right and/or mainly up")
        spinCounterClockwise2()
      }
    } else if (startPointerX < yAxis && startPointerY > xAxis) {
      console.log("Bottom left")
      if ((newRingX < startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(newRingY - startPointerY))) || (newRingY < startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the left and/or mainly up")
        spinClockwise2()
      } else if ((newRingX > startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(newRingY - startPointerY))) || (newRingY > startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the right and/or mainly down")
        spinCounterClockwise2()
      }
    } else if (startPointerX < yAxis && startPointerY < xAxis) {
      console.log("Top left")
      if ((newRingX > startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(newRingY - startPointerY))) || (newRingY < startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the right and/or mainly up")
        spinClockwise2()
      } else if ((newRingX < startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(newRingY - startPointerY))) || (newRingY > startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the left and/or mainly down")
        spinCounterClockwise2()
      }
    }
  } else if (dragElement.id === "outer" || dragElement.classList.contains("ring-3-letter")) {
    if (startPointerX > yAxis && (startPointerY >= xAxis - 10 && startPointerY <= xAxis + 10)) {
      console.log("Center right")
      if (newRingY > startPointerY) {
        console.log("Down")
        spinClockwise3()
      } else if (newRingY < startPointerY) {
        console.log("Up")
        spinCounterClockwise3()
      }
    } else if (startPointerX < yAxis && (startPointerY >= xAxis - 10 && startPointerY <= xAxis + 10)) {
      console.log("Center left")
      if (newRingY < startPointerY) {
        console.log("Up")
        spinClockwise3()
      } else if (newRingY > startPointerY) {
        console.log("Down")
        spinCounterClockwise3()
      }
    } else if (startPointerY > xAxis && (startPointerX >= yAxis - 10 && startPointerX <= yAxis + 10)) {
      console.log("Bottom center")
      if (newRingX < startPointerX) {
        console.log("Left")
        spinClockwise3()
      } else if (newRingX > startPointerX) {
        console.log("Right")
        spinCounterClockwise3()
      }
    } else if (startPointerY < xAxis && (startPointerX >= yAxis - 10 && startPointerX <= yAxis + 10)) {
      console.log("Top center")
      if (newRingX > startPointerX) {
        console.log("Right")
        spinClockwise3()
      } else if (newRingX < startPointerX) {
        console.log("Left")
        spinCounterClockwise3()
      }
    } else if (startPointerX > yAxis && startPointerY < xAxis) {
      console.log("Top right")
      if ((newRingX > startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(startPointerY - newRingY))) || (newRingY > startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the right and/or mainly down")
        spinClockwise3()
      } else if ((newRingX < startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(startPointerY - newRingY))) || (newRingY < startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the left and/or mainly up")
        spinCounterClockwise3()
      }
    } else if (startPointerX > yAxis && startPointerY > xAxis) {
      console.log("Bottom right")
      if ((newRingX < startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(startPointerY - newRingY))) || (newRingY > startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the left and/or mainly down")
        spinClockwise3()
      } else if ((newRingX > startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(startPointerY - newRingY))) || (newRingY < startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(startPointerX - newRingX)))) {
        console.log("Mainly to the right and/or mainly up")
        spinCounterClockwise3()
      }
    } else if (startPointerX < yAxis && startPointerY > xAxis) {
      console.log("Bottom left")
      if ((newRingX < startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(newRingY - startPointerY))) || (newRingY < startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the left and/or mainly up")
        spinClockwise3()
      } else if ((newRingX > startPointerX && (Math.abs(startPointerX - newRingX) >= Math.abs(newRingY - startPointerY))) || (newRingY > startPointerY && (Math.abs(startPointerY - newRingY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the right and/or mainly down")
        spinCounterClockwise3()
      }
    } else if (startPointerX < yAxis && startPointerY < xAxis) {
      console.log("Top left")
      if ((newRingX > startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(newRingY - startPointerY))) || (newRingY < startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the right and/or mainly up")
        spinClockwise3()
      } else if ((newRingX < startPointerX && (Math.abs(newRingX - startPointerX) >= Math.abs(newRingY - startPointerY))) || (newRingY > startPointerY && (Math.abs(newRingY - startPointerY) >= Math.abs(newRingX - startPointerX)))) {
        console.log("Mainly to the left and/or mainly down")
        spinCounterClockwise3()
      }
    }
  }
}

// LEAVE AS IS
function moveAt(clientX, clientY) {
  newX = clientX - shiftX;
  newY = clientY - shiftY;
  newRingX = clientX;
  newRingY = clientY;
}

// Adds event listener to every letter that either removes event listeners from every spin button element or adds them
document.querySelectorAll('a').forEach(character => {
  character.addEventListener('click', e => {
    if (e.target.classList.contains("center")) {
      updateAndRemove()
    } else if (e.target.classList.contains("ring-1-letter")){
      ring = 1
      updateAndAdd()  
    } else if (e.target.classList.contains("ring-2-letter")){
      ring = 2
      updateAndAdd()
    } else if (e.target.classList.contains("ring-3-letter")){
      ring = 3
      updateAndAdd()
    }
  }, true)
})

// Adds event listener to every ring that either removes event listeners from every spin button element or adds them
document.querySelectorAll('.ring').forEach(circle => {
  circle.addEventListener('click', e => {
    if (e.target.id !== "zeroth") {
      if (e.target.id === "inner"){
        ring = 1
      } else if (e.target.id === "middle"){
        ring = 2
      } else if (e.target.id === "outer"){
        ring = 3
      }
      updateAndAdd()
    } else if (e.target.id === "zeroth") {
      updateAndRemove()
    }
  }, true)
})

// Selects DOM elements that update when checked
const check = document.querySelector("#check")
const checked = document.querySelector("#checked")

// Updates checks if the selected ring is not zero
const updateChecks = () => {
  if (ring !== 0) {
    checks++
    checksText.innerText = checks
  }
}


// Checks if all rings are in right position or if not, if selected ring is in right position or how much it is off by, then updates check count
// TODO - make all checks loops with conditionals
const checkRing = () => {
  if (won === false) {
    let right = true
    for (let i = 1; i < letters.length; i++) {
      if (letters[i][0] !== solution[i][3] || letters[i][1] !== solution[i][4] || letters[i][2] !== solution[i][5] || letters[i][3] !== solution[i][0] || letters[i][4] !== solution[i][1] || letters[i][5] !== solution[i][2]) {
        right = false
      }
    }
    if (right === true) {
      checked.innerHTML = "You win!"
      won = true
      updateChecks()
    } else if (solution[ring][0] === letters[ring][0] && solution[ring][1] === letters[ring][1] && solution[ring][2] === letters[ring][2] && solution[ring][3] === letters[ring][3] && solution[ring][4] === letters[ring][4] && solution[ring][5] === letters[ring][5] && ring !== 0){
      checked.innerHTML = `is off by three`
    } else if ((solution[ring][0] === letters[ring][1] && solution[ring][1] === letters[ring][2] && solution[ring][2] === letters[ring][3] && solution[ring][3] === letters[ring][4] && solution[ring][4] === letters[ring][5] && solution[ring][5] === letters[ring][0]) && ring !== 0 || (solution[ring][0] === letters[ring][5] && solution[ring][1] === letters[ring][0] && solution[ring][2] === letters[ring][1] && solution[ring][3] === letters[ring][2] && solution[ring][4] === letters[ring][3] && solution[ring][5] === letters[ring][4] && ring !== 0)){
      checked.innerHTML = `is off by two`
    } else if ((solution[ring][0] === letters[ring][2] && solution[ring][1] === letters[ring][3] && solution[ring][2] === letters[ring][4] && solution[ring][3] === letters[ring][5] && solution[ring][4] === letters[ring][0] && solution[ring][5] === letters[ring][1]) && ring !== 0 || (solution[ring][0] === letters[ring][4] && solution[ring][1] === letters[ring][5] && solution[ring][2] === letters[ring][0] && solution[ring][3] === letters[ring][1] && solution[ring][4] === letters[ring][2] && solution[ring][5] === letters[ring][3] && ring !== 0)){
      checked.innerHTML = `is off by one`
    } else if (solution[ring][0] === letters[ring][3] && solution[ring][1] === letters[ring][4] && solution[ring][2] === letters[ring][5] && solution[ring][3] === letters[ring][0] && solution[ring][4] === letters[ring][1] && solution[ring][5] === letters[ring][2] && ring !== 0){
      checked.innerHTML = `is right`
    }
  }
  if (won === false) {
    updateChecks()
  }
  // Updates stored data
  if (won === true) {
    stopTimer();
    gamesWonSoFar.push(todaysIndex)
    const gamesWonNow = JSON.stringify(gamesWonSoFar)
    localStorage.setItem("gamesWon", gamesWonNow)
    const setAverageChecks = JSON.stringify((averageChecks * previousGamesPlayed + checks) / gamesPlayed)
    localStorage.setItem("averageChecks", round(setAverageChecks))
    const setAverageSpins = JSON.stringify((averageSpins * previousGamesPlayed + spins) / gamesPlayed)
    localStorage.setItem("averageSpins", round(setAverageSpins))
    const setAverageTime = JSON.stringify((averageTime * previousGamesPlayed + elapsedTimeInSeconds) / gamesPlayed)
    localStorage.setItem("averageTime", round(setAverageTime))
    // Creates pop-up with stats
    sleep(750).then(() => {
      const whole = document.querySelector("main")
      whole.style.display = "none"
      statsPopUp.style.visibility = "visible"
      copyTodaysScore()
      statsPopUp.style.zIndex = 7
    })
  }
  if (won === true) {
    // Function to update the countdown clock
    function updateClock() {

      const { hours, minutes, seconds } = timeToNewGame();
    
      hoursCounter.innerHTML = String(hours).padStart(2, '0');
      minutesCounter.innerHTML = String(minutes).padStart(3, ':0');
      secondsCounter.innerHTML = String(seconds).padStart(3, ':0');
    
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
}

check.addEventListener("click", checkRing)