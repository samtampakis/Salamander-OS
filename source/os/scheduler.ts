module TSOS {
    export class Scheduler {
        constructor(public roundRobin = true,
                    public counter = 0) {
        }
        
        public switchContextRR(){
            var deletePCB = false;
            
            if(_RunningQueue[_RunningPID].state == "Terminated"){
                this.counter = _Quantum;
                deletePCB = true;
                var lookingForProg = true;
                var i = 0;
                
                //See if other programs are currently running
                while(i < _RunningQueue.length && lookingForProg){
                    if(_RunningQueue[i] && i != _RunningPID){
                        console.log(_RunningQueue[i]);
                        lookingForProg = false;
                    }
                    i++;
                }
                if(lookingForProg){
                    Control.hostLog("CPU not executing", "Scheduler");
                    _CPU.isExecuting = false;
                }
            }
            if(_Scheduler.counter < _Quantum){
                _Scheduler.counter ++;
            } else if (_CPU.isExecuting){
                var interrupt = null;
                var i = _RunningPID + 1; 
                var lookingForNextPid = true;
                while(i != _RunningPID && lookingForNextPid){
                    if(_RunningQueue[i]){
                        if(_RunningQueue[i].memoryLimits.base == MEMORY_LIMIT){
                            this.rollOut(_RunningPID, i);
                        }

                        interrupt = new Interrupt(SWITCH_IRQ, i);
                        lookingForNextPid = false;
                    }
                    if(i > _RunningQueue.length){
                        i = 0;
                    } else{
                        i++;    
                    }
                }
                
                if(deletePCB){
                    delete _RunningQueue[_RunningPID];
                }
                
                if (interrupt){
                    Control.hostLog("Round Robin Context Switch", "Scheduler");
                    console.log("INTERRUPT -- HORN BUSTER");
                    _KernelInterruptQueue.enqueue(interrupt);
                } else{
                    Control.hostLog("No Context Switch", "Scheduler");
                }
                _Scheduler.counter = 0;
                
                
            }
        }
        
        public switchContextPriority(){
            if(_RunningQueue[_RunningPID].state == "Terminated"){
                delete _RunningQueue[_RunningPID];
                var lookingForProg = true;
                var i = 0;
                
                //See if other programs are currently running
                while(i < _RunningQueue.length && lookingForProg){
                    if(_RunningQueue[i]){
                        lookingForProg = false;
                    }
                    i++;
                }
                if(lookingForProg){
                    Control.hostLog("CPU not executing", "Scheduler");
                    _CPU.isExecuting = false;
                }
            
                if (_CPU.isExecuting){
                    var interrupt = null;
                    var topPriority = Number.MAX_VALUE;
                    
                    for(var i = 0; i < _RunningQueue.length; i++){
                        if(_RunningQueue[i].priority <= topPriority){
                            topPriority = _RunningQueue[i].priority;
                            _RunningPID = i;
                        }
                    }
                    
                    interrupt = new Interrupt(SWITCH_IRQ, _RunningPID);
                    
                    
                    if (interrupt){
                        Control.hostLog("Priority Context Switch", "Scheduler");
                        console.log("INTERRUPT -- HORN BUSTER");
                        _KernelInterruptQueue.enqueue(interrupt);
                    } 
                }
            }
            
        }
        
        public rollOut(residentPID, diskPID){
            console.log("Roll Out");
            var residentPCB = _RunningQueue[residentPID];
            var diskPCB = _RunningQueue[diskPID];
            
            console.log(residentPCB.memoryLimits.data);
            console.log(diskPCB.memoryLimits.data);
            
            //Move running process to disk
            
            _krnFileSystemDriver.createFile("Process"+residentPID);
            var newFileLocation = _krnFileSystemDriver.locationOfFile("Process" + residentPID);
            var fileData = "";
            for(var l = 0; l < residentPCB.memoryLimits.data.length; l++){
                if(typeof residentPCB.memoryLimits.data[l] == "string"){
                    fileData += residentPCB.memoryLimits.data[l];
                } else {
                    fileData += residentPCB.memoryLimits.data[l].command;
                }
            }
                    
            _krnFileSystemDriver.write(newFileLocation, fileData);
        
            //Load process from disk
        
            var j = 0;
            for(var i = residentPCB.memoryLimits.base; i < residentPCB.memoryLimits.limit; i++){
                if(diskPCB.memoryLimits.data[j]){
                    _CoreMemory.memory[i] = diskPCB.memoryLimits.data[j];
                } else {
                    _CoreMemory.memory[i] = "00";
                }
                j++;
            }
             console.log(_CoreMemory.memory[residentPCB.memoryLimits.base]);
             console.log(_CoreMemory.memory);
             console.log(residentPCB.memoryLimits.base);
            
            //Update PCB's and delete file from disk
            
            var oldFileLocation = _krnFileSystemDriver.locationOfFile("Process" + diskPID);
            _krnFileSystemDriver.deleteFile(oldFileLocation);
                       
            
            diskPCB.storedLocation = "Memory";
            diskPCB.memoryLimits.base = residentPCB.memoryLimits.base;
            diskPCB.memoryLimits.limit = residentPCB.memoryLimits.limit;
            residentPCB.storedLocation = "Disk";
            residentPCB.memoryLimits.base = MEMORY_LIMIT;
            residentPCB.memoryLimits.limit = MEMORY_LIMIT;
            
            _RunningQueue[residentPID] = residentPCB;
            _RunningQueue[diskPID] = diskPCB;
            
            console.log(_RunningQueue[residentPID].memoryLimits.data);
            console.log(_RunningQueue[diskPID].memoryLimits.data);
            
           
        }
        
        
        
    }
}