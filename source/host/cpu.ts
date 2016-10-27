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
                    public IR: string = "",
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
            uc = new OpCode("A9", 1, this.loadCommand);
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
            uc = new OpCode("EA", 0, this.noOp);
            _OPCodes[_OPCodes.length] = uc;
        
            //BRK
            uc = new OpCode("00", 0, this.breakCommand);
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
            _OPCodes[_OPCodes.length] = uc;
        }
        
        //Op Code function definitions
       public loadCommand(args){
           console.log("in loadCommand");
           if(args.length == 1){
               console.log("branch 1");
               console.log(parseInt(args[0], 16));
               _CPU.Acc = parseInt(args[0], 16);
           }               
           else if(args.length == 2){
               var memLocation = args[0] + args[1];
               _CPU.Acc = _CoreMemory.memory[parseInt(memLocation, 16)];
           }
       }
       
       public storeCommand(args){
           var memLocation = args[0] + args[1];
           _CoreMemory.memory[parseInt(memLocation, 16)] = _CPU.Acc;
       }

       public add(args){
           var memLocation = args[0] + args[1];
           _CPU.Acc = _CPU.Acc + _CoreMemory.memory[parseInt(memLocation, 16)];
       }
       
       public loadX(args){
           if(args.length == 1){
               _CPU.Xreg = parseInt(args[0], 16);
           } else if (args.length == 2){
               var memLocation = args[0] + args[1];
               _CPU.Xreg = _CoreMemory.memory[parseInt(memLocation, 16)];
           }
       }
       
       public loadY(args){
           if(args.length == 1){
               _CPU.Yreg = parseInt(args[0], 16);
           } else if (args.length == 2){
               var memLocation = args[0] + args[1];
               _CPU.Yreg = _CoreMemory.memory[parseInt(memLocation, 16)];
           }
       }
       
       public noOp(args){
       }
       
       public breakCommand(args){
            _CPU.isExecuting = false;
       }
       
       public compare(args){
            var memLocation = args[0] + args[1];
            var memVal = _CoreMemory.memory[parseInt(memLocation, 16)];
            if(_CPU.Xreg == parseInt(memVal, 16)){
                _CPU.Zflag = 1;
            }
       }
       
       public branch(args){
           if(_CPU.Zflag == 0){
                _CPU.PC = _CPU.PC + parseInt(args[0], 16) - 1;
           }
       }
       
       public increment(args){
           var memLocation = args[0] + args[1];
           var memVal = _CoreMemory.memory[parseInt(memLocation, 16)];
           memVal ++;
           _CoreMemory.memory[parseInt(memLocation, 16)] = memVal;
       }
       
       public sysCall(args){
           console.log("in FF");
           if(_CPU.Xreg == 1){
               console.log("branch 1");
               console.log(_CPU.Yreg.toString());
               _StdOut.putText(_CPU.Yreg.toString());
           } else if (_CPU.Xreg == 2){
               var stringCode = _CPU.Yreg;
                _StdOut.putText(String.fromCharCode(stringCode));
           }
       }

        public execute(fn, args?) {
            _StdOut.advanceLine();
            console.log("in execute");
            fn(args);
        }
        


        public cycle(): void {
            Control.displayRunningStatus();
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            
            console.log(_CoreMemory.memory[_CoreMemory.currentLocation]);
            console.log(_CPU);
            
            //Fetch
            
            var fn = _CoreMemory.memory[_CoreMemory.currentLocation].func;
            
            //Decode

            var args = Array();  
            var counter = _CoreMemory.memory[_CoreMemory.currentLocation].numArgs;
            
            
            while (counter > 0){
              _CoreMemory.currentLocation++;
              var data = _CoreMemory.memory[_CoreMemory.currentLocation] + _CoreMemory.memory[_CoreMemory.currentLocation + 1];
              args.push(data);             
              counter --;
            }
            _CoreMemory.currentLocation++;
                        
            
            //Execute
            this.execute(fn, args);
            _PCBArray[_RunningPID].cpu = _CPU;
            
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
