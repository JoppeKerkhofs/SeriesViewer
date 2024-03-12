import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import Show from '../../Models/Show';

interface ShowItemProps {
    show: Show;
}

export default function ShowItem(props: ShowItemProps) {
    const { show } = props;
    const [poster, setPoster] = useState<string>('');

    useEffect(() => {
        ipcRenderer.send('load-local-file', show.image);
        ipcRenderer.once('load-local-file', (event, data: string) => {
            setPoster(data);
        });
        return () => {
            // Cleanup function to remove the event listener when unmounting the component
            ipcRenderer.removeAllListeners('load-local-file');
        };
    }, [show.image]);

    return (
        <div className='bg-white drop-shadow-lg rounded-lg p-3 hover:drop-shadow-xl duration-150 cursor-pointer text-2xl'>
            <h2 className='text-center font-semibold'>{show.name}</h2>
            <img src={poster} alt="show poster" className='rounded-lg' />
        </div>
    );
}
