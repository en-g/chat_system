<template>
  <div class="notice-list-container">
    <div class="notice-list">
      <div v-for="item in props.noticeList" :key="item.id" class="notice-list-item">
        <NoticeListItem :notice-list-item="item" :type="props.type" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NoticeListItemType } from '@/types/contacts'
  import NoticeListItem from './noticeListItem.vue'

  const props = defineProps<{
    noticeList: NoticeListItemType[]
    type: string
  }>()
</script>

<style scoped lang="less">
  .notice-list-container {
    min-height: 100%;
    .notice-list {
    }
  }
</style>
