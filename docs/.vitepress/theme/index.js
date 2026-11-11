import DefaultTheme from 'vitepress/theme'
import './styles/tri-color.css'
import TriColorMark from './components/TriColorMark.vue'
import LostMark from './components/LostMark.vue'
// import Layout from '../../components/auth/Layout.vue'

export default {
  ...DefaultTheme,
  // Layout //关闭输入校验
  enhanceApp({ app }) {
    app.component('TriColorMark', TriColorMark)
    app.component('LostMark', LostMark)
  }
}
