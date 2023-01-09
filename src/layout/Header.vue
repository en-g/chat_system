<template>
  <div class="header-container">
    <div class="header-search-add">
      <div class="header-search-input">
        <SearchInput />
      </div>
      <div class="header-add">
        <AddOperation />
      </div>
    </div>
    <div class="header-navigation">
      <Navbar />
    </div>
    <div class="header-info">
      <PersonalAvatar />
    </div>
  </div>
</template>

<script setup lang="ts">
  import SearchInput from '@/components/searchInput/index.vue'
  import AddOperation from '@/components/addOperation/index.vue'
  import Navbar from '@/components/navbar/index.vue'
  import PersonalAvatar from '@/components/personalAvatar/index.vue'
</script>

<style scoped lang="less">
  .header-container {
    width: 100%;
    height: 100%;
    background-color: var(--header-background-color);
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .header-search-add {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      .header-search-input {
        margin-right: 10px;
      }
      .header-add {
      }
    }
    .header-navigation {
      flex: 4;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .header-info {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
</style>
