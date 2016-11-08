/* ------------
   PCB.ts
   ------------ */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(state, number, cpu, memoryLimits, turnaroundTime, waitTime) {
            if (turnaroundTime === void 0) { turnaroundTime = 0; }
            if (waitTime === void 0) { waitTime = 0; }
            this.state = state;
            this.number = number;
            this.cpu = cpu;
            this.memoryLimits = memoryLimits;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
        }
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
