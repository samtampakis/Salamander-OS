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
        
        public resetCpu(){
            _CPU.PC = 0;
            _CPU.Acc = 0;
            _CPU.Xreg = 0;
            _CPU.Yreg = 0;
            _CPU.Zflag = 0;
        }
        
        //Op Code function definitions
       public loadCommand(args){
           if(args.length == 1){
               console.log("A9");
               _CPU.Acc = parseInt(args[0], 16);
               console.log(_CPU.Acc);
           }               
           else if(args.length == 2){
               var currentPCB = _RunningQueue[_RunningPID];
               try{
                   var memLocation = args[1] + args[0];
                   var memVal = _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base];
               } catch(err){
                    Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
               }
               _CPU.Acc = parseInt(memVal, 16);
           } else{
                Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
           }
       }
       
       public storeCommand(args){
           var currentPCB = _RunningQueue[_RunningPID];
           console.log("store command");
           try{
                var memLocation = args[1] + args[0];
                _CoreMemory.memory[parseInt(memLocation, 16)  + currentPCB.memoryLimits.base] = _CPU.Acc.toString(16);
           } catch(err){
                Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
           }
       }

       public add(args){
           console.log("add command");
           var currentPCB = _RunningQueue[_RunningPID];
           try{
               var memLocation = args[1] + args[0];
               var memVal = _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base];
               _CPU.Acc = _CPU.Acc + parseInt(memVal, 16);
               console.log(_CPU.Acc);
            } catch(err){
                Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
       }
       
       public loadX(args){
           console.log("load X");
           if(args.length == 1){
               console.log("branch 1");
               _CPU.Xreg = parseInt(args[0], 16);
               console.log(_CPU.Xreg);
           } else if (args.length == 2){
               console.log("branch 2");
               var currentPCB = _RunningQueue[_RunningPID];
               try{
                   var memLocation = args[1] + args[0];
                   var memVal = _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base];
                   _CPU.Xreg = parseInt(memVal, 16);
                   console.log(_CPU.Xreg);
                } catch(err){
                    Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
           } else{
                Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
           }
       }
       
       public loadY(args){
           console.log("load Y");
           if(args.length == 1){
               console.log("branch 1");
               _CPU.Yreg = parseInt(args[0], 16);
               console.log(_CPU.Yreg);
           } else if (args.length == 2){
               console.log("branch 2");
               var currentPCB = _RunningQueue[_RunningPID];
               try{
                   var memLocation = args[1] + args[0];
                   var memVal = _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base];
                   _CPU.Yreg = parseInt(memVal, 16);
                   console.log(_CPU.Yreg);
                } catch(err){
                    Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
           } else{
                Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
           }
       }
       
       public noOp(args){
       }
       
       public breakCommand(args){
            _ResidentQueue[_RunningPID].state = "Terminated";
            _CPU.resetCpu();
            var partition = _ResidentQueue[_RunningPID].memoryLimits.base;
            
            switch(partition){
                case 0:
                    _CoreMemory.clearFirstPartition;
                    _MemoryManager.firstPartitionAvailable = true;
                    break;
                case 256:
                    _CoreMemory.clearSecondPartition;
                    _MemoryManager.secondPartitionAvailable = true;
                    break;                
                case 512:
                    _CoreMemory.clearThirdPartition;
                    _MemoryManager.thirdPartitionAvailable = true;
                    break; 
                default:
                    Control.hostLog("Invalid memory parameters", "CPU");
            }                    
       }
       
       public compare(args){
            var currentPCB = _RunningQueue[_RunningPID];
            try{
                var memLocation = args[1] + args[0];
                var memVal = _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base];
            } catch(err){
                Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
            if(_CPU.Xreg == parseInt(memVal, 16)){
                _CPU.Zflag = 1;
            }
       }
       
       public branch(args){
           if(_CPU.Zflag == 0){
                _CPU.PC = _CPU.PC + parseInt(args[0], 16);
                while(_CPU.PC > 255){
                    _CPU.PC -= 256;
                }
           }
       }
       
       public increment(args){
           var currentPCB = _RunningQueue[_RunningPID];
           try{
               var memLocation = args[1] + args[0];
               var memVal = _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base];
           } catch(err){
               Control.hostLog("Invalid memory location. Terminating Program", "CPU");
               _RunningQueue[_RunningPID] = "Terminated";
           }
           _CoreMemory.memory[parseInt(memLocation, 16) + currentPCB.memoryLimits.base] = parseInt(memVal, 16) + 1;
       }
       
       public sysCall(args){
           console.log("SysCall");
           if(_CPU.Xreg == 1){
               console.log("branch 1");
               _StdOut.putText(_CPU.Yreg.toString());
           } else if (_CPU.Xreg == 2){
               console.log("branch 2");
               var currentPCB = _RunningQueue[_RunningPID];
               var gettingString = true;
               var stringToPrint = "";
               var i = _CPU.Yreg + currentPCB.memoryLimits.base;
               while(i < currentPCB.memoryLimits.limit && gettingString){
                   var currentData = _CoreMemory.memory[i];
                   if (currentData == 0){
                       gettingString = false;
                   } else{
                        stringToPrint += String.fromCharCode(parseInt(currentData, 16));
                        i++;
                   }
               }
                _StdOut.putText(stringToPrint);
           } else{
                Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
           }
       }

        public execute(fn, args?) {
            fn(args);
        }
        


        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            
            //Track PCB stats
            for(var i = 0; i < _RunningQueue.length; i++){
                if(_RunningQueue[i]){
                    if(_RunningQueue[i].state == "Waiting"){
                        _RunningQueue[i].waitTime++;
                        _ResidentQueue[i].waitTime++;
                    }
                    _RunningQueue[i].turnaroundTime++;
                    _ResidentQueue[i].turnaroundTime++;
                }
            }
            
            //Fetch
            var currentPCB = _RunningQueue[_RunningPID];
            var memoryAccess = _CPU.PC + currentPCB.memoryLimits.base;
            var fn = _CoreMemory.memory[memoryAccess].func;
            _CPU.IR = _CoreMemory.memory[memoryAccess].command;
            
            //Decode

            var args = Array();  
            var counter = _CoreMemory.memory[memoryAccess].numArgs;
            
            
            while (counter > 0){
              _CPU.PC++;
              memoryAccess++;
              var data = _CoreMemory.memory[memoryAccess];
              args.push(data);             
              counter --;
            }
            _CPU.PC++;
                        
            
            //Execute
            try{
                this.execute(fn, args);
            } catch(err){
                Control.hostLog("Invalid op code. Terminating Program", "CPU");
                _RunningQueue[_RunningPID].state = "Terminated";
            }
            
            //Save CPU data in PCB
            var storedCPU = new Cpu();
            storedCPU.PC = _CPU.PC;
            storedCPU.IR = _CPU.IR;
            storedCPU.Acc = _CPU.Acc;
            storedCPU.Xreg = _CPU.Xreg;
            storedCPU.Yreg = _CPU.Yreg;
            storedCPU.Zflag = _CPU.Zflag;
            if( _RunningQueue[_RunningPID].state != "Terminated"){
                storedCPU.isExecuting = true;    
            } 
            
            _ResidentQueue[_RunningPID].cpu = storedCPU;
            _RunningQueue[_RunningPID].cpu = storedCPU;
        }
    }
}
