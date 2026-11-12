<script setup>
const BOX_W = 132
const BOX_H = 76
const BOX_Y = 56
const CENTER_Y = BOX_Y + BOX_H / 2

const stages = [
  { title: 'Young GC', detail: '仅扫新生代', pause: '全停顿 · 毫秒级', tone: 'stw', x: 40 },
  { title: '并发标记', detail: '堆占用 > IHOP', pause: '主体与应用并发', tone: 'concurrent', x: 196 },
  { title: 'Mixed GC', detail: '新生代 + 部分 Old', pause: '全停顿 · 分多轮', tone: 'stw', x: 352 },
  { title: 'Full GC 兜底', detail: '回收跟不上时触发', pause: 'JDK 8 单线程', tone: 'fallback', x: 508 }
]

const arrows = stages.slice(0, -1).map((stage, index) => ({
  from: stage.x + BOX_W + 2,
  to: stages[index + 1].x - 4
}))

const notes = [
  'MaxGCPauseMillis 是软目标：G1 用衰减平均预测每个 Region 的回收成本',
  '预算用满就停手，收不完的 Old Region 留到下一轮 → 停顿有上限'
]
</script>

<template>
  <div class="g1-cycle tm-frame">
    <svg viewBox="0 0 680 234" role="img" aria-label="G1 的三种回收周期与各自的停顿特征">
      <defs>
        <marker
          id="g1-cycle-arrow"
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

      <g v-for="stage in stages" :key="stage.title">
        <rect
          :x="stage.x"
          :y="BOX_Y"
          :width="BOX_W"
          :height="BOX_H"
          rx="8"
          :class="['g1-cycle__box', 'g1-cycle__box--' + stage.tone]"
        />
        <text :x="stage.x + BOX_W / 2" :y="BOX_Y + 24" class="g1-cycle__title">{{ stage.title }}</text>
        <text :x="stage.x + BOX_W / 2" :y="BOX_Y + 44" class="g1-cycle__detail">{{ stage.detail }}</text>
        <text
          :x="stage.x + BOX_W / 2"
          :y="BOX_Y + 62"
          :class="['g1-cycle__pause', 'g1-cycle__pause--' + stage.tone]"
        >{{ stage.pause }}</text>
      </g>

      <path
        v-for="arrow in arrows"
        :key="arrow.from"
        :d="`M${arrow.from} ${CENTER_Y} L${arrow.to} ${CENTER_Y}`"
        class="g1-cycle__arrow"
        marker-end="url(#g1-cycle-arrow)"
      />

      <rect x="40" y="158" width="600" height="56" rx="8" class="g1-cycle__note" />
      <text v-for="(note, index) in notes" :key="note" x="58" :y="180 + index * 20" class="g1-cycle__note-text">
        {{ note }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.g1-cycle svg {
  display: block;
  width: 100%;
  height: auto;
}

.g1-cycle__box {
  stroke-width: 0.5;
}

.g1-cycle__box--stw {
  fill: var(--g1-stw-fill);
  stroke: var(--g1-stw-stroke);
}

.g1-cycle__box--concurrent {
  fill: var(--g1-concurrent-fill);
  stroke: var(--g1-concurrent-stroke);
}

.g1-cycle__box--fallback {
  fill: var(--g1-fallback-fill);
  stroke: var(--g1-fallback-stroke);
}

.g1-cycle__title {
  font-size: 13px;
  font-weight: 500;
  fill: var(--g1-ink);
  text-anchor: middle;
  dominant-baseline: central;
}

.g1-cycle__detail {
  font-size: 11px;
  fill: var(--g1-ink-muted);
  text-anchor: middle;
  dominant-baseline: central;
}

.g1-cycle__pause {
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
  fill: var(--g1-ink-muted);
}

.g1-cycle__pause--fallback {
  fill: var(--g1-danger-text);
}

.g1-cycle__arrow {
  fill: none;
  stroke: var(--g1-arrow);
  stroke-width: 1.5;
}

.g1-cycle__note {
  fill: var(--g1-note-fill);
  stroke: var(--g1-note-stroke);
  stroke-width: 0.5;
}

.g1-cycle__note-text {
  font-size: 12px;
  fill: var(--g1-ink-muted);
}
</style>
