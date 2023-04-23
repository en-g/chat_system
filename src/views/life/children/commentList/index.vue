<template>
  <div class="comment-list-container">
    <div class="comment-list">
      <CommentList :comment-list="props.commentList" :life-tiding-id="props.lifeTidingId" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { LifeTidingDetailCommentType } from '@/types/life'
  import CommentList from './commentList.vue'

  const props = defineProps<{
    commentList: LifeTidingDetailCommentType[]
    lifeTidingId: number
  }>()
</script>

<style scoped></style>
