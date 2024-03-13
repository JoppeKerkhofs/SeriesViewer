// in this file we will make the calls to the OMDB API

import axios from 'axios';

const API_KEY = '4552d2df';

export async function searchMovies(movieName: string) {
    try {
        const response = await axios.get(`https://www.omdbapi.com/?s=${movieName}&apikey=${API_KEY}&type=movie`);
        // check if the response is valid, if not return an error
        if (response.data.Response === 'False') {
            return response.data.Error;
        }
        // check if the response is a movie, if not return an error
        if (response.data.Type !== 'movie') {
            return 'This is not a movie';
        }
        return response.data.Search;
    } catch (error) {
        console.error('Error searching movies:', error);
        return null; // or any other value indicating failure
    }
}

export async function searchShow(showName: string) {
    try {
        const response = await axios.get(`https://www.omdbapi.com/?t=${showName}&apikey=${API_KEY}&type=series`);
        // check if the response is valid, if not return an error
        if (response.data.Response === 'False') {
            return response.data.Error;
        }
        // check if the response is a series, if not return an error
        if (response.data.Type !== 'series') {
            return 'This is not a series';
        }
        return response.data;
    } catch (error) {
        console.error('Error searching show:', error);
        return null; // or any other value indicating failure
    }
}

export async function searchSeason(showName: string, seasonNumber: number) {
    try {
        const response = await axios.get(`https://www.omdbapi.com/?t=${showName}&Season=${seasonNumber}&apikey=${API_KEY}`);
        // check if the response is valid, if not return an error
        if (response.data.Response === 'False') {
            return response.data.Error;
        }
        return response.data;
    } catch (error) {
        console.error('Error searching season:', error);
        return null; // or any other value indicating failure
    }
}

export async function searchEpisode(showName: string, seasonNumber: number, episodeNumber: number) {
    try {
        const response = await axios.get(`https://www.omdbapi.com/?t=${showName}&Season=${seasonNumber}&Episode=${episodeNumber}&apikey=${API_KEY}`, {
            timeout: 5000, // Timeout in milliseconds
        });
        // check if the response is valid, if not return an error
        if (response.data.Response === 'False') {
            return response.data.Error;
        }
        return response.data;
    } catch (error) {
        console.error('Error searching episode:', error);
        return null; // or any other value indicating failure
    }
}
