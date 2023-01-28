<template>
  <div class="index-container">
    <div class="index-title">{{ props.title }}</div>
    <div class="index-contacts-list">
      <ContactsList :type="props.type" :contacts-list="props.contactsList" @showContactsInfo="listenShowContactsInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ContactsList from './contactsList.vue'
  import { ContactsListType } from '@/types/contacts'

  const emit = defineEmits(['showContactsInfo'])

  const props = defineProps<{
    title: string // 列表标题
    type: string // 列表类型（联系人/群聊）
    contactsList: ContactsListType[] // 列表数据
  }>()

  // 显示联系人/群聊信息
  const listenShowContactsInfo = () => {
    emit('showContactsInfo')
  }
</script>

<style scoped lang="less">
  .index-container {
    width: 100%;
    margin-bottom: 20px;
    .index-title {
      padding: 0 20px;
      box-sizing: border-box;
      font-weight: var(--title-font-weight);
      margin-bottom: 10px;
    }
    .index-contacts-list {
    }
  }
</style>
