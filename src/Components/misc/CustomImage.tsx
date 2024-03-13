import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

interface CustomImageProps {
    src: string;
    alt: string;
    className: string;
}

export default function CustomImage(props: CustomImageProps) {
    const { src, alt, className } = props;
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        ipcRenderer.send('load-local-file', { location: src, requestId: src });
        ipcRenderer.once(`load-local-file-${src}`, (event, data: string) => {
            setImage(data);
        });

        return () => {
            // Cleanup function to remove the event listener when unmounting the component
            ipcRenderer.removeAllListeners(`load-local-file-${src}`);
        };
    }, [src]);

    return (
        <img src={image} alt={alt} className={className} />
    );
}