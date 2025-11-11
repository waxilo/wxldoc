<template>
  <!-- 密码验证界面 -->
  <div v-if="!isAuthenticated" class="auth-layout">
    <!-- 图片背景 -->
    <img class="image-background" src="/index.png" alt="背景图片">
    
    <div class="password-container">
      <div class="input-group">
        <input 
          v-model="password" 
          type="password" 
          :placeholder="errorMessage ? '密码错误，请重新输入' : '请输入密码'" 
          class="password-input"
          @keyup.enter="checkPassword"
        />
      </div>
    </div>
  </div>
  
  <!-- 认证后的正常布局 -->
  <DefaultThemeLayout v-else>
    <slot />
  </DefaultThemeLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { getAuthenticated, setAuthenticated, checkPassword as authCheckPassword, updateActivityTime } from './auth.js'

const DefaultThemeLayout = DefaultTheme.Layout
const isAuthenticated = ref(false)
const password = ref('')
const errorMessage = ref('')

// 用户活动检测的定时器
let activityTimer = null

onMounted(() => {
  isAuthenticated.value = getAuthenticated()
  
  // 如果已认证，设置用户活动检测
  if (isAuthenticated.value) {
    setupActivityMonitoring()
  }
})

onUnmounted(() => {
  // 清理定时器
  if (activityTimer) {
    clearInterval(activityTimer)
    activityTimer = null
  }
})

const checkPassword = () => {
  if (authCheckPassword(password.value)) {
    isAuthenticated.value = true
    errorMessage.value = ''
    // 认证成功后设置活动监控
    setupActivityMonitoring()
  } else {
    errorMessage.value = '密码错误，请重新输入'
    password.value = ''
  }
}

// 设置用户活动监控
const setupActivityMonitoring = () => {
  // 初始更新活动时间
  updateActivityTime()
  
  // 清除现有定时器
  if (activityTimer) {
    clearInterval(activityTimer)
  }
  
  // 每30秒检查一次用户活动状态
  activityTimer = setInterval(() => {
    const currentAuthStatus = getAuthenticated()
    if (!currentAuthStatus) {
      // 会话已过期，需要重新登录
      isAuthenticated.value = false
      if (activityTimer) {
        clearInterval(activityTimer)
        activityTimer = null
      }
    }
  }, 30000)
  
  // 监听用户活动事件
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
  activityEvents.forEach(event => {
    document.addEventListener(event, updateActivityTime, { passive: true })
  })
  
  // 在组件卸载时清理事件监听器
  onUnmounted(() => {
    activityEvents.forEach(event => {
      document.removeEventListener(event, updateActivityTime)
    })
  })
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
}

.password-container {
  align-items: center;
  width: 100%;
  height: 50vh;
  position: fixed;
  bottom: -50px;
  left: 0;
  display: flex;
  justify-content: center;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 100px;
  max-width: 400px;
  width: 90%;
}

.password-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  text-align: center;
  background: transparent;
  color: white;
  border-radius: 100px;
}

.password-input:hover {
  background: rgba(255, 255, 255, 0.15);
}

.password-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}
</style>