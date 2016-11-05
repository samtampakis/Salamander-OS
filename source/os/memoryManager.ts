module TSOS {
        export class MemoryManager {
        constructor(public firstPartitionAvailable: boolean = true,
                    public secondPartitionAvailable: boolean = true,
                    public thirdPartitionAvailable: boolean = true,) {
        }
    }
}