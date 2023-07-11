import { WORDS } from "./words.js";
import { SOLUTIONS } from "./storedArrayofArraysOfWords.js";
import { SPUNSOLUTIONS } from "./storedArrayofArraysOfWords.js";

const body = document.querySelector("body")
const keywords = [];
let firstKeyword = "";
let centralLetter = "";
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
let solution = [];
const turn = ["counterclockwise", "clockwise"];
let direction
let animatedDegree
const position = ["left", "top", "right", "bottom"];
const arrows = ["triangle-down", "triangle-left", "triangle-up", "triangle-right"];
let ring = 0;
let spins = 0;
let checks = 0;
const numberOfWords = [4, 6, 8];
let playedBefore = false;
let won = false;
const havePlayedBefore = localStorage.getItem("playedBefore");
const getAverageSpins = localStorage.getItem("averageSpins");
const getAverageChecks = localStorage.getItem("averageChecks");
const previousGamesPlayed = localStorage.getItem("gamesPlayed");
let averageSpins = 0;
let averageChecks = 0;
let gamesPlayed = 0;
const bars = ["bar1", "bar2", "bar3"];

const allRingsEqual = () => {
  zerothRing = letters[0]
  innerRing = letters[1]
  middleRing = letters[2]
  outerRing = letters[3]
}

const initialize = () => {
  if (havePlayedBefore) {
    playedBefore = true
  }
  if (getAverageSpins) {
    averageSpins = JSON.parse(getAverageSpins)
  }
  if (getAverageChecks) {
    averageChecks = JSON.parse(getAverageChecks)
  }
  if (previousGamesPlayed) {
    gamesPlayed = JSON.parse(previousGamesPlayed) + 1
  } else {
    gamesPlayed = 1
  }
  const gamesPlayedNow = JSON.stringify(gamesPlayed)
  localStorage.setItem("gamesPlayed", gamesPlayedNow)
  const start = document.createElement("section")
  if (playedBefore === false) {
    body.appendChild(start)
  }
  const startHeader = document.createElement("header")
  start.appendChild(startHeader)
  const emptyDiv = document.createElement("div")
  emptyDiv.className = "empty-div"
  startHeader.appendChild(emptyDiv)
  const startTitle = document.createElement("h1")
  startTitle.className = "start-title"
  startTitle.innerText = "Spinensky"
  startHeader.appendChild(startTitle)
  const exit = document.createElement("div")
  exit.innerText = "x"
  exit.className = "exit"
  startHeader.appendChild(exit)
  const info = document.createElement("p")
  info.className = "info"
  info.innerHTML = `Spin rings of letters in order to unscramble four-letter words using as few spins as possible. The central letter is the last letter of the words on the left and the first letter of the words on the right. </br> </br> Click on a ring to select it, then spin it counterclockwise or clockwise by clicking the button with that symbol. Click "Check" to see how close that ring is to the correct position. </br> </br> If you click "Check" when all of the rings are in the correct position, you win! </br> </br> Have fun!`
  start.appendChild(info)

  const todaysGame = Math.floor(Math.random() * SOLUTIONS.length)
  solution = JSON.parse(JSON.stringify(SOLUTIONS[todaysGame]))
  const importLetters = JSON.parse(JSON.stringify(SPUNSOLUTIONS[todaysGame]))

  for (let i = 0; i < letters.length; i++){
    for (let j = 0; j < solution[i].length; j++){
      letters[i][j] = importLetters[i][j]
    }
  }

  const whole = document.createElement("main")
  if (playedBefore === true) {
    whole.style.display = "block"
  }
  body.appendChild(whole)
  const aside = document.createElement("aside")
  aside.innerHTML = `<ul><a class="information"><li>Info</li></a><a class="stats"><li>Stats</li></a><a class="settings"><li>Settings</li></a></ul>`
  aside.className = "hidden"
  whole.appendChild(aside)
  const information = document.querySelector(".information")
  information.addEventListener("click", e => {
    whole.style.display = "none"
    const infoPopUp = document.createElement("section")
    body.appendChild(infoPopUp)
    const infoHeader = document.createElement("header")
    infoPopUp.appendChild(infoHeader)
    const infoEmptyDiv = document.createElement("div")
    infoEmptyDiv.className = "empty-div"
    infoHeader.appendChild(infoEmptyDiv)
    const infoTitle = document.createElement("h1")
    infoTitle.className = "start-title"
    infoTitle.innerText = "Spinensky"
    infoHeader.appendChild(infoTitle)
    const infoExit = document.createElement("div")
    infoExit.innerText = "x"
    infoExit.className = "exit"
    infoHeader.appendChild(infoExit)
    const infoInfo = document.createElement("p")
    infoInfo.className = "info"
    infoInfo.innerHTML = `Spin rings of letters in order to unscramble four-letter words using as few spins as possible. The central letter is the last letter of the words on the left and the first letter of the words on the right. </br> </br> Click on a ring to select it, then spin it counterclockwise or clockwise by clicking the button with that symbol. Click "Check" to see how close that ring is to the correct position. </br> </br> If you click "Check" when all of the rings are in the correct position, you win! </br> </br> Have fun!`
    infoPopUp.appendChild(infoInfo)
    infoExit.addEventListener("click", e => {
      infoPopUp.style.display = "none"
      whole.style.display = "block"
    })
  })
  const stats = document.querySelector(".stats")
  stats.addEventListener("click", e => {
    whole.style.display = "none"
    const statsDuring = document.createElement("section")
    body.append(statsDuring)
    const statsHeader = document.createElement("header")
    statsDuring.appendChild(statsHeader)
    const statsEmptyDiv = document.createElement("div")
    statsEmptyDiv.className = "empty-div"
    statsHeader.appendChild(statsEmptyDiv)
    const statsTitle = document.createElement("h1")
    statsTitle.className = "start-title"
    statsTitle.innerText = "Spinensky"
    statsHeader.appendChild(statsTitle)
    const statsExit = document.createElement("div")
    statsExit.innerText = "x"
    statsExit.className = "exit"
    statsHeader.appendChild(statsExit)
    const score = document.createElement("p")
    score.className = "score"
    score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Games Played: ${gamesPlayed}`
    statsDuring.appendChild(score)
    statsExit.addEventListener("click", e => {
      statsDuring.style.display = "none"
      whole.style.display = "block"
    })
  })
  const settings = document.querySelector(".settings")
  const outerRing = document.createElement("div")
  outerRing.className = "ring"
  outerRing.setAttribute("id", `${layers[0]}`);
  rings.unshift(outerRing)
  whole.appendChild(outerRing)
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
  
  for (let i = 1; i < layers.length; i++) {
    const layer = document.createElement("div")
    layer.className = "ring"
    layer.setAttribute("id", layers[i])
    rings.push(layer)
    rings[i - 1].appendChild(layer)
  }

  const notes = document.createElement("div")
  notes.className = "notes"
  notes.innerHTML = '<div class="ring-title-and-checked"><h3><span id="ring-title">Click on a</span> ring</h3><p id="checked"> </p></div></br><p>Spins: <span id="spins">0</span> Checks: <span id="checks">0</span></p></br><div class="check-button"><button id="check">Check</button></div></br>'
  whole.appendChild(notes)

  let center = document.createElement("a")
  center.className = "center"
  rings[0].append(center)
  center.innerText = zerothRing[0].toUpperCase()

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

  const buttons = document.createElement("div")
  buttons.className = "buttons"
  whole.append(buttons)

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

    exit.addEventListener("click", e => {
      start.style.display = "none"
      whole.style.display = "block"
      playedBefore = true
      const setPlayedBefore = JSON.stringify(playedBefore)
      localStorage.setItem("playedBefore", setPlayedBefore)
    })
  }
  
  initialize()

console.log(solution)

const ring_title = document.querySelector("#ring-title")
const counterclockwise = document.querySelectorAll('.counterclockwise');
const clockwise = document.querySelectorAll('.clockwise')
const spinsText = document.querySelector("#spins")
const checksText = document.querySelector("#checks")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

const rotateFinish = (event) => {
  allRingsEqual()
  if (won === false) {
    spins++
    spinsText.innerText = spins
  }
  event.stopPropagation()
}

const rotateCounterClockwise = (event) => {
  const firstLetter = letters[ring][0]
  letters[ring].shift()
  letters[ring].push(firstLetter)
  direction = turn[0]
  for (let d = 0; d < degrees.length; d++){
    rotate(d)
  }
  rotateFinish(event)
}

const rotateClockwise = (event) => {
  const lastLetter = letters[ring][5]
  letters[ring].pop()
  letters[ring].unshift(lastLetter)
  direction = turn[1]
  for (let d = 0; d < degrees.length; d++){
    rotate(d)
  }
  rotateFinish(event)
}

const updateAndAdd = () => {
  checked.innerHTML = ""
  ring_title.innerHTML = `${layers[3-ring].charAt(0).toUpperCase() + layers[3-ring].slice(1)}`
  for (let i=0; i<counterclockwise.length; i++){
    counterclockwise[i].addEventListener("click", rotateCounterClockwise)
  }
  for (let i=0; i<clockwise.length; i++){
    clockwise[i].addEventListener("click", rotateClockwise)
  }
}

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

document.querySelectorAll('a').forEach(character => {
  character.addEventListener('click', event => {
    if (event.target.classList.contains("center")) {
      updateAndRemove()
    } else if (event.target.classList.contains("ring-1-letter")){
      ring = 1
      updateAndAdd()  
    } else if (event.target.classList.contains("ring-2-letter")){
      ring = 2
      updateAndAdd()
    } else if (event.target.classList.contains("ring-3-letter")){
      ring = 3
      updateAndAdd()
    }
  }, true)
})

document.querySelectorAll('.ring').forEach(circle => {
  circle.addEventListener('click', event => {
    if (event.target.id !== "zeroth") {
      if (event.target.id === "inner"){
        ring = 1
      } else if (event.target.id === "middle"){
        ring = 2
      } else if (event.target.id === "outer"){
        ring = 3
      }
      updateAndAdd()
    } else if (event.target.id === "zeroth") {
      updateAndRemove()
    }
  }, true)
})
  
const check = document.querySelector("#check")
const checked = document.querySelector("#checked")

const round = num => {
  let p = Math.pow(10, 2);
  let n = (num * p).toPrecision(15);
  return Math.round(n) / p;
}

const updateChecks = () => {
  if (ring !== 0) {
    checks++
    checksText.innerText = checks
  }
}

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
  if (won === true) {
    const setAverageChecks = JSON.stringify((averageChecks * previousGamesPlayed + checks) / gamesPlayed)
    localStorage.setItem("averageChecks", round(setAverageChecks))
    const setAverageSpins = JSON.stringify((averageSpins * previousGamesPlayed + spins)/gamesPlayed)
    localStorage.setItem("averageSpins", round(setAverageSpins))
    sleep(750).then(() => { 
      const over = document.createElement("section")
      const whole = document.querySelector("main")
      whole.style.display = "none"
      body.appendChild(over)
      const overHeader = document.createElement("header")
      over.appendChild(overHeader)
      const emptyDiv = document.createElement("div")
      emptyDiv.className = "empty-div"
      overHeader.appendChild(emptyDiv)
      const startTitle = document.createElement("h1")
      startTitle.className = "start-title"
      startTitle.innerText = "Spinensky"
      overHeader.appendChild(startTitle)
      const exit = document.createElement("div")
      exit.innerText = "x"
      exit.className = "exit"
      overHeader.appendChild(exit)
      const score = document.createElement("p")
      score.className = "score"
      score.innerHTML = `Spins: ${spins} </br> Average Spins: ${round((averageSpins * previousGamesPlayed + spins) / gamesPlayed)} </br> </br> Checks: ${checks} </br> Average Checks: ${round((averageChecks * previousGamesPlayed + checks) / gamesPlayed)} </br> </br> Games Played: ${gamesPlayed}`
      over.appendChild(score)
  
      exit.addEventListener("click", e => {
        over.style.display = "none"
        whole.style.display = "block"
      })
    })
  }
}

check.addEventListener("click", checkRing)