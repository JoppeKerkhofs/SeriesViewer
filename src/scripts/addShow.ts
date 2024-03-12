import { ipcRenderer } from 'electron';
import axios from 'axios';

// import the models
import Show from '../Models/Show';
import Season from '../Models/Season';
import Episode from '../Models/Episode';
// import the apiResponse models
import { ShowResponse, SeasonResponse, EpisodeResponse } from '../Models/apiResponseModels';

// function to initialize a new show
export async function initializeShow(name: string){
    // check if the show already exists in the shows array in the local storage
    let shows = JSON.parse(localStorage.getItem('shows') || '[]');
    for (let i = 0; i < shows.length; i++) {
        if (shows[i].name === name) {
            console.log('show already exists');
            return;
        }
    }

    console.log('initializing show: ', name);

    // get the show data from the api using the ipcRenderer function, the show data will be returned
    const showData: ShowResponse = await new Promise((resolve) => {
        ipcRenderer.send('get-show', name);
        ipcRenderer.once('get-show', (event, data: ShowResponse) => {
            resolve(data);
        });
    });

    // download the poster of the show
    console.log('fetching poster');
    let location = showData.Title.toLowerCase().replace( /\s/g, '') + '/posters';
    // get the poster via the getPoster function
    const poster: string = await new Promise((resolve) => {
        ipcRenderer.send('get-online-image', showData.Poster, location);
        ipcRenderer.once('get-online-image', (event, data: string) => {
            resolve(data);
        });
    });

    console.log("Poster: ", poster);

    const show = new Show(showData.Title, showData.imdbRating, showData.Genre, poster);

    console.log('getting the seasons and episodes');

    // for every season, get the season data from the api using the ipcRenderer function, the season data will be returned
    for(let i = 1; i <= parseInt(showData.totalSeasons); i++){
        try {
            const seasonData: SeasonResponse = await new Promise((resolve) => {
                ipcRenderer.send('get-season', name, i);
                ipcRenderer.once('get-season', (event, data: SeasonResponse) => {
                    resolve(data);
                });
            });

            let season = new Season(parseInt(seasonData.Season));
            // for every episode, get the episode data from the api using the ipcRenderer function, the episode data will be returned
            for(let j = 1; j <= seasonData.Episodes.length; j++){
                try {
                    const episodeData: EpisodeResponse = await new Promise((resolve) => {
                        ipcRenderer.send('get-episode', name, i, j);
                        ipcRenderer.once('get-episode', (event, data: EpisodeResponse) => {
                            resolve(data);
                        });
                    });
                    console.log("Getting episode poster");
                    let location = show.name.toLowerCase().replace( /\s/g, '') + '/episodes';
                    // get the poster of the episode
                    const episodePoster: string = await new Promise((resolve) => {
                        ipcRenderer.send('get-online-image', episodeData.Poster, location);
                        ipcRenderer.once('get-online-image', (event, data: string) => {
                            resolve(data);
                        });
                    });
                    // add the episode to the season
                    season.episodes.push(new Episode(i, episodeData.Title, parseInt(episodeData.Runtime), episodePoster));
                } catch (error) {
                    console.error('Error fetching episode:', error);
                }
            }
            // save the season
            show.addSeason(season);
        } catch (error) {
            console.error('Error fetching season:', error);
        }
    }

    console.log('show initialized');
    // Add the show to the shows array in the local storage
    shows.push(show);
    localStorage.setItem('shows', JSON.stringify(shows));
}