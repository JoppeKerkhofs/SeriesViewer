// in this file we write the functions to create new data using the models we defined in the Models folder
// all the data will be stored in the localstorage of the user's computer

// import the models
import Show from '../Models/Show';
import Season from '../Models/Season';
import Episode from '../Models/Episode';
// import the apiResponse models
import { ShowResponse, SeasonResponse, EpisodeResponse } from '../Models/apiResponseModels';
import { ipcRenderer } from 'electron';

// function to initialize a new show
export function initializeShow(name: string){
    // check if the show already exists
    if(localStorage.getItem(name)){
        return;
    }

    let show: Show;
    let seasons: Season[] = [];
    let episodes: Episode[] = [];

    // get the show data from the api using the ipcRenderer function, the show data will be returned
    ipcRenderer.send('get-show', name);

    ipcRenderer.on('get-show', (event, data: ShowResponse) => {
        show = new Show(data.Title, data.imdbRating, data.Genre, data.Poster);

        // for every season, get the season data from the api using the ipcRenderer function, the season data will be returned
        for(let i = 1; i <= parseInt(data.totalSeasons); i++){
            ipcRenderer.send('get-season', name, i);
            ipcRenderer.on('get-season', (event, data: SeasonResponse) => {
                let season = new Season(parseInt(data.Season));
                // for every episode, get the episode data from the api using the ipcRenderer function, the episode data will be returned
                for(let j = 1; j <= data.Episodes.length; j++){
                    ipcRenderer.send('get-episode', name, i, j);
                    ipcRenderer.on('get-episode', (event, data: EpisodeResponse) => {
                        episodes.push(new Episode(i, data.Title, parseInt(data.Runtime), data.Poster));
                    });
                }
                // save the season
                show.addSeason(season);
            });
        }
    });

}