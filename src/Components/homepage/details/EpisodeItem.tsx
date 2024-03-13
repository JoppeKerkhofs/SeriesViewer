// import needed models
import Episode from '../../../Models/Episode';

// import needed components
import CustomImage from '../../misc/CustomImage';

interface EpisodeItemProps {
    showId: string;
    seasonNumber: number;
    episode: Episode;
    setSelectedEpisode: (episode: Episode | null) => void;
}

export default function EpisodeItem(props: EpisodeItemProps) {
    const { showId, seasonNumber, episode, setSelectedEpisode } = props;
    
    return (
        <div onClick={() => setSelectedEpisode(episode)} className="bg-white drop-shadow-lg hover:drop-shadow-2xl rounded-lg p-3 cursor-pointer text-center duration-150">
            <h1>{episode.name}</h1>
            <h2 className='text-slate-600'>{episode.length} min</h2>
            <div className='w-[250px] h-[200px] flex mx-auto'>
                <CustomImage src={episode.image} alt="episode poster" className='rounded-lg mx-auto object-cover' />
            </div>
        </div>
    );
}