var TSOS;
(function (TSOS) {
    var ProcessMemory = (function () {
        function ProcessMemory(base, limit, data) {
            this.base = base;
            this.limit = limit;
            this.data = data;
        }
        return ProcessMemory;
    }());
    TSOS.ProcessMemory = ProcessMemory;
})(TSOS || (TSOS = {}));
