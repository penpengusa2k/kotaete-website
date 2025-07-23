<template>
  <div class="relative group inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip" ref="tooltipTrigger">
    <slot />
    <teleport to="body">
      <div
        v-if="isVisible"
        :style="tooltipStyle"
        class="absolute z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg max-w-xs whitespace-pre-wrap break-words"
      >
        {{ content }}
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';

const props = defineProps({
  content: { type: String, required: true }
});

const isVisible = ref(false);
const tooltipStyle = reactive({
  top: '0px',
  left: '0px',
  transform: 'translateX(-50%) translateY(-100%)' // 自身の幅の半分と、自身の上方向へ移動
});

const tooltipTrigger = ref(null); // template内の要素を参照するためのref

let hoverTimeout = null;

const showTooltip = async () => { // eventオブジェクトは不要になったため削除
  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(async () => {
    // tooltipTriggerがnullでないことを確認してから処理を進める
    if (!tooltipTrigger.value) {
      console.warn('Tooltip trigger element is null. Cannot calculate position.');
      return;
    }

    isVisible.value = true;
    await nextTick(); // DOMが更新されるのを待つ

    const target = tooltipTrigger.value; // refで参照した要素を使用
    const rect = target.getBoundingClientRect();

    // 画面全体に対する位置を計算
    // -8px は mb-2 の代わりにツールチップとトリガーの間のスペース
    tooltipStyle.top = `${rect.top + window.scrollY - 8}px`; 
    tooltipStyle.left = `${rect.left + rect.width / 2}px`; // ターゲットの中心
    
  }, 100); // 遅延させて表示
};

const hideTooltip = () => {
  clearTimeout(hoverTimeout);
  isVisible.value = false;
};
</script>
