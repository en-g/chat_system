<template>
  <div class="test-container">
    <div class="test-upload-file">
      <h1>文件上传</h1>
      <el-upload
        class="uplaod"
        :show-file-list="false"
        :auto-upload="false"
        :on-success="handleAvatarSuccess"
        :on-change="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="icon">
          <Plus />
        </el-icon>
      </el-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadFile } from 'element-plus'
  import fileUpload from '@/utils/fileUpload'

  const imageUrl = ref<string>('')

  const handleAvatarSuccess = (response: any, uploadFile: UploadFile) => {
    console.log('success', response, uploadFile)
  }

  const beforeAvatarUpload = async (uploadFile: UploadFile) => {
    const res = await fileUpload.singleFileUpload('defaultGroupAvatar', uploadFile.raw)
    console.log(res)
  }
</script>

<style scoped lang="less">
  .test-container {
    width: 100vw;
    height: 100vh;
    .test-upload-file {
      width: 300px;
      height: 300px;
      .uplaod {
        width: 100%;
        height: 100%;
        .avatar {
          width: 100%;
          height: 100%;
        }
        .icon {
          width: 100%;
          height: 100%;
          font-size: 300px;
        }
      }
    }
  }
</style>
