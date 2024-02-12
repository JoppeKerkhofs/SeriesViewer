// this is the code for the Show model

import Season from './Season';

 export default class Show {
    private _name: string;
    private _rating: string;
    private _genre: string;
    private _image: string;
    private _seasons: Season[];

    constructor(name?: string, rating?: string, genre?: string, image?: string, seasons?: Season[]) {
        this._name = name || '';
        this._rating = rating || '0';
        this._genre = genre || '';
        this._image = image || '';
        this._seasons = seasons || [];
    }

    get name(): string {
        return this._name;
    }

    get rating(): string {
        return this._rating;
    }

    get genre(): string {
        return this._genre;
    }

    get image(): string {
        return this._image;
    }

    get seasons(): Season[] {
        return this._seasons;
    }

    set name(name: string) {
        this._name = name;
    }

    set rating(rating: string) {
        this._rating = rating;
    }

    set genre(genre: string) {
        this._genre = genre;
    }

    set image(image: string) {
        this._image = image;
    }

    set seasons(seasons: Season[]) {
        this._seasons = seasons;
    }

    // other methods

    // add a season to the show
    public addSeason(season: Season) {
        this._seasons.push(season);
    }

    // remove a season from the show
    public removeSeason(season: Season) {
        const index = this._seasons.indexOf(season);
        if (index > -1) {
            this._seasons.splice(index, 1);
        }
    }
 }