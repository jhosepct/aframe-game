window.addEventListener('load', initScene);

const meteors = [
    { x: 0, y: 0, z: -30 },
    { x: 0, y: 0, z: 30 },
    { x: 30, y: 0, z: 0 },
    { x: -30, y: 0, z: 0 },
    { x: 20, y: 0, z: 20 },
    { x: 20, y: 0, z: -20 },
    { x: -20, y: 0, z: -20 },
    { x: -20, y: 0, z: 20 }
];

const levels = [
    { duration: 20, target: 20 },
    { duration: 15, target: 15 },
    { duration: 10, target: 10 }
];

let score = 0;
let currentLevel = 0;
let timerInterval;

function initScene() {
    // Limpia los meteoritos existentes
    document.querySelectorAll('.meteor').forEach(meteor => meteor.remove());

    // Reinicia el puntaje
    score = 0;
    updateScore();

    // Crea nuevos meteoritos
    createMeteors();

    // Inicia el nivel actual
    startLevel();
}

function createMeteors() {
    const orbits = document.querySelectorAll('.orbit');
    orbits.forEach(orbit => {
        meteors.forEach(pos => {
            const meteor = document.createElement('a-entity');
            meteor.setAttribute('geometry', { primitive: 'sphere', radius: Math.random() * 3 + 0.5 });
            meteor.setAttribute('material', { shader: 'flat', src: '#meteor' });
            meteor.setAttribute('class', 'meteor');
            meteor.object3D.position.set(pos.x, pos.y, pos.z);
            meteor.setAttribute('shootable', '');
            orbit.appendChild(meteor);
        });
    });
}

AFRAME.registerComponent('shootable', {
    init: function () {
        this.el.addEventListener('click', () => {
            this.el.parentNode.removeChild(this.el);
            score += 1;
            updateScore();

            // Agregar sonido de explosión
            const explosionSound = document.querySelector('#explosion');
            explosionSound.play(); // Reproduce el sonido

            checkWinCondition();
        });
    }
});

function updateScore() {
    document.querySelector('#score').setAttribute('value', `${score} meteoros cazados`);
}

function startLevel() {
    document.querySelector('#level').setAttribute('value', `Nivel: ${currentLevel + 1}`);
    document.querySelector('#timer').setAttribute('value', `Tiempo: ${levels[currentLevel].duration}`);
    let timeLeft = levels[currentLevel].duration;

    // Limpia el temporizador anterior si existe
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        timeLeft -= 1;
        document.querySelector('#timer').setAttribute('value', `Tiempo: ${timeLeft}`);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkLossCondition();
        }
    }, 1000);
}

function checkWinCondition() {
    if (score >= levels[currentLevel].target) {
        showModal('win');
    }
}

function checkLossCondition() {
    if (score < levels[currentLevel].target) {
        showModal('lose');
    }
}

function showModal(result) {
    const modal = document.getElementById(`modal-${result}`);
    modal.style.display = 'block';

    const closeBtn = document.getElementById(`close-${result}`);
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        if (result === 'lose') {
            // Reinicia el juego
            initScene();
        }
    };

    const restartBtn = document.getElementById('restart');
    restartBtn.onclick = () => {
        modal.style.display = 'none';
        // Reiniciar el nivel actual
        initScene();
    };

    const nextLevelBtn = document.getElementById('next-level');
    nextLevelBtn.onclick = () => {
        modal.style.display = 'none';
        currentLevel += 1;
        if (currentLevel < levels.length) {
            // Limpiar meteoritos existentes y cargar el siguiente nivel
            initScene();
        } else {
            showModal('final');
        }
    };

    const playAgainBtn = document.getElementById('play-again');
    playAgainBtn.onclick = () => {
        modal.style.display = 'none';
        currentLevel = 0;
        initScene();
    };
}
