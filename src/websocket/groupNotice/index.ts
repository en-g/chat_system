import { getGroupInfo } from '@/api/contacts'
import useStore from '@/store'
import { GetGroupInfoType } from '@/types/contacts'
import { sessionStorage } from '@/utils/storage'
import { formateTime } from '@/utils/utils'

// 添加群聊通知
const onAddGroupNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.groupUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.groupUnHandleNoticeIds.push(notice.id)
  }
}

// 创建群聊通知
const onCreateGroupNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.groupUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.groupUnHandleNoticeIds.push(notice.id)
  }
  // 更新群聊列表
  store.isUpdateGroupList = true
}

// 被邀请加入群聊通知
const onInviteGroupNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.groupUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.groupUnHandleNoticeIds.push(notice.id)
  }
}

// 退出群聊通知
const onExitGroupNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.groupUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.groupUnHandleNoticeIds.push(notice.id)
  }
}

// 解散群聊通知
const onDismissGroupNotice = (notice: any) => {
  const store = useStore()
  // 添加未处理通知
  const id = store.groupUnHandleNoticeIds.find((id) => id === notice.id)
  if (!id) {
    store.groupUnHandleNoticeIds.push(notice.id)
  }
}

// 更新群聊列表
const onUpdateGroupList = async () => {
  const store = useStore()
  store.isUpdateGroupList = true
}

// 更新群聊信息
const onUpdateGroupInfo = async (id: { groupId: number }) => {
  console.log('更新群聊信息', id)
  await updateGroupInfo(id.groupId)
}

// 更新群聊信息
const updateGroupInfo = async (groupId: number) => {
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)
  const groupsInfo = storage.get('groupsInfo') || []
  const index = groupsInfo.findIndex((item: any) => item.id === groupId)
  if (index === -1) return
  const ids: GetGroupInfoType = {
    userId: store.user_id,
    groupId: groupId,
  }
  const { data } = await getGroupInfo(ids)
  data.createTime = formateTime(data.createTime, 1)
  groupsInfo.splice(index, 1, data)
  storage.set('groupsInfo', groupsInfo)
}

export {
  onAddGroupNotice,
  onUpdateGroupList,
  onCreateGroupNotice,
  onExitGroupNotice,
  onDismissGroupNotice,
  onInviteGroupNotice,
  onUpdateGroupInfo,
}
