import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// import needed models
import Episode from '../../Models/Episode';
import Show from '../../Models/Show';

// import needed components
import Video from './Video';

interface WatchEpisodeProps {
    episode: Episode;
    show: Show;
    setSelectedShow: (show: Show | null) => void;
}

export default function WatchEpisode(props: WatchEpisodeProps) {
    let { episode } = props;
    const { show, setSelectedShow } = props;

    function playNextEpisode() {
        console.log('play next episode');
    }

    function playPreviousEpisode() {
        console.log('play previous episode');
    }

    return (
        <>
            <div className='flex items-center'>
                <div className='bg-background rounded-lg cursor-pointer w-[56px]' onClick={() => setSelectedShow(null)}>
                    <ArrowBackIcon className='text-white m-4' />
                </div>
                <h1 className='text-3xl font-semibold w-full text-center mr-[56px]'>{ show.name } - { episode.name }</h1>
            </div>
            <Video episode={episode} />
        </>
    );
}