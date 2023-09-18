/**
 * The skier is the entity controlled by the player in the game. The skier skis down the hill, can move at different
 * angles, and crashes into obstacles they run into. If caught by the rhino, the skier will get eaten and die.
 */

import {
    IMAGE_NAMES,
    SKIER_STATES,
    DIAGONAL_SPEED_REDUCER,
    KEYS, SKIER,
    DIRECTION_IMAGES,
    JUMP_FRAMES
} from "../Constants";
import { Entity } from "./Entity";
import { Canvas } from "../Core/Canvas";
import { ImageManager } from "../Core/ImageManager";
import { intersectTwoRects, Rect } from "../Core/Utils";
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { Obstacle } from "./Obstacles/Obstacle";






/**
 * Mapping of the image to display for the skier based upon which direction they're facing.
 */
// const DIRECTION_IMAGES: { [key: number]: IMAGE_NAMES } = {
//     [DIRECTION_LEFT]: IMAGE_NAMES.SKIER_LEFT,
//     [DIRECTION_LEFT_DOWN]: IMAGE_NAMES.SKIER_LEFTDOWN,
//     [DIRECTION_DOWN]: IMAGE_NAMES.SKIER_DOWN,
//     [DIRECTION_RIGHT_DOWN]: IMAGE_NAMES.SKIER_RIGHTDOWN,
//     [DIRECTION_RIGHT]: IMAGE_NAMES.SKIER_RIGHT,
// };

export class Skier extends Entity {
    /**
     * The name of the current image being displayed for the skier.
     */
    imageName: IMAGE_NAMES = IMAGE_NAMES.SKIER_DOWN;

    /**
     * What state the skier is currently in.
     */
    state: SKIER_STATES = SKIER_STATES.SKIING;

    /**
     * What direction the skier is currently facing.
     */
    direction: number = SKIER.DIRECTION.DOWN;

    /**
     * How fast the skier is currently moving in the game world.
     */
    speed: number = SKIER.STARTING_SPEED;

    /**
     * Stored reference to the ObstacleManager
     */
    obstacleManager: ObstacleManager;
    // private state: SKIER_STATES = SKIER_STATES.SKIING;
    private jumpCount: number = 0;
    private jumpingFrameIndex: number = 0;
    private jumpFrames: { x: number; y: number }[] = [];
    private currentJumpFrame: number = 0;
    private jumping: boolean = true;
    private JUMP_FRAME_DELAY: number = 5;
    private x: number;
    private y: number;

    /**
     * Init the skier.
     */
    constructor(x: number, y: number, imageManager: ImageManager, obstacleManager: ObstacleManager, canvas: Canvas) {
        super(x, y, imageManager, canvas);

        this.obstacleManager = obstacleManager;
        this.x = x;
        this.y = y;
        this.jumpFrames = [
            { x: 0, y: -20 },
            { x: 0, y: -40 }
        ];
    }
    public startJump() {
        if (!this.jumping) {
            this.jumping = true;
            this.currentJumpFrame = 0;
        }
    }

    /**
     * Is the skier currently in the crashed state
     */
    isCrashed(): boolean {
        return this.state === SKIER_STATES.CRASHED;
    }

    /**
     * Is the skier currently in the skiing state
     */
    isSkiing(): boolean {
        return this.state === SKIER_STATES.SKIING;
    }
    /**
         * Is the skier currently in the jumping state
         */
    isJumping(): boolean {
        return this.state === SKIER_STATES.JUMPING;
    }

    /**
     * Is the skier currently in the dead state
     */
    isDead(): boolean {
        return this.state === SKIER_STATES.DEAD;
    }

    /**
     * Set the current direction the skier is facing and update the image accordingly
     */
    setDirection(direction: number) {
        this.direction = direction;
        this.setDirectionalImage();
    }

    /**
     * Set the skier's image based upon the direction they're facing.
     */
    setDirectionalImage() {
        this.imageName = DIRECTION_IMAGES[this.direction];
    }

    /**
     * Move the skier and check to see if they've hit an obstacle. The skier only moves in the skiing state.
     */
    update() {

        if (this.jumping) {
            // Apply jump frames
            if (this.currentJumpFrame < this.jumpFrames.length) {
                const jumpFrame = this.jumpFrames[this.currentJumpFrame];
                this.x += jumpFrame.x;
                this.y += jumpFrame.y;
                this.currentJumpFrame++;
            } else {
                // End the jump animation
                this.jumping = false;
                this.currentJumpFrame = 0;
            }
        } else {
            if (this.isSkiing()) {
                this.move();
                this.checkIfHitObstacle();
            }
        }
    }

    /**
     * Draw the skier if they aren't dead
     */
    draw() {
        if (this.isDead()) {
            return;
        }

        super.draw();
    }
    /**
    * Make the  skier Jump .
    */
    jump() {
        if (this.isJumping()) {
            this.state = SKIER_STATES.JUMPING;
            this.jumpCount = 0;
            this.jumpingFrameIndex = 0;
        }
    }
    /**
     * Move the skier based upon the direction they're currently facing. This handles frame update movement.
     */
    move() {
        switch (this.direction) {
            case SKIER.DIRECTION.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case SKIER.DIRECTION.DOWN:
                this.moveSkierDown();
                break;
            case SKIER.DIRECTION.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
            case SKIER.DIRECTION.LEFT:
            case SKIER.DIRECTION.RIGHT:
                // Specifically calling out that we don't move the skier each frame if they're facing completely horizontal.
                break;
        }
    }

    /**
     * Move the skier left. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierLeft() {
        this.position.x -= SKIER.STARTING_SPEED;
    }

    /**
     * Move the skier diagonally left in equal amounts down and to the left. Use the current speed, reduced by the scale
     * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
     */
    moveSkierLeftDown() {
        this.position.x -= this.speed / DIAGONAL_SPEED_REDUCER;
        this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
    }

    /**
     * Move the skier down at the speed they're traveling.
     */
    moveSkierDown() {
        this.position.y += this.speed;
    }

    /**
     * Move the skier diagonally right in equal amounts down and to the right. Use the current speed, reduced by the scale
     * of a right triangle hypotenuse to ensure consistent traveling speed at an angle.
     */
    moveSkierRightDown() {
        this.position.x += this.speed / DIAGONAL_SPEED_REDUCER;
        this.position.y += this.speed / DIAGONAL_SPEED_REDUCER;
    }

    /**
     * Move the skier right. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierRight() {
        this.position.x += SKIER.STARTING_SPEED;
    }

    /**
     * Move the skier up. Since moving up isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    moveSkierUp() {
        this.position.y -= SKIER.STARTING_SPEED;
    }

    /**
     * Handle keyboard input. If the skier is dead, don't handle any input.
     */
    handleInput(inputKey: string) {
        if (this.isDead()) {
            return false;
        }

        let handled: boolean = true;

        switch (inputKey) {
            case KEYS.LEFT:
                this.turnLeft();
                break;
            case KEYS.RIGHT:
                this.turnRight();
                break;
            case KEYS.UP:
                this.turnUp();
                break;
            case KEYS.DOWN:
                this.turnDown();
                break;
            default:
                handled = false;
        }

        return handled;
    }

    /**
        * Handle Skier Jumpingt.
        */
    private handleJumping() {
        // Check if the skier has completed the jump animation
        if (this.jumpingFrameIndex === JUMP_FRAMES.length - 1) {
            this.state = SKIER_STATES.SKIING; // Return to skiing state
        } else {
            // Update skier position and draw the jumping frame
            this.x += JUMP_FRAMES[this.jumpingFrameIndex].x;
            this.y += JUMP_FRAMES[this.jumpingFrameIndex].y;
            this.drawJumpingFrame();
            this.jumpCount++;

            // Increase jumping frame index after a few jumps (adjust this value)
            if (this.jumpCount >= this.JUMP_FRAME_DELAY) {
                this.jumpingFrameIndex++;
                this.jumpCount = 0;
            }
        }
    }
    // Draw the jumping frame
    private drawJumpingFrame() {
        const image = this.imageManager.getImage(IMAGE_NAMES.SKIER_JUMP1);
        if (image) {
            this.canvas.drawImage(image, this.x, this.y, image.width, image.height);
        }
    }

    /**
     * Turn the skier left. If they're already completely facing left, move them left. Otherwise, change their direction
     * one step left. If they're in the crashed state, then first recover them from the crash.
     */
    turnLeft() {
        if (this.isCrashed()) {
            this.recoverFromCrash(SKIER.DIRECTION.LEFT);
        }

        if (this.direction === SKIER.DIRECTION.LEFT) {
            this.moveSkierLeft();
        } else {
            this.setDirection(this.direction - 1);
        }
    }

    /**
     * Turn the skier right. If they're already completely facing right, move them right. Otherwise, change their direction
     * one step right. If they're in the crashed state, then first recover them from the crash.
     */
    turnRight() {
        if (this.isCrashed()) {
            this.recoverFromCrash(SKIER.DIRECTION.RIGHT);
        }

        if (this.direction === SKIER.DIRECTION.RIGHT) {
            this.moveSkierRight();
        } else {
            this.setDirection(this.direction + 1);
        }
    }

    /**
     * Turn the skier up which basically means if they're facing left or right, then move them up a bit in the game world.
     * If they're in the crashed state, do nothing as you can't move up if you're crashed.
     */
    turnUp() {
        if (this.isCrashed()) {
            return;
        }

        if (this.direction === SKIER.DIRECTION.LEFT || this.direction === SKIER.DIRECTION.RIGHT) {
            this.moveSkierUp();
        }
    }

    /**
     * Turn the skier to face straight down. If they're crashed don't do anything to require them to move left or right
     * to escape an obstacle before skiing down again.
     */
    turnDown() {
        if (this.isCrashed()) {
            return;
        }

        this.setDirection(SKIER.DIRECTION.DOWN);
    }

    /**
     * The skier has a bit different bounds calculating than a normal entity to make the collision with obstacles more
     * natural. We want te skier to end up in the obstacle rather than right above it when crashed, so move the bottom
     * boundary up.
     */
    getBounds(): Rect | null {
        const image = this.imageManager.getImage(this.imageName);
        if (!image) {
            return null;
        }

        return new Rect(
            this.position.x - image.width / 2,
            this.position.y - image.height / 2,
            this.position.x + image.width / 2,
            this.position.y - image.height / 4
        );
    }

    /**
     * Go through all the obstacles in the game and see if the skier collides with any of them. If so, crash the skier.
     */
    checkIfHitObstacle() {
        const skierBounds = this.getBounds();
        if (!skierBounds) {
            return;
        }

        const collision = this.obstacleManager.getObstacles().find((obstacle: Obstacle): boolean => {
            const obstacleBounds = obstacle.getBounds();
            if (!obstacleBounds) {
                return false;
            }

            return intersectTwoRects(skierBounds, obstacleBounds);
        });

        if (collision) {
            this.crash();
        }
    }

    /**
     * Crash the skier. Set the state to crashed, set the speed to zero cause you can't move when crashed and update the
     * image.
     */
    crash() {
        this.state = SKIER_STATES.CRASHED;
        this.speed = 0;
        this.imageName = IMAGE_NAMES.SKIER_CRASH;
    }

    /**
     * Change the skier back to the skiing state, get them moving again at the starting speed and set them facing
     * whichever direction they're recovering to.
     */
    recoverFromCrash(newDirection: number) {
        this.state = SKIER_STATES.SKIING;
        this.speed = SKIER.STARTING_SPEED;
        this.setDirection(newDirection);
    }

    /**
     * Kill the skier by putting them into the "dead" state and stopping their movement.
     */
    die() {
        this.state = SKIER_STATES.DEAD;
        this.speed = 0;
    }
}
