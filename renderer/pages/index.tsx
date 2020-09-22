
import { IpcRenderer } from 'electron'
import React, { useState, useEffect, useCallback } from 'react'
import ResizableImage from '../components/ResizableImage';
import { Size } from '../Size';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

type ImageInfo = {
  imageUrl: string
  width: number
  height: number
}

const getImageFromDataURL = (dataURL: string): Promise<ImageInfo> => {
  return new Promise(resolve => {
    const imgElem = document.createElement('img');
    imgElem.onload = () => {
      resolve({ imageUrl: dataURL, width: imgElem.width, height: imgElem.height });
    }
    imgElem.src = dataURL;
  })
}

const IndexPage = () => {
  const [image, setImage] = useState<ImageInfo>();
  useEffect(() => {
    window.addEventListener('paste', (e) => {
      const data = (e as ClipboardEvent).clipboardData
      if (data && data.files[0]) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          (async () => {
            const image = await getImageFromDataURL(reader.result as string)
            setImage(image);
          })();
        })
        reader.readAsDataURL(data.files[0])
      }
    })
  }, [])

  const handleResize = useCallback((size: Size) => {
    if (!image) return;
    window.ipcRenderer.send('copy', { dataUrl: image.imageUrl, size: size })
  }, [image])

  return (
    <div>
      {image ?
        <ResizableImage src={image.imageUrl}
          width={image.width}
          height={image.height}
          onResize={handleResize}
        /> : <img placeholder="img here" />}
    </div>
  )
}

export default IndexPage
