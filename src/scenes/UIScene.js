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

        this.comboSequences = [];
        this.comboTimeout = null;
        this.comboList = [
            // { sequence: ['A', 'B'], action: 'combo1' },
            { sequence: ['B', 'Y'], action: 'combo2' },
            { sequence: ['B', 'B'], action: 'combo3' },
        ];
    }

    init(data) {
        this.inputHandler = data.inputHandler;
    }

    create() {
        console.log('UI scene', this);

        this.width = this.scale.parentSize.width;
        this.height = this.scale.parentSize.height;
        this.isPortrait = this.width < this.height;

        // set UI layer size
        this.scale.setGameSize(this.width, this.height);

        this.addVirtualJoystick();
        this.addVirtualButtons();
    }

    addVirtualJoystick() {

        const margin = this.isPortrait 
            ? this.width * 0.06
            : this.width * 0.1;

        const radius = this.isPortrait 
            ? (this.width - (margin * 2)) / 4
            : 100;

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

        this.inputHandler.setJoystickCursor(config);

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

        buttons.forEach( button => {

            const buttonCircle = this.add.circle(button.x, button.y, radius)
                .setStrokeStyle(2, 0xff0000)
                .setFillStyle(0x000000)
                .setInteractive()
                .on('pointerdown', () => this.onButtonDown(button.key, buttonCircle))
                .on('pointerup', () => this.onButtonUp(button.key, buttonCircle));

            let fontSetup = {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#ffffff',
                align: 'center'
            };
            this.add.text(button.x, button.y, button.key, fontSetup).setOrigin(0.5);
        });

    }

    handleResize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        const isPortrait = width < height;

        this.scene.restart();
    }

    onButtonDown( key, buttonCircle ) {
        buttonCircle.setFillStyle(0xff0000);
        this.inputHandler.setButtonState(key, true);
        this.recordKeyPress(key);
        this.time.delayedCall(this.inputHandler.holdingTime, () => {
            if(this.inputHandler.buttons[key]) {
                this.inputHandler.holding[key] = true;
                console.log('holded',this.inputHandler.holding);
            }
        });
    }

    onButtonUp( key, buttonCircle ) {
        buttonCircle.setFillStyle(0x000000);
        this.inputHandler.setButtonState(key, false);
        this.inputHandler.holding[key] = false;
    }

    recordKeyPress(key) {
        // Limpiar el timeout del combo previo
        if (this.comboTimeout) {
            clearTimeout(this.comboTimeout);
        }
        
        // Añadir la tecla presionada a la secuencia de teclas
        this.comboSequences.push(key);

        // Verificar si la secuencia forma un combo
        this.checkCombo();

        // Reiniciar el timeout para considerar el tiempo entre teclas para el combo
        this.comboTimeout = setTimeout(() => {
            this.comboSequences = [];
        }, this.inputHandler.maxComboTime);
    }

    checkCombo() {
        for (let combo of this.comboList) {
            if (this.isComboMatch(combo.sequence)) {
                this.inputHandler.runCombo(combo.action);
                this.comboSequences = [];
                break;
            }
        }
    }

    isComboMatch(sequence) {
        if (this.comboSequences.length < sequence.length) {
            return false;
        }

        const recentSequence = this.comboSequences.slice(-sequence.length);
        return sequence.every((key, index) => key === recentSequence[index]);
    }

}
