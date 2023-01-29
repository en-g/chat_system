<template>
  <div class="tidings-container">
    <div class="tidings-list">
      <TidingsList :tidings-list="props.tidingsList" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import TidingsList from './TidingsList.vue'
  import { PyqTidingsType } from '@/types/pyq'

  const props = defineProps<{
    tidingsList: Array<PyqTidingsType>
  }>()
</script>

<style scoped lang="less">
  .tidings-container {
    width: 100%;
    height: 100%;
    .tidings-list {
      width: 100%;
      height: 100%;
    }
  }
</style>
