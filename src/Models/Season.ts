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

    // other methods

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

    // play next episode
    public playNextEpisode() {
        const nextEpisode = this.episodes.find(episode => !episode.watched);
        if (nextEpisode) {
            nextEpisode.startWatching();
        } else {
            console.log('You have finished the season!');
        }
    }

    // play previous episode
    public playPreviousEpisode() {
        const previousEpisode = this.episodes.reverse().find(episode => episode.watched);
        if (previousEpisode) {
            previousEpisode.startWatching();
        } else {
            console.log('You are watching the first episode of the season!');
        }
    }
}