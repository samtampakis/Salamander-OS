var TSOS;
(function (TSOS) {
    var OpCode = (function () {
        function OpCode(func, numParams) {
            if (numParams === void 0) { numParams = ""; }
            this.func = func;
            this.numParams = numParams;
        }
        return OpCode;
    }());
    TSOS.OpCode = OpCode;
})(TSOS || (TSOS = {}));
