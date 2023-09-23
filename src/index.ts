/**
 * The entry point for the game. Creates the game, kicks off any loading that's needed and then starts the game running.
 */

import "../css/game.css";
import { Game } from "./Core/Game";

let skiGame: Game;

async function startGame() {
    const skiGame: Game = new Game();
    await skiGame.load();
    skiGame.run();
}

document.addEventListener("DOMContentLoaded", async () => {
    startGame();
});
document.addEventListener("GameOver", async () => {
    skiGame.stop();
    startGame();
})
document.addEventListener("GameOver", () => {
    // Clean up the old game 
    if (skiGame) {
        skiGame.cleanup();
    }
    setTimeout(() => {
        startGame(); // Start a new game when "GameOver" occurs
    }, 5000);
});

