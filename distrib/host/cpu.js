///<reference path="../globals.ts" />
///<reference path="../os/userCommand.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.opCodes = [];
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            var uc;
            //
            // Load the opCodes list.
            // LDA
            uc = new TSOS.UserCommand("A9");
            this.opCodes[this.opCodes.length] = uc;
            uc = new TSOS.UserCommand("AD");
            this.opCodes[this.opCodes.length] = uc;
            // STA
            uc = new TSOS.UserCommand("8D");
            this.opCodes[this.opCodes.length] = uc;
            //ADC
            uc = new TSOS.UserCommand("6D");
            this.opCodes[this.opCodes.length] = uc;
            //LDX
            uc = new TSOS.UserCommand("A2");
            this.opCodes[this.opCodes.length] = uc;
            uc = new TSOS.UserCommand("AE");
            this.opCodes[this.opCodes.length] = uc;
            //LDY
            uc = new TSOS.UserCommand("A0");
            this.opCodes[this.opCodes.length] = uc;
            uc = new TSOS.UserCommand("AC");
            this.opCodes[this.opCodes.length] = uc;
            //NOP
            uc = new TSOS.UserCommand("EA");
            this.opCodes[this.opCodes.length] = uc;
            //BRK
            uc = new TSOS.UserCommand("00");
            this.opCodes[this.opCodes.length] = uc;
            //CPX
            uc = new TSOS.UserCommand("EC");
            this.opCodes[this.opCodes.length] = uc;
            //BNE        
            uc = new TSOS.UserCommand("D0");
            this.opCodes[this.opCodes.length] = uc;
            //INC
            uc = new TSOS.UserCommand("EE");
            this.opCodes[this.opCodes.length] = uc;
            //SYS
            uc = new TSOS.UserCommand("FF");
            this.opCodes[this.opCodes.length] = uc;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
