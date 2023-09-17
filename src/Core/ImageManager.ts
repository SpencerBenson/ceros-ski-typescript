/**
 * Handles loading of any images needed for the game.
 */

import { IMAGE_NAMES } from "../Constants";
import { iImage } from "../Interfaces/iImage";

/**
 * Scale all images loaded by this amount
 * @type {number}
 * */
const SCALE: number = 0.5;

export class ImageManager {
    loadedImages: { [key in IMAGE_NAMES]?: HTMLImageElement | HTMLImageElement[] } = {};

    /**
     * Load each of the passed-in images and return a promise that resolves when all images are finished loading
     */
    async loadImages(images: iImage[]): Promise<void> {
        const imagePromises: Promise<void>[] = [];

        for (const image of images) {
            const imagePromise: Promise<void> = this.loadSingleImage(image);
            imagePromises.push(imagePromise);
        }

        await Promise.all(imagePromises);
    }

    /**
     * Load a single image and return a promise that resolves when the image is finished loading.
     */
    loadSingleImage(image: iImage): Promise<void> {
        return new Promise((resolve) => {
            const loadedImage = new Image();
            loadedImage.onload = () => {
                if (image.name === IMAGE_NAMES.JUMP_RAMP) {
                    // Perform a flip animation while jumping
                    const flipImages: HTMLImageElement[] = [];
                    for (let i = 0; i < 4; i++) {
                        const flipped = this.flipImage(loadedImage, i % 2 === 0);
                        flipImages.push(flipped);
                    }
                    this.loadedImages[image.name] = flipImages;
                } else {
                    this.loadedImages[image.name] = loadedImage;
                }
                resolve();
            };
            loadedImage.src = image.url;
        });
    }

    private flipImage(image: HTMLImageElement, horizontally: boolean): HTMLImageElement {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Canvas context not available");
        }
        canvas.width = image.width;
        canvas.height = image.height;
        context.save();
        context.scale(horizontally ? -1 : 1, 1);
        context.drawImage(image, horizontally ? -image.width : 0, 0);
        context.restore();
        const flippedImage = new Image();
        flippedImage.src = canvas.toDataURL();
        return flippedImage;
    }

    /**
     * Get a single Image by name
     */
    getImage(name: IMAGE_NAMES): HTMLImageElement | HTMLImageElement[] | undefined {
        return this.loadedImages[name];
    }
}
