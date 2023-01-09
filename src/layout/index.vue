<template>
  <el-container class="layout-container">
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
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
  }
</style>
