/**
 * The main game class. This initializes the game as well as runs the game/render loop and initial handling of input.
 */

import { GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT, IMAGES, DIRECTION } from "../Constants";
import { Canvas } from "./Canvas";
import { ImageManager } from "./ImageManager";
import { Position, Rect } from "./Utils";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rhino } from "../Entities/Rhino";
import { Skier } from "../Entities/Skier";

export class Game {
    /**
     * The canvas the game will be displayed on
     */
    private canvas!: Canvas;

    /**
     * Coordinates denoting the active rectangular space in the game world
     * */
    private gameWindow!: Rect;

    /**
     * Current game time
     */
    private gameTime: number = Date.now();

    private imageManager!: ImageManager;

    private obstacleManager!: ObstacleManager;

    /**
     * The skier player
     */
    private skier!: Skier;
    private gameEnded: boolean = false;

    /**
     * The enemy that chases the skier
     */
    private rhino!: Rhino;
    private score: number = 0;

    /**
     * Initialize the game and setup any input handling needed.
     */
    constructor() {
        this.init();
        this.setupInputHandling();
    }

    /**
     * Create all necessary game objects and initialize them as needed.
     */
    init() {
        this.canvas = new Canvas(GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT);
        this.imageManager = new ImageManager();
        this.obstacleManager = new ObstacleManager(this.imageManager, this.canvas);

        this.skier = new Skier(0, 0, this.imageManager, this.obstacleManager, this.canvas);
        this.rhino = new Rhino(-500, -2000, this.imageManager, this.canvas);

        this.calculateGameWindow();
        this.obstacleManager.placeInitialObstacles();
        this.drawStartInstructions();
    }
    /**
     * Allow user to manually start the game 
     */


    /**
     * Add instructions to player
     */
    drawStartInstructions() {
        this.canvas.ctx.fillStyle = "white";
        this.canvas.ctx.font = "24px Arial";
        this.canvas.ctx.fillText("Press any arrow key to start the game", 50, this.canvas.height / 2);
    }

    /**
     * Setup listeners for any input events we might need.
     * Allow user to manually start the game.
     */

    setupInputHandling() {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if (this.isGameRunning()) {
                // Handle skier movement and jump as usual
                if (event.key === " ") {
                    this.skier.jump();
                    event.preventDefault();
                } else {
                    let handled: boolean = this.skier.handleInput(event.key);
                    if (handled) {
                        event.preventDefault();
                    }
                }
            } else {
                // Start the game on any arrow key press
                if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    this.startGame();
                }
            }

            // Restart the game on 'R' key press if it has ended
            if (this.gameEnded && event.key === "r" || event.key === "R") {
                this.restartGame();
            }
        });
    }

    /**
     * Remove any start instructions or game over screen if present
     */
    startGame() {

        this.canvas.clearCanvas();

        // Initialize the game objects and start the game loop
        this.init();
        this.run();
    }

    /**
     * Check if the game is running based on the skier's state
     */
    isGameRunning(): boolean {

        return this.skier.isSkiing() || this.skier.isJumping();
    }

    /**
     * Load any assets we need for the game to run. Return a promise so that we can wait on something until all assets
     * are loaded before running the game.
     */
    async load(): Promise<void> {
        await this.imageManager.loadImages(IMAGES);
    }

    /**
     * The main game loop. Clear the screen, update the game objects and then draw them.
     */
    run() {
        this.canvas.clearCanvas();

        this.updateGameWindow();
        this.drawGameWindow();
        this.drawScore();

        requestAnimationFrame(this.run.bind(this));
    }
    drawScore() {
        this.canvas.ctx.fillStyle = "white";
        this.canvas.ctx.font = "24px Arial";
        this.canvas.ctx.fillText(`Score: ${this.score}`, 20, 40);
    }

    /**
     * Do any updates needed to the game objects
     */
    updateGameWindow() {
        this.gameTime = Date.now();

        const previousGameWindow: Rect = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        this.skier.update();
        this.rhino.update(this.gameTime, this.skier);
    }

    /**
     * Draw all entities to the screen, in the correct order. Also setup the canvas draw offset so that we see the
     * rectangular space denoted by the game window.
     */
    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

        this.skier.draw();
        this.rhino.draw();
        this.obstacleManager.drawObstacles();
    }

    /**
     * Calculate the game window (the rectangular space drawn to the screen). It's centered around the player and must
     * be updated since the player moves position.
     */
    calculateGameWindow() {
        const skierPosition: Position = this.skier.getPosition();
        const left: number = skierPosition.x - GAME_WIDTH / 2;
        const top: number = skierPosition.y - GAME_HEIGHT / 2;

        this.gameWindow = new Rect(left, top, left + GAME_WIDTH, top + GAME_HEIGHT);
    }

    /**
     * Handle keypresses and delegate to any game objects that might have key handling of their own.
     */
    handleKeyDown(event: KeyboardEvent) {
        if (this.gameEnded && event.key === "R") {
            this.restartGame();
        } else {
            if (event.key === " ") {
                this.skier.jump(); // Trigger the skier's jump
                event.preventDefault();
            } else {
                let handled: boolean = this.skier.handleInput(event.key);
                if (handled) {
                    event.preventDefault();
                }
            }
        }
    }

    restartGame() {
        this.score = 0;
        this.skier.resetPosition(); // You need to implement this method
        this.obstacleManager.placeInitialObstacles();
        this.gameEnded = false;
        this.score = 0; // Reset the score to 0
    }
}
