/* ------------
   PCB.ts
   ------------ */

module TSOS {
    export class PCB {
        constructor(public state: string,
                    public number: number,
                    public cpu: Cpu,
                    public memoryLimits: ProcessMemory,
                    public priority: number,
                    public storedLocation: string,
                    public turnaroundTime: number = 0,
                    public waitTime: number = 0) {
        }
    }
}