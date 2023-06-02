const fs = require('fs');
const { get } = require('http');
const path = require('path');

// settings.js
document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeSelector = document.getElementById('themeSelector');

    // Function to handle theme change
    const changeTheme = () => {
        const selectedTheme = themeSelector.value;
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
        // get the settings file
        const settings = getSettingsFile();
        // check if the directory path is valid
        if (!directoryPath) {
            console.error('Invalid directory path');
            return;
        }
        // Update the settings with the selected directory path
        settings.seriesPath = directoryPath;
        // Update the current directory text
        updateDirectoryText(directoryPath);
        // update the current season and episode to the first of both, with the names of the files
        // get the first season
        const seasons = getSeasons(directoryPath);
        const firstSeason = seasons[0];
        settings.currentSeason = firstSeason;
        // get the first episode
        const episodes = getEpisodesForSeason(directoryPath, firstSeason);
        const firstEpisode = episodes[0];
        settings.currentEpisode = firstEpisode;
        // update the settings file
        updateSettingsFile(settings);
    });

    // read the settings file
    const settings = getSettingsFile();
    // Set the initial directory path based on the stored value
    const storedDirectoryPath = settings.seriesPath;
    if (storedDirectoryPath) {
        // Update the current directory text
        updateDirectoryText(storedDirectoryPath);
    }

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

    // Function to retrieve the list of seasons in the series directory
    function getSeasons(seriesPath) {
        const seasonFolders = fs.readdirSync(seriesPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name)
            .sort();
        return seasonFolders;
    }

    // Function to retrieve episode data for a specific season
    function getEpisodesForSeason(seriesPath, season) {
        const seasonPath = path.join(seriesPath, `${season}`);
        if (!fs.existsSync(seasonPath)) {
            return [];
        }
        const episodeFiles = fs.readdirSync(seasonPath);
        const episodeNames = episodeFiles.map((episodeFile) => {
            return episodeFile;
        });
        return episodeNames;
    }

    const rangeInput = document.getElementById("selectCreditSkipTime");
    const rangeInputDiv = document.getElementById("creditSkipTimeDiv");
    const valueDisplay = document.getElementById("creditSkipTimeText");
    const selectCreditSkip = document.getElementById("selectCreditSkip");

    // read the settings file for the initial value
    const storedCreditSkipTime = settings.skipCreditsTime;
    if (storedCreditSkipTime === 0) {
        // Set the checkbox to unchecked
        selectCreditSkip.checked = false;
        // hide the range input div
        rangeInputDiv.style.display = "none";
    } else {
        // Set the checkbox to checked
        selectCreditSkip.checked = true;
        // show the range input div
        rangeInputDiv.style.display = "flex";
        // set the range input value
        rangeInput.value = storedCreditSkipTime;
        // update the displayed value
        valueDisplay.textContent = storedCreditSkipTime + " seconds";
    }

    // Add change event listener to the select credit skip checkbox
    selectCreditSkip.addEventListener('change', () => {
        // get the settingsfile
        const settings = getSettingsFile();
        // check if the checkbox is checked
        if (selectCreditSkip.checked) {
            // show the range input div
            rangeInputDiv.style.display = "flex";
            // set the range input value to 5
            rangeInput.value = 5;
            // update the settings
            settings.skipCreditsTime = 5;
            // update the displayed value
            valueDisplay.textContent = "5 seconds";
        } else {
            // hide the range input div
            rangeInputDiv.style.display = "none";
            // set the range input value to 0 in the settings file
            rangeInput.value = 0;
            // update the settings
            settings.skipCreditsTime = 0;
        }
        // write the settings file
        updateSettingsFile(settings);
    });

    // Update the displayed value when the range input value changes
    rangeInput.addEventListener("input", () => {
        // get the settingsfile
        const settings = getSettingsFile();
        // update the settings
        settings.skipCreditsTime = rangeInput.value;
        // write the settings file
        updateSettingsFile(settings);
        // update the displayed value
        valueDisplay.textContent = rangeInput.value + " seconds";
    });
});

function getSettingsFile() {
    // check what os is used
    if (process.platform === "win32") {
        // windows
        return JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json').replace("src\\", "")));
    } else {
        // linux or mac
        return JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json').replace("src/", "")));
    }
}

function updateSettingsFile(settings) {
    // check what os is used
    if (process.platform === "win32") {
        // windows
        fs.writeFileSync(path.join(__dirname, 'settings.json').replace("src\\", ""), JSON.stringify(settings));
    } else {
        // linux or mac
        fs.writeFileSync(path.join(__dirname, 'settings.json').replace("src/", ""), JSON.stringify(settings));
    }
}
