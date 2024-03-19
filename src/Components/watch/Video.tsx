import React, { useCallback, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

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

		if (playerRef.current) {
			const player = videojs(playerRef.current, {
				controls: true,
				autoplay: true,
				muted: false,
				height: height,
				width: width,
			});
			player.src({ src: videoURL, type: "video/mp4" });

			player.on("timeupdate", handleProgress);
			player.on("ended", handleEnded);
			player.on("ready", onReady);

			return () => {
				player.dispose();
			};
		}
	}, [videoURL]);

	return (
		<div className='mt-3 flex justify-center'>
			<video ref={playerRef} className='video-js vjs-big-play-centered' />
		</div>
	);
}
