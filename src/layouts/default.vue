<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <main class="layout">
    <layout-header :key="route.fullPath" />
    <div class="content">
      <router-view />
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
