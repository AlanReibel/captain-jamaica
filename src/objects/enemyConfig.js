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
        behavior: null
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
};