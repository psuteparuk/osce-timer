(function() {
  'use strict';

  var defaultOptions = {
    numProblems: 10,
    timePerProblem: 300,
    reminderTime: 30,
    startingProblem: 1
  };

  var OSCETimer = function(options) {
    options = options || {};
    this._options = defaultOptions;
    for (var prop in options) {
      if (this._options.hasOwnProperty(prop)) this._options[prop] = options[prop];
    }

    this._currentProblem = 1;
    this._totalTime = 0;
    this._timeElapsed = 0;
    this._timeRemainedForCurrentProblem = 0;
    this._timer = new Timer();

    this._timer.on('tick', function() {
      this.step(typeof this.ontick === 'function' ? this.ontick : null);
    }.bind(this));

    this._timer.on('end', function() {
      if (typeof this.onend === 'function') this.onend();
    }.bind(this));
  };

  OSCETimer.prototype.set = function(option, value) {
    if (typeof option !== 'string') return;
    if (this._options.hasOwnProperty(option)) this._options[option] = value;
  };

  OSCETimer.prototype.start = function() {
    var status = this._timer.getStatus();

    if (status === 'initialized' || status === 'stopped') {
      this._currentProblem = this._options.startingProblem;
      this._totalTime = (this._options.numProblems - this._options.startingProblem + 1) * this._options.timePerProblem;
      this._timeElapsed = 0;
      this._timeRemainedForCurrentProblem = this._options.timePerProblem;
      this._timer.start(this._totalTime);
    } else if (status === 'paused') {
      this._timer.start();
    }
  };

  OSCETimer.prototype.pause = function() {
    this._timer.pause();
  }

  OSCETimer.prototype.reset = function() {
    this._options = defaultOptions;
    this._currentProblem = 1;
    this._totalTime = 0;
    this._timeElapsed = 0;
    this._timeRemainedForCurrentProblem = 0;
    this._timer.stop();
  };

  OSCETimer.prototype.step = function(callback) {
    this._timeElapsed++;
    this._timeRemainedForCurrentProblem = (this._currentProblem-this._options.startingProblem+1)*this._options.timePerProblem - this._timeElapsed;
    if (this._timeRemainedForCurrentProblem < 1) {
      this._timeRemainedForCurrentProblem = this._options.timePerProblem;
      this.nextProblem();
    }
    if (typeof callback === 'function') callback();
  };

  OSCETimer.prototype.nextProblem = function() {
    this._currentProblem++;
  };

  OSCETimer.prototype.getTimeElapsed = function() {
    return this._timeElapsed;
  };

  OSCETimer.prototype.getTimeRemained = function() {
    return this._totalTime - this._timeElapsed;
  };

  OSCETimer.prototype.getTotalTime = function() {
    return this._totalTime;
  };

  OSCETimer.prototype.getCurrentProblem = function() {
    return this._currentProblem;
  };

  OSCETimer.prototype.getTimeRemainedForCurrentProblem = function() {
    return this._timeRemainedForCurrentProblem;
  };

  window.OSCETimer = OSCETimer;
})();
