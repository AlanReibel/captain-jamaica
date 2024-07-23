export class Box extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, name, potionName, flip) {
        super(scene, x, y, name);
        this.scene = scene;

        this.setFlipX(flip);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.setCollideWorldBounds(true);

        this.potions = this.scene.physics.add.group();

        this.PotionName = potionName;
        this.collected = false;
        this.potionAmounts = {
            health: 25,
            power: 50,
            ammo: 10
        };
    }

    static createAnimations(scene) {
        scene.anims.create({
            key: 'chestOpen',
            frames: scene.anims.generateFrameNumbers('chest', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });
    }

    openBox() {
        this.anims.play('chestOpen');

        this.on('animationcomplete-chestOpen', (anim, frame) => {
            this.showPotion();
        });

    }

    showPotion() {
        let newPotion = this.scene.physics.add.sprite(this.x, this.y - 15, this.PotionName);
        newPotion.amount = this.potionAmounts[this.PotionName];
        newPotion.name = this.PotionName;
        this.potions.add(newPotion);
        newPotion.body.setAllowGravity(false);
        newPotion.setDepth(3);
    }
    
}
