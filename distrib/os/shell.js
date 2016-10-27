///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", " - Displays your location.");
            this.commandList[this.commandList.length] = sc;
            // pizazz <string>
            sc = new TSOS.ShellCommand(this.shellPizazz, "pizazz", "<string> - Jazz things up a bit.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", " - Displays the time.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", " - Validates user input.");
            this.commandList[this.commandList.length] = sc;
            // run <pid>
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Executes the specified program.");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Change OS status to the specified string.");
            this.commandList[this.commandList.length] = sc;
            // break
            sc = new TSOS.ShellCommand(this.shellBreak, "break", " - Self-destruct button.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the current version of the OS.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown stops the OS without tampering with the hardware.");
                        break;
                    case "cls":
                        _StdOut.putText("CLS CLears the Screen.");
                        break;
                    case "man":
                        _StdOut.putText("Access the manual. You seem to be good at that!");
                        break;
                    case "trace":
                        _StdOut.putText("Turn the OS trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("Turns ordinary strings into super-secrets.");
                        break;
                    case "prompt":
                        _StdOut.putText("Change the prompt to something more fun.");
                        break;
                    case "whereami":
                        _StdOut.putText(" I dunno, man. Where ARE you?");
                        break;
                    case "pizazz":
                        _StdOut.putText("Give your boring strings a little something extra.");
                        break;
                    case "date":
                        _StdOut.putText("Even cooler than the average watch.");
                        break;
                    case "load":
                        _StdOut.putText("Validate code in User Program Input.");
                        break;
                    case "status":
                        _StdOut.putText("Set a custom status for the taskbar.");
                        break;
                    case "break":
                        _StdOut.putText("For when you're frustrated by how well things work.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellWhereAmI = function () {
            _StdOut.putText("You are on a rural planet on the edge of the Milky Way.");
        };
        Shell.prototype.shellPizazz = function (args) {
            if (args.length > 0) {
                var pizazz = "~* ";
                for (var i = 0; i < args.length; i++) {
                    pizazz = pizazz + args[i] + " ";
                }
                pizazz = pizazz + "*~";
                _StdOut.putText(pizazz);
            }
            else {
                _StdOut.putText("Usage: pizazz <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function () {
            var time = new Date().getTime();
            var date = new Date(time);
            var dateString = "The date is " + date;
            _StdOut.putText(dateString);
        };
        Shell.prototype.shellLoad = function () {
            var input = TSOS.Control.getProgram();
            var isValid = true;
            var i = 0;
            if (isNaN(input.charCodeAt(0))) {
                isValid = false;
            }
            input = input.replace(/ /g, '');
            while (isValid && i < input.length) {
                var charCode = input.charCodeAt(i);
                if (!((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 71))) {
                    isValid = false;
                }
                i++;
            }
            if (isValid) {
                _MemoryManager.data = input;
                //set pid
                var pid = _PID;
                _PID++;
                //create PCB and add it to global array
                var pcb = new TSOS.PCB("Ready", pid, new TSOS.Cpu(), _MemoryManager);
                _PCBArray[pid] = pcb;
                //load Memory in CPU
                var tempVal = new Array();
                var lookingForOpCode = true;
                var numArgs;
                for (var i = 0; i < (pcb.memoryLimits.limit - pcb.memoryLimits.base); i += 2) {
                    var lookup = pcb.memoryLimits.data.charAt(i) + pcb.memoryLimits.data.charAt(i + 1);
                    if (lookingForOpCode) {
                        var foundCode = false;
                        var j = 0;
                        while (foundCode == false && j < _OPCodes.length) {
                            if (lookup == _OPCodes[j].command) {
                                foundCode = true;
                                var newOpCode = _OPCodes[j];
                                numArgs = newOpCode.numArgs;
                                if (numArgs > 0) {
                                    lookingForOpCode = false;
                                }
                                tempVal[i] = newOpCode;
                                i++;
                            }
                            j++;
                        }
                        if (foundCode == false) {
                            tempVal[i] = pcb.memoryLimits.data.charAt(i) + pcb.memoryLimits.data.charAt(i + 1);
                        }
                    }
                    else {
                        tempVal[i] = pcb.memoryLimits.data.charAt(i) + pcb.memoryLimits.data.charAt(i + 1);
                        numArgs--;
                        if (numArgs <= 0) {
                            lookingForOpCode = true;
                        }
                    }
                }
                var retVal = new Array();
                for (var i = 0; i < tempVal.length; i++) {
                    if (tempVal[i]) {
                        retVal.push(tempVal[i]);
                    }
                }
                pcb.memoryLimits.data = retVal;
                _CoreMemory.memory = retVal;
                console.log(_CoreMemory.memory);
                //print pid
                _StdOut.putText("Process ID: " + pid);
            }
            else {
                _StdOut.putText("Invalid input. Please review and try again.");
            }
        };
        Shell.prototype.shellRun = function (args) {
            if (args.length > 0) {
                _RunningPID = args;
                _CPU.isExecuting = true;
            }
            else {
                _StdOut.putText("Usage: run <pid>  Please supply a pid.");
            }
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                var newStatus = "";
                for (var i = 0; i < args.length; i++) {
                    newStatus += args[i] + " ";
                }
                _Status = newStatus;
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellBreak = function () {
            _StdOut.clearScreen();
            _StdOut.resetXY();
            var error = new TSOS.Interrupt(ERROR_IRQ, "");
            _KernelInterruptQueue.enqueue(error);
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
