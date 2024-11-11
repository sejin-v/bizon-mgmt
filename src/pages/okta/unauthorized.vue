<script setup lang="ts">
const handleClick = () => {
  window.location.href = 'https://lguplus.okta.com/app/UserHome';
};
</script>

<template>
  <div class="w-full h-full flex justify-center items-center flex-col">
    <h1 class="text-2xl">등록되지 않은 관리자입니다.</h1>
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
