<script setup lang="ts">
interface Props {
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
})
</script>

<template>
  <div class="search-form__item">
    <label v-if="label" class="search-form__label">{{ props.label }}</label>
    <slot />
  </div>
</template>
