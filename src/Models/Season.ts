// this is the code for the season model

import Episode from './Episode';

export default class Season {
    // the season number
    private _number: number;
    // the season episodes
    private _episodes: Episode[];

    constructor(number?: number, episodes?: Episode[]) {
        this._number = number || 0;
        this._episodes = episodes || [];
    }

    get number(): number {
        return this._number;
    }

    get episodes(): Episode[] {
        return this._episodes;
    }

    set number(number: number) {
        this._number = number;
    }

    set episodes(episodes: Episode[]) {
        this._episodes = episodes;
    }

    // other methods

    // add an episode to the season
    public addEpisode(episode: Episode) {
        this._episodes.push(episode);
    }

    // remove an episode from the season
    public removeEpisode(episode: Episode) {
        this._episodes = this._episodes.filter(e => e !== episode);
    }

    // get the total length of the season
    public totalLength() {
        return this._episodes.reduce((acc, episode) => acc + episode.length, 0);
    }

    // play next episode
    public playNextEpisode() {
        const nextEpisode = this._episodes.find(episode => !episode.watched);
        if (nextEpisode) {
            nextEpisode.startWatching();
        } else {
            console.log('You have finished the season!');
        }
    }

    // play previous episode
    public playPreviousEpisode() {
        const previousEpisode = this._episodes.reverse().find(episode => episode.watched);
        if (previousEpisode) {
            previousEpisode.startWatching();
        } else {
            console.log('You are watching the first episode of the season!');
        }
    }
}