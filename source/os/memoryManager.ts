module TSOS {
        export class MemoryManager {
        constructor(public base: number,
                    public limit: number,
                    public data: string = null) {
        }
    }
}