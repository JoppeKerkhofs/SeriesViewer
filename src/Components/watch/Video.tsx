// the used models
import Episode from '../../Models/Episode';

interface VideoProps {
    episode: Episode;
}

export default function Video(props: VideoProps) {
    const { episode } = props;

    return (
        <div>
            Video
        </div>
    );
}