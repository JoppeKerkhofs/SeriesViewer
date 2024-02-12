// this is the code for the episode model

export default class Episode {
    // the season id
    private _season: number;
    // the episode name
    private _name: string;
    // the episode length
    private _length: number;
    // the episode image
    private _image: string;
    // if the episode has been watched
    private _watched: boolean;
    // if the episode is currently being watched
    private _currentlyWatching: boolean;

    constructor(season?: number, name?: string, length?: number, image?: string, watched?: boolean, currentlyWatching?: boolean) {
        this._season = season || 0;
        this._name = name || '';
        this._length = length || 0;
        this._image = image || '';
        this._watched = watched || false;
        this._currentlyWatching = currentlyWatching || false;
    }

    get season(): number {
        return this._season;
    }

    get name(): string {
        return this._name;
    }

    get length(): number {
        return this._length;
    }

    get image(): string {
        return this._image;
    }

    get watched(): boolean {
        return this._watched;
    }

    get currentlyWatching(): boolean {
        return this._currentlyWatching;
    }

    set season(season: number) {
        this._season = season;
    }

    set name(name: string) {
        this._name = name;
    }

    set length(length: number) {
        this._length = length;
    }

    set image(image: string) {
        this._image = image;
    }

    set watched(watched: boolean) {
        this._watched = watched;
    }

    set currentlyWatching(currentlyWatching: boolean) {
        this._currentlyWatching = currentlyWatching;
    }

    // other methods

    // get the episode length in minutes
    public getLengthInMinutes() {
        return this._length;
    }

    // finished watching the episode
    public finishWatching() {
        this._watched = true;
        this._currentlyWatching = false;
    }

    // start watching the episode
    public startWatching() {
        this._currentlyWatching = true;
    }
}