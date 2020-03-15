class Game {
    field: Array<Array<number>>;
    openField: Array<Array<Boolean>>;
    roomId: String;
    mines: number;
    moveLog: Array<string>;

    constructor(height: number, width: number, mines: number, roomId: String) {
        this.field = new Array<Array<number>>(height);
        this.roomId = roomId;
        this.mines = mines;
        this.moveLog = ["Created: " + new Date()];
        this.openField = new Array<Array<Boolean>>(height);

        for(let i = 0;i < height;i++) {
            this.field[i] = new Array(width);
            for(let j = 0;j < width; j++) {
                this.field[i][j] = 0;
                this.openField[i][j] = false;
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

    check(x: number, y:number, playerName: String) {
        if(this.field[y][x] == -1) {
            //Game over
            this.openField[y][x] = true;
            return -1;
        }
        else {
            this.openField[y][x] = true;
            if(this.field[y][x] == 0) {
                this.checkSurrounding(x,y);
            }
        }
    }

    checkSurrounding(x: number,y: number) {
        for(let i = -1;i < 2; i++) {
            for(let j = -1;j < 2;j++) {
                if(y+j >= 0 && y+j < this.field.length && x+i >= 0 && x+i < this.field[0].length) {
                    if(this.field[y+j][x+i] == 0) {
                        this.openField[y+j][x+i] = true;
                        this.checkSurrounding(x+i,y+j);
                    }
                    else if(this.field[y+j][x+i] != 0 && this.field[y+j][x+i] != -1) {
                        this.openField[y+j][x+i] = true;
                    }
                }
            }
        }
    }

    // getField(): Array<Array<number>> {
    //     return this.field;
    // }

    // getOpenField(): Array<Array<Boolean>> {
    //     return this.openField;
    // }
}

export default Game;