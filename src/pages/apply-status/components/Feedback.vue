<script lang="ts" setup>
const searchForm = reactive({
  applyDate: '',
})
const feedbackList = [
  {
    registerDate: '2024-05-03',
    signNum: '******1234',
    category: 'BIZON Precare서비스를 얼마나 만족하시나요?',
    averageScore: '80',
    detailedStatus: '매우불만(5명), 불만(20명), 보통(20명), 만족(35명), 매우만족(20명)',
  },
]

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 1000,
  limit: 20,
})
</script>

<template>
  <SearchForm>
    <SearchItem label="등록일">
      <!-- datepicker -->
    </SearchItem>
  </SearchForm>

  <ul class="table-desc">
    <li>
      <label>조시기간</label>
      <p>2024-10-01~ 2024-10-31</p>
    </li>
    <li>
      <label>참여자</label>
      <p><em>100</em>&nbsp;명</p>
    </li>
  </ul>
  <el-table :data="feedbackList" style="width: 100%" empty-text="조회된 내용이 없습니다." class="data-table">
    <el-table-column type="index" label="번호" align="center" width="100" />
    <el-table-column prop="registerDate" label="등록일" align="center" width="180" />
    <el-table-column prop="category" label="평가항목" min-width="200" />
    <el-table-column prop="averageScore" label="평균점수" align="center" width="150" />
    <el-table-column prop="detailedStatus" label="상세 현황" min-width="200">
      <template #default> 매우불만(5명), 불만(20명), 보통(20명), <em>만족(35명)</em>, 매우만족(20명) </template>
    </el-table-column>
  </el-table>
  <Pagination :total-count="paginationOptions.totalCount" :limit="paginationOptions.limit" />
  <div class="flex justify-end w-full mt-[-32px]">
    <a href="javascript:void(0);" type="button" class="btn__full--primary-md">주관식 답변보기</a>
  </div>
</template>
