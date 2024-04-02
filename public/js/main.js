document.addEventListener('DOMContentLoaded', () => {
  // Initial timer settings
  let remainingTime = 25 * 60;
  let timerActive = false;
  let interval;
  let currentMode = 'pomodoro';
  let pomodoroCount = 0;
  let shortBreakCount = 0;
  let longBreakCount = 0;

  // Get initial timer durations from HTML inputs
  let pomodoroTime = parseInt(document.getElementById('pomodoroDuration').value, 10) * 60;
  let shortBreakTime = parseInt(document.getElementById('shortBreakDuration').value, 10) * 60;
  let longBreakTime = parseInt(document.getElementById('longBreakDuration').value, 10) * 60;

  // Update UI with remaining time
  function updateUI() {
    // Update timer display
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    document.getElementById('timer').innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    // Update page title with timer countdown
    document.getElementById('titleTimer').innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    } - Find your focus`;
  }

  // Start the timer
  function startTimer() {
    if (!timerActive) {
      timerActive = true;
      updateStartButton();

      interval = setInterval(() => {
        if (remainingTime > 0) {
          remainingTime -= 1;
          updateUI();
          updateProgressBar();
        } else {
          stopTimer();
          alarmSoundElement.play();
          onTimerComplete();
          resetTimer();
        }
      }, 1000);
    }
  }

  // Stop the timer
  function stopTimer() {
    clearInterval(interval);
    timerActive = false;
    updateStartButton();
  }

  // Reset the timer
  function resetTimer() {
    if (currentMode === 'pomodoro') {
      remainingTime = pomodoroTime;
    } else if (currentMode === 'shortBreak') {
      remainingTime = shortBreakTime;
    } else if (currentMode === 'longBreak') {
      remainingTime = longBreakTime;
    }
    updateUI();
  }

  // Update the start button text
  function updateStartButton() {
    const startButtonText = document.querySelector('#startButton .front');
    startButtonText.textContent = timerActive ? 'Pause' : 'Start';
  }

  // Actions to perform when timer completes
  function onTimerComplete() {
    incrementModeCount();
    updateModeCountUI();

    let autoStartBreaks = document.getElementById('autoStartBreaks').checked;
    let autoStartPomodoros = document.getElementById('autoStartPomodoros').checked;
    let longBreakInterval = parseInt(document.getElementById('longBreakInterval').value, 10);

    if (currentMode === 'pomodoro') {
      if (pomodoroCount % longBreakInterval === 0) {
        longBreakButton();
        if (autoStartBreaks) startTimer();
      } else {
        shortBreakButton();
        if (autoStartBreaks) startTimer();
      }
    } else if (currentMode === 'shortBreak' || currentMode === 'longBreak') {
      pomodoroButton();
      if (autoStartPomodoros) startTimer();
    }
  }

  // Increment mode count (pomodoro, short break, long break)
  function incrementModeCount() {
    if (currentMode === 'pomodoro') pomodoroCount++;
    else if (currentMode === 'shortBreak') shortBreakCount++;
    else if (currentMode === 'longBreak') longBreakCount++;
  }

  // Update mode count displayed on UI
  function updateModeCountUI() {
    document.getElementById('pomodoro').textContent = `Pomodoro: ${pomodoroCount}`;
    document.getElementById('shortBreak').textContent = `Short Break: ${shortBreakCount}`;
    document.getElementById('longBreak').textContent = `Long Break: ${longBreakCount}`;
  }

  // Update progress bar based on remaining time
  function updateProgressBar() {
    let totalTime;
    if (currentMode === 'pomodoro') {
      totalTime = pomodoroTime;
    } else if (currentMode === 'shortBreak') {
      totalTime = shortBreakTime;
    } else if (currentMode === 'longBreak') {
      totalTime = longBreakTime;
    }
    const percentComplete = ((totalTime - remainingTime) / totalTime) * 100;
    document.getElementById('progressBar').style.width = percentComplete + '%';
  }

  // Event listener for start/pause button click
  document.getElementById('startButton').onclick = function () {
    if (!timerActive) startTimer();
    else stopTimer();
  };

  // Event listeners for duration changes
  document.getElementById('pomodoroDuration').addEventListener('change', function () {
    pomodoroTime = parseInt(this.value, 10) * 60;
    if (currentMode === 'pomodoro') {
      remainingTime = pomodoroTime;
      updateUI();
    }
  });

  document.getElementById('shortBreakDuration').addEventListener('change', function () {
    shortBreakTime = parseInt(this.value, 10) * 60;
    if (currentMode === 'shortBreak') {
      remainingTime = shortBreakTime;
      updateUI();
    }
  });

  document.getElementById('longBreakDuration').addEventListener('change', function () {
    longBreakTime = parseInt(this.value, 10) * 60;
    if (currentMode === 'longBreak') {
      remainingTime = longBreakTime;
      updateUI();
    }
  });

  // Event listeners for mode buttons
  document.getElementById('pomodoro').onclick = pomodoroButton;
  document.getElementById('shortBreak').onclick = shortBreakButton;
  document.getElementById('longBreak').onclick = longBreakButton;

  // Event listener for long break interval change
  document.getElementById('longBreakInterval').addEventListener('change', function () {
    longBreakInterval = parseInt(this.value, 10);
  });

  // Pomodoro button function
  function pomodoroButton() {
    if (timerActive) stopTimer();
    remainingTime = pomodoroTime;
    currentMode = 'pomodoro';
    updateUI();
    document.getElementById('shortBreak').classList.remove('is-selected', 'is-info');
    document.getElementById('longBreak').classList.remove('is-selected', 'is-info');
    document.getElementById('pomodoro').classList.add('is-selected', 'is-info');
  }

  // Short break button function
  function shortBreakButton() {
    if (timerActive) stopTimer();
    remainingTime = shortBreakTime;
    currentMode = 'shortBreak';
    updateUI();
    document.getElementById('pomodoro').classList.remove('is-selected', 'is-info');
    document.getElementById('longBreak').classList.remove('is-selected', 'is-info');
    document.getElementById('shortBreak').classList.add('is-selected', 'is-info');
  }

  // Long break button function
  function longBreakButton() {
    if (timerActive) stopTimer();
    remainingTime = longBreakTime;
    currentMode = 'longBreak';
    updateUI();
    document.getElementById('pomodoro').classList.remove('is-selected', 'is-info');
    document.getElementById('shortBreak').classList.remove('is-selected', 'is-info');
    document.getElementById('longBreak').classList.add('is-selected', 'is-info');
  }
});
