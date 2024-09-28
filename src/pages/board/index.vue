<script lang="ts" setup>
const searchForm = reactive({
  category: 'FAQ',
  categoryOption: [
    {
      label: 'FAQ',
      value: 1,
    },
    {
      label: '공지사항',
      value: 2,
    },
  ],
  keyword: '',
})
const termsList = [
  {
    category: 'FAQ',
    title: '어떻게 동작, 사용하나요?',
    modifiedDate: '2024-05-03',
    registerDate: '2024-05-03',
  },
  {
    category: '공지사항',
    title: '어떻게 질의해야 하나요?',
    modifiedDate: '2024-05-03',
    registerDate: '2024-05-03',
  },
]
</script>

<template>
  <div>
    <div class="title">
      <h2>게시판 관리</h2>
      <p class="title__desc">FAQ와 공지사항을 관리합니다.</p>
    </div>
    <div class="box--fff">
      <SearchForm>
        <SearchItem>
          <CustomDropdown v-model="searchForm.category" :options="searchForm.categoryOption" />
          <CustomInput v-model="searchForm.keyword" placeholder="검색어를 입력해주세요." class="flex-1" />
        </SearchItem>
      </SearchForm>

      <div class="table-header">
        <p class="total">total <em>10</em></p>
      </div>
      <el-table :data="termsList" style="width: 100%" empty-text="조회된 내용이 없습니다.">
        <el-table-column type="index" label="No" align="center" width="60" />
        <el-table-column prop="category" label="구분" align="center" min-width="150" />
        <el-table-column prop="title" label="제목" min-width="300" />
        <el-table-column prop="modifiedDate" label="수정일" align="center" width="150" />
        <el-table-column prop="registerDate" label="등록일" align="center" width="150" />
      </el-table>
      <Pagination />
      <div class="flex justify-end w-full mt-[-32px]">
        <a href="javascript:void(0);" type="button" class="btn__full--primary-md">등록</a>
      </div>
    </div>
  </div>
</template>
