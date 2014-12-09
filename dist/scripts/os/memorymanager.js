///<reference path="../host/memory.ts" />
///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(memoryTable) {
            if (typeof memoryTable === "undefined") { memoryTable = null; }
            this.memoryTable = memoryTable;
        }
        MemoryManager.prototype.init = function () {
            this.memoryTable = document.getElementById("memory");
            console.log("init memory");
            for (var i = 0; i < 96; i++) {
                this.memoryTable.insertRow();
            }
            for (var i = 0; i < 96; i++) {
                var row = this.memoryTable.rows.item(i);
                for (var x = 0; x < 9; x++) {
                    row.insertCell();
                }
                for (var x = 0; x < 9; x++) {
                    var cell = row.cells.item(0);
                    cell.innerHTML = "0x" + MemoryManager.transform2(i * 8);
                    for (var y = 1; y <= 8; y++) {
                        var cell = row.cells.item(y);
                        var a = ((((i + 1) * y) - 1) * 2);
                        var b = a + 1;
                        var c = _Memory.getMemoryBlock(a);
                        var d = _Memory.getMemoryBlock(b);
                        cell.innerHTML = MemoryManager.transform(c) + MemoryManager.transform(d);
                    }
                }
            }
        };

        MemoryManager.transform2 = function (i) {
            var x = Math.floor(i / 256);
            var y = Math.floor((i - (x * 256)) / 16);
            var z = ((i - (x * 256)) - (y * 16));
            return "" + MemoryManager.transform(x) + MemoryManager.transform(y) + MemoryManager.transform(z);
        };
        MemoryManager.transform = function (i) {
            if (i < 10) {
                return "" + i;
            }
            switch (i) {
                case 10:
                    return "A";
                case 11:
                    return "B";
                case 12:
                    return "C";
                case 13:
                    return "D";
                case 14:
                    return "E";
                case 15:
                    return "F";
            }
            return "";
        };

        MemoryManager.getNumericValue = function (hexChar) {
            switch (hexChar.charAt(0)) {
                case 'A':
                    return 10;
                case 'B':
                    return 11;
                case 'C':
                    return 12;
                case 'D':
                    return 13;
                case 'E':
                    return 14;
                case 'F':
                    return 15;
            }
            return parseInt(hexChar.charAt(0));
        };

        MemoryManager.prototype.loadMemory = function (hexValue) {
            for (var i = 0; i < hexValue.length; i += 2) {
                var valA = hexValue.charAt(i);
                var valB = hexValue.charAt(i + 1);
                var a = MemoryManager.getNumericValue(valA);
                var b = MemoryManager.getNumericValue(valB);
                _Memory.setMemoryBlock(i, a);
                _Memory.setMemoryBlock(i, b);
                console.log(i);
                var x = Math.floor(i / 16);
                console.log(x);
                var y = (i - (x * 16)) / 2;
                console.log(y);
                var cell = this.memoryTable.rows.item(x).cells.item(y + 1);
                cell.innerHTML = valA + valB;
            }
        };

        MemoryManager.prototype.updateControl = function (i) {
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
