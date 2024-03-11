// this is the component that will come in a list, this will be the button for a single show

// import the show model
import Show from '../../Models/Show';

interface ShowItemProps {
    show: Show;
}

function ShowItem(props: ShowItemProps) {
    const { show } = props;

    return (
        <div>
            <h2>This is a Show Item</h2>
        </div>
    );
}

export default ShowItem;