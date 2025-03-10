const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

// Chemins autorisés
const allowedPaths = [
  app.getPath('home'),
  app.getPath('desktop'),
  app.getPath('documents'),
  app.getPath('downloads')
]

function isPathAllowed(command) {
  return allowedPaths.some(path => command.includes(path))
}

// Gestionnaire de commandes
ipcMain.handle('execute-command', async (event, command) => {
  if (!isPathAllowed(command)) {
    return {
      success: false,
      output: '',
      error: 'Chemin non autorisé'
    }
  }

  try {
    const { stdout, stderr } = await execAsync(command)
    return {
      success: !stderr,
      output: stdout,
      error: stderr || undefined,
      code: stderr ? 1 : 0
    }
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error.message
    }
  }
})

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
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