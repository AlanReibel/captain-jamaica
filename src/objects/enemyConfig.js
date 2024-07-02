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
        speed: 50,
        health: 100,
        behavior: (scene, enemy) => {
            let worldView = scene.cameras.main.worldView;
            let bounds = {
                left: worldView.x + 50,
                right: worldView.x + worldView.width - 50
            };
            let speed = enemy.speed;

            enemy.move(enemy.focusTo);
            
            if (enemy.x < bounds.left) {
                // enemy.setVelocityX(enemy.body.velocity.x * -1);
                enemy.focusTo = 'right';
            }
            if (enemy.x > bounds.right) {
                // enemy.setVelocityX(enemy.body.velocity.x * -1);
                enemy.focusTo = 'left';
            }
            // Verificar los límites verticales
            if (enemy.y < worldView.y + 50 || enemy.y > worldView.y + worldView.height - 50) {
                enemy.setVelocityY(enemy.body.velocity.y * -1);
            }
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
        speed: 50,
        health: 100,
        behavior: (scene, enemy) => {

            let player = scene.player.sprite;
            let distance = 200;
            let isNear = Phaser.Math.Distance.BetweenPoints(player, enemy) <= distance;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);
            if( isNear ) {
                let direction = player.x < enemy.x ? 'left' : 'right';
                if(difference < 10 && difference > -10) {
                    enemy.stop();
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
            Idle: { frameWidth: 38, frameHeight: 34, frames: 4, frameRate: 12, repeat: -1 },
            Death: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: 0 },
            Attack: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: 0 },
            Hurt: { frameWidth: 38, frameHeight: 34, frames: 2, frameRate: 12, repeat: 0 },
            Walk: { frameWidth: 38, frameHeight: 34, frames: 6, frameRate: 12, repeat: -1 },
        },
        fly: false,
        speed: 50,
        health: 100,
        behavior: (scene, enemy) => {

            let player = scene.player.sprite;
            let treshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);
            if( isNear ) {
                let direction = player.x < enemy.x ? 'left' : 'right';
                if(difference < 10 && difference > -10) {
                    enemy.stop();
                } else {
                    if(distance <= 40) {
                        enemy.stop();
                        enemy.attack();
                    } else {
                        enemy.move(direction);
                    }
                }
            } else {
                enemy.stop();
            }



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
        speed: 50,
        health: 100,
        behavior: (scene, enemy) => {

            let player = scene.player.sprite;
            let treshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);
            if( isNear ) {
                let direction = player.x < enemy.x ? 'left' : 'right';
                if(difference < 10 && difference > -10) {
                    enemy.stop();
                } else {
                    if(distance <= 40) {
                        enemy.stop();
                        enemy.attack();
                    } else {
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
        fly: false,
        speed: 50,
        health: 100,
        behavior: (scene, enemy) => {

            let player = scene.player.sprite;
            let treshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);
            if( isNear ) {
                let direction = player.x < enemy.x ? 'left' : 'right';
                if(difference < 10 && difference > -10) {
                    enemy.stop();
                } else {
                    if(distance <= 40) {
                        enemy.stop();
                        enemy.attack();
                    } else {
                        enemy.move(direction);
                    }
                }
            } else {
                enemy.stop();
            }



        }
    },
};