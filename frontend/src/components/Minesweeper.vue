<script setup>
import { ref } from 'vue';

// game board setup:
    const board = ref([]);

    function createBoard(rows, cols) {
        const currentBoard = [];
        for (let r = 0; r < rows; r++){                     // all squares in each line (outter loop)
            const row = [];                                       
            for ( let c = 0; c < cols;  c++ ){              // 遍历当前行的每一列。c 是列索引，从 0 到 cols - 1。
                
                row.push({                                  // status of each square:
                    hasBom: false,                         // initial state: 雷都是没有被排掉的 ，如果玩家排掉了 就变成true
                    isVisited: false,                       // 是否被点开
                    isFalged: false,
                    neiborsBom: 0                       
                });
            };
            currentBoard.push(row);                                // create each row for the board
        }
        return currentBoard;
    }

    

// 初始时的随机放雷, 每格最多只可能放一个雷：
    function markTheMine(board, bomCount) {
        const rows = board.length;
        const cols = board[0].length;
        let marked = 0;

        while ( marked < bomCount ) {
            const r = Math.floor(Math.random() * rows);         // Math.random() * rows: randomly pick a float then x 9(rows) to get a int using math.floor()
            const c = Math.floor(Math.random() * cols);

            if ( !board[r][c].hasBom ){
                board[r][c].hasBom = true;
                marked ++;
            }
        }
    }


// r: y,  c: x.               
// (  dy, dx )

    function neiborBom (board) {
        const rows = board.length;
        const cols = rows[0].length;
        const count = 0;
        const nY = '';
        const nX = '';

        for (r = 0; r < rows; r++) {
            for ( c = 0; c < cols, c++; ){
                if ( board[r][c].hasBom ) {
                    continue;
                }
                for ( dy = -1; dx <= 1; dy++) {
                    for ( dx = -1, dy <= 1; dx++; ) {
                        nY = r + dy;                                // neiborY
                        nX = c + dx                                 // beiborX
                        if ( nY < rows && nY >= 0 &&
                             nX < cols && nX >= 0 &&
                             board[nY][nX].hasBom) {
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

        if ( cell.isVisited || cell.isFalged ){                       // 如果雷被玩家排掉 isVisited=true  或者 没有被 插旗子： isFalged=true , return
            return;
        }          
        cell.isVisited = true;
        if ( cell.neiborsBom === 0 && !cell.hasBom ){
            for ( let dr = -1; dr <= 1; dr++) {
                for ( let dc = -1; dc <= 1; dc++ ) {

                    const nY = row + dy;
                    const nX = col + dx;

                    if (
                        nr >= 0 && nr < board.length &&
                        nc >= 0 && nc < board[0].length
                    ) {
                        visitBom(board, nY, nX);
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


    function leftClickCheck( row, col ) {
        if ( ResultCheck( board.value,  row, col) ) {
            console.log("Bomed, dead.");
            return;
        } else {
            visitBom( board.value, row, col);
        }
    }


    function rightClickFlagging( row, col ) {
        const currentCell = board.value[row][col];
        while ( !currentCell.isVisited ) {
            currentCell.isFalged = !currentCell.isFalged;                            // false->true
        }

    }

    board.value = createBoard(9, 9);
    markTheMine(board.value, 5); 
    neiborBom(board.value);




</script>


<!-- ============================================================================================================================================ -->



<template>
    <div>
        
    </div>
</template>



<!-- ======================================================================================================================================================================== -->



<style>
</style>
