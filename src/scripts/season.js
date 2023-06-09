const fs = require('fs');
const path = require('path');

// get the container for the seasons
let seasonPicker;
// get the container for the episodes
let episodePicker;
let settings;

document.addEventListener('DOMContentLoaded', () => {
    // get the container for the seasons
    seasonPicker = document.getElementById('seasonPicker');
    // get the container for the seasons
    episodePicker = document.getElementById('episodePicker');

    // Read the series directory path from the settings file
    settings = getSettingsFile();

    // get all the seasons
    const seasons = getSeasons(settings.seriesPath);
    // clear the season picker
    seasonPicker.innerHTML = "";
    // create the season buttons
    seasons.forEach((season) => {
        // remove the " " from the season name
        seasonCover = season.replace(" ", "");
        // create the button
        const newButton = "<a onclick=\"loadSeason('" + season +"');\"><img src=\"assets/covers/" + seasonCover + ".jpg\" alt=\"" + season + "\" /></a>";
        // add the button to the season picker
        seasonPicker.innerHTML += newButton;
    });
});

function loadSeason(season) {
    // get all the episodes
    const episodes = getEpisodesForSeason(settings.seriesPath, season);
    // clear the episode picker
    episodePicker.innerHTML = "";
    // create the episode buttons
    episodes.forEach((episode) => {
        // remove the file extension from the episode name
        episodeName = episode.replace(".mkv", "");
        // check if the episode has special characters in the name
        if (episode.includes("'")) {
            // replace the special characters with html entities
            episode = episode.replace("'", "\'");
        }
        let newButton;
        // check if the episode is the current episode
        if (episode === settings.currentEpisode) {
            // create the button with the current episode class
            newButton = "<a class=\"currentEpisode\" onclick=\"loadEpisode('" + season + "', '" + escapeSingleQuotes(episode) + "');\">Watch: " + episodeName + "</a>";
        } else {
            // create the button
            newButton = "<a onclick=\"loadEpisode('" + season + "', '" + escapeSingleQuotes(episode) + "');\">Watch: " + episodeName + "</a>";
        }
        // add the button to the episode picker
        episodePicker.innerHTML += newButton;
    });
    // show the episode picker
    episodePicker.style.display = "flex";
    // hide the season picker
    seasonPicker.style.display = "none";
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

function loadEpisode(season, episode) {
    // set the current episode and the current season
    settings.currentEpisode = episode;
    settings.currentSeason = season;
    // save the settings
    updateSettingsFile(settings);
    // load the episode
    window.location.href = "watch.html";
}

function escapeSingleQuotes(str) {
    return str.replace(/'/g, "\\'");
}

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