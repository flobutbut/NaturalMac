import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { exec } from 'child_process'
import type { IpcMainInvokeEvent } from 'electron'

// Interface pour la commande
interface CommandResult {
  success: boolean
  output: string
  error?: string
  code?: number
}

// Chemins autorisés
const allowedPaths = [
  app.getPath('home'),
  app.getPath('desktop'),
  app.getPath('documents'),
  app.getPath('downloads')
]

function isPathAllowed(command: string): boolean {
  const sensitivePatterns = [
    /\brm\s+-rf\b/,
    /\bsudo\b/,
    /\/etc\b/,
    /\/usr\b/,
    /\.\.\//, // Empêche la navigation vers les répertoires parents
  ]

  return !sensitivePatterns.some(pattern => pattern.test(command))
}

// Gestionnaire de commande
ipcMain.handle('execute-command', async (event: IpcMainInvokeEvent, command: string): Promise<CommandResult> => {
  if (!isPathAllowed(command)) {
    return {
      success: false,
      output: '',
      error: 'Commande non autorisée pour des raisons de sécurité'
    }
  }

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          output: stderr,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          code: error.code
        })
        return
      }

      resolve({
        success: true,
        output: stdout,
        error: stderr,
        code: 0
      })
    })
  })
})

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // Gérer les erreurs de chargement
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('Échec du chargement, tentative de rechargement...')
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173')
    }, 1000)
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})