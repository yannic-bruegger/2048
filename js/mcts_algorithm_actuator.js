function MCTSAlgorithmActuator(gameManager) {
  this.events = {};
  this.gameManager = gameManager;
  const self = this;
  setTimeout(() => {
    let id = setInterval(() => {
      const availableMoves = getAvailableMoves(this.gameManager.grid);
      let move = this.getNextMctsMove(availableMoves, this.gameManager.grid, 100);
      if(this.gameManager.won) self.emit('keepPlaying');
      if(this.gameManager.over) clearInterval(id);
    }, 100);
  }, 100);
}

MCTSAlgorithmActuator.prototype.run = function(){
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

