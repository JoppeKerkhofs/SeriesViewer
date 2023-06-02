const path = require('path');
const fs = require('fs');

// the video element
let video;
let settings;
const settingsPath = path.join(__dirname, 'settings.json').replace("src\\", "");

document.addEventListener('DOMContentLoaded', () => {
    // get the title element
    const title = document.getElementById("title");
    // get the video element
    video = document.getElementById("video");
    
    // read the settings file
    settings = JSON.parse(fs.readFileSync(settingsPath));

    // set the title
    title.innerHTML = "Watch " + settings.currentEpisode.replace(".mkv", "");

    // load the video
    loadVideo(settings.currentSeason, settings.currentEpisode, settings.currentTime);
    
    // check when the video has less than 25 seconds left
    video.addEventListener('timeupdate', () => {
        // get the skiptime from the settings
        const skipTime = settings.skipCreditsTime;
        // check if the video is less than the skipTime seconds from the end
        if (video.duration - video.currentTime <= skipTime) {
            // set the next episode
            loadNextEpisode();
        } else {
            // save the current time in settings
            settings.currentTime = video.currentTime;
            // save the settings
            fs.writeFileSync(settingsPath, JSON.stringify(settings));
        }
    });
});

function loadVideo(season, episode, timestamp) {
    // get the video from the settings
    const videoPath = path.join(settings.seriesPath, season, episode);
    // set the video source
    video.src = videoPath;
    // load the video
    video.load();

    // check if there is a timestamp higher than 1 minute
    if (timestamp > 60) {
        // set the video to start at the timestamp
        video.currentTime = timestamp;
    }

    // play the video
    video.play();
}

function loadNextEpisode() {
    // Get the current season and episode
    const currentSeason = settings.currentSeason;
    const currentEpisode = settings.currentEpisode;
    // Get the list of episodes for the current season
    const episodes = getEpisodesForSeason(settings.seriesPath, currentSeason);
    // Get the index of the current episode
    const currentEpisodeIndex = episodes.indexOf(currentEpisode);
    // Check if the current episode is the last episode of the season
    if (currentEpisodeIndex === episodes.length - 1) {
        // This is the last episode of the season
        // Move to the next season
        // Get the list of seasons
        const seasons = getSeasons(settings.seriesPath);
        // Get the index of the current season
        const currentSeasonIndex = seasons.indexOf(currentSeason);
        // Check if there is a next season
        if (currentSeasonIndex < seasons.length - 1) {
            // There is a next season
            const nextSeason = seasons[currentSeasonIndex + 1];
            const nextSeasonEpisodes = getEpisodesForSeason(settings.seriesPath, nextSeason);
            // Check if there are episodes in the next season
            if (nextSeasonEpisodes.length > 0) {
                // Load the first episode of the next season
                const nextEpisode = nextSeasonEpisodes[0];
                loadVideo(nextSeason, nextEpisode);
                // Set the current season and episode
                settings.currentSeason = nextSeason;
                settings.currentEpisode = nextEpisode;
                // Save the settings
                fs.writeFileSync(settingsPath, JSON.stringify(settings));
                // Set the title
                title.innerHTML = "Watch " + nextEpisode.replace(".mkv", "");
            }
        }
    } else {
        // There is a next episode in the current season
        const nextEpisode = episodes[currentEpisodeIndex + 1];
        // Load the next episode
        loadVideo(currentSeason, nextEpisode);
        // Set the current episode
        settings.currentEpisode = nextEpisode;
        // Save the settings
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
        // Set the title
        title.innerHTML = "Watch " + nextEpisode.replace(".mkv", "");
    }
}

function loadPreviousEpisode() {
    // Get the current season and episode
    const currentSeason = settings.currentSeason;
    const currentEpisode = settings.currentEpisode;
    // Get the list of episodes for the current season
    const episodes = getEpisodesForSeason(settings.seriesPath, currentSeason);
    // Get the index of the current episode
    const currentEpisodeIndex = episodes.indexOf(currentEpisode);
    // Check if the current episode is the first episode of the season
    if (currentEpisodeIndex === 0) {
        // This is the first episode of the season
        // Move to the previous season
        // Get the list of seasons
        const seasons = getSeasons(settings.seriesPath);
        // Get the index of the current season
        const currentSeasonIndex = seasons.indexOf(currentSeason);
        // Check if there is a previous season
        if (currentSeasonIndex > 0) {
            // There is a previous season
            const previousSeason = seasons[currentSeasonIndex - 1];
            const previousSeasonEpisodes = getEpisodesForSeason(settings.seriesPath, previousSeason);
            // Check if there are episodes in the previous season
            if (previousSeasonEpisodes.length > 0) {
                // Load the last episode of the previous season
                const previousEpisode = previousSeasonEpisodes[previousSeasonEpisodes.length - 1];
                loadVideo(previousSeason, previousEpisode);
                // Set the current season and episode
                settings.currentSeason = previousSeason;
                settings.currentEpisode = previousEpisode;
                // Save the settings
                fs.writeFileSync(settingsPath, JSON.stringify(settings));
                // Set the title
                title.innerHTML = "Watch " + previousEpisode.replace(".mkv", "");
            }
        }
    } else {
        // There is a previous episode in the current season
        const previousEpisode = episodes[currentEpisodeIndex - 1];
        // Load the previous episode
        loadVideo(currentSeason, previousEpisode);
        // Set the current episode
        settings.currentEpisode = previousEpisode;
        // Save the settings
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
        // Set the title
        title.innerHTML = "Watch " + previousEpisode.replace(".mkv", "");
    }
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

// Function to retrieve the list of seasons in the series directory
function getSeasons(seriesPath) {
    const seasonFolders = fs.readdirSync(seriesPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();
    return seasonFolders;
}
