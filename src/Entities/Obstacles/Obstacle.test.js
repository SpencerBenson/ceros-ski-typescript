const { Obstacle } = require("./Obstacle");
const { ImageManager } = require("../../Core/ImageManager");
const { Canvas } = require("../../Core/Canvas");
const { IMAGE_NAMES } = require("../../Constants");

// Mocked dependencies
jest.mock("../../Core/ImageManager");
jest.mock("../../Core/Canvas");

describe("Obstacle Class Tests", () => {
    let obstacle;
    let imageManager;
    let canvas;

    beforeEach(() => {
        // Create mock instances for ImageManager and Canvas
        imageManager = new ImageManager();
        canvas = new Canvas();

        // Create a new Obstacle instance before each test
        obstacle = new Obstacle(100, 200, imageManager, canvas);

        // Reset mocked implementations
        ImageManager.mockClear();
        Canvas.mockClear();
    });

    test("Obstacle should initialize with a random obstacle type", () => {
        // Ensure imageName is one of the predefined IMAGE_NAMES
        expect(Object.values(IMAGE_NAMES)).toContain(obstacle.imageName);
    });
});
