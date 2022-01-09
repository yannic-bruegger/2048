class Node {
  constructor(initialParent, initialGrid, initialAvailableMoves, move) {
    let parent = initialParent || undefined;
    let children = [];
    let visits = 0;
    let wins = 0;
    let move = move || undefined;

    let grid = initialGrid || undefined;
    let availableMoves = initialAvailableMoves || undefined;
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
    let self = this;
    let rootNode = initialRootNode || new Node();
    let rounds = initialRounds || 1000
  }

  getBestMove(deep) {
    let round;
    let currentNode = this.rootNode;

    for(let i = 0; i < rounds; i++){
      if (currentNode.children.length !== 0){
        if (currentNode.visits === 0) {
          let randomMove = getAvailableMoves(newGrid).sort((a, b) => Math.random() > 5 ? 1 : -1)[0];
          let won = simulate(currentNode.grid, randomMove);
          while(currentNode.parent){
            currentNode.visits += 1;
            currentNode.wins += won;
            currentNode = currentNode.parent;
          }
        } else {
          currentNode.availableMoves.forEach((move) => {
            let newGrid = simulateMove(currentNode.grid, move);
            currentNode.children.push(new Node(currentNode, newGrid, getAvailableMoves(newGrid), move));
          });
          currentNode = currentNode.children[0];
          let randomMove = getAvailableMoves(newGrid).sort((a, b) => Math.random() > 5 ? 1 : -1)[0];
          let won = simulate(currentNode.grid, randomMove);
          while(currentNode.parent){
            currentNode.visits += 1;
            currentNode.wins += won;
            currentNode = currentNode.parent;
          }
        }
      } else {
        currentNode = currentNode.children.sort((a, b) => a.getScore() > b.getScore() ? 1 : -1);
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

  expand(node) {
    node.availableMoves
  }
}

class Game2048 {
  constructor() {
    const getPossibleMoves = () => {

    };

    const performMove = (move) => {

    };

    const getCurrentPlayer = () => {

    };

    const getWinner = () => {

    }
  }

}