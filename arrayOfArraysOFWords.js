import { WORDS } from "./words.js";

const arraysOfWords = []
const hasArraysOfWords = localStorage.getItem("storedArraysOfWords")
const parsedArraysOfWords = JSON.parse(hasArraysOfWords)
const arraysOfSpunLetters = []
const hasArraysOfSpunLetters = localStorage.getItem("storedArraysOfSpunLetters")
const parsedArraysOfSpunLetters = JSON.parse(hasArraysOfSpunLetters)

for (let i = 0; i < 100; i++) {

  const keywords = [];
  let firstKeyword = "";
  let centralLetter = "";
  let zerothRing = [];
  let innerRing = [];
  let middleRing = [];
  let outerRing = [];
  const letters = [zerothRing, innerRing, middleRing, outerRing];
  const layers = ["outer", "middle", "inner", "zeroth"];
  const rings = [];
  let solution = [];
  
  const allRingsEqual = () => {
    zerothRing = letters[0]
    innerRing = letters[1]
    middleRing = letters[2]
    outerRing = letters[3]
  }
  
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
    
  arraysOfWords.push(solution)
  arraysOfSpunLetters.push(letters)
}

console.log(arraysOfWords)
console.log(arraysOfSpunLetters)

const newArraysOfWords = JSON.stringify(arraysOfWords.concat(parsedArraysOfWords))
localStorage.setItem("storedArraysOfWords", newArraysOfWords)
const newArraysOfSpunLetters = JSON.stringify(arraysOfSpunLetters.concat(parsedArraysOfSpunLetters))
localStorage.setItem("storedArraysOfSpunLetters", newArraysOfSpunLetters)