// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import { startWatchClipboard } from './clipboard'


const showWindow = () => {
  const mainWindow = new BrowserWindow({
    title: 'relights',
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  const url = isDev
    ? 'http://localhost:8000/'
    : format({
      pathname: join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  mainWindow.loadURL(url)
  mainWindow.webContents.openDevTools();
  return mainWindow;
}

// Prepare the renderer once the app is ready
let mainWindow: BrowserWindow | null = null;
app.on('ready', async () => {
  await prepareNext('./renderer')
  mainWindow = showWindow();
  startWatchClipboard(image => {
    console.log(`resized image: ${image}`);
    if (mainWindow !== null) {
      mainWindow.show();
      mainWindow.webContents.send('image', image.toDataURL());
    }
  });
})
