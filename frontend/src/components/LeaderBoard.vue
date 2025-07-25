<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue';

    const scores = ref({});     // 创建这个 ref 变量来储存 fetch 来的 data. yaa. score
    

// fetch score based on the game nmae, from backend
// 把从服务器获得的排行榜数据保存下来，供页面显示。 need to go poo.
    async function fetchAllScores () {                 
        const snake = await fetch (`http://localhost:3000/scores/game/snake`);  
        scores.value.Snake = await snake.json();            // 把后端返回的数据（JSON 格式）解析出来，赋值给响应式变量 scores
        const minesweeper = await fetch ("http://localhost:3000/scores/game/mineSweeper");
        scores.value.MineSweeper = await minesweeper.json();
    }
        // refresh every 10 min.
    let showAllScoreRenewInterval;
    onMounted(() => {
        fetchAllScores();
        showAllScoreRenewInterval = setInterval(fetchAllScores, 60000);  // 600,000 ms = 10 min
    });
    onBeforeUnmount (() => {
        clearInterval(showAllScoreRenewInterval);
    });
</script>


<template>
    <div class="leader-board">
        
        <h1 style="justify-self: center;">Game's Score</h1>
        <div class="games">
            <div v-for="game, gameName in scores">
                <div class="scores">
                    <strong>{{gameName}}</strong>
                    <br>
                    <div v-for="score in game">
                        {{score.name}}: {{score.score}}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>








<style scoped>
.leader-board {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    box-shadow: 0 0 10px cyan;
    color: white;
    font-family: Arial, sans-serif; 
}
.games {
    display: flex;
    flex-direction: row;
    gap: 20px;
}
.scores {
    display: flex;
    flex-direction: column;
}
</style>