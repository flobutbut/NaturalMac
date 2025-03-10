const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Configuration de sécurité plus stricte
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  // En mode développement, chargez l'URL du serveur de développement.
  // En production, chargez le fichier HTML local.
  if (process.env.NODE_ENV === 'development') {
    // Attendre que le serveur Vite soit prêt
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:5173')
      mainWindow.webContents.openDevTools()
    }, 2000) // Augmenté à 2 secondes
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