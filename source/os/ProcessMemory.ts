module TSOS {
        export class ProcessMemory {
        constructor(public base: number,
                    public limit: number,
                    public data: any[]) {
        }
    }
}