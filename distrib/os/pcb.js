/* ------------
   PCB.ts
   ------------ */
var TSOS;
(function (TSOS) {
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
})(TSOS || (TSOS = {}));
