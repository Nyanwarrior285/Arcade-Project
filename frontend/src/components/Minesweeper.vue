<script setup>
import { ref } from 'vue';

// game board setup:
    const board = ref([]);
    function createBoard(rows, cols) {

        for (let r = 0; r < rows; r++){                     // all squares in each line (outter loop)
            const row = [];                                       
            for ( let c = 0; c < cols;  c++ ){              // 遍历当前行的每一列。c 是列索引，从 0 到 cols - 1。
                
                row.push({                                  // status of each square:
                    hasBomb: false,                         // initial state: 雷都是没有被排掉的 ，如果玩家排掉了 就变成true
                    isVisited: false,                       // 是否被点开
                    isFlagged: false,
                    neighborsBom: 0                       
                });
            };
            board.push(row);                                // create each row for the board
        }
        return board;
    }

    board.value = createBoard(9, 9);


// 初始时的随机放雷, 每格最多只可能放一个雷：
    function markTheMine(board, bombCount) {
        const rows = board.length;
        const cols = board[0].length;
        let marked = 0;

        while ( marked < bombCount ) {
            const r = Math.floor(Math.random() * rows);         // Math.random() * rows: randomly pick a float then x 9(rows) to get a int using math.floor()
            const c = Math.floor(Math.random() * cols);

            if ( !board[r][c].hasBomb ){
                board[r][c] = true;
                marked ++;
            }
        }
    }


// r: y,  c: x.               
// (  dy, dx )

    function neighborBomb (board) {
        const rows = board.length;
        const cols = rows[0].length;
        const count = 0;
        const nY = '';
        const nX = '';

        for (r = 0; r < rows; r++) {
            for ( c = 0; c < cols, c++; ){
                if ( board[r][c].hasBomb ) {
                    continue;
                }
                for ( dy = -1; dx <= 1; dy++) {
                    for ( dx = -1, dy <= 1; dx++; ) {
                        nY = r + dy;                                // neighborY
                        nX = x + dx                                 // neighborX
                        if ( nY < rows && nY >= 0 &&
                             nX < cols && nX >= 0 &&
                             board[r][c].hasBomb) {
                                count++;
                             }
                    }
                }
                board[r][c].neighborsBomb = count;
            }
        }
    }

//点击一个格子后进行揭示，如果是空白的（周围没有地雷），就自动展开邻居格子（递归展开）。       
    function visitBomb( board, row, col){                   
        const cell = board[row][col];                               // cell: 当前格子, current                  

        if ( cell.isVisited || cell.isFlagged ){                       // 如果雷被玩家排掉 isVisited=true  或者 没有被 插旗子： isFlagged=true , return
            return;
        }          
        cell.isVisited = true;
        if ( cell.neighborsBomb === 0 && !cell.hasBomb ){
            for ( let dr = -1; dr <= 1; dr++) {
                const nY = row + dy;
                const nX = col + dx;
                if (
                    nr >= 0 && nr < board.length &&
                    nc >= 0 && nc < board[0].length
                ) {
                    visitBomb(board, nY, nX);
                }
            }
        }
    }


function Result(board, row, col) {
    if (board[row][col].hasBomb) {
        console.log("Bombed, dead.");
        return true;
    }
    return false;
}

</script>


<!-- ============================================================================================================================================ -->



<template>
    <div>
        This is the MineSweeper Page
    </div>
</template>



<!-- ======================================================================================================================================================================== -->



<style>
</style>