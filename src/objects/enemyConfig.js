export const enemies = {
    flyingRobot: {
        animations: {
            Idle: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 12, repeat: -1 },
            Death: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 12, repeat: 0 },
            Attack: { frameWidth: 32, frameHeight: 38, frames: 4, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 32, frameHeight: 32, frames: 2, frameRate: 12, repeat: 0 },
            Walk: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 12, repeat: -1 },
        },
        fly: true,
        speed: 100,
        health: 100,
        behavior: scene => {

            console.log('behavior', scene);
        }
    },
    weelRobot: {
        animations: {
            Idle: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 12, repeat: -1 },
            Death: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 12, repeat: 0 },
            Attack: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 32, frameHeight: 24, frames: 2, frameRate: 12, repeat: 0 },
            Walk: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 12, repeat: -1 },
        },
    },
    basebolHitter: {
        animations: {
            Idle: { frameWidth: 38, frameHeight: 34, frames: 4, frameRate: 12, repeat: -1 },
            Death: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: 0 },
            Attack: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 38, frameHeight: 34, frames: 2, frameRate: 12, repeat: 0 },
            Walk: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: -1 },
        },
        fly: false,
        speed: 100,
        health: 100,
        behavior: scene => {

            console.log('behavior', scene);
        }
    },
    mutantDog: {
        animations: {
            Idle: { frameWidth: 38, frameHeight: 40, frames: 4, frameRate: 12, repeat: -1 },
            Death: { frameWidth: 48, frameHeight: 40, frames: 6, frameRate: 12, repeat: 0 },
            Attack: { frameWidth: 38, frameHeight: 40, frames: 9, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 38, frameHeight: 40, frames: 2, frameRate: 12, repeat: 0 },
            Walk: { frameWidth: 38, frameHeight: 40, frames: 6, frameRate: 12, repeat: -1 },
        },
        fly: false,
        speed: 100,
        health: 100,
        behavior: scene => {

            console.log('behavior', scene);
        }
    },
    brainTank: {
        animations: {
            Idle: { frameWidth: 30, frameHeight: 34, frames: 4, frameRate: 12, repeat: -1 },
            Death: { frameWidth: 30, frameHeight: 34, frames: 4, frameRate: 12, repeat: 0 },
            Attack: { frameWidth: 30, frameHeight: 34, frames: 4, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 30, frameHeight: 34, frames: 2, frameRate: 12, repeat: 0 },
            Walk: { frameWidth: 30, frameHeight: 34, frames: 4, frameRate: 12, repeat: -1 },
        },
        fly: false,
        speed: 100,
        health: 100,
        behavior: scene => {

            console.log('behavior', scene);
        }
    },
};