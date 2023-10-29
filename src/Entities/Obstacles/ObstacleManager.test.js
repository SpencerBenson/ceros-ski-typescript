const { ObstacleManager } = require("./ObstacleManager");
const { ImageManager } = require("../../Core/ImageManager");
const { Canvas } = require("../../Core/Canvas");
const { Rect, Position } = require("../../Core/Utils");

// Mocked dependencies
jest.mock("../../Core/ImageManager");
jest.mock("../../Core/Canvas");

describe("ObstacleManager Class Tests", () => {
    let obstacleManager;
    let imageManager;
    let canvas;

    beforeEach(() => {
        // Create mock instances for ImageManager and Canvas
        imageManager = new ImageManager();
        canvas = new Canvas();

        // Create a new ObstacleManager instance before each test
        obstacleManager = new ObstacleManager(imageManager, canvas);

        // Reset mocked implementations
        ImageManager.mockClear();
        Canvas.mockClear();
    });

    test("ObstacleManager should initialize with an empty obstacles array", () => {
        expect(obstacleManager.obstacles).toEqual([]);
    });

    test("ObstacleManager should not place new obstacles if random chance is not met", () => {
        // Mock game windows
        const previousGameWindow = new Rect(0, 0, 800, 600);
        const gameWindow = new Rect(50, 0, 850, 600);

        // Mock randomInt to return a value that doesn't meet the chance
        obstacleManager.randomInt = jest.fn(() => 2);

        // Mock placeObstacleRight
        obstacleManager.placeObstacleRight = jest.fn();

        // Place new obstacles based on the game window change
        obstacleManager.placeNewObstacle(gameWindow, previousGameWindow);

        // Ensure placeObstacleRight was not called when chance is not met
        expect(obstacleManager.placeObstacleRight).not.toHaveBeenCalled();
    });
});
