const { Skier } = require("./Skier");
const { ImageManager } = require("../Core/ImageManager");
const { Canvas } = require("../Core/Canvas");
const { ObstacleManager } = require("./Obstacles/ObstacleManager");
const { SKIER_STATES, SKIER } = require("../Constants");

// Mocked dependencies
jest.mock("../Core/ImageManager");
jest.mock("../Core/Canvas");
jest.mock("./Obstacles/ObstacleManager");

describe("Skier Class Tests", () => {
    let skier;
    let imageManager;
    let canvas;
    let obstacleManager;

    beforeEach(() => {
        // Create mock instances for ImageManager, Canvas, and ObstacleManager
        imageManager = new ImageManager();
        canvas = new Canvas();
        obstacleManager = new ObstacleManager();

        // Create a new Skier instance before each test
        skier = new Skier(100, 200, imageManager, obstacleManager, canvas);

        // Reset mocked implementations
        ImageManager.mockClear();
        Canvas.mockClear();
        ObstacleManager.mockClear();
    });

    test("Skier should initialize with default properties", () => {
        expect(skier.imageName).toBe("skierDown");
        expect(skier.state).toBe(SKIER_STATES.SKIING);
        expect(skier.direction).toBe(SKIER.DIRECTION.DOWN);
        expect(skier.speed).toBe(SKIER.STARTING_SPEED);
        expect(skier.obstacleManager).toBe(obstacleManager);
        expect(skier.curAnimation).toBeNull();
        expect(skier.curAnimationFrame).toBe(0);
        expect(skier.curAnimationFrameTime).toBeGreaterThan(0);
    });

    test("Skier should set the state and animation properly", () => {
        skier.setState(SKIER_STATES.JUMPING);

        expect(skier.state).toBe(SKIER_STATES.JUMPING);
        expect(skier.curAnimation).not.toBeNull();
        expect(skier.curAnimationFrame).toBe(0);
    });

    test("Skier should turn left and change direction", () => {
        skier.turnLeft();

        expect(skier.direction).toBe(SKIER.DIRECTION.LEFT_DOWN);
    });

    test("Skier should turn right and change direction", () => {
        skier.turnRight();

        expect(skier.direction).toBe(SKIER.DIRECTION.RIGHT_DOWN);
    });
});
