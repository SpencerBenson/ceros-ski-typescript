import { iImage } from "./Interfaces/iImage";

export const GAME_CANVAS = "skiCanvas";
export const GAME_WIDTH = window.innerWidth;
export const GAME_HEIGHT = window.innerHeight;

export enum KEYS {
    LEFT = "ArrowLeft",
    RIGHT = "ArrowRight",
    UP = "ArrowUp",
    DOWN = "ArrowDown",
}

export enum IMAGE_NAMES {
    SKIER_CRASH = "skierCrash",
    SKIER_LEFT = "skierLeft",
    SKIER_LEFTDOWN = "skierLeftDown",
    SKIER_DOWN = "skierDown",
    SKIER_RIGHTDOWN = "skierRightDown",
    SKIER_RIGHT = "skierRight",
    TREE = "tree",
    TREE_CLUSTER = "treeCluster",
    ROCK1 = "rock1",
    ROCK2 = "rock2",
    RHINO = "rhino",
    RHINO_RUN1 = "rhinoRun1",
    RHINO_RUN2 = "rhinoRun2",
    RHINO_EAT1 = "rhinoEat1",
    RHINO_EAT2 = "rhinoEat2",
    RHINO_EAT3 = "rhinoEat3",
    RHINO_EAT4 = "rhinoEat4",
    RHINO_CELEBRATE1 = "rhinoCelebrate1",
    RHINO_CELEBRATE2 = "rhinoCelebrate2",
    SKIER_JUMP1 = "skier_jump1",
    SKIER_JUMP2 = "skier_jump2",
    SKIER_JUMP3 = "skier_jump3",
    SKIER_JUMP4 = "skier_jump4",
    SKIER_JUMP5 = "skier_jump5",
}

export const IMAGES: iImage[] = [
    { name: IMAGE_NAMES.SKIER_CRASH, url: "img/skier_crash.png" },
    { name: IMAGE_NAMES.SKIER_LEFT, url: "img/skier_left.png" },
    { name: IMAGE_NAMES.SKIER_LEFTDOWN, url: "img/skier_left_down.png" },
    { name: IMAGE_NAMES.SKIER_DOWN, url: "img/skier_down.png" },
    { name: IMAGE_NAMES.SKIER_RIGHTDOWN, url: "img/skier_right_down.png" },
    { name: IMAGE_NAMES.SKIER_RIGHT, url: "img/skier_right.png" },
    { name: IMAGE_NAMES.TREE, url: "img/tree_1.png" },
    { name: IMAGE_NAMES.TREE_CLUSTER, url: "img/tree_cluster.png" },
    { name: IMAGE_NAMES.ROCK1, url: "img/rock_1.png" },
    { name: IMAGE_NAMES.ROCK2, url: "img/rock_2.png" },
    { name: IMAGE_NAMES.RHINO, url: "img/rhino_default.png" },
    { name: IMAGE_NAMES.RHINO_RUN1, url: "img/rhino_run_left.png" },
    { name: IMAGE_NAMES.RHINO_RUN2, url: "img/rhino_run_left_2.png" },
    { name: IMAGE_NAMES.RHINO_EAT1, url: "img/rhino_eat_1.png" },
    { name: IMAGE_NAMES.RHINO_EAT2, url: "img/rhino_eat_2.png" },
    { name: IMAGE_NAMES.RHINO_EAT3, url: "img/rhino_eat_3.png" },
    { name: IMAGE_NAMES.RHINO_EAT4, url: "img/rhino_eat_4.png" },
    { name: IMAGE_NAMES.RHINO_CELEBRATE1, url: "img/rhino_celebrate_1.png" },
    { name: IMAGE_NAMES.RHINO_CELEBRATE2, url: "img/rhino_celebrate_2.png" },
    { name: IMAGE_NAMES.SKIER_JUMP1, url: "img/skier_jump_1.png" },
    { name: IMAGE_NAMES.SKIER_JUMP2, url: "img/skier_jump_2.png" },
    { name: IMAGE_NAMES.SKIER_JUMP3, url: "img/skier_jump_3.png" },
    { name: IMAGE_NAMES.SKIER_JUMP4, url: "img/skier_jump_4.png" },
    { name: IMAGE_NAMES.SKIER_JUMP5, url: "img/skier_jump_5.png" },
];
export enum STATES {
    STATE_SKIING = "skiing",
    STATE_CRASHED = "crashed",
    STATE_DEAD = "dead",
    STATE_JUMPING = "skierJumping",
}

export enum DIRECTION {

    LEFT = 0,
    LEFT_DOWN = 1,
    DOWN = 2,
    RIGHT_DOWN = 3,
    RIGHT = 4,
}
export const DIRECTION_IMAGES: { [key: number]: IMAGE_NAMES } = {
    [DIRECTION.LEFT]: IMAGE_NAMES.SKIER_LEFT,
    [DIRECTION.LEFT_DOWN]: IMAGE_NAMES.SKIER_LEFTDOWN,
    [DIRECTION.DOWN]: IMAGE_NAMES.SKIER_DOWN,
    [DIRECTION.RIGHT_DOWN]: IMAGE_NAMES.SKIER_RIGHTDOWN,
    [DIRECTION.RIGHT]: IMAGE_NAMES.SKIER_RIGHT,
};

export const ANIMATION_FRAME_SPEED_MS: number = 250;
export const DIAGONAL_SPEED_REDUCER: number = 1.4142;

/**
 * The rhino starts running at this speed. Saved in case speed needs to be reset at any point.
 */
export const RHINO_STARTING_SPEED: number = 8;

/**
 * The different states the rhino can be in.
 */
export enum RHINO_STATES {
    RUNNING = "running",
    EATING = "eating",
    CELEBRATING = "celebrating",
}

/**
 * Sequences of images that comprise the animations for the different states of the rhino.
 */
export const IMAGES_RHINO_RUNNING: IMAGE_NAMES[] = [IMAGE_NAMES.RHINO_RUN1, IMAGE_NAMES.RHINO_RUN2];
export const IMAGES_RHINO_EATING: IMAGE_NAMES[] = [
    IMAGE_NAMES.RHINO_EAT1,
    IMAGE_NAMES.RHINO_EAT2,
    IMAGE_NAMES.RHINO_EAT3,
    IMAGE_NAMES.RHINO_EAT4,
];
export const IMAGES_RHINO_CELEBRATING: IMAGE_NAMES[] = [IMAGE_NAMES.RHINO_CELEBRATE1, IMAGE_NAMES.RHINO_CELEBRATE2];
export const JUMP_FRAMES = [
    { x: 0, y: -20 },
    { x: 0, y: -40 },
];

/**
 * The different states the skier can be in.
 */
export enum SKIER_STATES {
    SKIING = "skiing",
    CRASHED = "crashed",
    DEAD = "dead",
    JUMPING = "skierJumping",
}
export const SKIER = <const>{
    STARTING_SPEED: 10, //The skier starts running at this speed. Saved in case speed needs to be reset at any point.

    DIRECTION: { //The different directions the skier can be facing.
        LEFT: 0,
        LEFT_DOWN: 1,
        DOWN: 2,
        RIGHT_DOWN: 3,
        RIGHT: 4,
    }
}