// in this file we will add video files to the shows
import fs from 'fs';
import path from 'path';

// import needed models
import Show from '../Models/Show';

// Function to recursively search for video files in a directory
function findVideoFiles(directory: string): string[] {
    const items = fs.readdirSync(directory);
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov'];
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
export function updateEpisodesWithVideoFiles(show: Show, baseDirectory: string): void {
    show.seasons.forEach(season => {
        season.episodes.forEach(episode => {
            let episodeName = episode.name.toLowerCase().replace(/\s/g, '');
            const videoFiles = findVideoFiles(baseDirectory);

            const matchedVideoFile = videoFiles.find(file => {
                const filename = path.basename(file).toLowerCase().replace(/\s/g, '');
                return filename.includes(episodeName);
            });

            if (matchedVideoFile) {
                episode.path = matchedVideoFile;
            }
        });
    });
}
