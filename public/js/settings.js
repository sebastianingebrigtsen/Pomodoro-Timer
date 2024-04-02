// Get elements from DOM
var settingsButton = document.getElementById('openSettings');
var settingsModal = document.getElementById('settingsModal');
var aboutPomodoroButton = document.getElementById('aboutPomodoro');
var aboutPomodoroModal = document.getElementById('aboutPomodoroModal');
var modalBackground = document.querySelector('.modal-background');
var menuItems = document.querySelectorAll('.settings-menu .menu-list a');
var contentSections = document.querySelectorAll('.settings-content .settings-section');
const saveButton = document.querySelector('.save-button');
const deleteButtons = document.querySelectorAll('.delete');
const closeButton = document.querySelector('.close-button');

// Open modal function
function openModal(modal) {
  modal.classList.add('is-active');
  modalBackground.style.display = 'block';
}

// Close modal function
function closeModal(modal) {
  modal.classList.remove('is-active');
  modalBackground.style.display = 'none';
}

// Event listeners for opening modals
settingsButton.addEventListener('click', () => {
  openModal(settingsModal);
  setActiveCategory('timer');
});
aboutPomodoroButton.addEventListener('click', () => openModal(aboutPomodoroModal));

// Event listener for modal background click to close modals
modalBackground.addEventListener('click', () => {
  closeModal(settingsModal);
  closeModal(aboutPomodoroModal);
});

// Event listeners for save and close buttons
saveButton.addEventListener('click', () => handleModalClose(settingsModal));
closeButton.addEventListener('click', () => handleModalClose(aboutPomodoroModal));

// Event listeners for delete buttons
deleteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const parentModal = button.closest('.modal');
    handleModalClose(parentModal);
  });
});

// Set active category and corresponding section
function setActiveCategory(category) {
  menuItems.forEach((item) => item.classList.remove('is-active'));
  contentSections.forEach((section) => {
    section.classList.remove('is-active');
    section.style.display = 'none';
  });

  const activeMenuItem = document.querySelector(`.menu-list a[data-category="${category}"]`);
  const activeSection = document.getElementById(`${category}-settings`);

  if (activeMenuItem && activeSection) {
    activeMenuItem.classList.add('is-active');
    activeSection.classList.add('is-active');
    activeSection.style.display = 'block';
  }
}

// Event listeners for menu items to switch categories
menuItems.forEach((item) => {
  item.addEventListener('click', function (e) {
    e.preventDefault();

    menuItems.forEach((item) => item.classList.remove('is-active'));
    contentSections.forEach((section) => {
      section.classList.remove('is-active');
      section.style.display = 'none';
    });

    this.classList.add('is-active');
    var category = this.getAttribute('data-category');
    var activeSection = document.getElementById(category + '-settings');
    activeSection.classList.add('is-active');
    activeSection.style.display = 'block';
  });
});

// Function to handle modal close
function handleModalClose(modal) {
  closeModal(modal);
}

// Open aboutPomodoroModal on first visit
if (!localStorage.getItem('modalShown')) {
  openModal(aboutPomodoroModal);
  modalBackground.style.display = 'block';
  localStorage.setItem('modalShown', 'true');
}

// Initialize volume settings
let currentVolume = 0.5;
const alarmSoundElement = new Audio('../public/assets/audio/default.mp3');
const volumeSlider = document.getElementById('volume');

// Update volume function
function updateVolume(value) {
  const volumeValueElement = document.getElementById('volumeValue');
  volumeValueElement.textContent = value;
  currentVolume = value / 100;
  alarmSoundElement.volume = currentVolume;
}

// Event listener for volume slider change
volumeSlider.addEventListener('input', function () {
  updateVolume(this.value);
});

updateVolume(volumeSlider.value);

// Event listener for alarm sound change
document.getElementById('alarmSound').addEventListener('change', function () {
  const soundName = this.value;
  switch (soundName) {
    case 'None':
      alarmSoundElement.src = '';
      break;
    case 'Default':
      alarmSoundElement.src = '../public/assets/audio/default.mp3';
      break;
    case 'Bell':
      alarmSoundElement.src = '../public/assets/audio/bell.mp3';
      break;
    case 'Birds':
      alarmSoundElement.src = '../public/assets/audio/birds.mp3';
      break;
    case 'Buzzer':
      alarmSoundElement.src = '../public/assets/audio/buzzer.wav';
      break;
    case 'Alarm':
      alarmSoundElement.src = '../public/assets/audio/digitalAlarm.wav';
      break;
    case 'Warning':
      alarmSoundElement.src = '../public/assets/audio/warning.wav';
      break;
    default:
      console.log('Sound not found');
  }
  if (soundName !== 'None') {
    alarmSoundElement.play();
  }
});

// Expose functions to window scope
window.openModal = openModal;
window.closeModal = closeModal;
