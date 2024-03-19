import Episode from "../Models/Episode";
import Show from "../Models/Show";

const ffmpeg = require("ffmpeg-static-electron");
import child_process from "child_process";
import { ipcRenderer } from "electron";

const conversionQueue: { episode: Episode; output: string }[] = [];
const maxConcurrentConversions = 2;

export async function convertMKVFiles(show: Show, setIsLoading: Function) {
	for (let i = 0; i < show.seasons.length; i++) {
		for (let j = 0; j < show.seasons[i].episodes.length; j++) {
			const episode = show.seasons[i].episodes[j];
			if (episode.path.endsWith(".mkv")) {
				console.log("Queuing: ", episode.path);
				const output = episode.path.replace(".mkv", ".mp4");
				conversionQueue.push({ episode, output });
			}
		}
	}

	console.log("Starting conversions...");
	await processQueue();
	console.log("All conversions completed.");
	show.finalized = true;
	setIsLoading(false);
}

async function processQueue() {
	let activePromises: Promise<void>[] = [];

	while (conversionQueue.length > 0) {
		// Start up to maxConcurrentConversions conversions
		while (
			activePromises.length < maxConcurrentConversions &&
			conversionQueue.length > 0
		) {
			const { episode, output } = conversionQueue.shift()!;
			const command = await getConversionCommand(episode, output);
			activePromises.push(
				createConversionPromise(command, episode, output)
			);
		}

		// Wait for one conversion to complete
		const results = await Promise.allSettled(activePromises);

		// Filter out fulfilled promises
		const fulfilledResults = results.filter(
			(result) => result.status === "fulfilled"
		) as PromiseFulfilledResult<void>[];

		// Remove fulfilled promises from activePromises
		activePromises = activePromises.filter(
			(_, index) =>
				!fulfilledResults.some(
					async (result) =>
						result.value === (await activePromises[index])
				)
		);
	}
}

async function getConversionCommand(
	episode: Episode,
	output: string
): Promise<string> {
	return new Promise((resolve) => {
		ipcRenderer.send("check-nvidia-gpu");
		ipcRenderer.once("check-nvidia-gpu", (event, hasNvidiaGpu: boolean) => {
			// get the path of the ffmpeg executable from the dirname, keep everything before /node_modules
			if (hasNvidiaGpu) {
				resolve(
					// `${ffmpeg.path} -i "${episode.path}" -c:v h264_nvenc -preset fast -qp 19 -c:a aac_cuda -b:a 192k -ac 2 "${output}"`
					`${ffmpeg.path} -i "${episode.path}" -c:v libx264 -preset fast -crf 19 -c:a aac -b:a 192k -ac 2 "${output}"`
				);
			} else {
				resolve(
					`${ffmpeg.path} -i "${episode.path}" -c:v libx264 -preset fast -crf 19 -c:a aac -b:a 192k -ac 2 "${output}"`
				);
			}
		});
	});
}

function createConversionPromise(
	command: string,
	episode: Episode,
	output: string
): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		child_process.exec(
			command,
			(error: { message: any }, stdout: any, stderr: any) => {
				if (error) {
					console.error(
						`Error converting ${episode.path}: ${error.message}`
					);
					reject(error);
				}
				console.log(`Conversion of ${episode.path} completed.`);
				episode.path = output;
				resolve();
			}
		);
	});
}
