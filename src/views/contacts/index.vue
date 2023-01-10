<template>
  <div class="contacts-container">
    <div class="contacts-menu">
      <el-scrollbar class="contacts-menu-scrollbar">
        <div class="contacts-edit-friend-group">
          <div class="contacts-edit-friend-group-content">编辑分组</div>
        </div>
        <div class="contacts-system-assistant">
          <div class="contacts-system-assistant-title">系统助手</div>
          <div class="contacts-system-assistant-content">
            <div class="contacts-system-assistant-content-item" @click="listenNavigateToFriendAssistant">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-friend-assistant"></use>
              </svg>
              <span>好友验证助手</span>
            </div>
            <div class="contacts-system-assistant-content-item" @click="listenNavigateToGroupAssistant">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-group-assistant"></use>
              </svg>
              <span>群聊验证助手</span>
            </div>
          </div>
        </div>
        <div class="contacts-friend-group-list">
          <Contacts title="好友列表" type="friend" :contacts-list="friendsList" />
          <Contacts title="群聊列表" type="group" :contacts-list="groupsList" />
        </div>
      </el-scrollbar>
    </div>
    <div class="contacts-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import useStore from '@/store/index'
  import Contacts from './children/contacts/index.vue'

  const router = useRouter()
  const store = useStore()

  const friendsList = [
    {
      id: 1,
      friendGroup: '朋友',
      list: [
        {
          id: 1,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '小明大胜靠德静安寺打开将第三大酒店',
          signature: '雨过天晴见彩虹',
        },
        {
          id: 2,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '小明',
          signature: '雨过天晴见彩虹',
        },
        {
          id: 3,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '小明',
          signature: '雨过天晴见彩虹',
        },
      ],
    },
    {
      id: 2,
      friendGroup: '家人',
      list: [],
    },
    {
      id: 3,
      friendGroup: '亲戚',
      list: [
        {
          id: 7,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '小明',
          signature: '雨过天晴见彩虹',
        },
        {
          id: 8,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '小明',
          signature: '雨过天晴见彩虹',
        },
        {
          id: 9,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '小明',
          signature: '雨过天晴见彩虹',
        },
      ],
    },
  ]
  const groupsList = [
    {
      id: 1,
      friendGroup: '我的群聊',
      list: [
        {
          id: 1,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '牛逼群',
        },
        {
          id: 2,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '牛逼群',
        },
      ],
    },
    {
      id: 2,
      friendGroup: '已加入的群聊',
      list: [
        {
          id: 7,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '牛逼群',
        },
        {
          id: 8,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '牛逼群',
        },
        {
          id: 9,
          avatarUrl: 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          name: '牛逼群',
        },
      ],
    },
  ]

  const listenNavigateToFriendAssistant = () => {
    store.clickContactsType = ''
    router.push({
      name: 'assistant',
      query: {
        type: 'friend',
      },
    })
  }

  const listenNavigateToGroupAssistant = () => {
    store.clickContactsType = ''
    router.push({
      name: 'assistant',
      query: {
        type: 'group',
      },
    })
  }
</script>

<style scoped lang="less">
  .contacts-container {
    width: 100%;
    height: 100%;
    display: flex;
    .contacts-menu {
      flex: 1;
      height: 100%;
      border-right: 1px solid var(--border-color);
      .contacts-menu-scrollbar {
        height: 100%;
        // padding: 10px 20px;
        // box-sizing: border-box;
        .contacts-edit-friend-group {
          width: 100%;
          padding: 10px 20px;
          box-sizing: border-box;
          margin-bottom: 10px;
          .contacts-edit-friend-group-content {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 10px 0;
            cursor: pointer;
            &:hover {
              background-color: var(--mouse-hover-active);
            }
          }
        }
        .contacts-system-assistant {
          width: 100%;

          &-title {
            font-weight: var(--title-font-weight);
            padding: 0 20px;
            box-sizing: border-box;
          }
          &-content {
            padding: 10px 0;
            box-sizing: border-box;
            &-item {
              display: flex;
              align-items: center;
              padding: 10px 20px;
              box-sizing: border-box;
              cursor: pointer;
              svg {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 5px;
                border-radius: 50%;
                margin-right: 10px;
              }
              &:hover {
                background-color: var(--mouse-hover-active);
              }
            }
            &-item:first-child svg {
              background-color: #fdbe2a;
            }
            &-item:last-child svg {
              background-color: rgb(50, 170, 255);
            }
          }
        }
        .contacts-friend-group-list {
        }
      }
    }
    .contacts-content {
      flex: 5;
      height: 100%;
    }
  }
</style>
