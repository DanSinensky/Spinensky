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
let direction
let animatedDegree

let solution = [];

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
let won = false;

// for data storage
let playedBefore = false;
let averageSpins = 0;
let averageChecks = 0;
let gamesPlayed = 0;
const havePlayedBefore = localStorage.getItem("playedBefore");
const getAverageSpins = localStorage.getItem("averageSpins");
const getAverageChecks = localStorage.getItem("averageChecks");
const previousGamesPlayed = localStorage.getItem("gamesPlayed");

// for chosing today's words and time to tomorrow, learned from MDN
const zeroDate = new Date('July 10, 2023');
const todaysDate = new Date();
const todaysIndex = Math.floor((todaysDate.getTime() - zeroDate.getTime()) / (1000 * 60 * 60 * 24));
const tomorrow = new Date(todaysDate.getTime() + (1000 * 60 * 60 * 24))
const midnightTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())

// Rounds averages to nearest hundredth
// Copied with slight modification from https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
const round = num => {
  let p = Math.pow(10, 2);
  let n = (num * p).toPrecision(15);
  return Math.round(n) / p;
}

// for checking if played/won already today
// TODO - finish
let playedToday = false
let wonToday = false
const havePlayedToday = localStorage.getItem("playedToday")
const haveWonToday = localStorage.getItem("wonToday")

if (havePlayedToday) {
  playedToday = true
}
if (haveWonToday) {
  wonToday = true
}

// Copies todays score to clipboard, learned from MDN
let todaysScore = ""
const copyTodaysScore = () => {
  todaysScore = `Spinensky ${todaysIndex}\n\nSpins: ${spins}\nChecks: ${checks}\n\nhttps://dansinensky.github.io/spinensky/`
  navigator.clipboard.writeText(todaysScore)
}

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
if (won === false) {
  if (previousGamesPlayed) {
    gamesPlayed = JSON.parse(previousGamesPlayed) + 1
  } else {
    gamesPlayed = 1
  }
  const gamesPlayedNow = JSON.stringify(gamesPlayed)
  localStorage.setItem("gamesPlayed", gamesPlayedNow)
}

// Generates DOM element with info about game, but only if first game
// TODO - make DRYer (a modal?)
const start = document.createElement("section")
if (playedBefore === false) {
  body.appendChild(start)
}
const fakeHeader = document.createElement("div")
fakeHeader.className = "fake-header"
start.appendChild(fakeHeader)
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
start.appendChild(info)

// Chooses today's solution and start positions
// Modeled off of lesson on local storage
solution = JSON.parse(JSON.stringify(SOLUTIONS[todaysIndex]))
const importLetters = JSON.parse(JSON.stringify(SPUNSOLUTIONS[todaysIndex]))

// Updates common variable for today's start positions
for (let i = 0; i < letters.length; i++) {
  for (let j = 0; j < solution[i].length; j++) {
    letters[i][j] = importLetters[i][j]
  }
}

if (wonToday === true) {
  const wonStats = document.createElement("section")
  body.appendChild(wonStats)
  const fakeHeader = document.createElement("div")
  fakeHeader.className = "fake-header"
  wonStats.appendChild(fakeHeader)
  const emptyDiv = document.createElement("div")
  emptyDiv.className = "empty-div"
  fakeHeader.appendChild(emptyDiv)
  const exit = document.createElement("button")
  exit.innerText = "X"
  exit.className = "exit"
  fakeHeader.appendChild(exit)
  const score = document.createElement("p")
  score.className = "score"
  score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Games Played: ${gamesPlayed} </br> </br> <button class="share">Share</button>`
  wonStats.appendChild(score)
  exit.addEventListener("click", e => {
    wonStats.remove()
    whole.style.display = "block"
  })
}

// Creates main, but only displays if have played before
const whole = document.createElement("main")
if (playedBefore === true && wonToday === false) {
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
  const infoPopUp = document.createElement("section")
  body.appendChild(infoPopUp)
  const fakeHeader = document.createElement("div")
  fakeHeader.className = "fake-header"
  infoPopUp.appendChild(fakeHeader)
  const emptyDiv = document.createElement("div")
  emptyDiv.className = "empty-div"
  fakeHeader.appendChild(emptyDiv)
  const infoExit = document.createElement("button")
  infoExit.innerText = "X"
  infoExit.className = "exit"
  fakeHeader.appendChild(infoExit)
  const infoInfo = document.createElement("p")
  infoInfo.className = "info"
  infoInfo.innerHTML = `Spin rings of letters in order to unscramble four-letter words using as few spins as possible. The central letter is the last letter of the words on the left and the first letter of the words on the right. </br> </br> Click on a ring to select it, then spin it counterclockwise or clockwise by clicking the button with that symbol. Click "Check" to see how close that ring is to the correct position. </br> </br> If you click "Check" when all of the rings are in the correct position, you win! </br> </br> Have fun!`
  infoPopUp.appendChild(infoInfo)
  infoExit.addEventListener("click", e => {
    infoPopUp.remove()
    whole.style.display = "block"
  })
})
// Generates DOM element with stats for current game and running stats, identical to one generated on winning
// TODO - make DRYer (a modal?)
const stats = document.querySelector(".stats")
stats.addEventListener("click", e => {
  whole.style.display = "none"
  const statsDuring = document.createElement("section")
  body.append(statsDuring)
  const fakeHeader = document.createElement("div")
  fakeHeader.className = "fake-header"
  statsDuring.appendChild(fakeHeader)
  const emptyDiv = document.createElement("div")
  emptyDiv.className = "empty-div"
  fakeHeader.appendChild(emptyDiv)
  const statsExit = document.createElement("button")
  statsExit.innerText = "X"
  statsExit.className = "exit"
  fakeHeader.appendChild(statsExit)
  const score = document.createElement("p")
  score.className = "score"
  score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Games Played: ${gamesPlayed}`
  statsDuring.appendChild(score)
  if (won === true) {
    // TODO - add to a share button
    copyTodaysScore()
    score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Games Played: ${gamesPlayed} </br> </br> Today's score copied to clipboard!`
  }
  statsExit.addEventListener("click", e => {
    statsDuring.remove()
    whole.style.display = "block"
  })
})
// TODO - make settings popup that lets you play in dark mode, maybe other settings???
const settings = document.querySelector(".settings")

// Makes DOM element for first ring that contains other rings and letter
const outerRingElement = document.createElement("div")
outerRingElement.className = "ring"
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
whole.prepend(header)
header.appendChild(emptyDiv)
header.appendChild(title)
header.appendChild(hamburger)
bars.forEach(bar => {
  const newBar = document.createElement("div")
  newBar.className = bar
  hamburger.appendChild(newBar)
  newBar.addEventListener("click", e => {
    hamburger.classList.toggle("change")
    aside.classList.toggle("hidden")
  })
})

// Makes DOM elements for rings besides outermost ring
for (let i = 1; i < layers.length; i++) {
  const layer = document.createElement("div")
  layer.className = "ring"
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

// Makes DOM elements for all other letters, including empty keyframes
// Modeled off of code on how to make wordle from https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
for (let i = 1; i < letters.length; i++) {
  const ring = `ring-${i}-letter`
  for (let j = 0; j < degrees.length; j++) {
    const degree = degrees[j]
    const letter = document.createElement("a")
    letter.className = `deg${degree}-${i} ${ring}`
    letter.innerHTML = letters[i][j].toUpperCase()
    rings[0].append(letter)
    animatedDegree = animateCounterClockwise[j]
    const animatedLetter = document.createElement("a")
    animatedLetter.className = `deg${animatedDegree}-${i} ${ring}`
    animatedLetter.innerHTML = ""
    rings[0].append(animatedLetter)
  }
}

// Makes container for spin buttons
const buttons = document.createElement("div")
buttons.className = "buttons"
whole.append(buttons)

// Makes spin buttons
for (let i = 0; i < turn.length; i++) {
  const button = document.createElement("div")
  button.className = `button ${turn[i]}`
  buttons.appendChild(button)
  const tail = document.createElement("div")
  tail.className = `tail ${turn[i]}`
  button.appendChild(tail)
  const middle = document.createElement("div")
  middle.className = `middle ${turn[i]}`
  tail.appendChild(middle)
  const middleText = document.createElement("p")
  middleText.innerText = "Spin"
  middleText.className = "middle-text"
  middle.appendChild(middleText)
  for (let j = 0; j < position.length; j++) {
    const arrow = document.createElement("div")
    arrow.className = `arrow ${turn[i]} ${position[j]}`
    if (arrow.classList.contains("counterclockwise")) {
      arrow.classList.add(`${arrows[j]}`)
    } else if (arrow.classList.contains("clockwise")) {
      if (j < 2) {
        arrow.classList.add(`${arrows[j + 2]}`)
      } else if (j > 1) {
        arrow.classList.add(`${arrows[j - 2]}`)
      }
    }
    tail.appendChild(arrow)
  }
}

// Adds event listener to all exit buttons for info and stat screens
exit.addEventListener("click", e => {
  start.remove()
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
  sleep(500).then(() => {
    animatedLetter.innerHTML = ""
    letter.innerHTML = letters[ring][d].toUpperCase()
  })
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
  e.stopPropagation()
}

// Spins counterclockwise by moving a letter from the beginning of the array to the end and choosing correct animation
const rotateCounterClockwise = (e) => {
  const firstLetter = letters[ring][0]
  letters[ring].shift()
  letters[ring].push(firstLetter)
  direction = turn[0]
  for (let d = 0; d < degrees.length; d++) {
    rotate(d)
  }
  rotateFinish(e)
}

// Spins clockwise by moving a letter from the end of the array to the beginning and choosing correct animation
const rotateClockwise = (e) => {
  const lastLetter = letters[ring][5]
  letters[ring].pop()
  letters[ring].unshift(lastLetter)
  direction = turn[1]
  for (let d = 0; d < degrees.length; d++) {
    rotate(d)
  }
  rotateFinish(e)
}

// Adds event listener to every element in spin buttons when a ring with multiple letters or one of those letters is clicked
const updateAndAdd = () => {
  ring_title.innerHTML = `${layers[3 - ring].charAt(0).toUpperCase() + layers[3 - ring].slice(1)}`
  checked.innerHTML = ""
  for (let i = 0; i < counterclockwise.length; i++) {
    counterclockwise[i].addEventListener("click", rotateCounterClockwise)
  }
  for (let i = 0; i < clockwise.length; i++) {
    clockwise[i].addEventListener("click", rotateClockwise)
  }
}

// Removes event listener from every element in spin buttons when the central ring or the letter in it is clicked
const updateAndRemove = () => {
  ring_title.innerHTML = "Click on a"
  checked.innerHTML = ""
  ring = 0
  for (let i = 0; i < counterclockwise.length; i++) {
    counterclockwise[i].removeEventListener("click", rotateCounterClockwise)
  }
  for (let i = 0; i < clockwise.length; i++) {
    clockwise[i].removeEventListener("click", rotateClockwise)
  }
}

// Adds event listener to every letter that either removes event listeners from every spin button element or adds them
document.querySelectorAll('a').forEach(character => {
  character.addEventListener('click', e => {
    if (e.target.classList.contains("center")) {
      updateAndRemove()
    } else if (e.target.classList.contains("ring-1-letter")) {
      ring = 1
      updateAndAdd()
    } else if (e.target.classList.contains("ring-2-letter")) {
      ring = 2
      updateAndAdd()
    } else if (e.target.classList.contains("ring-3-letter")) {
      ring = 3
      updateAndAdd()
    }
  }, true)
})

// Adds event listener to every ring that either removes event listeners from every spin button element or adds them
document.querySelectorAll('.ring').forEach(circle => {
  circle.addEventListener('click', e => {
    if (e.target.id !== "zeroth") {
      if (e.target.id === "inner") {
        ring = 1
      } else if (e.target.id === "middle") {
        ring = 2
      } else if (e.target.id === "outer") {
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
      const setWonToday = JSON.stringify(true)
      localStorage.setItem("wonToday", setWonToday)
      updateChecks()
    } else if (solution[ring][0] === letters[ring][0] && solution[ring][1] === letters[ring][1] && solution[ring][2] === letters[ring][2] && solution[ring][3] === letters[ring][3] && solution[ring][4] === letters[ring][4] && solution[ring][5] === letters[ring][5] && ring !== 0) {
      checked.innerHTML = `is off by three`
    } else if ((solution[ring][0] === letters[ring][1] && solution[ring][1] === letters[ring][2] && solution[ring][2] === letters[ring][3] && solution[ring][3] === letters[ring][4] && solution[ring][4] === letters[ring][5] && solution[ring][5] === letters[ring][0]) && ring !== 0 || (solution[ring][0] === letters[ring][5] && solution[ring][1] === letters[ring][0] && solution[ring][2] === letters[ring][1] && solution[ring][3] === letters[ring][2] && solution[ring][4] === letters[ring][3] && solution[ring][5] === letters[ring][4] && ring !== 0)) {
      checked.innerHTML = `is off by two`
    } else if ((solution[ring][0] === letters[ring][2] && solution[ring][1] === letters[ring][3] && solution[ring][2] === letters[ring][4] && solution[ring][3] === letters[ring][5] && solution[ring][4] === letters[ring][0] && solution[ring][5] === letters[ring][1]) && ring !== 0 || (solution[ring][0] === letters[ring][4] && solution[ring][1] === letters[ring][5] && solution[ring][2] === letters[ring][0] && solution[ring][3] === letters[ring][1] && solution[ring][4] === letters[ring][2] && solution[ring][5] === letters[ring][3] && ring !== 0)) {
      checked.innerHTML = `is off by one`
    } else if (solution[ring][0] === letters[ring][3] && solution[ring][1] === letters[ring][4] && solution[ring][2] === letters[ring][5] && solution[ring][3] === letters[ring][0] && solution[ring][4] === letters[ring][1] && solution[ring][5] === letters[ring][2] && ring !== 0) {
      checked.innerHTML = `is right`
    }
  }
  if (won === false) {
    updateChecks()
  }
  // Updates stored data
  if (won === true) {
    const setAverageChecks = JSON.stringify((averageChecks * previousGamesPlayed + checks) / gamesPlayed)
    localStorage.setItem("averageChecks", round(setAverageChecks))
    const setAverageSpins = JSON.stringify((averageSpins * previousGamesPlayed + spins) / gamesPlayed)
    localStorage.setItem("averageSpins", round(setAverageSpins))
    // Creates pop-up with stats
    // TODO - make DRYer (a modal?)
    sleep(750).then(() => {
      const over = document.createElement("section")
      const whole = document.querySelector("main")
      whole.style.display = "none"
      body.appendChild(over)
      const fakeHeader = document.createElement("div")
      fakeHeader.className = "fake-header"
      over.appendChild(fakeHeader)
      const emptyDiv = document.createElement("div")
      emptyDiv.className = "empty-div"
      fakeHeader.appendChild(emptyDiv)
      const exit = document.createElement("button")
      exit.innerText = "X"
      exit.className = "exit"
      fakeHeader.appendChild(exit)
      const score = document.createElement("p")
      score.className = "score"
      // TODO - add to a share button
      score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Games Played: ${gamesPlayed} </br> </br> Today's score copied to clipboard!`
      copyTodaysScore()
      over.appendChild(score)
      exit.addEventListener("click", e => {
        over.remove()
        whole.style.display = "block"
      })
    })
  }
}

check.addEventListener("click", checkRing)