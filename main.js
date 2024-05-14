var rows = 60;
var cols = 100;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);
var temperatura = new Array(rows);
var humedad = new Array(rows);

var timer;
var reproductionTime = 100;

var wall = false;
var caracteristicas=false;
function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
        temperatura[i] = new Array(cols);
        humedad[i] = new Array(cols);
    }
}

var maxTemperatura=30;
var minTemperatura=-10;
var maxHumedad=100;
var minHumedad=40;
function resetGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
        temperatura[i] = new Array(cols);
        humedad[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
            // Asignar valores aleatorios a temperatura y humedad
            temperatura[i][j] = Math.random() * (maxTemperatura - minTemperatura) + minTemperatura;
            humedad[i][j] = Math.random() * (maxHumedad - minHumedad) + minHumedad;
        }
    }
}


function resetTH() {
    for (var i = 0; i < rows; i++) {
        temperatura[i] = new Array(cols);
        humedad[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            temperatura[i][j] = Math.random() * (maxTemperatura - minTemperatura) + minTemperatura;
            humedad[i][j] = Math.random() * (maxHumedad - minHumedad) + minHumedad;
        }
    }
}


function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// Initialize
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
    updateMaxTemp(maxTemperatura);
}

// Lay out the board
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function cellClickHandler() {
     // Mostrar temperatura y humedad en algún otro lugar (p. ej., consola)
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];
    var temp = temperatura[row][col];
    var hum = humedad[row][col];
    if(caracteristicas){
        // Obtener temperatura y humedad de la celda
        
        
        console.log("Temperatura:", temp);
        console.log("Humedad:", hum);
         // Mostrar información en la consola
    var infoElement = document.getElementById('info');
infoElement.innerHTML = "<strong>Temperatura:</strong> " + temp + "<br>" +
                         "<strong>Humedad:</strong> " + hum + "<br>";
    }else{
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
        } else {
            this.setAttribute("class", "live");
            grid[row][col] = 1;
        }
    }
    
    
}


    function updateView() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0)
                {
                    cell.setAttribute("class", "dead");
                }
                if (grid[i][j] == 1)
                {
                    cell.setAttribute("class", "live");
                }
                
            }
        }
    }

function setupControlButtons() {
    // button to start
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    

    // button to clear
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    // button to set random initial state
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;

    // button to show features
    var thButton = document.getElementById("caracteristicas");
    thButton.onclick = thButtonHandler;


    //VIENTO
    // button to up
    var upButton = document.getElementById("up");
    upButton.onclick = upButtonHandler;
    // button to down
    var downButton = document.getElementById("down");
    downButton.onclick = downButtonHandler;
    // button to left
    var leftButton = document.getElementById("left");
    leftButton.onclick = leftButtonHandler;
    // button to right
    var rightButton = document.getElementById("right");
    rightButton.onclick = rightButtonHandler;
    // button to stop
    var stopButton = document.getElementById("stop");
    stopButton.onclick = stopButtonHandler;
}
var up=false;
var down=false;
var right=false;
var left=false;
function upButtonHandler(){
    up=true;
    down=false;
    right=false;
    left=false;
}
function downButtonHandler(){
    up=false;
    down=true;
    right=false;
    left=false;
}
function leftButtonHandler(){
    up=false;
    down=false;
    right=false;
    left=true;
}
function rightButtonHandler(){
    up=false;
    down=false;
    right=true;
    left=false;
}
function stopButtonHandler(){
    up=false;
    down=false;
    right=false;
    left=false;
}

function thButtonHandler(){
    if(caracteristicas){
        caracteristicas=false;
    }else{
        caracteristicas=true;
    }
    var caracteristicasButton = document.getElementById('caracteristicas');
    if (caracteristicas) {
        caracteristicasButton.classList.add('active'); // Agrega la clase 'active' para cambiar el color a verde
    } else {
        caracteristicasButton.classList.remove('active'); // Remueve la clase 'active' para cambiar el color a rojo
    }
}


function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cellType = Math.random() < 0.3 ? 1 : (Math.random() < 0.2 ? 2 : 0); // Probabilidad del 30% para cada tipo de célula, con un 40% de células vacías
            var cell = document.getElementById(i + "_" + j);
            if (cellType == 1) {
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            } else {
                cell.setAttribute("class", "dead");
                grid[i][j] = 0;
            }
        }
    }
}


// clear the grid
function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    // Obtener todas las celdas vivas y de pared
    var cellsList = document.getElementsByClassName("live");
    var wallList = document.getElementsByClassName("wall");
    
    // Convertir las listas a arrays
    var cells = Array.from(cellsList);
    var walls = Array.from(wallList);
    
    // Combinar ambas listas en una sola
    var allCells = cells.concat(walls);
    
    // Iterar sobre todas las celdas y cambiar su clase a "dead"
    allCells.forEach(function(cell) {
        cell.setAttribute("class", "dead");
    });
    
    // Reiniciar las matrices de la cuadrícula
    resetGrids();
}


// start/pause/continue the game
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continuar";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pausa";
        play();
    }
}


var regla=-1;
// run the life game
function play() {
    computeNextGen();
    regla=regla*-1;
    if(timer%5==0){
        resetTH();
    }
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();
}
function vecinosNubes(row, col) {
    var vecinosNubes = 0;
    // Arriba
    if (row > 0 && temperatura[row - 1][col] <= 10 && humedad[row - 1][col] >= 75) vecinosNubes++;
    // Abajo
    if (row < rows - 1 && temperatura[row + 1][col] <= 10 && humedad[row + 1][col] >= 75) vecinosNubes++;
    // Izquierda
    if (col > 0 && temperatura[row][col - 1] <= 10 && humedad[row][col - 1] >= 75) vecinosNubes++;
    // Derecha
    if (col < cols - 1 && temperatura[row][col + 1] <= 10 && humedad[row][col + 1] >= 75) vecinosNubes++;
    // Diagonal superior izquierda
    if (row > 0 && col > 0 && temperatura[row - 1][col - 1] <= 10 && humedad[row - 1][col - 1] >= 75) vecinosNubes++;
    // Diagonal superior derecha
    if (row > 0 && col < cols - 1 && temperatura[row - 1][col + 1] <= 10 && humedad[row - 1][col + 1] >= 75) vecinosNubes++;
    // Diagonal inferior izquierda
    if (row < rows - 1 && col > 0 && temperatura[row + 1][col - 1] <= 10 && humedad[row + 1][col - 1] >= 75) vecinosNubes++;
    // Diagonal inferior derecha
    if (row < rows - 1 && col < cols - 1 && temperatura[row + 1][col + 1] <= 10 && humedad[row + 1][col + 1] >= 75) vecinosNubes++;
    
    return vecinosNubes;
}

// Reglas
function applyRules(row, col) {
    var t = temperatura[row][col];
    var h = humedad[row][col];

    // Si la regla es -1 y se está moviendo la nube
    if (regla === -1 && (up || down || left || right)) {
        // Si la regla es -1 y se está moviendo la nube
        if (regla === -1 && (up || down || left || right)) {
            // Determinar el número de celdas a mover en la dirección del viento
            var moveDistance = 1; // Ajusta esta distancia según la fuerza deseada del viento

            // Mover la nube hacia arriba si se cumple la condición y no está en el borde superior
            if (up && row > moveDistance && grid[row][col] === 1) {
                nextGrid[row][col] = 0;
                nextGrid[row - moveDistance][col] = 1;
            } 
            // Mover la nube hacia abajo si se cumple la condición y no está en el borde inferior
            else if (down && row < rows - moveDistance && grid[row][col] === 1) {
                nextGrid[row][col] = 0;
                nextGrid[row + moveDistance][col] = 1;
            } 
            // Mover la nube hacia la izquierda si se cumple la condición y no está en el borde izquierdo
            else if (left && col > moveDistance && grid[row][col] === 1) {
                nextGrid[row][col] = 0;
                nextGrid[row][col - moveDistance] = 1;
            } 
            // Mover la nube hacia la derecha si se cumple la condición y no está en el borde derecho
            else if (right && col < cols - moveDistance && grid[row][col] === 1) {
                nextGrid[row][col] = 0;
                nextGrid[row][col + moveDistance] = 1;
            } 
        } 
    } 
    // Si no se está moviendo la nube
    else {
        // Si la celda actual contiene una nube
        if (grid[row][col] === 1) {
            // Si la temperatura es alta y la humedad es baja, la nube se disipa
            if (t > 10 || h < 75) {
                nextGrid[row][col] = 0;
            } 
            // Si la temperatura es baja y la humedad es alta, la nube se expande
            else {
                // Regla 5: incrementar la densidad de nubes en las celdas vecinas
                if (row > 0) nextGrid[row - 1][col] = 1;
                if (row < rows - 1) nextGrid[row + 1][col] = 1;
                if (col > 0) nextGrid[row][col - 1] = 1;
                if (col < cols - 1) nextGrid[row][col + 1] = 1;
            }
        } 
        // Si la celda actual está vacía
        else {
            // Si la temperatura es baja y la humedad es alta, se forma una nueva nube
            if (t <= 10 && h >= 75) {
                // Regla 4: contar el número de vecinos con nubes
                var neighborClouds = 0;
                if (row > 0 && grid[row - 1][col] === 1) neighborClouds++;
                if (row < rows - 1 && grid[row + 1][col] === 1) neighborClouds++;
                if (col > 0 && grid[row][col - 1] === 1) neighborClouds++;
                if (col < cols - 1 && grid[row][col + 1] === 1) neighborClouds++;
                
                // Si hay al menos 3 vecinos con nubes, se forma una nueva nube
                if (neighborClouds >= 3 ) {
                    nextGrid[row][col] = 1;
                } 
                // Si hay menos de 3 vecinos con nubes, la celda permanece vacía
                else {
                    var vec=countNeighborClouds(row,col);
                    if(vec>=4)
                        nextGrid[row][col] = 1;
                    else
                        nextGrid[row][col] = 0;
                }
            }
        }
    }
}

// Obtener el elemento del slider
// Obtener el elemento del slider
const slider = document.getElementById("temp-slider");
const output = document.getElementById("temp-value");
const output2 = document.getElementById("humidity-value");
const slider2 = document.getElementById("humidity-slider");
// Función para actualizar maxTemp y el valor del span
function updateMaxTemp(value) {
    maxTemperatura = value;
    output.textContent = value; // Actualiza el valor del span con el nuevo valor de maxTemp
}
// Función para actualizar maxTemp y el valor del span
function updateMinHum(value) {
    minHumedad = value;
    output2.textContent = value; // Actualiza el valor del span con el nuevo valor de maxTemp
}

// Agregar un evento de escucha al slider para detectar cambios
slider.addEventListener("input", function() {
    // Obtener el valor del slider
    const newValue = parseInt(slider.value);
    
    // Actualizar maxTemp
    updateMaxTemp(newValue);

    // Mostrar el nuevo valor de maxTemp
    console.log("Nuevo valor de maxTemperatura:", maxTemperatura);
});
slider2.addEventListener("input", function() {
    // Obtener el valor del slider de humedad
    const newValue = parseInt(slider2.value);
    
   
    updateMinHum(newValue);

    // Mostrar el nuevo valor de maxHumedad
    console.log("Nuevo valor de minHumedad:", minHumedad);
});
// Start everything
window.onload = initialize;
