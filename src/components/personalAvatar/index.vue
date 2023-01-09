<template>
  <div class="personal-avatar-container">
    <el-avatar class="personal-avatar" :size="45" :src="avatarUrl" />
  </div>
</template>

<script setup lang="ts">
  const avatarUrl = 'https://img0.baidu.com/it/u=2043872740,4219194252&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
</script>

<style scoped lang="less">
  .personal-avatar-container {
    .personal-avatar {
      cursor: pointer;
    }
  }
</style>
