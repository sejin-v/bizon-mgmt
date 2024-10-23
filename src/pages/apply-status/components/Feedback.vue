<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from 'dayjs';

const searchForm = reactive({
  applyDate: '',
});
const feedbackList = [
  {
    registerDate: '2024-05-03',
    signNum: '******1234',
    category: 'BIZON Precare서비스를 얼마나 만족하시나요?',
    averageScore: '80',
    detailedStatus:
      '매우불만(5명), 불만(20명), 보통(20명), 만족(35명), 매우만족(20명)',
  },
];

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 1000,
  limit: 20,
});

// 데이트피커
const searchDate = ref('');
const dateButton = ref('');
const datePickerButton = ref('');
const clickDateMode = ref('day');

const handleClickSetDay = () => {
  searchDate.value = '';
  clickDateMode.value = 'day';
  const today = dayjs();
  searchDate.value = [today, today];
};

const handleClickSetWeek = () => {
  searchDate.value = '';
  clickDateMode.value = 'week';
  const today = dayjs();
  const lastWeek = dayjs().subtract(6, 'day').endOf('day');
  searchDate.value = [lastWeek, today];
};

const handleClickSetMonth = () => {
  searchDate.value = '';
  clickDateMode.value = 'month';
  const startDay = dayjs().startOf('day');
  const endDay = dayjs().subtract(30, 'day').endOf('day');
  searchDate.value = [endDay, startDay];
};

const handleClickDate = () => {
  searchDate.value = '';
  clickDateMode.value = '';
};

onMounted(() => {
  handleClickSetDay();
});

const selectDate = () => {
  datePickerButton.value.selectDate();
};

const closeMenu = () => {
  datePickerButton.value.closeMenu();
};
</script>

<template>
  <SearchForm>
    <SearchItem label="등록일">
      <div class="datepicker">
        <div class="datepicker__btns">
          <button
            type="button"
            :class="{ 'is-selected': clickDateMode === 'day' }"
            @click="handleClickSetDay"
          >
            일간
          </button>
          <button
            type="button"
            :class="{ 'is-selected': clickDateMode === 'week' }"
            @click="handleClickSetWeek('week')"
          >
            주간
          </button>
          <button
            type="button"
            :class="{ 'is-selected': clickDateMode === 'month' }"
            @click="handleClickSetMonth"
          >
            월간
          </button>
          <button
            type="button"
            :class="{ 'is-selected': clickDateMode === '' }"
          >
            직접선택
          </button>
        </div>
        <VueDatePicker
          ref="datePickerButton"
          v-model="searchDate"
          format="yyyy-MM-dd"
          max-range="365"
          range
          locale="ko"
          :day-names="['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']"
          :enable-time-picker="false"
          :year-first="true"
          placeholder="시작일 종료일을 입력해 주세요"
          @open="handleClickDate"
        >
          <template #action-preview />
          <template #action-buttons ref="dateButton">
            <button
              type="button"
              class="btn__line--negative-sm"
              @click="closeMenu"
            >
              취소
            </button>
            <button
              type="button"
              class="btn__full--primary-sm"
              @click="selectDate"
            >
              선택
            </button>
          </template>
        </VueDatePicker>
      </div>
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
  <el-table
    :data="feedbackList"
    style="width: 100%"
    empty-text="조회된 내용이 없습니다."
    class="data-table"
  >
    <el-table-column type="index" label="번호" align="center" width="100" />
    <el-table-column
      prop="registerDate"
      label="등록일"
      align="center"
      width="180"
    />
    <el-table-column prop="category" label="평가항목" min-width="200" />
    <el-table-column
      prop="averageScore"
      label="평균점수"
      align="center"
      width="150"
    />
    <el-table-column prop="detailedStatus" label="상세 현황" min-width="200">
      <template #default>
        매우불만(5명), 불만(20명), 보통(20명), <em>만족(35명)</em>,
        매우만족(20명)
      </template>
    </el-table-column>
  </el-table>
  <Pagination
    :total-count="paginationOptions.totalCount"
    :limit="paginationOptions.limit"
  />
  <div class="flex justify-end w-full mt-[-32px]">
    <a href="javascript:void(0);" type="button" class="btn__full--primary-md"
      >주관식 답변보기</a
    >
  </div>
</template>
