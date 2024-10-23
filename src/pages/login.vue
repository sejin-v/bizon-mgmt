<script setup lang="ts">
const router = useRouter();

const id = ref('admin_abacus');

const handleLogin = async () => {
  const data = {
    info1: id.value,
  };
  await request.post('/bizon/mgmt/api/account/login', {
    ...data,
  });
  router.push('/');
};

onMounted(() => {
  // handleLogin();
  // router.push('/');
});
</script>

<template>
  <div>
    <div class="search-form__item">
      <label class="search-form__label">임시 로그인</label>
    </div>
    <div class="w-80 flex flex-row">
      <CustomInput v-model="id"></CustomInput>
      <button
        type="button"
        class="btn__line--primary-md ml-4"
        @click="handleLogin"
      >
        로그인
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
