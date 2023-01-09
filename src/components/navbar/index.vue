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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const currentActive = ref<number>(0)
  const navbarDefaultList: string[] = ['#icon-message', '#icon-contacts', '#icon-pyq', '#icon-life']
  const navbarActiveList: string[] = [
    '#icon-message-active',
    '#icon-contacts-active',
    '#icon-pyq-active',
    '#icon-life-active',
  ]

  const listenClickNavigationLink = (index: number) => {
    currentActive.value = index
    router.push(`${navbarDefaultList[index].split('-')[1]}`)
  }
</script>

<style scoped lang="less">
  .navbar-container {
    .navbar-list {
      display: flex;
      &-item {
        padding: 10px 15px;
      }
    }
  }
</style>
