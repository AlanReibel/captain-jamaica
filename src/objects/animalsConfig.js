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

            switch (animal.movingDirectionX) {
                case 'left':
                    if (animal.body.blocked.left) {
                        animal.focusTo = 'right';
                    }
                    break;
                case 'right':
                    if (animal.body.blocked.right) {
                        animal.focusTo = 'left';
                    }
                    break;
                case 'none':
                    animal.movingDirectionX = animal.focusTo;
                    break;
            }

            if (isNear) {
                animal.move(animal.focusTo, 'up');
            }

        }
    },
    bat: {
        speed: 150,
        fly: true,
        animations: {
            Idle: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 8, repeat: -1 },
            Walk: { frameWidth: 32, frameHeight: 32, frames: 5, frameRate: 18, repeat: -1 },
        },
        // width: 16,
        // height: 16,
        // offSet: {
        //     x: 0,
        //     y: 2
        // },
        behavior: (scene, animal) => {

            let {worldView} = scene.cameras.main;
            let bounds = {
                left: worldView.x + 30,
                right: worldView.x + worldView.width - 30,
                top: worldView.y + 30,
                bottom: worldView.y + worldView.height - 50
            };


            let { player } = scene;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 100;

            if (animal.state === 'flying') {
                switch (animal.movingDirectionX) {
                    case 'left':
                        if (animal.body.blocked.left) {
                            animal.focusTo = 'right';
                            animal.movingDirectionX = 'right';
                        }
                        break;
                    case 'right':
                        if (animal.body.blocked.right) {
                            animal.focusTo = 'left';
                            animal.movingDirectionX = 'left';
                        }
                        break;
                    case 'none':
                        animal.movingDirectionX = animal.focusTo;
                        break;
                }
    
                switch (animal.movingDirectionY) {
                    case 'up':
                        if ( animal.body.blocked.up) {
                            animal.movingDirectionY = 'down';
                        }
                        break;
                    case 'down':
                        if (animal.y >= bounds.bottom || animal.body.blocked.down) {
                            animal.movingDirectionY = 'up';
                        }
                        break;
                }
                console.log('bat block',animal.body.blocked);
                console.log('bat block',animal.movingDirectionX, animal.movingDirectionY);
                animal.move(animal.movingDirectionX, animal.movingDirectionY);
            }


            if (isNear && animal.state === 'idle') {
                animal.move(animal.focusTo, 'down');
                animal.state = 'flying';
            }

        }
    },
    mouse: {
        speed: 120,
        animations: {
            Idle: { frameWidth: 20, frameHeight: 10, frames: 4, frameRate: 12, repeat: -1 },
            Walk: { frameWidth: 20, frameHeight: 10, frames: 6, frameRate: 18, repeat: -1 },
        },
        behavior: (scene, animal) => {
            let { player } = scene;
            let { worldView } = scene.cameras.main;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 50;

            switch (animal.movingDirectionX) {
                case 'left':
                    if (animal.body.blocked.left) {
                        animal.focusTo = 'right';
                    }
                    break;
                case 'right':
                    if (animal.body.blocked.right) {
                        animal.focusTo = 'left';
                    }
                    break;
                case 'none':
                    animal.movingDirectionX = animal.focusTo;
                    break;
            }

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
            Idle: { frameWidth: 26, frameHeight: 12, frames: 4, frameRate: 14, repeat: -1 },
            Walk: { frameWidth: 26, frameHeight: 12, frames: 4, frameRate: 24, repeat: -1 },
        },
        behavior: (scene, animal) => {
            let { player } = scene;
            let { worldView } = scene.cameras.main;
            let distance = Phaser.Math.Distance.BetweenPoints(player, animal);
            let isNear = distance <= 50;


            switch (animal.movingDirectionX) {
                case 'left':
                    if (animal.body.blocked.left) {
                        animal.focusTo = 'right';
                    }
                    break;
                case 'right':
                    if (animal.body.blocked.right) {
                        animal.focusTo = 'left';
                    }
                    break;
                case 'none':
                    animal.movingDirectionX = animal.focusTo;
                    break;
            }

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


            switch (animal.movingDirectionX) {
                case 'left':
                    if (animal.body.blocked.left) {
                        animal.focusTo = 'right';
                    }
                    break;
                case 'right':
                    if (animal.body.blocked.right) {
                        animal.focusTo = 'left';
                    }
                    break;
                case 'none':
                    animal.movingDirectionX = animal.focusTo;
                    break;
            }

            if (isNear) {
                animal.move(animal.focusTo);
            } else {
                animal.stop();
            }

        }
    },
}