// this is the main component for the watch page, here we will display a video player and 2 buttons to navigate to the previous and next episodes
import React, { useEffect, useState } from 'react';

// import needed models
import Show from '../Models/Show';
import Episode from '../Models/Episode';

// import needed components
import WatchEpisode from './watch/WatchEpisode';
import ShowItem from './homepage/ShowItem';

interface WatchProps {
    handlePageChange: (page: string, selectedShow: Show | null) => void;
    selectedShow: Show | null;
    setSelectedShow: (show: Show | null) => void;
}

export default function Watch(props: WatchProps) {
    const { handlePageChange, selectedShow, setSelectedShow } = props;
    const shows = localStorage.getItem('shows');
    let episode: Episode = null;
    let showCount = 0;

    if (selectedShow) {
        const showsParsed = JSON.parse(shows || '[]');
        const show = showsParsed.find((show: Show) => show.id === selectedShow.id);
        if (show) {
            episode = show.currentlyWatchingEpisode;
        }
    }

    function loadShows() {
        if (shows === null || shows === undefined || shows === '[]') {
            return (
                <div className='h-full flex items-center justify-center'>
                    <h1 className='text-3xl font-semibold'>Please add a show</h1>
                </div>
            );
        } else {
            // json parse the shows
            const showsParsed = JSON.parse(shows);
            // if there are shows in the local storage, return the list of shows
            // only return the shows with finalized = true
            const showItems = showsParsed.map((show: Show) => {
                if (show.finalized) {
                    showCount++;
                    return (
                        <ShowItem key={show.id} show={show} onClick={setSelectedShow} />
                    );
                }
            });

            return (
                <div className='h-full pb-10'>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {showCount === 0 ? (
                            <div className='flex flex-col mx-auto mt-36'>
                                <h1 className='text-3xl font-semibold'>None of your shows have valid video files!</h1>
                                <button onClick={() => handlePageChange('home', null)} className='rounded-[16px] bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300 mx-auto mt-4'>Go back home</button>
                            </div>
                        ) : null}
                        {showItems}
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            {selectedShow ? (
                <WatchEpisode episode={episode} show={selectedShow} setSelectedShow={setSelectedShow} />
            ) : (
                loadShows()
            )}
        </>
    );
}