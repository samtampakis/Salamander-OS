/* ------------
   PCB.ts
   ------------ */

module TSOS {
    export class PCB {
        constructor(public state,
                    public number,
                    public counter,
                    public instructionReg,
                    public accumulator,
                    public xReg,
                    public yReg,
                    public zFlag,
                    public memoryLimits,
                    public thread) {
        }
    }
}