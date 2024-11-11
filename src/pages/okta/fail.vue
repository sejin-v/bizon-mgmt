<script setup lang="ts">
const handleClick = () => {
  window.location.href = 'https://lguplus.okta.com/app/UserHome';
};
</script>

<template>
  <div class="w-full h-full flex justify-center items-center flex-col">
    <h1 class="text-2xl">서버에서 일시적인 오류가 발생했습니다.</h1>
    <button
      type="button"
      class="btn__line--primary-md mt-10"
      @click="handleClick"
    >
      OKTA페이지 이동
    </button>
  </div>
</template>

<route lang="yaml">
meta:
  layout: empty
</route>
