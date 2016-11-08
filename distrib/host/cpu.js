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
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = ""; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.IR = IR;
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
            uc = new TSOS.OpCode("A9", 1, this.loadCommand);
            _OPCodes[_OPCodes.length] = uc;
            uc = new TSOS.OpCode("AD", 2, this.loadCommand);
            _OPCodes[_OPCodes.length] = uc;
            // STA
            uc = new TSOS.OpCode("8D", 2, this.storeCommand);
            _OPCodes[_OPCodes.length] = uc;
            //ADC
            uc = new TSOS.OpCode("6D", 2, this.add);
            _OPCodes[_OPCodes.length] = uc;
            //LDX
            uc = new TSOS.OpCode("A2", 1, this.loadX);
            _OPCodes[_OPCodes.length] = uc;
            uc = new TSOS.OpCode("AE", 2, this.loadX);
            _OPCodes[_OPCodes.length] = uc;
            //LDY
            uc = new TSOS.OpCode("A0", 1, this.loadY);
            _OPCodes[_OPCodes.length] = uc;
            uc = new TSOS.OpCode("AC", 2, this.loadY);
            _OPCodes[_OPCodes.length] = uc;
            //NOP
            uc = new TSOS.OpCode("EA", 0, this.noOp);
            _OPCodes[_OPCodes.length] = uc;
            //BRK
            uc = new TSOS.OpCode("00", 0, this.breakCommand);
            _OPCodes[_OPCodes.length] = uc;
            //CPX
            uc = new TSOS.OpCode("EC", 2, this.compare);
            _OPCodes[_OPCodes.length] = uc;
            //BNE        
            uc = new TSOS.OpCode("D0", 1, this.branch);
            _OPCodes[_OPCodes.length] = uc;
            //INC
            uc = new TSOS.OpCode("EE", 2, this.increment);
            _OPCodes[_OPCodes.length] = uc;
            //SYS
            uc = new TSOS.OpCode("FF", 0, this.sysCall);
            _OPCodes[_OPCodes.length] = uc;
        };
        Cpu.prototype.resetCpu = function () {
            _CPU.PC = 0;
            _CPU.Acc = 0;
            _CPU.Xreg = 0;
            _CPU.Yreg = 0;
            _CPU.Zflag = 0;
        };
        //Op Code function definitions
        Cpu.prototype.loadCommand = function (args) {
            if (args.length == 1) {
                _CPU.Acc = parseInt(args[0], 16);
            }
            else if (args.length == 2) {
                var currentPCB = _RunningQueue[_RunningPID];
                try {
                    var memLocString = args[1] + args[0];
                    var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                    if (memLocation >= currentPCB.memoryLimits.limit) {
                        TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                        _RunningQueue[_RunningPID] = "Terminated";
                    }
                    else {
                        var memVal = _CoreMemory.memory[memLocation];
                        _CPU.Acc = parseInt(memVal, 16);
                    }
                }
                catch (err) {
                    TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
            }
            else {
                TSOS.Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.storeCommand = function (args) {
            var currentPCB = _RunningQueue[_RunningPID];
            try {
                var memLocString = args[1] + args[0];
                var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                if (memLocation >= currentPCB.memoryLimits.limit) {
                    TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
                else {
                    _CoreMemory.memory[memLocation] = ("00" + _CPU.Acc.toString(16)).substr(-2);
                }
            }
            catch (err) {
                TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.add = function (args) {
            var currentPCB = _RunningQueue[_RunningPID];
            try {
                var memLocString = args[1] + args[0];
                var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                if (memLocation >= currentPCB.memoryLimits.limit) {
                    TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
                else {
                    var memVal = _CoreMemory.memory[memLocation];
                    _CPU.Acc = _CPU.Acc + parseInt(memVal, 16);
                }
            }
            catch (err) {
                TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.loadX = function (args) {
            if (args.length == 1) {
                _CPU.Xreg = parseInt(args[0], 16);
            }
            else if (args.length == 2) {
                var currentPCB = _RunningQueue[_RunningPID];
                try {
                    var memLocString = args[1] + args[0];
                    var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                    if (memLocation >= currentPCB.memoryLimits.limit) {
                        TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                        _RunningQueue[_RunningPID] = "Terminated";
                    }
                    else {
                        var memVal = _CoreMemory.memory[memLocation];
                        _CPU.Xreg = parseInt(memVal, 16);
                    }
                }
                catch (err) {
                    TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
            }
            else {
                TSOS.Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.loadY = function (args) {
            if (args.length == 1) {
                _CPU.Yreg = parseInt(args[0], 16);
            }
            else if (args.length == 2) {
                var currentPCB = _RunningQueue[_RunningPID];
                try {
                    var memLocString = args[1] + args[0];
                    var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                    if (memLocation >= currentPCB.memoryLimits.limit) {
                        TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                        _RunningQueue[_RunningPID] = "Terminated";
                    }
                    else {
                        var memVal = _CoreMemory.memory[memLocation];
                        _CPU.Yreg = parseInt(memVal, 16);
                    }
                }
                catch (err) {
                    TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
            }
            else {
                TSOS.Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.noOp = function (args) {
        };
        Cpu.prototype.breakCommand = function (args) {
            _ResidentQueue[_RunningPID].state = "Terminated";
            _CPU.resetCpu();
            var partition = _ResidentQueue[_RunningPID].memoryLimits.base;
            switch (partition) {
                case PART0_BASE:
                    _CoreMemory.clearFirstPartition;
                    _MemoryManager.firstPartitionAvailable = true;
                    break;
                case PART1_BASE:
                    _CoreMemory.clearSecondPartition;
                    _MemoryManager.secondPartitionAvailable = true;
                    break;
                case PART2_BASE:
                    _CoreMemory.clearThirdPartition;
                    _MemoryManager.thirdPartitionAvailable = true;
                    break;
                default:
                    TSOS.Control.hostLog("Invalid memory parameters", "CPU");
            }
        };
        Cpu.prototype.compare = function (args) {
            var currentPCB = _RunningQueue[_RunningPID];
            try {
                var memLocString = args[1] + args[0];
                var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                if (memLocation >= currentPCB.memoryLimits.limit) {
                    TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
                else {
                    var memVal = _CoreMemory.memory[memLocation];
                    if (_CPU.Xreg == parseInt(memVal, 16)) {
                        _CPU.Zflag = 1;
                    }
                }
            }
            catch (err) {
                TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.branch = function (args) {
            if (_CPU.Zflag == 1) {
                _CPU.PC = _CPU.PC + parseInt(args[0], 16);
                while (_CPU.PC > 255) {
                    _CPU.PC -= 256;
                }
                _CPU.Zflag = 0;
            }
        };
        Cpu.prototype.increment = function (args) {
            var currentPCB = _RunningQueue[_RunningPID];
            try {
                var memLocString = args[1] + args[0];
                var memLocation = parseInt(memLocString, 16) + currentPCB.memoryLimits.base;
                if (memLocation >= currentPCB.memoryLimits.limit) {
                    TSOS.Control.hostLog("Memory Out of Bounds. Terminating Program", "CPU");
                    _RunningQueue[_RunningPID] = "Terminated";
                }
                else {
                    var memVal = _CoreMemory.memory[memLocation];
                    var incrVal = parseInt(memVal, 16) + 1;
                    _CoreMemory.memory[memLocation] = incrVal.toString(16);
                }
            }
            catch (err) {
                TSOS.Control.hostLog("Invalid memory location. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.sysCall = function (args) {
            if (_CPU.Xreg == 1) {
                _StdOut.putText(_CPU.Yreg.toString());
            }
            else if (_CPU.Xreg == 2) {
                var currentPCB = _RunningQueue[_RunningPID];
                var gettingString = true;
                var stringToPrint = "";
                var i = _CPU.Yreg + currentPCB.memoryLimits.base;
                while (i < currentPCB.memoryLimits.limit && gettingString) {
                    var currentData = _CoreMemory.memory[i];
                    if (currentData == "00" || currentData.command == "00") {
                        gettingString = false;
                    }
                    else {
                        stringToPrint += String.fromCharCode(parseInt(currentData, 16));
                        i++;
                    }
                }
                _StdOut.putText(stringToPrint);
            }
            else {
                TSOS.Control.hostLog("Invalid number of arguments. Terminating Program", "CPU");
                _RunningQueue[_RunningPID] = "Terminated";
            }
        };
        Cpu.prototype.execute = function (fn, args) {
            fn(args);
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //Track PCB stats
            for (var i = 0; i < _RunningQueue.length; i++) {
                if (_RunningQueue[i]) {
                    if (_RunningQueue[i].state == "Waiting") {
                        _RunningQueue[i].waitTime++;
                        _ResidentQueue[i].waitTime++;
                    }
                    _RunningQueue[i].turnaroundTime++;
                    _ResidentQueue[i].turnaroundTime++;
                }
            }
            //Fetch
            var currentPCB = _RunningQueue[_RunningPID];
            if (currentPCB) {
                _CPU.PC = currentPCB.cpu.PC;
                _CPU.IR = currentPCB.cpu.IR;
                _CPU.Acc = currentPCB.cpu.Acc;
                _CPU.Xreg = currentPCB.cpu.Xreg;
                _CPU.Yreg = currentPCB.cpu.Yreg;
                _CPU.Zflag = currentPCB.cpu.Zflag;
            }
            else {
                _CPU.resetCpu();
            }
            var memoryAccess = _CPU.PC + currentPCB.memoryLimits.base;
            var fn = _CoreMemory.memory[memoryAccess].func;
            _CPU.IR = _CoreMemory.memory[memoryAccess].command;
            //Decode
            var args = Array();
            var counter = _CoreMemory.memory[memoryAccess].numArgs;
            while (counter > 0) {
                _CPU.PC++;
                memoryAccess++;
                var data = _CoreMemory.memory[memoryAccess];
                args.push(data);
                counter--;
            }
            _CPU.PC++;
            //Execute
            try {
                this.execute(fn, args);
            }
            catch (err) {
                TSOS.Control.hostLog("Invalid op code. Terminating Program", "CPU");
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
            if (_RunningQueue[_RunningPID].state != "Terminated") {
                storedCPU.isExecuting = true;
            }
            _ResidentQueue[_RunningPID].cpu = storedCPU;
            _RunningQueue[_RunningPID].cpu = storedCPU;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
