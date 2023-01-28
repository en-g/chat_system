<template>
  <div class="search-input-container">
    <el-input v-model="keywords" placeholder="搜索联系人/群组">
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'

  // 查询关键字
  const keywords = ref<string>('')
</script>

<style scoped lang="less">
  :deep(.el-input__wrapper) {
    height: 30px;
    border-radius: 15px;
  }
</style>
