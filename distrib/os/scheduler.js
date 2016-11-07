var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(roundRobin, counter) {
            if (roundRobin === void 0) { roundRobin = true; }
            if (counter === void 0) { counter = 0; }
            this.roundRobin = roundRobin;
            this.counter = counter;
        }
        Scheduler.prototype.switchContext = function () {
            if (_Scheduler.counter < _Quantum) {
                console.log("Not this cycle!");
                _Scheduler.counter++;
            }
            else {
                var interrupt = null;
                var i = _RunningPID + 1;
                var lookingForNextPid = true;
                while (i != _RunningPID && lookingForNextPid) {
                    if (_RunningQueue[i]) {
                        console.log(i);
                        var params = new Array();
                        params.push(_RunningPID);
                        params.push(i);
                        interrupt = new TSOS.Interrupt(SWITCH_IRQ, params);
                        TSOS.Control.hostLog("Round Robin Context Switch", "Scheduler");
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
                    console.log("INTERRUPT -- HORN BUSTER");
                    _KernelInterruptQueue.enqueue(interrupt);
                }
                else {
                    console.log("No other programs. No context switch!");
                }
                _Scheduler.counter = 0;
            }
        };
        return Scheduler;
    }());
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
