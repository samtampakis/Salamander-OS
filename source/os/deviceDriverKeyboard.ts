///<reference path="../globals.ts" />
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

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 8)                      ||   // backspace
                        (keyCode == 13)                     ||   // enter
                        (keyCode == 38)                     ||   // up arrow
                        (keyCode == 40)){                        // down arrow
                
                // Convert Arrows into non-printable characters
                if ((keyCode == 38) || (keyCode == 40)){
                    keyCode -= 20;
                }
                
                
                //Convert digits to Special Characters if Shifted
                if (isShifted){
                    if(keyCode == 48){
                        keyCode = 40;
                    } else if (keyCode == 49){
                        keyCode = 33;
                    } else if (keyCode == 50){
                        keyCode = 64;
                    } else if ((keyCode >= 51) && (keyCode <= 53)){
                        keyCode -= 16;
                    } else if (keyCode == 54){
                        keyCode = 94;
                    } else if (keyCode == 55){
                        keyCode = 38;
                    } else if (keyCode == 56){
                        keyCode = 42;
                    } else if (keyCode == 57){
                        keyCode = 41;
                    }
                    
                    
                    
                }
                
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 186) && (keyCode <= 192)) || 
                       ((keyCode >= 219) && (keyCode <= 222))) {

                //Special Characters
                //Convert keyCode to charCode
                
                if(isShifted){
                 
                    //Characters that require shift key
                    
                    if(keyCode == 186){
                        keyCode = 58;
                    } else if (keyCode == 187){
                        keyCode = 43;
                    } else if (keyCode == 188){
                        keyCode = 60;
                    } else if (keyCode == 189){
                        keyCode = 95;
                    } else if (keyCode == 190){
                        keyCode = 62;
                    } else if (keyCode == 191){
                        keyCode = 63;
                    } else if (keyCode == 192){
                        keyCode = 126;
                    } else if ((keyCode >= 219) && (keyCode <= 221)){
                        keyCode -= 96;
                    } else if (keyCode == 222){
                        keyCode = 34;
                    }
                    
                } else{
                    
                    //Characters that don't require shift key
                                
                    if(keyCode == 186){
                        keyCode = 59;
                    } else if (keyCode == 187){
                        keyCode = 61;
                    } else if ((keyCode >= 188) && (keyCode <= 191)){
                        keyCode -= 144;
                    } else if (keyCode == 192){
                        keyCode = 96;
                    } else if ((keyCode >= 219) && (keyCode <= 221)){
                        keyCode -= 128;
                    } else if (keyCode == 222){
                        keyCode = 39;
                    }
                
                }

                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
