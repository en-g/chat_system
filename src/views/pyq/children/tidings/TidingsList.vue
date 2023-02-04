<template>
  <div ref="tidingsListRef" class="tidings-list-container">
    <el-scrollbar ref="scrollbarRef" class="tidings-list-scroll" @scroll="listenScroll">
      <div class="tidings-list" :style="`padding-top: ${startOffset}px; padding-bottom: ${endOffset}px;`">
        <div v-for="(item, index) in visibleList" :key="item.id" class="tidings-list-item">
          <TidingsListItem :tidings-info="item" :self-index="startIndex + index" @ready="listenTidingsItemReady" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { PyqTidingsType } from '@/types/pyq'
  import TidingsListItem from './TidingsListItem.vue'
  import { createVirtualList } from '@/utils/virtualList'

  const route = useRoute()
  const props = defineProps<{
    tidingsList: Array<PyqTidingsType>
  }>()

  const tidingsListRef = ref<any>(null)
  const scrollbarRef = ref<any>()
  const estimatedItemHeight = 254 // 动态默认最小高度
  let virtualList = createVirtualList(props.tidingsList.length, estimatedItemHeight)

  const startOffset = ref<number>(0) // 列表 padding-top
  const endOffset = ref<number>(0) // 列表 padding-bottom
  const startIndex = ref<number>(0) // 要渲染数据的开始下标（包含缓冲区）
  const endIndex = ref<number>(0) // 要渲染数据的结束下标（包含缓冲区）
  const visualStartIndex = ref<number>(0) // 可视区域的列表数据的开始下标
  const visualEndIndex = ref<number>(0) // 可视区域的列表数据的结束下标
  const visibleCount = ref<number>(0) // 要渲染的列表数据条数
  const bufferCount = ref<number>(6) // 缓存数据条数
  const visibleList = reactive<PyqTidingsType[]>([]) // 实际渲染的列表数据
  const pageScrollY = ref<number>(0) // 滚动高度

  // 更新实际渲染的列表数据以及列表的 padding-top 和 padding-bottom
  const updateVisibleList = () => {
    startOffset.value = virtualList.getSectionSum(startIndex.value)
    endOffset.value = virtualList.getTatolHeight() - virtualList.getSectionSum(endIndex.value + 1)
    const data = props.tidingsList.slice(startIndex.value, endIndex.value + 1)
    visibleList.splice(0, visibleList.length, ...data)
  }

  // 初始化数据
  const initVisibleList = () => {
    visibleCount.value = Math.ceil(tidingsListRef.value.offsetHeight / virtualList.defaultHeight)
    visualStartIndex.value = 0
    visualEndIndex.value = Math.min(visibleCount.value, props.tidingsList.length) - 1
    startIndex.value = 0
    endIndex.value = Math.min(visualEndIndex.value + bufferCount.value, props.tidingsList.length - 1)
    updateVisibleList()
  }

  // 寻找新锚点元素，更新 startIndex、endIndex、visualStartIndex、visualEndIndex
  const updateBoundaryIndex = (scrollTop: number) => {
    const index = Math.max(virtualList.findLowerOffsetIndex(scrollTop) - 1, 0)
    if (Math.abs(index - visualStartIndex.value) <= Math.ceil(bufferCount.value / 2)) return
    // 超过缓冲区一半之后再更新
    visualStartIndex.value = index
    startIndex.value = Math.max(visualStartIndex.value - bufferCount.value, 0)
    visualEndIndex.value = Math.min(visualStartIndex.value + visibleCount.value, props.tidingsList.length - 1)
    endIndex.value = Math.min(visualEndIndex.value + bufferCount.value, props.tidingsList.length - 1)
    updateVisibleList()
  }

  // 监听滚动
  const listenScroll = (pos: { scrollTop: number; scrollLeft: number }) => {
    pageScrollY.value = pos.scrollTop
    updateBoundaryIndex(pos.scrollTop)
  }

  // 结点渲染完成后，更新虚拟列表
  const listenTidingsItemReady = async (tidingsItem: HTMLElement, index: number) => {
    if (virtualList.vis[index + 1]) return
    virtualList.vis[index + 1] = true
    if (pageScrollY.value) {
      const changeHeight = tidingsItem.offsetHeight - virtualList.defaultHeight
      if (index < visualStartIndex.value) {
        pageScrollY.value = pageScrollY.value + changeHeight
        scrollbarRef.value.setScrollTop(pageScrollY.value)
      } else {
        scrollbarRef.value.setScrollTop(pageScrollY.value)
      }
    }
    virtualList.update(index + 1, tidingsItem.offsetHeight)
    startOffset.value = virtualList.getSectionSum(startIndex.value)
    endOffset.value = virtualList.getTatolHeight() - virtualList.getSectionSum(endIndex.value + 1)
    scrollbarRef.value?.update()
  }

  onMounted(() => {
    initVisibleList()

    // 监听数据变化，刷新虚拟列表
    watch(
      () => props.tidingsList,
      () => {
        scrollbarRef.value.setScrollTop(0)
        virtualList = createVirtualList(props.tidingsList.length, estimatedItemHeight)
        initVisibleList()
      }
    )
  })
</script>

<style scoped lang="less">
  .tidings-list-container {
    width: 100%;
    height: 100%;
    .tidings-list-scroll {
      width: 100%;
      height: 100%;
      .tidings-list {
        .tidings-list-item {
        }
      }
    }
  }
</style>
