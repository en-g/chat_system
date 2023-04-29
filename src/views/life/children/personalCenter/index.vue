<template>
  <div class="personal-center-container">
    <el-card>
      <div class="personal-center-wrapper">
        <div class="personal-center-avatar">
          <el-avatar :size="70" :src="props.personalCenterInfo.avatarUrl" />
        </div>
        <div class="personal-center-name">{{ props.personalCenterInfo.name }}</div>
        <div class="personal-center-data">
          <div class="item">
            <div class="label">获赞数</div>
            <div class="num">{{ props.personalCenterInfo.likes }}</div>
          </div>
          <div class="item">
            <div class="label">获评数</div>
            <div class="num">{{ props.personalCenterInfo.comments }}</div>
          </div>
          <div class="item">
            <div class="label">粉丝数</div>
            <div class="num">{{ props.personalCenterInfo.fans }}</div>
          </div>
        </div>
        <div v-if="props.personalCenterInfo.userId === store.user_id" class="personal-center-statistics">
          <div class="item">
            <div class="icon">
              <svg class="icon" aria-hidden="true" @click="listenShowSelfTidingsList">
                <use xlink:href="#icon-dongtai"></use>
              </svg>
            </div>
            <div class="label">动态</div>
          </div>
          <div class="item">
            <el-popover class="popover-wrapper" placement="right-start" :width="250" trigger="click">
              <el-scrollbar class="collection-popover-scrollbar">
                <div class="popover-content">
                  <div
                    v-for="item in collectionList"
                    :key="item.id"
                    class="collection-item"
                    @click="listenShowTidingDetail(item.lifeTidingsId)"
                  >
                    <div class="info">
                      <div class="avatar">
                        <el-avatar :size="30" :src="item.avatarUrl" />
                      </div>
                      <div class="name">{{ item.name }}</div>
                    </div>
                    <div class="title">
                      【<span class="content">{{ item.title }}</span
                      >】
                    </div>
                  </div>
                </div>
              </el-scrollbar>
              <template #reference>
                <div class="icon">
                  <svg class="icon" aria-hidden="true" @click="listenShowRegardList">
                    <use xlink:href="#icon-shoucang"></use>
                  </svg>
                </div>
              </template>
            </el-popover>
            <div class="label">收藏</div>
          </div>
          <el-badge :value="store.lifeMessagesCount" :hidden="store.lifeMessagesCount === 0" :max="99">
            <div class="item">
              <div class="icon">
                <el-popover class="popover-wrapper" placement="right-start" :width="250" trigger="click">
                  <el-scrollbar class="message-popover-scrollbar">
                    <div v-if="messageList.length > 0" class="popover-content">
                      <div v-for="item in messageList" :key="item.id" class="message-item">
                        <div class="time">{{ formateTime(item.createTime, 1) }}</div>
                        <div class="info">
                          <div class="avatar">
                            <el-avatar :size="30" :src="item.fromAvatarUrl" />
                          </div>
                          <div class="name">{{ item.fromName }}</div>
                          <div v-if="item.type === 1" class="active">评论了你</div>
                          <div v-else-if="item.type === 2" class="active">回复了你</div>
                          <div v-else-if="item.type === 3" class="active">关注了你</div>
                        </div>
                        <div v-if="item.title" class="title">
                          【{{ item.title }}】
                          <span class="content" @click="listenShowTidingDetail(item.lifeTidingId as number)">{{
                            item.content
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="content-null">暂无消息</div>
                  </el-scrollbar>
                  <template #reference>
                    <div class="icon">
                      <svg class="icon" aria-hidden="true" @click="listenShowMessageList">
                        <use xlink:href="#icon-xiaoxi"></use>
                      </svg>
                    </div>
                  </template>
                </el-popover>
              </div>
              <div class="label">消息</div>
            </div>
          </el-badge>
        </div>
        <div v-if="props.personalCenterInfo.userId !== store.user_id" class="personal-center-regard">
          <el-button
            v-show="props.personalCenterInfo.isRegard === 0"
            class="button"
            type="primary"
            @click="listenRegard"
          >
            关注
          </el-button>
          <el-button v-show="props.personalCenterInfo.isRegard === 1" class="button" type="info" @click="listenRegard">
            已关注
          </el-button>
        </div>
        <div v-if="props.personalCenterInfo.userId === store.user_id" class="personal-center-regard-list">
          <el-popover class="popover-wrapper" placement="right" :width="250" trigger="click">
            <el-scrollbar class="regard-popover-scrollbar">
              <div class="popover-content">
                <div
                  v-for="item in regardList"
                  :key="item.userId"
                  class="regard-item"
                  @click="listenNavigateToUserLife(item.userId)"
                >
                  <div class="avatar">
                    <el-avatar :size="40" :src="item.avatarUrl" />
                  </div>
                  <div class="desc">
                    <div class="name">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <template #reference>
              <el-button class="button" @click="listenGetRegardsList">关注列表</el-button>
            </template>
          </el-popover>
        </div>
        <div v-if="props.personalCenterInfo.userId === store.user_id" class="personal-center-regard-list">
          <el-popover class="popover-wrapper" placement="right" :width="250" trigger="click">
            <el-scrollbar class="regard-popover-scrollbar">
              <div class="popover-content">
                <div
                  v-for="item in fansList"
                  :key="item.userId"
                  class="regard-item"
                  @click="listenNavigateToUserLife(item.userId)"
                >
                  <div class="avatar">
                    <el-avatar :size="40" :src="item.avatarUrl" />
                  </div>
                  <div class="desc">
                    <div class="name">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <template #reference>
              <el-button class="button" @click="listenGetFansList">粉丝列表</el-button>
            </template>
          </el-popover>
        </div>
        <!-- <div v-if="props.personalCenterInfo.userId !== store.user_id" class="personal-center-add">
          <el-button v-if="props.personalCenterInfo.isAdd === 0" class="button">添加好友</el-button>
          <el-button v-else class="button" disabled>已添加</el-button>
        </div> -->
        <div v-if="props.personalCenterInfo.userId === store.user_id" class="personal-center-release">
          <el-button class="button" type="primary" @click="listenrelease"> 发布动态 </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import {
    PersonalCenterInfoCollectionsType,
    PersonalCenterInfoMessagesType,
    PersonalCenterInfoRegardsType,
    PersonalCenterInfoType,
  } from '@/types/life'
  import { onMounted, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import useStore from '@/store'
  import { getCollectionsList, getFansList, getMessagesList, getRegardsList } from '@/api/life'
  import websocket from '@/websocket'
  import { formateTime } from '@/utils/utils'

  const router = useRouter()
  const store = useStore()
  const emit = defineEmits(['release', 'regard', 'detail'])
  const props = defineProps<{
    personalCenterInfo: PersonalCenterInfoType
  }>()

  const regardList = reactive<PersonalCenterInfoRegardsType[]>([]) // 关注列表
  const fansList = reactive<PersonalCenterInfoRegardsType[]>([]) // 粉丝列表
  const messageList = reactive<PersonalCenterInfoMessagesType[]>([]) // 消息列表
  const collectionList = reactive<PersonalCenterInfoCollectionsType[]>([]) // 收藏列表

  // 获取关注列表
  const getRegardsListData = async () => {
    const { data } = await getRegardsList({
      userId: store.user_id,
    })
    regardList.splice(0, regardList.length, ...data)
  }

  // 获取粉丝列表
  const getFansListData = async () => {
    const { data } = await getFansList({
      userId: store.user_id,
    })
    fansList.splice(0, fansList.length, ...data)
  }

  // 获取消息列表
  const getMessagesListData = async () => {
    const { data } = await getMessagesList({
      userId: store.user_id,
    })
    messageList.splice(0, messageList.length, ...data)
  }

  // 获取收藏列表
  const getCollectionsListData = async () => {
    const { data } = await getCollectionsList({
      userId: store.user_id,
    })
    console.log(data)
    collectionList.splice(0, collectionList.length, ...data)
  }

  // 获取生活圈消息数
  const getLifeMessageCountData = async () => {
    await store.initLifeMessageCount()
  }
  await getLifeMessageCountData()

  // 监听获取关注列表
  const listenGetRegardsList = async () => {
    await getRegardsListData()
  }

  // 监听获取粉丝列表
  const listenGetFansList = async () => {
    await getFansListData()
  }

  // 查看收藏列表
  const listenShowRegardList = async () => {
    await getCollectionsListData()
  }

  // 查看消息列表
  const listenShowMessageList = async () => {
    await getMessagesListData()
    store.lifeMessagesCount = 0
  }

  // 查看个人动态
  const listenShowSelfTidingsList = () => {
    router.push({ name: 'life', query: { id: store.user_id } })
  }

  // 关注
  const listenRegard = () => {
    emit('regard', props.personalCenterInfo.isRegard === 1)
  }

  // 发布动态
  const listenrelease = () => {
    emit('release')
  }

  // 跳转到用户的生活圈
  const listenNavigateToUserLife = (id: number) => {
    router.push({ name: 'life', query: { id } })
  }

  // 查看动态详情
  const listenShowTidingDetail = (id: number) => {
    emit('detail', id)
  }

  onMounted(() => {
    websocket.listen('updateLifeMessageCount', () => {
      store.lifeMessagesCount += 1
    })
  })
</script>

<style scoped lang="less">
  .personal-center-container {
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    .personal-center-wrapper {
      width: 100%;
      height: 100%;
      .personal-center-avatar {
        display: flex;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        .avatar {
        }
      }
      .personal-center-name {
        width: 100%;
        text-align: center;
        font-weight: bold;
        font-size: var(--title-font-size);
        margin-bottom: 20px;
      }
      .personal-center-data {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        .item {
          .label {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .num {
            text-align: center;
            font-size: var(--small-desc-size);
            color: var(--desc-color);
          }
        }
      }
      .personal-center-statistics {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        .item {
          .icon {
            font-size: 20px;
            margin-bottom: 5px;
          }
          .label {
            text-align: center;
          }
        }
      }
      .personal-center-regard {
        margin-bottom: 10px;
        .button {
          width: 100%;
        }
      }
      .personal-center-regard-list {
        margin-bottom: 10px;
        .button {
          width: 100%;
        }
      }
      .personal-center-add {
        margin-bottom: 10px;
        .button {
          width: 100%;
        }
      }
      .personal-center-self-tiding {
        margin-bottom: 10px;
        .button {
          width: 100%;
        }
      }
      .personal-center-release {
        .button {
          width: 100%;
        }
      }
    }
  }
  .regard-popover-scrollbar {
    height: 400px;
    .regard-item {
      display: flex;
      align-items: center;
      padding: 5px;
      box-sizing: border-box;
      &:hover {
        cursor: pointer;
        background-color: var(--mouse-hover-active);
      }
      .avatar {
        margin-right: 10px;
      }
      .desc {
        height: 40px;
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
          font-size: 12px;
          color: rgba(0, 0, 0, 0.4);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .collection-popover-scrollbar {
    height: 400px;
    .collection-item {
      padding: 8px 5px;
      box-sizing: border-box;
      .info {
        height: 30px;
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .avatar {
          margin-right: 10px;
        }
        .name {
          height: 30px;
          line-height: 30px;
        }
      }
      .title {
        .content {
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
  }
  .message-popover-scrollbar {
    height: 400px;
    .message-item {
      padding: 5px;
      box-sizing: border-box;
      margin-bottom: 5px;
      .time {
        display: flex;
        justify-content: center;
        font-size: var(--small-desc-size);
        color: var(--desc-color);
        margin-bottom: 5px;
      }
      .title {
        margin-bottom: 5px;
        .content {
          color: #eb7340;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
      .info {
        display: flex;
        align-items: center;
        .avatar {
          width: 30px;
        }
        .name {
          margin: 0 10px;
          font-size: var(--middle-font-size);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .active {
          width: 75px;
          color: var(--notice-source-color);
        }
      }
    }
  }
  .content-null {
    font-size: var(--middle-font-size);
    color: var(--desc-color);
    display: flex;
    justify-content: center;
  }
</style>
