// in this file we will add video files to the shows
import fs from 'fs';
import path from 'path';

// import needed models
import Show from '../Models/Show';

// Function to recursively search for video files in a directory
function findVideoFiles(directory: string): string[] {
    const items = fs.readdirSync(directory);
    const videoFiles: string[] = [];

    items.forEach(item => {
        const itemPath = path.join(directory, item);
        const stats = fs.statSync(itemPath);

        if (!stats.isDirectory() && isVideoFile(item)) {
            videoFiles.push(itemPath);
        }
    });

    return videoFiles;
}

// Function to check if a file is a video file
function isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov'];
    const ext = path.extname(filename).toLowerCase();
    return videoExtensions.includes(ext);
}

// Function to update episode objects with video file paths
export function updateEpisodesWithVideoFiles(show: Show, baseDirectory: string) {
    show.seasons.forEach(season => {
        season.episodes.forEach((episode, index) => {
            let episodeName = episode.name.toLowerCase().replace(/\s/g, '');
            let episodeCode = `S${String(season.number).padStart(2, '0')}E${String(index + 1).padStart(2, '0')}`;

            // Look for 'S01E01' format first
            const videoFiles = findVideoFiles(baseDirectory);
            let matchedVideoFile = videoFiles.find(file => {
                const filename = path.basename(file).toLowerCase().replace(/\s/g, '');
                return filename.includes(episodeCode);
            });

            // If not found, then look for episode name
            if (!matchedVideoFile) {
                matchedVideoFile = videoFiles.find(file => {
                    const filename = path.basename(file).toLowerCase().replace(/\s/g, '');
                    return filename.includes(episodeName);
                });
            }

            if (matchedVideoFile) {
                episode.path = matchedVideoFile;
            }
        });
    });

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
