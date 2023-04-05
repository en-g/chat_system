<template>
  <div class="contacts-container">
    <div class="contacts-menu">
      <el-scrollbar class="contacts-menu-scrollbar">
        <div class="contacts-edit-friend-group">
          <div class="contacts-edit-friend-group-content" @click="listenEditFriendGroups">编辑分组</div>
        </div>
        <div class="contacts-system-assistant">
          <div class="contacts-system-assistant-title">系统助手</div>
          <div class="contacts-system-assistant-content">
            <div class="contacts-system-assistant-content-item" @click="listenNavigateToFriendAssistant">
              <el-badge :hidden="unHandleContactNotice === 0" :value="unHandleContactNotice" :max="99">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-friend-assistant"></use>
                </svg>
              </el-badge>
              <span>好友验证助手</span>
            </div>
            <div class="contacts-system-assistant-content-item" @click="listenNavigateToGroupAssistant">
              <el-badge :hidden="unHandleGroupNotice === 0" :value="unHandleGroupNotice" :max="99">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-group-assistant"></use>
                </svg>
              </el-badge>
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
    <el-dialog
      v-model="isEdit"
      width="350px"
      class="contacts-edit-friend-group-dialog"
      title="编辑分组"
      @close="listenDialogClose"
    >
      <div class="add-friend-group">
        <el-input v-model="friendGroupName" maxlength="10" placeholder="请输入分组名称" type="text" size="default" />
        <svg class="icon" aria-hidden="true" @click="listenAddFriendGroup">
          <use xlink:href="#icon-add"></use>
        </svg>
      </div>
      <div class="friend-group-list">
        <el-scrollbar class="friend-group-list-scroll">
          <div class="friend-group-list-wrap">
            <div v-for="item in friendGroupsList" :key="item.id" class="friend-group-list-item">
              <div class="name">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-friendGroup"></use>
                </svg>
                {{ `${item.name}(${item.total})` }}
              </div>
              <div class="delete">
                <svg class="icon" aria-hidden="true" @click="listenDeleteFriendGroup(item)">
                  <use xlink:href="#icon-delete"></use>
                </svg>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <el-dialog v-model="isChoose" title="将联系人移至" width="250px" top="30vh">
          <el-select v-model="newId" placeholder="选择分组" size="default">
            <el-option v-for="item in canChooseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="listenMoveContacts"> 确定 </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <div class="choose-friend-group"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" size="default" @click="listenConfirmEditFriendGroup"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, provide, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import useStore from '@/store/index'
  import Contacts from './children/contacts/index.vue'
  import { addFriendGroup, deleteFriendGroup, getContactsList, getFriendGroupList, getGroupsList } from '@/api/contacts'
  import {
    AddFriendGroupsType,
    ContactsListType,
    DeleteFriendGroupsIdsType,
    FriendGroupsListType,
  } from '@/types/contacts'
  import { ElMessage } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import { sessionStorage } from '@/utils/storage'

  const router = useRouter()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const isShow = ref<boolean>(false)
  const isEdit = ref<boolean>(false) // 标记是否显示编辑分组弹出框
  const isChoose = ref<boolean>(false) // 标记是否显示选择分组弹出框
  const isUpdate = ref<boolean>(false) // 分组列表是否被修改
  const friendGroupName = ref<string>('') // 新增分组名称
  const chooseId = ref<number>(-1) // 被删除的分组 ID
  const newId = ref<number | null>(null) // 要移动到的分组 ID
  const canChooseList = ref<FriendGroupsListType[]>([]) // 可选择的分组列表
  const unHandleContactNotice = computed(() => {
    return store.contactUnHandleNoticeIds.length
  })
  const unHandleGroupNotice = computed(() => {
    return store.groupUnHandleNoticeIds.length
  })

  // 获取未处理通知
  const getUnHandleNotices = async () => {
    await store.initContactNoticeIds()
    await store.initGrouptNoticeIds()
  }
  await getUnHandleNotices()

  // 获取联系人列表
  const getContactsListData = async () => {
    const list = storage.get('contactsList')
    if (list) {
      return list
    }
    const { data } = await getContactsList({
      userId: store.user_id,
    })
    storage.set('contactsList', data)
    return data
  }
  const friends = await getContactsListData()
  const friendsList = reactive<ContactsListType[]>(friends)

  // 更新联系人列表
  const updateContactList = async () => {
    const { data } = await getContactsList({
      userId: store.user_id,
    })
    storage.set('contactsList', data)
    friendsList.splice(0, friendsList.length, ...data)
  }
  provide('updateContactList', updateContactList)

  // 获取群聊列表
  const getGroupsListData = async () => {
    const list = storage.get('groupsList')
    if (list) {
      return list
    }
    const { data } = await getGroupsList({
      userId: store.user_id,
    })
    storage.set('groupsList', data)
    return data
  }
  const groups = await getGroupsListData()
  const groupsList = reactive<ContactsListType[]>(groups)

  // 更新群聊列表
  const updateGroupList = async () => {
    const { data } = await getGroupsList({
      userId: store.user_id,
    })
    storage.set('groupsList', data)
    groupsList.splice(0, groupsList.length, ...data)
  }
  provide('updateGroupList', updateGroupList)

  // 获取分组列表
  const getFriendGroupListData = async () => {
    const { data } = await getFriendGroupList({
      userId: store.user_id,
    })
    return data
  }
  const friendGroupsList = reactive<FriendGroupsListType[]>([])

  // 显示编辑分组弹出框
  const listenEditFriendGroups = async () => {
    if (friendGroupsList.length === 0) {
      const friendGroups = await getFriendGroupListData()
      friendGroupsList.push(...friendGroups)
    }
    isEdit.value = true
  }

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

  // 添加分组
  const listenAddFriendGroup = async () => {
    if (!friendGroupName.value) {
      ElMessage.error(TIP_TYPE.FRIEND_GROUP_IS_NOT_NULL)
      return
    }
    const info: AddFriendGroupsType = {
      userId: store.user_id,
      name: friendGroupName.value,
    }
    const { data } = await addFriendGroup(info)
    switch (data.status) {
      case 0:
        ElMessage.error(TIP_TYPE.ADD_FRIEND_GROUP_FAIL)
        break
      case 1:
        ElMessage.success(TIP_TYPE.ADD_FRIEND_GROUP_SUCCESS)
        friendGroupsList.push({
          id: data.id,
          name: friendGroupName.value,
          total: 0,
        })
        friendGroupName.value = ''
        isUpdate.value = true
        break
      case 2:
        ElMessage.error(TIP_TYPE.FRIEND_GROUP_HAS_EXIST)
    }
  }

  // 删除分组
  const listenDeleteFriendGroup = async (info: FriendGroupsListType) => {
    if (friendGroupsList.length === 1) {
      ElMessage.error(TIP_TYPE.FRIEND_GROUP_IS_LAST_ONE)
      return
    }
    if (info.total > 0) {
      chooseId.value = info.id
      canChooseList.value = friendGroupsList.filter((item: FriendGroupsListType) => item.id !== info.id)
      isChoose.value = true
      return
    }
    const ids: DeleteFriendGroupsIdsType = {
      userId: store.user_id,
      friendGroupId: info.id,
      newId: -1,
    }
    const { data } = await deleteFriendGroup(ids)
    if (data) {
      ElMessage.success(TIP_TYPE.DELETE_FRIEND_GROUP_SUCCESS)
      const index = friendGroupsList.findIndex((item: FriendGroupsListType) => item.id === info.id)
      friendGroupsList.splice(index, 1)
      isUpdate.value = true
    } else {
      ElMessage.error(TIP_TYPE.DELETE_FRIEND_GROUP_FAIL)
    }
  }

  // 将联系人移到其他分组
  const listenMoveContacts = async () => {
    const ids: DeleteFriendGroupsIdsType = {
      userId: store.user_id,
      friendGroupId: chooseId.value,
      newId: newId.value as number,
    }
    const { data } = await deleteFriendGroup(ids)
    if (data) {
      ElMessage.success(TIP_TYPE.DELETE_FRIEND_GROUP_SUCCESS)
      const index = friendGroupsList.findIndex((item: FriendGroupsListType) => item.id === chooseId.value)
      const info: any = friendGroupsList.find((item: FriendGroupsListType) => item.id === newId.value)
      info.total += friendGroupsList[index].total
      friendGroupsList.splice(index, 1)
      isChoose.value = false
      isUpdate.value = true
    } else {
      ElMessage.error(TIP_TYPE.DELETE_FRIEND_GROUP_FAIL)
    }
  }

  // 确定编辑分组
  const listenConfirmEditFriendGroup = () => {
    isEdit.value = false
  }

  // 编辑分组弹出框消失，更新数据
  const listenDialogClose = async () => {
    if (isUpdate.value) {
      await updateContactList()
      isUpdate.value = false
    }
    friendGroupName.value = ''
  }

  // 监听是否更新联系人或群聊
  watch(
    () => store.isUpdateContactList,
    async () => {
      if (store.isUpdateContactList === true) {
        await updateContactList()
        store.isUpdateContactList = false
      }
    }
  )
  watch(
    () => store.isUpdateGroupList,
    async () => {
      if (store.isUpdateGroupList === true) {
        await updateGroupList()
        store.isUpdateGroupList = false
      }
    }
  )
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
    .contacts-edit-friend-group-dialog {
      .add-friend-group {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 10px;
        }
      }
      .friend-group-list {
        .friend-group-list-scroll {
          height: 200px;
          padding: 10px 0;
          box-sizing: border-box;
          .friend-group-list-wrap {
            .friend-group-list-item {
              padding: 10px 30px 10px 0;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              .name {
                display: flex;
                align-items: center;
              }
            }
          }
        }
      }
      .choose-friend-group {
      }
    }
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
  :deep(.el-badge) {
    display: block;
  }
  :deep(.el-badge__content.is-fixed) {
    top: -7px;
    right: 0;
    transform: translateX(10%);
  }
</style>
