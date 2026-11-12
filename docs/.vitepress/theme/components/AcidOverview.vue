<script setup>
const CARD_X = 40
const CARD_W = 340
const CARD_H = 76

const goals = {
  x: 430,
  y: 118,
  w: 210,
  h: 104,
  cx: 535
}

const means = [
  {
    key: 'A',
    label: 'A · 原子性 Atomicity',
    desc: '要么全部生效，要么全部回滚',
    impl: '实现：undo log 反向补偿',
    y: 40,
    tone: 'a'
  },
  {
    key: 'I',
    label: 'I · 隔离性 Isolation',
    desc: '并发事务互不干扰',
    impl: '实现：行锁 + MVCC 快照读',
    y: 132,
    tone: 'i'
  },
  {
    key: 'D',
    label: 'D · 持久性 Durability',
    desc: '提交后宕机也不丢数据',
    impl: '实现：redo log（WAL）刷盘',
    y: 224,
    tone: 'd'
  }
]

const arrows = ['M380 78 L424 148', 'M380 170 L424 170', 'M380 262 L424 192']
</script>

<template>
  <div class="acid tm-frame">
    <svg viewBox="0 0 680 320" role="img" aria-label="ACID 四特性关系：原子性、隔离性、持久性是手段，一致性是它们共同得到的结果">
      <defs>
        <marker
          id="acidArrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M2 1L8 5L2 9" class="acid__arrow-head" />
        </marker>
      </defs>

      <g v-for="item in means" :key="item.key">
        <rect :x="CARD_X" :y="item.y" :width="CARD_W" :height="CARD_H" rx="8" class="acid__card" />
        <rect :x="CARD_X + 1" :y="item.y + 12" width="3" height="52" rx="1.5" :class="'acid__accent acid__accent--' + item.tone" />
        <text :x="CARD_X + 20" :y="item.y + 25" class="acid__title">{{ item.label }}</text>
        <text :x="CARD_X + 20" :y="item.y + 46" class="acid__desc">{{ item.desc }}</text>
        <text :x="CARD_X + 20" :y="item.y + 64" class="acid__impl">{{ item.impl }}</text>
      </g>

      <path v-for="d in arrows" :key="d" :d="d" class="acid__arrow" />

      <rect :x="goals.x" :y="goals.y" :width="goals.w" :height="goals.h" rx="10" class="acid__goal" />
      <text :x="goals.cx" :y="goals.y + 34" class="acid__goal-title" text-anchor="middle">
        C · 一致性 Consistency
      </text>
      <text :x="goals.cx" :y="goals.y + 58" class="acid__goal-sub" text-anchor="middle">
        目的，不是手段
      </text>
      <text :x="goals.cx" :y="goals.y + 78" class="acid__goal-sub" text-anchor="middle">
        没有独立实现机制
      </text>

      <text x="40" y="312" class="acid__note">
        约束（唯一索引、CHECK、外键）只能兜住规则内的部分，业务语义要靠代码保证
      </text>
    </svg>
  </div>
</template>

<style scoped>
.acid svg {
  display: block;
  width: 100%;
  height: auto;
}

.acid__card {
  fill: var(--acid-card-fill);
  stroke: var(--acid-card-stroke);
  stroke-width: 0.5;
}

.acid__accent--a {
  fill: var(--acid-a);
}

.acid__accent--i {
  fill: var(--acid-i);
}

.acid__accent--d {
  fill: var(--acid-d);
}

.acid__title {
  font-size: 13px;
  font-weight: 500;
  fill: var(--acid-ink);
}

.acid__desc {
  font-size: 11px;
  fill: var(--acid-ink-muted);
}

.acid__impl {
  font-size: 11px;
  fill: var(--acid-ink-muted);
}

.acid__arrow {
  fill: none;
  stroke: var(--acid-arrow);
  stroke-width: 1.2;
  marker-end: url(#acidArrow);
}

.acid__arrow-head {
  fill: none;
  stroke: var(--acid-arrow);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.acid__goal {
  fill: var(--acid-goal-fill);
  stroke: var(--acid-goal-stroke);
  stroke-width: 0.5;
}

.acid__goal-title {
  font-size: 13px;
  font-weight: 500;
  fill: var(--acid-goal-text);
}

.acid__goal-sub {
  font-size: 11px;
  fill: var(--acid-goal-text);
}

.acid__note {
  font-size: 11px;
  fill: var(--acid-ink-muted);
}
</style>
