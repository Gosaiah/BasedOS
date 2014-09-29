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
            // Check for backspace or Tab
            if (keyCode == 8) {
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
                _KernelInputQueue.enqueue(chr);
            } else {
                if (((keyCode >= 48) && (keyCode <= 57)) || (keyCode == 32) || (keyCode == 13)) {
                    if (isShifted && ((keyCode >= 48) && (keyCode <= 57))) {
                        switch (keyCode) {
                            case 48:
                                // )
                                keyCode = 41;
                                break;

                            case 49:
                                // !
                                keyCode = 33;
                                break;
                            case 50:
                                // @
                                keyCode = 64;
                                break;

                            case 51:
                                // #
                                keyCode = 35;
                                break;
                            case 52:
                                // $
                                keyCode = 36;
                                break;

                            case 53:
                                // %
                                keyCode = 37;
                                break;
                            case 54:
                                // ^
                                keyCode = 94;
                                break;

                            case 55:
                                // &
                                keyCode = 33;
                                break;
                            case 56:
                                // *
                                keyCode = 42;
                                break;

                            case 57:
                                // (
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
                    // punctuation marks
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
