const canvas = document.querySelector('#game')
const game =canvas.getContext('2d')

const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResoult = document.querySelector('#result');

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp)
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)

window.addEventListener('load', CanvaSize)
window.addEventListener('resize', CanvaSize)

let canvasSize
let elementsSize
let level = 0
let lives = 3
let timeStart
let timeInterval
const playerPosition = {
    x: undefined,
    y: undefined
}
const giftPosition = {
    x: undefined,
    y: undefined
}
let enemyPositions = []


function CanvaSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.7
    }else{
        canvasSize = window.innerHeight * 0.7
    }

    canvasSize = Number(canvasSize.toFixed(0))

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementsSize = (canvasSize / 10) - 1

    playerPosition.x = undefined
    playerPosition.y = undefined

    startGame()
}
function startGame(){
    game.font = elementsSize + 'px Verdana'

    const map = maps[level];
    enemyPositions = []
    showLives()

    if (!map){
        gameWin()
    }

    if(!timeStart){
        timeStart = Date.now()
        timeInterval = setInterval(showTime,100)
        showRecord()
    }

    const mapRows = map.trim().split('\n');
    const mapRowCol = mapRows.map(row => row.trim().split(''));

    game.clearRect(0, 0, canvasSize, canvasSize)
    mapRowCol.forEach((row, rowI) => {
        row.forEach((col, colI) =>{
            const emoji = emojis[col]
            const posX = elementsSize * (colI)
            const posY = elementsSize * (rowI + 1)

            if(col === 'O'){
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            }else if(col === 'I'){
                giftPosition.x = posX
                giftPosition.y = posY
            }else if (col === 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY,
                });
            }
            game.fillText(emoji, posX, posY)
        })
    });
    movePlayer();
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) === giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) === giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision){
        levelWin()
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) === playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) === playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}

function levelWin(){
    level++
    startGame()
}

function levelFail() {
    lives--

    if (lives <= 0){
        lives = 3
        level = 0
        timeStart = undefined
    }
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}

function showLives(){
    spanLives.innerHTML = emojis['HEART'].repeat(lives)
}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time')
}

function gameWin(){
    clearInterval(timeInterval)

    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now() - timeStart

    if(recordTime){
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime)
            pResoult.innerHTML = 'Superaste el record'
        }else{
            pResoult.innerHTML = 'Lo siento, no superaste el record'
        }
    }else{
        localStorage.setItem('record_time', playerTime)
        pResoult.innerHTML = '¡Trata de superar tu tiempo!'
    }
}


function moveByKeys(event){
    if(event.key === 'ArrowUp') moveUp()
    else if(event.key === 'ArrowLeft') moveLeft()
    else if(event.key === 'ArrowRight') moveRight()
    else if(event.key === 'ArrowDown') moveDown()
}
function moveUp(){
    if(playerPosition.y > (elementsSize))
        playerPosition.y -= elementsSize
    startGame()
}
function moveLeft(){
    if(playerPosition.x > (elementsSize - 1))
        playerPosition.x -= elementsSize
    startGame()
}
function moveRight(){
    if(playerPosition.x < (elementsSize * 8))
        playerPosition.x += elementsSize
    startGame()
}
function moveDown(){
    if (playerPosition.y < (elementsSize * 9))
        playerPosition.y += elementsSize
    startGame()
}