// settings.js
document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeSelector = document.getElementById('themeSelector');

    // Function to handle theme change
    const changeTheme = () => {
        const selectedTheme = themeSelector.value;

        // console log the selected theme
        // console.log('Theme changed to:', selectedTheme);

        // Update the color-mode attribute and update the settings variable
        html.setAttribute('color-mode', selectedTheme);
        ipcRenderer.send('updateSettings', { theme: selectedTheme });
    };

    // Add change event listener to the theme selector
    themeSelector.addEventListener('change', changeTheme);

    const selectDirectoryBtn = document.getElementById('selectDirectoryBtn');

    // Add click event listener to the select directory button
    selectDirectoryBtn.addEventListener('click', () => {
        // Send a message to the main process to open the directory dialog
        ipcRenderer.send('openDirectoryDialog');
    });

    // Listener to handle the selected directory path
    ipcRenderer.on('selectedDirectory', (event, directoryPath) => {
        // check if the directory path is valid
        if (!directoryPath) {
            console.error('Invalid directory path');
            return;
        }
        // Update the settings with the selected directory path
        ipcRenderer.send('updateSettings', { seriesPath: directoryPath });
        // Update the current directory text
        updateDirectoryText(directoryPath);
        // Log the selected directory path
        // console.log('Selected directory:', directoryPath);
    });

    // Listener to handle the settings data
    ipcRenderer.on('settings', (event, settings) => {
        // Set the initial directory path based on the stored value
        const storedDirectoryPath = settings.seriesPath;
        if (storedDirectoryPath) {
            // Update the current directory text
            updateDirectoryText(storedDirectoryPath);
        }
    });

    // function to update the current directory text
    function updateDirectoryText(text) {
        // Get the HTML element
        const currentDirectoryText = document.getElementById('currentDirectoryText');
        if (text === "/path/to/series") {
            text = "No directory selected";
        }
        // Update the current directory text
        currentDirectoryText.innerText = text;
    }
});
