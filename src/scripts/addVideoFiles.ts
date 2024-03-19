// in this file we will add video files to the shows
import fs from "fs";
import path from "path";

// import needed models
import Show from "../Models/Show";
import { VideoFile } from "../Models/videoFile";

// import needed functions
import { convertMKVFiles } from "./convertVideo";

// Function to check if a file is a video file
function isVideoFile(filename: string): boolean {
	const videoExtensions = [".mp4", ".avi", ".mkv", ".mov"];
	const ext = path.extname(filename).toLowerCase();
	return videoExtensions.includes(ext);
}

// Function to update episode objects with video file paths
export function updateEpisodesWithVideoFiles(
	show: Show,
	files: Array<VideoFile>,
	setIsLoading: (isLoading: boolean) => void
): Show | string {
	console.log("Updating episodes with video files for show:", show.name);

	// go over the list of files, and check if they are video files. If so, check if they match any episode
	for (let i = 0; i < files.length; i++) {
		if (isVideoFile(files[i].name)) {
			// get the filename without the extension
			let filename = files[i].name.replace(/\.[^/.]+$/, "");
			// Attempt to match using episode code (e.g., s01e01)
			const episodeCodeMatch = filename.match(/s(\d{2})e(\d{2})/i);
			if (episodeCodeMatch) {
				const [_, seasonNumber, episodeNumber] =
					episodeCodeMatch.map(Number);
				const season = show.seasons.find(
					(season) => season.number === seasonNumber
				);
				if (season) {
					const episode = season.episodes.find(
						(episode) => episode.number === episodeNumber
					);
					if (episode) {
						episode.path = files[i].path;
						if (season.number === 1 && episode.number === 1) {
							show.currentlyWatchingEpisode = episode;
						}
					}
				}
				continue; // Skip to the next file
			} else {
				// don't try any matching type, just return an error message saying, "Filenames must contain the episode code (e.g., s01e01)"
				console.error(
					"Filenames must contain the episode code (e.g., s01e01)"
				);
				return "Filenames must contain the episode code (e.g., s01e01)";
			}
		}
	}

	// check if all episodes have video files
	if (!checkIfAllEpisodesHaveVideoFiles(show)) {
		return "Not all episodes have video files";
	} else {
		// check if the show has mkv files, if so, convert them to mp4
		if (
			show.seasons.some((season) =>
				season.episodes.some((episode) => isMKVFile(episode.path))
			)
		) {
			console.log("Show has mkv files, converting to mp4");
			convertMKVFiles(show, setIsLoading);
		} else {
			show.finalized = true;
			setIsLoading(false);
		}
		return show;
	}
}

function checkIfAllEpisodesHaveVideoFiles(show: Show): boolean {
	if (
		!show.seasons.every((season) =>
			season.episodes.every((episode) => episode.path)
		)
	) {
		// check which episodes are missing video files
		for (let i = 0; i < show.seasons.length; i++) {
			for (let j = 0; j < show.seasons[i].episodes.length; j++) {
				if (!show.seasons[i].episodes[j].path) {
					console.error(
						`Episode s${i + 1}e${j + 1} is missing a video file`
					);
				}
			}
		}
		return false;
	} else {
		return true;
	}
}

// check if the video file is in .mkv format
export function isMKVFile(filename: string): boolean {
	const ext = path.extname(filename).toLowerCase();
	return ext === ".mkv";
}
