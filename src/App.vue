<template>
  <suspense>
    <template #default>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </template>
    <template #fallback>
      <div></div>
    </template>
  </suspense>
</template>

<script setup lang="ts"></script>

<style></style>
