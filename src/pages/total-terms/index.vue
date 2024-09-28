<script lang="ts" setup>
const searchForm = reactive({
  condition: '메뉴 이름',
  conditionOption: [
    {
      label: '메뉴 이름',
      value: 1,
    },
    {
      label: '메뉴 URL',
      value: 2,
    },
  ],
  keyword: '',
})
const termsList = [
  {
    title: '증속서비스에 관한 규정 안내',
    name: '이용 약관',
    url: 'https://www.lguplus.com/footer/agreement',
    modifiedDate: '2024-05-03',
    registerDate: '2024-05-03',
  },
  {
    title: '증속서비스에 관한 규정 안내',
    name: '이용 약관',
    url: 'https://www.lguplus.com/footer/agreement',
    modifiedDate: '2024-05-03',
    registerDate: '2024-05-03',
  },
]

// 팝업
const menuLinkForm = reactive({
  name: '',
  url: '',
})
const popup: IModalPopup = reactive({
  menuUrlPopup: {
    show: false,
  },
})
function openNoticeDetail() {
  popup.menuUrlPopup.show = true
}
function handleCancel() {
  popup.menuUrlPopup.show = false
}
</script>

<template>
  <div>
    <div class="title">
      <h2>전체 약관 목록</h2>
      <p class="title__desc">서비스 관련 약관을 관리합니다.</p>
    </div>
    <div class="box--fff">
      <SearchForm>
        <SearchItem label="메뉴 이름">
          <CustomDropdown v-model="searchForm.condition" :options="searchForm.conditionOption" />
          <CustomInput v-model="searchForm.keyword" placeholder="검색어를 입력해주세요." class="flex-1" />
        </SearchItem>
      </SearchForm>

      <div class="table-header">
        <p class="total">total <em>10</em></p>
        <button type="button" class="btn__line--primary-md" @click="openNoticeDetail">등록</button>
      </div>
      <el-table :data="termsList" style="width: 100%">
        <el-table-column type="index" label="No" align="center" width="60" />
        <el-table-column prop="name" label="메뉴명" align="center" min-width="200" />
        <el-table-column label="메뉴 URL" min-width="300">
          <template #default="scope">
            <a href="javascript:void(0);" class="hover:underline">
              {{ scope.row.url }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="modifiedDate" label="수정일" align="center" width="150" />
        <el-table-column prop="registerDate" label="등록일" align="center" width="150" />
      </el-table>
      <Pagination />
      <div class="flex justify-end w-full mt-[-32px]" />
    </div>

    <!-- 메뉴 링크 관리 팝업 -->
    <common-modal v-model="popup.menuUrlPopup.show" title="메뉴 링크 관리" confirm-text="저장" @cancel="handleCancel" @confirm="handleCancel">
      <template #content>
        <form class="form">
          <FormItem label="메뉴명">
            <CustomInput v-model="menuLinkForm.name" placeholder="메뉴명을 입력해주세요." />
          </FormItem>
          <FormItem label="메뉴 URL">
            <CustomInput v-model="menuLinkForm.url" placeholder="관련 URL을 입력해주세요." />
          </FormItem>
        </form>
      </template>
    </common-modal>
  </div>
</template>
