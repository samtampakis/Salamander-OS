module TSOS {
    export class ShellCommand {
        constructor(public func: any,
                    public command = "",
                    public description = "") {
        }
    }
    

    
    //Temporary hosting of PCB class
    export class PCB {
        constructor(public state,
                    public number,
                    public cpu,
                    public memoryLimits) {
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
