<script setup lang="ts">
const icons = [
  { fileName: 'logo-lg--fff' },
  { fileName: 'logo-bizon--fff' },
  { fileName: 'logout__line--fff' },
  { fileName: 'check__line--fff' },
  { fileName: 'search__line--fff' },
  { fileName: 'reset__line--855' },
  { fileName: 'caution__full--e22' },
  { fileName: 'delete__circle--7f8' },
  { fileName: 'arrow-b__line--7f8' },
  { fileName: 'arrow-l__line--525' },
  { fileName: 'arrow-l__line--d2d' },
  { fileName: 'd-arrow-l__line--525' },
  { fileName: 'close__line--181' },
  { fileName: 'nodata--7f8' },
  { fileName: 'download__line--855' },
  { fileName: 'triangle__full--525' },
  { fileName: 'calendar__line--dce' },
  { fileName: 'calendar__line--a38' },
]
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
      font-weight: 500;
      min-height: 60px;
      padding: 5px;
      border-top: 1px solid #c7c7c7;
      word-break: break-all;
    }
  }
}
</style>
