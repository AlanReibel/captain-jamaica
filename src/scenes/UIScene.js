export class UIScene extends Phaser.Scene {
    constructor() {
        super(
            { 
                key: 'UIScene',
                transparent: true
            }
        );

        this.width;
        this.height;
        this.isPortrait;
    }

    preload() {
        // Cargar los recursos necesarios para los botones aquí si es necesario
    }

    create() {
        // Llamar a la función para añadir botones virtuales
        console.log('UI scene', this);

        this.width = this.scale.parentSize.width;
        this.height = this.scale.parentSize.height;
        this.isPortrait = this.width < this.height;

        console.log('parent size',this.width, this.height);
        // set UI layer size
        // this.cameras.main.setBackgroundColor(0xffffff);
        this.scale.setGameSize(this.width, this.height);
        this.addVirtualJoystick();
        this.addVirtualButtons();
    }

    addVirtualJoystick() {

        // const radius = Math.min(100, this.width / 2);
        const margin = this.isPortrait 
            ? this.width * 0.06
            : this.width * 0.1;
        const radius = this.isPortrait 
            ? (this.width - (margin * 2)) / 4
            : 100;
        console.log('joystick radius',radius);
        console.log('joystick margin',margin);
        const x = this.isPortrait 
            ? radius + margin
            : radius + (margin / 4);
        const y = this.height - radius - margin;
        const base = this.add.circle(x, y, radius, 0x888888).setAlpha(0.5);
        const thumb = this.add.circle(x, y, radius / 2, 0xcccccc).setAlpha(0.8);

        const config = {
            x: x,
            y: y,
            radius: radius,
            base: base,
            thumb: thumb,
            dir: '8dir',
            fixed: true,
            enable: true
        };

        // Obtén el plugin rexVirtualJoystick
        const joystickPlugin = this.plugins.get('rexVirtualJoystick');

        // Añade el joystick a la escena
        this.joystick = joystickPlugin.add(this, config);

        // Crear cursor keys desde el joystick
        this.joystickKeys = this.joystick.createCursorKeys();

    }

    addVirtualButtons() {

        const radius = Math.min(30, this.width * 0.06);
        const position = {
            x: this.width - (radius * 4),
            y: this.isPortrait 
                ? this.height - (radius * 5)
                : (this.height / 2 ) + (radius * 2)
        };
        const buttons = [
            { key: 'A', x: position.x, y: position.y + (radius * 2) },
            { key: 'B', x: position.x + (radius * 2), y: position.y },
            { key: 'X', x: position.x - (radius * 2), y: position.y },
            { key: 'Y', x: position.x, y: position.y - (radius * 2) }
        ];

        buttons.forEach(button => {

            const buttonCircle = this.add.circle(button.x, button.y, radius)
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
            this.add.text(button.x, button.y, button.key, fontSetup).setOrigin(0.5);
        });

    }

    getPortraitButtonConfig() {
        const width = this.scale.width;
        const height = this.scale.height;
        const radius = 30;
        const margin = 50;

        return [
            { key: 'left', x: margin + radius, y: height - margin - radius * 2, radius: radius },
            { key: 'right', x: margin + radius * 3, y: height - margin - radius * 2, radius: radius },
            { key: 'up', x: width - margin - radius, y: height - margin - radius * 3, radius: radius },
            { key: 'down', x: width - margin - radius, y: height - margin - radius, radius: radius }
        ];
    }

    getLandscapeButtonConfig() {
        const width = this.scale.width;
        const height = this.scale.height;
        const radius = 30;
        const margin = 50;

        return [
            { key: 'left', x: margin + radius, y: height - margin - radius, radius: radius },
            { key: 'right', x: margin + radius * 3, y: height - margin - radius, radius: radius },
            { key: 'up', x: margin + radius * 2, y: height - margin - radius * 3, radius: radius },
            { key: 'down', x: margin + radius * 2, y: height - margin - radius, radius: radius }
        ];
    }

    handleResize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        const isPortrait = width < height;

        this.scene.restart();  // Reinicia la escena para actualizar la configuración de botones
    }
}
