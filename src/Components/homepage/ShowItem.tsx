import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

// used models
import Show from '../../Models/Show';

// other components
import ConfirmationDialog from '../misc/ConfirmationDialog';
import CustomImage from '../misc/CustomImage';

// icons
import DeleteIcon from '@mui/icons-material/Delete';

interface ShowItemProps {
    show: Show;
    removeShow?: (id: string) => void;
    onClick: (show: Show) => void;
}

export default function ShowItem(props: ShowItemProps) {
    const { show, removeShow, onClick } = props;
    const [poster, setPoster] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [showTitle, setShowTitle] = useState<string>('');

    useEffect(() => {
        if (removeShow) {
            setShowTitle('flex items-center mb-2');
        } else {
            setShowTitle('flex items-center justify-center mb-2');
        }
    }, [removeShow]);

    const handleConfirmRemove = () => {
        removeShow(show.id);
        setShowConfirmation(false);
    };

    const handleCancelRemove = () => {
        setShowConfirmation(false);
    };

    return (
        <div onClick={() => onClick(show)} className='bg-white drop-shadow-lg rounded-lg p-3 hover:drop-shadow-2xl duration-150 cursor-pointer text-2xl w-[330px] h-[450px] flex flex-col justify-center'>
            <div className={ showTitle }>
                <h2 className='text-center font-semibold truncate select-none'>{show.name}</h2>
                {removeShow ? (
                <button className='ml-auto text-red-500 hover:text-red-700 duration-150 p-2' onClick={(e) => {e.stopPropagation(); setShowConfirmation(true);}} title='Remove this show'>
                    <DeleteIcon />
                </button>
                ) : null}
            </div>
            <div className='max-h-[370px] h-full flex'>
                <CustomImage src={show.image} alt="show poster" className='rounded-lg h-full max-w-none mx-auto' />
            </div>
            {showConfirmation && (
                <ConfirmationDialog
                    message="Are you sure you want to remove this show?"
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                />
            )}
        </div>
    );
}
