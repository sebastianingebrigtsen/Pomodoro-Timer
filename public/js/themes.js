const themes = {
  Blue: {
    '--my-primary': '#397097',
    '--my-secondary': '#4f7fa2',
    '--my-tertiary': '#326183',
  },
  Green: {
    '--my-primary': '#3a7f5f',
    '--my-secondary': '#4a9f77',
    '--my-tertiary': '#2e6f4e',
  },
  Red: {
    '--my-primary': '#973939',
    '--my-secondary': '#b44a4a',
    '--my-tertiary': '#822727',
  },
  Purple: {
    '--my-primary': '#6b3979',
    '--my-secondary': '#834a9f',
    '--my-tertiary': '#5d2e6f',
  },
  Orange: {
    '--my-primary': '#c25b2e',
    '--my-secondary': '#d4733c',
    '--my-tertiary': '#a84b23',
  },
  Teal: {
    '--my-primary': '#2e8b87',
    '--my-secondary': '#3ca4a3',
    '--my-tertiary': '#267b73',
  },
  Yellow: {
    '--my-primary': '#c2a32e',
    '--my-secondary': '#d4b43c',
    '--my-tertiary': '#a88c23',
  },
  Pink: {
    '--my-primary': '#c22e8b',
    '--my-secondary': '#d43c9e',
    '--my-tertiary': '#a42373',
  },
  Grey: {
    '--my-primary': '#505050',
    '--my-secondary': '#707070',
    '--my-tertiary': '#404040',
  },

  Brown: {
    '--my-primary': '#8b572e',
    '--my-secondary': '#b37d3c',
    '--my-tertiary': '#654522',
  },

  Cyan: {
    '--my-primary': '#2e8b8b',
    '--my-secondary': '#3cb3b3',
    '--my-tertiary': '#2e6565',
  },

  Magenta: {
    '--my-primary': '#8b2e6a',
    '--my-secondary': '#b33c7d',
    '--my-tertiary': '#652e52',
  },

  Lime: {
    '--my-primary': '#8b8b2e',
    '--my-secondary': '#b3b33c',
    '--my-tertiary': '#65652e',
  },

  Navy: {
    '--my-primary': '#2e3c8b',
    '--my-secondary': '#3c4db3',
    '--my-tertiary': '#2e3065',
  },

  Olive: {
    '--my-primary': '#68732e',
    '--my-secondary': '#7d8b3c',
    '--my-tertiary': '#515b2e',
  },
  Crimson: {
    '--my-primary': '#DC143C',
    '--my-secondary': '#E4354F',
    '--my-tertiary': '#B2102F',
  },
};

// Apply selected theme to the document
function applyTheme(themeName) {
  const theme = themes[themeName];
  // Apply each CSS variable from the theme
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  // Save the selected theme in local storage
  localStorage.setItem('selectedTheme', themeName);
}

// Load saved theme from local storage on page load
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
  }
}

// Generate theme swatches and attach click event listeners
function generateThemeSwatches() {
  const container = document.querySelector('.theme-swatches');
  container.innerHTML = '';

  // Iterate through each theme and create a swatch
  Object.keys(themes).forEach((themeName) => {
    const swatch = document.createElement('div');
    swatch.className = 'theme-swatch';
    swatch.setAttribute('data-theme', themeName);
    swatch.style.backgroundColor = themes[themeName]['--my-secondary'];

    // Add click event listener to apply theme when swatch is clicked
    swatch.addEventListener('click', () => {
      applyTheme(themeName);
    });

    container.appendChild(swatch);
  });
}

// Event listener for page load to generate theme swatches and load saved theme
document.addEventListener('DOMContentLoaded', () => {
  generateThemeSwatches();
  loadSavedTheme();
});
