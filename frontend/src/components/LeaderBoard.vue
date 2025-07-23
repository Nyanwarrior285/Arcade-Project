<script setup>
    import { ref, onMounted } from 'vue';

    const scores = ref([]);     // 创建这个 ref 变量来储存 fetch 来的 data. yaa. score
    

// fetch score based on the game nmae, from backend
// 把从服务器获得的排行榜数据保存下来，供页面显示。 need to go poo.
    async function fetchAllScores () {                 
        const res = await fetch (`http://localhost:3000/scores/`);  
        scores.value = await res.json();            // 把后端返回的数据（JSON 格式）解析出来，赋值给响应式变量 scores
    }
        // refresh every 10 min.
        let showAllScoreRenewInterval;
        onMounted(() => {
            fetchAllScores();
            showAllScoreRenewInterval = setInterval(fetchAllScores, 600000);  // 600,000 ms = 10 min
        });
        onBeforeUnmount (() => {
            clearInterval(showAllScoreRenewInterval);
        });
</script>


<template>
    <div class="leader-board">
        
        <h1>All Games Sore</h1>               <!-- App.vue: <LeaderBoard :game="'snake'" /> 来 define 哪个 game name--> 
        <ul>
            <li v-for="score in scores" :key="score._id">             <!--    dont forget the space before :key -->
                 {{ score.game }}, {{ score.name }}, {{ score.score }}
            </li>
        </ul>
    </div>

</template>








<style scoped>
  .leader-board {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 0 10px cyan;
    color: white;
    font-family: Arial, sans-serif;
}   
</style>