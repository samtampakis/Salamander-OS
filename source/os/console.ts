///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public index = 0) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    _InputHistory.push(this.buffer);
                    this.index = _InputHistory.length;
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if(chr === String.fromCharCode(8)){
                    this.removeText(this.buffer.charAt(this.buffer.length - 1));
                    this.buffer = this.buffer.substr(0, this.buffer.length - 1);
                } else if (chr === String.fromCharCode(9)){         //tab 
                    this.clearLine();
                    var temp = -1;
                    var i = 0;
                    
                    while (temp != 0 && i < _OsShell.commandList.length){
                        temp = _OsShell.commandList[i].command.indexOf(this.buffer);
                        if (temp == 0){
                            this.buffer = _OsShell.commandList[i].command;
                        }
                        i++;
                    }
                    
                    if (temp != 0){
                        this.buffer = "No such command."
                    }
                    
                    _OsShell.putPrompt();
                    this.putText(this.buffer);
                
                }else if (chr === String.fromCharCode(18)) {    //up arrow
                    this.clearLine();                    
                    if(this.index > 0){
                        this.index -= 1;
                    }
                    this.buffer = _InputHistory[this.index];
                    _OsShell.putPrompt();
                    this.putText(this.buffer);
                } else if (chr === String.fromCharCode(20)) {   //down arrow
                    this.clearLine();
                    if(this.index < _InputHistory.length - 1){
                        this.index += 1;
                    }
                    this.buffer = _InputHistory[this.index];
                    _OsShell.putPrompt();
                    this.putText(this.buffer);
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C. 
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                if((this.currentXPosition + offset) > _Canvas.width){
                    this.advanceLine();
                }
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }
         
         public removeText(text): void {
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            this.currentXPosition = this.currentXPosition - offset;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, offset, this.currentFontSize + _FontHeightMargin);
         }

        public clearLine(): void {
            this.currentXPosition = 0;
            //this is drawing in the wrong place
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - 10, _Canvas.width, this.currentFontSize + _FontHeightMargin);           
        }
         
        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            var yPositionOffset = _DefaultFontSize + 
                                  _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                  _FontHeightMargin;

            if (this.currentYPosition + (2* yPositionOffset) > _Canvas.height){               
                var tempCanvas = document.createElement('canvas');
                tempCanvas.height = _Canvas.height;
                tempCanvas.width = _Canvas.width;
                var tempContext = tempCanvas.getContext("2d");
                tempContext.drawImage(_Canvas,0,0);
                this.clearScreen();
                this.resetXY();
                _DrawingContext.drawImage(tempCanvas,0, -yPositionOffset);
                this.currentYPosition = _Canvas.height - yPositionOffset;
            } else{
                this.currentYPosition += yPositionOffset;
            }
        }
    }
 }
