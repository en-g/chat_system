<template>
  <div class="info-container">
    <div class="info-show-interaction">
      <div class="info-show-avatar">
        <el-avatar :size="80" :src="info.avatarUrl" />
      </div>
      <div class="info-show-name">{{ info.name || info.nickname }}</div>
      <div v-if="type === 'friend'" class="info-show-interaction-friend">
        <div class="item message">
          <el-tooltip content="发送消息" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenNavigateToChat">
              <use xlink:href="#icon-send-message"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item pyq">
          <el-tooltip content="朋友圈" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenNavigateToPyq">
              <use xlink:href="#icon-show-pyq"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item life">
          <el-tooltip content="生活圈" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenNavigateToLife">
              <use xlink:href="#icon-show-life"></use>
            </svg>
          </el-tooltip>
        </div>
        <!-- <div class="item video">
          <el-tooltip content="视频通话" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-video"></use>
            </svg>
          </el-tooltip>
        </div> -->
        <div class="item delete">
          <el-tooltip content="删除好友" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenDeleteContact">
              <use xlink:href="#icon-delete"></use>
            </svg>
          </el-tooltip>
        </div>
      </div>
      <div v-else class="info-show-interaction-group">
        <div class="item message">
          <el-tooltip content="发送消息" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenNavigateToChat">
              <use xlink:href="#icon-send-message"></use>
            </svg>
          </el-tooltip>
        </div>
        <div v-if="info.isLeader !== store.user_id" class="item message">
          <el-tooltip content="退出群聊" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenExitGroup">
              <use xlink:href="#icon-out"></use>
            </svg>
          </el-tooltip>
        </div>
        <div v-if="info.isLeader === store.user_id" class="item message">
          <el-tooltip content="解散群聊" placement="top">
            <svg class="icon" aria-hidden="true" @click="listenDismissGroup">
              <use xlink:href="#icon-delete"></use>
            </svg>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="info-show-desc">
      <div v-if="type === 'friend'" class="info-show-desc-friend">
        <div class="info-show-desc-item">
          <div class="title">账号</div>
          <div class="content">{{ info.username }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">昵称</div>
          <div class="content">{{ info.nickname }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">备注</div>
          <div v-show="isEdit">
            <el-input
              v-model="info.remarks"
              :placeholder="info.remarks"
              maxlength="10"
              autofocus
              @blur="listenConfirmEdit"
            />
          </div>
          <div v-show="!isEdit" class="edit-remarks">
            <div class="content" :class="{ tip: !info.remarks }">
              {{ info.remarks ? info.remarks : '添加备注' }}
            </div>
            <el-tooltip content="修改备注" placement="top">
              <svg class="icon" aria-hidden="true" @click="listenEditRemarks">
                <use xlink:href="#icon-edit"></use>
              </svg>
            </el-tooltip>
          </div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">邮箱</div>
          <div class="content">{{ info.email }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">性别</div>
          <div class="content">{{ info.sex }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">生日</div>
          <div class="content">{{ info.birthday }}</div>
        </div>
      </div>
      <div v-else class="info-show-desc-group">
        <div class="info-show-desc-item">
          <div class="title">群号</div>
          <div class="content">{{ info.number }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">群名称</div>
          <div class="content">{{ info.name }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">群主</div>
          <div class="content">{{ info.leader }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">我的群昵称</div>
          <div v-show="isEdit">
            <el-input
              v-model="info.remarks"
              :placeholder="info.remarks"
              maxlength="10"
              autofocus
              @blur="listenConfirmEdit"
            />
          </div>
          <div v-show="!isEdit" class="edit-remarks">
            <div class="content" :class="{ tip: !info.remarks }">
              {{ info.remarks ? info.remarks : '添加我的群昵称' }}
            </div>
            <el-tooltip content="修改群昵称" placement="top">
              <svg class="icon" aria-hidden="true" @click="listenEditRemarks">
                <use xlink:href="#icon-edit"></use>
              </svg>
            </el-tooltip>
          </div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">我的群身份</div>
          <div class="content">{{ info.isLeader === 1 ? '群主' : '群成员' }}</div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">群公告</div>
          <div class="content" :class="{ tip: !info.notice }">
            {{ info.notice }}<span v-show="!info.notice">暂无公告</span>
          </div>
        </div>
        <div class="info-show-desc-item">
          <div class="title">创建时间</div>
          <div class="content">{{ info.createTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    deleteContact,
    getFriendInfo,
    getGroupInfo,
    updateContactsRemarks,
    updateGroupsRemarks,
  } from '@/api/contacts'
  import {
    GetContactsInfoType,
    GetGroupInfoType,
    UpdateContactsRemarksType,
    UpdateGroupsRemarksType,
  } from '@/types/contacts'
  import useStore from '@/store/index'
  import { sessionStorage, localStorage } from '@/utils/storage'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import { MessageListItemInfoType } from '@/types/message'
  import { formateTime } from '@/utils/utils'
  import websocket from '@/websocket'
  import { dismissGroup, exitGroup } from '@/api/groups'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const lStorage = localStorage(`${store.user_id}`)
  const emit = defineEmits(['showInfo'])

  // 联系人/群聊 ID
  const id = computed((): number => {
    return parseInt(route.query.id as string)
  })
  const isEdit = ref<boolean>(false) // 标记是否点击编辑备注/群昵称
  const type = computed((): string => {
    // 列表类型
    return route.query.type as string
  })

  // 获取联系人信息，做 sessionStorage 缓存
  const getContactsInfoData = async () => {
    const contactsInfo = storage.get('contactsInfo') || []
    const info = contactsInfo.find((item: any) => item.id === id.value)
    if (info) {
      return info
    }
    const ids: GetContactsInfoType = {
      userId: store.user_id,
      friendId: id.value,
    }
    const { data } = await getFriendInfo(ids)
    data.birthday = formateTime(data.birthday, 1)
    contactsInfo.push(data)
    storage.set('contactsInfo', contactsInfo)
    return data
  }

  // 获取群聊信息，做 sessionStorage 缓存
  const getGroupsInfoData = async () => {
    const groupsInfo = storage.get('groupsInfo') || []
    const info = groupsInfo.find((item: any) => item.id === id.value)
    if (info) {
      return info
    }
    const ids: GetGroupInfoType = {
      userId: store.user_id,
      groupId: id.value,
    }
    const { data } = await getGroupInfo(ids)
    data.createTime = formateTime(data.createTime, 1)
    data.members = data.members.reverse()
    groupsInfo.push(data)
    storage.set('groupsInfo', groupsInfo)
    return data
  }

  const getInfo = async () => {
    if (type.value === 'friend') {
      const data = await getContactsInfoData()
      return data
    } else {
      const data = await getGroupsInfoData()
      return data
    }
  }
  const info = ref<any>(await getInfo())

  // 删除好友
  const listenDeleteContact = () => {
    ElMessageBox.confirm('您正在删除该联系人，请确认！', '删除联系人', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const { data } = await deleteContact({
        userId: store.user_id,
        friendId: info.value.id,
      })
      if (data) {
        ElMessage.success(TIP_TYPE.DELETE_CONTACT_SUCCESS)
        // 更新联系人列表
        store.isUpdateContactList = true
        // 通知对方更新联系人列表
        websocket.send('updateContactList', { userId: info.value.id })
        // 将联系人从聊天列表中删除
        // 也要通知对方从聊天列表中删除
        websocket.send('deleteContact', {
          userId: store.user_id,
          friendId: info.value.id,
        })
        router.push({ path: '/contacts' })
      } else {
        ElMessage.error(TIP_TYPE.DELETE_CONTACT_FAIL)
      }
    })
  }

  // 退出群聊
  const listenExitGroup = () => {
    ElMessageBox.confirm('您正在退出该群聊，请确认！', '退出群聊', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const { data } = await exitGroup({
        userId: store.user_id,
        groupId: info.value.id,
      })
      if (data) {
        ElMessage.success(TIP_TYPE.EXIT_GROUP_SUCCESS)
        // 更新群聊列表
        store.isUpdateGroupList = true
        // 对群主发送退群通知, 通知群成员更新群聊信息
        websocket.send('exitGroup', {
          fromId: store.user_id,
          toId: info.value.leaderId,
          groupId: info.value.id,
          type: 'exit',
        })
        router.push({ path: '/contacts' })
      } else {
        ElMessage.success(TIP_TYPE.EXIT_GROUP_FAIL)
      }
    })
  }

  // 解散群聊
  const listenDismissGroup = () => {
    ElMessageBox.confirm('您正在解散该群聊，请确认！', '解散群聊', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const { data } = await dismissGroup({
        leaderId: store.user_id,
        groupId: info.value.id,
      })
      if (data) {
        ElMessage.success(TIP_TYPE.DISMISS_GROUP_SUCCESS)
        // 更新群聊列表
        store.isUpdateGroupList = true
        // 对群成员发送解散群聊通知
        websocket.send('dismissGroup', {
          fromId: store.user_id,
          toId: -1,
          groupId: info.value.id,
          type: 'dismiss',
        })
        router.push({ path: '/contacts' })
      } else {
        ElMessage.success(TIP_TYPE.DISMISS_GROUP_FAIL)
      }
    })
  }

  // 监听联系人和群聊、不同联系人、不同群聊间的切换，重新请求数据
  watch(
    [type, id],
    async () => {
      console.log(type.value, id.value)
      info.value = await getInfo()
      emit('showInfo')
    },
    { immediate: true }
  )

  // 点击编辑备注/群昵称
  const listenEditRemarks = () => {
    isEdit.value = true
  }

  // 修改联系人备注
  const updateContactsRemarksData = async () => {
    const remarksInfo: UpdateContactsRemarksType = {
      userId: store.user_id,
      friendId: id.value,
      remarks: info.value.remarks,
    }
    const { data } = await updateContactsRemarks(remarksInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_CONTACTS_REMARKS_SUCCESS)
      const index = (storage.get('contactsInfo') || []).findIndex((item: any) => item.id === id.value)
      if (index !== -1) {
        storage.delete('contactsInfo', index)
      }
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_CONTACTS_REMARKS_FAIL)
    }
  }

  // 修改用户群昵称
  const updateGroupsRemarksData = async () => {
    const remarksInfo: UpdateGroupsRemarksType = {
      userId: store.user_id,
      groupId: id.value,
      remarks: info.value.remarks,
    }
    const { data } = await updateGroupsRemarks(remarksInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_GROUPS_REMARKS_SUCCESS)
      const index = (storage.get('groupsInfo') || []).findIndex((item: any) => item.id === id.value)
      if (index !== -1) {
        storage.delete('groupsInfo', index)
      }
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_GROUPS_REMARKS_FAIL)
    }
  }

  // 完成编辑
  const listenConfirmEdit = async () => {
    isEdit.value = false
    if (type.value === 'friend') {
      await updateContactsRemarksData()
    } else {
      await updateGroupsRemarksData()
    }
  }

  // 跳转到聊天界面
  const listenNavigateToChat = () => {
    const chatMessageList: MessageListItemInfoType[] = lStorage.get('chatMessageList') || []
    const index = chatMessageList.findIndex(
      (item) => (item.contactId === id.value || item.groupId === id.value) && item.type === type.value
    )
    if (index !== -1) {
      const chatMessage: MessageListItemInfoType[] = chatMessageList.splice(index, 1)
      chatMessageList.unshift(chatMessage[0])
    } else {
      if (type.value === 'friend') {
        const chatMessage: MessageListItemInfoType = {
          id: chatMessageList.length + 1,
          contactId: id.value,
          type: 'friend',
          name: info.value.nickname,
          remarks: info.value.remarks,
          avatarUrl: info.value.avatarUrl,
          lastMessage: '',
          unRead: 0,
        }
        chatMessageList.unshift(chatMessage)
      } else {
        const chatMessage: MessageListItemInfoType = {
          id: chatMessageList.length + 1,
          groupId: id.value,
          type: 'group',
          name: info.value.name,
          remarks: info.value.remarks,
          avatarUrl: info.value.avatarUrl,
          lastMessage: '',
          unRead: 0,
        }
        chatMessageList.unshift(chatMessage)
      }
    }
    lStorage.set('chatMessageList', chatMessageList)

    router.push({
      name: 'message',
      query: {
        type: type.value,
        id: id.value,
      },
    })
  }

  // 跳转到用户朋友圈
  const listenNavigateToPyq = () => {
    router.push({
      name: 'pyq',
      query: {
        id: id.value,
      },
    })
  }

  // 跳转到用户生活圈
  const listenNavigateToLife = () => {
    router.push({
      name: 'life',
      query: {
        id: id.value,
      },
    })
  }
</script>

<style scoped lang="less">
  .info-container {
    width: 100%;
    height: 100%;
    .info-show-interaction {
      width: 100%;
      background-color: var(--friend-info-background-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      .info-show-avatar {
        margin: 20px 0;
        box-sizing: border-box;
      }
      .info-show-name {
        font-size: var(--title-font-size);
        font-weight: var(--title-font-weight);
        margin-bottom: 20px;
      }
      .info-show-interaction-friend,
      .info-show-interaction-group {
        display: flex;
        margin-bottom: 20px;
        .item {
          margin: 0 10px;
          padding: 5px;
          box-sizing: border-box;
          &:hover {
            box-shadow: var(--el-box-shadow-light);
          }
        }
      }
    }
    .info-show-desc {
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: var(--middle-font-size);
      .info-show-desc-friend,
      .info-show-desc-group {
        padding-top: 20px;
        box-sizing: border-box;
        .info-show-desc-item {
          height: 35px;
          display: flex;
          align-items: center;
          padding: 10px 0;
          box-sizing: border-box;
          .title {
            color: var(--desc-color);
          }
          .content {
            flex: 1;
            line-height: 16px;
            -webkit-line-clamp: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            &.tip {
              color: var(--desc-color);
            }
          }
          svg {
            margin-left: 5px;
          }
          .edit-remarks {
            display: flex;
            align-items: center;
          }
        }
      }
      .info-show-desc-friend .info-show-desc-item {
        width: 230px;
      }
      .info-show-desc-friend .title {
        width: 36px;
        margin-right: 20px;
      }
      .info-show-desc-group .info-show-desc-item {
        width: 260px;
      }
      .info-show-desc-group .content {
        max-width: 175px;
      }
      .info-show-desc-group .title {
        width: 80px;
        margin-right: 20px;
      }
    }
  }
  .el-input {
    width: 130px !important;
  }
</style>
