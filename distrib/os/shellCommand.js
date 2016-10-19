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
    //Temporary hosting of PCB class
    var PCB = (function () {
        function PCB(state, number, cpu, memoryLimits) {
            this.state = state;
            this.number = number;
            this.cpu = cpu;
            this.memoryLimits = memoryLimits;
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
