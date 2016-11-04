module TSOS {
    export class OpCode {
        constructor(public command: string,
                    public numArgs,
                    public func) {
        }
    }
}