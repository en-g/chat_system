<template>
  <div ref="chatMessageRef" class="chat-message-list-item-container">
    <div v-if="props.chatMessageItem.fromId === store.user_id" class="chat-message-list-item-from">
      <div class="chat-message-list-item-from-content-name">
        <div class="name">{{ chatName }}</div>
        <div class="content">
          <div v-if="props.chatMessageItem.type === 1" class="text">
            {{ props.chatMessageItem.message }}
          </div>
          <div v-else class="image">
            <el-image
              class="item"
              :src="props.chatMessageItem.url"
              :preview-src-list="[props.chatMessageItem.url]"
              fit="cover"
            />
          </div>
        </div>
      </div>
      <div class="chat-message-list-item-from-avatar">
        <el-avatar :size="50" :src="chatAvatarUrl" />
      </div>
    </div>
    <div v-else class="chat-message-list-item-to">
      <div class="chat-message-list-item-to-avatar">
        <el-avatar :size="50" :src="chatAvatarUrl" />
      </div>
      <div class="chat-message-list-item-to-content-name">
        <div class="name">{{ chatName }}</div>
        <div class="content">
          <div v-if="props.chatMessageItem.type === 1" class="text">
            {{ props.chatMessageItem.message }}
          </div>
          <div v-else class="image">
            <el-image
              class="item"
              :src="props.chatMessageItem.url"
              :preview-src-list="[props.chatMessageItem.url]"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'
  import { ChatMessageItemType } from '@/types/message'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const props = defineProps<{
    selfIndex: number
    chatMessageItem: ChatMessageItemType
  }>()
  const emit = defineEmits(['ready'])

  const chatMessageRef = ref<any>(null)
  const chatName = ref<string>('') // 名称
  const chatAvatarUrl = ref<string>('') // 头像

  const getChatObjInfo = () => {
    const myInfo = storage.get('personalInfo')
    if (props.chatMessageItem.groupId) {
      const groupsInfo = storage.get('groupsInfo') || []
      groupsInfo.forEach((group: any) => {
        const info = group.members.find((item: any) => item.id === props.chatMessageItem.fromId)
        if (info) {
          chatName.value = info.nickname
          chatAvatarUrl.value = info.avatarUrl
        }
      })
    } else {
      const contactsInfo = storage.get('contactsInfo') || []
      const info = contactsInfo.find((item: any) => item.id === props.chatMessageItem.fromId)
      if (info) {
        chatName.value = info.nickname
        chatAvatarUrl.value = info.avatarUrl
      } else {
        chatName.value = myInfo.nickname
        chatAvatarUrl.value = myInfo.avatarUrl
      }
    }
  }
  getChatObjInfo()

  onMounted(() => {
    emit('ready', chatMessageRef.value, props.selfIndex)
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
            width: 180px;
            height: 180px;
            .item {
              width: 100%;
              height: 100%;
            }
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
