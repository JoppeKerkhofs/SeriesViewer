// this is the code for the Show model
import Episode from './Episode';
import Season from './Season';

 export default class Show {
    id: string;
    name: string;
    rating: string;
    genre: string;
    image: string;
    seasons: Season[];
    currentlyWatchingEpisode: Episode;
    finalized: boolean;

    constructor(name?: string, rating?: string, genre?: string, image?: string, seasons?: Season[]) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name || '';
        this.rating = rating || '0';
        this.genre = genre || '';
        this.image = image || '';
        this.seasons = seasons || [];
        this.currentlyWatchingEpisode = null;
        this.finalized = false;
    }

    // add a season to the show
    public addSeason(season: Season) {
        this.seasons.push(season);
    }

    // remove a season from the show
    public removeSeason(season: Season) {
        const index = this.seasons.indexOf(season);
        if (index > -1) {
            this.seasons.splice(index, 1);
        }
    }
 }