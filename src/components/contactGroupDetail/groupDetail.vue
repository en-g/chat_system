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
      <div class="invite">
        <el-icon class="icon"><Plus /></el-icon>
      </div>
    </div>
    <div class="group-detail-update-remarks" @click="listenUpdateRemarks">
      <div class="label">我的群聊名称</div>
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
    <div class="group-detail-clear-messages" @click="listenClearChatMessages">
      <div class="label">清空聊天记录</div>
      <div class="op"></div>
    </div>
    <div v-if="groupInfo.isLeader === store.user_id" class="group-detail-dismiss-group">
      <el-button class="botton" type="danger" @click="listenDismissGroup">解散群聊</el-button>
    </div>
    <div v-else class="group-detail-delete-group">
      <el-button class="botton" type="danger" @click="listenExitGroup">退出群聊</el-button>
    </div>
    <div class="group-detail-back">
      <el-button class="botton" @click="listenBack">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  import useStore from '@/store'
  import { sessionStorage } from '@/utils/storage'
  // import { FriendGroupsListType, UpdategroupsRemarksType } from '@/types/groups'
  // import { deletegroup, getFriendGroupList, updategroupFriendGroup, updategroupsRemarks } from '@/api/groups'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { TIP_TYPE } from '@/config'
  import websocket from '@/websocket'
  import { Plus } from '@element-plus/icons-vue'

  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const props = defineProps<{
    groupId: number
  }>()
  const emit = defineEmits(['back'])

  const groupInfo = reactive<any>({}) // 群聊信息
  const isUpdateRemarks = ref<boolean>(false) // 标记是否修改群昵称
  const isUpdateGroupNotice = ref<boolean>(false) // 标记是否修改群公告

  // 获取群聊设置信息
  const getgroupSetting = () => {
    const groupsInfo = storage.get('groupsInfo') || []
    const info = groupsInfo.find((item: any) => item.id === props.groupId)
    Object.assign(groupInfo, info)
  }

  // 修改备注
  const listenUpdateRemarks = () => {
    isUpdateRemarks.value = true
  }

  // 确认修改备注
  const listenConfirmUpdateRemarks = async () => {
    console.log('remarks')
    // const remarksInfo: UpdategroupsRemarksType = {
    //   userId: store.user_id,
    //   friendId: props.userId,
    //   remarks: groupInfo.remarks,
    // }
    // const { data } = await updategroupsRemarks(remarksInfo)
    // if (data) {
    //   ElMessage.success(TIP_TYPE.UPDATE_groupS_REMARKS_SUCCESS)
    //   const groupsInfo = storage.get('groupsInfo') || []
    //   const index = groupsInfo.findIndex((item: any) => item.id === props.userId)
    //   if (index !== -1) {
    //     groupsInfo.splice(index, 1, groupInfo)
    //     storage.set('groupsInfo', groupsInfo)
    //   }
    //   isUpdateRemarks.value = false
    // } else {
    //   ElMessage.error(TIP_TYPE.UPDATE_groupS_REMARKS_FAIL)
    // }
  }

  // 修改群公告
  const listenUpdateGroupNotice = () => {
    isUpdateGroupNotice.value = true
  }

  // 确认修改群公告
  const listenConfirmUpdateGropNotice = () => {
    console.log('=')
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
    console.log('dismiss')
  }

  // 退出群聊
  const listenExitGroup = () => {
    console.log('exit')
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
</style>
