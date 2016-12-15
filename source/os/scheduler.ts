module TSOS {
    export class Scheduler {
        constructor(public roundRobin = true,
                    public counter = 0) {
        }
        
        public switchContextRR(){
            if(_RunningQueue[_RunningPID].state == "Terminated"){
                this.counter = _Quantum;
                delete _RunningQueue[_RunningPID];
                var lookingForProg = true;
                var i = 0;
                
                //See if other programs are currently running
                while(i < _RunningQueue.length && lookingForProg){
                    if(_RunningQueue[i]){
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
                        interrupt = new Interrupt(SWITCH_IRQ, i);
                        lookingForNextPid = false;
                    }
                    if(i > _RunningQueue.length){
                        i = 0;
                    } else{
                        i++;    
                    }
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
        
        
        
    }
}