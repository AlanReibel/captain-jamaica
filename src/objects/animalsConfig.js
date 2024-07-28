export const animals = {
    bird: {
        speed: 150,
        fly: true,
        animations: {
            Idle: { frameWidth: 24, frameHeight: 16, frames: 4, frameRate: 10, repeat: -1 },
            Walk: { frameWidth: 24, frameHeight: 16, frames: 6, frameRate: 18, repeat: -1 },
        },
        width: 16,
        height: 16,
        offSet: {
            x: 0,
            y: 2
        },
        behavior: (scene, animal) => {
            let { player } = scene;
            let { worldView } = scene.cameras.main;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 100;

            if (isNear) {
                animal.move(animal.focusTo, 'up');
            }

        }
    },
    mouse: {
        speed: 120,
        animations: {
            Idle: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 12, repeat: -1 },
            Walk: { frameWidth: 32, frameHeight: 32, frames: 6, frameRate: 18, repeat: -1 },
        },
        behavior: (scene, animal) => {
            let { player } = scene;
            let { worldView } = scene.cameras.main;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 50;

            if (isNear) {
                animal.move(animal.focusTo);
            } else {
                animal.stop();
            }

        }
    },
    rat: {
        speed: 130,
        animations: {
            Idle: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 14, repeat: -1 },
            Walk: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 24, repeat: -1 },
        },
        behavior: (scene, animal) => {
            let { player } = scene;
            let { worldView } = scene.cameras.main;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 100;

            if (isNear) {
                animal.move(animal.focusTo);
            } else {
                animal.stop();
            }

        }
    },
    scorpio: {
        speed: 50,
        animations: {
            Idle: { frameWidth: 48, frameHeight: 48, frames: 4, frameRate: 10, repeat: -1 },
            Walk: { frameWidth: 48, frameHeight: 48, frames: 4, frameRate: 10, repeat: -1 },
        },
        behavior: (scene, animal) => {
            let { player } = scene;
            let { worldView } = scene.cameras.main;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 40;

            if (isNear) {
                animal.move(animal.focusTo);
            } else {
                animal.stop();
            }

        }
    },
}