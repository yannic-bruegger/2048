function MCTSAlgorithmActuator(gameManager, interval) {
  this.events = {};
  const self = this;

  const id = setInterval(() => {
    const availableMoves = getAvailableMoves(gameManager.grid);
    let move = getNextMctsMove(availableMoves, grid, 1);
    this.move(self, move);
    if(gameManager.over) clearInterval(id);
  }, interval);
}

MCTSAlgorithmActuator.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

MCTSAlgorithmActuator.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

MCTSAlgorithmActuator.prototype.move = function(self, direction) {
  self.emit("move", direction);
}

MCTSAlgorithmActuator.prototype.restart = function () {
  this.emit("restart");
};

MCTSAlgorithmActuator.prototype.keepPlaying = function () {
  this.emit("keepPlaying");
};

MCTSAlgorithmActuator.prototype.getNextMctsMove = function(availableMoves, grid, rounds) {
  let tree = new Node(undefined, grid, availableMoves);
  return MCTS(tree, rounds).bestMove();
}

