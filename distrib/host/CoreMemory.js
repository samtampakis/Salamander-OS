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
        CoreMemory.prototype.clearMemory = function () {
            for (var i = 0; i < 768; i++) {
                _CoreMemory.memory[i] = "00";
            }
        };
        CoreMemory.prototype.clearFirstPartition = function () {
            for (var i = 0; i < 256; i++) {
                _CoreMemory.memory[i] = "00";
            }
        };
        CoreMemory.prototype.clearSecondPartition = function () {
            for (var i = 256; i < 512; i++) {
                _CoreMemory.memory[i] = "00";
            }
        };
        CoreMemory.prototype.clearThirdPartition = function () {
            for (var i = 512; i < 728; i++) {
                _CoreMemory.memory[i] = "00";
            }
        };
        return CoreMemory;
    }());
    TSOS.CoreMemory = CoreMemory;
})(TSOS || (TSOS = {}));
