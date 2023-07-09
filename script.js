import { WORDS } from "./words.js";

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

const allRingsEqual = () => {
  zerothRing = letters[0]
  innerRing = letters[1]
  middleRing = letters[2]
  outerRing = letters[3]
}

const initialize = () => {
  const havePlayedBefore = localStorage.getItem("playedBefore")
  if (havePlayedBefore) {
    playedBefore = true
  }
  const start = document.createElement("section")
  if (playedBefore === false) {
    body.appendChild(start)
  }
  const startTitle = document.createElement("h1")
  startTitle.className = "start-title"
  startTitle.innerText = "Spinensky"
  start.appendChild(startTitle)
  const exit = document.createElement("div")
  exit.innerText = "x"
  exit.className = "exit"
  start.appendChild(exit)
  const info = document.createElement("p")
  info.className = "info"
  info.innerHTML = `Spin rings of letters in order to unscramble four-letter words using as few spins as possible. The central letter is the last letter of the words on the left and the first letter of the words on the right. </br> </br> Click on a ring to select it, then spin it counterclockwise or clockwise by clicking the button with that symbol. Click "Check" to see how close that ring is to the correct position. </br> </br> If you click "Check" when all of the rings are in the correct position, you beat the round. There are three rounds: two-words, four-words, and six-words. </br> </br> Have fun!`
  start.appendChild(info)

  firstKeyword = WORDS[Math.floor(Math.random() * WORDS.length)]
  keywords.push(firstKeyword)
  centralLetter = firstKeyword.charAt(firstKeyword.length - 1)
  zerothRing.push(centralLetter)
  for (let i = 1; i < layers.length; i++) {
    letters[i].push(firstKeyword.charAt(3 - i))
  }

  for (let i = 1; i < 3; i++) {
    let keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
    while (keywords.includes(keyword) || keyword.charAt(keyword.length - 1) !== centralLetter) {
      keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
    }
    keywords.push(keyword)
    for (let j = 1; j < 4; j++) {
      letters[j].push(keyword.charAt(3 - j))
    }
  }

  for (let i = 3; i < 6; i++) {
    let keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
    while (keywords.includes(keyword) || keyword.charAt(0) !== centralLetter) {
      keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
    }
    keywords.push(keyword)
    for (let j = 1; j < 4; j++) {
      letters[j].push(keyword.charAt(j))
    }
  }
  solution = JSON.parse(JSON.stringify(letters))

  for (let i = 0; i < letters.length; i++) {
    const thisRing = letters[i]
    const rotatedAmount = [Math.floor(Math.random() * thisRing.length)]
    const rotatedRing = thisRing.splice(rotatedAmount, thisRing.length - rotatedAmount)
    const newRing = []
    for (let j = 0; j < rotatedRing.length; j++) {
      newRing.push(rotatedRing[j])
    }
    for (let j = 0; j < thisRing.length; j++) {
      newRing.push(thisRing[j])
    }
    letters[i] = newRing
  }
  allRingsEqual()

  const whole = document.createElement("main")
  if (playedBefore === true) {
    whole.style.display = "block"
  }
  body.appendChild(whole)
  const outerRing = document.createElement("div")
  outerRing.className = "ring"
  outerRing.setAttribute("id", `${layers[0]}`);
  rings.unshift(outerRing)
  whole.appendChild(outerRing)

  const title = document.createElement("h1")
  title.className = "title"
  title.innerText = "Spinensky"
  whole.prepend(title)
  
  for (let i = 1; i < layers.length; i++) {
    const layer = document.createElement("div")
    layer.className = "ring"
    layer.setAttribute("id", layers[i])
    rings.push(layer)
    rings[i - 1].appendChild(layer)
  }

  const notes = document.createElement("div")
  notes.className = "notes"
  notes.innerHTML = '<h3><span id="ring-title">Click on a</span> ring</h3></br><p>Spins: <span id="spins">0</span> Checks: <span id="checks">0</span></p><h5 id="check">Check</h5><p id="checked"> </p></br><h5>Spin</h5>'
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
  sleep(750).then(() => {
    animatedLetter.innerHTML = ""
    letter.innerHTML = letters[ring][d].toUpperCase()
  })
}

const rotateFinish = (event) => {
  allRingsEqual()
  spins++
  spinsText.innerText = spins
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
    if (event.target.classList.contains("center")){
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

const checkRing = () => {
  let right = true
  for (let i = 1; i < letters.length; i++) {
    if (letters[i][0] !== solution[i][3] || letters[i][1] !== solution[i][4] || letters[i][2] !== solution[i][5] || letters[i][3] !== solution[i][0] || letters[i][4] !== solution[i][1] || letters[i][5] !== solution[i][2]) {
      right = false
    }
  }
  if (right === true) {
    checked.innerHTML = "You win!"
  } else if (solution[ring][0] === letters[ring][0] && solution[ring][1] === letters[ring][1] && solution[ring][2] === letters[ring][2] && solution[ring][3] === letters[ring][3] && solution[ring][4] === letters[ring][4] && solution[ring][5] === letters[ring][5] && ring !== 0){
      checked.innerHTML = `${ring_title.innerText} ring is off by three`
  } else if ((solution[ring][0] === letters[ring][1] && solution[ring][1] === letters[ring][2] && solution[ring][2] === letters[ring][3] && solution[ring][3] === letters[ring][4] && solution[ring][4] === letters[ring][5] && solution[ring][5] === letters[ring][0]) && ring !== 0 || (solution[ring][0] === letters[ring][5] && solution[ring][1] === letters[ring][0] && solution[ring][2] === letters[ring][1] && solution[ring][3] === letters[ring][2] && solution[ring][4] === letters[ring][3] && solution[ring][5] === letters[ring][4] && ring !== 0)){
    checked.innerHTML = `${ring_title.innerText} ring is off by two`
  } else if ((solution[ring][0] === letters[ring][2] && solution[ring][1] === letters[ring][3] && solution[ring][2] === letters[ring][4] && solution[ring][3] === letters[ring][5] && solution[ring][4] === letters[ring][0] && solution[ring][5] === letters[ring][1]) && ring !== 0 || (solution[ring][0] === letters[ring][4] && solution[ring][1] === letters[ring][5] && solution[ring][2] === letters[ring][0] && solution[ring][3] === letters[ring][1] && solution[ring][4] === letters[ring][2] && solution[ring][5] === letters[ring][3] && ring !== 0)){
    checked.innerHTML = `${ring_title.innerText} ring is off by one`
  } else if (solution[ring][0] === letters[ring][3] && solution[ring][1] === letters[ring][4] && solution[ring][2] === letters[ring][5] && solution[ring][3] === letters[ring][0] && solution[ring][4] === letters[ring][1] && solution[ring][5] === letters[ring][2] && ring !== 0){
      checked.innerHTML = `${ring_title.innerText} ring is right`
  }
  if (ring !== 0) {
    checks++
    checksText.innerText = checks
  }
}

check.addEventListener("click", checkRing)