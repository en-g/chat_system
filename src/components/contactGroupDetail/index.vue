<template>
  <div class="contact-group-detail-container">
    <el-drawer v-model="drawerVisible" :modal="false" :show-close="false" :with-header="false" direction="rtl">
      <ContactDetail v-if="props.type === 'friend'" :user-id="props.id" @back="listenHideSetting" />
      <GroupDetail v-else :group-id="props.id" @back="listenHideSetting" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import ContactDetail from './contactDetail.vue'
  import GroupDetail from './groupDetail.vue'

  const props = defineProps<{
    id: number
    type: string
    visible: boolean
  }>()
  const emit = defineEmits(['hide'])

  const drawerVisible = ref<boolean>(false)

  const listenHideSetting = () => {
    emit('hide')
  }

  watch(
    () => props.visible,
    () => {
      drawerVisible.value = props.visible
    },
    { immediate: true }
  )
</script>

<style scoped lang="less">
  :deep(.el-drawer) {
    height: calc(100vh - 60px) !important;
    top: 60px !important;
  }
  :deep(.el-drawer__body) {
    padding: 0;
  }
</style>
