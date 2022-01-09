class MCTSNode {
  constructor(initialParent, initialGrid, initialAvailableMoves, move) {
    this.parent = initialParent || undefined;
    this.children = [];
    this.visits = 0;
    this.wins = 0;
    this.move = move;

    this.grid = initialGrid || undefined;
    this.availableMoves = initialAvailableMoves || undefined;
  }

  getScore(){
    let scorePerVisit = 0;
    const C = 1;
    if (this.visits === 0) return Infinity;
    if (!this.parent) return 0;

    scorePerVisit = this.wins / this.visits;
    return scorePerVisit + C * Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
  }
}

class MCTS {
  constructor(initialRootNode, initialRounds){
    this.self = this;
    this.rootNode = initialRootNode || new MCTSNode();
    this.rounds = initialRounds || 1000
  }

  getBestMove(deep) {
    let currentNode = this.rootNode;
    
    for(let round = 0; round < this.rounds; round++){
      if (currentNode.children.length === 0){
        if (currentNode.visits === 0) {
          // ROLLOUT
          let randomMove = getAvailableMoves(currentNode.grid).sort((a, b) => Math.random() > 0.5 ? 1 : -1)[0];
          let won = this.simulate(currentNode.grid, randomMove);
          do {
            currentNode.visits += 1;
            currentNode.wins += won;
            if(currentNode !== this.rootNode) currentNode = currentNode.parent;
          } while(currentNode.parent);
        } else {
          currentNode.availableMoves.forEach((move) => {
            let newGrid = simulateMove(currentNode.grid, move);
            currentNode.children.push(new MCTSNode(currentNode, newGrid, getAvailableMoves(newGrid), move));
          });
          currentNode = currentNode.children[0];
          // ROLLOUT
          let randomMove = getAvailableMoves(currentNode.grid).sort((a, b) => Math.random() > 0.5 ? 1 : -1)[0];
          let won = this.simulate(currentNode.grid, randomMove);
          do {
            currentNode.visits += 1;
            currentNode.wins += won;
            if(currentNode !== this.rootNode) currentNode = currentNode.parent;
          } while(currentNode.parent);
        }
      } else {
        currentNode = currentNode.children.sort((a, b) => a.getScore() > b.getScore() ? -1 : 1)[0];
      }
    }
    return this.rootNode.children.sort((nodeA, nodeB) => nodeA.visits > nodeB.visits ? -1 : 1)[0].move;
  }

  simulate(grid, direction) {
    let newGrid = generateOnePosibleNextState(simulateMove(grid, direction));
    if(is2048reached(newGrid)) return true;
    if(getAvailableMoves(newGrid).length === 0) return false;
    return this.simulate(newGrid, getAvailableMoves(newGrid).sort((a, b) => Math.random() > 5 ? 1 : -1)[0]);
  }
}