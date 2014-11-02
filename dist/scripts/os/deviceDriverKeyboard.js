///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            // Check for a backspaces(8) and tabs(9)
            if (keyCode == 38) {
                chr = "upArrow";
                _KernelInputQueue.enqueue(chr);
            }
            if (keyCode == 40) {
                chr = "downArrow";
                _KernelInputQueue.enqueue(chr);
            }
            if (keyCode == 8 || keyCode == 9) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);

                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr); //v q
            } else {
                if (((keyCode >= 48) && (keyCode <= 57)) || (keyCode == 32) || (keyCode == 13)) {
                    //switch statement for characters input
                    if (isShifted && ((keyCode >= 48) && (keyCode <= 57))) {
                        switch (keyCode) {
                            case 48:
                                // Closing Paren -> )
                                keyCode = 41;
                                break;
                            case 49:
                                // Exclamation Point -> !
                                keyCode = 33;
                                break;
                            case 50:
                                // At -> @
                                keyCode = 64;
                                break;
                            case 51:
                                // Hash/Pound -> #
                                keyCode = 35;
                                break;
                            case 52:
                                // Dollar Sign -> $
                                keyCode = 36;
                                break;
                            case 53:
                                // Percentage -> %
                                keyCode = 37;
                                break;
                            case 54:
                                // hat -> ^
                                keyCode = 94;
                                break;
                            case 55:
                                // And Symbol -> &
                                keyCode = 38;
                                break;
                            case 56:
                                // Star -> *
                                keyCode = 42;
                                break;
                            case 57:
                                // Open Parenthesis -> (
                                keyCode = 40;
                                break;
                            default:
                                keyCode = keyCode;
                                break;
                        }
                    }
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                } else {
                    // Punctuation Marks Input
                    var isPunctuation = false;

                    // for period -> .
                    if (keyCode == 190 && !isPunctuation) {
                        keyCode = 46;
                        if (isShifted) {
                            keyCode = 62;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for comma -> ,
                    if (keyCode == 188 && !isPunctuation) {
                        keyCode = 44;
                        if (isShifted) {
                            keyCode = 60;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for forward slash -> /
                    if (keyCode == 191 && !isPunctuation) {
                        keyCode = 47;
                        if (isShifted) {
                            keyCode = 63;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for semicolon -> ;
                    if (keyCode == 186 && !isPunctuation) {
                        keyCode = 59;
                        if (isShifted) {
                            keyCode = 58;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for apostrophe -> '
                    if (keyCode == 222 && !isPunctuation) {
                        keyCode = 39;
                        if (isShifted) {
                            keyCode = 34;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for open bracket -> [
                    if (keyCode == 219 && !isPunctuation) {
                        keyCode = 91;
                        if (isShifted) {
                            keyCode = 123;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for close bracket -> ]
                    if (keyCode == 221 && !isPunctuation) {
                        keyCode = 93;
                        if (isShifted) {
                            keyCode = 125;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for backslash -> \
                    if (keyCode == 220 && !isPunctuation) {
                        keyCode = 92;
                        if (isShifted) {
                            keyCode = 124;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for dash -> -
                    if (keyCode == 189 && !isPunctuation) {
                        keyCode = 45;
                        if (isShifted) {
                            keyCode = 95;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for equal sign -> =
                    if (keyCode == 187 && !isPunctuation) {
                        keyCode = 61;
                        if (isShifted) {
                            keyCode = 43;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }

                    // for tilda -> ~
                    if (keyCode == 192 && !isPunctuation) {
                        keyCode = 96;
                        if (isShifted) {
                            keyCode = 126;
                        }
                        isPunctuation = true;
                        chr = String.fromCharCode(keyCode);
                        _KernelInputQueue.enqueue(chr);
                    }
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
