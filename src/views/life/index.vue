<template>
  <div class="life-container">
    <div class="life-ascription">
      <div class="life-current" @click="listenNavigateTolife">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="id === store.user_id ? '#icon-current-view' : '#icon-current-view-active'"></use>
        </svg>
        <span :class="{ active: id !== store.user_id }">生活圈</span>
      </div>
      <div class="life-mine" @click="listenNavigateToMylife">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="id === store.user_id ? '#icon-mine-active' : '#icon-mine'"></use>
        </svg>
        <span :class="{ active: id === store.user_id }">我的生活圈</span>
      </div>
    </div>
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
    <div class="life-release">
      <svg v-show="id === store.user_id || id === -1" class="icon" aria-hidden="true">
        <use xlink:href="#icon-release"></use>
      </svg>
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
  import { LifeTidingsType } from '@/types/life'

  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const storage = sessionStorage(`${store.user_id}`)

  const isRelease = ref<boolean>(false) // 标记是否显示发布动态
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

  // 获取要查看的用户的 ID
  const id = computed(() => {
    if (route.query.id) {
      return parseInt(route.query.id as string)
    }
    return -1
  })

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
    .life-ascription {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .life-current,
      .life-mine {
        width: fit-content;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
        margin-right: 10px;
        font-weight: bold;
        color: #515151;
        cursor: pointer;
        .active {
          color: var(--nav-active-color);
        }
      }
    }
    .life-main {
      // width: 50%;
      width: 768px;
      height: calc(100vh - 60px);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
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
    .life-release {
      flex: 1;
      .icon {
        margin-left: 10px;
        margin-top: 10px;
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
</style>
