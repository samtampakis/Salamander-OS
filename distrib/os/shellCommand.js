var TSOS;
(function (TSOS) {
    var ShellCommand = (function () {
        function ShellCommand(func, command, description) {
            if (command === void 0) { command = ""; }
            if (description === void 0) { description = ""; }
            this.func = func;
            this.command = command;
            this.description = description;
        }
        return ShellCommand;
    }());
    TSOS.ShellCommand = ShellCommand;
    //Temporary hosting of OpCode class
    var OpCode = (function () {
        function OpCode(func, numParams) {
            if (numParams === void 0) { numParams = ""; }
            this.func = func;
            this.numParams = numParams;
        }
        return OpCode;
    }());
    TSOS.OpCode = OpCode;
    //Temporary hosting of PCB class
    var PCB = (function () {
        function PCB(state, number, counter, instructionReg, accumulator, xReg, yReg, zFlag, memoryLimits, thread) {
            this.state = state;
            this.number = number;
            this.counter = counter;
            this.instructionReg = instructionReg;
            this.accumulator = accumulator;
            this.xReg = xReg;
            this.yReg = yReg;
            this.zFlag = zFlag;
            this.memoryLimits = memoryLimits;
            this.thread = thread;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
    //Temporary hosting of memoryManager class
    var MemoryManager = (function () {
        function MemoryManager(base, limit, data) {
            if (data === void 0) { data = null; }
            this.base = base;
            this.limit = limit;
            this.data = data;
        }
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
