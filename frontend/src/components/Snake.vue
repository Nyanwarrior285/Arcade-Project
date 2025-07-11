<script setup>
import { ref } from "vue";

const direction = ref("east");
const headPosition = ref({x: 5, y: 7});
const bodyPosition = ref([]);
const bodyMaxLength = ref(2);
const applePosition = ref({x: 20, y: 7})
const board = ref([]);
const loseGame = ref(false);

for (let r = 0; r < 15; r++) {
    const row = []
    for (let c = 0; c < 25; c++) {
        const cell = {x: c, y: r, type: "none"};
        if (cell.x === headPosition.value.x && cell.y === headPosition.value.y) {
            cell.type = "head";
        }
        if (cell.x === applePosition.value.x && cell.y === applePosition.value.y) {
            cell.type = "apple";
        }
        row.push(cell);
    }
    board.value.push(row);
}

function moveSnake() {
    if (loseGame.value) {
        return;
    }
    board.value[headPosition.value.y][headPosition.value.x].type = "body";
    bodyPosition.value.push({x: headPosition.value["x"], y: headPosition.value["y"]});
    if (direction.value === "north") {
        headPosition.value.y--;
    }
    if (direction.value === "east") {
        headPosition.value.x++;
    }
    if (direction.value === "south") {
        headPosition.value.y++;
    }
    if (direction.value === "west") {
        headPosition.value.x--;
    }

    if (board.value[headPosition.value.y] === undefined) {
        loseSnake();
        return;
    } else if (board.value[headPosition.value.y][headPosition.value.x] === undefined) {
        loseSnake();
        return;
    } else if (board.value[headPosition.value.y][headPosition.value.x].type === "body") {
        loseSnake();
        return;
    } else {
        if (headPosition.value.x == applePosition.value.x && headPosition.value.y == applePosition.value.y) {
            bodyMaxLength.value += 2;
            createApple();
        }
        board.value[headPosition.value.y][headPosition.value.x].type = "head";
    }



    if (bodyPosition.value.length > bodyMaxLength.value) {
        const removedBody = bodyPosition.value.shift();
        board.value[removedBody["y"]][removedBody["x"]].type = "none"
    }


}

function changeDirection(event) {
    if (event.key === "ArrowUp") {
        direction.value = "north";
    }
    if (event.key === "ArrowRight") {
        direction.value = "east";
    }
    if (event.key === "ArrowDown") {
        direction.value = "south";
    }
    if (event.key === "ArrowLeft") {
        direction.value = "west";
    }
}

function createApple() {
    const availableCells = [];
    for (let r = 0; r < board.value.length; r++) {
        for (let c = 0; c < board.value[r].length; c++) {
            if (board.value[r][c].type === "none") {
                availableCells.push(board.value[r][c]);
            }
        }
    }
    const newApple = availableCells[Math.floor(Math.random()*availableCells.length)];
    applePosition.value.x = newApple.x;
    applePosition.value.y = newApple.y;
    newApple.type = "apple";
}

function loseSnake() {
    console.log(bodyPosition.value.length);
    loseGame.value = true;
    alert("You got " + (bodyPosition.value.length**2 * 10) + " score!")
}

function newGame() {
    loseGame.value = false;
    applePosition.value = {x: 20, y: 7};
    headPosition.value = {x: 5, y: 7};
    bodyPosition.value = [];
    direction.value = "east";
    bodyMaxLength.value = 2

    for (let row of board.value) {
        for (let cell of row) {
            cell.type = "none";
        }
    }
    board.value[applePosition.value.y][applePosition.value.x].type = "apple";
    board.value[headPosition.value.y][headPosition.value.x].type = "head";
}

</script>


<template>
    <div class="snake-container" tabindex="0" v-on:keydown="changeDirection">
        <div class="snake-col">
            <div v-for="row in board" class="snake-row">
                <div v-for="cell in row">
                    <div v-if='cell["type"] == "head"' class="snake-head"></div>
                    <div v-else-if='cell["type"] == "body"' class="snake-body"></div>
                    <div v-else-if='cell["type"] == "apple"' class="snake-apple"></div>
                    <div v-else class="snake-none"></div>
                </div>
            </div>
        </div>
        <button v-on:click="moveSnake" style="align-self: center;">Move snake forward one step</button>
        <button v-on:click="newGame" v-show="loseGame" style="align-self: center;">Reset</button>
    </div>
</template>


<style scoped>
.snake-container {
    display: flex;
    flex-direction: column;
}
.snake-row {
    display: flex;
    flex-direction: row;
    margin-top: 1px;
    margin-bottom: 1px;
    background-color: white;
}
.snake-col {
    display: flex;
    flex-direction: column;
}
.snake-apple {
    background-color: red;
    height: 15px;
    width: 15px;
    margin-left: 1px;
    margin-right: 1px;
}
.snake-head {
    background-color: greenyellow;
    height: 15px;
    width: 15px;
    margin-left: 1px;
    margin-right: 1px;
}
.snake-body {
    background-color: green;
    height: 15px;
    width: 15px;
    margin-left: 1px;
    margin-right: 1px;
}
.snake-none {
    background-color: grey;
    height: 15px;
    width: 15px;
    margin-left: 1px;
    margin-right: 1px;
}
</style>