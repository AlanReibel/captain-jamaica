export class InputHandler {

    buttons = {
        'A': false,
        'B': false,
        'X': false,
        'Y': false
    };
    holding = {
        'A': false,
        'B': false,
        'X': false,
        'Y': false
    };
    holdingTime = 500;
    maxComboTime = 500;


    isMobile = true;
    orientation;
    screeSize;

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

        this.isMobile = this.isMobileDevice() || this.isTouchDevice();

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
            // this.buttons['A'] ||
            this.buttons['B'] ||
            this.buttons['X'] ||
            this.buttons['Y'];
    }

    isFightActionLeaved() {
        return this.cursors.space.isUp &&
            this.qKey.isUp &&
            this.fKey.isUp &&
            this.eKey.isUp &&
            // !this.buttons['A'] &&
            !this.buttons['B'] &&
            !this.buttons['X'] &&
            !this.buttons['Y'];
    }

    isJumpLeaved() {
        
        return this.wKey.isUp &&
            this.cursors.up.isUp &&
            !this.buttons['A'];
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
            this.buttons['A'];
    }

    isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
    }

    isTouchDevice() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    resizeGame({ width, height }) {

        this.screenSize = { width: width, height: height };
        const aspectRatio = 4 / 3;
        let newWidth, newHeight, scale;
    
        if (width / height > aspectRatio) {
            newHeight = height;
            newWidth = height * aspectRatio;
            this.orientation = 'landscape';
        } else {
            newWidth = width;
            newHeight = width / aspectRatio;
            this.orientation = 'portrait';
        }

        // console.log('old size', {width, height});
        // console.log('new size', {newWidth, newHeight});

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

        let combo2 = [
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.E
        ];
        
        let combo3 = [
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.SPACE
        ];

        // this.scene.input.keyboard.createCombo('QE', { resetOnMatch: true,  maxKeyDelay: this.maxComboTime });//69 = XY
        // this.scene.input.keyboard.createCombo('EE', { resetOnMatch: true,  maxKeyDelay: this.maxComboTime });//69 = YY
        this.scene.input.keyboard.createCombo(combo2, { resetOnMatch: true,  maxKeyDelay: this.maxComboTime });//32 = XX
        this.scene.input.keyboard.createCombo(combo3, { resetOnMatch: true,  maxKeyDelay: this.maxComboTime });//81 = XX
        // this.scene.input.keyboard.createCombo('CC', { resetOnMatch: true });//67
        // this.scene.input.keyboard.createCombo('FF', { resetOnMatch: true });//70
        this.scene.input.keyboard.on('keycombomatch', (event) => {

            // console.log('key codes',event.keyCodes);

            // if(event.keyCodes[0] === 81 && event.keyCodes[1] === 69){

            //     this.runCombo('combo1');
            // }

            if(event.keyCodes[0] === 32 && event.keyCodes[1] === 69){

                this.runCombo('combo2');
            }

            if(event.keyCodes[0] === 32 && event.keyCodes[1] === 32){

                this.runCombo('combo3');
            }

            // console.log('Combo',event.keyCodes);
            // this.scene.player.runCombo();
        });
    }

    runCombo(name) {
        this.scene.player.runCombo(name);

    }

}
