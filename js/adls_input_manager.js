const DEPTH = 2; // 1 == depth 2

function AdlsInputManager(gameManager, interval) {
  this.events = {};
  const self = this;

  setTimeout(function () {
    gameManager.grid.score = 0;
    const gameInterval = setInterval(() => {
      start(gameManager);
      if(gameManager.over) clearInterval(gameInterval);
    }, interval);
  }, 200);

  function start (gameManager) {
    generatePseudoTile(gridStructure(gameManager), 0, gameManager);
  }

  function gridStructure(grid) {
    return [{grid: grid.grid, moves: []}]
  }

  function generatePseudoTile(data, depthLV, gameManager) {

    if (depthLV < DEPTH) {
      const collectNewGrids = [];
      // Jedes Grid (4 pro Ebene)
      data.forEach((item) => {
        // Jeder Move für current Grid
        getAvailableMoves(item.grid).forEach((move) => {
          const newGrid = simulateMove(item.grid, move)
          collectNewGrids.push({grid: addRandomTile(newGrid), moves: item.moves.concat(move)})
        });
      });

      depthLV++
      generatePseudoTile(collectNewGrids, depthLV)

    } else {
      // Filter for best scores
      data = data.filter(item => Object.keys(item.grid).indexOf('score') > -1)
      data = data.sort((a, b) => b.grid.score - a.grid.score)

      // Catch empty data
      if (data !== []) {
        const maxVal = data[0].grid.score
        data = data.filter(item => item.grid.score === maxVal)

        // Get the "best" move
        const bestMoves = data.map((item) => {return item.moves[0]})
        const countMoves = bestMoves.reduce((acc, value) => ({
           ...acc,
           [value]: (acc[value] || 0) + 1
        }), {});
        const bestMove = parseInt(Object.keys(countMoves).reduce(function(a, b){ return countMoves[a] > countMoves[b] ? a : b }));

        // Move Tile
        self.move(self, bestMove)
      }
    }
  }

}


AdlsInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

AdlsInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

AdlsInputManager.prototype.move = function(self, direction) {
  self.emit("move", direction);
}

AdlsInputManager.prototype.restart = function () {
  this.emit("restart");
};

AdlsInputManager.prototype.keepPlaying = function () {
  this.emit("keepPlaying");
};
