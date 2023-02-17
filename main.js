let canvas = document.querySelector("#game");
let context = canvas.getContext("2d");
let interfaceContainer = document.querySelector(".interfaceContainer");
let statContainer = document.querySelector(".statContainer");
let streakContainer = statContainer.querySelector("#streakContainer");
let scoreContainer = statContainer.querySelector("#scoreContainer");
let streakText = streakContainer.querySelector("#streak");
let scoreText = scoreContainer.querySelector("#score");
let titleBG = document.querySelector("#titleBG");
let gameTitle = document.querySelector(".title");
let playText = document.querySelector(".playText");
let infoButton = document.querySelector("#infoButton");
let htpButton = document.querySelector("#htpButton");
let infoBox = document.querySelector("#infoBox");
let htpBox = document.querySelector("#htpBox");

let screenHeight = window.innerHeight * 0.9;

let pixelSideLength = Math.floor(screenHeight / 15);

canvas.width = pixelSideLength * 20;
canvas.height = pixelSideLength * 15;
context.imageSmoothingEnabled = false;
canvas.setAttribute("style", `outline: ${pixelSideLength / 3}px double white;`);

gameTitle.style.fontSize = `${pixelSideLength * 3}px`;
gameTitle.style.letterSpacing = `${pixelSideLength / 5}px`;
gameTitle.querySelector("span").style.fontSize = `${pixelSideLength * 2}px`;
gameTitle.querySelector("span").style.letterSpacing = `${pixelSideLength / 2.1}px`;
titleBG.style.height = interfaceContainer.style.height = `${canvas.getAttribute("height")}px`;
titleBG.style.width = interfaceContainer.style.width = `${canvas.getAttribute("width")}px`;

playText.style.fontSize = `${pixelSideLength * 1.5}px`;

scoreContainer.style.padding = streakContainer.style.padding = `${pixelSideLength / 2}px`;
scoreContainer.style.fontSize = streakContainer.style.fontSize = `${pixelSideLength}px`;
playText.style.letterSpacing = scoreContainer.style.letterSpacing = streakContainer.style.letterSpacing = `${pixelSideLength / 10}px`;

htpButton.style.fontSize = infoButton.style.fontSize = `${pixelSideLength / 1.75}px`;
htpBox.style.letterSpacing = infoBox.style.letterSpacing = htpButton.style.letterSpacing = infoButton.style.letterSpacing = `${pixelSideLength / 20}px`;
htpButton.style.margin = infoButton.style.margin = htpButton.style.padding = infoButton.style.padding = `${pixelSideLength / 3}px`;
htpBox.style.border = infoBox.style.border = htpButton.style.border = infoButton.style.border = `${pixelSideLength / 3}px double white`;

htpBox.style.fontSize = infoBox.style.fontSize = `${pixelSideLength / 1.85}px`;
htpBox.style.padding = infoBox.style.padding = `${pixelSideLength / 3}px`;
htpBox.style.height = infoBox.style.height = `${pixelSideLength * 13}px`;
htpBox.style.width = infoBox.style.width = `${pixelSideLength * 8}px`;

document.querySelector("#date").style.fontSize = document.querySelector("#place").style.fontSize = `${pixelSideLength / 2}px`;

let titleTransitioning = false;
let boxInDisplay = false;
let interact = true;

document.addEventListener("keydown", function play(e){
    if(e.key.toLowerCase() == "enter" && boxInDisplay == false){
        titleTransitioning = true;
        playText.remove();
        htpButton.style.opacity = infoButton.style.opacity = gameTitle.style.opacity = titleBG.style.opacity = 0;
        titleBG.addEventListener("transitionend", () => {
            titleTransitioning = false;
            titleBG.remove();
            gameTitle.remove();
            infoButton.remove();
            htpButton.remove();
            infoBox.remove();
            htpBox.remove();
            interact = false;
        });
    };
});

let infoBoxOpen = false;
let htpBoxOpen = false;

infoButton.addEventListener("click", () => {
    if(titleTransitioning == false){
        if(infoBoxOpen == false){
            boxInDisplay = true;
            if(htpBoxOpen == true){
                htpBoxOpen = false;
                htpBox.style.display = "none";
            };
            infoBoxOpen = true;
            infoBox.style.display = "flex";
            playText.style.display = "none";
        } else {
            boxInDisplay = false;
            infoBoxOpen = false;
            infoBox.style.display = "none";
            playText.style.display = "block";
        };
    };
});

htpButton.addEventListener("click", () => {
    if(titleTransitioning == false){
        if(htpBoxOpen == false){
            boxInDisplay = true;
            if(infoBoxOpen == true){
                infoBoxOpen = false;
                infoBox.style.display = "none";
            };
            htpBoxOpen = true;
            htpBox.style.display = "flex";
            playText.style.display = "none";
        } else {
            boxInDisplay = false;
            htpBoxOpen = false;
            htpBox.style.display = "none";
            playText.style.display = "block";
        };
    };
});

let streak = 0;
let score = 0;
let multiplier = 1;

let [isRightPressed, isLeftPressed, isSpacePressed] = [false, false, false];

document.addEventListener("keydown", (e) => {
    let key = e.key;
    if((key.toLowerCase() == "arrowright" || key.toLowerCase() == "d") && isRightPressed == false && interact == false){
        isRightPressed = true;
        move("right");
    } else if((key.toLowerCase() == "arrowleft" || key.toLowerCase() == "a") && isLeftPressed == false && interact == false){
        isLeftPressed = true;
        move("left");
    };
});

document.addEventListener("keyup", (e) => {
    let key = e.key;
    if((key.toLowerCase() == "arrowright" || key.toLowerCase() == "d") && isRightPressed == true){
        isRightPressed = false;
    } else if((key.toLowerCase() == "arrowleft" || key.toLowerCase() == "a") && isLeftPressed == true){
        isLeftPressed = false;
    };
});

let [p, c, m, b] = ["computing", "chemistry", "math", "boss"];

/*
 var = interactable
   0 = empty
   1 = player
   2 = collision
   3 = teleporter #1
   4 = teleporter #2
   5 = end
*/

let grids = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, p, 0, 0, 0, 0, 0, p, 2, 2], 
        [0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, p, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 2, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, p, 0, 0, 0], 
        [2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, p, 2, 2, 2, 0, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, p, 0, 0, 0, 0, 2, 2], 
        [2, 0, p, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 0], 
        [2, 2, 2, 0, 0, 0, 0, 0, p, 2, 2, 0, 0, 2, 2, 0, 2, 2, 0, 0], 
        [0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0], 
        [0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, p, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, p, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 2, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, p, 0, 2], 
        [2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, p, 2, 2, 2, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 0, 0, 0, 0, p, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], 
        [0, 2, 2, 0, 0, 2, 2, 2, 2, 0, p, 0, 0, 0, 0, 0, p, 0, 2, 2], 
        [0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, c, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 0, 0, 0, c, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0], 
        [0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2], 
        [0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, c, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, c, 2, 2, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0], 
        [2, 0, 0, 0, 0, 0, 0, 2, 2, 0, c, 2, 2, 0, 0, 0, 2, 2, 0, 0], 
        [2, 2, 0, 0, c, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2], 
        [0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, c, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, c, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 2, 0, c, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, c, 0, 0], 
        [0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0], 
        [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, c, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, c, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0], 
        [2, 2, 0, 0, c, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2], 
        [0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, c, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0], 
        [2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, c, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, 0, 0, 0, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, m, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0], 
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, m, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, m, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 0, 0, m, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 2, 2, 2, 2, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 0, 0, 0, m, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 2, 2, 2, 2, 2, 2, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, m, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, m, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, 2, 2, 2, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, 0, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m, 0, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0], 
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0], 
        [0, 2, 2, 2, 2, 0, 0, m, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, m, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], 
        [2, 0, m, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 2, 2, 0, m, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
];
let initialGrids = JSON.parse(JSON.stringify(grids));

let [startQuestion, degrees, piSymbol, nthRoot, division] = ["\u00BF", "\u00B0", "\u03C0", "\u221A", "\u00F7"];
let [aAccent, eAccent, iAccent, oAccent, uAccent, nTilde] = ["\u00E1", "\u00E9", "\u00ED", "\u00F3", "\u00FA", "\u00F1"];
let [AAccent, EAccent, IAccent, OAccent, UAccent, NTilde] = ["\u00C1", "\u00C9", "\u00CD", "\u00D3", "\u00DA", "\u00D1"];
let [oneSuperscript, twoSuperscript, threeSuperscript, fourSuperscript, fiveSuperscript, sixSuperscript, sevenSuperscript, eightSuperscript, nineSuperscript] = ["\u00B9", "\u00B2", "\u00B3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079"];
let [oneSubscript, twoSubscript, threeSubscript, fourSubscript, fiveSubscript, sixSubscript, sevenSubscript, eightSubscript, nineSubscript] = ["\u2081", "\u2082", "\u2083", "\u2084", "\u2085", "\u2086", "\u2087", "\u2088", "\u2089"];

function randomDialogue(){
    let rng = Math.floor(Math.random() * godsDialogues.length);
    return godsDialogues[rng];
};

let godsEncounter = `(Escuchas una voz resonar en tu cabeza, que demanda una respuesta)`;
let godsDialogues = [
    `Buscas el saber definitivo. ${startQuestion}Eres digno de tal poder? Demu${eAccent}stralo:`,
    `El saber no lo es todo, siempre es bueno el conocer, el entender:`,
    `Habla, humano. Responde con elegancia y certeza:`,
    `Saber es una maldici${oAccent}n, en cierto sentido. Tu trabajo es entender c${oAccent}mo convertirlo en una bendici${oAccent}n:`,
    `Mira hacia el pasado, observa tus victorias y tus derrotas. Conoce tus fortalezas y debilidades en el presente. S${oAccent}lo as${iAccent} ser${aAccent}s capaz de prever el futuro:`,
    `Tu camino nunca es asegurado. Mant${eAccent}n tu pensar, sin caer en la ilusi${oAccent}n de la victoria. As${iAccent} obtendr${aAccent}s lo que deseas:`,
    `Si no eres un buen aprendiz, nunca ser${aAccent}s un buen maestro. El camino que seguir${aAccent}s est${aAccent} ${uAccent}nicamente en tus manos:`,
    `Contempla. Piensa. Conoce. Comprende. S${oAccent}lo as${iAccent} podr${aAccent}s saber:`,
    `Busca lo que quieres, pero atesora lo que tienes. Convi${eAccent}rtete en lo que obtienes, el conocimiento:`,
    `El saber tiene el poder de corromper. Es de tu propia voluntad si eso es lo que ocurre o no:`
];
let dialogues = [
    [
        [
            `Hola, valiente joven, ${startQuestion}Est${aAccent}s en busca del saber? Te esperan grandes retos por superar en tu aventura.`,
            `Veamos si en realidad eres digno de tal conocimiento. Empezemos con una simple pregunta.`
        ],
        [
            `Has respondido correctamente, te felicito. Pero a${uAccent}n hay un gran camino por recorrer.`,
            `Los dioses han reconocido tu valor. Durante tu aventura, te pondr${aAccent}n a prueba repetidamente hasta que te consideren digno del sagrado conocimiento.`,
            `Solo para asegurarse... Responde la siguiente pregunta, y dejar${eAccent} que embarques en tu aventura.`
        ]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()]
    ],
    [
        [`Has hecho bien, tu aventura continua, viajero.`],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [
            `S${iAccent} que pareces todo un conocedor, ${startQuestion}ser${aAccent} cierto?`,
            `Te acercas al final de la primera prueba. No temas, que los dioses te guiar${aAccent}n hacia lo que quieres, si es que conquistas sus desaf${iAccent}os.`
        ]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [
            `Superaste mis expectativas, pero a${uAccent}n no has satisfecho a los dioses. Te llevar${eAccent} al lugar de la segunda prueba.`,
            `Donde tu sed de conocimiento realmente arder${aAccent}, si es que no llegas a saciarla. S${iAccent}gueme, o r${iAccent}ndete ahora mismo. Es tu decisi${oAccent}n.`,
            `Responde la siguiente pregunta, y estar${aAccent} claro el camino que deseas caminar.`
        ]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [`Tu conocimiento es admirable, demu${eAccent}stralo. Sigue as${iAccent}.`,],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [
            `Tus capacidades de l${oAccent}gica y deducci${oAccent}n son sorprendentes. Haz uso de ellas sabiamente.`,
            `No dudo en que superar${aAccent}s esta prueba muy pronto. Eres algo excepcional, pero esto no acaba ahora. Contin${uAccent}a.`
        ],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [
            `Si${eAccent}ntete orgulloso por haber llegado a este punto. A${uAccent}n hay una prueba m${aAccent}s que te espera.`,
            `De nuevo, te pregunto, ${startQuestion}seguir${aAccent}s por este camino? No hay vuelta atr${aAccent}s, si decepcionas a los dioses, no acudir${aAccent}n a tus llamados.`,
            `Dime, ${startQuestion}est${aAccent}s listo en realidad? Te llevar${eAccent} a la tercera prueba si contestas correctamente de nuevo.`
        ]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()]
    ],
    [
        [
            `Parece que has encontrado un artefacto antiguo. Se rumora que tienen el poder de la teletransportaci${oAccent}n.`,
            `Desconozco de alguna otra manera por la que puedas proseguir. Con un poco de suerte, tal vez podr${aAccent}s activarlo...`,
            `Responde la pregunta, para que el conocimiento ilumine tu camino.`
        ],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [
            `Te acercas m${aAccent}s y m${aAccent}s a tu destino con cada paso. No son muchos los que llegan hasta aqu${iAccent} sin rendirse o perder su raz${oAccent}n.`,
            `${startQuestion}Conquistar${aAccent}s la prueba final? Lo veremos, despu${eAccent}s de que superes esta tercera prueba. Sabes lo que tienes que hacer.`
        ],
        [godsEncounter, randomDialogue()]
    ],
    [
        [godsEncounter, randomDialogue()],
        [godsEncounter, randomDialogue()],
        [
            `No lo creo, pero... Realmente podr${iAccent}s ser ${eAccent}l. Lo ${uAccent}nico que hace falta es una pregunta final. Ni siquiera yo s${eAccent} lo que te aguarda,`,
            `pero no te dejes engañar por cuan tan f${aAccent}cil parezca la pregunta. Todo lo que has aprendido en tu traves${iAccent}a te servir${aAccent} ahora mismo.`,
            `Prep${aAccent}rate, conocedor. Los dioses te esperar${aAccent}n, aqu${iAccent} es donde te dejo. Que el conocimiento te acompa${nTilde}e.`,
            `Una ${uAccent}ltima pregunta, y nuestros caminos se separar${aAccent}n. Fue un honor haberte guiado todo este tiempo.`
        ]
    ],
    [
        [
            `T${uAccent}... El que embarc${oAccent} en la b${uAccent}sceda del conocimiento, del saber, el que super${oAccent} nuestros desaf${iAccent}os.`,
            `Demostraste tu valor ante nosotros sin importar el obst${aAccent}culo. Reconociste tu falta de conocimiento, y a${uAccent}n as${iAccent} te dedicaste a aprender m${aAccent}s.`,
            `Ahora que has llegado a tu destino, tendr${aAccent}s que responder otra pregunta, como lo has hecho incontables veces, y como lo seguir${aAccent}s haciendo si sigues el camino del conocimiento.`,
            `Elegiremos una pregunta al azar, relacionada a una de las tres pruebas que superaste. Si es que respondes correctamente, no interferiremos m${aAccent}s en tu b${uAccent}squeda.`,
            `No hay m${aAccent}s que decir. Procede, viajero.`
        ]
    ]
];
let subjects = {
    "computing": [
        {
            "question": `${startQuestion}Qu${eAccent} son las TICs?`,
            "options": [`Tecnolog${iAccent}as de la informaci${oAccent}n y comunicaci${oAccent}n`, `Tecnolog${iAccent}as de la investigaci${oAccent}n y comunicaci${oAccent}n`, `Telecomunicaciones de imprenta y colecci${oAccent}n`, `Tecnolog${iAccent}a de la innovaci${oAccent}n y ciencias`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} es un software educativo?`,
            "options": [`Todo programa que facilita el proceso de enseñanza y aprendizaje`, `Aquel que se utiliza para proyectar im${aAccent}genes en el pizarr${oAccent}n`, `Software que resuelve los problemas educativos`, `Aquel que facilita la escuela`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es la principal caracter${iAccent}stica del software educativo`,
            "options": [`Diseñado con un objetivo did${aAccent}ctico`, `F${aAccent}cil de usar`, `Es para hacer trampa`, `Resuelve los problemas por ti`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es la principal ventaja del software educativo`,
            "options": [`Puede fomentar la cultura del m${iAccent}nimo esfuerzo`, `Es vers${aAccent}til`, `Es gratis`, `Es intuitivo`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `Es la principal desventaja del software educativo`,
            "options": [`Puede fomentar la cultura del m${iAccent}nimo esfuerzo`, `Es vers${aAccent}til`, `Es gratis`, `Es intuitivo`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es una clasificaci${oAccent}n general del software educativo`,
            "options": [`Simuladores`, `Tutoriales`, `Librer${iAccent}as electr${oAccent}nicas`, `Tipo algor${iAccent}tmico`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} es el software comercial?`,
            "options": [`Aquel que es propiedad de una empresa y se crea con prop${oAccent}sito de comercializaci${oAccent}n`, `Aquel que se utiliza para investigar`, `Software para comercializar productos`, `Software con el prop${oAccent}sito de entretener`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es una caracter${iAccent}stica del software comercial`,
            "options": [`Gratis`, `Generalmente de pago`, `De libre uso`, `Es para fomentar la educaci${oAccent}n`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `Es un ejemplo de software comercial`,
            "options": [`Firefox`, `LibreOffice`, `Linux Ubuntu`, `Microsoft`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} es un software libre?`,
            "options": [`Aquel que respeta la libertad de los usuarios y la comunidad`, `Aquel que es gratis`, `Aquel que es creado con fines comerciales`, `Aquel software inmodificable`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es una caracter${iAccent}stica de software libre`,
            "options": [`Generalmente gratuito`, `Es de pago`, `Es inmodificable`, `Es privado`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es un ejemplo de software libre`,
            "options": [`Firefox`, `Inkscape`, `Adobe`, `Microsoft`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} es el software gratuito?`,
            "options": [`Aquel que se distribuye con intenci${oAccent}n comercial`, `Aquel que respeta la libertad de los usuarios y la comunidad`, `Aquel software inmodificable`, `Aquel que se distribuye sin costo monetario y no tiene derechos acordados`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `Es una caracter${iAccent}stica de software gratuito`,
            "options": [`No requiere licencia de uso`, `Es privado`, `Fomenta la educaci${oAccent}n`, `Generalmente de pago`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Es un ejemplo de software gratuito`,
            "options": [`OpenOffice`, `Microsoft`, `Inkscape`, `Adobe`],
            "answer": 3,
            "chosen": false
        }
    ],
    "chemistry": [
        {
            "question": `Fueron quienes propusieron la existencia del ${aAccent}tomo como una part${iAccent}cula indivisible`,
            "options": [`Antoine Lavoisier y Arist${oAccent}teles`, `Joseph Priestley y Michael Faraday`, `Plat${oAccent}n y S${oAccent}crates`, `Leucipo y Dem${oAccent}crito`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qui${eAccent}n descubri${oAccent} el electr${oAccent}n?`,
            "options": [`Antoine Lavoisier`, `Robert Boyle`, `Louis Pasteur`, `Joseph John Tomson`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}A qu${eAccent} grupo pertenece el Francio?`,
            "options": [`I (bloque s)`, `III (bloque p)`, `IV (bloque d)`, `VIII (bloque p)`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}A qu${eAccent} familia pertenece el compuesto Mn${threeSubscript}(PO₄)${twoSubscript}?`,
            "options": [`Bases`, `${OAccent}xidos`, `${AAccent}cidos`, `Sales`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}ntos estados de agregaci${oAccent}n de la materia existen?`,
            "options": [`3`, `4`, `5`, `6`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es la f${oAccent}rmula qu${iAccent}mica del Mon${oAccent}xido de Dihidr${oAccent}geno?`,
            "options": [`H${twoSubscript}O`, `K${twoSubscript}O`, `HF`, `H${twoSubscript}SO₄`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l el n${uAccent}mero de masa at${oAccent}mica del Ox${iAccent}geno?`,
            "options": [`32`, `16`, `24`, `64`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `Fue el disc${iAccent}pulo de S${oAccent}crates`,
            "options": [`Plat${oAccent}n`, `Arist${oAccent}teles`, `Leucipo`, `Dem${oAccent}crito`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el peso molecular del H${twoSubscript}O?`,
            "options": [`18 gramos`, `24 gramos`, `8 gramos`, `56 gramos`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el n${uAccent}mero de Avogadro? `,
            "options": [`6.022x10${twoSuperscript}${threeSuperscript}`, `3.1416x10${twoSuperscript}${threeSuperscript}`, `5.635x10${twoSuperscript}${threeSuperscript}`, `6.22x10${twoSuperscript}${threeSuperscript}`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} dice la Ley de la Conservaci${oAccent}n de la Materia?`,
            "options": [`Masa m${aAccent}s aceleraci${oAccent}n iguala a fuerza`, `Todo lo que puede salir mal, saldr${aAccent} mal`, `La materia no se crea ni se destruye, solo se transforma`, `La materia se crea y se destruye, nunca se transforma`],
            "answer": 3,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} es la qu${iAccent}mica?`,
            "options": [`Ciencia que estudia la composici${oAccent}n, estructura y propiedades de la materia`, `Ciencia que estudia los procesos qu${iAccent}micos`, `Ciencia que estudia el espacio y lo que contiene`, `Ciencia que estudia el universo`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} es la materia?`,
            "options": [`Todo aquello con volumen que ocupa un lugar en el espacio`, `La tierra, el aire y el agua`, `Los materiales que nos rodean`, `El conjunto de elementos de la naturaleza`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Proceso que se lleva acabo en el interior de las estrellas`,
            "options": [`Fisi${oAccent}n Nuclear`, `Fusi${oAccent}n Nuclear`, `Fisi${oAccent}n t${eAccent}rmica`, `Fusi${oAccent}n t${eAccent}rmica`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `${startQuestion}Qu${eAccent} reacci${oAccent}n se produce durante el detonamiento de una bomba nuclear?`,
            "options": [`Fisi${oAccent}n Nuclear`, `Fusi${oAccent}n Nuclear`, `Absorci${oAccent}n de energia`, `Descomposici${oAccent}n elemental`],
            "answer": 1,
            "chosen": false
        }
    ],
    "math": [
        {
            "question": `${startQuestion}Qu${eAccent} son las matem${aAccent}ticas?`,
            "options": [`Ciencia que estudia las variables`, `Ciencia que estudia los resultados`, `Ciencia que estudia las probabilidades`, `Ciencia que estudia las propiedades de los n${uAccent}meros`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es la ra${iAccent}z cuadrada del resultado de 16${twoSuperscript}(3x4-5)?`,
            "options": [`42.33`, `40.57`, `35.73`, `55.38`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el resultado de 16${fiveSuperscript}?`,
            "options": [`555,376`, `1.048576`, `1,048,576`, `356,576`],
            "answer": 3,
            "chosen": false
        },
        {
            "question": `Factoriza x${twoSuperscript}+6x+9`,
            "options": [`(x)(x+3)`, `(x+3)${twoSuperscript}`, `x(6)+9`, `(x+3)(x-3)`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `F${oAccent}rmula para sacar la circunferencia de un c${iAccent}rculo`,
            "options": [`${piSymbol}r${twoSuperscript}`, `2${piSymbol}r`, `(${piSymbol}r)${twoSuperscript}`, `d${piSymbol}${twoSuperscript}`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el resultado de 16(5*4-3${division}5(45-36))?`,
            "options": [`233.6`, `232.6`, `257`, `-233.6`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el ${aAccent}ngulo complementario de 35.64?`,
            "options": [`54.36`, `144.36`, `324.36`, `64.36`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el resultado de ${threeSuperscript}${nthRoot}64 * ${nthRoot}49?`,
            "options": [`${threeSuperscript}${nthRoot}27`, `16`, `28`, `${threeSuperscript}${nthRoot}15`],
            "answer": 3,
            "chosen": false
        },
        {
            "question": `Encuentra el valor de x en 5x + 35 = 180`,
            "options": [`30`, `43`, `28`, `29`],
            "answer": 4,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es la ra${iAccent}z c${uAccent}bica de 8?`,
            "options": [`2`, `4`, `24`, `2.82`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el valor de x en 4 ${division} 10 = x ${division} 5?`,
            "options": [`2`, `3`, `1`, `5`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `Factoriza x${twoSuperscript}+3x+5x+x`,
            "options": [`x(x+3+5)`, `x(x+9)`, `x${twoSuperscript}(3+5+x)`, `(x+1)+(x+4)`],
            "answer": 2,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el resultado de 4${fourSuperscript} + 5${sevenSuperscript}?`,
            "options": [`78,381`, `125,342`, `46,585`, `75,355`],
            "answer": 1,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el resultado de (4${twoSuperscript})${fourSuperscript} + (5${threeSuperscript})${twoSuperscript}?`,
            "options": [`125,161`, `88,530`, `81,161`, `35`],
            "answer": 3,
            "chosen": false
        },
        {
            "question": `${startQuestion}Cu${aAccent}l es el valor de x en 10x + 40 - 30 = 200?`,
            "options": [`20`, `19`, `18`, `17`],
            "answer": 2,
            "chosen": false
        }
    ],
    "boss": [
        [
            {
                "question": `Es la definici${oAccent}n de Internet`,
                "options": [`Red global de redes de ordenadores interconectados en forma de araña`, `Sitio de investigaci${oAccent}n`, `Direcci${oAccent}n espec${iAccent}fica en la red`, `Conjunto de c${oAccent}digos`],
                "answer": 1
            },
            {
                "question": `Es la definici${oAccent}n de funci${oAccent}n informativa`,
                "options": [`Promueve determinadas acciones para facilitar su uso`, `Presenta contenidos que presenta una informaci${oAccent}n estructurada`, `Captan la atenci${oAccent}n de los estudiantes`, `Permite al usuario la participaci${oAccent}n activa`],
                "answer": 2
            },
            {
                "question": `${startQuestion}Cu${aAccent}ndo se invent${oAccent} el Internet?`,
                "options": [`1970`, `2000`, `1982`, `1996`],
                "answer": 3
            }
        ],
        [
            {
                "question": `${startQuestion}Qui${eAccent}n es considerado el padre de la qu${iAccent}mica moderna?`,
                "options": [`Antoine Lavoisier`, `Robert Boyle`, `Arist${oAccent}teles`, `Joseph John Thomson`],
                "answer": 1
            },
            {
                "question": `${startQuestion}Cu${aAccent}l de estos fue responsable de producir el agujero en la capa de ozono?`,
                "options": [`CFCs`, `CO${twoSubscript}`, `Cl`, `Gasolina`],
                "answer": 1
            },
            {
                "question": `${startQuestion}Cu${aAccent}nta gasolina se gasta diariamente a nivel mundial, aproximadamente?`,
                "options": [`123 millones`, `500 millones`, `483 millones`, `97 millones`],
                "answer": 1
            }
        ],
        [
            {
                "question": `${startQuestion}A cu${aAccent}nto equivale un radi${aAccent}n en grados?`,
                "options": [`53.7`, `57.3`, `180`, `3.14`],
                "answer": 2
            },
            {
                "question": `${startQuestion}Cu${aAccent}l es el ${aAccent}ngulo sexagesimal de 13${degrees}8'33''?`,
                "options": [`13,500${degrees}`, `13.538${degrees}`, `13.273${degrees}`, `13.142${degrees}`],
                "answer": 4
            },
            {
                "question": `Resuelve el siguiente sistema de ecuaciones:\r\n[3x+2y+z=1, 5x+3y+4z=2, x+y-z=1]`,
                "options": [`x = -2, y = 3, z = 4`, `x = -4, y = 6, z = 1`, `x = 1, y = 2, z = 3`, `x = 4, y = 4, z = 7`],
                "answer": 2
            }
        ]
    ]
};

let playerPosition, x, y;
let tpPositions = {
    3: null,
    4: null
};
let currentGrid = 0;
let grid = grids[currentGrid];

let totalAreas = grids.length;
let [pAreaEnd, cAreaEnd, mAreaEnd] = [5, 10, 17];

let bgImages = [];
let groundImages = [];
let imageLoadCounter = 0;
for(let i = 0; i < 3; i++){
    bgImages.push(new Image());
    bgImages[i].src = `./images/bg${i}.png`;
    bgImages[i].onload = () => {imageLoadCounter++;};
};
for(let i = 0; i < totalAreas; i++){
    groundImages.push(new Image());
    groundImages[i].src = `./images/ground${i}.png`;
    groundImages[i].onload = () => {imageLoadCounter++;};
};
let checkLoadedImages = setInterval(() => {
    if(imageLoadCounter == totalAreas + 3){
        stopInterval();
        move();
        interfaceContainer.style.display = "block";
    };
}, 50);
function stopInterval(){clearInterval(checkLoadedImages);};

function move(direction){
    let area, endSequence;
    if(currentGrid + 1 <= pAreaEnd){area = 0;} else if(currentGrid + 1 > pAreaEnd && currentGrid + 1 <= cAreaEnd){area = 1;} else if(currentGrid + 1 > cAreaEnd && currentGrid + 1 <= mAreaEnd){area = 2;};
    if(area == 2){statContainer.style.color = "black"} else {statContainer.style.color = "white"};
    drawImageShortcut(bgImages[area]);
    drawImageShortcut(groundImages[currentGrid]);
    getPlayerPosition();

    if(direction){
        if(!(direction == "left" && (currentGrid == 0 && grid[y][0] == 1)) && interact == false){
            if(!(direction == "right" && grid[y][x+1] == undefined) && !(direction == "left" && grid[y][x-1] == undefined)){
                
                let initialValue = initialGrids[currentGrid][y][x];
                let moveDown = false;
                let moveUp = false;
                
                if((direction == "right" && grid[y+1][x+1] == 0) || (direction == "left" && grid[y+1][x-1] == 0)){moveDown = true;};
                if((direction == "right" && (grid[y][x+1] == 2 && grid[y-1][x+1] == 0 && grid[y-1][x] == 0)) || (direction == "left" && (grid[y][x-1] == 2 && grid[y-1][x-1] == 0 && grid[y-1][x] == 0))){moveUp = true;};
                
                if(!(((direction == "right" && (grid[y+1][x+1] == 2 && grid[y][x+1] == 2)) || (direction == "left" && (grid[y+1][x-1] == 2 && grid[y][x-1] == 2))) && moveUp == false)){
                    if(direction == "teleport"){listenForTeleport(initialValue);};
                    if(direction == "right" && (grid[y][x+1] == 3 || grid[y][x+1] == 4)){
                        listenForTeleport(grid[y][x+1], direction);
                    } else if(direction == "left" && (grid[y][x-1] == 3 || grid[y][x-1] == 4)){
                        listenForTeleport(grid[y][x-1], direction);
                    };
                    
                    if(initialValue == 1 || typeof(initialValue) == "string"){initialValue = 0;};
                    grid[y][x] = initialValue;
                    if(direction == "right"){
                        x += 1;
                    } else if(direction == "left"){
                        x -= 1;
                    };
                    if(moveDown == false && moveUp == false){
                        grid[y][x] = 1;
                    } else if(moveDown == true){
                        grid[y+1][x] = 1;
                        y += 1;
                    } else if(moveUp == true){
                        grid[y-1][x] = 1;
                        y -= 1;
                    };
    
                    if(typeof(grid[y][x+1]) == "string"){
                        interact = true;
                        createTextBox([y, x+1], grid[y][x+1]);
                    };
                    if(grid[y][x+1] == 5){
                        interact = true;
                        endSequence = true;
                    };
                };
                
            } else if(direction == "left" && grid[y][x-1] == undefined){
                grid[y][0] = 0;
                currentGrid--;
                grid = grids[currentGrid];
                grid[y][19] = 1;
                interactions = 0;
                getPlayerPosition();
                context.clearRect(0, 0, canvas.width, canvas.height);
                move();
            } else if(direction == "right" && grid[y][x+1] == undefined){
                getPlayerPosition();
                grid[y][19] = 0;
                currentGrid++;
                grid = grids[currentGrid];
                playerPosition[0] = x = 0;
                grid[y][x] = 1;
                interactions = 0;
                context.clearRect(0, 0, canvas.width, canvas.height);
                move();
            };
        };
    };
    for(let i = 0; i < 15 * 20; i++){
        switch(grid[Math.floor(i / 20)][i % 20]){
            case 1:
                context.fillStyle = "black"; break;
            case b:
                context.fillStyle = "red"; break;
            case m: case c: case p:
                context.fillStyle = "blue"; break;
            case 5:
                context.fillStyle = "green"; break;
            default:
                context.fillStyle = "#00000000"; break;
        };
        context.fillRect(((i % 20) * pixelSideLength), (Math.floor(i / 20) * pixelSideLength), pixelSideLength, pixelSideLength);
        if(grid[Math.floor(i / 20)][i % 20] == 1){
            context.fillStyle = "white";
            context.fillRect(((i % 20) * pixelSideLength + (pixelSideLength / 3)), (Math.floor(i / 20) * pixelSideLength + (pixelSideLength / 3)), pixelSideLength / 3, pixelSideLength / 3);
        };
    };
    if(endSequence == true){end();};
};

function getPlayerPosition(){
    for(let row of grid){
        for(let pixel of row){
            if(pixel == 1){playerPosition = [row.indexOf(pixel), grid.indexOf(row)];};
        };
    };
    x = playerPosition[0];
    y = playerPosition[1];
};

function drawImageShortcut(image){
    context.drawImage(image, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
};

let interactions = 0;
function createTextBox(position, subject){
    let inputDialogueBox = document.createElement("div");
    inputDialogueBox.classList.add("inputDialogueBox");

    inputDialogueBox.style.border = `${pixelSideLength / 2}px double white`;
    inputDialogueBox.style.padding = `${pixelSideLength / 2}px`;
    inputDialogueBox.style.fontSize = `${pixelSideLength}px`;
    inputDialogueBox.style.letterSpacing = `${pixelSideLength / 10}px`;
    inputDialogueBox.textContent = `* ${dialogues[currentGrid][interactions][0]}`;

    let isEnterPressed = false;

    if(dialogues[currentGrid][interactions].length > 1){
        document.addEventListener("keydown", function nextDialogue(e){
            if(e.key.toLowerCase() == "enter" && isEnterPressed == false){
                let currentDialogueIndex = dialogues[currentGrid][interactions].indexOf(inputDialogueBox.textContent.slice(2));
                isEnterPressed = true;
                if(currentDialogueIndex != -1){
                    inputDialogueBox.textContent = `* ${dialogues[currentGrid][interactions][currentDialogueIndex + 1]}`;
                };
                if(inputDialogueBox.textContent.slice(2) == "undefined"){
                    this.removeEventListener("keydown", nextDialogue);
                    this.removeEventListener("keyup", enterCooldown);
                    displayQuestion(inputDialogueBox, position, subject);
                };
            };
        });
        document.addEventListener("keyup", enterCooldown);
        function enterCooldown(e){
            if(e.key.toLowerCase() == "enter" && isEnterPressed == true){
                isEnterPressed = false;
            };
        };
    } else {
        document.addEventListener("keydown", function dialogueToEquation(e){
            if(e.key.toLowerCase() == "enter"){
                this.removeEventListener("keydown", dialogueToEquation);
                displayQuestion(inputDialogueBox, position, subject);
            };
        });
    };

    interfaceContainer.append(inputDialogueBox);
};

function displayQuestion(box, position, subject){
    interactions++;
    let questionData = randomQuestion(subject);
    let questionOptions = [...questionData.options];
    let optionsContainer = document.createElement("div");
    optionsContainer.classList.add("optionsContainer");

    box.style.fontSize = `${pixelSideLength}px`;
    box.style.textAlign = "center";
    optionsContainer.style.marginTop = `${pixelSideLength / 2}px`;
    optionsContainer.style.height = `${pixelSideLength * 5}px`;

    box.textContent = questionData.question;
    box.append(optionsContainer);

    let transitioning = false;
    let incorrect = false;

    shuffleArray(questionOptions);
    
    for(let i = 0; i < 4; i++){
        let option = document.createElement("div");
        option.classList.add("option");
        optionsContainer.append(option);
        option.style.height = `${(optionsContainer.offsetHeight - pixelSideLength / 2) / 2}px`;
        option.style.width = `${(optionsContainer.offsetWidth - pixelSideLength / 2) / 2}px`;
        option.style.border = `${pixelSideLength / 5}px solid white`;
        if(questionOptions[i].length > 26 && questionOptions[i].length < 74){option.style.fontSize = `${pixelSideLength / 2}px`;} else if(questionOptions[i].length > 73){option.style.fontSize = `${pixelSideLength * 0.45}px`;} else {option.style.fontSize = `${pixelSideLength * 0.9}px`;};
        option.textContent = questionOptions[i];

        option.addEventListener("click", () => {
            if(option.textContent == questionData.options[questionData.answer - 1] && transitioning == false){
                transitioning = true;
                option.style.borderColor = "green";
                setTimeout(() => {
                    option.style.transition = "border 0.8s linear";
                    option.style.borderColor = "white";
                    option.addEventListener("transitionend", (e) => {
                        if(e.propertyName == "border-bottom-color"){
                            calculateScore();
                            streak++;
                            streakText.textContent = streak;
                            option.parentElement.parentElement.remove();
                            grid[position[0]][position[1]] = 0;
                            interact = false;
                            transitioning = false;
                            move();
                        };
                    });
                }, 200);
                } else if(option.textContent != questionData.options[questionData.answer - 1] && transitioning == false){
                    transitioning = true;
                    option.style.borderColor = "red";
                    setTimeout(() => {
                        if(incorrect == false){
                            multiplier -= 0.18;
                            incorrect = true;
                        };
                        if(multiplier < 1){multiplier = 1};
                        streak = 0;
                        option.style.transition = "border 0.3s linear";
                        option.style.borderColor = "white";
                        option.addEventListener("transitionend", function removeOptionTransition(e){
                            if(e.propertyName == "border-bottom-color"){
                                transitioning = false;
                                streakText.textContent = streak;
                                option.style.transition = "";
                                this.removeEventListener("transitionend", removeOptionTransition);
                            };
                        });
                    }, 200);
                };
        });
    };
};

function shuffleArray(array) {
    let m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    };
    return array;
};

function randomQuestion(subject){
    if(subject != "boss"){
        let rng = Math.floor(Math.random() * subjects[`${subject}`].length);
        let questionData = subjects[`${subject}`][rng];
        if(questionData.chosen == true){
            for(let i = 0; i < 1000; i++){
                let rng = Math.floor(Math.random() * subjects[`${subject}`].length);
                if(subjects[`${subject}`][rng].chosen == false){
                    questionData = subjects[`${subject}`][rng];
                    break;
                };
            };
        };
        questionData.chosen = true;
        return questionData;
    } else if(subject == "boss"){
        let rngSubject = Math.floor(Math.random() * 3);
        let difficulty;
        if(score <= 2500){difficulty = 2;} else if(score > 2847 && score < 3195){difficulty = 1;} else if(score >= 3195){difficulty = 0;};
        return subjects[`${subject}`][rngSubject][difficulty];
    };
};

function listenForTeleport(teleporter, direction){
    let offset = 0;
    let otherTeleporter;
    if(direction){direction == "right" ? offset = 1 : offset = -1;};
    teleporter == 3 ? otherTeleporter = 4 : otherTeleporter = 3;
    getTPPositions(teleporter);
    if(tpPositions[teleporter][0] == y && tpPositions[teleporter][1] == x+offset){
        document.addEventListener("keydown", function teleportPlayer(e){
            if(e.code.toLowerCase() == "space" && isSpacePressed == false){
                isSpacePressed = true;
                grid[y][x] = teleporter;
                grid[tpPositions[otherTeleporter][0]][tpPositions[otherTeleporter][1]] = 1;
                move("teleport");
                this.removeEventListener("keydown", teleportPlayer);
            } else if(e.key.toLowerCase() == "arrowright" || e.key.toLowerCase() == "arrowleft" || e.key.toLowerCase() == "a" || e.key.toLowerCase() == "d"){
                this.removeEventListener("keydown", teleportPlayer);
            };
        });
        document.addEventListener("keyup", function enableTeleport(e){
            if(e.code.toLowerCase() == "space" && isSpacePressed == true){
                isSpacePressed = false;
            }  else if((e.key.toLowerCase() == "arrowright" || e.key.toLowerCase() == "arrowleft" || e.key.toLowerCase() == "a" || e.key.toLowerCase() == "d") && e.code.toLowerCase() != "space"){
                isSpacePressed = false;
                this.removeEventListener("keyup", enableTeleport);
            };
        });
    };
};

function getTPPositions(teleporter){
    let otherTeleporter;
    teleporter == 3 ? otherTeleporter = 4 : otherTeleporter = 3;
    for(let row of grid){
        for(let pixel of row){
            if(pixel == teleporter || pixel == otherTeleporter){
                tpPositions[pixel] = [grid.indexOf(row), row.indexOf(pixel)]
            };
        };
    };
};

function calculateScore(){
    multiplier = 1 + (streak * 0.09);
    if(multiplier >= 1.63){multiplier = 1.63;};
    score += 50 * multiplier;
    scoreText.textContent = Math.round(score);
};

function end(){
    setTimeout(() => {
        canvas.setAttribute("style", `outline: ${pixelSideLength / 3}px double black; filter: invert(1);`)
        setTimeout(() => {            
            let endContainer = document.createElement("div");
            endContainer.classList.add("endContainer");
    
            context.clearRect(0, 0, canvas.width, canvas.height);
            statContainer.remove();
    
            endContainer.style.fontSize = `${pixelSideLength * 2}px`;
            endContainer.innerHTML = `\u00A1Gracias por jugar!<br>Puntaje: ${score}`;
            
            interfaceContainer.append(endContainer);
            setTimeout(() => {
                endContainer.style.opacity = 1;
            });
        }, 500);
    }, 2500);
};