import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";

// import needed models
import Show from "../../Models/Show";
import Season from "../../Models/Season";
import { VideoFile } from "../../Models/videoFile";

// import needed components
import CustomImage from "../misc/CustomImage";
import SeasonItem from "./details/SeasonItem";
import SelectFiles from "../misc/SelectFiles";
import Loading from "../misc/Loading";

// import scripts
import { updateEpisodesWithVideoFiles } from "../../scripts/addVideoFiles";
import { set } from "video.js/dist/types/tech/middleware";

interface ShowDetailsProps {
	id: string;
	setSelectedShow: (show: Show | null) => void;
	setSelectedSeason: (season: Season | null) => void;
}

export default function ShowDetails(props: ShowDetailsProps) {
	const { id, setSelectedShow, setSelectedSeason } = props;
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// get the show from the local storage
	const shows = JSON.parse(localStorage.getItem("shows") || "[]");
	const show = shows.find((show: Show) => show.id === id);

	function getVideoFiles(files: Array<VideoFile>) {
		// add the video files to the episodes
		const updatedShow = updateEpisodesWithVideoFiles(
			show,
			files,
			setIsLoading
		);
		if (typeof updatedShow === "string") {
			console.error(updatedShow);
		} else {
			// update the show in the local storage
			const updatedShows = shows.map((show: Show) =>
				show.id === id ? updatedShow : show
			);
			localStorage.setItem("shows", JSON.stringify(updatedShows));
			// set the show in the state
			setSelectedShow(updatedShow);
			console.log("Show updated with video files");
		}
	}

	return (
		<>
			<div className='flex items-center'>
				<div
					className='bg-background rounded-lg cursor-pointer w-[56px]'
					onClick={() => setSelectedShow(null)}
				>
					<ArrowBackIcon className='text-white m-4' />
				</div>
				<h1 className='text-3xl font-semibold w-full text-center mr-[56px]'>
					{show.name}
				</h1>
			</div>
			<div className='flex justify-between max-w-[1000px] mx-auto'>
				<div className='text-xl py-10 flex flex-col justify-center'>
					<h2>
						<span className='font-semibold'>Genre:</span>{" "}
						{show.genre}
					</h2>
					<h2>
						<span className='font-semibold'>Rating:</span>{" "}
						{show.rating}
					</h2>
					<h2>
						<span className='font-semibold'>
							Amount of Seasons:
						</span>{" "}
						{show.seasons.length}
					</h2>
				</div>
				<div className='h-[250px] flex'>
					<CustomImage
						src={show.image}
						alt='show poster'
						className='rounded-lg h-full max-w-none mx-auto'
					/>
				</div>
			</div>
			{!show.finalized ? (
				isLoading ? (
					<Loading message='Loading... Please wait.' />
				) : (
					<>
						<div className='max-w-[1000px] mx-auto flex flex-col items-center'>
							<h1 className='text-2xl text-center font-medium mb-4 text-red-500'>
								This show doesn't have valid video files
							</h1>
							<div>
								<SelectFiles
									getVideoFiles={getVideoFiles}
									setIsLoading={setIsLoading}
								/>
							</div>
						</div>
					</>
				)
			) : (
				<div className='max-w-[1000px] mx-auto'>
					<h1 className='text-2xl text-center font-medium mb-4'>
						Watch Now
					</h1>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{show.seasons.map((season: Season) => (
							<SeasonItem
								key={season.number}
								showId={id}
								season={season}
								setSelectedSeason={setSelectedSeason}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}
