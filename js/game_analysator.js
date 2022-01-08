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

function sumulateMove(gameState, direction){
  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;
  var cell, tile;

  let grid = new Grid(4, gameState.grid);
}

function generateAllPossibleNextStatesWithProbability(){
  return [
  /* 
    { probability: 0.9, gameState },
    { probability: 0.9, gameState },
    { probability: 0.9, gameState },
    { probability: 0.9, gameState },
    { probability: 0.9, gameState }
  */
  ];
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


