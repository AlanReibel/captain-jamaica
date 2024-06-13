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
        this.buttons = {
            'A': false,
            'B': false,
            'X': false,
            'Y': false
        };

        this.isMobile = true;
        this.isMobile = this.isMobileDevice() || this.isTouchDevice();

        if(this.isMobile) {
            this.addVirtualJoystick();
            this.addVirtualButtons();
        }
    }

    isFightActionPressed() {
        return this.qKey.isDown ||
            this.eKey.isDown ||
            this.fKey.isDown ||
            this.cursors.space.isDown ||
            this.buttons['A'] ||
            this.buttons['B'] ||
            this.buttons['X'] ||
            this.buttons['Y'];
    }

    isFightActionLeaved() {
        return this.cursors.space.isUp &&
            this.qKey.isUp &&
            this.fKey.isUp &&
            this.eKey.isUp &&
            !this.buttons['A'] &&
            !this.buttons['B'] &&
            !this.buttons['X'] &&
            !this.buttons['Y'];
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
            this.joystickKeys?.up.isDown;
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

    addVirtualButtons() {

        const radius = 30;
        const position = {
            x: this.scene.game.config.width - (radius * 3),
            y: this.scene.game.config.height - (radius * 3)
        };
        const buttons = [
            { key: 'A', x: position.x, y: position.y + (radius * 2) },
            { key: 'B', x: position.x + (radius * 2), y: position.y },
            { key: 'X', x: position.x - (radius * 2), y: position.y },
            { key: 'Y', x: position.x, y: position.y - (radius * 2) }
        ];

        buttons.forEach(button => {

            const buttonCircle = this.scene.add.circle(button.x, button.y, radius)
                .setStrokeStyle(2, 0xff0000)
                .setInteractive()
                .on('pointerdown', () => {
                    this.buttons[button.key] = true;
                })
                .on('pointerup', () => {
                    this.buttons[button.key] = false;
                });

            let fontSetup = {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#ffffff',
                align: 'center'
            };
            this.scene.add.text(button.x, button.y, button.key, fontSetup).setOrigin(0.5);
        });

    }

    isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    }

    isTouchDevice() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

}
