function MCTSAlgorithmActuator(gameManager) {
  this.events = {};
  this.gameManager = gameManager;
}

MCTSAlgorithmActuator.prototype.run = function(){
  let counter = 0;
  let id = setInterval(() => {
    const self = this;
    const availableMoves = getAvailableMoves(this.gameManager.grid);
    let move = this.getNextMctsMove(availableMoves, this.gameManager.grid, 4);
    counter++ > 300 ? clearInterval(id) : null;
  }, 1000);
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
  let tree = new MCTSNode(undefined, grid, availableMoves, undefined);
  this.move(this, (new MCTS(tree, rounds)).getBestMove());
  return;
}

