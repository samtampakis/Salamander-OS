/* ------------
   PCB.ts
   ------------ */

module TSOS {
    export class PCB {
        constructor(public state,
                    public number,
                    public cpu,
                    public memoryLimits) {
        }
    }
}