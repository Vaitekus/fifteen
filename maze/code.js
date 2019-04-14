(function(){
    const GAME_SETTINGS = {
      color: [-1, 0, 1, 2, 3], //black, white, green, pink, yellow
	    colorName: ['black', 'white', 'green', 'pink', 'yellow'],
    };
    const holder = document.getElementById("table");
    
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
        [0, 0, 0, 0, 0, -1, -1, -1, -1, 0],
        [0, -1, -1, -1, 0, -1, 0, 0, 0, 0],
        [0, -1, 0, -1, 0, -1, -1, -1, -1, 0],
        [0, -1, 0, 0, 0, 0, 0, 0, -1, 0] 
    ];
    const gridWidth = 10;
    const gridHeight = 10;

    createMaze();
    document.getElementById("findPath").addEventListener("click", function() {
      drowPath(grid, startX, startY, endX, endY);
    });
    document.getElementById("generateGrid").addEventListener("click", function() {
      generateRandomMaze(gridHeight, gridWidth, startX, startY, endX, endY);
      createMaze();
    });

    function generateRandomMaze(rows, cols, x1, y1, x2, y2) {
      //console.log(findSearch());
      if(grid.length) {
        holder.innerHTML = '';
      };
      grid = [];
      const percentChance = 0.5;
      for (var i = 0; i < rows; i++){
        grid.push([]);
        for (var j=0; j < cols; j++) {
            if (Math.random() < percentChance) {
              grid[i].push(0);
            } else {
              grid[i].push(-1);
            }
        }
      }

      grid[x1][y1] = 0;
      grid[x2][y2] = 0;
      console.log( x1, y1, x2, y2);
    }

    function createMaze() {
      for(let i = 0; i < gridHeight; i++) {
        const currentRow = document.createElement('tr');

        holder.appendChild(currentRow);

        for(let j = 0; j < gridWidth; j++) {
          let cell;
          if(j == startX && i == startY) {
            cell = addBackground(1);
          } else if (j == endX && i == endY) {
            cell = addBackground(2);
          } else {
            cell = addBackground(grid[i][j]);
          }

          cell.setAttribute('class', 'cell');
          currentRow.appendChild(cell);
        }
      } 
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
      let toVisit = [[x1, y1]];

      while(toVisit.length) {
        xPosition = toVisit[0][0];
        yPosition = toVisit[0][1];

        for (var i = xPosition-1; i < xPosition+2; i++) {
          for (var j = yPosition-1; j < yPosition+2; j++) {
            if (neighbourCheck(matrix, i, j, x1, y1, 0)) {
              matrix[i][j] = matrix[xPosition][yPosition] + 1;
              toVisit.push([i, j]);
            }
          }
        }
        toVisit.shift(); 
      }
      
      const distance = matrix[x2][y2];
      return [matrix, distance];
    };

    function neighbourCheck (matrix, i, j, x1, y1, value) {
      return matrix[i] && (matrix[i][j] === value) && !(i === xPosition && j === yPosition) && !(i === x1 && j === y1);
    };

    function backtrace(matrix, x1, y1, x2, y2) { 
      let previousValue = matrix[x2][y2];
      const successfulRoute = [];
      let x = x2;
      let y = y2;
      
      while (!(x === x1 && y === y1) ) {
        for (var i = x-1; i < x+2; i++) {
          for (var j = y-1; j < y+2; j++){
            if (
              matrix[i] && (matrix[i][j] === previousValue -1) && !(i === x && j === y) ) {
              previousValue = matrix[i][j];
              successfulRoute.push([i, j]);
              x = i;
              y = j;
            } else if (successfulRoute.length == matrix[x2][y2] - 1) {
              x = x1;
              y = y1;
            }
          }
        }   
      }

      successfulRoute.unshift([x2, y2]);
      successfulRoute.push([x1, y1]);
      return successfulRoute.reverse();
  };

  function drowPath(matrix, x1, y1, x2, y2) {
    let newGrid = findSearch(matrix, x1, y1, x2, y2)[0];
    const route = backtrace(newGrid, x1, y1, x2, y2);
    //let elements = document.getElementsByClassName("cell");

    for (var i=0; i < matrix.length; i++) {
      var x = route[i][0];
      var y = route[i][1];
      //console.log(x, y);
      //elements[x][y].style.background='pink';
    }
  }
}());
