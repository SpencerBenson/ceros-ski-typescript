import { Skier } from "./Skier";
import {
    IMAGE_NAMES,
    SKIER_STATES,
    KEYS,
    DIAGONAL_SPEED_REDUCER,
    IMAGES_SKIER_JUMPING,
    DIRECTION_IMAGES,
} from "../Constants";

describe("Skier Class Tests", () => {
    let skier;

    beforeEach(() => {
        skier = new Skier(0, 0 /* Add required dependencies/mock dependencies here */);
    });

    afterEach(() => {
        // Clean up or reset any necessary states after each test
    });

    test("Skier should initialize with default values", () => {
        expect(skier.imageName).toBe(IMAGE_NAMES.SKIER_DOWN);
        expect(skier.state).toBe(SKIER_STATES.SKIING);
        expect(skier.direction).toBe(SKIER.DIRECTION.DOWN);
        expect(skier.speed).toBe(SKIER.STARTING_SPEED);
    });

    test("Skier should change direction when turnLeft is called", () => {
        skier.turnLeft();
        expect(skier.direction).toBe(SKIER.DIRECTION.LEFT);
    });

    test("Skier should change direction when turnRight is called", () => {
        skier.turnRight();
        expect(skier.direction).toBe(SKIER.DIRECTION.RIGHT);
    });

    test("Skier should not change direction when turnUp is called in the skiing state", () => {
        skier.turnUp();
        expect(skier.direction).toBe(SKIER.DIRECTION.DOWN);
    });

    test("Skier should crash when colliding with an obstacle", () => {
        // Create a mock obstacle that should cause a collision
        const mockObstacle = {
            getBounds: () => {
                // Return obstacle bounds for collision
                return {
                    left: 10,
                    top: 10,
                    right: 20,
                    bottom: 20,
                };
            },
            imageName: IMAGE_NAMES.OBSTACLE, // Set to a valid obstacle image name
        };

        // Inject the mock obstacle into the skier's obstacleManager (mocked or real)
        skier.obstacleManager = {
            getObstacles: () => [mockObstacle], // Mocked method returning the mock obstacle
        };

        skier.checkIfHitObstacle();
        expect(skier.state).toBe(SKIER_STATES.CRASHED);
    });

    test("Skier should jump when jump is called", () => {
        skier.jump();
        expect(skier.state).toBe(SKIER_STATES.JUMPING);
    });

    // Add more test cases to cover additional functionality of the Skier class as needed
});
