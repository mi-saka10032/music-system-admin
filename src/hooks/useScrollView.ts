import { ref, computed } from "vue";

/**
 * @description 容器滚动的hook函数，无特殊动画滚动需求可代替轮播图的作用
 * @param containerSelector 容器元素的选择器
 */
export function useScrollView(containerSelector: string) {
  const selector = containerSelector;
  const curIndex = ref(0);
  // 获取子元素数量的索引值上限
  const childrenLength = ref(0);
  let container: HTMLElement | null = null;

  /** 滚动参数 */
  const scrollOption: ScrollIntoViewOptions = {
    block: "start",
    inline: "center",
    behavior: "smooth"
  };

  /** 允许向前滚动 */
  const enablePrev = computed(() => curIndex.value > 0);

  /** 允许向后滚动 */
  const enableNext = computed(() => curIndex.value < childrenLength.value - 1);

  function prevTo() {
    container = document.querySelector(selector);
    if (container && enablePrev.value) {
      curIndex.value -= 1;
      move(curIndex.value);
    }
  }

  function nextTo() {
    container = document.querySelector(selector);
    if (container && enableNext.value) {
      curIndex.value += 1;
      move(curIndex.value);
    }
  }

  function move(index: number) {
    const target = container.children[index];
    target.scrollIntoView(scrollOption);
  }

  // 注意外部方法在合理的时机重置索引值
  function resetCurIndex() {
    curIndex.value = 0;
  }

  return {
    childrenLength,
    enablePrev,
    enableNext,
    prevTo,
    nextTo,
    resetCurIndex
  };
}
