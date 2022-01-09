// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  // new GameManager(4, AdlsInputManager, HTMLActuator, LocalStorageManager);
  // new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  // new GameManager(4, RandomAlgorithmActuator, HTMLActuator, LocalStorageManager);
  // let gm = new GameManager(4, MCTSAlgorithmActuator, HTMLActuator, LocalStorageManager);
  // new GameManager(4, CerulliAlgorithmActuator, HTMLActuator, LocalStorageManager);
  
  let adlsCounter = 0;
  const adlsRuns = 3;
  let logs = [];
  gm = new GameManager(4, MCTSAlgorithmActuator, HTMLActuator, LocalStorageManager);
  gm.on('finish', (data) => {
    logs.push(data);
    if(adlsCounter < adlsRuns) {
      gm.inputManager.restart();
    } else {
      console.log(logs);
    }
    adlsCounter++;
  })
});
