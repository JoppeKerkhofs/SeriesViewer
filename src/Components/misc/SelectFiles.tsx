import React, { useRef } from 'react';

interface SelectFilesProps {
    setBaseDirName: React.Dispatch<React.SetStateAction<string>>;
    getVideoFiles: () => void;
}

export default function SelectFiles(props: SelectFilesProps) {
    const { setBaseDirName, getVideoFiles } = props;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFolderSelect = () => {
        // Trigger a click event on the input element to open the directory selection dialog
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const folderPath = files[0].webkitRelativePath.split('/')[0];
            // Save the selected folder path
            setBaseDirName(folderPath);
            // Get the video files from the selected folder
            getVideoFiles();
        }
    };

    return (
        <>
            <input
                type='file'
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleFilesSelected}
            />
            <button onClick={handleFolderSelect} className='rounded-lg bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300 mx-auto mt-4'>Add video files</button>
        </>
    );
}
