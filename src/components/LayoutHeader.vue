<script setup lang="ts">
interface IMenu {
  menuId: string;
  menuName: string;
}

const router = useRouter();
const route = useRoute();
const defaultMenu = ref(route.fullPath);

const menuList = ref<IMenu[]>([
  {
    menuId: '/user',
    menuName: '회원관리',
  },
  {
    menuId: '/apply-status',
    menuName: '통계관리',
  },
  {
    menuId: '/total-terms',
    menuName: '전체 약관관리',
  },
  {
    menuId: '/board',
    menuName: '게시판 관리',
  },
]);
const handleSelect = (key: string, keyPath: string[]) => {
  router.push(key);
};
</script>

<template>
  <header class="header">
    <h1 class="logo">
      <a href="javascript:void(0);">
        <icon
          name="logo-lg--fff"
          width="104"
          height="28"
          alt="LG U+"
          class="mr-2.5"
        />
        <span>비즈온 증속 신청</span>
      </a>
    </h1>
    <div class="flex items-center">
      <el-menu
        v-model="defaultMenu"
        mode="horizontal"
        :default-active="defaultMenu"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="(menu, index) in menuList"
          :key="`mgmt=menu-list-${menu.menuId}`"
          :index="menu.menuId"
        >
          {{ menu.menuName }}
        </el-menu-item>
      </el-menu>

      <button type="button" class="header__user">홍길동</button>
      <button type="button">
        <icon name="logout__line--fff" width="24" height="24" alt="로그아웃" />
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
