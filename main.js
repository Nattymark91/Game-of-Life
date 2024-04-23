const canvas = document.querySelector('#canvas');
ctx = canvas.getContext('2d');
setSize = document.querySelector('#setSize');
setSpeed = document.querySelector('#setSpeed');
sizeBtn = document.querySelector('#sizeBtn');
speedBtn = document.querySelector('#speedBtn');
randomBtn = document.querySelector('#randomBtn');
clearBtn = document.querySelector('#clearBtn');
startBtn = document.querySelector('#startBtn');
stopBtn = document.querySelector('#stopBtn');
generation = document.querySelector('#generation');
size = document.querySelector('#size');
speed = document.querySelector('#speed');

canvas.size = window.innerHeight;
canvas.height = canvas.width = +canvas.size;

let count = 0;
let fieldSize = 300;
let paintFlag = false;
let genFlag = false;
let gridSize = canvas.size / fieldSize;
let grid = [];
let prevGrid = [];
let expectancy = 100;

const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.size, canvas.size);
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            const index = i * fieldSize + j;
            if (grid[index] && grid[index] !== prevGrid[index]) {
                ctx.fillStyle = "#00ff00";
                ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize);
            }
        }
    }
    prevGrid = grid.slice();
}

const getNextGeneration = () => {
    const newGrid = [];
    for (let i = 0; i < grid.length; i++) {
        const x = i % fieldSize;
        const y = Math.floor(i / fieldSize);
        const neighbors = countNeighbors(x, y);
        if (grid[i]) {
            newGrid[i] = neighbors == 2 || neighbors == 3;
        } else {
            newGrid[i] = neighbors == 3;
        }
    }
    prevGrid = grid.slice();
    grid = newGrid;
    count++;
    generation.innerText = `${count}`;
    drawGrid();
}

const countNeighbors = (x, y) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            const row = (x + i + fieldSize) % fieldSize;
            const col = (y + j + fieldSize) % fieldSize;
            const index = col * fieldSize + row;
            if (grid[index] && !(i == 0 && j == 0)) {
                sum ++;
            }
        }
    }
    return sum;
}

// УСТАНОВИТЬ РАЗМЕР ПОЛЯ
sizeBtn.addEventListener('click', () => {
    fieldSize = +setSize.value;
    gridSize = canvas.size / fieldSize;
    size.innerText = `${fieldSize} x ${fieldSize}`;
});

// УСТАНОВИТЬ ПРОДОЛЖИТЕЛЬНОСТЬ ЦИКЛА
speedBtn.addEventListener('click', () => {
    expectancy = +setSpeed.value;
    speed.innerText = `${expectancy}`;
    if (genFlag) {
        clearInterval(genFlag); 
        genFlag = setInterval(getNextGeneration, expectancy);
    }
});

// РАНДОМ
randomBtn.addEventListener('click', () => {
    count = 0;
    generation.innerText = `${count}`;
    let k;
    (fieldSize > 1000 || expectancy < 100) ? k = 0.1 : k = 0.2
    grid = [...Array(fieldSize * fieldSize)].map(()=>~~(Math.random()< k));
    drawGrid();
});

// ЗАПУСК
startBtn.addEventListener('click', () => {
        clearInterval(genFlag); 
        genFlag = setInterval(getNextGeneration, expectancy);
 
});

// ОСТАНОВКА
stopBtn.addEventListener('click', () => {
        clearInterval(genFlag); 
        genFlag = false;   
});

// ОЧИСТИТЬ
clearBtn.addEventListener('click', () => {
    count = 0;
    generation.innerText = '0';
    clearInterval(genFlag);
    genFlag = false;
    ctx.clearRect(0, 0, canvas.size, canvas.size);
    grid = [...Array(fieldSize * fieldSize)].map(()=>~~(Math.random()*0));
});

// ОТРИСОВКА ВРУЧНУЮ
canvas.addEventListener('mousedown', () => {
    paintFlag = true;
});
canvas.addEventListener('mousemove', (e) => {
    if (paintFlag) {
    let x = e.offsetX;
    let y = e.offsetY;
    x = Math.floor(x/gridSize);
    y = Math.floor(y/gridSize);
    const index = y * fieldSize + x;
    grid[index] = 1;
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);  
}});
canvas.addEventListener('mouseup', () => {
    paintFlag = false;
});





