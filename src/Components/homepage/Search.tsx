import React from 'react';

interface SearchProps {
    setSearchResults: (results: any) => void;
}

export default function Search(props: SearchProps) {
    const { setSearchResults } = props;

    return (
        <div className='max-w-[1000px] mx-auto flex flex-col items-center'>
            <h1 className='text-3xl font-semibold text-center mt-16'>Search for a show</h1>
            <input type='text' className='rounded-lg p-4 mt-4 w-full max-w-[500px]' placeholder='Search...' />
            <button className='rounded-lg bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300 mt-4'>Search</button>
        </div>
    );
}