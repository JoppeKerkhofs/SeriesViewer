// this is the code for the episode model

export default class Episode {
    // the season id
    season: number;
    id: string;
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

    constructor(season?: number, name?: string, length?: number, image?: string, watched?: boolean, currentlyWatching?: boolean) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.season = season || 0;
        this.name = name || '';
        this.length = length || 0;
        this.image = image || '';
        this.watched = watched || false;
        this.currentlyWatching = currentlyWatching || false;
    }

    // other methods

    // get the episode length in minutes
    public getLengthInMinutes() {
        return this.length;
    }

    // finished watching the episode
    public finishWatching() {
        this.watched = true;
        this.currentlyWatching = false;
    }

    // start watching the episode
    public startWatching() {
        this.currentlyWatching = true;
    }
}