import React, { useState } from 'react';

// import needed components
import Loading from '../misc/Loading';

// import needed scripts
import { initializeShow } from '../../scripts/addShow';

interface AddShowProps {
    toggleModal: () => void;
}

export default function AddShow(props: AddShowProps) {
    const { toggleModal } = props;
    const [showModal, setShowModal] = useState(true);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior
        setLoading(true);
        setShowModal(false);
        initializeShow(inputValue).then(() => {
            setLoading(false);
            toggleModal();
        });
    };

    const handleModalClose = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setShowModal(false);
        }
    };

    return (
        <>
            {showModal && (
                <div className='fixed top-0 left-0 w-full h-full bg-background bg-opacity-70 flex justify-center items-center' onClick={handleModalClose}>
                    <form className='bg-white p-4 rounded-xl flex flex-col items-center justify-center' onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <label className='text-black font-medium mb-3'>Enter the name of the show:</label>
                        <input type='text' value={inputValue} onChange={handleInputChange} className='rounded-xl p-2 mb-3 bg-gray-200' />
                        <button type='submit' className='rounded-[16px] bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300' >
                            Add Show
                        </button>
                    </form>
                </div>
            )}
            {loading && <Loading />}
        </>
    );
}
