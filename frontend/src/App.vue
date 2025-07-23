<script setup>
  
  const BASE_URL = 'http://localhost:3000';
  import { ref } from "vue";
  import Snake from "./components/Snake.vue";
  import Minesweeper from "./components/Minesweeper.vue";
  import LeaderBoard from "./components/LeaderBoard.vue";

  const activePage = ref("login");
  // const showAllScore = ref(false);             // set it to a tagle,


  // ref() 是 Vue 的响应式函数，意味着这些变量的值可以实时更新，界面也会自动变化。
  const isLogin = ref(true);        // 当它是 false 的时候，就会显示“注册页面
  // 三个响应式变量，用来保存用户输入的内容:
  const email = ref('');
  const password = ref('');
  const name = ref('');
  // const error = ref("");
  const currentUser = ref ({ name:"", email:"" });

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
        currentUser.value = { name: result.username, email: result.email };
        name.value = result.username;
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
          username: name.value, 
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
  console.log(activePage.value);
  activePage.value = 'login';
}


function navigateTo(page) {
  activePage.value = page;
}

</script>




<template>
  <div v-if="activePage === 'login'" class="body-container">
    <div class="auth-container">
      <!--line122  如果 isLogin 是 true，就显示 "Login"
      否则就显示 "Sign Up" -->
      
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>

      <div id="title">
        <span>THY SHALL HAVE FUN..</span>
        <span>Hopefully...</span>
      </div>



      <div class="login-box">
        <h2>{{ isLogin ? "Login" : "Sign Up" }}</h2>        <!-- 	•	{{ ... }} 是 Vue.js 的插值语法，用于在 HTML 中动态插入变量或表达式的值。 -->
        <form @submit.prevent="handleSubmit" >               <!-- 当表单被“提交”（submit）时，执行 handleSubmit() 这个函数。-->
        
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
      </div>
  </div>




  <div v-else class="container">
    <button @click="logoutToLogin" class="logout-button">Log out</button>
    <nav class="nav-bar">
      <a href="#" @click.prevent="navigateTo('home')" class="nav-button">Home</a>
      <a href="#" @click.prevent="navigateTo('leaderBoard')" class="leader-board-button">Leader Board</a>
      <a href="#" @click.prevent="navigateTo('snake')" class="snake-button">Snake</a>
      <a href="#" @click.prevent="navigateTo('minesweeper')" class="minesweeper-button">Minesweeper</a>
      
    </nav>

    <div v-if="activePage === 'home'" title="Hello World"></div>
    <LeaderBoard v-if="activePage === 'leaderBoard'" />             <!-- ok, the leaderBoard here needs to match line 178, navigateTo('leaderBoard'). Remember!!!!!!!!!!!!!!-->
    <Snake v-if="activePage === 'snake'" :name="name"/>
    <Minesweeper v-if="activePage === 'minesweeper' && currentUser.name" :player-name="currentUser.name" />

  </div>
</template>



<style scoped>


.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  max-width: 100%;
  height: 100vh;

  padding: 1rem;
  padding-top: 10vh;         
  box-sizing: border-box;
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

.login-box {

  display: block; 
  background: rgba(15, 15, 25, 0.85);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 0 25px rgba(0, 255, 255, 0.2), 0 0 60px rgba(0, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  animation: fadeIn 1.2s ease-out;
  z-index: 2;

} 

.login-box div {
  overflow-x: hidden;
  text-align: left;
  margin: 0 auto;
  min-height: fit-content;
}

.login-box h2 {
  overflow-x: hidden; 
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #00f7ff;
  text-shadow: 0 0 12px rgba(0, 247, 255, 0.5);
}

.login-box input {
  overflow-x:  hidden;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  margin: 10px 0 20px;
  border: none;
  border-radius: 8px;
  background-color: #1f1f2e;
  color: white;
  font-size: 1rem;
  outline: none;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.3s;
}

.login-box input:focus {
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
}


.login-box button[type="submit"] {
  background: linear-gradient(135deg, #00f7ff, #007d94);
  border: none;
  color: white;
  font-weight: bold;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  box-shadow: 0 4px 10px rgba(0, 247, 255, 0.3);
} 


.login-box button[type="submit"]:hover {
  background: linear-gradient(135deg, #00d0ff, #006a80);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 247, 255, 0.6);
}

/* Toggle form button */
.login-box p button {
  background: none;
  border: none;
  color: #00f7ff;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0;
  text-decoration: underline;
  font-size: 0.95rem;
}


.login-box form label {
  font-size: 0.95rem;
  overflow-x: hidden; 
}



/* ==================================== login background ==================================================================================== */


.body-container {
  margin: 0;
  padding: 0;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
  overflow:hidden;
  height: 100vh;
  width: 100%;
  background-color: #242631; /* match your .container */
  font-family: 'Lato', sans-serif;
}

#stars, #starts2,#stars3 {
  position: absolute;
  width: 1px;
  height: 1px;
  background: transparent;
}

#stars {
  box-shadow: 
    100px 400px #fff, 300px 800px #fff, 800px 300px #fff,
    1200px 500px #fff, 600px 100px #fff, 200px 900px #fff;
  animation: animStar 50s linear infinite;
}

#stars::after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: inherit;
}

#stars2 {
  width: 2px;
  height: 2px;
  box-shadow:
    250px 700px #ccc, 900px 500px #ccc, 1000px 1000px #ccc,
    1400px 200px #ccc, 500px 900px #ccc;
  animation: animStar 100s linear infinite;
}

#stars2::after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: inherit;
}

#stars3 {
  width: 3px;
  height: 3px;
  box-shadow:
    200px 300px #888, 800px 1200px #888, 1500px 600px #888,
    700px 700px #888, 300px 1500px #888;
  animation: animStar 150s linear infinite;
}

#stars3::after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: inherit;
}

@keyframes animStar {
  from { transform: translateY(0); }
  to   { transform: translateY(-2000px); }
}

/* TITLE TEXT */
#title {
  position: absolute;
  top: 15%;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 50px;
  font-weight: 300;
  letter-spacing: 10px;
  transform: translateY(-50%);
}

#title span {
  display: block;
  background: -webkit-linear-gradient(white, #38495a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#title span:first-child {
  font-size: 64px;
  font-weight: 600;
  letter-spacing: 12px;
}

#title span:nth-child(2) {
  font-size: 20px;        
}


/* Background */
html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
  overflow: hidden;
}

/* Layer 1 - Small Stars */
#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  position: absolute;
  box-shadow: 
    500px 800px #fff,
    1200px 700px #fff,
    300px 1000px #fff,
    900px 300px #fff,
    700px 600px #fff,
    200px 1200px #fff,
    400px 150px #fff,
    1500px 900px #fff,
    1800px 400px #fff,
    50px 300px #fff; /* just a sample — repeat for more stars */
  animation: animStar 50s linear infinite;
}

#stars::after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: inherit;
}

/* Layer 2 - Medium Stars */
#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  position: absolute;
  box-shadow: 
    600px 900px #ccc,
    1300px 600px #ccc,
    800px 1100px #ccc,
    1100px 200px #ccc,
    300px 500px #ccc;
  animation: animStar 100s linear infinite;
}

#stars2::after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: inherit;
}

/* Layer 3 - Big Stars */
#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  position: absolute;
  box-shadow: 
    700px 1000px #888,
    1500px 500px #888,
    400px 1300px #888,
    100px 800px #888,
    900px 200px #888;
  animation: animStar 150s linear infinite;
}

#stars3::after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: inherit;
}

/* Star animation keyframes */
@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}


/* ======================================================================================================================== */


/* body {
  overflow: hidden;
} */

.nav-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
  
}

.nav-button,
.snake-button,
.minesweeper-button,
.leader-board-button {
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


.leader-board-button{
  background: linear-gradient(135deg, #2196F3, #0D47A1);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.leader-board-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(33, 150, 243, 0.5);
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
  background: linear-gradient(135deg, #f6400e, #86681c); 
  color:white;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

.minesweeper-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 193, 7, 0.5);
}


@media (min-width: 600px) {

  .login-box {
    font-size: 1rem;
  }

  .login-box input,
  .login-box button[type="submit"] {
    font-size: 0.95rem;
    padding: 10px;
  }

   #title span:first-child {
    font-size: 42px;
    letter-spacing: 6px;
  }

  #title span:nth-child(2) {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  #title span:first-child {
    font-size: 32px;
    letter-spacing: 3px;
  }

  #title span:nth-child(2) {
    font-size: 14px;
  }
}
</style>
