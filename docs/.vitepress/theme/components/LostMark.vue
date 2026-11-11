<template>
  <div class="lost-mark tm-frame">
    <svg viewBox="0 42 680 260" role="img" aria-label="漏标的两个必要条件与增量更新、原始快照两种解决方案">
      <defs>
        <marker
          id="lm-arrow"
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

      <path d="M118 100 L209 150" class="lost-mark__added" marker-end="url(#lm-arrow)" />
      <path d="M118 216 L209 166" class="lost-mark__removed" />
      <path d="M157 184 L169 196" class="lost-mark__cross" />
      <path d="M169 184 L157 196" class="lost-mark__cross" />

      <circle cx="96" cy="92" r="22" style="fill: var(--tm-black-fill); stroke: var(--tm-black-stroke)" />
      <text x="96" y="92" class="lost-mark__node" style="fill: var(--tm-black-text)">A</text>
      <circle cx="96" cy="224" r="22" style="fill: var(--tm-grey-fill); stroke: var(--tm-grey-stroke)" />
      <text x="96" y="224" class="lost-mark__node" style="fill: var(--tm-grey-text)">B</text>
      <circle
        cx="232"
        cy="158"
        r="22"
        style="
          fill: var(--tm-dead-fill);
          stroke: var(--tm-dead-stroke);
          stroke-width: 1.2;
          stroke-dasharray: 4 3;
        "
      />
      <text x="232" y="158" class="lost-mark__node" style="fill: var(--tm-dead-text)">E</text>
      <text x="232" y="202" text-anchor="middle" class="lost-mark__hint">E 始终是白色</text>

      <text x="40" y="266" class="lost-mark__note">① 黑色 A 新增一条指向白色 E 的引用（A 不会再被扫）</text>
      <text x="40" y="286" class="lost-mark__note">② 灰色 B 同时断开了指向 E 的引用（扫到时已看不到 E）</text>

      <rect x="340" y="56" width="300" height="100" rx="10" class="lost-mark__card" />
      <text x="356" y="78" class="lost-mark__card-title">增量更新（Incremental Update）· CMS</text>
      <text x="356" y="102" class="lost-mark__card-text">写屏障记录黑色对象的新增引用</text>
      <text x="356" y="122" class="lost-mark__card-text">等价于把黑色退回灰色，末尾重扫</text>
      <text x="356" y="142" class="lost-mark__card-ok">→ E 被重新标记，得救</text>

      <rect x="340" y="176" width="300" height="100" rx="10" class="lost-mark__card" />
      <text x="356" y="198" class="lost-mark__card-title">原始快照（SATB）· G1 / Shenandoah</text>
      <text x="356" y="222" class="lost-mark__card-text">写屏障记录灰色对象被删的旧引用</text>
      <text x="356" y="242" class="lost-mark__card-text">以并发开始那一刻的快照为准</text>
      <text x="356" y="262" class="lost-mark__card-ok">→ E 仍被判定存活</text>
    </svg>
  </div>
</template>

<style scoped>
.lost-mark svg {
  display: block;
  width: 100%;
  height: auto;
}

.lost-mark__added {
  fill: none;
  stroke: var(--tm-dead-stroke);
  stroke-width: 1.2;
  stroke-dasharray: 4 3;
}

.lost-mark__removed {
  fill: none;
  stroke: var(--tm-dead-stroke);
  stroke-width: 1;
  stroke-dasharray: 4 3;
}

.lost-mark__cross {
  fill: none;
  stroke: var(--tm-dead-stroke);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.lost-mark__node {
  font-size: 13px;
  font-weight: 500;
  text-anchor: middle;
  dominant-baseline: central;
}

.lost-mark__hint {
  font-size: 12px;
  fill: var(--tm-danger-text);
}

.lost-mark__note {
  font-size: 12px;
  fill: var(--tm-muted);
}

.lost-mark__card {
  fill: var(--tm-surface);
  stroke: var(--tm-surface-stroke);
  stroke-width: 0.5;
}

.lost-mark__card-title {
  font-size: 13px;
  font-weight: 500;
  fill: var(--vp-c-text-1);
}

.lost-mark__card-text {
  font-size: 12px;
  fill: var(--vp-c-text-2);
}

.lost-mark__card-ok {
  font-size: 12px;
  fill: var(--tm-ok);
}
</style>
