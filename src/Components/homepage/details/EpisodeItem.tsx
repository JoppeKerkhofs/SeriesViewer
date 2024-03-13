// import needed models
import Episode from '../../../Models/Episode';

interface EpisodeItemProps {
    showId: string;
    seasonNumber: number;
    episode: Episode;
    setSelectedEpisode: (episode: Episode | null) => void;
}

export default function EpisodeItem(props: EpisodeItemProps) {
    const { showId, seasonNumber, episode, setSelectedEpisode } = props;
    
    return (
        <div>
            <h1>EpisodeItem</h1>
        </div>
    );
}