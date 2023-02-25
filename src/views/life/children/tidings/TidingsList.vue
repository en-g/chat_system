<template>
  <div class="tidings-list-container">
    <div class="tidings-list">
      <div v-for="item in props.tidingsList" :key="item.id" class="tidings-list-item">
        <TidingsListItem :tidings-info="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LifeTidingsType } from '@/types/life'
  import TidingsListItem from './TidingsListItem.vue'

  const props = defineProps<{
    tidingsList: Array<LifeTidingsType>
  }>()
</script>

<style scoped lang="less">
  .tidings-list-container {
    width: 100%;
    height: 100%;
    .tidings-list {
      .tidings-list-item {
      }
    }
  }
</style>
