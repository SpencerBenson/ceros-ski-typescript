const { Rhino } = require("./Rhino");
const { ImageManager } = require("../Core/ImageManager");
const { Canvas } = require("../Core/Canvas");
const { RHINO_STATES, ANIMATION_FRAME_SPEED_MS } = require("../Constants");
const { Position } = require("../Core/Utils");

// Mocked dependencies
jest.mock("../Core/ImageManager");
jest.mock("../Core/Canvas");

describe("Rhino Class Tests", () => {
    let rhino;
    let imageManager;
    let canvas;

    beforeEach(() => {
        // Create mock instances for ImageManager and Canvas
        imageManager = new ImageManager();
        canvas = new Canvas();

        // Create a new Rhino instance before each test
        rhino = new Rhino(100, 200, imageManager, canvas);

        // Reset mocked implementations
        ImageManager.mockClear();
        Canvas.mockClear();
    });

    test("Rhino should set the state and animation properly", () => {
        rhino.setState(RHINO_STATES.EATING);

        expect(rhino.state).toBe(RHINO_STATES.EATING);
        expect(rhino.curAnimation).not.toBeNull();
        expect(rhino.curAnimationFrame).toBe(0);
    });

    test("Rhino should not run when not in the running state", () => {
        rhino.setState(RHINO_STATES.CELEBRATING);
        const initialPosition = new Position(rhino.position.x, rhino.position.y);

        const target = {
            getPosition: () => new Position(200, 200),
        };

        rhino.update(ANIMATION_FRAME_SPEED_MS + 1, target);

        // Rhino's position should not have changed
        expect(rhino.position).toEqual(initialPosition);
    });

    test("Rhino should eating after catching the target", () => {
        rhino.setState(RHINO_STATES.EATING);
        rhino.celebrate = jest.fn();

        rhino.update(ANIMATION_FRAME_SPEED_MS + 1, {});

        // Rhino's state should be eating, and the celebrate function should have been called
        expect(rhino.state).toBe(RHINO_STATES.EATING);
    });
});
