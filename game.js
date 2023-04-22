const canvas = document.querySelector('#game')
const game =canvas.getContext('2d')

const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')

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
const playerPosition = {
    x: undefined,
    y: undefined
}
const startPosition = {
    x: undefined,
    y: undefined
}
const giftPosition = {
    x: undefined,
    y: undefined
}
let freePositions = []


function CanvaSize(){
    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8
    }else{
        canvasSize = window.innerHeight * 0.8
    }

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementsSize = (canvasSize / 10) - 1

    startGame()
}
function startGame(){
    game.font = elementsSize + 'px Verdana'

    const map = maps[level];
    console.log(map)

    freePositions = []

    if (!map){
        gameWin()
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

                    const freePostion = {
                        x: posX,
                        y: posY
                    }
                    freePositions.push(freePostion)
                }

            }else if(col === 'I'){
                giftPosition.x = posX
                giftPosition.y = posY

                if(!playerPosition.x && !playerPosition.y){
                    const freePostion = {
                        x: posX,
                        y: posY
                    }
                    freePositions.push(freePostion)
                }
            }else if( col === '-'){
                const freePosition = {
                    x: posX,
                    y: posY
                }
                freePositions.push(freePosition)
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

    const isFreePosition =  freePositions.find(pos => pos.x.toFixed(3) === playerPosition.x.toFixed(3) && pos.y.toFixed(3) === playerPosition.y.toFixed(3))

    if (giftCollision){
        levelWin()
    }

    if (isFreePosition === undefined){
        levelFail()
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

    }
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()

}

function gameWin(){}


function moveByKeys(event){
    if(event.key === 'ArrowUp') moveUp()
    else if(event.key === 'ArrowLeft') moveLeft()
    else if(event.key === 'ArrowRight') moveRight()
    else if(event.key === 'ArrowDown') moveDown()
}
function moveUp(){
    if(playerPosition.y > (elementsSize * 2))
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