<template>
  <div class="assistant-container">
    <div class="assistant-title">{{ title }}</div>
    <div class="assistant-notice-list-wrap">
      <el-scrollbar class="assistant-notice-list-scroll">
        <div class="assistant-notice-list">
          <NoticeList :notice-list="noticeList" :type="type" />
        </div>
      </el-scrollbar>
    </div>
    <div class="assistant-notice-page">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[2, 5, 10]"
        :small="true"
        :background="true"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="listenPaginationChange"
        @current-change="listenPaginationChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, provide, reactive, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import useStore from '@/store'
  import NoticeList from './noticeList.vue'
  import { NoticeListItemType } from '@/types/contacts'
  import { getContactNoticeList, getGroupNoticeList } from '@/api/contacts'

  const route = useRoute()
  const store = useStore()

  // 好友还是群聊
  const type = computed((): string => {
    return route.query.type as string
  })
  const title = ref<string>('') // 标题
  const pageNum = ref<number>(1) // 当前页数
  const pageSize = ref<number>(5) // 当前每页条数
  const total = ref<number>(0) // 通知列表总条数
  const noticeList = reactive<NoticeListItemType[]>([]) // 通知列表

  // 获取通知列表
  const getNoticeList = async () => {
    if (type.value === 'friend') {
      const { data } = await getContactNoticeList({
        userId: store.user_id,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      })
      total.value = data.total
      noticeList.splice(0, noticeList.length, ...data.list)
    } else {
      const { data } = await getGroupNoticeList({
        userId: store.user_id,
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      })
      total.value = data.total
      noticeList.splice(0, noticeList.length, ...data.list)
      console.log(noticeList)
    }
  }
  await getNoticeList()

  // 分页相关参数变化，更新通知列表
  const listenPaginationChange = async () => {
    await getNoticeList()
  }

  // 通知的同意操作
  const agreeNotice = (id: number) => {
    const notice = noticeList.find((notice) => notice.id === id)
    if (notice) {
      notice.status = 1
    }
  }
  provide('agreeNotice', agreeNotice)

  // 通知的拒绝操作
  const refuseNotice = (id: number) => {
    const notice = noticeList.find((notice) => notice.id === id)
    if (notice) {
      notice.status = 2
    }
  }
  provide('refuseNotice', refuseNotice)

  // 通知已阅读
  const readNotice = (id: number) => {
    const notice = noticeList.find((notice) => notice.id === id)
    if (notice) {
      notice.status = 3
    }
  }
  provide('readNotice', readNotice)

  watch(
    type,
    async () => {
      if (type.value === 'friend') {
        title.value = '好友验证消息'
        await getNoticeList()
      } else {
        title.value = '群聊验证消息'
        await getNoticeList()
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="less">
  .assistant-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    .assistant-title {
      width: 100%;
      height: 5%;
      font-size: var(--middle-font-size);
      font-weight: bold;
    }
    .assistant-notice-list-wrap {
      width: 100%;
      height: 88%;
      .assistant-notice-list-scroll {
        width: 100%;
        height: 100%;
        .assistant-notice-list {
        }
      }
    }
    .assistant-notice-page {
      width: 100%;
      height: 7%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
</style>
