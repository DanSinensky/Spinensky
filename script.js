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
          letter.innerText = letters[i][j]
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