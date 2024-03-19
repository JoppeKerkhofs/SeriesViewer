import React, { useEffect, useRef } from "react";

// get the videoFile interface
import { VideoFile } from "../../Models/videoFile";

interface SelectFilesProps {
	getVideoFiles: (files: Array<VideoFile>) => void;
	setIsLoading: (isLoading: boolean) => void;
}

export default function SelectFiles(props: SelectFilesProps) {
	const { getVideoFiles, setIsLoading } = props;
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

	const handleFilesSelected = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setIsLoading(true);
		const files = event.target.files;
		let fileArray: VideoFile[] = [];
		if (files) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				fileArray.push({
					name: file.name,
					path: file.path,
					size: file.size,
					type: file.type,
					webKitRelativePath: file.webkitRelativePath,
				});
			}
			getVideoFiles(fileArray);
		}
	};

	return (
		<>
			<input
				type='file'
				ref={ref}
				style={{ display: "none" }}
				onChange={handleFilesSelected}
			/>
			<button
				onClick={handleFolderSelect}
				className='rounded-lg bg-primary-1 p-4 text-onPrimary-1 font-medium hover:bg-primary-2 hover:text-onPrimary-2 duration-300 mx-auto mt-4'
			>
				Add video files
			</button>
		</>
	);
}
