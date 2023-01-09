<template>
  <suspense>
    <template #default>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </template>
    <template #fallback>
      <div></div>
    </template>
  </suspense>
</template>

<script setup lang="ts"></script>

<style></style>
