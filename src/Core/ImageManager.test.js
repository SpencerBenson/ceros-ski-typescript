const { ImageManager } = require("./ImageManager");
const { IMAGE_NAMES } = require("../Constants");

describe("ImageManager Class Tests", () => {
    let imageManager;

    beforeEach(() => {
        // Create a new ImageManager instance before each test
        imageManager = new ImageManager();
    });

    test("ImageManager should initialize with an empty loadedImages object", () => {
        expect(imageManager.loadedImages).toEqual({});
    });

    test("ImageManager should return undefined for non-existent images", () => {
        const nonExistentImage = imageManager.getImage("NonExistentImage");
        expect(nonExistentImage).toBeUndefined();
    });
});
