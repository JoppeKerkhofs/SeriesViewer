import React, { useEffect, useRef } from 'react';

interface SelectFilesProps {
    getVideoFiles: (path: string) => void;
}

export default function SelectFiles(props: SelectFilesProps) {
    const { getVideoFiles } = props;
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current !== null) {
            ref.current.setAttribute("directory", "");
            ref.current.setAttribute("webkitdirectory", "");
        }
    }, [ref]);

    const handleFolderSelect = () => {
        // Trigger a click event on the input element to open the directory selection dialog
        if (ref.current) {
            ref.current.click();
        }
    };

    const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // get the absolute path of the selected folder
            let folderPath = files[0].path;
            // remove everything after the last \ or / to get the folder path
            const lastSlashIndex = folderPath.lastIndexOf('\\') || folderPath.lastIndexOf('/');
            folderPath = folderPath.substring(0, lastSlashIndex);
            console.log(folderPath);
            getVideoFiles(folderPath);
        }
    };

    return (
        <>
            <input
                type='file'
                ref={ref}
                style={{ display: 'none' }}
                onChange={handleFilesSelected}
            />
            <button onClick={handleFolderSelect} className='rounded-lg bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300 mx-auto mt-4'>Add video files</button>
        </>
    );
}
