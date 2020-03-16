class Game {
    field: Array<Array<number>>;
    openField: Array<Array<number>>;
    roomId: String;
    mines: number;
    remainingMines: number;

    constructor(height: number, width: number, mines: number, roomId: String) {
        this.field = new Array<Array<number>>(height);
        this.roomId = roomId;
        this.mines = mines;
        this.openField = new Array<Array<number>>(height);
        this.remainingMines = mines;

        for(let i = 0;i < height;i++) {
            this.field[i] = new Array<number>(width);
            this.openField[i] = new Array<number>(width);
            for(let j = 0;j < width; j++) {
                this.field[i][j] = 0;
                //0 -> closed
                //1 -> open
                //2 -> flag
                this.openField[i][j] = 0;
            }
        }
    }

    createField() {
        let randomX: number;
        let randomY: number;
        for(let i = 0;i < this.mines;i++) {
            randomX = Math.floor(Math.random() * this.field[0].length);
            randomY = Math.floor(Math.random() * this.field.length);
            if(this.field[randomY][randomX] == -1) {
                i--;
            }
            else {
                this.field[randomY][randomX] = -1;
                this.initSurroundingSlots(randomX, randomY);
            }
        }
    }
    
    initSurroundingSlots(x: number, y: number) {
        for(let i = -1; i < 2;i++) {
            for(let j = -1;j < 2;j++) {
                if(y+j >= 0 && y+j < this.field.length && x+i >= 0 && x+i < this.field[0].length) {
                    if(this.field[y+j][x+i] != -1) {
                        this.field[y+j][x+i]++;
                    }
                }
            }
        }
    }

    /*
        Return val:
        -1: loose
        0: ok move
        1: victory
    */
    check(x: number, y:number, playerName: String): number {
        if(this.openField[y][x] == 0) {
            if(this.field[y][x] == -1) {
                //Game over
                this.openField[y][x] = 1;
                return -1;
            }
            else {
                this.openField[y][x] = 1;
                if(this.field[y][x] == 0) {
                    this.checkSurrounding(x,y);
                    if(this.checkWinCondition() == true) {
                        return 1;
                    }
                }
            }
        }

        return 0;
    }

    checkSurrounding(x: number,y: number) {
        for(let i = -1;i < 2; i++) {
            for(let j = -1;j < 2;j++) {
                if(y+j >= 0 && y+j < this.field.length && x+i >= 0 && x+i < this.field[0].length) {
                    let checkX: number = x+i;
                    let checkY: number = y+j;
                    if(this.openField[checkY][checkX] == 0) {
                        if(this.field[checkY][checkX] == 0) {
                            this.openField[checkY][checkX] = 1;
                            this.checkSurrounding(x+i,y+j);
                        }
                        else if(this.field[checkY][checkX] != 0 && this.field[checkY][checkX] != -1) {
                            this.openField[checkY][checkX] = 1;
                        }
                    }
                }
            }
        }
    }

    flag(x: number, y: number) {
        if(this.openField[y][x] == 2) {
            this.openField[y][x] = 0;
        } else if(this.openField[y][y] == 0) {
            this.openField[y][x] = 2;
            this.remainingMines--;
        }
    }

    checkWinCondition() {
        let amountUnopenedCells: number = 0;
        for(let i = 0;i < this.openField.length;i++) {
            for(let j = 0;j < this.openField[i].length; j++) {
                if(this.openField[i][j] == 0)
                    amountUnopenedCells++;
            }
        }

        if(amountUnopenedCells == this.remainingMines)
            return true;
        else 
            return false;
    }
}

export default Game;