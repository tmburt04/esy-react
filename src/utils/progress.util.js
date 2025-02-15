const readline = require('readline');

/**
 * Utility class to display a progress spinner in the terminal (removed when done)
 */
class ProgressUtil {
    constructor() {
        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.currentFrame = 0;
        this.interval = null;
    }

    start(message = 'Loading') {
        // Hide the cursor
        process.stdout.write('\x1B[?25l');
        
        this.updateMessage(message);
    }

    stop() {
        clearInterval(this.interval);
        // Clear the current line
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        // Show the cursor again
        process.stdout.write('\n\x1B[?25h');
    }
    
    updateMessage(message) {
        clearInterval(this.interval);
        
        this.interval = setInterval(() => {
            // Clear the current line
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
            
            // Write the new frame
            process.stdout.write(`${this.frames[this.currentFrame]} ${message}`);
            
            // Move to next frame
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }, 80);
     }
}

module.exports = { ProgressUtil };