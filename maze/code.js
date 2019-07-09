(function(){
  const GAME_SETTINGS = {
    color: [-1, 0, 1, 2, 3], //black, white, green, pink, red
    colorName: ['black', 'white', 'green', 'pink', 'red'],
  };
  const holder = document.getElementById("table");
  const cellArray = [];
  const startX = 0;
  const startY = 0;
  const endX = 7;
  const endY = 6;
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

  function generateRandomMaze(rows, cells, x1, y1, x2, y2) {
    let generatedGrid;
    let cloneGrid;

    do {
      generatedGrid = [];
      cloneGrid = [];
      generatedGrid = generateGrid(rows, cells, x1, y1, x2, y2);
      cloneGrid = cloneArray(generatedGrid);
    } while (findSearch(cloneGrid, x1, y1, x2, y2)[1] === 0);

    return generatedGrid;
  }

  function generateGrid(rows, cells, x1, y1, x2, y2) {
    const percentChance = 0.6;
    let newGeneratedGrid = [];

    for (let i = 0; i < rows; i++){
      newGeneratedGrid.push([]);

      for (let j=0; j < cells; j++) {
        if (Math.random() < percentChance) {
          newGeneratedGrid[i].push(0);
        } else {
          newGeneratedGrid[i].push(-1);
        }
      }
    }
    newGeneratedGrid[x1][y1] = 0;
    newGeneratedGrid[x2][y2] = 0;

    return newGeneratedGrid;
  }

  function createMaze() {
    let cell;

    for(let i = 0; i < gridHeight; i++) {
      const currentRow = document.createElement('tr');
      holder.appendChild(currentRow);

      for(let j = 0; j < gridWidth; j++) {
        if(i == startX && j == startY) {
          cell = addBackground(1);
        } else if (i == endX && j == endY) {
          cell = addBackground(2);
        } else {
          cell = addBackground(grid[i][j]);
        }

        cell.setAttribute('class', 'cell');
        currentRow.appendChild(cell);
        cell.xCoordinate = i;
        cell.yCoordinate = j;
        cellArray.push(cell);
      }
    }

    grid[startX][startY] = 0;
    grid[endX][endY] = 0;
  };

  function addBackground(value) {
    const currentCell = document.createElement('td');
    
    switch (value) {
      case -1:
      currentCell.style.background = GAME_SETTINGS.colorName[0];
        break;
      case 0:
      currentCell.style.background = GAME_SETTINGS.colorName[1];
        break;
      case 1:
      currentCell.style.background = GAME_SETTINGS.colorName[2];
        break;
      case 2:
      currentCell.style.background = GAME_SETTINGS.colorName[3];
        break;
      default:
      currentCell.style.background = GAME_SETTINGS.colorName[4];
    }

    return currentCell;
  };

  function findSearch(matrix, x1, y1, x2, y2) {
    let toVisitGrid = [[x1, y1]];

    while(toVisitGrid.length) {
      let xPosition = toVisitGrid[0][0];
      let yPosition = toVisitGrid[0][1];
     
      for (var i = xPosition-1; i < xPosition+2; i++) {
        for (var j = yPosition-1; j < yPosition+2; j++) {
          if (isValid(matrix, i, j, x1, y1, 0, xPosition, yPosition)) {
            matrix[i][j] = matrix[xPosition][yPosition] + 1;
            toVisitGrid.push([i, j]);
          }
        }
      }
      toVisitGrid.shift(); 
    }
    
    const distance = matrix[x2][y2];
    return [matrix, distance];
  }; 

   function isValid (matrix, i, j, x1, y1, value, x, y) {
     return matrix[i] && (matrix[i][j] === value) && !(i === x && j === y) && !(i === x1 && j === y1) && (x === i || y === j);
  };

  function backtrace(matrix, x1, y1, x2, y2) { 
    let previousValue = matrix[x2][y2];
    const successfullRoute = [];
    let x = x2;
    let y = y2;
    
    while (!(x === x1 && y === y1) ) {
      for (var i = x-1; i < x+2; i++) {
        for (var j = y-1; j < y+2; j++){
          if (
            matrix[i] && (matrix[i][j] === previousValue -1) && !(i === x && j === y) ) {
            previousValue = matrix[i][j];
            successfullRoute.push([i, j]);
            x = i;
            y = j;
          } else if (successfullRoute.length == matrix[x2][y2] - 1) {
            x = x1;
            y = y1;
          }
        }
      }   
    }

    successfullRoute.unshift([x2, y2]);
    successfullRoute.push([x1, y1]);
    return successfullRoute.reverse();
};

function drowPath(matrix, x1, y1, x2, y2) {
  let newGrid = findSearch(matrix, x1, y1, x2, y2);
  const route = backtrace(newGrid[0], x1, y1, x2, y2);

  for (var i = 0; i < route.length; i++) {
    let x = route[i][0];
    let y = route[i][1];

    cellArray.forEach(cell => {
      if(cell.xCoordinate === x && cell.yCoordinate === y) cell.style.background = GAME_SETTINGS.colorName[4];;
    })
  }
}
}());
