import { Scene } from 'phaser';

export class Intro extends Scene {
    constructor() {
        super('Intro');
        this.lines = [];
        this.maxLines = 15;
        this.fullText = {
            'es': `En un mundo devastado por interminables batallas, 
donde la mitad de la población ha desaparecido sin 
dejar rastro, el caos se ha apoderado de Jamaica. 
Las bandas de capos opresores han tomado el control, 
sumiendo la isla en un estado de anarquía.

Nuestro protagonista, un individuo resistente y 
determinado, se encontró en medio de este tumulto. 
En medio de los saqueos, un hombre armado le disparó, 
dejándolo al borde de la muerte. La desesperación 
y el miedo se apoderaron de él mientras yacía en 
el suelo, rodeado por el caos del momento.

Pero la esperanza no estaba completamente perdida. 
En la misma ciudad, una anciana famosa por su 
conocimiento sobre hierbas místicas decidió intervenir. 
Con sus habilidades, creó un elixir único, una poción 
que combinaba plantas raras y mágicas. 

Al administrárselo, las heridas comenzaron a sanar. 
Sin embargo, el elixir tuvo efectos secundarios: 
le otorgó una fuerza sobrehumana, velocidad y 
durabilidad más allá de lo imaginable.

Renacido con estos nuevos poderes, el protagonista 
se enfrenta ahora a un dilema. ¿Utilizará sus habilidades 
para restaurar el orden en Jamaica y liberar a su gente 
del yugo de los capos opresores...

o se perderá en la sed de venganza y poder?`,
'en': `In a world devastated by endless battles, where half 
of the population has vanished without a trace, chaos 
has taken over Jamaica. Oppressive gangs have seized 
control, plunging the island into a state of anarchy.

Our protagonist, a resilient and determined individual, 
found himself in the midst of this turmoil. 
Amidst the looting, an armed man shot him, leaving him 
on the brink of death. Desperation and fear consumed 
him as he lay on the ground, surrounded by the chaos 
unfolding around him.

But hope was not entirely lost. In the same city, an elderly
woman known for her knowledge of mystical herbs 
decided to intervene. With her skills, she created a unique 
elixir, a potion that combined rare and magical plants. 
Upon administering it, his wounds began to heal rapidly. 
However, the elixir had unexpected side effects: 
it granted him superhuman strength, speed, and durability 
beyond imagination.

Reborn with these new powers, the protagonist now 
faces a dilemma. Will he use his abilities to restore order
in Jamaica and free his people from the oppressive ...
or will he be consumed by the thirst for revenge and power?

The fate of Jamaica lies in his hands. 
The battle for justice has only just begun.`
        };
        this.currentLineIndex = 0;
        this.typing = false; // Indica si está en proceso de escritura
        this.speed = 50;

    }

    preload() {
        // Cargar los archivos de sonido
        this.load.audio('keySound1', 'assets/sounds/typewrite/key1.mp3');
        this.load.audio('keySound2', 'assets/sounds/typewrite/key2.mp3');
        this.load.audio('keySound3', 'assets/sounds/typewrite/key3.mp3');
        this.load.audio('spaceSound', 'assets/sounds/typewrite/spaceBar.mp3');
        this.load.audio('enterSound', 'assets/sounds/typewrite/newLine.mp3');
    }

    create() {

        const userLang = navigator.language || navigator.userLanguage;
        const userLanguage = userLang.substring(0,2);
        this.textArray = this.fullText[userLanguage].split('\n');


        const maxWidth = this.game.config.width - 40;
        // console.log('Intro',this);
        const style = { 
            fontSize: '14px', // Tamaño de fuente en píxeles
            fontFamily: 'Arial', // Familia de fuente
            fill: '#ffffff', // Color de texto blanco
            wordWrap: { width: maxWidth, useAdvancedWrap: true } // Ajuste de línea
        };
    
        this.text = this.add.text(20, 20, '', style);
        
        // Añadir las primeras líneas de texto con efecto de máquina de escribir
        this.addInitialLines();

        // Ejemplo de cómo podrías llamar a estas funciones para añadir y desplazar el texto
        this.time.addEvent({
            delay: 2000, // Cada 2 segundos
            callback: () => {
                if (!this.typing) { // Solo añadir línea si no está escribiendo
                    this.addNextLine();
                    if (this.lines.length > this.maxLines) {
                        this.scrollText();
                    }
                }
            },
            loop: true
        });

        this.keySounds = [
            this.sound.add('keySound1'),
            this.sound.add('keySound2'),
            this.sound.add('keySound3')
        ];
        this.spaceSound = this.sound.add('spaceSound');
        this.enterSound = this.sound.add('enterSound');

        this.addSkipButton();

    }

    addSkipButton() {
        console.log('added skip');
        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        let skip = this.add.text(
            gamewidth - 30, 
            gameheight - 10, 
            'SKIP', 
            {
                fontFamily: 'Courier', 
                fontSize: 15, 
                color: '#ffffff',
                // stroke: '#ffffff', 
                // strokeThickness: 2,
                align: 'center'
            }
        )
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.start('Preloader');

        })

        this.tweens.add({
            targets: skip,
            duration: 300,
            y: gameheight - 15,
            // scale: 0.9,
            yoyo: true,
            repeat: -1,
        });

    }

    addInitialLines() {
        if (this.currentLineIndex < this.textArray.length) {
            this.addLineWithTypewriterEffect(this.textArray[this.currentLineIndex]);
            this.currentLineIndex++;
        }
    }

    addNextLine() {
        if (this.currentLineIndex < this.textArray.length) {
            this.addLineWithTypewriterEffect(this.textArray[this.currentLineIndex]);
            this.currentLineIndex++;
        }
    }

    addLineWithTypewriterEffect(newLine) {
        this.typing = true;
        let i = 0;
        const lineLength = newLine.length;
        let line = '';
        const event = this.time.addEvent({
            callback: () => {
                if (i < lineLength) {
                    line += newLine[i];
                    this.text.setText(this.lines.join('') + line);
                    this.playTypingSound(newLine[i]);
                    i++;
                } else {
                    this.typing = false;
                    this.lines.push(`${line} \n`); 
                    this.text.setText(this.lines.join(''));
                    this.enterSound.play();
                    event.remove(); 
                }
            },
            delay: this.speed, 
            callbackScope: this,
            loop: true
        });
    }

    scrollText() {
        this.lines.shift();  
        this.text.setText(this.lines.join(''));
    }

    playTypingSound(char) {
        if (char === ' ') {
            this.spaceSound.play();
        } else {
            const randomKeySound = this.keySounds[Math.floor(Math.random() * this.keySounds.length)];
            randomKeySound.play({ 
                volume: 0.4, 
                // rate: 1 + Math.random() * 0.2 - 0.1 
            }); 
        }
    }
}
