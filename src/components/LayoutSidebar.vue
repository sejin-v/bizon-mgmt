<script setup lang="ts">
import type { IMenuDetail } from '~/types/menu'

const { setTree, treeList } = useTree<IMenuDetail>()
const tempGuideMenuList = ref<IMenuDetail[]>([
  {
    menuId: 'EXAMPLE',
    parentMenuId: '#',
    menuName: '예제 리스트',
    menuIndex: 0,
    menuUrl: '/',
  },
  {
    menuId: 'DEFAULT_GRID_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: '기본 그리드 예제',
    menuIndex: 2,
    menuUrl: '/example/grid-example',
  },
  {
    menuId: 'TREE_GRID_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: '트리 그리드 예제',
    menuIndex: 3,
    menuUrl: '/example/tree-grid-example',
  },
  {
    menuId: 'DATEPICKER_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Datepicker 예제',
    menuIndex: 4,
    menuUrl: '/example/custom-datepicker',
  },
  {
    menuId: 'EDITOR_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Editor 예제',
    menuIndex: 4,
    menuUrl: '/example/editor-example',
  },
  {
    menuId: 'PAGINATION_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Pagination 예제',
    menuIndex: 5,
    menuUrl: '/example/pagination',
  },
  {
    menuId: 'TREE_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Tree 예제',
    menuIndex: 6,
    menuUrl: '/example/tree',
  },
  {
    menuId: 'MODAL_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Modal 예제',
    menuIndex: 7,
    menuUrl: '/example/modal',
  },
  {
    menuId: 'SELECT_BOX_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Select-Box 예제',
    menuIndex: 8,
    menuUrl: '/example/select-box',
  },
  {
    menuId: 'CHART_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Chart 예제',
    menuIndex: 9,
    menuUrl: '/example/chart',
  },
  {
    menuId: 'FILE_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Upload/Download',
    menuIndex: 10,
    menuUrl: '/example/file',
  },
  {
    menuId: 'CUSTOM_INPUT_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Custom-Input 예제',
    menuIndex: 11,
    menuUrl: '/example/custom-input',
  },
  {
    menuId: 'CONFIRM_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Confirm 예제',
    menuIndex: 12,
    menuUrl: '/example/confirm',
  },
  {
    menuId: 'PROGRESS_BAR_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Progress-bar 예제',
    menuIndex: 13,
    menuUrl: '/example/progress-bar',
  },
  {
    menuId: 'TOAST_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Toast 예제',
    menuIndex: 14,
    menuUrl: '/example/toast',
  },
  {
    menuId: 'Axios_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: 'Axios 예제',
    menuIndex: 15,
    menuUrl: '/example/axios',
  },
  {
    menuId: 'CODE_MIRROR_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: '코드 미러 예제',
    menuIndex: 16,
    menuUrl: '/example/code-mirror-example',
  },
  {
    menuId: 'ICON_IMAGE_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: '아이콘 이미지 예제',
    menuIndex: 17,
    menuUrl: '/example/icon-image-example',
  },
  {
    menuId: 'CHAT_INPUT_EXAMPLE',
    parentMenuId: 'EXAMPLE',
    menuName: '채팅 input 예제',
    menuIndex: 18,
    menuUrl: '/example/chat-input-example',
  },
])
const menuList = computed(() => {
  setTree(tempGuideMenuList.value)
  return treeList.value
})
</script>

<template>
  <nav data-test-id="sidebar" class="sidebar">
    <h1 class="logo" @click="() => $router.push('/')">
      <Icon name="icon__sidebar-robot" width="115" height="32" alt="U+ 서빙로봇" />
    </h1>
    <div class="sidebar__item">
      <tree-section v-for="root in menuList" :key="`sidebar-main-menu-${root.menuId}`" class="hover-scroll sidebar__menu" :tree-data="root" :indent-level="0" />
    </div>
  </nav>
</template>

<style lang="scss"></style>
