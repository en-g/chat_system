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
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-send-message"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item pyq">
          <el-tooltip content="朋友圈" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-show-pyq"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item life">
          <el-tooltip content="生活圈" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-show-life"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item video">
          <el-tooltip content="视频通话" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-video"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item delete">
          <el-tooltip content="删除好友" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-delete"></use>
            </svg>
          </el-tooltip>
        </div>
      </div>
      <div v-else class="info-show-interaction-group">
        <div class="item message">
          <el-tooltip content="发送消息" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-send-message"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item message">
          <el-tooltip content="退出群聊" placement="top">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-out"></use>
            </svg>
          </el-tooltip>
        </div>
        <div class="item message">
          <el-tooltip content="解散群聊" placement="top">
            <svg class="icon" aria-hidden="true">
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
  import { useRoute } from 'vue-router'
  import { getFriendInfo, getGroupInfo } from '@/api/contacts'
  import { GetContactsInfoType, GetGroupInfoType } from '@/types/contacts'
  import useStore from '@/store/index'
  import { sessionStorage } from '@/utils/storage'

  const route = useRoute()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const id = computed((): number => {
    return parseInt(route.query.id as string)
  })
  const isEdit = ref<boolean>(false)
  const type = computed((): string => {
    return route.query.type as string
  })

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
    data.birthday = data.birthday.split('T')[0]
    contactsInfo.push(data)
    storage.set('contactsInfo', contactsInfo)
    return data
  }

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
    data.createTime = data.createTime.split('T')[0]
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

  watch([type, id], async () => {
    info.value = await getInfo()
  })

  const listenEditRemarks = () => {
    isEdit.value = true
  }

  const listenConfirmEdit = () => {
    isEdit.value = false
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
            line-height: 15px;
            -webkit-line-clamp: 2;
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
        width: 200px;
      }
      .info-show-desc-friend .title {
        width: 26px;
        margin-right: 20px;
      }
      .info-show-desc-group .info-show-desc-item {
        width: 250px;
      }
      .info-show-desc-group .content {
        max-width: 155px;
      }
      .info-show-desc-group .title {
        width: 65px;
        margin-right: 20px;
      }
    }
  }
  .el-input {
    width: 130px !important;
  }
</style>
