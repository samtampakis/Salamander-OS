var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(roundRobin, counter) {
            if (roundRobin === void 0) { roundRobin = true; }
            if (counter === void 0) { counter = 0; }
            this.roundRobin = roundRobin;
            this.counter = counter;
        }
        Scheduler.prototype.switchContextRR = function () {
            if (_RunningQueue[_RunningPID].state == "Terminated") {
                this.counter = _Quantum;
                delete _RunningQueue[_RunningPID];
                var lookingForProg = true;
                var i = 0;
                //See if other programs are currently running
                while (i < _RunningQueue.length && lookingForProg) {
                    if (_RunningQueue[i]) {
                        console.log(_RunningQueue[i]);
                        lookingForProg = false;
                    }
                    i++;
                }
                if (lookingForProg) {
                    TSOS.Control.hostLog("CPU not executing", "Scheduler");
                    _CPU.isExecuting = false;
                }
            }
            if (_Scheduler.counter < _Quantum) {
                _Scheduler.counter++;
            }
            else if (_CPU.isExecuting) {
                var interrupt = null;
                var i = _RunningPID + 1;
                var lookingForNextPid = true;
                while (i != _RunningPID && lookingForNextPid) {
                    if (_RunningQueue[i]) {
                        interrupt = new TSOS.Interrupt(SWITCH_IRQ, i);
                        lookingForNextPid = false;
                    }
                    if (i > _RunningQueue.length) {
                        i = 0;
                    }
                    else {
                        i++;
                    }
                }
                if (interrupt) {
                    TSOS.Control.hostLog("Round Robin Context Switch", "Scheduler");
                    console.log("INTERRUPT -- HORN BUSTER");
                    _KernelInterruptQueue.enqueue(interrupt);
                }
                else {
                    TSOS.Control.hostLog("No Context Switch", "Scheduler");
                }
                _Scheduler.counter = 0;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
