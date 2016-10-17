/* ------------
   PCB.ts
   ------------ */
var TSOS;
(function (TSOS) {
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
})(TSOS || (TSOS = {}));
