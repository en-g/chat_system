<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <Header />
    </el-header>
    <el-main class="layout-main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import Header from './Header.vue'
</script>

<style scoped lang="less">
  .layout-container {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    .layout-header {
      width: 100%;
      height: 60px;
    }
    .layout-main {
      width: 100%;
      height: calc(100vh - 60px);
      overflow: hidden;
    }
  }
</style>
