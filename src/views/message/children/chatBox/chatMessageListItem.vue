<template>
  <div ref="chatMessageRef" class="chat-message-list-item-container">
    <div v-if="props.messageListItem.fromId === store.user_id" class="chat-message-list-item-from">
      <div class="chat-message-list-item-from-content-name">
        <div class="name">{{ props.messageListItem.fromName }}</div>
        <div class="content">
          <div v-if="props.messageListItem.type === 1" class="text">
            {{ props.messageListItem.message + ' ' + props.selfIndex }}
          </div>
          <div v-else class="image">
            <el-image :src="props.messageListItem.url" :preview-src-list="[props.messageListItem.url]" fit="cover" />
          </div>
        </div>
      </div>
      <div class="chat-message-list-item-from-avatar">
        <el-avatar :size="50" :src="props.messageListItem.fromAvatarUrl" />
      </div>
    </div>
    <div v-else class="chat-message-list-item-to">
      <div class="chat-message-list-item-to-avatar">
        <el-avatar :size="50" :src="props.messageListItem.fromAvatarUrl" />
      </div>
      <div class="chat-message-list-item-to-content-name">
        <div class="name">{{ props.messageListItem.fromName }}</div>
        <div class="content">
          <div v-if="props.messageListItem.type === 1" class="text">
            {{ props.messageListItem.message + ' ' + props.selfIndex }}
          </div>
          <div v-else class="image">
            <el-image :src="props.messageListItem.url" :preview-src-list="[props.messageListItem.url]" fit="cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import useStore from '@/store'
  import { FriendChatMessageInfoType } from '@/types/message'

  const store = useStore()
  const props = defineProps<{
    type: string
    selfIndex: number
    messageListItem: FriendChatMessageInfoType
  }>()
  const emit = defineEmits(['ready'])

  const chatMessageRef = ref<any>(null)

  // const listenChatImageLoad = () => {
  //   emit('ready', chatMessageRef.value, props.selfIndex)
  // }

  onMounted(() => {
    // setTimeout(() => {
    // if (props.messageListItem.type === 1) {
    emit('ready', chatMessageRef.value, props.selfIndex)
    // }
    // }, 100)
  })
</script>

<style scoped lang="less">
  .chat-message-list-item-container {
    width: 100%;
    .chat-message-list-item-from,
    .chat-message-list-item-to {
      display: flex;
      padding: 10px 0;
      box-sizing: border-box;
      &-content-name {
        flex: 1;
        margin: 0 10px;
        max-width: 25%;
        .name {
          width: fit-content;
          height: 30px;
          line-height: 25px;
        }
        .content {
          width: fit-content;
          min-height: 25px;
          padding: 10px;
          box-sizing: border-box;
          border-radius: 5px;
          background-color: var(--chat-bubble-color);
          word-wrap: break-word;
          word-break: break-all;
          .text {
            line-height: 25px;
          }
          .image {
            width: 150px;
          }
        }
      }
      &-avatar {
        cursor: pointer;
      }
    }
    .chat-message-list-item-from {
      justify-content: flex-end;
      &-content-name {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
    }
  }
</style>
