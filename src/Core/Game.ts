/**
 * The main game class. This initializes the game as well as runs the game/render loop and initial handling of input.
 */

import { GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT, IMAGES } from "../Constants";
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
     * Check whether game is in progress
     */
    isGameRunning: boolean = false;
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

    /**
     * The enemy that chases the skier
     */
    private rhino!: Rhino;
    /**
     * The skier speed
     */
    private skierSpeed: number = 0;
    /**
     * The total distance covered by the skier
     */
    private skierDistance: number = 0;
    /**
     * Initialize the game and setup any input handling needed.
     */

    private startTime: number = Date.now(); // Store the time when the game starts
    private skierStartPosition: Position | null = null; // Store the skier's initial position
    private skierDistanceCovered: number = 0; // Store the total distance covered by the skier
    private firstObstaclePosition: Position | null = null;
    private pixelsPerMeter = 3780;



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

        // Store the skier's initial position
        this.skierStartPosition = this.skier.getPosition();

        // Initialize startTime here
        this.startTime = Date.now();

        this.calculateGameWindow();
        this.obstacleManager.placeInitialObstacles();
        this.drawStartInstructions();
    }


    /**
 * Add instructions to the player and start the game when any arrow key is pressed.
 */
    drawStartInstructions() {
        // Display game instructions
        this.canvas.ctx.font = "bold 24px Arial";
        const gameName = "Ceros Ski Game";
        const startInstrictions = "Press any arrow key to start the game.";
        const instructionsTitle = "Instructions:";
        let instructions: string[] = [
            "Use the arrow keys to control the direction of the skier.",
            "Press the spacebar to jump.",
            "The skier will jump over a jump ramp automatically.",
            "Wait 5 seconds after the game ends for instructions on how to start another game.",
            "You can only jump over rocks but not the trees.",
            "The rhino will catch up with you if you fall or are slow.",
            "Your speed and distance will be calculated in the top left of the screen."
        ];
        let counter = 30;
        let startPositionX = this.canvas.width / 3;
        let startPositionY = this.canvas.height / 3;
        let positionY = startPositionY + 90;

        this.canvas.ctx.fillText(gameName, startPositionX, startPositionY);
        this.canvas.ctx.font = "18px Arial";
        this.canvas.ctx.fillText(startInstrictions, startPositionX + 30, startPositionY + 30);

        this.canvas.ctx.font = "bold 20px Arial";
        this.canvas.ctx.fillText(instructionsTitle, startPositionX + 10, startPositionY + 60);
        this.canvas.ctx.font = "18px Arial";
        for (let i = 0; i < instructions.length; i++) {
            this.canvas.ctx.fillText(`${i + 1}. ${instructions[i]}`, startPositionX + 30, positionY);

            positionY += counter
        }



        // Listen for arrow key presses to start the game
        const startGameListener = (event: KeyboardEvent) => {
            if (event.key.startsWith("Arrow")) {
                this.isGameRunning = true; // Start the game loop when an arrow key is pressed
                document.removeEventListener("keydown", startGameListener); // Remove the event listener
            }
        };

        document.addEventListener("keydown", startGameListener);
    }


    /**
     * Stop the game
     */
    stop() {
        this.isGameRunning = false;
    }

    /**
     * Setup listeners for any input events we might need.
     */
    setupInputHandling() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
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
        if (!this.isGameRunning) {
            this.canvas.clearCanvas();
            this.drawStartInstructions(); // Display start instructions
        } else {
            this.canvas.clearCanvas();
            this.updateGameWindow(); // Call the updateGameWindow function
            this.drawGameWindow();
        }

        requestAnimationFrame(this.run.bind(this));
    }

    /**
/**
 * Do any updates needed to the game objects
 */
    updateGameWindow() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.startTime;

        if (this.skier.isSkiing()) {
            // Calculate the distance covered based on the skier's position change
            const currentPosition = this.skier.getPosition();
            if (this.skierStartPosition) {
                const deltaX = currentPosition.x - this.skierStartPosition.x;
                const deltaY = currentPosition.y - this.skierStartPosition.y;

                this.skierDistanceCovered += Math.sqrt(deltaX * deltaX / this.pixelsPerMeter + deltaY * deltaY / this.pixelsPerMeter);
            }

            // Calculate the skier's speed (distance covered / time)
            this.skierSpeed = this.skierDistanceCovered / (deltaTime / 1000);
        }
        // Speed when skier stops
        if (!this.skier.isSkiing() && !this.skier.isJumping()) {
            this.skierSpeed = 0
        }

        this.gameTime = currentTime;

        const previousGameWindow: Rect = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        // Check if the first obstacle is rendered
        if (!this.firstObstaclePosition && this.obstacleManager.obstacles.length > 0) {
            this.firstObstaclePosition = this.obstacleManager.obstacles[0].getPosition();
        }

        // Calculate the distance covered based on the skier's position relative to the first rendered obstacle
        if (this.firstObstaclePosition) {
            const currentPosition = this.skier.getPosition();
            const deltaX = currentPosition.x - this.firstObstaclePosition.x;
            const deltaY = currentPosition.y - this.firstObstaclePosition.y;
            this.skierDistanceCovered = Math.sqrt(deltaX * deltaX / this.pixelsPerMeter + deltaY * deltaY / this.pixelsPerMeter);

            // Calculate the skier's speed (distance covered / time)
            // Speed when skier stops
            if (!this.skier.isStopped()) {
                this.skierSpeed = this.skierDistanceCovered / (deltaTime / 1000);
            } else {
                this.skierSpeed = 0;
            }
        }

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

        // Display skier's distance and speed
        this.canvas.ctx.font = "18px Arial";
        this.canvas.ctx.fillStyle = "black"; // Change text color to white
        this.canvas.ctx.fillText(`Distance: ${this.skierDistanceCovered.toFixed(0)
            } meters`, 20, 60);
        this.canvas.ctx.fillText(`Speed: ${this.skierSpeed.toFixed(1)} m / s`, 20, 90);
    }




    /**
     * Calculate the game window (the rectangular space drawn to the screen). It's centered around the player and must
     * be updated since the player moves position.
     */
    calculateGameWindow() {
        const skierPosition: Position = this.skier.getPosition();
        const left: number = skierPosition.x - GAME_WIDTH / 2;
        const top: number = skierPosition.y - GAME_HEIGHT / 3;

        this.gameWindow = new Rect(left, top, left + GAME_WIDTH, top + GAME_HEIGHT);
    }

    /**
     * Handle keypresses and delegate to any game objects that might have key handling of their own.
     */
    handleKeyDown(event: KeyboardEvent) {
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

    cleanup() {
        this.init()
    }

}
