var TSOS;
(function (TSOS) {
    var OpCode = (function () {
        function OpCode(command, numArgs, func) {
            this.command = command;
            this.numArgs = numArgs;
            this.func = func;
        }
        return OpCode;
    }());
    TSOS.OpCode = OpCode;
})(TSOS || (TSOS = {}));
