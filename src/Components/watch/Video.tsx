import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	type MediaCanPlayDetail,
	type MediaCanPlayEvent,
	MediaPlayer,
	type MediaPlayerInstance,
	MediaProvider,
	type MediaProviderAdapter,
	type MediaProviderChangeEvent,
	isHLSProvider,
	Track,
	Poster,
} from "@vidstack/react";

// import needed models
import Episode from "../../Models/Episode";
import Show from "../../Models/Show";

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
	const [isPlaying, setIsPlaying] = useState(true);
	const [isReady, setIsReady] = useState(false);
	const [videoURL, setVideoURL] = useState<string>(
		"media-loader://" + episode.path
	);
	let player = useRef<MediaPlayerInstance>(null);

	// Function to handle progress updates
	const handleProgress = (event: Event) => {
		const target = event.target as HTMLVideoElement;
		setCurrentTime(target.currentTime);
		console.log("Progress: ", target.currentTime);
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
			player.current!.currentTime = timeToStart;
			setCurrentTime(timeToStart);
			setIsReady(true);
		}
	}, [isReady, currentTime]);

	useEffect(() => {
		const height = window.innerHeight - 172;
		const width = height * (16 / 9);

		// create a style class for the video player using the calculated width and height
		const style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = `
			.video-player {
				width: ${width}px;
				height: ${height}px;
			}
		`;
		// add the style to the head of the document
		document.head.appendChild(style);

		// Subscribe to state updates.
		return player.current!.subscribe(({ paused, currentTime }) => {
			console.log("is paused?", "->", paused.valueOf());
			console.log("current time", "->", currentTime);
		});
	}, []);

	// We can listen for the `can-play` event to be notified when the player is ready.
	function onCanPlay(
		detail: MediaCanPlayDetail,
		nativeEvent: MediaCanPlayEvent
	) {
		console.log("Can play", detail, nativeEvent);
	}

	function onProviderChange(
		provider: MediaProviderAdapter | null,
		nativeEvent: MediaProviderChangeEvent
	) {
		// We can configure provider's here.
		if (isHLSProvider(provider)) {
			provider.config = {};
		}
	}

	return (
		<div className='mt-3 flex justify-center'>
			<MediaPlayer
				className='video-player'
				title={episode.name}
				src={videoURL}
				crossOrigin
				playsInline
				onCanPlay={onCanPlay}
				onPlay={() => console.log("Play")}
				onPause={() => console.log("Pause")}
				onEnded={handleEnded}
				controls
				preload={"auto"}
				ref={player}
				aspectRatio='16/9'
			>
				<MediaProvider />
			</MediaPlayer>
		</div>
	);
}
