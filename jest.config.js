/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
};
