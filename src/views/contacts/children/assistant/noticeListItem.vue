<template>
  <div class="notice-list-item-container">
    <div class="notice-list-item-time">{{ props.noticeListItem.createTime }}</div>
    <div class="notice-list-item-main">
      <div class="avatar">
        <el-avatar :size="50" :src="props.noticeListItem.fromAvatarUrl" />
      </div>
      <div class="desc">
        <div class="info">
          <div class="source-target">
            <span class="source">{{ props.noticeListItem.fromName }}</span>
            <span class="tip">{{ applyTypeTip[props.type][props.noticeListItem.type] }}</span>
            <span v-if="props.noticeListItem.groupName" class="target">{{ props.noticeListItem.groupName }}</span>
          </div>
          <div v-if="props.noticeListItem.fromSignature" class="signature">
            {{ props.noticeListItem.fromSignature }}
          </div>
        </div>
        <div class="message">验证信息：{{ props.noticeListItem.message }}</div>
      </div>
      <div class="op">
        <div v-if="props.noticeListItem.status === 0" class="op-item">
          <svg class="icon" aria-hidden="true" @click="listenAgree">
            <use xlink:href="#icon-agree"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="listenRefuse">
            <use xlink:href="#icon-refuse"></use>
          </svg>
        </div>
        <div v-else-if="props.noticeListItem.status === 1" class="op-item">已同意</div>
        <div v-else-if="props.noticeListItem.status === 2" class="op-item">已拒绝</div>
        <div v-else class="op-item">已阅读</div>
      </div>
    </div>
    <el-dialog v-model="agreeAddVisible" title="请填写联系人信息" width="30%">
      <div class="agree-apply-info">
        <div class="agree-apply-contact">
          <div class="avatar">
            <el-avatar :size="40" :src="props.noticeListItem.fromAvatarUrl" />
          </div>
          <div class="info">
            <div class="name">{{ props.noticeListItem.fromName }}</div>
            <div v-if="props.noticeListItem.fromSignature" class="signature">
              {{ props.noticeListItem.fromSignature }}
            </div>
          </div>
        </div>
        <div class="agree-apply-tip">
          您已同意添加
          <span class="fromName">{{ props.noticeListItem.fromName }}</span>
          ，请选择分组和添加备注
        </div>
        <div class="agree-apply-group">
          <div class="label">分组：</div>
          <div class="select">
            <el-select v-model="chooseGroup" size="default" clearable placeholder="请选择分组">
              <el-option v-for="item in friendGroups" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
        </div>
        <div class="agree-apply-remarks">
          <div class="label">备注：</div>
          <div class="input">
            <el-input v-model="reamrks" size="default" maxlength="10" placeholder="请输入备注" clearable type="text" />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="button">
          <el-button class="item" size="default" @click="agreeAddVisible = false">取消</el-button>
          <el-button class="item" size="default" type="primary" @click="listenAgreeAddContact"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { FriendGroupsListType, NoticeListItemType } from '@/types/contacts'
  import { inject, reactive, ref } from 'vue'
  import useStore from '@/store'
  import {
    agreeAddContact,
    agreeAddGroup,
    getFriendGroupList,
    readNotice,
    refuseAddContact,
    refuseAddGrop,
  } from '@/api/contacts'
  import { TIP_TYPE } from '@/config'
  import { ElMessage } from 'element-plus'
  import websocket from '@/websocket'

  const props = defineProps<{
    noticeListItem: NoticeListItemType
    type: string
  }>()
  const agreeNotice = inject('agreeNotice') as any
  const refuseNotice = inject('refuseNotice') as any
  const readedNotice = inject('readNotice') as any
  const updateContactList = inject('updateContactList') as any
  const updateGroupList = inject('updateGroupList') as any
  const store = useStore()

  // 通知的不同类型的提示语
  const applyTypeTip: any = {
    friend: {
      add: '申请添加您为好友',
    },
    group: {
      add: '申请加入群聊',
      invite: '邀请您加入群聊',
      exit: '退出了群聊',
      dismiss: '解散了群聊',
      create: '创建了群聊并邀请您加入',
    },
  }
  const agreeAddVisible = ref<boolean>(false) // 标记是否显示添加好友的dialog
  const chooseGroup = ref<number>(-1)
  const reamrks = ref<string>('')
  const friendGroups = reactive<FriendGroupsListType[]>([]) // 好友分组列表

  // 群聊通知 type 为 exit、dismiss、create 的，直接变成已读
  const handleGroupNotice = async () => {
    if (
      (props.noticeListItem.type === 'exit' ||
        props.noticeListItem.type === 'dismiss' ||
        props.noticeListItem.type === 'create') &&
      props.noticeListItem.status === 0
    ) {
      const { data } = await readNotice({
        noticeId: props.noticeListItem.id,
      })
      if (data) {
        readedNotice(props.noticeListItem.id)
      }
    }
  }
  handleGroupNotice()

  // 监听同意操作
  const listenAgree = async () => {
    if (props.type === 'friend') {
      // 获取分组列表
      const { data } = await getFriendGroupList({
        userId: store.user_id,
      })
      friendGroups.splice(0, friendGroups.length, ...data)
      if (friendGroups.length === 0) {
        ElMessage.error(TIP_TYPE.FRIEND_GROUP_IS_NLL)
        return
      }
      chooseGroup.value = friendGroups[0].id
      agreeAddVisible.value = true
    } else {
      if (props.noticeListItem.type === 'add' || props.noticeListItem.type === 'invite') {
        const { data } = await agreeAddGroup({
          noticeId: props.noticeListItem.id,
        })
        if (data) {
          agreeNotice(props.noticeListItem.id)
          // 未处理通知-1
          const index = store.groupUnHandleNoticeIds.findIndex((id) => id === props.noticeListItem.id)
          if (index !== -1) {
            store.groupUnHandleNoticeIds.splice(index, 1)
          }
          if (props.noticeListItem.type === 'add') {
            ElMessage.success(TIP_TYPE.AGREE_ADD_GROUP_SUCCESS)
            // 通知对方更新群聊列表
            websocket.send('updateGroupList', {
              userId: props.noticeListItem.fromId,
            })
            // 告诉websocket服务器谁进群
            websocket.send('enterGroup', {
              userId: props.noticeListItem.fromId,
              groupId: props.noticeListItem.groupId,
            })
          } else {
            ElMessage.success(TIP_TYPE.ADD_GROUP_SUCCESS)
            // 告诉websocket服务器我进群
            websocket.send('enterGroup', {
              userId: props.noticeListItem.toId,
              groupId: props.noticeListItem.groupId,
            })
            // 更新群聊列表
            await updateGroupList()
          }
          // TODO 之后还要在websocket服务器中添加群聊成员ID
          // socket.send(...)
        } else {
          if (props.noticeListItem.type === 'add') {
            ElMessage.error(TIP_TYPE.AGREE_ADD_GROUP_FAIL)
          } else {
            ElMessage.error(TIP_TYPE.ADD_GROUP_FAIL)
          }
        }
        agreeAddVisible.value = false
      }
    }
  }

  // 监听拒绝操作
  const listenRefuse = async () => {
    if (props.type === 'friend') {
      const { data } = await refuseAddContact({
        noticeId: props.noticeListItem.id,
      })
      if (data) {
        refuseNotice(props.noticeListItem.id)
        // 未处理通知-1
        const index = store.groupUnHandleNoticeIds.findIndex((id) => id === props.noticeListItem.id)
        if (index !== -1) {
          store.groupUnHandleNoticeIds.splice(index, 1)
        }
        ElMessage.success(TIP_TYPE.REFUSE_ADD_CONTACT_SUCCESS)
      } else {
        ElMessage.error(TIP_TYPE.REFUSE_ADD_CONTACT_FAIL)
      }
    } else {
      if (props.noticeListItem.type === 'add' || props.noticeListItem.type === 'invite') {
        const { data } = await refuseAddGrop({
          noticeId: props.noticeListItem.id,
        })
        if (data) {
          refuseNotice(props.noticeListItem.id)
          // 未处理通知-1
          const index = store.contactUnHandleNoticeIds.findIndex((id) => id === props.noticeListItem.id)
          if (index !== -1) {
            store.contactUnHandleNoticeIds.splice(index, 1)
          }
          if (props.noticeListItem.type === 'add') {
            ElMessage.success(TIP_TYPE.REFUSE_AGREE_ADD_GROUP_SUCCESS)
          } else {
            ElMessage.success(TIP_TYPE.REFSE_GROUP_SUCCESS)
          }
        } else {
          if (props.noticeListItem.type === 'add') {
            ElMessage.error(TIP_TYPE.REFUSE_AGREE_ADD_GROUP_FAIL)
          } else {
            ElMessage.error(TIP_TYPE.REFUSE_GROUP_FAIL)
          }
        }
      }
    }
  }

  // 监听同意添加联系人
  const listenAgreeAddContact = async () => {
    const { data } = await agreeAddContact({
      noticeId: props.noticeListItem.id,
      friendGroupId: chooseGroup.value,
      remarks: reamrks.value,
    })
    if (data) {
      agreeNotice(props.noticeListItem.id)
      // 未处理通知-1
      const index = store.contactUnHandleNoticeIds.findIndex((id) => id === props.noticeListItem.id)
      if (index !== -1) {
        store.contactUnHandleNoticeIds.splice(index, 1)
      }
      ElMessage.success(TIP_TYPE.ADD_CONTACT_SUCCESS)
      // 通知对方更新联系人列表
      websocket.send('updateContactList', {
        userId: props.noticeListItem.fromId,
      })
      // 更新联系人列表
      await updateContactList()
    } else {
      ElMessage.error(TIP_TYPE.ADD_CONTACT_FAIL)
    }
    agreeAddVisible.value = false
  }
</script>

<style scoped lang="less">
  .notice-list-item-container {
    width: 100%;
    margin-bottom: 20px;
    .notice-list-item-time {
      width: 100%;
      text-align: center;
      padding: 20px 0;
      box-sizing: border-box;
    }
    .notice-list-item-main {
      width: 100%;
      border: 1px solid var(--border-color);
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      .avatar {
        width: 50px;
      }
      .desc {
        flex: 1;
        height: 70px;
        padding: 0 15px;
        box-sizing: border-box;
        .info {
          height: 50px;
          line-height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .source-target {
            width: 100%;
            height: 25px;
            line-height: 25px;
            .source {
              color: var(--notice-source-color);
              font-weight: bold;
              margin-right: 5px;
            }
            .tip {
              font-weight: bold;
              margin-right: 5px;
            }
            .target {
              color: var(--notice-source-color);
              font-weight: bold;
            }
          }
          .signature {
            width: 100%;
            height: 25px;
            line-height: 25px;
            font-size: var(--small-desc-size);
            color: var(--desc-color);
          }
        }
        .message {
          height: 20px;
          line-height: 20px;
          color: var(--desc-color);
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .op {
        width: 80px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .op-item {
          display: flex;
          .icon {
            margin-left: 10px;
            font-size: 16px;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .agree-apply-info {
      .agree-apply-contact {
        display: flex;
        margin-bottom: 20px;
        .info {
          height: 40px;
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .name {
            height: 20px;
            line-height: 20px;
            font-weight: bold;
          }
          .signature {
            height: 20px;
            line-height: 20px;
            font-size: var(--small-desc-size);
            color: var(--desc-color);
          }
        }
      }
      .agree-apply-tip {
        margin-bottom: 20px;
        .fromName {
          color: var(--notice-source-color);
        }
      }
      .agree-apply-group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .agree-apply-remarks {
        display: flex;
        align-items: center;
      }
    }
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px 20px;
  }
  :deep(.el-button) {
    margin-left: 10px !important;
  }
</style>
