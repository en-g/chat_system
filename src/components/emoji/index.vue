<template>
  <el-popover placement="top-start" :width="286" trigger="click">
    <div class="picker_container">
      <el-scrollbar height="286px">
        <div v-for="category in categories" :key="`category_${category}`" class="category">
          <span>{{ category }}</span>
          <div class="emojis_container">
            <button
              v-for="(emoji, index) in category_emojis(category)"
              :key="`emoji_${index}`"
              @click="listenClickEmoji(emoji)"
            >
              <div class="emoji">{{ emoji }}</div>
            </button>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <template #reference>
      <slot></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import data from './emojis-data.json'

  const emit = defineEmits(['emoji'])

  const categories = computed(() => {
    return Object.keys(data)
  })

  const category_emojis = computed(() => {
    return (category: any) => {
      return Object.values((<any>data)[category])
    }
  })

  const listenClickEmoji = (emoji: any) => {
    emit('emoji', emoji)
  }
</script>

<style scoped lang="less">
  .emoji_picker,
  .picker_container {
    border-radius: 0.5rem;
    background: white;
  }

  .picker_container {
    position: relative;
    overflow: auto;
    z-index: 1;
  }

  .category {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    color: rgb(169, 169, 169);
  }

  .emojis_container {
    display: flex;
    flex-wrap: wrap;
    .emoji {
      width: 26px;
      height: 26px;
      cursor: pointer;
    }
  }

  .category button {
    margin: 0.5rem;
    margin-left: 0;
    background: inherit;
    border: none;
    font-size: 1.5rem;
    padding: 0;
  }

  .bottom_arrow {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0.75rem;
    height: 0.75rem;
    transform: translate(-50%, 50%) rotate(45deg);
    background: white;
  }
</style>
