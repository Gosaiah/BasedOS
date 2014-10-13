///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS 
{

    export class Console 
    {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") 
                    public history = [];
                    public historyIndex = history.length {

        }

        public init(): void 
        {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void 
        {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void 
        {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void 
        {
            while (_KernelInputQueue.getSize() > 0) 
            {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) //     Enter key
                { 
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    this.history[this.history.length] = this.buffer;
                    this.historyIndex = this.history.length;
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else 
                {
                    if(chr === String.fromCharCode(8))
                    {
                        //backspace
                        var charRemove = this.buffer.charAt(this.buffer.length - 1);
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                        this.backspace(charRemove);
                    }
                    else
                    {
                        // autocomplete with tab button
                        if(chr == String.fromCharCode(9))
                        {
                            var ourBuffer,matchFound;
                            ourBuffer = this.buffer.toString();
                            matchFound = false;
                            // dont forget to update this list later (if ever changing commands)
                            var ourCommands = ["ver", "help", "shutdown", "cls", "man", "trace", "rot13", "prompt", "status", "date", "whereami", "portal"];
                            // 
                            for(var k=0; k < currentCommands.length; k++)
                            {
                                if ((this.inOrderContains(ourBuffer, ourCommands[k])) && matchFound == false)
                                {
                                    ourBuffer = ourCommands[k];
                                    matchFound = true;
                                }
                            }
                            if(matchFound)
                            {
                                this.replaceBuffer(ourBuffer);
                            }
                        }
                        else
                        {
                            if(chr == "upArrow")
                            {

                                if(this.historyIndex > 0)
                                {
                                    var tempHistLen= this.history.length - 1;
                                    var pastCommands = this.history[tempHistLen];
                                    this.replaceBuffer(PastCommands);
                                    this.historyIndex = this.historyIndex -1;
                                }
                            }
                            else
                            {
                                if(chr == "downArrow")
                                {
                                    var tempHistLen= this.history.length - 1;
                                    if(this.historyIndex < tempHistLen)
                                    {
                                        var pastCommands = this.history[this.historyIndex + 1];
                                        this.replaceBuffer(pastCommands);
                                        this.historyIndex = this.historyIndex + 1;
                                    }
                                }
                                else
                                {
                                    // This is a "normal" character, so ...
                                    // ... draw it on the screen...
                                    this.putText(chr);
                                    // ... and add it to our buffer.
                                    this.buffer += chr;
                                }
                            }
                        }
                    }
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void 
        {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") 
            {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void 
        {
            // TODO: Handle scrolling. (Project 1)
            
            var yPos = _DefaultFontSize + _FontHeightMargin;
            if (this.currentYPosition >= _Canvas.height - yPos)
            {
                var cHeight = _Canvas.height;
                var cWidth = _Canvas.width;
                var pixels = _DrawingContext.getImageData(0, _DefaultFontSize + _FontHeightMargin, cWidth, cHeight);
                this.clearScreen;
                _DrawingContext.putImageData(pixels,0,0);
                this.currentXPosition = 0;
            }
            else
            {
               this.currentXPosition = 0;
               this.currentYPosition += _DefaultFontSize + _FontHeightMargin; 
            }
            
        }

        public backspace(text): void
        {
            //get the height/width of the character being removed -> redraw the content without that character
            var lenghtOfChar = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var heightY = _DefaultFontSize + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition - lenghtOfChar, ((this.currentYPosition - heightY) + 5), lenghtOfChar, heightY);
            // if theres text, bring it back and update our x position
            if(this.currentXPosition > 0)
            {
                this.currentXPosition = this.currentXPosition - lenghtOfChar;
            }
        }

        public replaceBuffer(text)
        {
            // clear characters then add the new ones
            //clear
            for(var i = this.buffer.length; i > 0; i--)
            {
                var charRemove = this.buffer.charAt(this.buffer.length - 1);
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                this.backspace(charRemove);
            }
            //add
            this.buffer = text;
            for(var k = 0; k < this.buffer.length; k++)
            {
                this.putText(this.buffer.charAt(k));
            }
        }

        
    }
 }
