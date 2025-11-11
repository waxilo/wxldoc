import md5 from 'js-md5';

// 全局认证状态管理
export const authState = {
  isAuthenticated: false,
  password: '843a52c298b66f721599c82255972010',
  lastActivityTime: null
}

// 5分钟超时时间（毫秒）
const SESSION_TIMEOUT = 5 * 60 * 1000;

export const setAuthenticated = (value) => {
  authState.isAuthenticated = value
  if (value) {
    // 认证成功时记录活动时间
    authState.lastActivityTime = Date.now();
    // 保存到localStorage
    localStorage.setItem('auth_lastActivity', Date.now().toString());
  } else {
    authState.lastActivityTime = null;
    localStorage.removeItem('auth_lastActivity');
  }
}

export const getAuthenticated = () => {
  // 检查是否有有效的会话
  if (authState.isAuthenticated && authState.lastActivityTime) {
    const currentTime = Date.now();
    const timeDiff = currentTime - authState.lastActivityTime;
    
    // 如果超过5分钟，需要重新登录
    if (timeDiff > SESSION_TIMEOUT) {
      authState.isAuthenticated = false;
      authState.lastActivityTime = null;
      localStorage.removeItem('auth_lastActivity');
      return false;
    }
    
    // 更新活动时间
    authState.lastActivityTime = currentTime;
    localStorage.setItem('auth_lastActivity', currentTime.toString());
    return true;
  }
  
  // 检查localStorage中是否有有效的会话
  const storedTime = localStorage.getItem('auth_lastActivity');
  if (storedTime) {
    const currentTime = Date.now();
    const timeDiff = currentTime - parseInt(storedTime);
    
    if (timeDiff <= SESSION_TIMEOUT) {
      // 会话有效，恢复认证状态
      authState.isAuthenticated = true;
      authState.lastActivityTime = currentTime;
      localStorage.setItem('auth_lastActivity', currentTime.toString());
      return true;
    } else {
      // 会话过期，清理
      localStorage.removeItem('auth_lastActivity');
    }
  }
  
  return false;
}

export const checkPassword = (inputPassword) => {
  if (md5(inputPassword) === authState.password) {
    setAuthenticated(true);
    return true;
  }
  return false;
}

// 更新用户活动时间
export const updateActivityTime = () => {
  if (authState.isAuthenticated) {
    authState.lastActivityTime = Date.now();
    localStorage.setItem('auth_lastActivity', authState.lastActivityTime.toString());
  }
}