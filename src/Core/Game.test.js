import { Game } from "./Game";
import { GAME_CANVAS, GAME_WIDTH, GAME_HEIGHT, IMAGES, IMAGE_NAMES, SKIER_STATES, KEYS } from "../Constants";
import { Canvas } from "./Canvas";
import { ImageManager } from "./ImageManager";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Skier } from "../Entities/Skier";
import { Rhino } from "../Entities/Rhino";

// Mocking canvas
jest.mock("./Canvas", () => {
    return {
        Canvas: jest.fn().mockImplementation(() => {
            return {
                clearCanvas: jest.fn(),
                setDrawOffset: jest.fn(),
                ctx: {
                    fillText: jest.fn(),
                    font: "",
                    fillStyle: "",
                },
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
            };
        }),
    };
});

// Mocking ImageManager
jest.mock("./ImageManager", () => {
    return {
        ImageManager: jest.fn().mockImplementation(() => {
            return {
                loadImages: jest.fn(),
            };
        }),
    };
});

// Mocking ObstacleManager
jest.mock("../Entities/Obstacles/ObstacleManager", () => {
    return {
        ObstacleManager: jest.fn().mockImplementation(() => {
            return {
                placeInitialObstacles: jest.fn(),
                placeNewObstacle: jest.fn(),
                drawObstacles: jest.fn(),
                obstacles: [],
            };
        }),
    };
});

// Mocking Skier
jest.mock("../Entities/Skier", () => {
    return {
        Skier: jest.fn().mockImplementation(() => {
            return {
                update: jest.fn(),
                draw: jest.fn(),
                jump: jest.fn(),
                handleInput: jest.fn(),
                getPosition: jest.fn(),
                isSkiing: jest.fn(),
                isJumping: jest.fn(),
                isStopped: jest.fn(),
            };
        }),
    };
});

// Mocking Rhino
jest.mock("../Entities/Rhino", () => {
    return {
        Rhino: jest.fn().mockImplementation(() => {
            return {
                update: jest.fn(),
                draw: jest.fn(),
            };
        }),
    };
});
//mocking constants
jest.mock("../Constants", () => {
    return {
        GAME_WIDTH: 800,
        GAME_HEIGHT: 600,
    };
});

describe("Game Class Tests", () => {
    let game;

    beforeEach(() => {
        game = new Game();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Game should initialize with default values", () => {
        expect(game.canvas).toBeInstanceOf(Canvas);
        expect(game.isGameRunning).toBe(false);
        expect(game.gameWindow).toBeUndefined();
        expect(game.gameTime).toBeGreaterThan(0);
        expect(game.imageManager).toBeInstanceOf(ImageManager);
        expect(game.obstacleManager).toBeInstanceOf(ObstacleManager);
        expect(game.skier).toBeInstanceOf(Skier);
        expect(game.rhino).toBeInstanceOf(Rhino);
        expect(game.skierSpeed).toBe(0);
        expect(game.skierDistance).toBe(0);
        expect(game.startTime).toBeGreaterThan(0);
        expect(game.skierStartPosition).toBeNull();
        expect(game.skierDistanceCovered).toBe(0);
        expect(game.firstObstaclePosition).toBeNull();
        expect(game.pixelsPerMeter).toBe(3780);
    });

    test("Game should handle keydown events", () => {
        const event = { key: "ArrowLeft", preventDefault: jest.fn() };
        game.isGameRunning = true;
        game.skier.handleInput.mockReturnValue(true);

        game.handleKeyDown(event);

        expect(game.skier.handleInput).toHaveBeenCalledWith("ArrowLeft");
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
