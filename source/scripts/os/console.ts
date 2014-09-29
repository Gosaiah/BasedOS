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
                    public buffer = "",
                    public history = [],
                    public historyIndex = history.length) 
        {

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
                if (chr === String.fromCharCode(13)) 
                { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } 
                else 
                {
                    //autocomplete with tab
                    if(chr == String.fromCharCode(9))
                    {
                        var cBuffer, currentMatch, cCommands;
                        cBuffer = this.buffer.toString();
                        currentMatch = false;
                        cCommands = ["ver","help","shutdown","cls","man","trace","rot13","prompt","status", "date","whereami","portal"];
                        // Check the current commands
                        for(var i = 0; i < currentCommands.length; i++)
                        {
                            if ((this.inOrderContains(currentBuffer, currentCommands[i])) && foundMatch == false)
                            {
                                currentBuffer = currentCommands[i];
                                foundMatch = true;
                            }
                        }
                        if(foundMatch)
                        {
                            this.replaceBuffer(currentBuffer);
                        }
                        else 
                        {
                            if (chr == "upArrow")
                            {
                                if(this.historyIndex > 0)
                                {
                                    var historyCommand = this.history[this.historyIndex - 1];
                                    this.replaceBuffer(historyCommand);
                                    this.historyIndex = this.historyIndex - 1;
                                }
                            }
                            else
                            {
                                if (chr == "downArrow")
                                {
                                    if(this.historyIndex < this.history.length - 1)
                                    {
                                        var historyCommand = this.history[this.historyIndex + 1];
                                        this.replaceBuffer(historyCommand);
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
                    
                } // end else
            }// end while
                // TODO: Write a case for Ctrl-C.
        }// end public handleInput
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
    }
 }
