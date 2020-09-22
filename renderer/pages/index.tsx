
import { IpcRenderer } from 'electron'
import React, { useState, useEffect } from 'react'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

const IndexPage = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  useEffect(() => {
    console.log('use effect!')
    window.ipcRenderer.on('image', (_, imageUrl: string) => {
      setImageUrl(imageUrl);
    });
  }, [imageUrl])
  return (
    <div>
      <h1>Hello Next.js 👋</h1>
      <img src={imageUrl} />
    </div>
  )
}

export default IndexPage
