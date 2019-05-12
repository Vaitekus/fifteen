(function(){
  const CELL_COLORS = {
    start: 'green', 
    finish: 'pink',
    path: 'red',
    wall: 'black',
    ground: 'white'
  }
  const holder = document.getElementById("table");
  const cellArray = [];
  const startX = 0;
  const startY = 0;
  const endX = 7;
  const endY = 6;
  const percentChance = 0.6;
  let grid = [
      [0, -1, 0, -1, -1, -1, 0, 0, 0, 0],
      [0, -1, 0, 0, 0, 0, 0, -1, 0, -1],
      [0, -1, 0, -1, -1, -1, -1, -1, 0, -1],
      [0, 0, 0, -1, 0, 0, 0, 0, 0, 0],
      [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
      [0, -1, 0, 0, 0, 0, 0, 0, -1, 0],
      [0, 0, 0, 0, 0, -1, -1, 0, -1, 0],
      [0, -1, -1, -1, 0, -1, 0, 0, 0, 0],
      [0, -1, 0, -1, 0, -1, -1, -1, -1, 0],
      [0, -1, 0, 0, 0, 0, 0, 0, -1, 0] 
  ];
  const gridWidth = 10;
  const gridHeight = 10;

  //event Listeners
  window.addEventListener("load", function() {
    createMaze();
  });

  document.getElementById("findPath").addEventListener("click", function() {
    drowPath(grid, startX, startY, endX, endY);
  });

  document.getElementById("generateGrid").addEventListener("click", function() {
    grid = generateRandomMaze(gridHeight, gridWidth, startX, startY, endX, endY);
    holder.innerHTML = '';
    createMaze();
  });

  function cloneArray(array) {
    return JSON.parse(JSON.stringify(array));
  }

  function generateRandomMaze(rows, cells, startX, startY, endX, endY) {
    let generatedGrid;
    let cloneGrid;

    do {
      generatedGrid = generateGrid(rows, cells, startX, startY, endX, endY);
      cloneGrid = cloneArray(generatedGrid);
    } while (changeMatrix(cloneGrid, startX, startY)[endX][endY] === 0);

    return generatedGrid;
  }

  function generateGrid(rows, cells, startX, startY, endX, endY) {
    let GeneratedMatrix = [];

    for (let i = 0; i < rows; i++){
      GeneratedMatrix.push([]);

      for (let j=0; j < cells; j++) {
        GeneratedMatrix[i].push(Math.random() < percentChance ? 0 : -1)
      }
    }
    GeneratedMatrix[startX][startY] = 0;
    GeneratedMatrix[endX][endY] = 0;

    return GeneratedMatrix;
  }

  function createMaze() {
  
    for(let i = 0; i < gridHeight; i++) {
      const currentRow = document.createElement('tr');
      holder.appendChild(currentRow);

      for(let j = 0; j < gridWidth; j++) {
        const cell = createCell(i, j);
        
        currentRow.appendChild(cell);
        cellArray.push(cell);
      }
    }

    grid[startX][startY] = 0;
    grid[endX][endY] = 0;
  };

  function createCell(cellY, cellX) {
    const cell = document.createElement('td');

    if (cellY == startX && cellX == startY) {
      cellBackground = CELL_COLORS.start;
    } else if (cellY == endX && cellX == endY) {
      cellBackground = CELL_COLORS.finish;
    } else if (grid[cellY][cellX] == -1) {
      cellBackground = CELL_COLORS.wall;
    } else {
      cellBackground = CELL_COLORS.ground;
    }
    
    cell.setAttribute('class', 'cell');
    cell.style.background = cellBackground;
    cell.xCoordinate = cellY;
    cell.yCoordinate = cellX;

    return cell;
  }

  function changeMatrix(matrix, startX, startY) {
    let toVisitGrid = [[startX, startY]];

    while(toVisitGrid.length) {
      let xPosition = toVisitGrid[0][0];
      let yPosition = toVisitGrid[0][1];
     
      for (var i = xPosition-1; i < xPosition+2; i++) {
        for (var j = yPosition-1; j < yPosition+2; j++) {
          if (isValid(matrix, i, j, startX, startY, 0, xPosition, yPosition)) {
            matrix[i][j] = matrix[xPosition][yPosition] + 1;
            toVisitGrid.push([i, j]);
          }
        }
      }
      toVisitGrid.shift(); 
    }
    return matrix;
  }; 

   function isValid (matrix, i, j, startX, startY, value, x, y) {
     return matrix[i] && (matrix[i][j] === value) && !(i === x && j === y) && !(i === startX && j === startY) && (x === i || y === j);
  };

  function backtrace(matrix, startX, startY, endX, endY) { 
    let previousValue = matrix[endX][endY];
    const successfullRoute = [];
    let x = endX;
    let y = endY;
    
    while (!(x === startX && y === startY) ) {
      for (var i = x-1; i < x+2; i++) {
        for (var j = y-1; j < y+2; j++){
          if (matrix[i] && (matrix[i][j] === previousValue -1) && !(i === x && j === y) ) {
            previousValue = matrix[i][j];
            successfullRoute.push([i, j]);
            x = i;
            y = j;
          } else if (successfullRoute.length == matrix[endX][endY] - 1) {
            x = startX;
            y = startY;
          } else {
            continue;
          }
        }
      }   
    }

    successfullRoute.unshift([endX, endY]);
    successfullRoute.push([startX, startY]);
    return successfullRoute.reverse();
};

function drowPath(matrix, startX, startY, endX, endY) {
  let createdGrid = changeMatrix(matrix, startX, startY);
  const route = backtrace(createdGrid, startX, startY, endX, endY);

  for (var i = 0; i < route.length; i++) {
    let x = route[i][0];
    let y = route[i][1];

    cellArray.forEach(cell => {
      if(cell.xCoordinate === x && cell.yCoordinate === y) cell.style.background = CELL_COLORS.path;
    })
  }
}
}());
