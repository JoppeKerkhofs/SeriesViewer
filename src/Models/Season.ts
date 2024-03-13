// this is the code for the season model

import Episode from './Episode';

export default class Season {
    // the season number
    number: number;
    // the season episodes
    episodes: Episode[];

    constructor(number?: number, episodes?: Episode[]) {
        this.number = number || 0;
        this.episodes = episodes || [];
    }

    // add an episode to the season
    public addEpisode(episode: Episode) {
        this.episodes.push(episode);
    }

    // remove an episode from the season
    public removeEpisode(episode: Episode) {
        this.episodes = this.episodes.filter(e => e !== episode);
    }

    // get the total length of the season
    public totalLength() {
        return this.episodes.reduce((acc, episode) => acc + episode.length, 0);
    }
}