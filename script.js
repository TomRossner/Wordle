import { WORDS } from "./words.js";
const tilesContainer = document.querySelector(".tiles-container");
const keyboard = document.querySelectorAll(".kb-button");
const message = document.querySelector(".message");
let currentRow = 0;
let currentGuess = 0;
let correctWord = WORDS[Math.floor(Math.random() * WORDS.length)];
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
displayMessage("start");
const resetButton = document.querySelector(".reset");
disableElement(resetButton);

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.setAttribute("id", `guessRow-${guessRowIndex}`);
    rowElement.classList.add("row");
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement("div");
        tileElement.setAttribute("id", `guessRow-${guessRowIndex}-tile-${guessIndex}`);
        tileElement.classList.add("tile");
        rowElement.append(tileElement);
    })
    tilesContainer.append(rowElement);
})


// Event Listeners

keyboard.forEach((button) => {button.addEventListener("click", checkButton);})
    
window.addEventListener("keydown", checkKey);

resetButton.addEventListener("click", () => {
    const audio = new Audio("./audio/PopSound.mp3");
    audio.play();
    reset();
})



// Functions

function checkButton(){ // On-screen keyboard
    if(isGameOver === true){return;}
    if(this.innerText.length === 1){
        const audio = new Audio("./audio/PopSound.mp3");
        audio.play();
        let letter = this.textContent.toUpperCase();
        if(currentTile < correctWord.length){
            addLetter(letter);
            return;
        }
    }
    if(this.textContent === "del"){
        deleteLetter();
        return;
    }
    if(this.textContent === "enter" && currentTile === correctWord.length){
        let guessedWord = guessRows[currentRow].join("").toLowerCase();
        if(!WORDS.includes(guessedWord)){
            const shakeAudio = new Audio("./audio/invalidAudio.mp3");
            shakeAudio.play();
            shakeTiles();
            displayMessage("invalid");
            return;
        }
        checkRow();
        disableElement(message);
        currentTile = 0;
        currentGuess += 1;
        return;
    }
    if(this.textContent === "enter" && currentTile === 0){
        const emptyAudio = new Audio("./audio/emptyAudio.mp3");
        emptyAudio.play();
        displayMessage("empty");
        return;
    }
    if(this.textContent === "enter" && currentTile < correctWord.length){
        const shakeAudio = new Audio("./audio/invalidAudio.mp3");
        shakeAudio.play();
        shakeTiles();
        displayMessage("short");
        return;
    }
    window.focus();
}

function checkKey(event){ // Keyboard
    if(event.key === "Backspace"){
        deleteLetter();
        return;
    }
    if(event.key === "Enter" && isGameOver === true){
        return;
    }
    if(event.key === "Enter" && currentTile === correctWord.length){
        let guessedWord = guessRows[currentRow].join("").toLowerCase();
        if(!WORDS.includes(guessedWord)){
            const shakeAudio = new Audio("./audio/invalidAudio.mp3");
            shakeAudio.play();
            shakeTiles();
            displayMessage("invalid");
            return;
        }
        checkRow();
        disableElement(message);
        currentTile = 0;
        currentGuess ++; 
        return;
    }
    if(event.key === "Enter" && currentTile === 0){
        const emptyAudio = new Audio("./audio/emptyAudio.mp3");
        emptyAudio.play();
        displayMessage("empty");
        return;
    }
    if(event.key === "Enter" && currentTile < correctWord.length){
        const shakeAudio = new Audio("./audio/invalidAudio.mp3");
        shakeAudio.play();
        shakeTiles();
        displayMessage("short");
        return;
    }
    if(/[a-zA-Z]/.test(event.key) && event.key.length === 1){
        if(isGameOver === true){return;}
        let pressedKey = event.key.toUpperCase();
        if(currentTile <= correctWord.length){
            const audio = new Audio("./audio/PopSound.mp3");
            audio.play();
            addLetter(pressedKey);
        }
    }
    window.focus();
}

function addLetter(key){
    if(currentTile < 5 && currentRow < maxGuesses){
        const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`);
        tile.innerHTML = key;
        tile.setAttribute("data", key);
        tile.classList.add("filled");
        tile.style.animation = "filledTile 0.1s forwards";
        tile.addEventListener("animationend", () => {
            tile.style.animation = "";
        })
        guessRows[currentRow][currentTile] = key;
        currentTile++;
    }
}

function deleteLetter(){
    if(currentTile > 0){
        currentTile--;
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
        const winAudio = new Audio("./audio/winAudio.mp3");
        winAudio.play();
        let delay = 0;
        for(let i = 0; i < rowTiles.length; i++){
            rowTiles[i].style.animation = "win 1.3s forwards";
            rowTiles[i].style.animationDelay = `${delay}s`;
            rowTiles[i].style.transitionDelay = `${delay}s`;
            rowTiles[i].classList.add("green");
            delay += 0.1;
            isGameOver = true;
        }
        setTimeout(() => {
            const title = document.querySelector(".title");
            title.style.animation = "titleSlide 0.3s forwards";
        }, 2400);
        setTimeout(() => {
            if(isGameOver === true){
                enableElement(resetButton);
                resetButton.style.animation = "scaleButton 1s infinite";
            }else disableElement(resetButton);
        }, 2500);
        displayMessage("correct");
        return;   
    }
    else if(guessedWord !== correctWord){
        checkLetters(guessedWord);
    }
    
    if(currentRow < maxGuesses && isGameOver === false){
        currentRow++;
        currentTile = 0;
    }else return;
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
                    // if(keyboard[i].textContent === guessedLetter && guessedLetter === correctLetter){
                    //     setColors("green", keyboard[i]);
                    // }
                    // if(keyboard[i].textContent === guessedLetter && guessedLetter !== correctLetter){
                    //     setColors("yellow", keyboard[i]);
                    // }
                    if(keyboard[i].textContent === guessedLetter && !correctWord.includes(guessedLetter)){
                        setColors("gray", keyboard[i]);
                    }
                }
            }, 1500);
        }, 500);
    }
    setTimeout(() => {
            if(currentGuess === maxGuesses){
                setTimeout(() => {
                    const gameOverAudio = new Audio("./audio/GameOverSound.mp3");
                    gameOverAudio.play();
                }, 300);
                const title = document.querySelector(".title");
                title.style.animation = "titleSlide 0.3s forwards";
                enableElement(resetButton);
                resetButton.style.animation = "scaleButton 1s infinite";
                setTimeout(() => {
                    displayMessage("game-over");
                }, 500);
                return;
            }
        }, 1600);
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

function displayMessage(state){
    if(state === "start"){
        const message = document.querySelector(".message");
        message.textContent = `Start by entering a 5-letter word`;
        message.style.color = "rgb(105, 143, 146)";
        setTimeout(() => {
            message.style.opacity = "1";
        }, 500);
        return;
    }

    if(state === "game-over"){
        const message = document.querySelector(".message");
        message.innerHTML = `<p>GAME OVER!<br>The word was ${correctWord.toUpperCase()}</p>`;
        message.style.fontWeight = "bolder";
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
        message.textContent = `Awesome! You found the word!`;
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

    if(state === "empty"){
        const message = document.querySelector(".message");
        message.textContent = `You must enter a word!`;
        message.style.color = "rgb(255, 89, 94)";
        message.style.animation = `messageDisplay 3s forwards`;
        message.addEventListener("animationend", () =>{
            message.style.animation = "";
        })
        return;
    }
}

function shakeTiles(){
    const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`);
    for(let i = 0; i < rowTiles.length; i++){
        if(rowTiles[i].classList.contains("filled")){
            rowTiles[i].style.animation = "shakeLetters 0.3s forwards";
        }
    }
}

function reset(){
    currentTile = 0;
    currentRow = 0;
    currentGuess = 0;
    correctWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log(correctWord);
    const filledTiles = document.querySelectorAll(".filled");
    const keyboard = document.querySelectorAll(".kb-button");
    const message = document.querySelector(".message");
    displayMessage("start");
    const title = document.querySelector(".title");
    for(let tile of filledTiles){
        tile.classList.remove("filled", "green", "yellow", "gray");
        tile.textContent = "";
        tile.style.transitionDelay = "";
        tile.style.animationDelay = "";
        tile.style.animation = "";
    }
    for(let key of keyboard){
        key.classList.remove("gray", "yellow", "green");
    }
    isGameOver = false;
    setTimeout(() => {
        disableElement(resetButton);
        setTimeout(() => {
            title.style.animation = "titleSlideReverse 0.3s forwards";
        }, 200);
    }, 100);
    resetButton.blur();
}

function disableElement(element){
    element.style.pointerEvents = "none";
    element.style.opacity = 0;
    element.style.transition = "opacity 0.1s";
    element.blur();
}

function enableElement(element){
    element.style.pointerEvents = "all";
    element.style.opacity = 1;
    element.style.transition = "opacity 0.3s";
}