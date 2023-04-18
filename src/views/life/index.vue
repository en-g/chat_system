<template>
  <div class="life-container">
    <div class="life-personal-center">
      <PersonalCenter :personal-center-info="personalCenterInfo" @regard="listenRegard" @release="listenRelease" />
    </div>
    <div class="life-hot-search">
      <HotSearch :hot-tidings-list="hotTidingsList" />
    </div>
    <div class="life-content">
      <el-card class="life-navbar-card">
        <div class="life-navbar">
          <div class="navbar-item" :class="{ active: isNew }" @click="listenShowNewTidings">最新</div>
          <div class="navbar-item" :class="{ active: !isNew }" @click="listenShowHotTidings">热门</div>
        </div>
      </el-card>
      <el-card class="life-main-card">
        <div class="life-main">
          <el-scrollbar v-if="!!tidingsList.length" class="life-tidings-list-scroll">
            <div class="life-tidings-list">
              <Tidings :tidings-list="tidingsList" />
            </div>
            <div class="life-tidings-pagination">
              <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :page-sizes="[2, 5, 10]"
                :small="true"
                :background="true"
                layout="sizes, prev, pager, next"
                :total="total"
                @size-change="listenPaginationChange"
                @current-change="listenPaginationChange"
              />
            </div>
          </el-scrollbar>
          <div v-else class="tidings-null">TA目前暂未发布过动态</div>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="isRelease" title="发布动态" width="40%">
      <div class="life-release-main">
        <div class="life-release-input">
          <!-- <el-input
            v-model="tidingInfo.content"
            maxlength="200"
            :autosize="{ minRows: 3 }"
            placeholder="这一刻的想法......"
            show-word-limit
            type="textarea"
          /> -->
        </div>
        <div class="life-release-emoji">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-emoji"></use>
          </svg>
        </div>
        <div class="life-release-pictures">
          <!-- <el-upload
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            :on-change="listenPicturesChange"
            :on-remove="listenPicturesRemove"
            :on-preview="listenPicturesPreview"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="isPreview">
            <img w-full :src="previewUrl" alt="Preview Image" />
          </el-dialog> -->
        </div>
      </div>
      <template #footer>
        <span class="button">
          <!-- <el-button class="item" @click="listenCancleReleaseTiding"> 取消 </el-button> -->
          <!-- <el-button class="item" type="primary" @click="listenConfirmReleaseTiding"> 发布 </el-button> -->
        </span>
      </template>
    </el-dialog>
    <el-dialog id="detail" v-model="showDetailVisible" width="798px" :modal="false" :show-close="false" top="60px">
      动态详情
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, computed, watch, ref, provide } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Tidings from './children/tidings/index.vue'
  import useStore from '@/store'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps, UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'
  import { TIP_TYPE } from '@/config'
  import { sessionStorage } from '@/utils/storage'
  import { HotTidingsListItemType, LifeTidingsType, PersonalCenterInfoType } from '@/types/life'
  import PersonalCenter from './children/personalCenter/index.vue'
  import HotSearch from './children/hotSearch/index.vue'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const isRelease = ref<boolean>(false) // 标记是否显示发布动态
  const isNew = ref<boolean>(true) // 标记是否为最新动态
  const showDetailVisible = ref<boolean>(true) // 查看动态详情
  // // 待发布的动态信息
  // const tidingInfo = reactive<lifeTidingsInfoType>({
  //   userId: store.user_id,
  //   content: '',
  //   pictureIds: [],
  // })
  // const prePictureList = reactive<Array<{ uid: number; id: number }>>([]) // 动态可预览图片列表
  // const previewUrl = ref('') // 当前预览的图片 URL
  // const isPreview = ref(false) // 标记是否显示图片预览
  const pageNum = ref<number>(1) // 当前页数
  const pageSize = ref<number>(10) // 当前每页条数
  const total = ref<number>(0) // 朋友圈动态总条数
  const tidingsList = reactive<LifeTidingsType[]>([
    {
      id: 1,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      title: '测试',
      content:
        '开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈开始生活圈',
      createTime: '2023-02-09 14:52',
      isThumbsUp: 0,
      thumbsUpCount: 4561,
      commentsCount: 12345,
      pictures: [
        {
          id: 1,
          url: 'http://localhost:3000/public/pyq/9636c1d42d69cab5b40c49adbe5dcb49144734.jpg',
        },
        { id: 2, url: 'http://localhost:3000/public/pyq/9636c1d42d69cab5b40c49adbe5dcb49144734.jpg' },
      ],
      hotReview: { id: 1, content: '这功能开发得也太慢了吧', isThumbsUp: 1, thumbsUpCount: 1234 },
    },
    {
      id: 2,
      userId: 1,
      nickname: '小明战神',
      avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
      title: '测试',
      content: '开始生活圈',
      createTime: '2023-02-09 14:52',
      isThumbsUp: 0,
      thumbsUpCount: 4561,
      commentsCount: 12345,
      pictures: [
        {
          id: 1,
          url: 'http://localhost:3000/public/pyq/9636c1d42d69cab5b40c49adbe5dcb49144734.jpg',
        },
        { id: 2, url: 'http://localhost:3000/public/pyq/9636c1d42d69cab5b40c49adbe5dcb49144734.jpg' },
      ],
      hotReview: { id: 1, content: '这功能开发得也太慢了吧', isThumbsUp: 1, thumbsUpCount: 1234 },
    },
  ])
  // 个人中心信息
  const personalCenterInfo = reactive<PersonalCenterInfoType>({
    userId: 1,
    name: '小明',
    avatarUrl: 'http://localhost:3000/public/avatar/6cca5c0bf24c7e15ad056b26bce7da3a41858.webp',
    messages: [],
    regards: [],
    fans: 1234,
    like: 5621,
    comment: 4556,
    isRegard: 1,
  })
  // 热门动态列表
  const hotTidingsList = reactive<HotTidingsListItemType[]>([
    { id: 1, title: '成都大运会倒计时100天', read: 12345 },
    { id: 2, title: '成都大运会倒计时100天', read: 12345 },
    { id: 3, title: '成都大运会倒计时100天', read: 12345 },
    { id: 4, title: '成都大运会倒计时100天', read: 12345 },
    { id: 5, title: '成都大运会倒计时100天', read: 12345 },
    { id: 6, title: '成都大运会倒计时100天', read: 12345 },
    { id: 7, title: '成都大运会倒计时100天', read: 12345 },
    { id: 8, title: '成都大运会倒计时100天', read: 12345 },
    { id: 9, title: '成都大运会倒计时100天', read: 12345 },
    { id: 10, title: '成都大运会倒计时100天', read: 12345 },
  ])

  // 获取要查看的用户的 ID
  const id = computed(() => {
    if (route.query.id) {
      return parseInt(route.query.id as string)
    }
    return -1
  })

  // 点击关注
  const listenRegard = (isRegard: boolean) => {
    personalCenterInfo.isRegard = isRegard ? 0 : 1
  }

  // 发布动态
  const listenRelease = () => {
    isRelease.value = true
  }

  // 获取最新动态
  const listenShowNewTidings = () => {
    isNew.value = true
  }

  // 获取热门动态
  const listenShowHotTidings = () => {
    isNew.value = false
  }

  // 跳转到生活圈界面
  const listenNavigateTolife = () => {
    router.push({ name: 'life' })
  }

  // 跳转到我的生活圈界面
  const listenNavigateToMylife = () => {
    router.push({ name: 'life', query: { id: store.user_id } })
  }

  // 更新数据
  const listenPaginationChange = () => {
    console.log('change')
  }
</script>

<style scoped lang="less">
  .life-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: var(--theme-backgrond-color);
    .life-personal-center {
      width: 250px;
      position: fixed;
      top: 60px;
      left: 100px;
    }
    .life-hot-search {
      width: 300px;
      position: fixed;
      top: 60px;
      right: 50px;
    }
    .life-content {
      width: 798px;
      height: calc(100vh - 60px);
      .life-navbar-card {
        width: 100%;
        margin-bottom: 10px;
        .life-navbar {
          display: flex;
          align-items: center;
          .navbar-item {
            margin-right: 30px;
            font-size: var(--middle-font-size);
            cursor: pointer;
            &.active {
              color: var(--nav-active-color);
            }
          }
        }
      }
      .life-main-card {
        .life-main {
          // width: 50%;
          width: 100%;
          height: calc(100vh - 170px);
          // border-left: 1px solid var(--border-color);
          // border-right: 1px solid var(--border-color);
          .life-tidings-list-scroll {
            width: 100%;
            height: 100%;
            .life-tidings-list {
              width: 100%;
            }
            .life-tidings-pagination {
              width: 100%;
              padding: 40px 30px;
              box-sizing: border-box;
              display: flex;
              justify-content: flex-end;
            }
          }
          .tidings-null {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            margin-top: 10%;
            font-size: var(--life-null-font-size);
            color: var(--desc-color);
            font-family: '楷体';
          }
        }
      }
    }
    .life-release-main {
      padding: 10px 0;
      box-sizing: border-box;
      border: 1px solid var(--border-color);
      .life-release-input {
      }
      .life-release-emoji {
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
      }
      .life-release-pictures {
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
    .button {
      .item:nth-child(1) {
        margin-right: 20px;
      }
    }
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
  :deep(.el-textarea__inner, .el-textarea:focus, .el-textarea:active) {
    resize: none;
    box-shadow: none;
  }
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    border: none;
  }
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
  :deep(#detail .el-dialog__header) {
    display: none;
  }
  :deep(#detail.el-dialog) {
    border-radius: 4px !important;
  }
</style>
