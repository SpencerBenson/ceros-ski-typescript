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
    IMAGES_SKIER_JUMPING,
    ANIMATION_FRAME_SPEED_MS
} from "../Constants";
import { Entity } from "./Entity";
import { Canvas } from "../Core/Canvas";
import { ImageManager } from "../Core/ImageManager";
import { intersectTwoRects, Rect } from "../Core/Utils";
import { ObstacleManager } from "./Obstacles/ObstacleManager";
import { Obstacle } from "./Obstacles/Obstacle";

//set jumping animation
import { Animation } from "../Core/Animation";

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
    private x: number;
    private y: number;

    /**
     * Stores all of the animations available for the different states of the skier jumping.
     */
    animations: { [key: string]: Animation } = {};


    /**
     * The current animation that the skier is using. Typically matches the state the skier is in.
     */
    curAnimation: Animation | null = null;

    /**
     * The current frame of the current animation the skier is on.
     */
    curAnimationFrame: number = 0;

    /**
     * The time in ms of the last frame change. Used to provide a consistent framerate.
     */
    curAnimationFrameTime: number = Date.now();
    /**
     * Init the skier.
     */
    constructor(x: number, y: number, imageManager: ImageManager, obstacleManager: ObstacleManager, canvas: Canvas) {
        super(x, y, imageManager, canvas);

        this.obstacleManager = obstacleManager;
        this.x = x;
        this.y = y;
        this.setupAnimations();
    }
    /**
      * Create and store the animations.
      */
    setupAnimations() {
        // Define the skiing animation
        this.animations[SKIER_STATES.SKIING] = new Animation([IMAGE_NAMES.SKIER_DOWN], true);

        // Define the jumping animation
        this.animations[SKIER_STATES.JUMPING] = new Animation(IMAGES_SKIER_JUMPING, false, () => {
            this.setSkiingState();
            this.setDirection(SKIER.DIRECTION.DOWN);
        });

        // this.animations[SKIER_STATES.JUMPING] = new Animation(IMAGES_SKIER_JUMPING, false, );
    }



    /**
     * Advance to the next frame in the current animation if enough time has elapsed since the previous frame.
     */
    animate(gameTime: number) {
        if (!this.curAnimation) {
            return;
        }

        if (gameTime - this.curAnimationFrameTime > ANIMATION_FRAME_SPEED_MS) {
            this.nextAnimationFrame(gameTime);
        }
    }
    /**
        * Increase the current animation frame and update the image based upon the sequence of images for the animation.
        * If the animation isn't looping, then finish the animation instead.
        */
    nextAnimationFrame(gameTime: number) {
        if (!this.curAnimation) {
            return;
        }

        const animationImages = this.curAnimation.getImages();

        this.curAnimationFrameTime = gameTime;
        this.curAnimationFrame++;
        if (this.curAnimationFrame >= animationImages.length) {
            if (!this.curAnimation.getLooping()) {
                this.finishAnimation();
                return;
            }

            this.curAnimationFrame = 0;
        }

        this.imageName = animationImages[this.curAnimationFrame];
    }

    /**
     * The current animation wasn't looping, so finish it by clearing out the current animation and firing the callback.
     */
    finishAnimation() {
        if (!this.curAnimation) {
            return;
        }

        const animationCallback = this.curAnimation.getCallback();
        this.curAnimation = null;

        if (animationCallback) {
            animationCallback.apply(null);
        }
    }
    /**
     * Set the state and then set a new current animation based upon that state.
     */
    setState(newState: SKIER_STATES) {
        this.state = newState;
        this.setAnimation();
    }

    /**
     * Set the current animation, reset to the beginning of the animation, and set the proper image to display.
     */
    setAnimation() {
        this.curAnimation = this.animations[this.state];
        if (!this.curAnimation) {
            return;
        }

        this.curAnimationFrame = 0;

        const animateImages = this.curAnimation.getImages();
        this.imageName = animateImages[this.curAnimationFrame];
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
        if (this.state === SKIER_STATES.JUMPING) {
            this.handleJumpingAnimation();
        } else if (this.isSkiing()) {
            this.move();
            this.checkIfHitObstacle();
        }
    }
    private handleJumpingAnimation() {
        if (this.curAnimation) {
            this.nextAnimationFrame(Date.now());
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
    * Make the skier jump by setting the state to jumping
    */
    jump() {
        if (this.isCrashed()) {
            return;
        }

        this.setState(SKIER_STATES.JUMPING);
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
                // Specifically calling out that we don't move the skier each frame if they're facing completely horizontal.
                // this.moveSkierLeft();
                break;
            case SKIER.DIRECTION.RIGHT:
                // Specifically calling out that we don't move the skier each frame if they're facing completely horizontal.
                // this.moveSkierRight();
                break;
        }
    }

    /**
     * Move the skier left. Since completely horizontal movement isn't frame based, just move incrementally based upon
     * the starting speed.
     */
    // moveSkierLeft() {
    //     this.position.x -= SKIER.STARTING_SPEED;
    // }

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
    // moveSkierRight() {
    //     this.position.x += SKIER.STARTING_SPEED;
    // }

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
            case KEYS.SPACE:
                this.jump();
                break;
            default:
                handled = false;
        }

        return handled;
    }

    /**
     * Handle Skier Jumping.
     */




    /**
     * Turn the skier left. If they're already completely facing left, move them left. Otherwise, change their direction
     * one step left. If they're in the crashed state, then first recover them from the crash.
     */
    turnLeft() {
        if (this.isCrashed()) {
            this.recoverFromCrash(SKIER.DIRECTION.LEFT);
        }

        if (this.direction === SKIER.DIRECTION.LEFT) {
            // this.moveSkierLeft();
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
            // this.moveSkierRight();
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

            // Check for intersection with jump ramp obstacle
            const isJumpRamp = obstacle.imageName === IMAGE_NAMES.JUMP_RAMP;
            if (isJumpRamp) {
                // Trigger skier's jump if intersecting with a jump ramp
                if (intersectTwoRects(skierBounds, obstacleBounds)) {
                    this.jump();
                    return false; // No crash when jumping on a ramp
                }
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

    setSkiingState() {
        this.state = SKIER_STATES.SKIING;
        this.curAnimationFrame = 0;
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
    die(): boolean {
        this.state = SKIER_STATES.DEAD;
        this.speed = 0;

        const gameOverEvent = new CustomEvent("GameOver");
        document.dispatchEvent(gameOverEvent);

        return true
    }
}
