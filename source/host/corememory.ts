/* ------------
   CoreMemory.ts
   ------------ */

module TSOS {
    export class CoreMemory {
        constructor(public memory = []) {
        }
    
    public clearMemory():void{
        for(var i = 0; i < 768; i++){
            _CoreMemory.memory[i] = "00";
        }        
    }
    
    public clearFirstPartition():void{
        for(var i = 0; i < 256; i++){
            _CoreMemory.memory[i] = "00";
        }
    }
    
    public clearSecondPartition():void{
        for(var i = 256; i < 512; i++){
            _CoreMemory.memory[i] = "00";
        }
    }
    
    public clearThirdPartition():void{
        for(var i = 512; i < 728; i++){
            _CoreMemory.memory[i] = "00";
        }
    }
    }
}