// in this file we will add video files to the shows
import fs from 'fs';
import path from 'path';

// import needed models
import Show from '../Models/Show';

// Function to check if a file is a video file
function isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov'];
    const ext = path.extname(filename).toLowerCase();
    return videoExtensions.includes(ext);
}

// Function to update episode objects with video file paths
export function updateEpisodesWithVideoFiles(show: Show, files: FileList): Show | string {
    console.log('Updating episodes with video files for show:', show.name);

    // go over the list of files, and check if they are video files. If so, check if they match any episode
    for (let i = 0; i < files.length; i++) {
        if (isVideoFile(files[i].name)) {
            // get the filename without the extension
            const filename = files[i].name.replace(/\.[^/.]+$/, '');
            // check if the "s01e01" or "S01E01" format is used
            const episodeCode = filename.match(/s\d{2}e\d{2}/i);
            // if the format is used, then extract the season and episode numbers
            if (episodeCode) {
                const seasonNumber = parseInt(episodeCode[0].slice(1, 3));
                const episodeNumber = parseInt(episodeCode[0].slice(4, 6));
                // find the season and episode objects that match the numbers
                const season = show.seasons.find(season => season.number === seasonNumber);
                if (season) {
                    const episode = season.episodes.find(episode => episode.number === episodeNumber);
                    if (episode) {
                        episode.path = files[i].path;
                        // check if this is the first episode of the first season, if so, set this as the currently watching episode
                        if (season.number === 1 && episode.number === 1) {
                            show.currentlyWatchingEpisode = episode;
                        }
                        console.log('Episode', episode.number, 'of season', season.number, 'has a video file');
                    }
                }
            } else {
                // if the "s01e01" format is not used, then check if the episode name is used
                const episode = show.seasons.flatMap(season => season.episodes).find(episode => episode.name.toLowerCase().replace(/\s/g, '') === filename.toLowerCase().replace(/\s/g, ''));
                if (episode) {
                    episode.path = files[i].path;
                    console.log('Episode', episode.number, 'of season', episode.season, 'has a video file');
                }
            }
        }
    };

    // check if all the episodes have a video file
    const allEpisodesHaveVideoFile = show.seasons.every(season => season.episodes.every(episode => episode.path));
    // if only some episodes have a video file, then the show is not finalized, and return an error message
    if (!allEpisodesHaveVideoFile) {
        console.error('Some episodes are missing video files');
        // return an error message
        return 'Some episodes are missing video files';
    } else {
        // if all episodes have a video file, then the show is finalized
        show.finalized = true;
        // return the show object
        return show;
    }
}
