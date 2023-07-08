import { WORDS } from "./words.js";
console.log(WORDS);

let body = document.querySelector("body")
let keywords = [];
let firstKeyword = "";
let centralLetter = "";
let zerothRing = [];
let firstRing = [];
let secondRing = [];
let thirdRing = [];
let letters = [zerothRing, firstRing, secondRing, thirdRing];
let degrees = [300, 0, 60, 120, 180, 240];
let layers = ["third", "second", "first", "zeroth"];
let rings = [];
let solution = [];
let turn = ["counterclockwise", "clockwise"];
let position = ["left", "top", "right", "bottom"];
let arrows = ["triangle-down", "triangle-left", "triangle-up", "triangle-right"];
let ring = 0;
let rotations = 0;
let checks = 0;

const initialize = () => {
  firstKeyword = WORDS[Math.floor(Math.random() * WORDS.length)]
  keywords.push(firstKeyword)
  centralLetter = firstKeyword.charAt(firstKeyword.length-1)
  zerothRing.push(centralLetter)
  for (let i = 1; i < 4; i++){
      letters[i].push(firstKeyword.charAt(3-i))
  }

  for (let i = 1; i < 3; i++){
      let keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
      while (keywords.includes(keyword) || keyword.charAt(keyword.length-1) !== centralLetter){
          keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
      }
      keywords.push(keyword)
      for (let j = 1; j < 4; j++){
          letters[j].push(keyword.charAt(3-j))
      }
  }

  for (let i = 3; i < 6; i++){
      let keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
      while (keywords.includes(keyword) || keyword.charAt(0) !== centralLetter){
          keyword = WORDS[Math.floor(Math.random() * WORDS.length)]
      }
      keywords.push(keyword)
      for (let j = 1; j < 4; j++){
          letters[j].push(keyword.charAt(j))
      }
  }
  solution = JSON.parse(JSON.stringify(letters))

  for (let i = 0; i < letters.length; i++){
      let thisRing = letters[i]
      let rotatedAmount = [Math.floor(Math.random() * thisRing.length)]
      let rotatedRing = thisRing.splice(rotatedAmount, thisRing.length-rotatedAmount)
      let unRotatedRing = []
      for (let j = 0; j < rotatedRing.length; j++){
          unRotatedRing.push(rotatedRing[j])
      }
      for (let j = 0; j < thisRing.length; j++){
          unRotatedRing.push(thisRing[j])
      }
      letters[i] = unRotatedRing
  }
  zerothRing = letters[0]
  firstRing = letters[1]
  secondRing = letters[2]
  thirdRing = letters[3]

  let whole = document.createElement("main")
  body.appendChild(whole)
  let outerRing = document.createElement("div")
  outerRing.className = "ring"
  outerRing.setAttribute("id", "third");
  rings.unshift(outerRing)
  whole.appendChild(outerRing)

  let title = document.createElement("h1")
  title.className = "title"
  title.innerText = "Spinensky"
  whole.prepend(title)
  
  for (let i = 1; i < layers.length; i++){
      let layer = document.createElement("div")
      layer.className = "ring"
      layer.setAttribute("id", layers[i])
      rings.push(layer)
      rings[i-1].appendChild(layer)
  }

  let notes = document.createElement("div")
  notes.className = "notes"
  notes.innerHTML = '<h3><span id="ring-title">???</span> ring</h3></br><p>Rotations <span id="rotations">0</span> Checks <span id="checks">0</span></p><h5 id="check">Check</h5><p id="checked"> </p></br><h5>Spin</h5>'
  whole.appendChild(notes)

  let center = document.createElement("a")
  center.className = "center"
  rings[0].append(center)
  center.innerText = zerothRing[0]

  for (let i = 1; i < letters.length; i++){
      let ring = `ring-${i}-letter`
      for (let j = 0; j < degrees.length; j++){
          let degree = degrees[j]
          let letter = document.createElement("a")
          letter.className = `deg${degree}-${i} ${ring}`
          letter.innerHTML = letters[i][j]
          rings[0].append(letter)
      }
  }

  let buttons = document.createElement("div")
  buttons.className = "buttons"
  whole.append(buttons)

  for (let i = 0; i < turn.length; i++){
      let button = document.createElement("div")
      button.className = `button ${turn[i]}`
      buttons.appendChild(button)
      let tail = document.createElement("div")
      tail.className = `tail ${turn[i]}`
      button.appendChild(tail)
      let middle = document.createElement("div")
      middle.className = `middle ${turn[i]}`
      tail.appendChild(middle)
      for (let j = 0; j < position.length; j++){
          let arrow = document.createElement("div")
          arrow.className = `arrow ${turn[i]} ${position[j]}`
          if (arrow.classList.contains("counterclockwise")){
              arrow.classList.add(`${arrows[j]}`)
          } else if (arrow.classList.contains("clockwise")){
              if (j < 2) {
                  arrow.classList.add(`${arrows[j+2]}`)
              } else if (j > 1) {
                  arrow.classList.add(`${arrows[j-2]}`)
              }
          }
          tail.appendChild(arrow)
      }
  }
}

initialize()

console.log(solution)

const ring_title = document.querySelector("#ring-title")
const counterclockwise = document.querySelectorAll('.counterclockwise');
const clockwise = document.querySelectorAll('.clockwise')
const rotationsText = document.querySelector("#rotations")
const checksText = document.querySelector("#checks")

const rotateCounterClockwise = (event) => {
  let firstLetter = letters[ring][0]
  letters[ring].shift()
  letters[ring].push(firstLetter)
  for (let j = 0; j < degrees.length; j++){
    const degree = degrees[j]
    const letter = document.querySelector(`.deg${degree}-${ring}`)
    console.log(letter)
    letter.innerHTML = letters[ring][j]
  }
  zerothRing = letters[0]
  firstRing = letters[1]
  secondRing = letters[2]
  thirdRing = letters[3]
  rotations++
  rotationsText.innerText = rotations
  event.stopPropagation();
}

const rotateClockwise = (event) => {
  let lastLetter = letters[ring][5]
  letters[ring].pop()
  letters[ring].unshift(lastLetter)
  for (let j = 0; j < degrees.length; j++){
    const degree = degrees[j]
    const letter = document.querySelector(`.deg${degree}-${ring}`)
    console.log(letter)
    letter.innerHTML = letters[ring][j]
  }
  zerothRing = letters[0]
  firstRing = letters[1]
  secondRing = letters[2]
  thirdRing = letters[3]
  rotations++
  rotationsText.innerText = rotations
  event.stopPropagation();
}

document.querySelectorAll('a').forEach(character => {
  character.addEventListener('click', event => {
      if (event.target.classList.contains("center")){
          ring = 0
          ring_title.innerHTML = "???"
          for (let i=0; i<counterclockwise.length; i++){
              counterclockwise[i].removeEventListener("click", rotateCounterClockwise)
          }
          for (let i=0; i<clockwise.length; i++){
              clockwise[i].removeEventListener("click", rotateClockwise)
          }
      } else if (event.target.classList.contains("ring-1-letter")){
          ring = 1
          ring_title.innerHTML = `${layers[3-ring].charAt(0).toUpperCase() + layers[3-ring].slice(1)}`
          // ring_title.innerHTML = "first"
          for (let i=0; i<counterclockwise.length; i++){
              counterclockwise[i].addEventListener("click", rotateCounterClockwise)
          }
          for (let i=0; i<clockwise.length; i++){
              clockwise[i].addEventListener("click", rotateClockwise)
          }
      } else if (event.target.classList.contains("ring-2-letter")){
          ring = 2
          ring_title.innerHTML = `${layers[3-ring].charAt(0).toUpperCase() + layers[3-ring].slice(1)}`
          // ring_title.innerHTML = "second"
          for (let i=0; i<counterclockwise.length; i++){
              counterclockwise[i].addEventListener("click", rotateCounterClockwise)
          }
          for (let i=0; i<clockwise.length; i++){
              clockwise[i].addEventListener("click", rotateClockwise)
          }
      } else if (event.target.classList.contains("ring-3-letter")){
          ring = 3
          ring_title.innerHTML = `${layers[3-ring].charAt(0).toUpperCase() + layers[3-ring].slice(1)}`
          // ring_title.innerHTML = "third"
          for (let i=0; i<counterclockwise.length; i++){
              counterclockwise[i].addEventListener("click", rotateCounterClockwise)
          }
          for (let i=0; i<clockwise.length; i++){
              clockwise[i].addEventListener("click", rotateClockwise)
          }
      }
  }, true)
})

document.querySelectorAll('.ring').forEach(circle => {
  circle.addEventListener('click', event => {
      if (event.target.id !== "zeroth") {
          ring_title.innerHTML = `${event.target.id.charAt(0).toUpperCase() + event.target.id.slice(1)}`
          if (event.target.id === "first"){
              ring = 1
          } else if (event.target.id === "second"){
              ring = 2
          } else if (event.target.id === "third"){
              ring = 3
          }
          for (let i=0; i<counterclockwise.length; i++){
              counterclockwise[i].addEventListener("click", rotateCounterClockwise)
          }
          for (let i=0; i<clockwise.length; i++){
              clockwise[i].addEventListener("click", rotateClockwise)
          }
      } else if (event.target.id === "zeroth"){
          ring_title.innerHTML = "???"
          ring = 0
              for (let i=0; i<counterclockwise.length; i++){
                  counterclockwise[i].removeEventListener("click", rotateCounterClockwise)
              }
              for (let i=0; i<clockwise.length; i++){
                  clockwise[i].removeEventListener("click", rotateClockwise)
              }
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
  } else if ((solution[ring][0] === letters[ring][1] && solution[ring][1] === letters[ring][2] && solution[ring][2] === letters[ring][3] && solution[ring][3] === letters[ring][4] && solution[ring][4] === letters[ring][5] && solution[ring][5] === letters[ring][0]) && ring !== 0 ||
    (solution[ring][0] === letters[ring][5] && solution[ring][1] === letters[ring][0] && solution[ring][2] === letters[ring][1] && solution[ring][3] === letters[ring][2] && solution[ring][4] === letters[ring][3] && solution[ring][5] === letters[ring][4] && ring !== 0)){
    checked.innerHTML = `${ring_title.innerText} ring is off by two`
  } else if ((solution[ring][0] === letters[ring][2] && solution[ring][1] === letters[ring][3] && solution[ring][2] === letters[ring][4] && solution[ring][3] === letters[ring][5] && solution[ring][4] === letters[ring][0] && solution[ring][5] === letters[ring][1]) && ring !== 0 ||
    (solution[ring][0] === letters[ring][4] && solution[ring][1] === letters[ring][5] && solution[ring][2] === letters[ring][0] && solution[ring][3] === letters[ring][1] && solution[ring][4] === letters[ring][2] && solution[ring][5] === letters[ring][3] && ring !== 0)){
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