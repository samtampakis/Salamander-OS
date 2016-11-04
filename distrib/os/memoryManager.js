var TSOS;
(function (TSOS) {
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
