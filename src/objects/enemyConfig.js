export const enemies = {
    flyingRobot: {
        animations: {
            Idle: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 10, repeat: -1 },
            Death: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 8, repeat: 0 },
            Attack: { frameWidth: 32, frameHeight: 38, frames: 4, frameRate: 10, repeat: 0 },
            Hurt: { frameWidth: 32, frameHeight: 32, frames: 2, frameRate: 8, repeat: 0 },
            Walk: { frameWidth: 32, frameHeight: 32, frames: 4, frameRate: 10, repeat: -1 },
        },
        damage: 5,
        fly: true,
        speed: 50,
        health: 50,
        behavior: (scene, enemy) => {
            let {player} = scene;
            let {worldView} = scene.cameras.main;
            let bounds = {
                left: worldView.x + 30,
                right: worldView.x + worldView.width - 30,
                top: worldView.y + 30,
                bottom: worldView.y + worldView.height - 30
            };

            let attackDistance = 30;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= attackDistance;
            let limitHeight = player.y - (player.height / 2);

            switch (enemy.movingDirectionX) {
                case 'left':
                    if (enemy.x <= bounds.left || enemy.body.blocked.left) {
                        enemy.focusTo = 'right';
                        enemy.movingDirectionX = 'right';
                    }
                    break;
                case 'right':
                    if (enemy.x >= bounds.right || enemy.body.blocked.right) {
                        enemy.focusTo = 'left';
                        enemy.movingDirectionX = 'left';
                    }
                    break;
            }

            switch (enemy.movingDirectionY) {
                case 'up':
                    if (enemy.y <= bounds.top || enemy.body.blocked.up) {
                        let playerSide = player.x < enemy.x ? 'left' : 'right';
                        enemy.movingDirectionY = 'none';
                        enemy.movingDirectionX = playerSide;
                        enemy.attackDone = false;
                    }
                    break;
                case 'down':

                    if (isNear) {

                        enemy.stop();
                        enemy.attack();
                    }

                    if (enemy.y >= bounds.bottom || enemy.y >= limitHeight || enemy.body.blocked.down) {
                        enemy.movingDirectionY = 'up';
                        enemy.movingDirectionX = enemy.focusTo;
                    }

                    if (enemy.attackDone) {
                        enemy.movingDirectionY = 'up';
                    }

                    break;
                case 'none':
                    if (!enemy.attackDone) {

                        if (player.x - enemy.x < 20 && // is over the player
                            player.x - enemy.x > - 20) {
                            enemy.movingDirectionY = 'down';
                            enemy.movingDirectionX = 'none';
    
                        } 
                    }
                    break
            }



            enemy.move(enemy.movingDirectionX, enemy.movingDirectionY);
            

        }
    },
    weelRobot: {
        animations: {
            Idle: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 10, repeat: -1 },
            Death: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 8, repeat: 0 },
            Attack: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 10, repeat: 0 },
            Hurt: { frameWidth: 32, frameHeight: 24, frames: 2, frameRate: 8, repeat: 0 },
            Walk: { frameWidth: 32, frameHeight: 24, frames: 4, frameRate: 10, repeat: -1 },
        },
        damage: 5,
        speed: 50,
        health: 50,
        behavior: (scene, enemy) => {

            let player = scene.player;
            let threshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= threshhold;
            let direction = player.x < enemy.x ? 'left' : 'right';
            let soNear = player.focusTo === direction
                ? distance <= 20
                : distance <= 25;
            let goFar = player.focusTo === direction
                ? distance <= 15
                : distance <= 20;
            let isOver = (player.x - enemy.x <= 10 && player.x - enemy.x >= -10) && (player.y - enemy.y >= 30 || player.y - enemy.y <= -30);

            if (isNear && !isOver) {
                if (goFar) {
                    direction = direction === 'left' ? 'right' : 'left';
                    enemy.move(direction);
                } else if (soNear) {
                    enemy.stop();
                    enemy.attack();
                } else {
                    enemy.move(direction);
                }
            } else {
                enemy.stop();
            }
        }
    },
    basebolHitter: {
        animations: {
            Idle: { frameWidth: 38, frameHeight: 34, frames: 4, frameRate: 10, repeat: -1 },
            Death: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 8, repeat: 0 },
            Attack: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 38, frameHeight: 34, frames: 2, frameRate: 8, repeat: 0 },
            Walk: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 10, repeat: -1 },
        },
        damage: 10,
        fly: false,
        speed: 50,
        health: 75,
        behavior: (scene, enemy) => {

            let player = scene.player;
            let treshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let isOver = (player.x - enemy.x <= 10 && player.x - enemy.x >= -10) && (player.y - enemy.y >= 30 || player.y - enemy.y <= -30);

            if (isNear && !isOver) {
                let direction = player.x < enemy.x ? 'left' : 'right';
                if (distance <= 20) {
                    enemy.stop();
                    enemy.attack();

                } else {
                    enemy.move(direction);
                }

            } else {
                enemy.stop();
            }



        }
    },
    mutantDog: {
        animations: {
            Idle: { frameWidth: 38, frameHeight: 40, frames: 4, frameRate: 10, repeat: -1 },
            Death: { frameWidth: 48, frameHeight: 40, frames: 6, frameRate: 8, repeat: 0 },
            Attack: { frameWidth: 38, frameHeight: 40, frames: 5, frameRate: 9, repeat: 0 },
            Hurt: { frameWidth: 38, frameHeight: 40, frames: 2, frameRate: 8, repeat: 0 },
            Walk: { frameWidth: 38, frameHeight: 40, frames: 6, frameRate: 10, repeat: -1 },
        },
        shot: true,
        fly: false,
        speed: 50,
        health: 100,
        bulletImage: 'ball2',
        bulletDamage: 15,
        behavior: (scene, enemy) => {

            let player = scene.player;
            let treshhold = 150;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let playerAtLeftSide = Phaser.Math.CeilTo(player.x) < Phaser.Math.CeilTo(enemy.x);
            let direction;

            if (playerAtLeftSide) {
                enemy.focusTo = 'left';
            } else {
                enemy.focusTo = 'right';
            }

            // console.log('difference',difference);
            if (isNear) {

                if (distance <= 30) {
                    direction = playerAtLeftSide ? 'right' : 'left';
                    enemy.move(direction);

                } else {
                    if(
                        (enemy.focusTo === 'left' && playerAtLeftSide) ||
                        (enemy.focusTo === 'right' && !playerAtLeftSide)
                    ) {
                        enemy.stop();
                        enemy.attack();
                    } else {
                        direction = playerAtLeftSide ? 'right' : 'left';
                        enemy.move(direction);
                    }
                }

            } else {
                enemy.stop();
            }

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
        shot: true,
        fly: false,
        speed: 30,
        health: 150,
        bulletImage: 'ball1',
        bulletDamage: 25,
        behavior: (scene, enemy) => {

            let player = scene.player;
            let treshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let playerAtLeftSide = Phaser.Math.CeilTo(player.x) < Phaser.Math.CeilTo(enemy.x);

            if (playerAtLeftSide) {
                enemy.focusTo = 'left';
            } else {
                enemy.focusTo = 'right';
            }

            // console.log('difference',difference);
            if (isNear) {

                if (distance <= 30) {
                    let direction = playerAtLeftSide ? 'right' : 'left';
                    enemy.move(direction);

                } else {
                    enemy.stop();
                    enemy.attack();
                }

            } else {
                enemy.stop();
            }

        }
    },
};