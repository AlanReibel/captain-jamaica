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
            this.wKey.isDown ||
            this.joystickKeys.up.isDown;
    }

    isFightActionLeaved() {
        return this.cursors.space.isUp && 
        this.qKey.isUp && 
        this.fKey.isUp && 
        this.eKey.isUp;
    }

    addVirtualJoystick() {

        const x = 100;
        const y = this.scene.game.config.height - 100;
        const base = this.scene.add.circle(x, y, 100, 0x888888).setAlpha(0.5);
        const thumb = this.scene.add.circle(x, y, 50, 0xcccccc).setAlpha(0.8);
    
        const config = {
            x: x,
            y: y,
            radius: 100,
            base: base,
            thumb: thumb,
            dir: '8dir',
            fixed: true,
            enable: true
        };
    
        // Obtén el plugin rexVirtualJoystick
        const joystickPlugin = this.scene.plugins.get('rexVirtualJoystick');
    
        // Añade el joystick a la escena
        this.joystick = joystickPlugin.add(this.scene, config);
    
        // Crear cursor keys desde el joystick
        this.joystickKeys = this.joystick.createCursorKeys();
        
    }
}
