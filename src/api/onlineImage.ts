import axios, { AxiosError } from 'axios';
import path from 'path'; // Import the path module
import fs from 'fs'; // Import the file system module

export async function getOnlineImage(url: string, location: string) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data, 'binary');
        // save the poster to the assets/posters folder in the src directory
        const directoryPath = path.join(__dirname, '..', '..', 'src', 'assets', location);
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        // Save the image to /assets/posters, use the original filename
        const filePath = path.join(directoryPath, path.basename(url));
        fs.writeFileSync(filePath, buffer);
        return filePath;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.code === 'ECONNRESET') {
                console.error('Connection reset while downloading the poster:', error);
                return 'error: connection reset';
            }
        }
        console.error('Error downloading poster:', error);
        return 'error';
    }
}
