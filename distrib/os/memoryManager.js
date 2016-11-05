var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(firstPartitionAvailable, secondPartitionAvailable, thirdPartitionAvailable) {
            if (firstPartitionAvailable === void 0) { firstPartitionAvailable = true; }
            if (secondPartitionAvailable === void 0) { secondPartitionAvailable = true; }
            if (thirdPartitionAvailable === void 0) { thirdPartitionAvailable = true; }
            this.firstPartitionAvailable = firstPartitionAvailable;
            this.secondPartitionAvailable = secondPartitionAvailable;
            this.thirdPartitionAvailable = thirdPartitionAvailable;
        }
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
