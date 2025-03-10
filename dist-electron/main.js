"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const child_process_1 = require("child_process");
// Chemins autorisés
const allowedPaths = [
    electron_1.app.getPath('home'),
    electron_1.app.getPath('desktop'),
    electron_1.app.getPath('documents'),
    electron_1.app.getPath('downloads')
];
function isPathAllowed(command) {
    const sensitivePatterns = [
        /\brm\s+-rf\b/,
        /\bsudo\b/,
        /\/etc\b/,
        /\/usr\b/,
        /\.\.\//, // Empêche la navigation vers les répertoires parents
    ];
    return !sensitivePatterns.some(pattern => pattern.test(command));
}
// Gestionnaire de commande
electron_1.ipcMain.handle('execute-command', async (event, command) => {
    if (!isPathAllowed(command)) {
        return {
            success: false,
            output: '',
            error: 'Commande non autorisée pour des raisons de sécurité'
        };
    }
    return new Promise((resolve) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    success: false,
                    output: stderr,
                    error: error instanceof Error ? error.message : 'Erreur inconnue',
                    code: error.code
                });
                return;
            }
            resolve({
                success: true,
                output: stdout,
                error: stderr,
                code: 0
            });
        });
    });
});
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 670,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, 'preload.js')
        }
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile((0, path_1.join)(__dirname, '../dist/index.html'));
    }
    // Gérer les erreurs de chargement
    mainWindow.webContents.on('did-fail-load', () => {
        console.log('Échec du chargement, tentative de rechargement...');
        setTimeout(() => {
            mainWindow.loadURL('http://localhost:5173');
        }, 1000);
    });
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
