<script setup>
import { ref } from 'vue';
let name = ref("User");
let new_name = ref("");

function rename() {
  name.value = new_name.value;
  new_name.value = "";
}

const colors = ["aqua", "blueviolet", "fuchsia"]

function recolor(color) {
  document.bgColor = color
}
</script>

<template>
  <div class="container">
    <p>Welcome {{name}}!</p>
    <input v-model="new_name" placeholder="Your name..." style="margin: 5px;">
    <button v-on:click="rename">Enter</button>
    <div style="flex-direction: row;">
      <button v-for="color in colors" v-on:click="recolor(color)" class="color-button" :style="{backgroundColor: color}">{{ color }}</button>
      <!-- <button v-on:click="recolor" style="box-sizing: 1rem; background-color: blueviolet;">{{ colors[1] }}</button>
      <button v-on:click="recolor" style="box-sizing: 1rem; background-color: fuchsia;">{{ colors[2] }}</button> -->
    </div>
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