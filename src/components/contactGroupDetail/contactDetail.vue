<template>
  <div class="contact-detail-container">
    <div class="contact-detail-info">
      <div class="avatar-name-signature">
        <div class="avatar">
          <el-avatar shape="square" :size="50" :src="contactInfo.avatarUrl" />
        </div>
        <div class="name-signature">
          <div class="name">{{ contactInfo.nickname }}</div>
          <div v-if="contactInfo.signature" class="signature">{{ contactInfo.signature }}</div>
        </div>
      </div>
      <div class="username">
        <div class="label">账号</div>
        <div class="content">{{ contactInfo.username }}</div>
      </div>
      <div class="sex">
        <div class="label">性别</div>
        <div class="content">{{ contactInfo.sex }}</div>
      </div>
      <div class="birthday">
        <div class="label">生日</div>
        <div class="content">{{ contactInfo.birthday }}</div>
      </div>
      <div class="email">
        <div class="label">邮箱</div>
        <div class="content">{{ contactInfo.email }}</div>
      </div>
    </div>
    <div class="contact-detail-update-remarks" @click="listenUpdateRemarks">
      <div class="label">修改备注</div>
      <div v-if="!isUpdateRemarks" class="op">{{ contactInfo.remarks || '无' }}</div>
      <div v-else class="update">
        <el-input
          v-model="contactInfo.remarks"
          autofocus
          maxlength="10"
          placeholder="请输入备注"
          type="text"
          @change="listenConfirmUpdateRemarks"
          @blur="isUpdateRemarks = false"
        />
      </div>
    </div>
    <div class="contact-detail-update-friend-group" @click="listenUpdateFriendGroup">
      <div class="label">修改分组</div>
      <div v-if="!isUpdateFriendGroup" class="op">{{ contactInfo.friendGroupName }}</div>
      <div v-else class="update">
        <el-select
          v-model="contactInfo.friendGroupId"
          class="select"
          @change="listenConfirmUpdateFriendGroup"
          @visible-change="listenHideSelect"
        >
          <el-option v-for="item in friendGroupsList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </div>
    <!-- <div class="contact-detail-show-messages" @click="listenShowChatMessages">
      <div class="label">查看聊天记录</div>
      <div class="op"></div>
    </div> -->
    <!-- <div class="contact-detail-disturb">
      <div class="label">消息免打扰</div>
      <div class="op">
        <el-switch v-model="contactInfo.disturb" size="small" />
      </div>
    </div> -->
    <div class="contact-detail-clear-messages" @click="listenClearChatMessages">
      <div class="label">清空聊天记录</div>
      <div class="op"></div>
    </div>
    <div class="contact-detail-delete-contact">
      <el-button class="botton" type="danger" @click="listenDleteContact">删除</el-button>
    </div>
    <div class="contact-detail-back">
      <el-button class="botton" @click="listenBack">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'
  import { FriendGroupsListType, UpdateContactsRemarksType } from '@/types/contacts'
  import { deleteContact, getFriendGroupList, updateContactFriendGroup, updateContactsRemarks } from '@/api/contacts'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import websocket from '@/websocket'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const props = defineProps<{
    userId: number
  }>()
  const emit = defineEmits(['back'])

  const contactInfo = reactive<any>({}) // 联系人信息
  const isUpdateRemarks = ref<boolean>(false) // 标记是否修改备注
  const isUpdateFriendGroup = ref<boolean>(false) // 标记是否修改分组
  const friendGroupsList = reactive<FriendGroupsListType[]>([]) // 分组列表

  // 获取联系人设置信息
  const getContactSetting = () => {
    const contactsInfo = storage.get('contactsInfo') || []
    const info = contactsInfo.find((item: any) => item.id === props.userId)
    Object.assign(contactInfo, info)
  }

  // 修改备注
  const listenUpdateRemarks = () => {
    isUpdateRemarks.value = true
  }

  // 确认修改备注
  const listenConfirmUpdateRemarks = async () => {
    const remarksInfo: UpdateContactsRemarksType = {
      userId: store.user_id,
      friendId: props.userId,
      remarks: contactInfo.remarks,
    }
    const { data } = await updateContactsRemarks(remarksInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_CONTACTS_REMARKS_SUCCESS)
      const contactsInfo = storage.get('contactsInfo') || []
      const index = contactsInfo.findIndex((item: any) => item.id === props.userId)
      if (index !== -1) {
        contactsInfo.splice(index, 1, contactInfo)
        storage.set('contactsInfo', contactsInfo)
      }
      isUpdateRemarks.value = false
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_CONTACTS_REMARKS_FAIL)
    }
  }

  // 获取好友分组
  const getFriendGroupListData = async () => {
    const { data } = await getFriendGroupList({
      userId: store.user_id,
    })
    friendGroupsList.splice(0, friendGroupsList.length, ...data)
  }

  // 修改分组
  const listenUpdateFriendGroup = async () => {
    await getFriendGroupListData()
    isUpdateFriendGroup.value = true
  }

  // 确认修改分组
  const listenConfirmUpdateFriendGroup = async (id: number) => {
    const { data } = await updateContactFriendGroup({
      userId: store.user_id,
      friendId: props.userId,
      friendGroupId: id,
    })
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_CONTACT_FRIEND_GROUP_SCCESS)
      contactInfo.friendGroupName = friendGroupsList.find((item) => item.id === id)?.name
      isUpdateFriendGroup.value = false
      // 更新好友列表
      store.isUpdateContactList = true
      // 更新好友信息
      const contactsInfo = storage.get('contactsInfo') || []
      const index = contactsInfo.findIndex((item: any) => item.id === props.userId)
      if (index !== -1) {
        contactsInfo.splice(index, 1, contactInfo)
        storage.set('contactsInfo', contactsInfo)
      }
    } else {
      ElMessage.success(TIP_TYPE.UPDATE_CONTACT_FRIEND_GROUP_FAIL)
    }
  }

  // 隐藏select
  const listenHideSelect = (val: boolean) => {
    if (!val) isUpdateFriendGroup.value = false
  }

  // 查看聊天记录
  // const listenShowChatMessages = () => {
  //   console.log('remarks')
  // }

  // 清空聊天记录
  const listenClearChatMessages = () => {
    console.log('remarks')
  }

  // 删除联系人
  const listenDleteContact = () => {
    ElMessageBox.confirm('您正在删除该联系人，请确认！', '删除联系人', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      const { data } = await deleteContact({
        userId: store.user_id,
        friendId: props.userId,
      })
      if (data) {
        ElMessage.success(TIP_TYPE.DELETE_CONTACT_SUCCESS)
        // 更新联系人列表
        store.isUpdateContactList = true
        // 通知对方更新联系人列表
        websocket.send('updateContactList', { userId: props.userId })
        // 将联系人从聊天列表中删除
        // 也要通知对方从聊天列表中删除
        websocket.send('deleteContact', {
          userId: store.user_id,
          friendId: props.userId,
        })
        // TODO 后面看看聊天记录要不要删
      } else {
        ElMessage.error(TIP_TYPE.DELETE_CONTACT_FAIL)
      }
    })
  }

  // 返回
  const listenBack = () => {
    emit('back')
  }

  watch(
    () => props.userId,
    () => {
      getContactSetting()
    },
    { immediate: true }
  )
</script>

<style scoped lang="less">
  .contact-detail-container {
    height: 100%;
    text-align: left;
    background-color: var(--setting-background-color);
    .contact-detail-info {
      background-color: #fff;
      padding: 20px 20px 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .avatar-name-signature {
        display: flex;
        margin-bottom: 10px;
        .avatar {
          margin-right: 15px;
        }
        .name-signature {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .name {
            height: 25px;
            line-height: 25px;
            font-size: var(--middle-font-size);
            font-weight: bold;
          }
          .signature {
            height: 25px;
            line-height: 25px;
            color: var(--desc-color);
            font-size: var(--small-desc-size);
          }
        }
      }
      .username,
      .sex,
      .birthday,
      .email {
        display: flex;
        padding: 10px 0;
        box-sizing: border-box;
        .label {
          margin-right: 15px;
        }
        .content {
          color: var(--desc-color);
        }
      }
    }
    .contact-detail-update-remarks,
    .contact-detail-update-friend-group,
    .contact-detail-show-messages,
    .contact-detail-disturb,
    .contact-detail-clear-messages {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 10px;
      padding: 0 20px;
      box-sizing: border-box;
      height: 45px;
      .label {
      }
      .op {
        color: var(--desc-color);
      }
      .select {
      }
    }
    .contact-detail-update-remarks,
    .contact-detail-update-friend-group,
    .contact-detail-show-messages,
    .contact-detail-clear-messages {
      cursor: pointer;
    }
    .contact-detail-delete-contact,
    .contact-detail-back {
      margin-bottom: 10px;
      .botton {
        width: 100%;
        border-radius: 0;
      }
    }
  }
  :deep(.el-input__wrapper.is-focus),
  :deep(.el-input__wrapper),
  :deep(.el-input__wrapper:hover) {
    box-shadow: none;
    outline: none;
    border: none;
  }
  :deep(.el-input__inner) {
    text-align: right;
  }
</style>
