<script setup>
import { ref } from 'vue';

// game board setup:
    const board = ref([]);
    const gameOver = ref(false);


    function createBoard(boardSize) {
        const currentBoard = [];
        for (let r = 0; r < boardSize; r++){                     // all squares in each line (outter loop)
            const row = [];                                       
            for ( let c = 0; c < boardSize;  c++ ){              // 遍历当前行的每一列。c 是列索引，从 0 到 cols - 1。
                
                row.push({                                  // status of each square:
                    hasBom: false,                          // initial state: 雷都是没有被排掉的 ，如果玩家排掉了 就变成true
                    isVisited: false,                       // 是否被点开
                    isFalged: false,
                    neiborsBom: 0                       
                });
            };
            currentBoard.push(row);                                // create each row for the board
        }
        return currentBoard;
    }

    
    






// 初始时的随机放雷, position 不可以重复噢。
    function placeTheBom(board, numOfBom) {
    const boardSize = board.length;
    const positions = [];

    while (positions.length < numOfBom) {
        const pos = {
            x: pickRandomNumber(boardSize),
            y: pickRandomNumber(boardSize)
        };

        if (!positions.some(p => checkPositionMatch(p, pos))) {
            positions.push(pos);
            board[pos.x][pos.y].hasBom = true;
        }
    }
}

    function pickRandomNumber(size) {
        return Math.floor( Math.random() * size );
    }

    function checkPositionMatch( c, r ){
        return c.x === r.x && c.y === r.y;
    }



// r: y,  c: x.               
// (  dy, dx )

    function checkNeiborBom (board) {
        const rowLength = board.length;
        const colLength = board[0].length;

        let nRy = '';                                 // neibor Row ( y-value )
        let nCx = '';

        for (let r = 0; r < rowLength; r++) {
            for ( let c = 0; c < colLength; c++ ){
                if ( board[r][c].hasBom ) {
                    continue;
                }
                let count = 0;
                for ( let dy = -1; dy <= 1; dy++) {                  // dy: difference of row ( y-value )
                    for ( let dx = -1; dx <= 1; dx++ ) {
                        if (dy === 0 && dx === 0) continue;
                        

                        nRy = r + dy;                                // neibor Row position 
                        nCx = c + dx;                                 // neibor Col position

                        
                        if ( nRy< rowLength && nRy >= 0 &&
                             nCx < colLength && nCx >= 0 &&
                             board[nRy][nCx].hasBom) {
                                count++;
                             }
                    }
                }
                board[r][c].neiborsBom = count;
            }
        }
    }

//点击一个格子后进行揭示，如果是空白的（周围没有地雷），就自动展开邻居格子（递归展开）。       
    function visitBom( board, row, col){                   
        const cell = board[row][col];                               // cell: 当前格子, current     

        
        if ( cell.isVisited || cell.isFalged ) return;              // 如果雷被玩家排掉 isVisited=true  或者 没有被 插旗子： isFalged=true , return
            
        if (cell.hasBom) {
            cell.isVisited = true;
            alert("Bombed & Dead.\nYou Suck!");
            gameOver.value = true;
            return; 
        }  
          

        cell.isVisited = true;
        if ( cell.neiborsBom === 0 && cell.hasBom === false ){
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = row + dr;      
                    const nc = col + dc;

                    if (
                    nr >= 0 && nr < board.length &&
                    nc >= 0 && nc < board[0].length
                    ) {
                    visitBom(board, nr, nc);

                    }
                }
            }
        }
    }


    function ResultCheck(board, row, col) {
        return board[row][col].hasBom;

        // if (board[row][col].hasBom) {
        //     return true;
        // }
        // return false;
    }

    let firstClick = true;

    function leftClickCheck( row, col ) {
        if ( gameOver.value )
            return;
        
        console.log("clicked", row, col);
        if (firstClick){
            console.log("First click! Placing bombs...");
            placeTheBomAvoidingFirstClick(board.value, 5, row, col);
            checkNeiborBom(board.value);
            firstClick = false;
        }
        visitBom( board.value, row, col);
        checkWin(9);
        
    }


    function placeTheBomAvoidingFirstClick(board, numOfBom
    , firstClickRow, firstClickCol) {
        const rows = board.length;
        const cols = board[0].length;
        let marked = 0;

        while (marked < numOfBom

        ) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);

            // 避免第一次点击的位置 + 已经有雷的位置
            if ((r === firstClickRow && c === firstClickCol) || board[r][c].hasBom) {
                continue;
            }

            board[r][c].hasBom = true;
            marked++;
        }
    }


    function rightClickFlagging( row, col ) {
        if ( gameOver.value ) return;

        const currentCell = board.value[row][col];
        if ( !currentCell.isVisited ) {
            currentCell.isFalged = !currentCell.isFalged;                            // false->true
        }

    }


    function checkWin( boardSize ) {
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++ ) {
                const cell = board.value[r][c];
                if ( !cell.hasBom && !cell.isVisited ) {
                    return false;
                }
            }
        }
        alert("Fine, you win, its just luck~")
        return true;
    }


    function restartGame() {
        board.value = createBoard(9);         
// DON'T place bombs now, wait until first click
        firstClick = true;                    // so bombs avoid first click
        gameOver.value = false;
    }






    board.value = createBoard(9);
    placeTheBom(board.value, 5); 
    checkNeiborBom(board.value);




</script>


<!-- ============================================================================================================================================ -->



<template>
        <div class="MinesBoard" >
            <!-- row 是当前行的数组, rowIndex is 当前行的索引  -->
            
            <div v-for="(row, rowIndex) in board"      
                :key="rowIndex" 
                class="row"
            >
                <div v-for="( cell, colIndex ) in row "
                    :key="colIndex"
                    class="cell"
                
                    @click="leftClickCheck(rowIndex, colIndex)" 
                    @contextmenu.prevent="rightClickFlagging(rowIndex, colIndex)"                              
                        :class="{ 
                            visited: cell.isVisited, 
                            flaged: cell.isFalged,
                            bomed: cell.isVisited && cell.hasBom
                        }"
                >
                    <div v-if="cell.isFalged">🚩</div>  
                    <div v-else-if="cell.isVisited && cell.hasBom">bom</div>  
                    <div v-else-if="cell.isVisited && cell.neiborsBom > 0"> {{ cell.neiborsBom }} </div>

                </div>
            </div>

            <button class="restart-button" @click="restartGame"> Start Again </button>
        </div>
</template>


<!-- //  @contextmenu.prevent="rightClickFlagging(rowIndex, colIndex)" : Run function when user right-clicks       -->
<!-- ======================================================================================================================================================================== -->



<style scoped>
.MinesBoard {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.row {
  display: flex;
}
.cell {
  width: 30px;
  height: 30px;
  background-color: #000000;
  border: 1px solid #999;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  cursor: pointer;
}

/* .cell.visited {
  background-color: #1b85e7;
  color:#000000;
} */

.cell.visited:not(.bomed) {
  background-color: #1b85e7;         /* blue for safe visited cells */
} 

.cell.flaged {
  background-color: #e5fb57;
}

.cell.bomed {
  background-color: red;
  color: white;
}

.restart-button {
  margin-bottom: 10px;
  padding: 6px 12px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  background-color: #0b2035;
  color: white;
  cursor: pointer;
}
.restart-button:hover {
  background-color: #f6d208;
}




</style>
