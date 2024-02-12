// interfaces for the response of the shows

interface Rating {
    Source: string;
    Value: string;
}

export interface ShowResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    totalSeasons: string;
    Response: string;
}

// interfaces for the response of the seasons

interface Episode {
    Title: string;
    Released: string;
    Episode: string;
    imdbRating: string;
    imdbID: string;
}

export interface SeasonResponse {
    Title: string;
    Season: string;
    totalSeasons: string;
    Episodes: Episode[];
    Response: string;
}

// interface for the response of the episodes

export interface EpisodeResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Season: string;
    Episode: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    seriesID: string;
    Type: string;
    Response: string;
}