const { ipcRenderer } = require('electron');

// document.addEventListener('DOMContentLoaded', () => {
    // Get the HTML element
    const html = document.documentElement;
    
    ipcRenderer.on('settings', (event, settings) => {
        // Set the initial theme based on the stored value
        const storedTheme = settings.theme;
        if (storedTheme) {
            html.setAttribute('color-mode', storedTheme);
            // Log the theme
            console.log('Theme set to:', storedTheme);
            // if the theme change dropdown exists, set the value to the stored theme
            const themeSelector = document.getElementById('themeSelector');
            if (themeSelector) {
                themeSelector.value = storedTheme;
            }
        }
    });
// });