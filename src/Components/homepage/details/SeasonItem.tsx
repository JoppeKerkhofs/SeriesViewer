import Season from "../../../Models/Season";

interface SeasonItemProps {
    showId: string;
    season: Season;
    setSelectedSeason: (season: Season | null) => void;
}

export default function SeasonItem(props: SeasonItemProps) {
    const { showId, season, setSelectedSeason } = props;

    return (
        <div onClick={() => setSelectedSeason(season)} className="bg-primary-1 rounded-lg p-3 cursor-pointer text-center hover:bg-primary-2 hover:text-onPrimary-2 duration-150">
            <h1>Season {season.number}</h1>
        </div>
    );
}