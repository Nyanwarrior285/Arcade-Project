<script setup>
    import { ref, onMounted } from 'vue';

    const scores = ref([]);     // 创建这个 ref 变量来储存 fetch 来的 data. yaa. score
    const props = defineProps ({
        gameName: {
            type:String,
            required: true
        }
    });

// fetch score based on the game nmae, from backend
// 把从服务器获得的排行榜数据保存下来，供页面显示。 need to go poo.
    async function fetchScores () {                 
        const res = await fetch (`http://localhost:3000/scores/game/${props.game}`);  
        scores.value = await res.json();            // 把后端返回的数据（JSON 格式）解析出来，赋值给响应式变量 scores
    }
    onMounted(fetchScores);

</script>






<template>
<ul>
    <li v-for="score in scores" :key="score._id">             <!--    dont forget the space before :key -->
        {{ score.userName }}, {{ score.game }}, {{ score.score }}
    </li>
</ul>


</template>








<style scoped>
</style>