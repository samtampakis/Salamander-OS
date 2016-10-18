///<reference path="../globals.ts" />
///<reference path="../os/userCommand.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     
     Temporarily hosting the definition for core memory here because constructor is not being recognized when it
     is hosted in its own file.
     ------------ */

module TSOS {

    export class Cpu {
        
        public opCodes = [];

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            
            var uc;
            //
            // Load the opCodes list.

            // LDA
            uc = new UserCommand("A9");
            this.opCodes[this.opCodes.length] = uc;
            
            uc = new UserCommand("AD");
            this.opCodes[this.opCodes.length] = uc;            

            // STA
            uc = new UserCommand("8D");
            this.opCodes[this.opCodes.length] = uc;
        
            //ADC
            uc = new UserCommand("6D");
            this.opCodes[this.opCodes.length] = uc;
        
            //LDX
            uc = new UserCommand("A2");
            this.opCodes[this.opCodes.length] = uc;
            
            uc = new UserCommand("AE");
            this.opCodes[this.opCodes.length] = uc;            
        
            //LDY
            uc = new UserCommand("A0");
            this.opCodes[this.opCodes.length] = uc;
        
            uc = new UserCommand("AC");
            this.opCodes[this.opCodes.length] = uc;
        
            //NOP
            uc = new UserCommand("EA");
            this.opCodes[this.opCodes.length] = uc;
        
            //BRK
            uc = new UserCommand("00");
            this.opCodes[this.opCodes.length] = uc;
        
            //CPX
            uc = new UserCommand("EC");
            this.opCodes[this.opCodes.length] = uc;
        
            //BNE        
            uc = new UserCommand("D0");
            this.opCodes[this.opCodes.length] = uc;
        
            //INC
            uc = new UserCommand("EE");
            this.opCodes[this.opCodes.length] = uc;
        
            //SYS
            uc = new UserCommand("FF");
            this.opCodes[this.opCodes.length] = uc;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
    }
    
    export class CoreMemory {
        constructor(public memory = []) {
        }
    }
}
