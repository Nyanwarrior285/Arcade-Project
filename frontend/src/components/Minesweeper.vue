<script setup>
    import { ref } from 'vue';
    import { onMounted } from 'vue';
    
    const props = defineProps({             // Now you can access the player’s name using props.playerName.
        playerName: {
            type: String,
            default:""                      // so it wont show name as "undefined"
        }
    });

    onMounted(() => {
        console.log("🧠 playerName received:", props.playerName);
    });

    const gameStart = ref(false);
    const baseScore = ref(1000);
    const mineScore = ref(0);
    const board = ref([]);
    const timer = ref(0);
    const gameOver = ref(false);
    const numOfBom = ref(5);     
    const wrongFlags = ref (0);                               // line 170



// game board setup:

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


// r: y,  c: x.               
// (  dy, dx )

    function checkNeiborBom (board) {
        const rowLength = board.length;
        const colLength = board[0].length;

        let nRy = '';                                 // neibor Row ( y-value )
        let nCx = '';


        console.log("#boms: ", numOfBom.value );


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

                console.log("#boms: ", numOfBom.value );                // check
            }
        }
    }

//=============================================== Timer =============================================================================
    let timerSeq = null;
    function startTimer () {
        timerSeq = setInterval( () => { timer.value++;}, 1000 );         // 1000 毫秒 = 1s
    }           // setIntervall is a build in function
                // clearInterval

    function stopTimer () {
        clearInterval( timerSeq );           // timerSeq act like ID, when pass it in function, it know whicone to stop..
    }




//点击一个格子后进行揭示，如果是空白的（周围没有地雷），就自动展开邻居格子（递归展开）。       
    function visitBom( board, row, col){                   
        const cell = board[row][col];                               // cell: 当前格子, current     

        
        if ( cell.isVisited || cell.isFalged ) return;              // 如果雷被玩家排掉 isVisited=true  或者 没有被 插旗子： defult of isFalged  false -> true now , return
            
        if (cell.hasBom) {
            cell.isVisited = true;
            alert("Bombed & Dead.\nYou Suck!");
            gameOver.value = true;
            stopTimer();
            scoreCalculation();
            console.log(mineScore.value);
            recordScoreOption()
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



    let firstClick = true;

    function leftClickCheck( row, col ) {
        if ( gameOver.value ) {
            stopTimer();
            scoreCalculation();
            console.log(scoreCalculation());
            return;
        }

    
        console.log("clicked", row, col);

        console.log("#boms: ", numOfBom.value );

        if (firstClick){
            startTimer();
            firstClick = false;
            console.log("First click! Placing bombs...");
            mineScore.value = 0;
            placeTheBomAvoidingFirstClick(board.value, row, col);
            checkNeiborBom(board.value);
        }
        visitBom( board.value, row, col);
        checkWin(9);
    }


    function placeTheBomAvoidingFirstClick(board, firstClickRow, firstClickCol) {

        const rows = board.length;
        const cols = board[0].length;
        let marked = 0;

        console.log("#boms: ", numOfBom.value );

        while (marked < numOfBom.value
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


        console.log("#boms: ", numOfBom.value );
    }


    function rightClickFlagging( row, col ) {
        if ( gameOver.value ) return;

        const currentCell = board.value[row][col];
        console.log(currentCell.isVisited);
        
        if ( !currentCell.isVisited ) {
            currentCell.isFalged = !currentCell.isFalged;                            // false->true
        }
        if ( !currentCell.hasBom && currentCell.isFalged) {
                    wrongFlags.value++;   
                    console.log( wrongFlags.value );     
                    scoreCalculation()
                    console.log( scoreCalculation() );

                }
        return wrongFlags.value;
        
    }


    function scoreCalculation() {
        const timePenalty = timer.value * 2;

        const wrongFlagPennalty = wrongFlags.value * 5;

        mineScore.value = baseScore.value - timePenalty - wrongFlagPennalty;
        return mineScore.value;
    }


    function checkWin( boardSize ) {
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++ ) {
                const cell = board.value[r][c];
                if ( !cell.hasBom && !cell.isVisited ) {
                    return false;
                } 
                // if ( !cell.hasBom && cell.isVisited ) {
                //     return true;
                // } 
            }
        }
        stopTimer();
        gameOver.value = true;
        console.log("check");
        scoreCalculation();
        console.log( scoreCalculation() );
        recordScoreOption()
        alert( "Fine, you win, its just luck~" )

        return true;

    }


    async function recordScoreOption () {
        if ( gameOver.value ) {
           
            const recording = confirm(
                props.playerName + ',\nYou got ' + mineScore.value + ' score!\nRecord your score?'
            );
            console.log(props.playerName);
            if (recording) {
                console.log("playerName from props:", props.playerName);
                const res = await fetch("http://localhost:3000/scores", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        name: props.playerName,
                        score: mineScore.value,
                        game: "mineSweeper"
                    })
                });
                console.log(res);
                if (res.ok) {
                    console.log("Your score submitted successfully.");
                } 
                if (!res.ok) {
                    console.error("Oops! ");
                }
            };
        }
    } 

    function restartGame() {
        if ( numOfBom.value >= 4 && numOfBom.value <= 20 ) {
            board.value = createBoard(9);         
            // DON'T place bombs now, wait until first click
            firstClick = true;                    // so bombs avoid first click
            gameOver.value = false;
            gameStart.value = true;
            stopTimer();        // stop the old timer..
            timer.value = 0;    // and reset the timer

        } else {
            alert( "The amount of boms required is between 4 ~ 20 " );
        }
    }





</script>


// <!-- ============================================================================================================================================ -->



<template>
    <div class="MinesBoard" >

        <p> Time: {{ timer }} s</p>  
        <p class="mine-score"> Final Score: <span v-if="gameOver">{{ mineScore }} </span></p>

        <div v-if="!gameStart">  
            <input type="number" id="bom-quantity" v-model="numOfBom" min="4" max="20" />
            <button class="enter-numbers-of-boms" @click="restartGame()">Enter # Boms</button>
        </div>

    </div>
    
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

    <button v-if="gameOver" class="restart-button" @click="restartGame">Start Again</button>

</template>


<!-- //  @contextmenu.prevent="rightClickFlagging(rowIndex, colIndex)" : Run function when user right-clicks       -->
<!-- ======================================================================================================================================================================== -->



<style scoped>

.enter-numbers-of-boms {
    padding: 8px 16px;
    background-color: #28a745; 
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.enter-numbers-of-boms:hover{
    background-color: #07741f;
}

.MinesBoard {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: white;
  font-size: 18px;
  margin-bottom: 8px;
}
.row {
  display: flex;
}
.cell {
  width: 30px;
  height: 30px;
  background-color: grey;
  border: 1px solid #dbd9d9;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  cursor: pointer;
}

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

.mine-score {
  color: white;
  font-size: 18px;
  margin-bottom: 8px;

}

.restart-button {
  margin-bottom: 10px;
  padding: 8px 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  background-color: #0b2035;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

}
.restart-button:hover {
  background-color: #f6d208;
}

  

</style>
