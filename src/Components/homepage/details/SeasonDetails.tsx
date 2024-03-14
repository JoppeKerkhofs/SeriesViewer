import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// import the used models
import Season from '../../../Models/Season';
import Episode from '../../../Models/Episode';
import EpisodeItem from './EpisodeItem';

interface SeasonDetailsProps {
    showId: string;
    season: Season;
    setSelectedSeason: (season: Season | null) => void;
    setSelectedEpisode: (episode: Episode | null) => void;
}

export default function SeasonDetails(props: SeasonDetailsProps) {
    const { showId, season, setSelectedSeason, setSelectedEpisode } = props;

    return (
        <>
            <div className='flex items-center'>
                <div className='bg-background rounded-lg cursor-pointer w-[56px]' onClick={() => setSelectedSeason(null)}>
                    <ArrowBackIcon className='text-white m-4' />
                </div>
                <h1 className='text-3xl font-semibold w-full text-center mr-[56px]'>Season { season.number }</h1>
            </div>
            <div className='max-w-[1000px] mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {season.episodes.map((episode: Episode) => (
                        <EpisodeItem key={episode.number} showId={showId} seasonNumber={season.number} episode={episode} setSelectedEpisode={setSelectedEpisode} />
                    ))}
                </div>
            </div>
        </>
    );
}