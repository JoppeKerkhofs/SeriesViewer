import Season from "../../../Models/Season";

interface SeasonItemProps {
    showId: string;
    season: Season;
}

export default function SeasonItem(props: SeasonItemProps) {
    const { showId, season } = props;

    return (
        <div className="bg-primary-1 rounded-lg p-3 cursor-pointer text-center">
            <h1>Season {season.number}</h1>
        </div>
    );
}