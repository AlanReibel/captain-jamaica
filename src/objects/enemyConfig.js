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
            let player = scene.player;
            let worldView = scene.cameras.main.worldView;
            let bounds = {
                left: worldView.x + 30,
                right: worldView.x + worldView.width - 30
            };
            let distance = 50;
            let isNear = Phaser.Math.Distance.BetweenPoints(player, enemy) <= distance;
            let limitHeight = player.y - (player.height / 2);
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
            if (enemy.y < worldView.y + 30 || enemy.y > worldView.y + worldView.height - 30) {
                enemy.setVelocityY(0);
                enemy.movingDirectionY = 'none';
            }

            // go down
            if(
                player.x - enemy.x < 20 && // is over the player
                player.x - enemy.x > - 20 && // is over the player
                !enemy.attackDone && // pending attack
                enemy.y < limitHeight && // is higher than player
                enemy.movingDirectionY !== 'up'
            ) {
                enemy.movingDirectionY = 'down';
                enemy.setVelocityY(120);
                enemy.setVelocityX(0);
            }

            // attack
            if(isNear && !enemy.attackDone) {
                enemy.stop();
                enemy.attack();
            }

            // go up
            if(enemy.attackDone) {
                //attack is done
                if(
                    enemy.y - enemy.startPosition.y > 10 &&
                    enemy.y - enemy.startPosition.y < -10 
                ) {
                    enemy.movingDirectionY = 'up';
                    enemy.setVelocityY(-80);
                } else {
                    enemy.attackDone = false;
                }
            } else {
                //attack is pending
                if(enemy.y >= limitHeight && enemy.y > enemy.startPosition.y) {
                    enemy.movingDirectionY = 'up';

                    enemy.setVelocityY(-80);

                }
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

            let player = scene.player;
            let distance = 200;
            let isNear = Phaser.Math.Distance.BetweenPoints(player, enemy) <= distance;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);
            if( isNear ) {
                let direction = player.x < enemy.x ? 'left' : 'right';
                if(difference < 10 && difference > -10) {
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

            let player = scene.player;
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
        shot: true,
        fly: false,
        speed: 50,
        health: 100,
        bulletImage: 'ball2',
        bulletDamage: 10,
        behavior: (scene, enemy) => {

            let player = scene.player;
            let treshhold = 150;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);

            if(difference < 0) {
                enemy.focusTo = 'left';
            } else {
                enemy.focusTo = 'right';
            }
            // console.log('difference',difference);
            if( isNear) {
                
                if(distance >= 150) {
                    
                    let direction = player.x < enemy.x ? 'left' : 'right';
                    if(difference <= 40 || difference >= -40) {
                        enemy.stop();
                    } else {
                        enemy.move(direction);
                    }

                } else {
                    enemy.stop();
                    enemy.attack();
                    enemy.fire(scene)
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
        bulletDamage: 20,
        behavior: (scene, enemy) => {

            let player = scene.player;
            let treshhold = 200;
            let distance = Phaser.Math.Distance.BetweenPoints(player, enemy);
            let isNear = distance <= treshhold;
            let difference = Phaser.Math.CeilTo(player.x) - Phaser.Math.CeilTo(enemy.x);

            if(difference < 0) {
                enemy.focusTo = 'left';
            } else {
                enemy.focusTo = 'right';
            }
            // console.log('difference',difference);
            if( isNear) {
                
                if(distance >= 150) {
                    let direction = player.x < enemy.x ? 'left' : 'right';
                    enemy.move(direction);
                } else {
                    enemy.stop();
                    enemy.attack();
                    enemy.fire(scene);
                }

            } else {
                enemy.stop();
            }

        }
    },
};