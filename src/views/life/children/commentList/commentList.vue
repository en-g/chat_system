<template>
  <div class="comment-list-container">
    <div v-for="item in props.commentList" :key="item.id" class="comment-list-item">
      <CommentListItem :comment="item" :life-tiding-id="props.lifeTidingId" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LifeTidingDetailCommentType } from '@/types/life'
  import CommentListItem from './commentListItem.vue'

  const props = defineProps<{
    commentList: LifeTidingDetailCommentType[]
    lifeTidingId: number
  }>()
</script>

<style scoped></style>
