<script setup>
import { ref } from "vue";
import Snake from "./components/Snake.vue"
import MineSweeper from "./components/Minesweeper.vue"

const activePage = ref("home");

function navigateTo(page) {
    activePage.value = page;
}
</script>

<template>
    <div class="container">
        <nav>
            <ul>
                <li><a @click="navigateTo('home')">Home</a></li>
                <li><a @click="navigateTo('snake')">Snake</a></li>
                <li><a @click="navigateTo('minesweeper')">MineSweeper</a></li>
            </ul>
        </nav>
        <div v-if="activePage == 'home'" title="Hello World"></div>
        <Snake v-if="activePage == 'snake'" />
        <MineSweeper v-if="activePage == 'minesweeper'" />
    </div>
</template>

<style scoped>
p {
    font-size: 20px;
    color: #333;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.color-button{
    height: 100px;
    width: 100px;
    margin: 5px;
}
</style>
