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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
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
        };
        //Op Code function definitions
        Cpu.prototype.loadCommand = function (args) {
            console.log("in loadCommand");
            if (args.length == 1) {
                console.log("branch 1");
                console.log(args[0]);
                this.Acc = parseInt(args[0], 16);
            }
            else if (args.length == 2) {
                var memLocation = args[0] + args[1];
                this.Acc = _CoreMemory.memory[parseInt(memLocation, 16)];
            }
        };
        Cpu.prototype.storeCommand = function (args) {
            var memLocation = args[0] + args[1];
            _CoreMemory.memory[parseInt(memLocation, 16)] = this.Acc;
        };
        Cpu.prototype.add = function (args) {
            var memLocation = args[0] + args[1];
            this.Acc = this.Acc + _CoreMemory.memory[parseInt(memLocation, 16)];
        };
        Cpu.prototype.loadX = function (args) {
            if (args.length == 1) {
                this.Xreg = parseInt(args[0], 16);
            }
            else if (args.length == 2) {
                var memLocation = args[0] + args[1];
                this.Xreg = _CoreMemory.memory[parseInt(memLocation, 16)];
            }
        };
        Cpu.prototype.loadY = function (args) {
            if (args.length == 1) {
                this.Yreg = parseInt(args[0], 16);
            }
            else if (args.length == 2) {
                var memLocation = args[0] + args[1];
                this.Yreg = _CoreMemory.memory[parseInt(memLocation, 16)];
            }
        };
        Cpu.prototype.noOp = function (args) {
        };
        Cpu.prototype.breakCommand = function (args) {
            _CPU.isExecuting = false;
        };
        Cpu.prototype.compare = function (args) {
            var memLocation = args[0] + args[1];
            var memVal = _CoreMemory.memory[parseInt(memLocation, 16)];
            if (this.Xreg == parseInt(memVal, 16)) {
                this.Zflag = 1;
            }
        };
        Cpu.prototype.branch = function (args) {
            if (this.Zflag == 0) {
                this.PC = this.PC + parseInt(args[0], 16) - 1;
            }
        };
        Cpu.prototype.increment = function (args) {
            var memLocation = args[0] + args[1];
            var memVal = _CoreMemory.memory[parseInt(memLocation, 16)];
            memVal++;
            _CoreMemory.memory[parseInt(memLocation, 16)] = memVal;
        };
        Cpu.prototype.sysCall = function (args) {
            if (this.Xreg == 1) {
                _StdOut.putText(this.Yreg);
            }
            else if (this.Xreg == 2) {
                var stringCode = this.Yreg;
                _StdOut.putText(String.fromCharCode(stringCode));
            }
        };
        Cpu.prototype.execute = function (fn, args) {
            _StdOut.advanceLine();
            console.log("in execute");
            fn(args);
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            console.log(_CoreMemory.memory[_CoreMemory.currentLocation]);
            //Fetch
            var fn = _CoreMemory.memory[_CoreMemory.currentLocation].func;
            //Decode
            var args = Array();
            var counter = _CoreMemory.memory[_CoreMemory.currentLocation].numArgs;
            TSOS.Control.displayRunningStatus(_CoreMemory.memory[_CoreMemory.currentLocation].command);
            while (counter > 0) {
                _CoreMemory.currentLocation += 2;
                var data = parseInt(_CoreMemory.memory[_CoreMemory.currentLocation] + _CoreMemory.memory[_CoreMemory.currentLocation + 1], 16);
                args.push(data);
                counter--;
            }
            console.log(args);
            _CoreMemory.currentLocation += 2;
            //Execute
            this.execute(fn, args);
            console.log(this);
            _PCBArray[_RunningPID].cpu = this;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
    //Temporary hosting of CoreMemory class
    var CoreMemory = (function () {
        function CoreMemory(memory, currentLocation) {
            if (memory === void 0) { memory = []; }
            if (currentLocation === void 0) { currentLocation = 0; }
            this.memory = memory;
            this.currentLocation = currentLocation;
        }
        return CoreMemory;
    }());
    TSOS.CoreMemory = CoreMemory;
    //Temporary hosting of OpCode class
    var OpCode = (function () {
        function OpCode(command, numArgs, func) {
            this.command = command;
            this.numArgs = numArgs;
            this.func = func;
        }
        return OpCode;
    }());
    TSOS.OpCode = OpCode;
})(TSOS || (TSOS = {}));
