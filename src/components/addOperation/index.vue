<template>
  <div>
    <div class="add-operation-container">
      <el-icon @click="listenShowAddMenu"><Plus color="#1aadf9" /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Plus } from '@element-plus/icons-vue'

  const listenShowAddMenu = () => {
    console.log('显示添加操作菜单')
  }
</script>

<style scoped lang="less">
  .add-operation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
    &:hover {
      background-color: var(--mouse-hover-active);
    }
  }
</style>
