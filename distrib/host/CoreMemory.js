/* ------------
   CoreMemory.ts
   ------------ */
var TSOS;
(function (TSOS) {
    var CoreMemory = (function () {
        function CoreMemory(memory) {
            if (memory === void 0) { memory = []; }
            this.memory = memory;
        }
        return CoreMemory;
    }());
    TSOS.CoreMemory = CoreMemory;
})(TSOS || (TSOS = {}));
