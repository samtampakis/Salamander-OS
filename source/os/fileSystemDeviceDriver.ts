///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   FileSystemDeviceDriver.ts

   Requires deviceDriver.ts
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class FileSystemDeviceDriver extends DeviceDriver {

        constructor() {
            super();
            this.driverEntry = this.krnFSDriverEntry;
        }

        public krnFSDriverEntry() {
            this.status = "loaded";
        }
  
        public format(): void{
            //Initialize MBR
            sessionStorage.setItem("000", "-"+EMPTY_MEMORY);
                
            //Initialize Directory
            for(var s = 0; s < 8; s++){
                for(var b = 0; b < 8; b++){
                    if(!(s==0 && b==0)){
                        sessionStorage.setItem("0"+s+b, "0"+EMPTY_MEMORY)
                    }
                }
            }
                
            //Initialize Files
            for (var t = 1; t < 4; t++){
                for(var s = 0; s < 8; s++){
                    for(var b = 0; b < 8; b++){
                        sessionStorage.setItem(""+t+s+b, "0"+EMPTY_MEMORY)
                    }
                }
            }
        }
    }
}