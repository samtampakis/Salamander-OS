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
     
     Temporarily hosting the definition for core memory
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
