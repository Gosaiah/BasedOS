///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            // Check for backspace or Tab
            if (keyCode == 8)
            {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123)))    // a..z {
                {  
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else
            {
                if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                    (keyCode == 32)                     ||   // space
                    (keyCode == 13))                        // enter
                {                          
                    if(isShifted && ((keyCode >= 48) && (keyCode <= 57)))
                    {
                        switch(keyCode)
                        {
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
                                break
                        }
                    }                       
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                else
                {
                    // punctuation marks
                    
                }
            }
        }
    }
}
