///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   FileSystemDeviceDriver.ts

   Requires deviceDriver.ts
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class FileSystemDeviceDriver extends DeviceDriver {

        constructor() {
            super();
            this.driverEntry = this.krnFSDriverEntry;
        }

        public krnFSDriverEntry() {
            this.status = "loaded";
        }
  
        public format(): void{
            //Initialize MBR
            sessionStorage.setItem("000", "-"+EMPTY_MEMORY);
                
            //Initialize Directory
            for(var s = 0; s < 8; s++){
                for(var b = 0; b < 8; b++){
                    if(!(s==0 && b==0)){
                        sessionStorage.setItem("0"+s+b, "0"+EMPTY_MEMORY)
                    }
                }
            }
                
            //Initialize Files
            for (var t = 1; t < 4; t++){
                for(var s = 0; s < 8; s++){
                    for(var b = 0; b < 8; b++){
                        sessionStorage.setItem(""+t+s+b, "0"+EMPTY_MEMORY)
                    }
                }
            }
        }
        
        public createFile(fileName){
            var dir = this.findAvailableDirectory();
            if(dir == "000"){
                return "Directory space not available";
            }
            var data = this.findAvailableData(1);
            if (data == []){
                return "Memory space not available";
            }
            sessionStorage.setItem(dir, ("1"+data+fileName +EMPTY_MEMORY).substr(0,60));
            sessionStorage.setItem(data[0], "1"+EMPTY_MEMORY);
            return "File Creation was successful";
        }
        
        public write(dir, data){
            console.log(dir);
            var res = "";
            var numBlocks = Math.ceil(data.length / 60);
            var assigningBlocks = true;
            var assignedBlocks = this.getAllLinkedData(dir);
            var enoughSpace = true;
            var unassignedBlocks = numBlocks - assignedBlocks.length;
            
            if(unassignedBlocks <= 0){
                assigningBlocks = false;
            }
            
            if(assigningBlocks){
                var newBlocks = this.findAvailableData(unassignedBlocks);
                console.log(newBlocks);
                
                if(newBlocks == []){
                    enoughSpace = false;
                    res = "Not enough space in memory";
                } 
                
                assignedBlocks = assignedBlocks.concat(newBlocks);
            }
            
            
            if(enoughSpace){
                var dataAlreadyWritten = 0;
                var dataToWrite = "";
                for(var i = 0; i < numBlocks - 1; i++){
                    dataToWrite = data.substr(dataAlreadyWritten, 60);
                    console.log(dataAlreadyWritten);
                    console.log(dataToWrite);
                    dataAlreadyWritten += 60;
                    console.log(dataAlreadyWritten);
                    sessionStorage.setItem(assignedBlocks[i], "1" + assignedBlocks[i+1] + dataToWrite);
                }
                dataToWrite = data.substr(dataAlreadyWritten);
                sessionStorage.setItem(assignedBlocks[numBlocks - 1], "1---" + (dataToWrite + EMPTY_MEMORY).substr(0,60) );
                res = "Write Successful";
            }
            
            
            return res;
            
        }
        
        public findAvailableDirectory(){
            var tsb = "000";
            if (sessionStorage.getItem("000")){
                for(var s = 0; s < 8; s++){
                    for(var b = 0; b < 8; b++){
                        var currentData = sessionStorage.getItem("0"+s+b)
                        if(currentData.charAt(0) == "0"){
                            tsb = "0" + s + b;
                            return tsb;
                        }
                    }
                } 
            }
            return tsb;
        }
        
        public read(dir){
            var dirValue = sessionStorage.getItem(dir);
            var linkValue = dirValue.substr(1,3);
            var res = "";
            var moreLinkedFiles = true;
            
            while (moreLinkedFiles){
                var storedVal = sessionStorage.getItem(linkValue);
                linkValue = storedVal.substr(1,3);
                if(linkValue == "---"){
                    res += (storedVal.substr(4)).replace(/-/g, "")
                    moreLinkedFiles = false;
                } else{
                    res += storedVal.substr(4);
                }
            }
            
            return res;
        }
        
        public listDirectory(){
            var listings = [];
            if (sessionStorage.getItem("000")){
                for(var s = 0; s < 8; s++){
                    for(var b = 0; b < 8; b++){
                        var currentData = sessionStorage.getItem("0"+s+b)
                        if(currentData.charAt(0) == "1"){
                            currentData = currentData.substr(4);
                            currentData = currentData.replace(/-/g, "")
                            listings.push(currentData);
                        }
                    }
                } 
            }
            return listings;
        }
        
        public findAvailableData(neededBlocks){
            var dataBlocks = [];
            if(sessionStorage.getItem("000")){
                for (var t = 1; t < 4; t++){
                    for(var s = 0; s < 8; s++){
                        for(var b = 0; b < 8; b++){
                            var currentData = sessionStorage.getItem(""+t+s+b);
                            if(neededBlocks == 0){
                                break;
                            } else if(currentData.charAt(0) == "0"){
                                dataBlocks.push("" + t + s + b);
                                neededBlocks --;
                            }
                        }
                    }
                }
            }
            if(neededBlocks > 0){
                dataBlocks = [];
            }
            return dataBlocks;
        }
        
        public getAllLinkedData(currentBlock){
            var assignedBlocks = [];
            var possibleTSB = "---";
            var gettingLinks = true;
            var workingBlock = currentBlock;
            
            while(gettingLinks){
                possibleTSB = (sessionStorage.getItem(workingBlock)).substr(1,3);
                if(possibleTSB == "---"){
                    gettingLinks = false;
                } else{
                    assignedBlocks.push(possibleTSB);
                    workingBlock = possibleTSB;
                }
            }
            return assignedBlocks;
        }
        
        public locationOfFile(name){
            var tsb = "000";
            for(var s = 0; s < 8; s++){
                for(var b = 0; b < 8; b++){
                    var currentData = sessionStorage.getItem("0"+s+b);
                    if(currentData.substr(4, name.length) == name){
                        tsb = "0" + s + b;
                        return tsb;
                    }
                }
            } 
            return tsb;
        }
        
    }
}
