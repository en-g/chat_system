<template>
  <div class="navbar-container">
    <div class="navbar-list">
      <div v-for="(item, index) in navbarDefaultList" :key="index" class="navbar-list-item">
        <svg class="icon" aria-hidden="true" @click="listenClickNavigationLink(index)">
          <use :xlink:href="index === currentActive ? navbarActiveList[index] : navbarDefaultList[index]"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()
  // 默认图标列表
  const navbarDefaultList: string[] = ['#icon-message', '#icon-contacts', '#icon-pyq', '#icon-life']
  // 激活图标列表
  const navbarActiveList: string[] = [
    '#icon-message-active',
    '#icon-contacts-active',
    '#icon-pyq-active',
    '#icon-life-active',
  ]
  // 当前激活的图标 ID
  const currentActive = ref<number>(
    navbarDefaultList.findIndex((item: string) => item.includes(route.path.split('/')[1]))
  )

  // 点击跳转图标链接
  const listenClickNavigationLink = (index: number) => {
    currentActive.value = index
    router.replace(`/${navbarDefaultList[index].split('-')[1]}`)
  }

  // 监听路由改变
  watch(
    () => route.path,
    () => {
      currentActive.value = navbarDefaultList.findIndex((item: string) => item.includes(route.path.split('/')[1]))
    }
  )
</script>

<style scoped lang="less">
  .navbar-container {
    .navbar-list {
      display: flex;
      &-item {
        padding: 0 15px;
      }
    }
  }
</style>
