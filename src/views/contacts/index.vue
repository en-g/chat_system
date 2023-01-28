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
          <Contacts
            title="好友列表"
            type="friend"
            :contacts-list="friendsList"
            @showContactsInfo="listenShowContactsInfo"
          />
          <Contacts
            title="群聊列表"
            type="group"
            :contacts-list="groupsList"
            @showContactsInfo="listenShowContactsInfo"
          />
        </div>
      </el-scrollbar>
    </div>
    <div class="contacts-content">
      <div v-show="isShow" class="real">
        <div class="back" @click="listenClickBack">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-back"></use>
          </svg>
        </div>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
      <div v-show="!isShow" class="fill"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, provide } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import useStore from '@/store/index'
  import Contacts from './children/contacts/index.vue'
  import { getContactsList, getGroupsList } from '@/api/contacts'
  import { ContactsListType } from '@/types/contacts'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()

  const isShow = ref<boolean>(false)

  // 获取联系人列表
  const getContactsListData = async () => {
    const result = await getContactsList({
      userId: store.user_id,
    })
    return result
  }
  const { data: friends } = await getContactsListData()
  const friendsList = reactive<ContactsListType[]>(friends)

  // 获取群聊列表
  const getGroupsListData = async () => {
    const result = await getGroupsList({
      userId: store.user_id,
    })
    return result
  }
  const { data: groups } = await getGroupsListData()
  const groupsList = reactive<ContactsListType[]>(groups)

  // 跳转到好友验证助手
  const listenNavigateToFriendAssistant = () => {
    isShow.value = true
    store.clickContactsType = ''
    router.push({
      name: 'assistant',
      query: {
        type: 'friend',
      },
    })
  }

  // 跳转到群聊验证助手
  const listenNavigateToGroupAssistant = () => {
    isShow.value = true
    store.clickContactsType = ''
    router.push({
      name: 'assistant',
      query: {
        type: 'group',
      },
    })
  }

  // 显示联系人/群聊信息
  const listenShowContactsInfo = () => {
    isShow.value = true
  }

  const listenClickBack = () => {
    isShow.value = false
  }
</script>

<style scoped lang="less">
  .contacts-container {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .contacts-menu {
      flex: 1;
      height: 100%;
      border-right: 1px solid var(--border-color);
      .contacts-menu-scrollbar {
        height: 100%;
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
      width: 100%;
      height: 100%;
      .real {
        width: 100%;
        height: 100%;
        background-color: #fff;
        .back {
          display: none;
          position: absolute;
          left: 10px;
          top: 10px;
        }
      }
      .fill {
        width: 100%;
        height: 100%;
        background-color: #fff;
      }
    }
  }
</style>
