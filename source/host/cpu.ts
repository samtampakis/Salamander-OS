///<reference path="../globals.ts" />
///<reference path="../os/shell.ts" />

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
     
     Temporarily hosting the definition for core memory and op codes here because constructor is not being recognized when it
     is hosted in its own file.
     ------------ */

module TSOS {

    export class Cpu {

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
            
            _OPCodes = [];
            //
            // Load the opCodes list.

            // LDA
           /* uc = new OpCode("A9", 1, this.loadCommand);
            _OPCodes[_OPCodes.length] = uc;
            
            uc = new OpCode("AD", 2, this.loadCommand);
            _OPCodes[_OPCodes.length] = uc;            

            // STA
            uc = new OpCode("8D", 2, this.storeCommand);
            _OPCodes[_OPCodes.length] = uc;
        
            //ADC
            uc = new OpCode("6D", 2, this.add);
            _OPCodes[_OPCodes.length] = uc;
        
            //LDX
            uc = new OpCode("A2", 1, this.loadX);
            _OPCodes[_OPCodes.length] = uc;
            
            uc = new OpCode("AE", 2, this.loadX);
            _OPCodes[_OPCodes.length] = uc;            
        
            //LDY
            uc = new OpCode("A0", 1, this.loadY);
            _OPCodes[_OPCodes.length] = uc;
        
            uc = new OpCode("AC", 2, this.loadY);
            _OPCodes[_OPCodes.length] = uc;
        
            //NOP
            uc = new OpCode("EA", 0, null);
            _OPCodes[_OPCodes.length] = uc;
        
            //BRK
            uc = new OpCode("00", 0, shellBreak());
            _OPCodes[_OPCodes.length] = uc;
        
            //CPX
            uc = new OpCode("EC", 2, this.compare);
            _OPCodes[_OPCodes.length] = uc;
        
            //BNE        
            uc = new OpCode("D0", 1, this.branch);
            _OPCodes[_OPCodes.length] = uc;
        
            //INC
            uc = new OpCode("EE", 2, this.increment);
            _OPCodes[_OPCodes.length] = uc;
        
            //SYS
            uc = new OpCode("FF", 0, this.sysCall);
            _OPCodes[_OPCodes.length] = uc;*/
        }
        


        public execute(fn, args?) {
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
        }
        


        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            
            //Fetch
            var runningPCB = _PCBArray[_RunningPID];
            
            //Decode
            var fn = _CoreMemory.memory[_CoreMemory.currentLocation];
            _CoreMemory.currentLocation++;
            var args = Array();
            var counter = fn.numArgs;
            while(counter > 0){
                args.push(_CoreMemory[_CoreMemory.currentLocation]);
                _CoreMemory.currentLocation++;
                counter --;
            }            
            
            //Execute
            this.execute(fn, args);
            _PCBArray[_RunningPID].memoryLimits.base = _CoreMemory.currentLocation;
            
            }
            
            //Functions for executing commands
    }
    
    //Temporary hosting of CoreMemory class
    export class CoreMemory {
        constructor(public memory = [],
                    public currentLocation = 0) {
        }
    }
    
    //Temporary hosting of OpCode class
    export class OpCode {
        constructor(public command,
                    public numArgs,
                    public func) {
        }
    }
}
