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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
       
        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  " - Displays your location.");
            this.commandList[this.commandList.length] = sc;
            
            // pizazz <string>
            sc = new ShellCommand(this.shellPizazz,
                                  "pizazz",
                                  "<string> - Jazz things up a bit.");
            this.commandList[this.commandList.length] = sc;
            
            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  " - Displays the time.");
            this.commandList[this.commandList.length] = sc;
            
            // load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "<priority> - Loads user input and optionally assigns priority.");
            this.commandList[this.commandList.length] = sc;
            
            // run <pid>
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid> - Executes the specified program.");
            this.commandList[this.commandList.length] = sc;
            
            // setschedule [rr, fcfs, priority]
            sc = new ShellCommand(this.shellSet,
                                  "setschedule",
                                  "[rr, fcfs, priority] - Sets the scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            
            // getschedule
            sc = new ShellCommand(this.shellGetSchedule,
                                  "getschedule",
                                  " - Gets the current scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            
            // status <string>
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string> - Change OS status to the specified string.");
            this.commandList[this.commandList.length] = sc;
            
            
            // break
            sc = new ShellCommand(this.shellBreak,
                                  "break",
                                  " - Self-destruct button.");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearmem,
                                  "clearmem",
                                  " - Clears all memory partitions.");
            this.commandList[this.commandList.length] = sc;
            
            // quantum <int>
            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "<int> - Set Round Robin quantum.");
            this.commandList[this.commandList.length] = sc;
            
            //runall

            sc = new ShellCommand(this.shellRunall,
                                  "runall",
                                  " - Run all programs currently stored in memory.");
            this.commandList[this.commandList.length] = sc;
            
            //format

            sc = new ShellCommand(this.shellFormat,
                                  "format",
                                  " - Format disk storage of the operating system.");
            this.commandList[this.commandList.length] = sc;
            
            //create
            
            sc = new ShellCommand(this.shellCreate,
                                  "create",
                                  "<string> - Create a new File.");
            this.commandList[this.commandList.length] = sc;
            
            //write
            
            sc = new ShellCommand(this.shellWrite,
                                  "write",
                                  "<name> <string> - Write to an existing file.");
            this.commandList[this.commandList.length] = sc;
            
            //read
            
            sc = new ShellCommand(this.shellRead,
                                  "read",
                                  "<string> - Read existing file.");
            this.commandList[this.commandList.length] = sc;
            
            //delete
            
            sc = new ShellCommand(this.shellDelete,
                                  "delete",
                                  "<string> - Delete existing file.");
            this.commandList[this.commandList.length] = sc;
            
            //ls
            
             sc = new ShellCommand(this.shellLS,
                                  "ls",
                                  " - List the files currently stored on disk.");
            this.commandList[this.commandList.length] = sc;
            
            // ps  - list the running processes and their IDs

            sc = new ShellCommand(this.shellPS,
                                  "ps",
                                  " - List the running processes and their IDs.");
            this.commandList[this.commandList.length] = sc;
            
            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "<pid> - Kills specified process.");
            this.commandList[this.commandList.length] = sc;
            
            
            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        
        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        
        public shellWhereAmI() {
            _StdOut.putText("You are on a rural planet on the edge of the Milky Way.");
        }
        
        public shellPizazz(args){
            if (args.length > 0){
                var pizazz = "~* ";
                for(var i = 0; i < args.length; i++){
                    pizazz = pizazz + args[i] + " ";
                }
                pizazz = pizazz + "*~";
                _StdOut.putText(pizazz);
            } else {
                _StdOut.putText("Usage: pizazz <string>  Please supply a string.");
            }
        }
        
        public shellDate(){
            var time = new Date().getTime();
            var date = new Date(time);
            var dateString = "The date is " + date;
            _StdOut.putText(dateString);
        }
        
        public shellLoad(args){
            var input = Control.getProgram();
            var isValid = true;
            var i = 0
            if(isNaN(input.charCodeAt(0))){
                isValid = false;
            }
            input = input.replace(/ /g,'');

            while(isValid && i < input.length){
                var charCode = input.charCodeAt(i);
                if(!((charCode > 47 && charCode < 58) || (charCode > 64 && charCode < 71))){
                    isValid = false;
                } 
                i++;
            }
            
            if(isValid){

                var memoryIsAvailable = true;
                //Determine which Memory Partition to load into
                var pcbMem;
                if(_MemoryManager.firstPartitionAvailable){
                    pcbMem = new ProcessMemory(PART0_BASE, PART1_BASE, null);
                    _MemoryManager.firstPartitionAvailable = false;
                } else if(_MemoryManager.secondPartitionAvailable){
                    pcbMem = new ProcessMemory(PART1_BASE, PART2_BASE, null);
                    _MemoryManager.secondPartitionAvailable = false;
                } else if(_MemoryManager.thirdPartitionAvailable){
                    pcbMem = new ProcessMemory(PART2_BASE, MEMORY_LIMIT, null);
                    _MemoryManager.thirdPartitionAvailable = false;
                } else{
                    pcbMem = new ProcessMemory(MEMORY_LIMIT, MEMORY_LIMIT, null);
                    memoryIsAvailable = false;
                }
             
            
                //set pid
                var pid = _PID;
                _PID++;
                
                var priority = Number.MAX_VALUE;
                
                //check if priority parameter was passed
                if(args.length > 0){
                    priority = parseInt(args[0]);
                }
                
                if(memoryIsAvailable){
                    //create PCB and add it to global array   
                    var pcb = new PCB("Ready", pid, new Cpu(), pcbMem, priority, "Memory");
                } else {
                    var pcb = new PCB("Ready", pid, new Cpu(), pcbMem, priority, "Disk");
                }
                _ResidentQueue[pid] = pcb;
                //load Memory in CPU
                var tempVal = new Array();
            
                var lookingForOpCode = true;
                var numArgs;
            
            
                for(var i = 0; i < MEMORY_SIZE * 2; i+=2){
                
                    var lookup = input.charAt(i) + input.charAt(i+1);
                    
                    if(lookingForOpCode){
                        var foundCode = false;
                        var j = 0;
                        while(foundCode == false && j < _OPCodes.length){
                            if(lookup == _OPCodes[j].command){
                               foundCode = true;
                               var newOpCode = _OPCodes[j];
                               numArgs = newOpCode.numArgs;
                               if(numArgs > 0){
                                   lookingForOpCode = false;
                               }                                
                               tempVal[i] = newOpCode;
                            }
                        j++;
                        }
                        if (foundCode == false){
                            tempVal[i] = input.charAt(i)+ input.charAt(i+1);
                        }
                    } else{
                        tempVal[i] = input.charAt(i) + input.charAt(i+1);
                        numArgs--;
                        if(numArgs <= 0){
                            lookingForOpCode = true;
                        }  
                    }  
                }        
                
                //Remove undefined elements of the array
                
               var retVal = new Array();
                
                for (var i = 0; i < tempVal.length; i++){
                    if (tempVal[i]){
                        retVal.push(tempVal[i]);
                    }
                }

                pcb.memoryLimits.data = retVal;

                if(memoryIsAvailable){
                    // Load into memory if memory is available        
                    var j = 0;
                    for(var i = pcb.memoryLimits.base; i < pcb.memoryLimits.limit; i++){
                        if(pcb.memoryLimits.data[j]){
                            _CoreMemory.memory[i] = pcb.memoryLimits.data[j];
                        } else {
                            _CoreMemory.memory[i] = "00";
                        }
                        j++;
                    }
                } else {
                    // Load onto disk if memory is not available
                    _krnFileSystemDriver.createFile("Process" + pid);
                    var fileLocation = _krnFileSystemDriver.locationOfFile("Process" + pid);
                    var fileData = "";
                    for(var i = 0; i < pcb.memoryLimits.data.length; i++){
                        if(typeof pcb.memoryLimits.data[i] == "string"){
                            fileData += pcb.memoryLimits.data[i];
                        } else {
                            fileData += pcb.memoryLimits.data[i].command;
                        }
                    }
                    
                    _krnFileSystemDriver.write(fileLocation, fileData);
                    
                }
                
                
                //print pid
                _StdOut.putText("Process ID: " + pid);
                
            } else {
                _StdOut.putText("Invalid input. Please review and try again.");
            }
              
        }

        
        public shellRun(args){
            if (args.length > 0){
                _RunningPID = args;
                _ResidentQueue[_RunningPID].state = "Running";
                _RunningQueue[_RunningPID] = _ResidentQueue[_RunningPID];
                _CPU.isExecuting = true;
            } else {
                _StdOut.putText("Usage: run <pid>  Please supply a pid.");
            }
        }
        
        public shellSet(args){
            if (args.length > 0){
                
                var successful = false;
                
                if(args[0] == "priority"){
                    _Scheduler.roundRobin = false;
                    successful = true;
                } else if(args[0] == "fcfs"){
                    _Scheduler.roundRobin = true;
                    _Quantum = Number.MAX_VALUE;
                    successful = true;
                } else if(args[0] == "rr") {
                    _Scheduler.roundRobin = true;
                    _Quantum = 6;
                    successful = true;
                }
                
                if(successful){
                    _StdOut.putText("Scheduling algorithm set to " + args[0]);
                } else {
                    _StdOut.putText("Scheduling algorithm not updated. Please select a valid algorithm.");
                }

            } else {
                _StdOut.putText("Usage: setschedule [rr, fcfs, priority]  Please select an algorithm.");
            }
        }
        
        public shellGetSchedule(){
            if(!_Scheduler.roundRobin){
                _StdOut.putText("Current Schedule: Priority");
            } else if (_Scheduler.roundRobin && _Quantum == Number.MAX_VALUE){
                _StdOut.putText("Current Schedule: First Come First Serve");
            } else {
                _StdOut.putText("Current Schedule: Round Robin");
            }
        }
        
        public shellStatus(args){
            if (args.length > 0){
                var newStatus = "";
                for(var i = 0; i < args.length; i++){
                    newStatus += args[i] + " ";
                }
                _Status = newStatus;
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        
        public shellBreak(){
            _StdOut.clearScreen();
            _StdOut.resetXY();
            var error = new Interrupt(ERROR_IRQ, "");
            _KernelInterruptQueue.enqueue(error);
        }
        
        public shellClearmem(){
            _CoreMemory.clearMemory();
            _MemoryManager.firstPartitionAvailable = true;
            _MemoryManager.secondPartitionAvailable = true;
            _MemoryManager.thirdPartitionAvailable = true;
        }
        
        public shellQuantum(args){
            var newQuantum = parseInt(args);
            if (isNaN(newQuantum)){
                _StdOut.putText("Usage: quantum <int>  Please supply an integer.");
            } else {
                _Quantum = newQuantum;
            }
        }
        
        public shellRunall(){
            for(var i = 0; i < _ResidentQueue.length; i++){
                if(_ResidentQueue[i].state == "Ready"){
                    _RunningPID = i;
                    _ResidentQueue[_RunningPID].state = "Running";
                    _RunningQueue[_RunningPID] = _ResidentQueue[_RunningPID];
                    _CPU.isExecuting = true;
                }
            }
        }
        
        public shellFormat(){
            try{
                _krnFileSystemDriver.format();
                _StdOut.putText("Successfully formatted disk");
            } catch(e){
                _StdOut.putText("An error occurred while formatting the disk");
            }
        }
        
        public shellCreate(args){
            if (args.length > 0){
                var res = _krnFileSystemDriver.createFile(args[0]);
                _StdOut.putText(res);
            } else {
                _StdOut.putText("Usage: create <string>  Please supply a string.");
            }
        }
        
        public shellWrite(args){
            if (args.length > 1){
                var res = "";
                var fileName = "";
                for(var i = 0; i < args.length; i++){
                    fileName += args[i] + " ";
                }
                var fileLocation = _krnFileSystemDriver.locationOfFile(args[0]);
                if(fileLocation == "000"){
                   res = "File does not exist."
                } else {
                    var data = "";
                    for(var i = 1; i < args.length; i++){
                        data += args[i] + " ";
                    }
                    res = _krnFileSystemDriver.write(fileLocation, data);
                }
                _StdOut.putText(res);
            } else {
                _StdOut.putText("Usage: write <name> <string>  Please supply a name and a string.");
            }
        }
        
        public shellRead(args){
            if (args.length > 0){
                var fileLocation = _krnFileSystemDriver.locationOfFile(args[0]);
                if(fileLocation == "000"){
                   _StdOut.putText("File does not exist.");
                } else {
                    _StdOut.putText(_krnFileSystemDriver.read(fileLocation));
                }
            } else {
                _StdOut.putText("Usage: read <string>  Please supply a string.");
            }
        }
        
        public shellDelete(args){
            if (args.length > 0){
                var fileLocation = _krnFileSystemDriver.locationOfFile(args[0]);
                if(fileLocation == "000"){
                   _StdOut.putText("File does not exist.");
                } else {
                    _krnFileSystemDriver.deleteFile(fileLocation)
                    _StdOut.putText("Delete successful");
                }
            } else {
                _StdOut.putText("Usage: delete <string>  Please supply a string.");
            }
        }
        
        public shellLS(){
            var files = _krnFileSystemDriver.listDirectory();
            if(files == []){
                _StdOut.putText("No files in directory");
            } else{
                for(var i = 0; i < files.length; i++){
                    _StdOut.putText(files[i]);
                    _StdOut.advanceLine();
                }
            }
            
        }
        
        public shellPS(){
            for(var i = 0; i < _RunningQueue.length; i++){
                if(_RunningQueue[i]){
                    _StdOut.putText("PID: " + i + " ");
                    _StdOut.advanceLine();
                }
            }
        }
        
        public shellKill(args){
            var pid = parseInt(args)
            if(isNaN(pid)){
                _StdOut.putText("Usage: kill <pid>  Please supply a PID.");
            } else {
                var kill = new Interrupt(KILL_IRQ, pid);
                _KernelInterruptQueue.enqueue(kill);
            }
        }
    }
}
 