<script setup>
import { computed, ref } from 'vue'

const nodes = [
  { id: 'A', cx: 170, cy: 115 },
  { id: 'B', cx: 320, cy: 115 },
  { id: 'C', cx: 170, cy: 210 },
  { id: 'D', cx: 320, cy: 210 },
  { id: 'X', cx: 460, cy: 210 },
  { id: 'Y', cx: 560, cy: 210 }
]

const palette = {
  white: { fill: 'var(--tm-white-fill)', stroke: 'var(--tm-white-stroke)', text: 'var(--tm-white-text)', dash: '', width: 0.5 },
  grey: { fill: 'var(--tm-grey-fill)', stroke: 'var(--tm-grey-stroke)', text: 'var(--tm-grey-text)', dash: '', width: 0.5 },
  black: { fill: 'var(--tm-black-fill)', stroke: 'var(--tm-black-stroke)', text: 'var(--tm-black-text)', dash: '', width: 0.5 },
  dead: { fill: 'var(--tm-dead-fill)', stroke: 'var(--tm-dead-stroke)', text: 'var(--tm-dead-text)', dash: '4 3', width: 1.2 }
}

const stages = [
  {
    label: '① 初始',
    desc: '堆内所有对象都是白色。GC Roots 是遍历起点（栈帧局部变量、静态变量等），它们引用到的对象先入队。',
    queue: '（空）',
    state: { A: 'white', B: 'white', C: 'white', D: 'white', X: 'white', Y: 'white' }
  },
  {
    label: '② 扫根',
    desc: '扫描根的直接引用：A、B 被引用到，由白染灰并压入队列。灰色 = 已经知道它活着，但还没检查它的引用域。',
    queue: 'A  B',
    state: { A: 'grey', B: 'grey', C: 'white', D: 'white', X: 'white', Y: 'white' }
  },
  {
    label: '③ 取 A',
    desc: 'A 出队：检查它的引用域发现 C，把 C 染灰入队。A 的引用全扫完了，才允许转黑。',
    queue: 'B  C',
    state: { A: 'black', B: 'grey', C: 'grey', D: 'white', X: 'white', Y: 'white' }
  },
  {
    label: '④ 取 B',
    desc: 'B 出队：B 是叶子对象，没有任何引用域需要扫描，直接转黑。',
    queue: 'C',
    state: { A: 'black', B: 'black', C: 'grey', D: 'white', X: 'white', Y: 'white' }
  },
  {
    label: '⑤ 取 C',
    desc: 'C 出队：C 转黑，它的子引用 D 染灰入队。此刻 A、B、C 都已是黑色，但遍历并没有结束。',
    queue: 'D',
    state: { A: 'black', B: 'black', C: 'black', D: 'grey', X: 'white', Y: 'white' }
  },
  {
    label: '⑥ 结束',
    desc: 'D 出队转黑，队列为空，标记阶段结束。仍然是白色的 X、Y 即不可达对象——它们互相引用也没用，引用计数杀不掉的环，可达性分析照样回收。',
    queue: '（空）→ 标记完成',
    state: { A: 'black', B: 'black', C: 'black', D: 'black', X: 'dead', Y: 'dead' }
  }
]

const current = ref(0)
const stage = computed(() => stages[current.value])

function circleStyle(id) {
  const p = palette[stage.value.state[id]]
  return {
    fill: p.fill,
    stroke: p.stroke,
    strokeWidth: p.width,
    strokeDasharray: p.dash || undefined
  }
}

function labelStyle(id) {
  return { fill: palette[stage.value.state[id]].text }
}

function legendStyle(key) {
  const p = palette[key]
  return { fill: p.fill, stroke: p.stroke, strokeWidth: 0.5 }
}
</script>

<template>
  <div class="tri-mark tm-frame">
    <svg class="tri-mark__canvas" viewBox="0 12 660 296" role="img" aria-label="三色标记法的逐步过程">
      <defs>
        <marker
          id="tm-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="context-stroke"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </marker>
      </defs>

      <path d="M300 56 L188 96" class="tri-mark__edge" marker-end="url(#tm-arrow)" />
      <path d="M320 56 L320 88" class="tri-mark__edge" marker-end="url(#tm-arrow)" />
      <path d="M170 140 L170 185" class="tri-mark__edge" marker-end="url(#tm-arrow)" />
      <path d="M194 210 L296 210" class="tri-mark__edge" marker-end="url(#tm-arrow)" />
      <path d="M484 205 Q522 177 536 205" class="tri-mark__edge" marker-end="url(#tm-arrow)" />
      <path d="M536 215 Q522 243 484 215" class="tri-mark__edge" marker-end="url(#tm-arrow)" />

      <rect x="424" y="172" width="172" height="76" rx="10" class="tri-mark__island" />
      <text x="510" y="163" text-anchor="middle" class="tri-mark__island-label">不可达的环</text>

      <rect x="250" y="20" width="140" height="36" rx="8" class="tri-mark__root" />
      <text x="320" y="38" text-anchor="middle" dominant-baseline="central" class="tri-mark__root-label">
        GC Roots（起点）
      </text>

      <g v-for="n in nodes" :key="n.id">
        <circle :cx="n.cx" :cy="n.cy" r="24" :style="circleStyle(n.id)" />
        <text
          :x="n.cx"
          :y="n.cy"
          text-anchor="middle"
          dominant-baseline="central"
          class="tri-mark__node-label"
          :style="labelStyle(n.id)"
        >
          {{ n.id }}
        </text>
      </g>

      <g class="tri-mark__legend">
        <circle cx="150" cy="292" r="7" :style="legendStyle('white')" />
        <text x="164" y="292" dominant-baseline="central">白色 · 从未访问</text>
        <circle cx="292" cy="292" r="7" :style="legendStyle('grey')" />
        <text x="306" y="292" dominant-baseline="central">灰色 · 已入队未扫完</text>
        <circle cx="464" cy="292" r="7" :style="legendStyle('black')" />
        <text x="478" y="292" dominant-baseline="central">黑色 · 扫描完成</text>
      </g>
    </svg>

    <div class="tri-mark__steps">
      <button
        v-for="(s, i) in stages"
        :key="s.label"
        type="button"
        class="tri-mark__btn"
        :class="{ 'is-active': i === current }"
        @click="current = i"
      >
        {{ s.label }}
      </button>
    </div>

    <p class="tri-mark__desc" aria-live="polite">{{ stage.desc }}</p>
    <p class="tri-mark__queue">灰色队列：{{ stage.queue }}</p>
  </div>
</template>

<style scoped>
.tri-mark__canvas {
  display: block;
  width: 100%;
  height: auto;
}

.tri-mark__edge {
  fill: none;
  stroke: var(--tm-edge);
  stroke-width: 1;
}

.tri-mark__island {
  fill: none;
  stroke: var(--tm-island);
  stroke-width: 0.5;
  stroke-dasharray: 4 3;
}

.tri-mark__island-label,
.tri-mark__legend text {
  font-size: 12px;
  fill: var(--tm-muted);
}

.tri-mark__root {
  fill: var(--tm-surface);
  stroke: var(--tm-surface-stroke);
  stroke-width: 0.5;
}

.tri-mark__root-label {
  font-size: 13px;
  fill: var(--tm-white-text);
}

.tri-mark__node-label {
  font-size: 13px;
  font-weight: 500;
  transition: fill 0.2s ease;
}

.tri-mark__canvas circle {
  transition: fill 0.2s ease, stroke 0.2s ease;
}

.tri-mark__steps {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 10px;
}

.tri-mark__btn {
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-family: inherit;
  line-height: 1.6;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tri-mark__btn:hover {
  border-color: var(--tm-muted);
  color: var(--vp-c-text-1);
}

.tri-mark__btn.is-active {
  background: var(--tm-surface);
  border-color: var(--tm-grey-stroke);
  color: var(--vp-c-text-1);
}

.tri-mark__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  min-height: 44px;
}

.tri-mark__queue {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
