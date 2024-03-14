// this is the code for the episode model

export default class Episode {
	// the show id
	showId: string;
	// the season id
	season: number;
	// the episode number
	number: number;
	// the episode name
	name: string;
	// the episode length
	length: number;
	// the episode image
	image: string;
	// if the episode has been watched
	watched: boolean;
	// if the episode is currently being watched
	currentlyWatching: boolean;
	// the path to the episode file
	path?: string;
	// the current time of the episode
	currentTime?: number;

	constructor(
		showId?: string,
		season?: number,
		number?: number,
		name?: string,
		length?: number,
		image?: string,
		watched?: boolean,
		currentlyWatching?: boolean
	) {
		this.showId = showId || "";
		this.season = season || 0;
		this.number = number || 0;
		this.name = name || "";
		this.length = length || 0;
		this.image = image || "";
		this.watched = watched || false;
		this.currentlyWatching = currentlyWatching || false;
		this.currentTime = 0;
	}
}
