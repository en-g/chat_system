<template>
  <div class="group-detail-container">
    <div class="group-detail-info">
      <div class="avatar-name">
        <div class="avatar">
          <el-avatar shape="square" :size="50" :src="groupInfo.avatarUrl" />
        </div>
        <div class="name">{{ groupInfo.name }}</div>
      </div>
      <div class="number">
        <div class="label">群号</div>
        <div class="content">{{ groupInfo.number }}</div>
      </div>
      <div class="leader">
        <div class="label">群主</div>
        <div class="content">{{ groupInfo.leader }}</div>
      </div>
      <div class="time">
        <div class="label">创建时间</div>
        <div class="content">{{ groupInfo.createTime }}</div>
      </div>
    </div>
    <div class="group-detail-members">
      <div v-for="item in groupInfo.members" :key="item.id" class="group-detail-members-item">
        <div class="avatar">
          <el-avatar shape="square" :size="50" :src="item.avatarUrl" />
        </div>
        <div class="name">{{ item.remarks || item.nickname }}</div>
      </div>
      <div class="invite" @click="listenInviteContact">
        <el-icon class="icon"><Plus /></el-icon>
      </div>
    </div>
    <div class="group-detail-update-name" @click="listenUpdateGroupName">
      <div class="label">群聊名称</div>
      <div v-if="!isUpdateGroupName" class="op">{{ groupInfo.name }}</div>
      <div v-else class="update">
        <el-input
          v-model="groupInfo.name"
          autofocus
          maxlength="10"
          placeholder="请输入群聊名称"
          type="text"
          @change="listenConfirmUpdateGroupName"
          @blur="isUpdateGroupName = false"
        />
      </div>
    </div>
    <div class="group-detail-update-remarks" @click="listenUpdateRemarks">
      <div class="label">我的群聊昵称</div>
      <div v-if="!isUpdateRemarks" class="op">{{ groupInfo.remarks || '无' }}</div>
      <div v-else class="update">
        <el-input
          v-model="groupInfo.remarks"
          autofocus
          maxlength="10"
          placeholder="请输入群昵称"
          type="text"
          @change="listenConfirmUpdateRemarks"
          @blur="isUpdateRemarks = false"
        />
      </div>
    </div>
    <div class="group-detail-update-notice" @click="listenUpdateGroupNotice">
      <div class="label">群公告</div>
      <div v-if="!isUpdateGroupNotice && groupInfo.notice" class="op">{{ groupInfo.notice }}</div>
      <div v-if="isUpdateGroupNotice" class="update">
        <el-input
          v-model="groupInfo.notice"
          class="textarea"
          maxlength="50"
          placeholder="请输入群公告"
          type="textarea"
          @change="listenConfirmUpdateGropNotice"
          @blur="isUpdateGroupNotice = false"
        />
      </div>
    </div>
    <!-- <div class="group-detail-show-messages" @click="listenShowChatMessages">
      <div class="label">查看聊天记录</div>
      <div class="op"></div>
    </div> -->
    <!-- <div class="group-detail-disturb">
      <div class="label">消息免打扰</div>
      <div class="op">
        <el-switch v-model="groupInfo.disturb" size="small" />
      </div>
    </div> -->
    <!-- <div class="group-detail-clear-messages" @click="listenClearChatMessages">
      <div class="label">清空聊天记录</div>
      <div class="op"></div>
    </div> -->
    <div v-if="groupInfo.leaderId === store.user_id" class="group-detail-dismiss-group">
      <el-button class="botton" type="danger" @click="listenDismissGroup">解散群聊</el-button>
    </div>
    <div v-else class="group-detail-delete-group">
      <el-button class="botton" type="danger" @click="listenExitGroup">退出群聊</el-button>
    </div>
    <div class="group-detail-back">
      <el-button class="botton" @click="listenBack">返回</el-button>
    </div>
    <el-dialog v-model="inviteGropVisible" title="邀请进群" width="30%">
      <el-scrollbar height="300px">
        <div v-if="contactList.length > 0" class="contact-list">
          <div
            v-for="item in contactList"
            :key="item.userId"
            class="contact-list-item"
            :class="{ active: item.isMember || inviteIds.includes(item.userId), cursor: !item.isMember }"
            @click="listenChooseContact(item.userId)"
          >
            <div class="avatar">
              <el-avatar :size="30" :src="item.avatarUrl" />
            </div>
            <div class="name">{{ item.name }}</div>
            <div class="member">
              <span v-if="item.isMember" class="added">已加入</span>
              <span v-if="!item.isMember && inviteIds.includes(item.userId)" class="icon">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-agree"></use>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div v-else class="contact-null">暂无联系人</div>
      </el-scrollbar>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="inviteGropVisible = false">取消</el-button>
          <el-button type="primary" @click="listenConfirmInvite"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'
  // import { FriendGroupsListType, UpdategroupsRemarksType } from '@/types/groups'
  // import { deletegroup, getFriendGroupList, updategroupFriendGroup, updategroupsRemarks } from '@/api/groups'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import websocket from '@/websocket'
  import { Plus } from '@element-plus/icons-vue'
  import { dismissGroup, exitGroup, updateGroupName, updateGroupNotice } from '@/api/groups'
  import { getContactListAboutGroup, getGroupInfo, updateGroupsRemarks } from '@/api/contacts'
  import { ContactListAboutGroupType, GetGroupInfoType } from '@/types/contacts'
  import { formateTime } from '@/utils/utils'
  import { UpdateGroupNameInfoType, UpdateGroupNoticeInfoType, UpdategroupsRemarksType } from '@/types/groups'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const props = defineProps<{
    groupId: number
  }>()
  const emit = defineEmits(['back'])

  const groupInfo = reactive<any>({}) // 群聊信息
  const isUpdateGroupName = ref<boolean>(false) // 标记是否修改群聊名称
  const isUpdateRemarks = ref<boolean>(false) // 标记是否修改群昵称
  const isUpdateGroupNotice = ref<boolean>(false) // 标记是否修改群公告
  const inviteGropVisible = ref<boolean>(false) // 标记是否显示邀请进群的 dialog
  const contactList = reactive<ContactListAboutGroupType[]>([]) // 联系人列表
  const inviteIds = reactive<Array<number>>([]) // 要邀请进群的id

  // 获取群聊设置信息
  const getgroupSetting = () => {
    const groupsInfo = storage.get('groupsInfo') || []
    const info = groupsInfo.find((item: any) => item.id === props.groupId)
    Object.assign(groupInfo, info)
  }

  // 获取联系人列表与群聊的关系
  const getContactListAboutGroupData = async () => {
    const { data } = await getContactListAboutGroup({
      userId: store.user_id,
      groupId: groupInfo.id,
    })
    contactList.splice(0, contactList.length, ...data)
  }

  // 邀请好友进群
  const listenInviteContact = async () => {
    await getContactListAboutGroupData()
    inviteIds.splice(0, inviteIds.length)
    inviteGropVisible.value = true
  }

  // 邀请好友
  const listenChooseContact = (id: number) => {
    const contact = contactList.find((item) => item.userId === id)
    if (contact?.isMember) return
    if (inviteIds.includes(id)) {
      const index = inviteIds.findIndex((userId) => userId === id)
      inviteIds.splice(index, 1)
    } else {
      inviteIds.push(id)
    }
  }

  // 确定邀请
  const listenConfirmInvite = async () => {
    if (inviteIds.length === 0) {
      ElMessage.error(TIP_TYPE.INVITE_GROUP_IS_NOT_NULL)
      return
    }
    websocket.send('inviteGroup', {
      userId: store.user_id,
      groupId: groupInfo.id,
      inviteIds,
    })
    ElMessage.success(TIP_TYPE.INVITE_GROUP_SCCESS)
    inviteGropVisible.value = false
  }

  // 更新群聊信息
  const updateGroupInfo = async (groupId: number) => {
    const ids: GetGroupInfoType = {
      userId: store.user_id,
      groupId,
    }
    const { data } = await getGroupInfo(ids)
    data.createTime = formateTime(data.createTime, 1)
    // data.members = data.members.reverse()
    Object.assign(groupInfo, data)
  }

  // 修改群聊名称
  const listenUpdateGroupName = () => {
    if (groupInfo.leaderId === store.user_id) {
      isUpdateGroupName.value = true
    } else {
      ElMessage.error(TIP_TYPE.ONLY_LEADER_CAN_UPDATE_GROUP_NAME)
    }
  }

  // 确认修改群聊名称
  const listenConfirmUpdateGroupName = async () => {
    const groupNameInfo: UpdateGroupNameInfoType = {
      userId: store.user_id,
      groupId: props.groupId,
      name: groupInfo.name,
    }
    const { data } = await updateGroupName(groupNameInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_GROUP_NAME_SUCCESS)
      const groupsInfo = storage.get('groupsInfo') || []
      const index = groupsInfo.findIndex((item: any) => item.id === props.groupId)
      if (index !== -1) {
        groupsInfo.splice(index, 1, groupInfo)
        storage.set('groupsInfo', groupsInfo)
      }
      isUpdateGroupName.value = false
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_GROUP_NAME_FAIL)
    }
  }

  // 修改备注
  const listenUpdateRemarks = () => {
    isUpdateRemarks.value = true
  }

  // 确认修改备注
  const listenConfirmUpdateRemarks = async () => {
    const remarksInfo: UpdategroupsRemarksType = {
      userId: store.user_id,
      groupId: props.groupId,
      remarks: groupInfo.remarks,
    }
    const { data } = await updateGroupsRemarks(remarksInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_GROUPS_REMARKS_SUCCESS)
      const groupsInfo = storage.get('groupsInfo') || []
      const index = groupsInfo.findIndex((item: any) => item.id === props.groupId)
      if (index !== -1) {
        groupsInfo.splice(index, 1, groupInfo)
        storage.set('groupsInfo', groupsInfo)
      }
      isUpdateRemarks.value = false
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_GROUPS_REMARKS_FAIL)
    }
  }

  // 修改群公告
  const listenUpdateGroupNotice = () => {
    if (groupInfo.isLeader) {
      isUpdateGroupNotice.value = true
    } else {
      ElMessage.error(TIP_TYPE.ONLU_LEADER_CAN_UPDATE_GROUP_NOTICE)
    }
  }

  // 确认修改群公告
  const listenConfirmUpdateGropNotice = async () => {
    const groupNticeInfo: UpdateGroupNoticeInfoType = {
      userId: store.user_id,
      groupId: props.groupId,
      notice: groupInfo.notice,
    }
    const { data } = await updateGroupNotice(groupNticeInfo)
    if (data) {
      ElMessage.success(TIP_TYPE.UPDATE_GROUP_NOTICE_SUCCESS)
      const groupsInfo = storage.get('groupsInfo') || []
      const index = groupsInfo.findIndex((item: any) => item.id === props.groupId)
      if (index !== -1) {
        groupsInfo.splice(index, 1, groupInfo)
        storage.set('groupsInfo', groupsInfo)
      }
      isUpdateGroupNotice.value = false
    } else {
      ElMessage.error(TIP_TYPE.UPDATE_GROUP_NOTICE_FAIL)
    }
  }

  // // 查看聊天记录
  // // const listenShowChatMessages = () => {
  // //   console.log('remarks')
  // // }

  // 清空聊天记录
  const listenClearChatMessages = () => {
    console.log('remarks')
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
        groupId: groupInfo.id,
      })
      if (data) {
        ElMessage.success(TIP_TYPE.DISMISS_GROUP_SUCCESS)
        // 更新群聊列表
        store.isUpdateGroupList = true
        // 对群成员发送解散群聊通知
        websocket.send('dismissGroup', {
          fromId: store.user_id,
          toId: -1,
          groupId: groupInfo.id,
          type: 'dismiss',
        })
      } else {
        ElMessage.success(TIP_TYPE.DISMISS_GROUP_FAIL)
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
        groupId: groupInfo.id,
      })
      if (data) {
        ElMessage.success(TIP_TYPE.EXIT_GROUP_SUCCESS)
        // 更新群聊列表
        store.isUpdateGroupList = true
        // 对群主发送退群通知, 通知群成员更新群聊信息
        websocket.send('exitGroup', {
          fromId: store.user_id,
          toId: groupInfo.leaderId,
          groupId: groupInfo.id,
          type: 'exit',
        })
      } else {
        ElMessage.success(TIP_TYPE.EXIT_GROUP_FAIL)
      }
    })
  }

  // 返回
  const listenBack = () => {
    emit('back')
  }

  watch(
    () => props.groupId,
    () => {
      getgroupSetting()
    },
    { immediate: true }
  )

  onMounted(() => {
    websocket.listen('updateGroupInfo', async (id: { groupId: number }) => {
      // 更新页面群聊信息
      if (groupInfo.id === id.groupId) {
        await updateGroupInfo(id.groupId)
      }
    })
  })
</script>

<style scoped lang="less">
  .group-detail-container {
    height: 100%;
    text-align: left;
    background-color: var(--setting-background-color);
    .group-detail-info {
      background-color: #fff;
      padding: 20px 20px 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .avatar-name {
        display: flex;
        margin-bottom: 10px;
        .avatar {
          margin-right: 15px;
        }
        .name {
          flex: 1;
          display: flex;
          align-items: center;
          font-size: var(--middle-font-size);
          font-weight: bold;
        }
      }
      .number,
      .leader,
      .time {
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
    .group-detail-members {
      margin-bottom: 10px;
      padding: 20px 0 5px 20px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      .group-detail-members-item {
        width: 50px;
        margin-bottom: 15px;
        margin-right: 20px;
        .avatar {
          margin-bottom: 5px;
        }
        .name {
          width: 50px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          color: var(--desc-color);
          font-size: var(--small-desc-size);
          text-align: center;
        }
      }
      .invite {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        .icon {
          font-size: 30px;
          color: #8c939d;
        }
      }
    }
    .group-detail-update-name,
    .group-detail-update-remarks,
    .group-detail-show-messages,
    .group-detail-disturb,
    .group-detail-clear-messages {
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
    .group-detail-update-name,
    .group-detail-update-remarks,
    .group-detail-update-notice,
    .group-detail-show-messages,
    .group-detail-clear-messages {
      cursor: pointer;
    }
    .group-detail-update-notice {
      margin-bottom: 10px;
      padding: 15px 20px;
      box-sizing: border-box;
      background-color: #fff;
      .label {
      }
      .op {
        color: var(--desc-color);
        margin-top: 10px;
        line-height: 18px;
        font-size: var(--small-desc-size);
      }
      .textarea {
        margin-top: 10px;
      }
    }
    .group-detail-delete-group,
    .group-detail-dismiss-group,
    .group-detail-back {
      margin-bottom: 10px;
      .botton {
        width: 100%;
        border-radius: 0;
      }
    }
    .contact-list {
      .contact-list-item {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        .avatar {
          margin-right: 15px;
        }
        .name {
          flex: 1;
          font-weight: bold;
          font-size: var(--middle-font-size);
        }
        .member {
          width: 60px;
          text-align: right;
          .added {
            font-size: var(--small-desc-size);
          }
          .icon {
          }
        }
        &.active {
          background-color: var(--mouse-hover-active);
        }
        &.cursor {
          cursor: pointer;
        }
      }
    }
    .contact-null {
      display: flex;
      justify-content: center;
      padding: 30px 0;
      box-sizing: border-box;
      font-size: var(--title-font-size);
      color: var(--desc-color);
      font-family: '楷体';
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
  :deep(.el-textarea__inner) {
    padding: 0 !important;
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px 20px;
  }
</style>
