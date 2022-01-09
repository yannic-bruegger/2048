const Moves = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
}

function getAvailableMoves(grid) {
  const availableMoves = [Moves.UP, Moves.RIGHT, Moves.DOWN, Moves.LEFT];
  return availableMoves.filter((move) => isMoveAvailable(grid, move));
}

function simulateMove(grid, direction){
  const newGrid = Object.assign(grid);
  var vector     = getVector(direction);
  var traversals = buildTraversals(vector, newGrid);
  var moved      = false;
  var cell, tile;

  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = newGrid.cellContent(cell);

      if (tile) {
        var positions = findFarthestPosition(cell, vector, newGrid);
        var next      = newGrid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          newGrid.insertTile(merged);
          newGrid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

          // The mighty 2048 tile
          if (merged.value === 2048) self.won = true;
        } else {
          moveTile(tile, positions.farthest, newGrid);
        }

        if (!positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });
  return newGrid;
}

function generateOnePosibleNextState(grid){
  let newGrid = new Grid(grid.size, grid.cells);
  newGrid.addRandomTile();
  return newGrid;
}

function generateAllPossibleNextStatesWithProbability(grid){
  const possibleStates = [];
  for(let x = 0; x < grid.size; x++){
    for(let y = 0; y < grid.size; y++){
      if(grid.cells[x][y] === null) {
        const possibility2 = new Grid(grid.size, grid.cells);
        const possibility4 = new Grid(grid.size, grid.cells);
        possibility2.cells[x][y] = new Tile({x: x, y: y}, 2);
        possibility4.cells[x][y] = new Tile({x: x, y: y}, 4);
        possibleStates.push({ probability: 0.9, grid: possibility2 });
        possibleStates.push({ probability: 0.1, grid: possibility4 });
      } 
    }
  }
  console.log(possibleStates)
  return possibleStates;
}

function getVector(direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

function isMoveAvailable(grid, direction) {
  // 0: up, 1: right, 2: down, 3: left
  var tile;
  var vector = getVector(direction);
  for (var x = 0; x < grid.size; x++) {
    for (var y = 0; y < grid.size; y++) {
      tile = grid.cellContent({ x: x, y: y });
      if (tile) {
        var cell   = { x: x + vector.x, y: y + vector.y };
        if (!grid.withinBounds(cell))
          continue;
        var otherTile  = grid.cellContent(cell);
        // The current tile can be moved if the cell is empty or has the same value.
        if (!otherTile || otherTile.value === tile.value) {
          return true;
        }
      }
    }
  }
  return false;
};

function buildTraversals(vector, grid) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < grid.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

function findFarthestPosition(cell, vector, grid) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (grid.withinBounds(cell) &&
           grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

function moveTile(tile, cell, grid) {
  grid.cells[tile.x][tile.y] = null;
  grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

function positionsEqual(first, second) {
  return first.x === second.x && first.y === second.y;
};

function addRandomTile(grid) {
  if (grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2 : 4;
    var tile = new Tile(grid.randomAvailableCell(), value);
    grid.insertTile(tile);
  }
};

function is2048reached(grid) {
  let found2048 = false;
  grid.eachCell((cell) => { if (cell.value === 2048) found2048 = true;});
  return found2048;
}