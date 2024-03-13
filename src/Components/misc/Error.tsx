interface ErrorProps {
    error: string;
    setError: (error: string) => void;
    handleClose: () => void;
}

export default function Error(props: ErrorProps) {
    const { error, setError, handleClose } = props;

    return (
        <div className='fixed top-0 left-0 w-full h-full bg-background bg-opacity-70 flex justify-center items-center'>
            <div className='w-[240px] h-[180px] bg-white p-4 rounded-xl flex flex-col items-center justify-center'>
                <h1 className='text-black font-medium mb-3'>An error occurred:</h1>
                <p className='text-red-600 mb-3'>{error}</p>
                <button onClick={handleClose} className='rounded-[16px] w-36 bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300' >
                    Close
                </button>
            </div>
        </div>
    );
}