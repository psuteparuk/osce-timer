(function() {
  'use strict';

  var App = function() {};

  App.prototype.init = function() {
    this.numProblemsInput = document.querySelector('input[name="num-problems"]');
    this.tppMinutesInput = document.querySelector('input[name="tpp-minutes"]');
    this.tppSecondsInput = document.querySelector('input[name="tpp-seconds"]');
    this.reminderMinutesInput = document.querySelector('input[name="reminder-minutes"]');
    this.reminderSecondsInput = document.querySelector('input[name="reminder-seconds"]');

    this.runButton = document.querySelector('.run-btn');
    this.clearButton = document.querySelector('.clear-btn');

    this.currentProblemField = document.querySelector('.current-problem');
    this.currentTimeRemainedField = document.querySelector('.row-current .time-remained');
    this.overallTimeElapsedField = document.querySelector('.row-overall .time-elapsed');
    this.overallTimeRemainedField = document.querySelector('.row-overall .time-remained');

    this.status = 'ready';
    this.timer = new OSCETimer();

    addTimerEventHandler.call(this);
    addButtonEventHandler.call(this);
  };

  App.prototype.run = function() {
    if (!this.validateInputs()) return;

    var numProblems = parseInt(this.numProblemsInput.value || this.numProblemsInput.placeholder, 10);
    var tppMinutes = parseInt(this.tppMinutesInput.value || this.tppMinutesInput.placeholder, 10);
    var tppSeconds = parseInt(this.tppSecondsInput.value || this.tppSecondsInput.placeholder, 10);
    var reminderMinutes = parseInt(this.reminderMinutesInput.value || this.reminderMinutesInput.placeholder, 10);
    var reminderSeconds = parseInt(this.reminderSecondsInput.value || this.reminderSecondsInput.placeholder, 10);

    this.timer.set('numProblems', numProblems);
    this.timer.set('timePerProblem', tppMinutes*60 + tppSeconds);
    this.timer.set('reminderTime', reminderMinutes*60 + reminderSeconds);
    this.timer.start();

    this.runButton.textContent = 'Pause';
    this.clearButton.disabled = true;
    this.status = 'running';
  };

  App.prototype.pause = function() {
    this.timer.pause();
    this.runButton.textContent = 'Run';
    this.clearButton.disabled = false;
    this.status = 'ready';
  };

  App.prototype.end = function() {
    this.timer.reset();
    this.runButton.textContent = 'Run';
    this.clearButton.disabled = false;
    this.status = 'ready';
  };

  App.prototype.clear = function() {
    if (this.status === 'running') return;
    this.timer.reset();
    this.clearInputs();
    this.clearDisplay();
  };

  App.prototype.display = function() {
    this.currentProblemField.textContent = this.timer.getCurrentProblem();
    this.currentTimeRemainedField.textContent = formatTime(this.timer.getTimeRemainedForCurrentProblem(), { hideHours: true });
    this.overallTimeElapsedField.textContent = formatTime(this.timer.getTimeElapsed());
    this.overallTimeRemainedField.textContent = formatTime(this.timer.getTimeRemained());
  };

  App.prototype.validateInputs = function() {
    return true;
  };

  App.prototype.clearInputs = function() {
    this.numProblemsInput.value = '';
    this.tppMinutesInput.value = '';
    this.tppSecondsInput.value = '';
    this.reminderMinutesInput.value = '';
    this.reminderSecondsInput.value = '';
  };

  App.prototype.clearDisplay = function() {
    this.currentProblemField.textContent = '--';
    this.currentTimeRemainedField.textContent = formatTime(0);
    this.overallTimeElapsedField.textContent = formatTime(0);
    this.overallTimeRemainedField.textContent = formatTime(0);
  }

  function addTimerEventHandler() {
    this.timer.ontick = this.display.bind(this);

    this.timer.onend = function() {
      this.currentTimeRemainedField.textContent = formatTime(0, { hideHours: true });
      this.overallTimeElapsedField.textContent = formatTime(this.timer.getTotalTime());
      this.overallTimeRemainedField.textContent = formatTime(0);
      this.end();
    }.bind(this);
  };

  function addButtonEventHandler() {
    this.runButton.onclick = function() {
      if (this.status === 'ready') {
        this.run();
        this.display();
      } else if (this.status === 'running') {
        this.pause();
      }
    }.bind(this);

    this.clearButton.onclick = this.clear.bind(this);
  };

  function formatTime(time, options) {
    options = options || {};

    var totalMinutes = Math.floor(time / 60);
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes - hours * 60;
    var seconds = time - totalMinutes * 60;

    var formattedHours = hours ? (hours > 9 ? hours : '0' + hours) : '00';
    var formattedMinutes = minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00';
    var formattedSeconds = seconds ? (seconds > 9 ? seconds : '0' + seconds) : '00';

    if (options.hideHours) {
      return formattedMinutes + ':' + formattedSeconds;
    } else {
      return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
    }
  };

  window.App = App;
})();
