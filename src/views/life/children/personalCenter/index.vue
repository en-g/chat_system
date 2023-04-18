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
            <div class="num">{{ props.personalCenterInfo.like }}</div>
          </div>
          <div class="item">
            <div class="label">获评数</div>
            <div class="num">{{ props.personalCenterInfo.comment }}</div>
          </div>
          <div class="item">
            <div class="label">粉丝数</div>
            <div class="num">{{ props.personalCenterInfo.fans }}</div>
          </div>
        </div>
        <div class="personal-center-statistics">
          <div class="item">
            <div class="icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dongtai"></use>
              </svg>
            </div>
            <div class="label">动态</div>
          </div>
          <div class="item">
            <div class="icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucang"></use>
              </svg>
            </div>
            <div class="label">收藏</div>
          </div>
          <div class="item">
            <div class="icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiaoxi"></use>
              </svg>
            </div>
            <div class="label">消息</div>
          </div>
        </div>
        <div v-if="props.personalCenterInfo.userId !== store.user_id" class="personal-center-regard">
          <el-button v-show="props.personalCenterInfo.isRegard" class="button" type="primary" @click="listenRegard">
            关注
          </el-button>
          <el-button v-show="!props.personalCenterInfo.isRegard" class="button" type="info" @click="listenRegard">
            已关注
          </el-button>
        </div>
        <div v-else class="personal-center-regard-list">
          <el-button class="button">关注列表</el-button>
        </div>
        <div v-if="props.personalCenterInfo.userId === store.user_id" class="personal-center-release">
          <el-button class="button" type="primary" @click="listenrelease"> 发布动态 </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { PersonalCenterInfoType } from '@/types/life'
  import { reactive } from 'vue'
  import useStore from '@/store'

  const store = useStore()
  const emit = defineEmits(['release', 'regard'])
  const props = defineProps<{
    personalCenterInfo: PersonalCenterInfoType
  }>()

  // 关注
  const listenRegard = () => {
    emit('regard', props.personalCenterInfo.isRegard === 1)
  }

  // 发布动态
  const listenrelease = () => {
    emit('release')
  }
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
        margin-bottom: 20px;
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
      .personal-center-release {
        .button {
          width: 100%;
        }
      }
    }
  }
</style>
