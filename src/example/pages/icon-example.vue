<script setup lang="ts">
const icons = [{ fileName: 'logo-lg--fff' }, { fileName: 'logout__line--fff' }, { fileName: 'check__line--fff' }]
</script>

<template>
  <div class="p-20">
    <h2 class="text-3xl font-semibold">icon list</h2>
    <ul class="flex flex-wrap gap-5 my-10">
      <li v-for="ic in icons" :key="`pages-${ic.fileName}`" class="example__icon">
        <div class="example__icon-image">
          <icon :name="`${ic.fileName}`" width="100" height="100" class="p-2" />
        </div>
        <div class="example__icon-name">
          <span>
            {{ ic.fileName }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.example {
  &__icon {
    overflow: hidden;
    width: 140px;
    border: 1px solid #c7c7c7;
    border-radius: 10px;

    &-image {
      @apply flex items-center justify-center;
      width: 100%;
      padding: 10px;
      background: #075617;
    }

    &-name {
      @apply flex items-center justify-center;
      @include font($font-weight: 500);
      min-height: 60px;
      padding: 5px;
      border-top: 1px solid #c7c7c7;
      word-break: break-all;
    }
  }
}
</style>
