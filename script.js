import { WORDS } from "./words.js";
const tilesContainer = document.querySelector(".tiles-container");
const keyboard = document.querySelectorAll(".kb-button");
let currentRow = 0;
let currentGuess = 0;
const correctWord = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(correctWord);
let isGameOver = false;
const maxGuesses = 6;
const guessRows = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
];
let currentTile = 0;

keyboard.forEach((button) => {
    button.addEventListener("click", () => {
        if(isGameOver === true){return;}
        if(button.innerText.length === 1){
            let letter = button.textContent.toUpperCase();
            if(currentTile < correctWord.length){
                addLetter(letter);
                return
            }
        }
        if(button.textContent === "del"){
            deleteLetter();
            return;
        }
        if(button.textContent === "enter" && currentTile === correctWord.length){
            let guessedWord = guessRows[currentRow].join("").toLowerCase();
            if(!WORDS.includes(guessedWord)){
                displayMessage("invalid");
                return;
            }
            checkRow()
            currentTile = 0;
            currentGuess += 1;
            return;
        }
        if(button.textContent === "enter" && currentTile < correctWord.length){
            displayMessage("short");
            return;
        }
    })
})

document.addEventListener("keyup", function checkKey (event){
    if(event.key === "Backspace"){
        deleteLetter();
        return;
    }
    if(event.key === "Enter" && currentTile === correctWord.length){
        let guessedWord = guessRows[currentRow].join("").toLowerCase();
        if(!WORDS.includes(guessedWord)){
            displayMessage("invalid");
            return;
        }
        checkRow();
        currentTile = 0;
        currentGuess ++; 
        return;
    }
    if(event.key === "Enter" && currentTile < correctWord.length){
        if(event.key === "Enter" && isGameOver === true){
            return;
        }
        displayMessage("short");
        return;
    }
    if(/[a-zA-Z]/.test(event.key) && event.key.length === 1){
        if(isGameOver === true){return;}
        let pressedKey = event.key.toUpperCase();
        if(currentTile <= correctWord.length){
            addLetter(pressedKey);
        }
    }
})

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
    rowElement.classList.add("row");
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement("div");
        tileElement.setAttribute("id", "guessRow-" + guessRowIndex + "-tile-" + guessIndex);
        tileElement.classList.add("tile");
        rowElement.append(tileElement);
    })
    tilesContainer.append(rowElement);
})

function addLetter(key){
    if(currentTile < 5 && currentRow < maxGuesses){
        const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`);
        console.log(tile)
        tile.innerHTML = key;
        tile.setAttribute("data", key);
        tile.classList.add("filled");
        tile.style.animation = "filledTile 0.1s forwards";
        tile.addEventListener("animationend", () => {
            tile.style.animation = null;
        })
        guessRows[currentRow][currentTile] = key;
        currentTile++
    }
}

function deleteLetter(){
    if(currentTile > 0){
        currentTile--
        const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`);
        tile.innerHTML = "";
        tile.setAttribute("data", "");
        tile.classList.remove("filled");
        guessRows[currentRow][currentTile] = "";
    }
}

function checkRow(){
   if(currentTile === correctWord.length){
    let guessedWord = guessRows[currentRow].join("").toLowerCase();
    const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
    console.log(guessedWord);
    if(guessedWord === correctWord){
        let delay = 0;
        for(let i = 0; i < rowTiles.length; i++){
            rowTiles[i].style.animation = "win 1.3s forwards";
            rowTiles[i].style.animationDelay = `${delay}s`;
            rowTiles[i].style.transitionDelay = `${delay}s`;
            rowTiles[i].classList.add("green");
            delay += 0.1;
            isGameOver = true;
        }
        displayMessage("correct");
        return;   
    }
    else if(guessedWord !== correctWord){
        checkLetters(guessedWord);
    }
    
    if(currentRow < maxGuesses && isGameOver === false){
        currentRow++
        currentTile = 0;
    }else return;
   }
}

function setColors(color, tile){
    if(color === "green"){
        tile.classList.add("green");
        
    }
    if(color === "yellow"){
        tile.classList.add("yellow");
    }
    if(color === "gray"){
        tile.classList.add("gray");
    }
}

function checkLetters(word){
    const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
    let delay = 0;
    for(let i = 0; i < word.length ; i++){
        rowTiles[i].style.animation = "letterReveal 1s forwards";
        rowTiles[i].style.animationDelay = `${delay}s`;
        rowTiles[i].style.transitionDelay = `${delay}s`;
        let guessedLetter = word[i].toLowerCase();
        let correctLetter = correctWord[i];
        delay += 0.4;
        setTimeout(() => {
            if(correctWord.includes(guessedLetter) && guessedLetter === correctLetter){
                setColors("green", rowTiles[i]);
            }
            if(correctWord.includes(guessedLetter) && guessedLetter !== correctLetter){
                setColors("yellow", rowTiles[i]);
            }
            if(!correctWord.includes(guessedLetter)){
                setColors("gray", rowTiles[i]);
            }
            setTimeout(() => {
                for(let i = 0; i < keyboard.length; i++){
                    if(keyboard[i].textContent === guessedLetter && guessedLetter === correctLetter){
                        setColors("green", keyboard[i]);
                    }
                    if(keyboard[i].textContent === guessedLetter && guessedLetter !== correctLetter){
                        setColors("yellow", keyboard[i]);
                    }
                    if(keyboard[i].textContent === guessedLetter && !correctWord.includes(guessedLetter)){
                        setColors("gray", keyboard[i]);
                    }
                }
            }, 1500);
        }, 500);
    }
    setTimeout(() => {
            if(currentGuess === maxGuesses){
                displayMessage("game-over");
                return;
            }
        }, 2000);
}

function displayMessage(state){
    if(state === "game-over"){
        const message = document.querySelector(".message");
        message.textContent = `GAME OVER! The correct word was ${correctWord.toUpperCase()}`;
        message.style.color = "rgb(255, 89, 94)";
        setTimeout(() => {
            message.style.opacity = "1";
        }, 500);
        return;
    }

    if(state === "invalid"){
        const message = document.querySelector(".message");
        message.textContent = `This word doesn't exist`;
        message.style.color = "rgb(255, 89, 94)";
        message.style.animation = `messageDisplay 3s forwards`;
        message.addEventListener("animationend", () =>{
            message.style.animation = "";
        })
        return;
    }

    if(state === "correct"){
        const message = document.querySelector(".message");
        message.textContent = `Bravo! You found the word!`;
        message.style.color = "rgb(138, 201, 38)";
        setTimeout(() => {
            message.style.opacity = "1";
        }, 500);
        return;
    }
    if(state === "correct" && isGameOver === true){
        const message = document.querySelector(".message");
        message.textContent = `Bravo! You found the word!`;
        message.style.color = "rgb(138, 201, 38)";
        setTimeout(() => {
            message.style.opacity = "1";
        }, 500);
        return;
    }

    if(state === "short"){
        const message = document.querySelector(".message");
        message.textContent = `Too short!`;
        message.style.color = "rgb(255, 89, 94)";
        message.style.animation = `messageDisplay 3s forwards`;
        message.addEventListener("animationend", () =>{
            message.style.animation = "";
        })
        return;
    }
}