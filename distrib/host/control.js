///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        Control.updateTaskbar = function (currentStatus) {
            var current = new Date().getTime();
            var date = new Date(current);
            var str = "status: " + currentStatus + " time: " + date;
            var taskbar = document.getElementById("taskbar");
            taskbar.value = str;
        };
        Control.getProgram = function () {
            var input = document.getElementById("taProgramInput");
            return input.value;
        };
        Control.displayRunningStatus = function () {
            //CPU display
            document.getElementById("cpu-pc").innerHTML = _CPU.PC.toString();
            document.getElementById("cpu-ir").innerHTML = _CPU.IR;
            document.getElementById("cpu-acc").innerHTML = _CPU.Acc.toString();
            document.getElementById("cpu-x").innerHTML = _CPU.Xreg.toString();
            document.getElementById("cpu-y").innerHTML = _CPU.Yreg.toString();
            document.getElementById("cpu-z").innerHTML = _CPU.Zflag.toString();
            //PCB Display
            var runningHtml = "<tr><th>PID</th><th>PC</th><th>IR</th><th>ACC</th>";
            runningHtml += "<th>X</th><th>Y</th><th>Z</th><th>State</th>";
            runningHtml += "<th>Turnaround</th><th>Wait</th></tr>";
            for (var i = 0; i < _RunningQueue.length; i++) {
                if (_RunningQueue[i]) {
                    var runningPCB = _RunningQueue[i];
                    runningHtml += "<tr>";
                    runningHtml += "<th>" + runningPCB.number.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.cpu.PC.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.cpu.IR + "</th>";
                    runningHtml += "<th>" + runningPCB.cpu.Acc.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.cpu.Xreg.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.cpu.Yreg.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.cpu.Zflag.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.state.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.turnaroundTime.toString() + "</th>";
                    runningHtml += "<th>" + runningPCB.waitTime.toString() + "</th>";
                    runningHtml += "</tr>";
                }
            }
            document.getElementById("RunningQueue-Display").innerHTML = runningHtml;
            var residentHtml = "<tr><th>PID</th><th>PC</th><th>IR</th><th>ACC</th>";
            residentHtml += "<th>X</th><th>Y</th><th>Z</th><th>State</th>";
            residentHtml += "<th>Turnaround</th><th>Wait</th></tr>";
            for (var i = 0; i < _ResidentQueue.length; i++) {
                if (_ResidentQueue[i]) {
                    var storedPCB = _ResidentQueue[i];
                    residentHtml += "<tr>";
                    residentHtml += "<th>" + storedPCB.number.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.cpu.PC.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.cpu.IR + "</th>";
                    residentHtml += "<th>" + storedPCB.cpu.Acc.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.cpu.Xreg.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.cpu.Yreg.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.cpu.Zflag.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.state.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.turnaroundTime.toString() + "</th>";
                    residentHtml += "<th>" + storedPCB.waitTime.toString() + "</th>";
                    residentHtml += "</tr>";
                }
            }
            document.getElementById("ResidentQueue-Display").innerHTML = residentHtml;
        };
        Control.displayMemory = function () {
            var memoryHTML = "";
            var i = 0;
            for (var p = 0; p < 3; p++) {
                while (i < 255) {
                    memoryHTML += "<tr> <td>" + p + "x" + ("000" + i.toString(16)).substr(-3) + "</td>";
                    for (var j = 0; j < 8; j++) {
                        if (typeof _CoreMemory.memory[(p * 256) + i] == "string") {
                            memoryHTML += "<td>" + _CoreMemory.memory[(p * 256) + i] + "</td>";
                        }
                        else {
                            memoryHTML += "<td>" + _CoreMemory.memory[(p * 256) + i].command + "</td>";
                        }
                        i++;
                    }
                    memoryHTML += "</tr>";
                }
                i = 0;
            }
            document.getElementById("core-memory").innerHTML = memoryHTML;
        };
        Control.displayDisk = function () {
            var diskHTML = "<tr><th>V/I</th><th>T,S,B</th><th>Data</th>";
            for (var t = 0; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var data = sessionStorage.getItem("" + t + s + b);
                        diskHTML += "<tr><td>" + data.slice(0, 1) + "</td><td>" + data.slice(1, 4) + "</td><td>" + data.slice(4) + "</td></tr>";
                    }
                }
            }
            document.getElementById("on-disk").innerHTML = diskHTML;
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // Create and initialize Core Memory
            _CoreMemory = new TSOS.CoreMemory();
            _CoreMemory.clearMemory();
            Control.displayMemory();
            //Display Disk
            Control.displayDisk();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
