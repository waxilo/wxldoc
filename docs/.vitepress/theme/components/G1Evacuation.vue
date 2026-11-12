<script setup>
const REGION_W = 72
const REGION_H = 70
const PITCH = 75
const X0 = 40
const SRC_Y = 46
const DST_Y = 180

const SLOT_X = [14, 42, 14, 42]
const SLOT_Y = [12, 12, 34, 34]

const srcRegions = Array.from({ length: 5 }, (_, i) => ({ i, x: X0 + i * PITCH }))

const aliveKeys = new Set(['0-0', '1-0', '2-0', '2-1', '3-0', '4-0'])

const srcObjects = srcRegions.flatMap((region) =>
  SLOT_X.map((dx, slot) => ({
    key: `${region.i}-${slot}`,
    x: region.x + dx,
    y: SRC_Y + SLOT_Y[slot],
    alive: aliveKeys.has(`${region.i}-${slot}`)
  }))
)

const dstRegions = [
  { i: 0, x: 152 },
  { i: 1, x: 227 }
]

const dstObjects = dstRegions.flatMap((region) =>
  SLOT_X.map((dx, slot) => ({
    key: `d${region.i}-${slot}`,
    x: region.x + dx,
    y: DST_Y + SLOT_Y[slot]
  }))
).filter((_, index) => index < 6)

const notes = ['源 Region 复制完直接变 Free', '死对象原地丢弃，没有 sweep 阶段']

const legend = [
  { kind: 'alive', label: '存活对象（被复制）', x: 40 },
  { kind: 'dead', label: '死对象（原地放弃，不复制）', x: 176 },
  { kind: 'region', label: '目标 Region（原有空闲格）', x: 356 }
]
</script>

<template>
  <div class="g1-evac tm-frame">
    <svg viewBox="0 0 680 288" role="img" aria-label="G1 疏散复制：Collection Set 中的存活对象被复制到按需取用的空闲 Region">
      <defs>
        <marker
          id="g1EvacArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M2 1L8 5L2 9" class="g1-evac__arrow-head" />
        </marker>
      </defs>

      <text x="40" y="36" class="g1-evac__head">
        源：Collection Set（Eden / Survivor / Old 可混选，Region 之间无需连续）
      </text>

      <g v-for="region in srcRegions" :key="'src' + region.i">
        <rect :x="region.x" :y="SRC_Y" :width="REGION_W" :height="REGION_H" rx="6" class="g1-evac__src" />
      </g>

      <rect
        v-for="item in srcObjects"
        :key="item.key"
        :x="item.x"
        :y="item.y"
        width="16"
        height="16"
        rx="2"
        :class="item.alive ? 'g1-evac__alive' : 'g1-evac__dead'"
      />

      <path d="M226 116 L226 152" class="g1-evac__arrow" />
      <text x="240" y="138" class="g1-evac__arrow-text">只搬存活对象，PLAB 并行复制</text>

      <text x="40" y="170" class="g1-evac__head">
        目标：从空闲链表按需取用（不用预留等大的 to-space）
      </text>

      <g v-for="region in dstRegions" :key="'dst' + region.i">
        <rect :x="region.x" :y="DST_Y" :width="REGION_W" :height="REGION_H" rx="6" class="g1-evac__target" />
      </g>

      <rect
        v-for="item in dstObjects"
        :key="item.key"
        :x="item.x"
        :y="item.y"
        width="16"
        height="16"
        rx="2"
        class="g1-evac__alive"
      />

      <path d="M330 215 L400 215" class="g1-evac__leader" />
      <text v-for="(note, index) in notes" :key="note" x="408" :y="211 + index * 16" class="g1-evac__note">
        {{ note }}
      </text>

      <g v-for="item in legend" :key="item.label">
        <rect :x="item.x" y="266" width="10" height="10" rx="2" :class="'g1-evac__' + item.kind" />
        <text :x="item.x + 16" y="275" class="g1-evac__legend">{{ item.label }}</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.g1-evac svg {
  display: block;
  width: 100%;
  height: auto;
}

.g1-evac__head {
  font-size: 12px;
  font-weight: 500;
  fill: var(--g1-ink);
}

.g1-evac__src {
  fill: var(--g1-old-fill);
  stroke: var(--g1-old-stroke);
  stroke-width: 0.5;
}

.g1-evac__target {
  fill: var(--g1-target-fill);
  stroke: var(--g1-target-stroke);
  stroke-width: 0.5;
}

.g1-evac__alive {
  fill: var(--g1-eden-fill);
  stroke: var(--g1-eden-stroke);
  stroke-width: 0.5;
}

.g1-evac__dead {
  fill: var(--g1-dead-fill);
  stroke: var(--g1-dead-stroke);
  stroke-width: 0.5;
}

.g1-evac__arrow {
  fill: none;
  stroke: var(--g1-arrow);
  stroke-width: 1.5;
  marker-end: url(#g1EvacArrow);
}

.g1-evac__arrow-head {
  fill: none;
  stroke: var(--g1-arrow);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.g1-evac__arrow-text {
  font-size: 11px;
  fill: var(--g1-ink-muted);
}

.g1-evac__leader {
  fill: none;
  stroke: var(--g1-old-stroke);
  stroke-width: 0.5;
  stroke-dasharray: 3 3;
}

.g1-evac__note {
  font-size: 11px;
  fill: var(--g1-ink-muted);
}

.g1-evac__legend {
  font-size: 11px;
  fill: var(--g1-ink-muted);
}
</style>
