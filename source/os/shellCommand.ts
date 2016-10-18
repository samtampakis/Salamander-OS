module TSOS {
    export class ShellCommand {
        constructor(public func: any,
                    public command = "",
                    public description = "") {
        }
    }
    
    //Temporary hosting of OpCode class
    
    export class OpCode {
        constructor(public func: any,
                    public numParams = "") {
        }
    }
    
    //Temporary hosting of PCB class
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
    
    //Temporary hosting of memoryManager class
    
    export class MemoryManager {
        constructor(public base: number,
                    public limit: number,
                    public data: any[] = null) {
        }
    }
    
}
