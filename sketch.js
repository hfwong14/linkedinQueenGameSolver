let img;
let gridSize;
let tileSize; // Size of each tile
let colorList = []; // Array to hold colors
let boardGrid = [];
let colorLabelDict = {};
let labelColorDict = {};
let embedGrid = [];

function preload() {
  // img = loadImage('board3.png'); // Load your image
  img = loadImage('board4.jpg'); // Load your image
}

function setup() {
  createCanvas(800, 800); // Adjust canvas size as needed
  img.loadPixels(); // Load image pixels
  getBoardGrid();

  // copy from draw() so it only run once
  background(255);
  displayBoard();
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
  let coordSpacing = round(img.width / (gridSize * 2));
  let coordList = [coordSpacing];
  tileSize = coordSpacing * 2
  
  let curCoord = coordSpacing;
  for (let i = 1; i < gridSize; i++) {
    curCoord += tileSize;
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

  // Check it didn't mis-detect more or less colors
  colorList = getDistinctColors(boardGrid);
  if (colorList.size != gridSize) {
    alert("Mismatch between color and board size!")
  }

  // Embedding colors to labels
  let curColorIndex = 0;
  colorList.forEach(curColorStr => {
    colorLabelDict[curColorStr] = curColorIndex;
    labelColorDict[curColorIndex] = curColorStr;
    curColorIndex++;
  })  

  embeddingBoard();
}

function embeddingBoard() {
  console.log(boardGrid)
  boardGrid.forEach(row => {
    let curRowList = [];
    row.forEach(x => {
      curRowList.push(colorLabelDict[getColorString(x)]);
    });

    embedGrid.push(curRowList);
  })
}

function displayBoard() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let curColor = boardGrid[j][i];
      fill(curColor);
      stroke(0);
      rect(i * tileSize, j * tileSize, tileSize, tileSize);
      
      // Display text at the center of the cell
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(16);
      let cellText = `${embedGrid[j][i]}`;
      text(cellText, i * tileSize + tileSize / 2, j * tileSize + tileSize / 2);
    }
  }
}

function mousePressed() {
  let col = floor(mouseX / tileSize);
  let row = floor(mouseY / tileSize);

  if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
    // highlightTile(col, row);
  }
}

function highlightTile(col, row) {
  fill(255, 0, 0, 150); // Semi-transparent red for highlight
  noStroke();
  rect(col * tileSize, row * tileSize, tileSize, tileSize);
}

function getDistinctColors(colors) {
  let colorSet = new Set();

  // Loop through the 2D array
  for (let row of colors) {
    for (let col of row) {
      // Convert color to a string for uniqueness
      let colorString = getColorString(col);
      colorSet.add(colorString); // Add to the set
    }
  }

  return colorSet; // Return the count of distinct colors
}

function getColorString(curColor) {
  return `${curColor.levels[0]}_${curColor.levels[1]}_${curColor.levels[2]}`
}
