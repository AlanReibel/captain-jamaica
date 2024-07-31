import { Scene } from 'phaser';

export class Intro extends Scene {
    constructor() {
        super('Intro');
        this.lines = [];
        this.maxLines = 5;
        this.fullText = {
            'es': `
En un mundo devastado por interminables batallas, 
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
'en': `
In a world devastated by endless battles, where half 
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
        this.imageList = [                
            'devasted-city',
            'shoting',
            'lying',
            'elixir',
            'effects',
            'reborn'
        ];
        this.currentLineIndex = 0;
        this.typing = false; // Indica si está en proceso de escritura
        this.speed = 50;
        this.images = {
            es: {
                // 1: 'devasted-city',
                5: 'shoting',
                10: 'lying',
                15: 'elixir',
                20: 'effects',
                25: 'reborn'
            },
            en: {
                // 1: 'devasted-city',
                4: 'shoting',
                9: 'lying',
                14: 'elixir',
                18: 'effects',
                23: 'reborn'
            }
        };

    }

    create() {

        const userLang = navigator.language || navigator.userLanguage;
        let userLanguage = userLang.substring(0,2);
        userLanguage = userLanguage === 'es' ? 'es' : 'en';
        this.textArray = this.fullText[userLanguage].split('\n');
        this.userLanguage = userLanguage;


        const maxWidth = this.game.config.width - 40;
        const height = this.game.config.height / 2;

        const style = { 
            fontSize: '14px',
            fontFamily: 'Arial',
            fill: '#ffffff',
            wordWrap: { width: maxWidth, useAdvancedWrap: true }
        };
    
        this.text = this.add.text(20, height + 30, '', style);
        
        this.addInitialLines();
// 
        this.time.addEvent({
            delay: 1600, 
            callback: () => {
                if (!this.typing) { 
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
        this.introMusic = this.sound.add('introMusic');
        this.introMusic.play({volume: 0.9, loop: false});

        this.addSkipButton();


    }

    // Método que se llama cuando esta escena se apaga
    shutdown() {
        this.cleanup();
    }

    // Método que se llama cuando esta escena se destruye
    destroy() {
        this.cleanup();
    }

    cleanup() {
    
        if (this.introImage1) this.introImage1.destroy(true);
        if (this.introImage2) this.introImage2.destroy(true);

        this.imageList.forEach(imageName => {
            this.textures.remove(imageName);
        });
        this.keySounds.forEach(sound => {
            sound.destroy();
        });

        this.introMusic.destroy();
        this.spaceSound.destroy();
        this.enterSound.destroy();
    }

    addSkipButton() {
        let gamewidth = this.game.config.width;
        let gameheight = this.game.config.height;

        this.skip = this.add.text(
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
            this.endIntro();

        })

        this.tweens.add({
            targets: this.skip,
            duration: 300,
            y: gameheight - 15,
            // scale: 0.9,
            yoyo: true,
            repeat: -1,
        });

    }

    endIntro() {
        console.log('intro', this);
        this.cameras.main.fadeOut(250, 0, 0, 0);
        this.game.sound.stopAll();

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            this.scene.start('Preloader');
        }, this);
    }

    addInitialLines() {
        
        if (this.currentLineIndex < this.textArray.length) {
            this.addLineWithTypewriterEffect(this.textArray[this.currentLineIndex]);
            this.currentLineIndex++;
            this.addImage('devasted-city');
        } 
    }

    addNextLine() {
        if (this.currentLineIndex < this.textArray.length) {
            let imageOnLine = Object.keys(this.images[this.userLanguage]);


            if(imageOnLine.includes(`${this.currentLineIndex}`)) {
                let imageName = this.images[this.userLanguage][this.currentLineIndex];
                this.addImage(imageName);
            }
            this.addLineWithTypewriterEffect(this.textArray[this.currentLineIndex]);
            this.currentLineIndex++;
        } else {
            this.endIntro();
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
                volume: 0.2, 
            }); 
        }
    }

    addImage(name) {
        this.tweens.add({
            targets: this.introImage,
            alpha: 0,
            ease: 'Linear',
            duration: 1000, 
            onComplete: () => {
                this.introImage = this.add.image( 0, 0, name)
                    .setOrigin(0)
                    .setAlpha(0)
                this.tweens.add({
                    targets: this.introImage,
                    alpha: 1,
                    ease: 'Linear',
                    duration: 1000, 
                });
            }
        });

    }
}
