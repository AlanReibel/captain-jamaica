import { Scene } from 'phaser';

export class Intro extends Scene {
    constructor() {
        super('Intro');
        this.lines = [];
        this.maxLines = 15;
        this.fullText = `
En un mundo devastado por interminables batallas, 
donde la mitad de la población ha desaparecido sin 
dejar rastro, el caos se ha apoderado de Jamaica. 
Las bandas de capos opresores han tomado el control, 
sumiendo a la isla en un estado de anarquía y terror.

Nuestro protagonista, un individuo resistente y 
determinado, se encontró en medio de este tumulto. 
En medio de los saqueos, un hombre armado le disparó, 
dejándolo al borde de la muerte. La desesperación 
y el miedo se apoderaron de él mientras yacía en 
el suelo, rodeado por el caos del momento.

Pero la esperanza no estaba completamente perdida. 
En la misma ciudad, una anciana conocida por sus 
conocimientos en hierbas místicas decidió intervenir. 
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

o se perderá en la sed de venganza y poder?
`;
        this.textArray = this.fullText.split('\n');
        this.currentLineIndex = 0;
        this.typing = false; // Indica si está en proceso de escritura
        this.speed = 30;

    }

    create() {
        const maxWidth = this.game.config.width - 40;
        console.log('Intro',this);
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
                    console.log('lines', this.lines)
                    console.log('lines.length', this.lines.length)
                    if (this.lines.length > this.maxLines) {
                        this.scrollText();
                    }
                }
            },
            loop: true
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
                    i++;
                } else {
                    this.typing = false;
                    this.lines.push(`${line} \n`); // Agregar la línea completada al arreglo
                    this.text.setText(this.lines.join(''));
                    event.remove(); // Remover el evento al completar la línea
                }
            },
            delay: this.speed, // Velocidad del efecto de máquina de escribir
            callbackScope: this,
            loop: true
        });
    }

    scrollText() {
        this.lines.shift();  // Eliminar la línea más antigua
        this.text.setText(this.lines.join(''));
    }
}
