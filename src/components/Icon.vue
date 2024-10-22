<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
  },
  extension: {
    type: String,
    default: 'svg',
    required: false,
  },
  alt: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
})
const imageSrc = computed(() => {
  return `/icon/${props.name}.${props.extension}`
})
const ariaHidden = computed(() => !props.alt || props.alt.trim() === '')
</script>

<template>
  <img :src="imageSrc" class="cm-icon" :alt="alt" :aria-hidden="ariaHidden ? 'true' : null" :style="`width: ${width}px; height: ${height}px;`" />
</template>
