const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
// Enable hot reload
try {
    require('electron-reloader')(module)
} catch (_) { }
// a variable to store the settings data from settings.json file
let settings = {};

function createWindow() {
    // Load the settings data from settings.json file
    const settingsPath = path.join(__dirname, 'settings.json');
    try {
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch (err) {
        // Handle error if settings file doesn't exist or is invalid
        console.error('Error reading settings file:', err);
    }

    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration
            contextIsolation: false // Enable IPC communication
        },
        // Hide the default menu bar
        autoHideMenuBar: true
    });

    // Load the index.html file of your app
    const indexPath = path.join(__dirname, 'src/index.html');
    mainWindow.loadFile(indexPath);

    // console log the settings data
    console.log('Settings:', settings);
    // Send the settings data to the renderer process asynchronously
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('settings', settings);
    });
}

// When Electron has finished initialization, create the app window
app.on('ready', () => {
    createWindow();

    // Listener to handle update of theme in settings
    ipcMain.on('updateSettings', (event, updatedSettings) => {
        settings = { ...settings, ...updatedSettings };

        // Save the updated settings data to settings.json file
        const settingsPath = path.join(__dirname, 'settings.json');
        const settingsData = JSON.stringify(settings, null, 2);
        fs.writeFileSync(settingsPath, settingsData);

        // Log the updated settings data
        // console.log('Updated settings:', settings);
    });

    // Listener to handle opening of directory dialog
    ipcMain.on('openDirectoryDialog', (event) => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(result => {
            // Send the selected directory path to the renderer process
            const selectedDirectory = result.filePaths[0];
            event.sender.send('selectedDirectory', selectedDirectory);
        }).catch(err => {
            console.error('Error selecting directory:', err);
        });
    });
});

// Save the settings data to settings.json file before quitting the app
app.on('before-quit', () => {
    const settingsPath = path.join(__dirname, 'settings.json');
    const settingsData = JSON.stringify(settings, null, 2);
    fs.writeFileSync(settingsPath, settingsData);
});
