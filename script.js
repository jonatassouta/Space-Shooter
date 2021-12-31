const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', "img/monster-2.png", "img/shipAlien.png", "img/monster-3.png"];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
let placar = document.querySelector('.placar');
let i = 0;

//Movimento e tiro da nave
function flyAhip(event) {
    if(event.key === "ArrowUp") {
        event.preventDefault();
        moveUp();
    } else if(event.key === "ArrowDown") {
        event.preventDefault();
        moveDow();
    } else if(event.key === " ") {
        event.preventDefault();
        fireLase();
    } else if(event.key === "ArrowLeft") {
        event.preventDefault();
        moveLeft();
    }
    /* } else if(event.key === "ArrowRight") {
        event.preventDefault();
        moveRight();
    } */
}

//Função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 30;
        yourShip.style.top = `${position}px`;
    } 
}

//Função descer
function moveDow() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top')
    if(topPosition === "500px") {
        return
    } else {
        let position = parseInt(topPosition);
        position += 30
        yourShip.style.top = `${position}px`;
    } 
}

function moveLeft() {
    let leftPosition = getComputedStyle(yourShip).getPropertyValue('left')
    if(leftPosition === "20px") {
        return
    } else {
        let position = parseInt(leftPosition);
        position -= 50
        yourShip.style.left = `${position}px`;
    } 
}

function moveRight() {
    let rightPosition = getComputedStyle(yourShip).getPropertyValue('left')
    if(rightPosition === "340px") {
        return
    } else {
        let position = parseInt(rightPosition);
        position += 50
        yourShip.style.left = `${position}px`;
    } 
}

//Funcionalidade de tiro
function fireLase() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser')
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //Comparando se cada alien foi atingido, se sim, trocar o src da imagen
            if(checkLaserCollision(laser, alien, i)) {
                alien.src = 'img/explosion-1.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                i++;
                placar.textContent = i;
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10); 
}

//Função criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img')
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];//Sorteio de Imagens
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//Função para movimentar os inimigos
function  moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')){
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            if(i >= 5) {
                alien.style.left = `${xPosition - 7}px`;
            } else if ( i >= 10){
                alien.style.left = `${xPosition - 14}px`;
            } else {
                alien.style.left = `${xPosition - 4}px`;
            }
        }
    }, 30);
}

//Função para colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBotton = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBotton = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBotton) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//Inicio do Jogo
startButton.addEventListener('click', (event) => {
    playGame();
}) 

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyAhip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//Função Game Over
function  gameOver() {
    window.removeEventListener('keydown', flyAhip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    let s = placar.textContent;
    placar.textContent = 0;
    setTimeout(() => {
        alert('Game Over!! seu Placar é de: ' + s);
        yourShip.style.top = "250px";
        startButton.style.display = 'block';
        instructionsText.style.display = "block";
    });
}

