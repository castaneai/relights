import React, { useState, useEffect, useCallback, useMemo, CSSProperties } from 'react'
import { Position, Size } from '../Size';


type Props = {
	src: string
	width: number
	height: number

	onResize: (size: Size) => void
}

const computeImageSize = (size: Size, zoom: number): Size => {
	return { width: Math.floor(size.width * zoom), height: Math.floor(size.height * zoom) };
}

const ResizableImage = (props: Props) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [dragOrigin, setDragOrigin] = useState<Position>();
	const [zoom, setZoom] = useState<number>(1.0);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		setDragOrigin({ x: e.clientX, y: e.clientY })
		setIsDragging(true);
		e.preventDefault();
	}, [])

	const handleMouseMove = useCallback(({ clientY }) => {
		if (!dragOrigin) return;
		const translation = clientY - dragOrigin.y;
		const relativeZoom = 1 - (translation / -200);
		const toZoom = Math.min(Math.max(zoom * relativeZoom, 0.1), 1.0);
		setZoom(toZoom);
	}, [dragOrigin])

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Reset zoom when new image is pasted
	useEffect(() => {
		setZoom(1.0);
	}, [props.src])

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		} else {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
			console.log(`on resized (zoom: ${zoom})`);
			if (zoom != 1.0) props.onResize(computeImageSize(props, zoom))
		}
	}, [isDragging]);

	const style = useMemo((): CSSProperties => {
		return {
			position: 'relative',
			cursor: 'grab',
			width: `${zoom * 100}%`,
			height: 'auto',
		}
	}, [zoom]);
	const computedSize = computeImageSize(props, zoom);

	return <div style={style} onMouseDown={handleMouseDown}>
		<div style={{ position: 'absolute', background: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '0.2em' }}>
			{computedSize.width}x{computedSize.height} ({Math.floor(zoom * 100)}%)
		</div>
		<img width={computedSize.width} height={computedSize.height} src={props.src} />
	</div>
}

export default ResizableImage
