<script setup lang="ts">
// import { useLogger } from 'vue-logger-plugin'

// const log = useLogger()
// const router = useRouter()
// onMounted(() => {
// log.info('on mounted', router.options.routes)
// })
const router = useRouter();
const moveMainScreen = async () => {
  try {
    await request.get('/bizon/mgmt/api/manager');
    router.push('/user');
  } catch (error) {}
};
moveMainScreen();
</script>

<template>
  <!-- <div>test</div> -->
</template>

<!-- <route lang="yaml">
name: landing
meta:
  isPublicPath: true
</route> -->
