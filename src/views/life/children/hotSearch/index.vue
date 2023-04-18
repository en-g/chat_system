<template>
  <div class="hot-search-container">
    <el-card>
      <div class="hot-search-wrapper">
        <div class="hot-search-title">热门动态</div>
        <div class="hot-search-list">
          <div
            v-for="(item, index) in props.hotTidingsList"
            :key="item.id"
            class="hot-search-item"
            @click="listenNavigateToLifeDetail(item.id)"
          >
            <div class="ranking">{{ index + 1 }}</div>
            <div class="title">{{ item.title }}</div>
            <div class="read">{{ item.read }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { HotTidingsListItemType } from '@/types/life'

  const props = defineProps<{
    hotTidingsList: HotTidingsListItemType[]
  }>()

  // 跳转到动态详情
  const listenNavigateToLifeDetail = (id: number) => {
    console.log(id)
  }
</script>

<style scoped lang="less">
  .hot-search-container {
    width: 100%;
    .hot-search-wrapper {
      .hot-search-title {
        font-size: var(--title-font-size);
        font-weight: bold;
        margin-bottom: 10px;
      }
      .hot-search-list {
        .hot-search-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          box-sizing: border-boxs;
          .ranking {
            width: 20px;
            font-size: var(--middle-font-size);
            color: #ff8200;
            text-align: center;
            margin-right: 10px;
          }
          .title {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: var(--middle-font-size);
            &:hover {
              cursor: pointer;
              text-decoration: underline;
            }
          }
          .read {
            width: 40px;
            text-align: right;
            margin-left: 10px;
            font-size: var(--small-font-size);
            color: var(--desc-color);
          }
        }
      }
    }
  }
</style>
