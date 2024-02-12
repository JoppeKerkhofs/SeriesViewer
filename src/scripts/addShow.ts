// in this file we write the functions to create new data using the models we defined in the Models folder
// all the data will be stored in the localstorage of the user's computer

// import the models
import Show from '../Models/Show';
import Season from '../Models/Season';
import Episode from '../Models/Episode';
// import the apiResponse models
import { ShowResponse, SeasonResponse, EpisodeResponse } from '../Models/apiResponseModels/seasonResponseModel';

// import the api calls
import { searchShow, searchSeason, searchEpisode } from '../api/omdbCalls';

// function to initialize a new show
export function initializeShow(name: string){
    // check if the show already exists
    if(localStorage.getItem(name)){
        return;
    }

    let show: Show;
    let seasons: Season[] = [];
    let episodes: Episode[] = [];

    // get the data from the api
    searchShow(name).then((data: ShowResponse) => {
        // create a new show
        show = new Show(data.Title, data.imdbRating, data.Genre, data.Poster);

        // get the seasons
        for(let i = 1; i <= parseInt(data.totalSeasons); i++){
            searchSeason(name, i).then((seasonData: SeasonResponse) => {
                // create a new season
                let season = new Season(seasonData.Title, parseInt(seasonData.Season), []);

                // get the episodes
                for(let j = 0; j < seasonData.Episodes.length; j++){
                    searchEpisode(name, parseInt(seasonData.Season), j + 1).then((episodeData: EpisodeResponse) => {
                        // parse the runtime to a number, the format is '30 min'
                        let runtime = parseInt(episodeData.Runtime.split(' ')[0]);
                        // create a new episode
                        let episode = new Episode(parseInt(seasonData.Season), episodeData.Title, runtime, episodeData.Poster, false, false);
                        episodes.push(episode);
                        season.episodes = episodes;
                    });
                }
                seasons.push(season);
                show.seasons = seasons;
            });
        }

        // store the show in the localstorage
        localStorage.setItem(name, JSON.stringify(show));
    });
}