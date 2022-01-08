function AdlsInputManager(GameManager) {
  this.events = {};

  // if (window.navigator.msPointerEnabled) {
  //   //Internet Explorer 10 style
  //   this.eventTouchstart    = "MSPointerDown";
  //   this.eventTouchmove     = "MSPointerMove";
  //   this.eventTouchend      = "MSPointerUp";
  // } else {
  //   this.eventTouchstart    = "touchstart";
  //   this.eventTouchmove     = "touchmove";
  //   this.eventTouchend      = "touchend";
  // }


  var self = this;

  // this.runGameTree(self);

  // setInterval(this.runGameTree(self), 1000);
  startAlgo = setInterval(function () {
    self.runGameTree(self)
    if (GameManager.over) {
      clearInterval(startAlgo)
    }
  }, 100);
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

AdlsInputManager.prototype.runGameTree = function (self) {
  console.log(self);
  self.emit("move", Math.floor(Math.random() * 4));
}

AdlsInputManager.prototype.nextMoves = function (self) {

}
