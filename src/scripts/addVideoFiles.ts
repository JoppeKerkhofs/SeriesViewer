// in this file we will add video files to the shows
import fs from 'fs';
import path from 'path';

// import needed models
import Show from '../Models/Show';
import { VideoFile } from '../Models/videoFile';

// Function to check if a file is a video file
function isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov'];
    const ext = path.extname(filename).toLowerCase();
    return videoExtensions.includes(ext);
}

// Function to update episode objects with video file paths
export function updateEpisodesWithVideoFiles(show: Show, files: Array<VideoFile>): Show | string {
    console.log('Updating episodes with video files for show:', show.name);

    // go over the list of files, and check if they are video files. If so, check if they match any episode
    for (let i = 0; i < files.length; i++) {
        if (isVideoFile(files[i].name)) {
            // get the filename without the extension
            let filename = files[i].name.replace(/\.[^/.]+$/, '');
            console.log('Filename:', filename);
            // Attempt to match using episode code (e.g., s01e01)
            const episodeCodeMatch = filename.match(/s(\d{2})e(\d{2})/i);
            if (episodeCodeMatch) {
                const [_, seasonNumber, episodeNumber] = episodeCodeMatch.map(Number);
                const season = show.seasons.find(season => season.number === seasonNumber);
                if (season) {
                    const episode = season.episodes.find(episode => episode.number === episodeNumber);
                    if (episode) {
                        episode.path = files[i].path;
                        console.log(`Episode ${episode.number} of season ${season.number} has a video file`);
                        if (season.number === 1 && episode.number === 1) {
                            show.currentlyWatchingEpisode = episode;
                        }
                    }
                }
                continue; // Skip to the next file
            } else {
                // don't try any matching type, just return an error message saying, "Filenames must contain the episode code (e.g., s01e01)"
                console.error('Filenames must contain the episode code (e.g., s01e01)');
                return 'Filenames must contain the episode code (e.g., s01e01)';
            }
        }
    };

    // check if all episodes have video files
    if (!checkIfAllEpisodesHaveVideoFiles(show)) {
        return 'Not all episodes have video files';
    }
}

function checkIfAllEpisodesHaveVideoFiles(show: Show): boolean {
    if (!show.seasons.every(season => season.episodes.every(episode => episode.path))) {
        // check which episodes are missing video files
        for (const season of show.seasons) {
            for (const episode of season.episodes) {
                if (!episode.path) {
                    console.log('Episode', episode.number, 'of season', season.number, 'is missing a video file');
                }
            }
        }
        return false;
    }
}
