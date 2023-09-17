/**
 * A basic game entity with a position and image to be displayed in the game.
 */

import { Canvas } from "../Core/Canvas";
import { ImageManager } from "../Core/ImageManager";
import { Position, Rect } from "../Core/Utils";
import { IMAGE_NAMES } from "../Constants";

export abstract class Entity {
    /**
     * Represents the position of the center of the entity.
     */
    position: Position;

    /**
     * Stored reference to the ImageManager
     */
    imageManager: ImageManager;

    /**
     * Stored reference to the Canvas entity is drawn to
     */
    canvas: Canvas;

    /**
     * The name of the current image being displayed for the entity.
     */
    abstract imageName: IMAGE_NAMES;

    /**
     * Initialize the entities position.
     */
    constructor(x: number, y: number, imageManager: ImageManager, canvas: Canvas) {
        this.position = new Position(x, y);
        this.imageManager = imageManager;
        this.canvas = canvas;
    }

    /**
     * Return the skier's position
     */
    getPosition(): Position {
        return this.position;
    }

    /**
     * Draw the entity to the canvas centered on the X,Y position.
     */
    /**
  * Draw the entity to the canvas centered on the X,Y position.
  */
    draw() {
        const image = this.imageManager.getImage(this.imageName);

        if (!image) {
            return;
        }

        const drawX = this.position.x - (Array.isArray(image) ? image[0].width / 2 : image.width / 2);
        const drawY = this.position.y - (Array.isArray(image) ? image[0].height / 2 : image.height / 2);

        if (Array.isArray(image)) {
            for (const img of image) {
                this.canvas.drawImage(img, drawX, drawY, img.width, img.height);
            }
        } else {
            this.canvas.drawImage(image, drawX, drawY, image.width, image.height);
        }
    }

    /**
     * Return a bounding box in world space coordinates for the entity based upon the current image displayed.
     */
    getBounds(): Rect | null {
        const image = this.imageManager.getImage(this.imageName);
        if (!image) {
            return null;
        }


        if (Array.isArray(image)) {
            const boundsArray = image.map(img => new Rect(
                this.position.x - img.width / 2,
                this.position.y - img.height / 2,
                this.position.x + img.width / 2,
                this.position.y + img.height / 2
            ));
            return boundsArray.reduce((a, b) => a.union(b));
        } else {
            return new Rect(
                this.position.x - image.width / 2,
                this.position.y - image.height / 2,
                this.position.x + image.width / 2,
                this.position.y + image.height / 2
            );
        }
    }


    /**
     * All entities need to define if they die and what happens when they do
     */
    abstract die(): void;
}
