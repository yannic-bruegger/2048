function CerulliAlgorithmActuator(gameManager) {
  this.events = {};
  this.gameManager = gameManager;
  const self = this;
  setTimeout(() => {
    this.gameManager.grid.score = 0;
    const id = setInterval(() => {
     const availableMoves = getAvailableMoves(this.gameManager.grid);

     const move = this.askCerulliForMove(this.gameManager.grid, availableMoves, Corners.TL);
     this.move(this, move);
     if(this.gameManager.won) self.emit('keepPlaying');
     if(this.gameManager.over) clearInterval(id);

   }, 100);
  }, 100);
}

CerulliAlgorithmActuator.prototype.run = function() {
}

CerulliAlgorithmActuator.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

CerulliAlgorithmActuator.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

CerulliAlgorithmActuator.prototype.move = function(self, direction) {
  self.emit("move", direction);
}

CerulliAlgorithmActuator.prototype.restart = function () {
  this.emit("restart");
};

CerulliAlgorithmActuator.prototype.keepPlaying = function () {
  this.emit("keepPlaying");
};



const Corners = {
  TL: { preferredMoves: [Moves.LEFT, Moves.UP]},
  TR: { preferredMoves: [Moves.RIGHT, Moves.UP]},
  BR: { preferredMoves: [Moves.RIGHT, Moves.DOWN]},
  BL: { preferredMoves: [Moves.LEFT, Moves.DOWN]},
}

CerulliAlgorithmActuator.prototype.askCerulliForMove = function(grid, availableMoves, corner) {
  let selectedCorner = Corners.TL;
  let optionAScore = 0;
  let optionBScore = 0;
  const isOptionAValid = getAvailableMoves(grid).indexOf(corner.preferredMoves[0]) > -1;
  const isOptionBValid = getAvailableMoves(grid).indexOf(corner.preferredMoves[1]) > -1;

  // console.log(JSON.stringify(grid.cells) == JSON.stringify(simulateMove(grid, corner.preferredMoves[0]).cells));
  // console.log(JSON.stringify(simulateMove(grid, corner.preferredMoves[0]).cells));
  // console.log("");

  if(isOptionAValid){
    // LEFT IS ALLOWED
    const newGrid = simulateMove(grid, corner.preferredMoves[0]);
    optionAScore = newGrid.score;
  }

  if(isOptionBValid){
    // UP IS ALLOWED
    const newGrid = simulateMove(grid, corner.preferredMoves[1]);
    optionBScore = newGrid.score;
  }

  if(isOptionAValid || isOptionBValid) {
    if((optionAScore > optionBScore) && isOptionAValid) return corner.preferredMoves[0];
    if((optionBScore >= optionAScore) && isOptionBValid) return corner.preferredMoves[1];
    if((optionAScore > optionBScore) && isOptionBValid) return corner.preferredMoves[1];
    if((optionBScore >= optionAScore) && isOptionAValid) return corner.preferredMoves[0];
  } else {
    let isBottomLeftFilled = grid.cells[0][3] != null;
    let isTopRightFilled = grid.cells[3][3] != null;

    if (isBottomLeftFilled || isTopRightFilled) {
      if(!isTopRightFilled && !isBottomLeftFilled) return Moves.RIGHT;
      if(isTopRightFilled && (getAvailableMoves(grid).indexOf(Moves.RIGHT) > -1)) return Moves.RIGHT;
      if(isBottomLeftFilled && (getAvailableMoves(grid).indexOf(Moves.DOWN) > -1)) return Moves.DOWN;
      if(isTopRightFilled && !isBottomLeftFilled) return Moves.DOWN;
      if(!isTopRightFilled && isBottomLeftFilled) return Moves.RIGHT;
    } else {
      return Math.floor(Math.random() * 4);
    }


  }

  // if(isOptionAValid || isOptionBValid) {
  //   if((optionAScore > optionBScore) && isOptionAValid) return corner.preferredMoves[0];
  //   if((optionBScore >= optionAScore) && isOptionBValid) return corner.preferredMoves[1];
  //   if((optionAScore > optionBScore) && isOptionBValid) return corner.preferredMoves[1];
  //   if((optionBScore >= optionAScore) && isOptionAValid) return corner.preferredMoves[0];
  //
  //
  // } else {
  //   // Preferred moves not possible?
  //
  //   // > Analyse Grid (See wether first column is filled)
  //   //  > Use fitting alternative
  //   const dimension = grid.cells[0].length;
  //
  //   let isBottomLeftFilled = grid.cells[0][3] != null;
  //   let isTopRightFilled = grid.cells[3][3] != null;
  //   if(!isTopRightFilled && !isBottomLeftFilled) return Moves.RIGHT;
  //   if(isTopRightFilled && (getAvailableMoves(grid).indexOf(Moves.RIGHT) > -1)) return Moves.RIGHT;
  //   if(isBottomLeftFilled && (getAvailableMoves(grid).indexOf(Moves.DOWN) > -1)) return Moves.DOWN;
  //   if(isTopRightFilled && !isBottomLeftFilled) return Moves.DOWN;
  //   if(!isTopRightFilled && isBottomLeftFilled) return Moves.RIGHT;
  // }

  // Hier kommen wir nicht hin, oder?
  return 0;
}
