let gm = undefined;

const inputManagers = {
  'Play manually': KeyboardInputManager,
  'Random': RandomAlgorithmActuator,
  'MCTS': MCTSAlgorithmActuator,
  'ADLS': AdlsInputManager,
  'Cerulli': CerulliAlgorithmActuator,
}

// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  // new GameManager(4, AdlsInputManager, HTMLActuator, LocalStorageManager);
  // new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  // new GameManager(4, RandomAlgorithmActuator, HTMLActuator, LocalStorageManager);
  // let gm = new GameManager(4, MCTSAlgorithmActuator, HTMLActuator, LocalStorageManager);
  // new GameManager(4, CerulliAlgorithmActuator, HTMLActuator, LocalStorageManager);
  //gm = new GameManager(4, MCTSAlgorithmActuator, HTMLActuator, LocalStorageManager);
});


function startGame() {
  toggleInput();
  if(gm) {
    gm.actuator.continueGame();
  }
  let algorithm = document.querySelector('#algorithm').value;
  let repeats = document.querySelector('#repeats').value;
  gm = new GameManager(4, inputManagers[algorithm], HTMLActuator, LocalStorageManager);
  const logs = [];
  let counter = 0;
  gm.on('finish', (data) => {
    logs.push(data);
    if(counter < repeats - 1) {
      gm.inputManager.restart();
    } else {
      console.log(logs);
    }
    counter++;
  });
}

function stopGame() {
  if(gm) {
    delete gm.inputManager;
    gm.storageManager.clearGameState();
    gm.actuator.continueGame(); // Clear the game won/lost message
    gm.actuator.clearContainer(gm.actuator.tileContainer);
    // gm = new GameManager(4, inputManagers['Play manually'], HTMLActuator, LocalStorageManager);
  }
}

let enabled = true;

function toggleInput() {
  document.querySelectorAll('#algorithm, input').forEach((element)=> element.disabled = enabled);
  enabled = !enabled;
}