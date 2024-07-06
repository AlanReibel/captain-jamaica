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
        this.holding = {
            'A': false,
            'B': false,
            'X': false,
            'Y': false
        };

        this.isMobile = true;
        // this.isMobile = this.isMobileDevice() || this.isTouchDevice();

        this.createCombos();
        if(this.isMobile) {
            this.scene.game.scene.start('UIScene', { inputHandler: this});

            // this.scene.scale.setGameSize(this.scene.game.config.width, this.scene.game.config.height);
            // set game size
            this.resizeGame({ width: this.scene.scale.width, height: this.scene.scale.height });

            this.scene.scale.updateCenter();

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

    isJumpLeaved() {
        
        let joystickExist = this.joystickKeys ? this.joystickKeys.up.isUp : true;
        return this.wKey.isUp &&
            this.cursors.up.isUp &&
            joystickExist;
    }

//     isMovementKeyPressed() {
// // add joystick
//         return this.cursors.left.isDown ||
//             this.cursors.right.isDown ||
//             this.aKey.isDown ||
//             this.dKey.isDown;
//     }

    isJumpKeyPressed() {
        return this.cursors.up.isDown ||
            this.wKey.isDown ||
            this.joystickKeys?.up.isDown;
    }

    isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    }

    isTouchDevice() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    resizeGame({ width, height }) {

        const aspectRatio = 4 / 3;
        let newWidth, newHeight, scale;
    
        if (width / height > aspectRatio) {
            newHeight = height;
            newWidth = height * aspectRatio;
        } else {
            newWidth = width;
            newHeight = width / aspectRatio;
        }

        this.width = newWidth;
        this.height = newHeight;
    
        scale = Math.min(newWidth / this.scene.game.config.width, newHeight / this.scene.game.config.height);
        this.scene.cameras.main.setZoom(scale);
        this.scene.cameras.main.setViewport((width - newWidth) / 2, (height - newHeight) / 2, newWidth, newHeight);
        this.scene.cameras.main.setBounds(0, 0, this.scene.game.config.width, this.scene.game.config.height);
        
    }
    
    setButtonState(button, isPressed) {
        this.buttons[button] = isPressed;
    }

    setJoystickCursor(config) {
        // Verificar que el plugin esté disponible
        const joystickPlugin = this.scene.plugins.get('rexVirtualJoystick');
        if (!joystickPlugin) {
            console.error('Plugin rexVirtualJoystick no encontrado');
            return;
        }

        // Configurar el joystick
        this.joystick = joystickPlugin.add(this.scene, config);

        // Crear las teclas del joystick
        this.joystickKeys = this.joystick.createCursorKeys();
    }

    createCombos() {

        let combos = {
            'combo1': [81,81],
            'combo2': [70,70]
        };
        this.scene.input.keyboard.createCombo('CC', { resetOnMatch: true });//67
        this.scene.input.keyboard.createCombo('QQ', { resetOnMatch: true });//81
        this.scene.input.keyboard.createCombo('FF', { resetOnMatch: true });//70
        this.scene.input.keyboard.on('keycombomatch', (event) => {

            console.log('Combo',event.keyCodes);
            this.scene.player.runCombo();
        });
    }

}
