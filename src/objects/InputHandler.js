export class InputHandler {

    buttons = {
        'A': false,
        'B': false,
        'X': false,
        'Y': false
    };
    holding = {
        'q': false,
        'e': false,
        'X': false,
        'Y': false
    };
    holdingTime = 500;
    maxComboTime = 500;

    combo = false;
    isHolding = false;
    canBeHold = false;


    isMobile = true;
    orientation;
    screeSize;
    lastKeyPressed;

    constructor(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.qKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.isMobile = this.isMobileDevice() || this.isTouchDevice();

        this.emitter = new Phaser.Events.EventEmitter();


        this.createCombos();
        if (this.isMobile) {
            this.scene.game.scene.start('UIScene', { inputHandler: this });

            this.resizeGame({ width: this.scene.scale.width, height: this.scene.scale.height });

            this.scene.scale.updateCenter();

        }

        this.scene.input.keyboard.on('keydown', (event) => {
            if (!this.combo) {
                this.checkKeysDown(event.key);
            }
        });

        this.scene.input.keyboard.on('keyup', (event) => {
            if (this.combo) {
                this.combo = false;
            }
            this.checkKeysUp(event.key);
        });

    }

    checkKeysDown(key) {

        this.lastKeyPressed = key;
        switch (key) {
            case 'A':
                if(this.joystickKeys.down.isDown) {
                    this.emitter.emit('jumpDownPressed');
                    break;
                }
            case 'w':
            case 'ArrowUp':
                this.emitter.emit('jumpKeyPressed');
                break;

            case 'a':
            case 'd':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'joystick':
                this.emitter.emit('moveKeyPressed');
                break;

            case ' ':
                if(this.sKey.isDown || this.cursors.down.isDown) {
                    this.emitter.emit('jumpDownPressed');
                    break;
                }
            case 'q':
            case 'e':
                this.lastKeyPressed = key;
                this.canBeHold = true;
            case 'X':
            case 'Y':
            case 'B':
                this.emitter.emit('fightActionPressed');
                break;

            default:
                break;
        }

    }

    checkKeysUp(key) {

        switch (key) {
            case 'A':
                if(this.joystickKeys.down.isUp) {
                    this.emitter.emit('jumpDownLeaved');
                }
            case 'w':
            case 'ArrowUp':
                this.emitter.emit('jumpKeyLeaved');
                break;

            case 'ArrowDown':
            case 's':
                if(this.cursors.space.isUp) {
                    this.emitter.emit('jumpDownLeaved');
                    break;
                }
            case 'a':
            case 'd':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.emitter.emit('movingKeyUp');
                break;
            case ' ':
                if(this.sKey.isUp && this.cursors.down.isUp) {
                    this.emitter.emit('jumpDownLeaved');
                    break;
                }
            case 'q':
            case 'e':
                this.canBeHold = false;
                this.holding[key] = false;

            case 'X':
            case 'Y':
            case 'B':
                this.emitter.emit('fightActionLeaved');
                break;

            default:
                break;
        }

    }

    holdingCheck(key = this.lastKeyPressed) {

        if(key === 'e' || key === 'q') {

            let keyObject = {
                'q': this.qKey,
                'e': this.eKey,
            };
    
            const duration = keyObject[key].getDuration();
            if (duration >= this.holdingTime ) {
                this.holding[key] = true;
                this.emitter.emit('holdAction');
            } 
        }
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

        const joystickPlugin = this.scene.plugins.get('rexVirtualJoystick');
        if (!joystickPlugin) {
            console.error('Plugin rexVirtualJoystick no encontrado');
            return;
        }

        this.joystick = joystickPlugin.add(this.scene, config);
        this.joystickKeys = this.joystick.createCursorKeys();


        this.joystick.on('pointerdown', () => {
            this.emitter.emit('moveKeyPressed');
        });

        this.joystick.on('update', () => {
            this.checkKeysDown('joystick');
        });

        this.joystick.on('pointerup', () => {
            this.emitter.emit('movingKeyUp');
        });
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


        this.scene.input.keyboard.createCombo(combo2, { resetOnMatch: true, maxKeyDelay: this.maxComboTime });//32 = XX
        this.scene.input.keyboard.createCombo(combo3, { resetOnMatch: true, maxKeyDelay: this.maxComboTime });//81 = XX

        this.scene.input.keyboard.on('keycombomatch', (event) => {

            if (event.keyCodes[0] === 32 && event.keyCodes[1] === 69) {

                this.runCombo('combo2');
            }

            if (event.keyCodes[0] === 32 && event.keyCodes[1] === 32) {

                this.runCombo('combo3');
            }

        });
    }

    runCombo(name) {
        this.combo = true;

        this.scene.player.runCombo(name);

    }

}
