// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, nativeImage, clipboard, Notification } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'

type CopyArg = {
  dataUrl: string
  size: { width: number, height: number }
}

ipcMain.on('copy', (_, arg: CopyArg) => {
  console.log(`copy ipc event received to ${arg.size.width}x${arg.size.height}`);
  const image = nativeImage.createFromDataURL(arg.dataUrl);

  const beforeSize = image.getSize();
  const resized = image.resize({ width: arg.size.width, height: arg.size.height });
  clipboard.writeImage(resized);

  const before = `${beforeSize.width}x${beforeSize.height}`
  const after = `${resized.getSize().width}x${resized.getSize().height}`
  const n = new Notification({
    title: 'relights',
    body: `resized! ${before} -> ${after}`,
    icon: resized,
  })
  n.show()
})


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
  return mainWindow;
}

// Prepare the renderer once the app is ready
let mainWindow: BrowserWindow | null = null;
app.on('ready', async () => {
  await prepareNext('./renderer')
  mainWindow = showWindow();
  console.log(mainWindow);
})
