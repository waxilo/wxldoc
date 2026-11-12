import DefaultTheme from 'vitepress/theme'
import './styles/tri-color.css'
import TriColorMark from './components/TriColorMark.vue'
import LostMark from './components/LostMark.vue'
import G1RegionHeap from './components/G1RegionHeap.vue'
import G1Cycle from './components/G1Cycle.vue'
import G1Humongous from './components/G1Humongous.vue'
import G1Evacuation from './components/G1Evacuation.vue'
import AcidOverview from './components/AcidOverview.vue'
// import Layout from '../../components/auth/Layout.vue'

export default {
  ...DefaultTheme,
  // Layout //关闭输入校验
  enhanceApp({ app }) {
    app.component('TriColorMark', TriColorMark)
    app.component('LostMark', LostMark)
    app.component('G1RegionHeap', G1RegionHeap)
    app.component('G1Cycle', G1Cycle)
    app.component('G1Humongous', G1Humongous)
    app.component('G1Evacuation', G1Evacuation)
    app.component('AcidOverview', AcidOverview)
  }
}
