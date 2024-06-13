export class InputHandler {
    constructor(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.qKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.fKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    isFightActionPressed() {
        return this.qKey.isDown ||
            this.eKey.isDown ||
            this.fKey.isDown ||
            this.cursors.space.isDown;
    }

    isMovementKeyPressed() {
        return this.cursors.left.isDown ||
            this.cursors.right.isDown || 
            this.aKey.isDown || 
            this.dKey.isDown;
    }

    isJumpKeyPressed() {
        return this.cursors.up.isDown || 
        this.wKey.isDown;
    }

    isFightActionLeaved() {
        return this.cursors.space.isUp && 
        this.qKey.isUp && 
        this.fKey.isUp && 
        this.eKey.isUp;
    }
}
