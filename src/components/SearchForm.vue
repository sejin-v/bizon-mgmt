<script setup lang="ts">
interface Props {
  searchText?: string
  clearText?: string
  useClear: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchText: '검색',
  clearText: '초기화',
})

const emit = defineEmits(['clear', 'search'])
</script>

<template>
  <div class="search-form">
    <div class="search-form__item-area">
      <slot />
    </div>
    <div class="search-form__btn-area">
      <button type="button" class="btn__full--primary-md" @click="emit('search')">
        <icon name="search__line--fff" width="24" height="24" alt="" aria-hidden="true" />
        {{ props.searchText }}
      </button>
      <button v-if="useClear" type="button" class="btn__line--primary-md" @click="emit('clear')">
        <icon name="reset__line--855" width="24" height="24" alt="" aria-hidden="true" />
        {{ props.clearText }}
      </button>
      <slot name="search-form__btn" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
