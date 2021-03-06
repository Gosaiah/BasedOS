///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, history, historyIndex, cmdBuffer) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof buffer === "undefined") { buffer = ""; }
            if (typeof history === "undefined") { history = []; }
            if (typeof historyIndex === "undefined") { historyIndex = history.length; }
            if (typeof cmdBuffer === "undefined") { cmdBuffer = []; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.history = history;
            this.historyIndex = historyIndex;
            this.cmdBuffer = cmdBuffer;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    //this.history[this.history.length] = this.buffer;
                    //this.historyIndex = this.history.length;
                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                } else {
                    if (chr === String.fromCharCode(8)) {
                        //backspace
                        var charRemove = this.buffer.charAt(this.buffer.length - 1);
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                        this.backSpace(charRemove);
                    } else {
                        // autocomplete with tab button
                        if (chr == String.fromCharCode(9)) {
                            //this.tabComplete(this.buffer);
                            var ourBuffer, matchFound;
                            ourBuffer = this.buffer.toString();
                            matchFound = false;

                            // dont forget to update this list later! (if ever changing/adding commands)
                            var ourCommands = ["ver", "help", "shutdown", "cls", "man", "trace", "rot13", "prompt", "status", "date", "whereami", "portal", "bsod", "load"];
                            for (var k = 0; k < ourCommands.length; k++) {
                                if ((this.containsCheck(ourBuffer, ourCommands[k])) && matchFound == false) {
                                    ourBuffer = ourCommands[k];
                                    matchFound = true;
                                }
                            }
                            if (matchFound) {
                                this.replaceBuffer(ourBuffer);
                            }
                        } else {
                            if (chr == "upArrow") {
                                if (this.historyIndex > 0) {
                                    var pastCommands = this.history[this.historyIndex - 1];
                                    this.replaceBuffer(pastCommands);
                                    this.historyIndex = this.historyIndex - 1;
                                }
                            } else {
                                if (chr == String.fromCharCode(40)) {
                                    /*if(this.historyIndex < this.history.length - 1)
                                    {
                                    var pastCommands = this.history[this.historyIndex + 1]
                                    this.replaceBuffer(pastCommands);
                                    this.historyIndex = this.historyIndex + 1;
                                    }*/
                                } else {
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
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to w;rite one function and use the term "text" to connote string or char.
            // start line wrapping
            //
            var textLength = text.length;
            if (textLength > 1) {
                for (var i = 0; i < textLength; i++) {
                    this.putText(text.charAt(i));
                }
            } else {
                // Works as long as we have a string or char - > not blank
                if (text !== "") {
                    // Draw text at current X and Y coordinates.
                    var diff = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    if ((this.currentXPosition + diff) > 500) {
                        //this.putText("-");
                        //goto Next line
                        this.advanceLine();

                        // add spacing for visual
                        this.putText("  ");
                    }

                    // redraw with new position
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);

                    // update x position
                    this.currentXPosition = this.currentXPosition + diff;
                }
            }
            /*
            if (text !== "")
            {
            // Draw the text at the current X and Y coordinates.
            _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
            // Move the current X position.
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            this.currentXPosition = this.currentXPosition + offset;
            }*/
        };

        Console.prototype.advanceLine = function () {
            // TODO: Handle scrolling. (Project 1)
            this.currentXPosition = 0;

            // while within original canvas height
            if ((this.currentYPosition + _DefaultFontSize + _FontHeightMargin) < _DrawingContext.canvas.height) {
                // yPos is standard -> fontSize and margin
                this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
            } else {
                this.scrollTheScreen();
            }
        };

        // Method - scrolling the screen
        Console.prototype.scrollTheScreen = function () {
            // yDiff is just difference in y space with the chars included
            var yDiff = _DefaultFontSize + _FontHeightMargin;
            var image = _DrawingContext.getImageData(0, yDiff, _DrawingContext.canvas.width, _DrawingContext.canvas.height);

            _DrawingContext.putImageData(image, 0, 0);
            _DrawingContext.clearRect(0, _DrawingContext.canvas.height - yDiff, _DrawingContext.canvas.width, _DrawingContext.canvas.height);
        };

        // Gotta check if part of a string(partial) is contained in a larger string
        Console.prototype.containsCheck = function (partialString, largerString) {
            var matchingString, partialStringLength, largerStringLength;
            matchingString = true;
            partialStringLength = partialString.length;
            largerStringLength = largerString.length;

            //not contained if partial is as long or longer then larger
            if (partialStringLength >= largerStringLength) {
                return false;
            } else {
                for (var i = 0; i < partialStringLength; i++) {
                    if (partialString.charAt(i) != largerString.charAt(i)) {
                        matchingString = false;
                    }
                }
            }
            return matchingString;
        };

        Console.prototype.tabComplete = function (buffer) {
            var commands = [];
            var commandList = _OsShell.getCommands();
            for (var i = 0; i < commandList[i]; i++) {
                var cmd = commandList[i];
                if (Console.startsWith(buffer, cmd)) {
                    commands[commands.length] = commandList[i];
                }
            }
            if (commands.length == 1) {
                var textAdd = commands[0].substring(this.buffer.length, commands[0].length);
                this.putText(textAdd);
                this.buffer += textAdd;
            }
        };

        Console.startsWith = function (arg1, arg2) {
            if (arg1.length > arg2.length) {
                return false;
            }
            for (var i = 0; i < arg1.length; i++) {
                if (arg1.charAt(i) !== arg2.charAt(i)) {
                    return false;
                }
            }
            return true;
        };

        Console.prototype.backSpace = function (text) {
            var lenghtOfChar = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var heightY = _DefaultFontSize + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition - lenghtOfChar, ((this.currentYPosition - heightY) + 5), lenghtOfChar, heightY);

            // if there was text, bring it back
            if (this.currentXPosition > 0) {
                this.currentXPosition = this.currentXPosition - lenghtOfChar;
            }
        };

        Console.prototype.replaceBuffer = function (text) {
            for (var i = this.buffer.length; i > 0; i--) {
                var charRemove = this.buffer.charAt(this.buffer.length - 1);
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                this.backSpace(charRemove);
            }

            //add
            this.buffer = text;
            for (var k = 0; k < this.buffer.length; k++) {
                this.putText(this.buffer.charAt(k));
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
