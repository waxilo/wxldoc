<script setup>
const CELL_W = 72
const CELL_H = 52
const GAP = 3
const PITCH = CELL_W + GAP
const X0 = 40

const cols = Array.from({ length: 8 }, (_, i) => ({
  i,
  x: X0 + i * PITCH,
  cx: X0 + i * PITCH + CELL_W / 2
}))

const rowA_Y = 40
const rowB_Y = 126

const ROW_A_FILLED = [0, 1]

const smallCells = ROW_A_FILLED.flatMap((i) => {
  const bx = cols[i].x
  const items = []
  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      items.push({
        key: `${i}-${r}-${c}`,
        x: bx + 11 + c * 18,
        y: rowA_Y + 10 + r * 18
      })
    }
  }
  return items
})

const rowACells = cols.map((col) => ({
  ...col,
  y: rowA_Y,
  free: !ROW_A_FILLED.includes(col.i)
}))

const rowBCells = cols.map((col) => ({
  ...col,
  y: rowB_Y,
  free: col.i !== 2 && col.i !== 3 && col.i !== 4
}))

const hStart = { x: cols[2].x, w: CELL_W }
const hCont = { x: cols[3].x, w: CELL_W }
const hTail = { x: cols[4].x, w: 30 }
const wasted = { x: cols[4].x + 30, w: CELL_W - 30 }

const legend = [
  { kind: 'obj', label: '对象数据', x: 40 },
  { kind: 'free', label: 'Free Region（可分配）', x: 224 },
  { kind: 'waste', label: '被浪费，不可分配', x: 420 }
]
</script>

<template>
  <div class="g1-hum tm-frame">
    <svg viewBox="0 0 680 246" role="img" aria-label="G1 中普通对象与 Humongous 大对象的 Region 占用对比">
      <text x="40" y="30" class="g1-hum__head">普通对象：落在 Region 内任意位置，零散剩余仍可继续分配</text>

      <g v-for="cell in rowACells" :key="'a' + cell.i">
        <rect
          :x="cell.x"
          :y="cell.y"
          :width="CELL_W"
          :height="CELL_H"
          rx="6"
          class="g1-hum__region"
        />
        <text v-if="cell.free" :x="cell.cx" :y="cell.y + CELL_H / 2" class="g1-hum__free">Free</text>
      </g>

      <rect
        v-for="item in smallCells"
        :key="item.key"
        :x="item.x"
        :y="item.y"
        width="14"
        height="14"
        rx="2"
        class="g1-hum__obj"
      />

      <text x="40" y="116" class="g1-hum__head">Humongous（≥ 1/2 Region）：只能整段连续，起点对齐首个 Region</text>

      <g v-for="cell in rowBCells" :key="'b' + cell.i">
        <rect
          :x="cell.x"
          :y="cell.y"
          :width="CELL_W"
          :height="CELL_H"
          rx="6"
          class="g1-hum__region"
        />
        <text v-if="cell.free" :x="cell.cx" :y="cell.y + CELL_H / 2" class="g1-hum__free">Free</text>
      </g>

      <rect
        :x="hStart.x"
        :y="rowB_Y"
        :width="hStart.w"
        :height="CELL_H"
        rx="6"
        class="g1-hum__obj"
      />
      <text :x="hStart.x + hStart.w / 2" :y="rowB_Y + CELL_H / 2" class="g1-hum__obj-text">H-start</text>

      <rect
        :x="hCont.x"
        :y="rowB_Y"
        :width="hCont.w"
        :height="CELL_H"
        rx="6"
        class="g1-hum__obj"
      />
      <text :x="hCont.x + hCont.w / 2" :y="rowB_Y + CELL_H / 2" class="g1-hum__obj-text">H-cont</text>

      <rect :x="hTail.x" :y="rowB_Y" :width="hTail.w" :height="CELL_H" class="g1-hum__obj" />
      <rect :x="wasted.x" :y="rowB_Y" :width="wasted.w" :height="CELL_H" class="g1-hum__waste" />

      <path :d="`M${wasted.x} ${rowB_Y + CELL_H} L${wasted.x} ${rowB_Y + CELL_H + 10}`" class="g1-hum__leader" />
      <path :d="`M${wasted.x + wasted.w} ${rowB_Y + CELL_H} L${wasted.x + wasted.w} ${rowB_Y + CELL_H + 10}`" class="g1-hum__leader" />
      <path
        :d="`M${wasted.x} ${rowB_Y + CELL_H + 10} L${wasted.x + wasted.w} ${rowB_Y + CELL_H + 10}`"
        class="g1-hum__leader"
      />
      <text :x="wasted.x + wasted.w / 2" :y="rowB_Y + CELL_H + 24" class="g1-hum__waste-text">
        剩余空间直到整个对象回收前不可分配
      </text>

      <g v-for="item in legend" :key="item.label">
        <rect :x="item.x" y="220" width="10" height="10" rx="2" :class="'g1-hum__' + item.kind" />
        <text :x="item.x + 16" y="229" class="g1-hum__legend">{{ item.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.g1-hum svg {
  display: block;
  width: 100%;
  height: auto;
}

.g1-hum__head {
  font-size: 12px;
  font-weight: 500;
  fill: var(--g1-ink);
}

.g1-hum__region {
  fill: var(--g1-old-fill);
  stroke: var(--g1-old-stroke);
  stroke-width: 0.5;
}

.g1-hum__free {
  font-size: 11px;
  fill: var(--g1-ink-muted);
  text-anchor: middle;
  dominant-baseline: central;
}

.g1-hum__obj {
  fill: var(--g1-eden-fill);
  stroke: var(--g1-eden-stroke);
  stroke-width: 0.5;
}

.g1-hum__obj-text {
  font-size: 11px;
  fill: var(--g1-eden-text);
  text-anchor: middle;
  dominant-baseline: central;
}

.g1-hum__waste {
  fill: var(--tm-dead-fill);
  stroke: var(--tm-dead-stroke);
  stroke-width: 0.5;
  stroke-dasharray: 3 2;
}

.g1-hum__leader {
  fill: none;
  stroke: var(--tm-dead-stroke);
  stroke-width: 0.5;
  stroke-dasharray: 2 2;
}

.g1-hum__waste-text {
  font-size: 11px;
  fill: var(--tm-danger-text);
  text-anchor: middle;
}

.g1-hum__legend {
  font-size: 11px;
  fill: var(--g1-ink-muted);
}
</style>
