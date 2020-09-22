import { clipboard, NativeImage, Notification } from 'electron';

const isImageTooLarge = (image: NativeImage) => image.getSize().width > 1000

export function startWatchClipboard(onResized: (image: NativeImage) => void) {
	setInterval(() => {
		const image = clipboard.readImage();
		if (image.isEmpty()) return;
		if (!isImageTooLarge(image)) return;

		const beforeSize = image.getSize();
		const resized = image.resize({ width: 1000 });
		clipboard.writeImage(resized);
		const before = `${beforeSize.width}x${beforeSize.height}`
		const after = `${resized.getSize().width}x${resized.getSize().height}`
		const n = new Notification({
			title: 'relights',
			body: `resized! ${before} -> ${after}`,
			icon: resized,
		})
		onResized(resized);
		n.show();
	}, 1000)
}