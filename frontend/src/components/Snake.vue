<script setup>
import { ref } from "vue";
const user = defineProps(["name", "email"]);
console.log(user);

const direction = ref("east");
const headPosition = ref({x: 5, y: 7});
const bodyPosition = ref([]);
const bodyMaxLength = ref(2);
const applePosition = ref({x: 20, y: 7})
const board = ref([]);
const loseGame = ref(false);
const IntervalID = ref();
const speed = ref(100);
const currentSpeed = ref(100);
// const leaderBoard = ref(await fetch("http://localhost:3000/scores/game/snake"));
const score = ref(40);

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


    score.value += bodyMaxLength.value * (1000 / currentSpeed.value);
    bodyMaxLength.value += 1;
    score.value += bodyMaxLength.value * (1000 / currentSpeed.value);

    score.value += bodyMaxLength.value * (1000 / currentSpeed.value);
    bodyMaxLength.value += 1;
    score.value += bodyMaxLength.value * (1000 / currentSpeed.value);
}

function autoMove() {
    currentSpeed.value = speed.value;
    IntervalID.value = setInterval(moveSnake, currentSpeed.value);
}

function stopAutoMove() {
    if (IntervalID.value) {
        clearInterval(IntervalID.value);
    }
    IntervalID.value = 0;
    currentSpeed.value = 100;
}

async function loseSnake() {
    loseGame.value = true;
    stopAutoMove();
    console.log(user)
    const submitScore = confirm("You got " + score.value + " score! \nSubmit score?");
    if (submitScore) {
        const res = await fetch("http://localhost:3000/scores", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                score: score.value,
                game: "snake"
            })
        });
        console.log(res);
    };
    // leaderBoard.value = await fetch("http://localhost:3000/scores/game/snake");
}

function newGame() {
    loseGame.value = false;
    applePosition.value = {x: 20, y: 7};
    headPosition.value = {x: 5, y: 7};
    bodyPosition.value = [];
    direction.value = "east";
    bodyMaxLength.value = 2;
    score.value = 40;

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
        <strong style="color: white">Score: {{score}}</strong>
        <div class="snake-col">
            <div v-for="row in board" class="snake-row">
                <div v-for="cell in row">
                    <div v-if='cell["type"] == "head"' class="cell snake-head"></div>
                    <div v-else-if='cell["type"] == "body"' class="cell snake-body"></div>
                    <div v-else-if='cell["type"] == "apple"' class="cell snake-apple"></div>
                    <div v-else class="cell snake-none"></div>
                </div>
            </div>
        </div>
        <button v-on:click="moveSnake" class="button">Move by one space</button>
        <div class="input-container">
            <div class="button-container">
                <button v-on:click="autoMove" class="button">Start</button>
                <button v-on:click="stopAutoMove" class="button">Stop</button>
            </div>
            <div class="button-container">
                <div style="color: white">Speed(ms):</div>
                <input v-model="speed" type="number" class="input"/>
            </div>
        </div>
        <button v-on:click="newGame" v-show="loseGame" class="button">Reset</button>
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
}
.snake-col {
    display: flex;
    flex-direction: column;
}
.snake-apple {
    background-color: red;
}
.snake-head {
    background-color: greenyellow;
}
.snake-body {
    background-color: green;
}
.snake-none {
    background-color: grey;
}
.cell {
    height: 15px;
    width: 15px;
    border: 1px solid #dbd9d9;
}
.button-container {
    display: flex;
    flex-direction: column;
    align-self: center;
}
.input-container {
    display: flex;
    flex-direction: row;
    align-self: center;
}
.button {
    align-self: center;
}
.input {
    align-self: center;
    field-sizing: content;
}
</style>