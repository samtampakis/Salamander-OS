///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   FileSystemDeviceDriver.ts

   Requires deviceDriver.ts
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var FileSystemDeviceDriver = (function (_super) {
        __extends(FileSystemDeviceDriver, _super);
        function FileSystemDeviceDriver() {
            _super.call(this);
            this.driverEntry = this.krnFSDriverEntry;
        }
        FileSystemDeviceDriver.prototype.krnFSDriverEntry = function () {
            this.status = "loaded";
        };
        FileSystemDeviceDriver.prototype.format = function () {
            //Initialize MBR
            sessionStorage.setItem("000", "-" + EMPTY_MEMORY);
            //Initialize Directory
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    if (!(s == 0 && b == 0)) {
                        sessionStorage.setItem("0" + s + b, "0" + EMPTY_MEMORY);
                    }
                }
            }
            //Initialize Files
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        sessionStorage.setItem("" + t + s + b, "0" + EMPTY_MEMORY);
                    }
                }
            }
        };
        FileSystemDeviceDriver.prototype.createFile = function (fileName) {
            var dir = this.findAvailableDirectory();
            if (dir == "000") {
                return "Not enough directory space";
            }
            var data = this.findAvailableData();
            if (data == "000") {
                return "Not enough space in memory";
            }
            sessionStorage.setItem(dir, ("1" + data + fileName + EMPTY_MEMORY).substr(0, 60));
            sessionStorage.setItem(data, "1" + EMPTY_MEMORY);
            return "File Creation was successful";
        };
        FileSystemDeviceDriver.prototype.findAvailableDirectory = function () {
            var tsb = "000";
            for (var s = 0; s < 8; s++) {
                for (var b = 0; b < 8; b++) {
                    var currentData = sessionStorage.getItem("0" + s + b);
                    if (currentData.charAt(0) == "0") {
                        tsb = "0" + s + b;
                        return tsb;
                    }
                }
            }
            return tsb;
        };
        FileSystemDeviceDriver.prototype.findAvailableData = function () {
            var tsb = "000";
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var currentData = sessionStorage.getItem("" + t + s + b);
                        if (currentData.charAt(0) == "0") {
                            tsb = "" + t + s + b;
                            return tsb;
                        }
                    }
                }
            }
            return tsb;
        };
        return FileSystemDeviceDriver;
    }(TSOS.DeviceDriver));
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
