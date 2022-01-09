function RandomAlgorithmActuator(gameManager) {
  this.events = {};
  const self = this;

  const id = setInterval(() => {
    const availableMoves = getAvailableMoves(gameManager.grid);
    const index = Math.floor(Math.random() * availableMoves.length + 0);
    this.move(self, availableMoves[index])
    if(gameManager.won) self.emit('keepPlaying');
    if(gameManager.over) clearInterval(id);
  }, 100);
}

RandomAlgorithmActuator.prototype.run = function (event, callback) {
}

RandomAlgorithmActuator.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

RandomAlgorithmActuator.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

RandomAlgorithmActuator.prototype.move = function(self, direction) {
  self.emit("move", direction);
}

RandomAlgorithmActuator.prototype.restart = function () {
  this.emit("restart");
};

RandomAlgorithmActuator.prototype.keepPlaying = function () {
  this.emit("keepPlaying");
};