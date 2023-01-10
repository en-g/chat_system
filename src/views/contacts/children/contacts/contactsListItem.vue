<template>
  <div class="contacts-list-item-container">
    <div class="contacts-list-item-avatar">
      <el-avatar :size="40" :src="props.contactsListItem.avatarUrl" />
    </div>
    <div class="contacts-list-item-content">
      <div class="contacts-list-item-name">{{ props.contactsListItem.name }}</div>
      <div v-show="!!props.contactsListItem.signature" class="contacts-list-item-signature">
        {{ props.contactsListItem.signature }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ContactsListItemType } from '@/types/contacts'

  const props = defineProps<{
    contactsListItem: ContactsListItemType
  }>()
</script>

<style scoped lang="less">
  .contacts-list-item-container {
    width: 100%;
    height: 60px;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    .contacts-list-item-avatar {
      margin-right: 15px;
    }
    .contacts-list-item-content {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .contacts-list-item-name {
        height: 50%;
        line-height: 20px;
        font-weight: var(--title-font-weight);
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .contacts-list-item-signature {
        height: 20px;
        line-height: 20px;
        color: var(--desc-color);
        font-size: 12px;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    &:hover {
      background-color: var(--mouse-hover-active);
      cursor: pointer;
    }
  }
</style>
