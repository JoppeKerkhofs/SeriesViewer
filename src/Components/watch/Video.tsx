import { useCallback, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { withVue } from "vuera";
import VlcVideoWrapper from "./VlcVideoWrapper.vue";

// import needed models
import Episode from "../../Models/Episode";
import Show from "../../Models/Show";

const VlcVideoComponent = withVue(VlcVideoWrapper);

interface VideoProps {
	episode: Episode;
	playNextEpisode: () => void;
	playPreviousEpisode: () => void;
}

export default function Video(props: VideoProps) {
	const { episode, playNextEpisode, playPreviousEpisode } = props;
	const [currentTime, setCurrentTime] = useState<number | null>(
		episode.currentTime
	);
	const [width, setWidth] = useState<number>(0);
	const [height, setHeight] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isReady, setIsReady] = useState(false);
	const [videoURL, setVideoURL] = useState<string>(
		"media-loader://" + episode.path
	);
	const playerRef = useRef<HTMLVideoElement | null>(null);

	// Function to handle progress updates
	const handleProgress = (event: Event) => {
		if (playerRef.current) {
			setCurrentTime(playerRef.current.currentTime);
			episode.currentTime = playerRef.current.currentTime;
			saveEpisode(episode);
		}
	};

	// Function to save episode to local storage
	const saveEpisode = (episode: Episode) => {
		const shows = JSON.parse(localStorage.getItem("shows") || "[]");
		const updatedShows = shows.map((show: Show) => {
			if (show.id === episode.showId) {
				show.currentlyWatchingEpisode = episode;
				show.seasons = show.seasons.map((season) => {
					season.episodes = season.episodes.map((ep) => {
						if (ep.number === episode.number) {
							ep = episode;
						}
						return ep;
					});
					return season;
				});
			}
			return show;
		});
		localStorage.setItem("shows", JSON.stringify(updatedShows));
	};

	// Function to handle end of the video
	const handleEnded = () => {
		episode.watched = true;
		episode.currentTime = 0;
		saveEpisode(episode);
		playNextEpisode();
	};

	const onReady = useCallback(() => {
		if (!isReady && currentTime) {
			let timeToStart = currentTime - 10;
			if (timeToStart < 0) timeToStart = 0;
			if (playerRef.current) {
				playerRef.current.currentTime = timeToStart;
				setIsReady(true);
			}
		}
	}, [isReady, currentTime]);

	useEffect(() => {
		const height = window.innerHeight - 172;
		const width = height * (16 / 9);
		setHeight(height);
		setWidth(width);
	}, []);

	return (
		<div className='mt-3 flex justify-center'>
			<VlcVideoComponent src={videoURL} width={width} height={height} />
		</div>
	);
}
