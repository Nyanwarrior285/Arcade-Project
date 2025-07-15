<script setup>
  
  const BASE_URL = 'http://localhost:5174';
  import { ref } from "vue";
  import Snake from "./components/Snake.vue";
  import Minesweeper from "./components/Minesweeper.vue";

  const activePage = ref("login");



  // ref() 是 Vue 的响应式函数，意味着这些变量的值可以实时更新，界面也会自动变化。
  const isLogin = ref(true);        // 当它是 false 的时候，就会显示“注册页面
  // 三个响应式变量，用来保存用户输入的内容:
  const email = ref('');
  const password = ref('');
  const name = ref('');
  const error = ref("");


  // login signup Taggle
  function toggleForm() {                           // toggleForm() 是一个切换登录/注册表单的 function。  
    isLogin.value = !isLogin.value;                 // → 切换当前页面：如果本来是登录页面，就变成注册页面，反之亦然


    // •	把邮箱、密码、名字全部设为 ''（空字符串),	这可以避免切换页面时保留上一次的输入 
    email.value = '';                               
    password.value = '';
    name.value = '';
  }
// 前端 Vue 添加实际请求逻辑:

// handleSubmit() 被调用
// │
// ├── 如果是登录状态
// │   └── 发 POST 到 /login
// │       ├── 成功：显示登录成功
// │       └── 失败：提示错误
// │
// └── 如果是注册状态
//     └── 发 POST 到 /register
//         ├── 成功：提示注册成功 + 切换页面
//         └── 失败：提示错误

// （所有异常都用 try...catch 兜底）


async function handleSubmit() {
  try {                                                     // 使用 try...catch 捕获任何可能发生的错误（比如网络断开）。
    if (isLogin.value) {                                    // isLogin.value === true：表示用户正在登录 	否则就是注册模式
      const res = await fetch(`${BASE_URL}/login`, {        // 向 server 发送 login 请求  with 必要的headers， body 是 login 时 所需的 content
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.value, 
          password: password.value 
        }),
        credentials: 'include'
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Login successful:', result);
        activePage.value = 'home';                    // switch to MainPage after login
      
        // TODO: 设置 currentUser、跳转页面等
      }
      else {
        const error = await res.json();
        console.error('Unable to login:', error.message || error);
        alert('Failed to login:' + (error.message || 'ERROR'));
      }
    } else {
      const res = await fetch(`${BASE_URL}/register`, {
      
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.value, 
          email: email.value, 
          password: password.value 
        }),
        credentials: 'include'
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Registed successful:', result);
        alert('Registered, Please login');
        toggleForm(); // 自动跳转到登录表单
      } else {
        const error = await res.json();
        console.error('Failed to register:', error.message || error);
        alert('Register failed:' + (error.message || '未知错误 unknow error ... da~'));
      }
    }
  } catch (err) {
    console.error('network error:', err.message);
    alert('Network error, Try again later');
  }
}


//============================================= / handle Logout / =====================================================================

function logoutToLogin() {
  console.log(page.value);
  activePage.value = 'login';
}


function navigateTo(page) {
  activePage.value = page;
}

</script>




<template>
  <div v-if="activePage === 'login'"class="auth-container">
    <!--line122  如果 isLogin 是 true，就显示 "Login"
    否则就显示 "Sign Up" -->
    <h2>{{ isLogin ? "Login" : "Sign Up" }}</h2>        <!-- 	•	{{ ... }} 是 Vue.js 的插值语法，用于在 HTML 中动态插入变量或表达式的值。 -->

    <form @submit.prevent="handleSubmit">               <!-- 当表单被“提交”（submit）时，执行 handleSubmit() 这个函数。-->
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />       <!-- Vue 的双向绑定语法：email 是 Vue 中的响应式变量，这行代码的意思是：“输入框的值 ←→ email 变量实时同步” -->
      </div>

      <div>
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <div v-if="!isLogin">
        <label>Name:</label>
        <input type="text" v-model="name" required />
      </div>

      <button type="submit">{{ isLogin ? "Login" : "Sign Up" }}</button>
    </form>

    <p>
      {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      <button @click="toggleForm">{{ isLogin ? "Sign Up" : "Login" }}</button>
    </p>
  </div>
    




    <div v-else class="container">
        <button @click="logoutToLogin" class="logout-button">Log out</button>
        <nav class="nav-bar">
            <a href="#" @click.prevent="navigateTo('home')" class="nav-button">Home</a>
            <a href="#" @click.prevent="navigateTo('snake')" class="snake-button">Snake</a>
            <a href="#" @click.prevent="navigateTo('minesweeper')" class="minesweeper-button">MineSweeper</a>
        </nav>

        <div v-if="activePage === 'home'" title="Hello World"></div>
        <Snake v-if="activePage === 'snake'" />
        <Minesweeper v-if="activePage === 'minesweeper'" />

    </div>
</template>



<style scoped>

.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  /* border: 1px solid #ddd; */
  border-radius: 8px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #242631;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #242631; /* match your .container */
  font-family: 'Segoe UI', sans-serif;
}

body {
  overflow: hidden;
}

.nav-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
  
}

.nav-button,
.snake-button,
.minesweeper-button {
  width: 240px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.logout-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
.logout-button:hover {
  background: #c0392b;
}
/* Home */
.nav-button {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}
.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.5);
}

/* Snake */
.snake-button {
  background: linear-gradient(135deg, #2196F3, #0D47A1);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}
.snake-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(33, 150, 243, 0.5);
}

/* Minesweeper */
.minesweeper-button {
  background: linear-gradient(135deg, #FFEB3B, #FBC02D); 
  color: #333;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

.minesweeper-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 193, 7, 0.5);
}



</style>
