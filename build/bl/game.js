"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game = /** @class */ (function () {
    function Game(height, width, mines, roomId) {
        this.field = new Array(height);
        this.roomId = roomId;
        this.mines = mines;
        this.openField = new Array(height);
        this.remainingMines = mines;
        for (var i = 0; i < height; i++) {
            this.field[i] = new Array(width);
            this.openField[i] = new Array(width);
            for (var j = 0; j < width; j++) {
                this.field[i][j] = 0;
                //0 -> closed
                //1 -> open
                //2 -> flag
                this.openField[i][j] = 0;
            }
        }
    }
    Game.prototype.createField = function () {
        var randomX;
        var randomY;
        for (var i = 0; i < this.mines; i++) {
            randomX = Math.floor(Math.random() * this.field[0].length);
            randomY = Math.floor(Math.random() * this.field.length);
            if (this.field[randomY][randomX] == -1) {
                i--;
            }
            else {
                this.field[randomY][randomX] = -1;
                this.initSurroundingSlots(randomX, randomY);
            }
        }
    };
    Game.prototype.initSurroundingSlots = function (x, y) {
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (y + j >= 0 && y + j < this.field.length && x + i >= 0 && x + i < this.field[0].length) {
                    if (this.field[y + j][x + i] != -1) {
                        this.field[y + j][x + i]++;
                    }
                }
            }
        }
    };
    /*
        Return val:
        -1: loose
        0: ok move
        1: victory
    */
    Game.prototype.check = function (x, y, playerName) {
        if (this.openField[y][x] == 0) {
            if (this.field[y][x] == -1) {
                //Game over
                this.openField[y][x] = 1;
                return -1;
            }
            else {
                this.openField[y][x] = 1;
                if (this.field[y][x] == 0) {
                    this.checkSurrounding(x, y);
                    if (this.checkWinCondition() == true) {
                        return 1;
                    }
                }
            }
        }
        return 0;
    };
    Game.prototype.checkSurrounding = function (x, y) {
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (y + j >= 0 && y + j < this.field.length && x + i >= 0 && x + i < this.field[0].length) {
                    var checkX = x + i;
                    var checkY = y + j;
                    if (this.openField[checkY][checkX] == 0) {
                        if (this.field[checkY][checkX] == 0) {
                            this.openField[checkY][checkX] = 1;
                            this.checkSurrounding(x + i, y + j);
                        }
                        else if (this.field[checkY][checkX] != 0 && this.field[checkY][checkX] != -1) {
                            this.openField[checkY][checkX] = 1;
                        }
                    }
                }
            }
        }
    };
    Game.prototype.flag = function (x, y) {
        if (this.openField[y][x] == 2) {
            this.openField[y][x] = 0;
        }
        else if (this.openField[y][y] == 0) {
            this.openField[y][x] = 2;
            this.remainingMines--;
        }
    };
    Game.prototype.checkWinCondition = function () {
        var amountUnopenedCells = 0;
        for (var i = 0; i < this.openField.length; i++) {
            for (var j = 0; j < this.openField[i].length; j++) {
                if (this.openField[i][j] == 0)
                    amountUnopenedCells++;
            }
        }
        if (amountUnopenedCells == this.remainingMines)
            return true;
        else
            return false;
    };
    return Game;
}());
exports.default = Game;
//# sourceMappingURL=game.js.map