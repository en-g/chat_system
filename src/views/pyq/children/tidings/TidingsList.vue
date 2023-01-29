<template>
  <div class="tidings-list-container">
    <el-scrollbar class="tidings-list-scroll">
      <div v-for="item in props.tidingsList" :key="item.id" class="tidings-list-item">
        <TidingsListItem :tidings-info="item" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { PyqTidingsType } from '@/types/pyq'
  import TidingsListItem from './TidingsListItem.vue'

  const props = defineProps<{
    tidingsList: Array<PyqTidingsType>
  }>()
</script>

<style scoped lang="less">
  .tidings-list-container {
    width: 100%;
    height: 100%;
    .tidings-list-scroll {
      width: 100%;
      height: 100%;
      .tidings-list-item {
      }
    }
  }
</style>
