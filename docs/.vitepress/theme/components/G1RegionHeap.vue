<script setup>
const COLS = 4
const CELL_W = 76
const CELL_H = 46
const GAP_X = 6
const GAP_Y = 8
const ORIGIN_X = 40
const ORIGIN_Y = 60
const CARD_X = 396
const CARD_W = 244
const BAR_W = 192

const regions = [
  { label: 'Eden', kind: 'eden' },
  { label: 'Old', kind: 'old' },
  { label: 'Old', kind: 'garbage', order: 3 },
  { label: 'Eden', kind: 'eden' },
  { label: 'Old', kind: 'old' },
  { label: 'Survivor', kind: 'survivor' },
  { label: 'Old', kind: 'garbage', order: 1 },
  { label: 'Old', kind: 'old' },
  { label: 'Eden', kind: 'eden' },
  { label: 'Old', kind: 'old' },
  { label: 'Old', kind: 'old' },
  { label: 'Old', kind: 'garbage', order: 2 },
  { label: 'H', kind: 'humongous' },
  { label: 'Old', kind: 'old' },
  { label: 'Eden', kind: 'eden' },
  { label: 'H', kind: 'humongous' }
]

const cells = regions.map((region, index) => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const x = ORIGIN_X + col * (CELL_W + GAP_X)
  const y = ORIGIN_Y + row * (CELL_H + GAP_Y)
  return {
    ...region,
    x,
    y,
    labelX: x + CELL_W / 2,
    labelY: y + CELL_H / 2,
    badgeX: x + CELL_W - 8,
    badgeY: y + 8
  }
})

const cards = [
  { order: 1, id: 'Region 7', garbage: 92, note: '回收成本最低，先动手' },
  { order: 2, id: 'Region 12', garbage: 78, note: '性价比次高，预算内再收' },
  { order: 3, id: 'Region 3', garbage: 61, note: '预算耗尽则留到下一轮' }
].map((card, index) => ({ ...card, y: 58 + index * 68 }))

const legend = [
  { kind: 'eden', label: 'Eden', x: 40 },
  { kind: 'survivor', label: 'Survivor', x: 120 },
  { kind: 'old', label: 'Old · 存活多', x: 222 },
  { kind: 'garbage', label: 'Old · 垃圾多', x: 330 },
  { kind: 'humongous', label: 'H：巨型对象', x: 440 }
]

const barWidth = (pct) => Math.round((BAR_W * pct) / 100)
</script>

<template>
  <div class="g1-heap tm-frame">
    <svg viewBox="0 0 680 315" role="img" aria-label="G1 堆的 Region 化布局与垃圾优先回收顺序">
      <text x="40" y="40" class="g1-heap__head">堆 = 约 2048 个等大 Region（每个 1–32 MB，随堆大小自适应）</text>
      <text :x="CARD_X" y="40" class="g1-heap__head">回收顺序：垃圾率高的先收</text>

      <g v-for="cell in cells" :key="cell.x + '-' + cell.y">
        <rect
          :x="cell.x"
          :y="cell.y"
          :width="CELL_W"
          :height="CELL_H"
          rx="6"
          :class="['g1-heap__cell', 'g1-heap__cell--' + cell.kind]"
        />
        <text
          :x="cell.labelX"
          :y="cell.labelY"
          :class="['g1-heap__label', 'g1-heap__label--' + cell.kind]"
        >{{ cell.label }}</text>
        <template v-if="cell.order">
          <circle :cx="cell.badgeX" :cy="cell.badgeY" r="8" class="g1-heap__badge" />
          <text :x="cell.badgeX" :y="cell.badgeY" class="g1-heap__badge-text">{{ cell.order }}</text>
        </template>
      </g>

      <g v-for="card in cards" :key="card.id">
        <rect :x="CARD_X" :y="card.y" :width="CARD_W" height="58" rx="8" class="g1-heap__card" />
        <circle :cx="CARD_X + 20" :cy="card.y + 20" r="11" class="g1-heap__badge" />
        <text :x="CARD_X + 20" :y="card.y + 20" class="g1-heap__badge-text">{{ card.order }}</text>
        <text :x="CARD_X + 40" :y="card.y + 25" class="g1-heap__card-title">
          {{ card.id }} · 垃圾率 {{ card.garbage }}%
        </text>
        <text :x="CARD_X + 40" :y="card.y + 43" class="g1-heap__card-text">{{ card.note }}</text>
        <rect :x="CARD_X + 40" :y="card.y + 50" :width="BAR_W" height="4" rx="2" class="g1-heap__bar-bg" />
        <rect
          :x="CARD_X + 40"
          :y="card.y + 50"
          :width="barWidth(card.garbage)"
          height="4"
          rx="2"
          class="g1-heap__bar-fg"
        />
      </g>

      <g v-for="item in legend" :key="item.label">
        <rect
          :x="item.x"
          y="282"
          width="10"
          height="10"
          rx="2"
          :class="['g1-heap__cell', 'g1-heap__cell--' + item.kind]"
        />
        <text :x="item.x + 16" y="291" class="g1-heap__legend-text">{{ item.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.g1-heap svg {
  display: block;
  width: 100%;
  height: auto;
}

.g1-heap__head {
  font-size: 12px;
  font-weight: 500;
  fill: var(--g1-ink);
}

.g1-heap__cell {
  stroke-width: 0.5;
}

.g1-heap__cell--eden {
  fill: var(--g1-eden-fill);
  stroke: var(--g1-eden-stroke);
}

.g1-heap__cell--survivor {
  fill: var(--g1-survivor-fill);
  stroke: var(--g1-eden-stroke);
}

.g1-heap__cell--old {
  fill: var(--g1-old-fill);
  stroke: var(--g1-old-stroke);
}

.g1-heap__cell--garbage {
  fill: var(--g1-garbage-fill);
  stroke: var(--g1-garbage-stroke);
}

.g1-heap__cell--humongous {
  fill: var(--g1-humongous-fill);
  stroke: var(--g1-old-stroke);
}

.g1-heap__label {
  font-size: 11px;
  text-anchor: middle;
  dominant-baseline: central;
}

.g1-heap__label--eden {
  fill: var(--g1-eden-text);
}

.g1-heap__label--survivor {
  fill: var(--g1-survivor-text);
}

.g1-heap__label--old {
  fill: var(--g1-old-text);
}

.g1-heap__label--garbage {
  fill: var(--g1-garbage-text);
}

.g1-heap__label--humongous {
  fill: var(--g1-humongous-text);
}

.g1-heap__badge {
  fill: var(--g1-badge-fill);
  stroke: var(--g1-badge-stroke);
  stroke-width: 1;
}

.g1-heap__badge-text {
  font-size: 11px;
  fill: var(--g1-badge-text);
  text-anchor: middle;
  dominant-baseline: central;
}

.g1-heap__card {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-border);
  stroke-width: 0.5;
}

.g1-heap__card-title {
  font-size: 13px;
  font-weight: 500;
  fill: var(--g1-ink);
}

.g1-heap__card-text {
  font-size: 11px;
  fill: var(--g1-ink-muted);
}

.g1-heap__bar-bg {
  fill: var(--g1-bar-bg);
}

.g1-heap__bar-fg {
  fill: var(--g1-bar-fg);
}

.g1-heap__legend-text {
  font-size: 11px;
  fill: var(--g1-ink-muted);
}
</style>
