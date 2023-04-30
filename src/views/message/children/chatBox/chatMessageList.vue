<template>
  <div ref="chatMessageListRef" class="chat-message-list-container">
    <el-scrollbar ref="scrollbarRef" class="chat-message-list-scrollbar" @scroll="listenScroll">
      <div class="chat-message-list" :style="`padding-top: ${startOffset}px; padding-bottom: ${endOffset}px;`">
        <div v-for="(item, index) in visibleList" :key="item.id" class="chat-message-list-item">
          <ChatMessageListItem
            :self-index="startIndex + index"
            :chat-message-item="item"
            @ready="listenChatMessageItemReady"
          />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import ChatMessageListItem from './chatMessageListItem.vue'
  import { ChatMessageItemType } from '@/types/message'
  import { createVirtualList } from '@/utils/virtualList'

  const props = defineProps<{
    chatMessageList: ChatMessageItemType[]
    isSend: boolean
  }>()

  const chatMessageListRef = ref<any>(null)
  const scrollbarRef = ref<any>(null)
  const estimatedItemHeight = 95 // 动态默认最小高度
  let virtualList: any = null

  const startOffset = ref<number>(0) // 列表 padding-top
  const endOffset = ref<number>(0) // 列表 padding-bottom
  const startIndex = ref<number>(0) // 要渲染数据的开始下标（包含缓冲区）
  const endIndex = ref<number>(0) // 要渲染数据的结束下标（包含缓冲区）
  const visualStartIndex = ref<number>(0) // 可视区域的列表数据的开始下标
  const visualEndIndex = ref<number>(0) // 可视区域的列表数据的结束下标
  const visibleCount = ref<number>(0) // 要渲染的列表数据条数
  const bufferCount = ref<number>(6) // 缓存数据条数
  const visibleList = ref<ChatMessageItemType[]>([]) // 实际渲染的列表数据
  const pageScrollY = ref<number>(0) // 滚动高度

  // 更新实际渲染的列表数据以及列表的 padding-top 和 padding-bottom
  const updateVisibleList = () => {
    startOffset.value = virtualList.getSectionSum(startIndex.value)
    endOffset.value = virtualList.getTatolHeight() - virtualList.getSectionSum(endIndex.value + 1)
    const data = props.chatMessageList.slice(startIndex.value, endIndex.value + 1)
    visibleList.value = data
    // console.log(visibleList.length, startIndex.value, endIndex.value)
  }

  // 初始化虚拟列表
  const initVirtualList = () => {
    virtualList = createVirtualList(props.chatMessageList.length, estimatedItemHeight)
  }

  // 初始化数据
  const initVisibleList = () => {
    visibleCount.value = Math.ceil(chatMessageListRef.value.offsetHeight / virtualList.defaultHeight)
    visualEndIndex.value = props.chatMessageList.length - 1
    endIndex.value = props.chatMessageList.length - 1
    visualStartIndex.value = Math.max(visualEndIndex.value - visibleCount.value + 1, 0)
    startIndex.value = Math.max(visualStartIndex.value - bufferCount.value, 0)
    updateVisibleList()
  }

  // 寻找新锚点元素，更新 startIndex、endIndex、visualStartIndex、visualEndIndex
  const updateBoundaryIndex = (scrollTop: number) => {
    const index = Math.max(virtualList.findLowerOffsetIndex(scrollTop) - 1, 0)
    // console.log('锚点', index)
    if (Math.abs(index - visualStartIndex.value) <= Math.ceil(bufferCount.value / 2)) return
    // 超过缓冲区一半之后再更新
    visualStartIndex.value = index
    startIndex.value = Math.max(visualStartIndex.value - bufferCount.value, 0)
    visualEndIndex.value = Math.min(visualStartIndex.value + visibleCount.value, props.chatMessageList.length - 1)
    endIndex.value = Math.min(visualEndIndex.value + bufferCount.value, props.chatMessageList.length - 1)
    updateVisibleList()
  }

  // 监听滚动
  const listenScroll = (pos: { scrollTop: number; scrollLeft: number }) => {
    pageScrollY.value = pos.scrollTop
    updateBoundaryIndex(pos.scrollTop)
  }

  // 结点渲染完成后，更新虚拟列表
  const listenChatMessageItemReady = async (chatMessageItem: HTMLElement, index: number) => {
    // console.log(index, chatMessageItem.offsetHeight)
    if (virtualList.vis[index + 1]) return
    virtualList.vis[index + 1] = true
    if (index == props.chatMessageList.length - 1) {
      chatMessageItem.scrollIntoView()
    } else if (pageScrollY.value) {
      const changeHeight = chatMessageItem.offsetHeight - virtualList.defaultHeight
      if (index < visualStartIndex.value) {
        pageScrollY.value = pageScrollY.value + changeHeight
        scrollbarRef.value.setScrollTop(pageScrollY.value)
      } else {
        scrollbarRef.value.setScrollTop(pageScrollY.value)
      }
    }
    virtualList.update(index + 1, chatMessageItem.offsetHeight)
    startOffset.value = virtualList.getSectionSum(startIndex.value)
    endOffset.value = virtualList.getTatolHeight() - virtualList.getSectionSum(endIndex.value + 1)
    scrollbarRef.value?.update()
  }

  // 监听数据变化，刷新虚拟列表
  watch(props.chatMessageList, () => {
    /**
     * 新增消息和切换聊天对象都会导致 props.chatMessageList 发送变化
     * 使用 prop.isSend 来标记当前是发送消息还是切换聊天对象
     */
    if (props.isSend) {
      // 发送消息
      if (virtualList) {
        virtualList.update(props.chatMessageList.length - 1, estimatedItemHeight * 2)
      } else {
        initVirtualList()
      }
      initVisibleList()
    } else {
      // 切换聊天对象
      virtualList = null
      visibleList.value = []
      if (props.chatMessageList.length > 0) {
        initVirtualList()
        initVisibleList()
        setTimeout(() => scrollbarRef.value?.setScrollTop(virtualList.getTatolHeight()), 10)
      }
    }
  })

  onMounted(() => {
    // 有数据再初始化虚拟列表
    if (props.chatMessageList.length > 0) {
      initVirtualList()
      initVisibleList()
    }
  })
</script>

<style scoped lang="less">
  .chat-message-list-container {
    width: 100%;
    height: 100%;
    .chat-message-list-scrollbar {
      width: 100%;
      height: 100%;
      .chat-message-list {
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
</style>
