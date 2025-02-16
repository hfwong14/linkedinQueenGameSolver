let img;
let gridSize;
let tileSize; // Size of each tile
let boardColors = []; // Array to hold colors
let boardGrid = [];

function preload() {
  img = loadImage('board3.png'); // Load your image
}

function setup() {
  createCanvas(800, 800); // Adjust canvas size as needed
  img.loadPixels(); // Load image pixels
  // determineGridSize(); // Determine grid size
  // extractColors(); // Extract colors from the image
  getBoardGrid();

  // copy from draw() so it only run once
  background(255);
  drawBoard();
}

function draw() {
  // background(255);
  // drawBoard();
}

function getColCount() {
  let colCount = 0;
  let lastColor;
  let consequtiveCount = 0;
  let countedThisArea = false;
  let area_threshold = 30;

  let y = 5;
  for (let x = 0; x < img.width; x++) {
    let index = (x + y * img.width) * 4;
    let r = img.pixels[index];
    let g = img.pixels[index + 1];
    let b = img.pixels[index + 2];

    let color = r + '_' + g + '_' + b;
    if (lastColor == undefined) {
      lastColor = color;
      consequtiveCount += 1;
      continue;
    }

    if (lastColor != color) {
      consequtiveCount = 0;
      countedThisArea = false;
      lastColor = color;
      continue;
    }

    consequtiveCount += 1 ;
    if (consequtiveCount >= area_threshold && !countedThisArea) {
      colCount += 1;
      countedThisArea = true;
    }
  }

  gridSize = colCount;
  return colCount;
}

function getGridMiddle() {
  console.log(img.width)
  let coordSpacing = round(img.width / (gridSize * 2));
  console.log(coordSpacing)
  let coordList = [coordSpacing];
  
  let curCoord = coordSpacing;
  for (let i = 1; i < gridSize; i++) {
    curCoord += (coordSpacing * 2);
    curCoord = round(curCoord);
    coordList.push(curCoord);
  }

  console.log(coordList);
  return coordList;
}

function getBoardGrid() {
  getColCount();
  console.log(`Grid Size: ${gridSize}`);

  let coordList = getGridMiddle();

  coordList.forEach(y => {

    let curRowList = [];
    coordList.forEach(x => {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let curColor = color(r, g, b);
      console.log(r, g, b)
      curRowList.push(curColor);
    });
    boardGrid.push(curRowList);
  })
}

function drawBoard() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      fill(boardGrid[i][j]);
      stroke(0);
      rect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
}

function mousePressed() {
  let col = floor(mouseX / tileSize);
  let row = floor(mouseY / tileSize);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    highlightTile(col, row);
  }
}

function highlightTile(col, row) {
  fill(255, 0, 0, 150); // Semi-transparent red for highlight
  noStroke();
  rect(col * tileSize, row * tileSize, tileSize, tileSize);
}

function determineGridSize() {
  // Assuming grid is a square, find the size based on a threshold for tile color change
  cols = 0;
  rows = 0;
  let threshold = 150; // Adjust as needed for color detection
  let lastColor = null;

  let black_threshold = 15;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Ignore black color (grid border)
      // if (r <= black_threshold && g <= black_threshold && b <= black_threshold) {
      //   continue;
      // }

      let currentColor = color(r, g, b);
      
      // Check if color has changed significantly
      // if ()
      if (!lastColor || dist(currentColor.levels[0], currentColor.levels[1], currentColor.levels[2],
                              lastColor.levels[0], lastColor.levels[1], lastColor.levels[2]) > threshold) {
        if (x > cols) cols = x; // Track the width
        if (y > rows) rows = y; // Track the height
        lastColor = currentColor;
        }
    }
  }
  
  // Set tile size based on detected rows and cols
  tileSize = width / cols;

  // Initialize the color map
  tileColorMap = Array.from({ length: cols }, () => Array(rows).fill(color(255)));
}

function extractColors() {
  img.loadPixels(); // Load the pixel data again after resizing
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Ignore black color (grid border)
      if (!(r === 0 && g === 0 && b === 0)) {
        let colIndex = floor(i / tileSize);
        let rowIndex = floor(j / tileSize);
        
        // Store the color in the color map
        if (colIndex < cols && rowIndex < rows) {
          tileColorMap[colIndex][rowIndex] = color(r, g, b);
        }
      }
    }
  }
}