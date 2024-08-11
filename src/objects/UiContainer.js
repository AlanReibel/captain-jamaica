export class UiContainer extends Phaser.GameObjects.Container {
    
    gamewidth;
    healthBar;

    powerBar;
    powerbarBackground
    
    specialMarker;

    constructor( scene, x, y, gamewidth) {

        super(scene, x, y);
        this.scene = scene;
        this.player = scene.player;
        this.scene.add.existing(this);
        this.setScrollFactor(0)
            .setDepth(6);
        
        this.gamewidth = gamewidth;

        this.addHealthBar();
        this.addPowerBar(gamewidth);
        this.addSpecialUI(gamewidth / 2);
        this.addAmmoUI(gamewidth / 2);

    }

    addHealthBar() {

        let health = this.player.health;
        let healthbarBackground = this.scene.add.graphics();

        let x = 10;
        let y = 10;

        healthbarBackground
            .fillStyle(0x000000, 1)
            .setAlpha(0.3)
            .fillRect(x, y, health, 15);

        this.healthBar = this.scene.add.graphics();
        this.healthBar
            .fillStyle(0x00c749, 1)
            .fillRect(x, y, health, 15);

        this.add(healthbarBackground);
        this.add(this.healthBar);

        let healthIcon = this.scene.add.image(x + 2, y + 1, 'healthIcon')
            .setOrigin(0);
        this.add(healthIcon);

    }

    addPowerBar(width) {

        let power = this.player.power;
        this.powerbarBackground = this.scene.add.graphics();

        let x = width - 10 - power;
        let y = 10;

        this.powerbarBackground
            .fillStyle(0x000000, 1)
            .setAlpha(0.3)
            .fillRect(x, y, power, 15);

        this.powerBar = this.scene.add.graphics();
        this.powerBar
            .fillStyle(0xfbe900, 1)
            .fillRect(x, y, power, 15);

        this.powerBar.position = x;
        this.add(this.powerbarBackground);
        this.add(this.powerBar);

        let powerIcon = this.scene.add.image(x + 2, y + 1, 'powerIcon')
            .setOrigin(0);
        this.add(powerIcon);

    }

    addSpecialUI(midle) {
        let x = midle - 20;
        this.specialMarker = this.scene.add.image(x, 20, 'specialMarker');
        this.specialMarker.setScale(0.4);
        this.specialMarker.setOrigin(0.5);

        this.add(this.specialMarker);
    }

    addAmmoUI(midle) {
        let x = midle + 20;
        this.ammoMarker = this.scene.add.image(x, 20, 'ammo');
        this.ammoMarker.setOrigin(0.5);
        this.add(this.ammoMarker);
    }

    powerbarUpdate() {

        this.powerBar.clear();
        if (this.player.power > 0) {
            this.powerBar
                .fillStyle(0xfbe900, 1)
                .fillRect(this.powerBar.position, 10, this.player.power, 15);
        }

    }

    healthbarUpdate() {
        this.healthBar.clear();
        this.healthBar
            .fillStyle(0x00c749, 1)
            .fillRect(10, 10, this.player.health, 15);

        if (this.player.health <= 0) {
            this.scene.endGame();
        }
    }

    powerBarBlick(repeatCount = 3) {

        this.player.sounds['error'].play();
        this.scene.tweens.add({
            targets: this.powerbarBackground,
            alpha: 0,
            ease: 'Linear',
            duration: 200,
            yoyo: true,
            repeat: repeatCount - 1,
            onComplete: () => {
                this.powerbarBackground.setAlpha(0.3)
            }
        });
    }

    uiBlink(targetName, repeatCount = 3, disabled = false) {
        const targets = {
            healthBar: this.healthBar,
            powerBar: this.powerBar,
            ammoMarker: this.ammoMarker,
        };

        let target = targets[targetName];

        this.scene.tweens.add({
            targets: target,
            alpha: 0,
            ease: 'Linear',
            duration: 200,
            yoyo: true,
            repeat: repeatCount - 1,
            onComplete: () => {
                if (disabled) {
                    target.setAlpha(0.5);
                } else {
                    target.setAlpha(1);
                }
            }
        });
    }

    disableSpecialMarker() {
        this.specialMarker.setAlpha(0.5);
    }

    enableAmmoMarker() {
        this.ammoMarker.setAlpha(1);
    }

    disableAmmoMarker() {
        this.ammoMarker.setAlpha(0.5);
    }

}