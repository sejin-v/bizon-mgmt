<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs, { ManipulateType } from 'dayjs';
import {
  IPaginationOptions,
  ISubjectFeedbackData,
  ISubjectFeedbackParams,
} from '~/types';

const searchDate = ref([
  new Date(dayjs().startOf('month').format('YYYY-MM-DD')),
  new Date(),
]);
const searchedDate = ref([
  new Date(dayjs().startOf('month').format('YYYY-MM-DD')),
  new Date(),
]);
const downloadResonPopup = ref(false);

const searchForm = reactive({
  applyDate: '',
  entrNo: '',
  applicationTraffic: '',
});
const searchedForm = reactive({
  applyDate: '',
  entrNo: '',
  applicationTraffic: '',
});

const applicationTrafficOption = [{ label: '미정', value: '미정' }];

const subjectFeedbackList = ref<ISubjectFeedbackData[]>();
const subjectFeedbackData = ref<ISubjectFeedbackData>();

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 0,
  limit: 10,
  currentPage: 1,
});

const dateButton = ref('');
const datePickerButton = ref();

const getParams = () => {
  const params: ISubjectFeedbackParams = {
    evalRegDtStart: dayjs(searchedDate.value[0]).format('YYYY-MM-DD'),
    evalRegDtEnd: dayjs(searchedDate.value[1]).format('YYYY-MM-DD'),
    page: paginationOptions.currentPage,
    perPageNum: paginationOptions.limit,
  };
  if (searchedForm.entrNo) {
    params.entrNo = searchedForm.entrNo;
  }
  return params;
};
const getSubjectiveFeedbackData = async (params: ISubjectFeedbackParams) => {
  const result = await request.get(
    '/bizon/mgmt/api/statistics/statisfaction-rating-subjective',
    { params }
  );
  return result.data.data;
};

const handleClickDay = (target: number) => {
  if (!target) return;
  if (target === 1) {
    searchDate.value = [
      new Date(dayjs().startOf('month').format('YYYY-MM-DD')),
      new Date(),
    ];
  } else {
    searchDate.value = [
      new Date(
        dayjs()
          .subtract(target, 'month' as ManipulateType)
          .format('YYYY-MM-DD')
      ),
      new Date(),
    ];
  }
};

const handleClickDate = () => {
  // searchDate.value = '';
  // clickDateMode.value = '';
};

const saveSearchedForm = () => {
  searchedDate.value = searchDate.value;
  searchedForm.applyDate = searchForm.applyDate;
  searchedForm.entrNo = searchForm.entrNo;
  searchedForm.applicationTraffic = searchForm.applicationTraffic;
};

const handleSearch = async () => {
  paginationOptions.currentPage = 1;
  saveSearchedForm();

  const params = getParams();
  const result = await getSubjectiveFeedbackData(params);
  subjectFeedbackList.value = result.statisfactionRatingSubjectiveDTOList;
};

const handlePageChange = async () => {
  const params = getParams();
  const result = await getSubjectiveFeedbackData(params);
  subjectFeedbackList.value = result.statisfactionRatingSubjectiveDTOList;
};

const handleClear = () => {
  searchDate.value = [
    new Date(dayjs().startOf('month').format('YYYY-MM-DD')),
    new Date(),
  ];
  searchForm.applyDate = '';
  searchForm.entrNo = '';
  searchForm.applicationTraffic = '';
};

onMounted(async () => {
  const params = getParams();
  const result = await getSubjectiveFeedbackData(params);
  subjectFeedbackList.value = result.statisfactionRatingSubjectiveDTOList;
  paginationOptions.totalCount = result.totalCount;
});

const selectDate = () => {
  datePickerButton.value.selectDate();
};

const closeMenu = () => {
  datePickerButton.value.closeMenu();
};

function openDownloadResonPopup(target: ISubjectFeedbackData) {
  subjectFeedbackData.value = target;
  downloadResonPopup.value = true;
}
function handleCancel() {
  downloadResonPopup.value = false;
}

const selectedDate = computed(() => {
  if (
    dayjs(searchDate.value[1]).format('YYYY-MM-DD') !==
    dayjs().format('YYYY-MM-DD')
  )
    return '';
  return dayjs(searchDate.value[0]).format('YYYY-MM-DD') ===
    dayjs().startOf('month').format('YYYY-MM-DD')
    ? 'month'
    : dayjs(searchDate.value[0]).format('YYYY-MM-DD') ===
        dayjs(searchDate.value[1]).subtract(3, 'month').format('YYYY-MM-DD')
      ? '3month'
      : dayjs(searchDate.value[0]).format('YYYY-MM-DD') ===
          dayjs(searchDate.value[1]).subtract(12, 'month').format('YYYY-MM-DD')
        ? 'year'
        : '';
});
</script>

<template>
  <SearchForm use-reset @search="handleSearch" @clear="handleClear">
    <SearchItem label="접속일">
      <div class="datepicker">
        <div class="datepicker__btns">
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === 'month' }"
            @click="handleClickDay(1)"
          >
            당월
          </button>
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === '3month' }"
            @click="handleClickDay(3)"
          >
            3개월
          </button>
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === 'year' }"
            @click="handleClickDay(12)"
          >
            1년
          </button>
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === '' }"
            @click="handleClickDay(0)"
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
    <SearchItem>
      <SearchItem label="가입 번호">
        <CustomInput
          v-model="searchForm.entrNo"
          type="text"
          width="292px"
          placeholder="가입 번호 입력"
          @keyupEnter="handleSearch"
        />
      </SearchItem>
      <SearchItem label="청약트래픽">
        <CustomDropdown
          v-model="searchForm.applicationTraffic"
          placeholder="선택하세요"
          :options="applicationTrafficOption"
        />
      </SearchItem>
    </SearchItem>
  </SearchForm>

  <div class="table-header">
    <p class="total">
      total <em>{{ paginationOptions.totalCount }}</em>
    </p>
  </div>
  <el-table
    :data="subjectFeedbackList"
    style="width: 100%"
    empty-text="조회된 내용이 없습니다."
    @row-click="openDownloadResonPopup"
  >
    <el-table-column prop="rowNum" label="No" align="center" width="80" />
    <el-table-column
      prop="evalRegDttm"
      label="평가일"
      align="center"
      width="150"
    />
    <el-table-column
      prop="entrNo"
      label="가입 번호"
      align="center"
      min-width="180"
    />
    <el-table-column
      prop="entrStusNm"
      label="가입 상태"
      align="center"
      width="150"
    />
    <el-table-column
      prop="applicationTraffic"
      label="청약트래픽"
      align="center"
      width="150"
    >
      <template #default="scope">
        <div class="flex justify-center">
          <div class="flex flex-col items-end">
            <p class="flex items-center">
              {{ scope.row.sbscUpldSped }}M<icon
                name="triangle__full--525"
                width="11"
                height="9"
                alt=""
                class="ml-2.5"
              />
            </p>
            <p class="flex items-center">
              {{ scope.row.sbscDownSped }}M<icon
                name="triangle__full--525"
                width="11"
                height="9"
                alt=""
                class="ml-2.5 rotate-180"
              />
            </p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="evalQstnCntn"
      label="질의"
      align="center"
      min-width="532"
    />
    <el-table-column
      prop="evalAnsr"
      label="답변"
      align="center"
      min-width="532"
    />
    <el-table-column
      prop="ansrRegDttm"
      label="답변일"
      align="center"
      width="150"
    />
  </el-table>
  <Pagination
    v-model="paginationOptions.currentPage"
    :total-count="paginationOptions.totalCount"
    :limit="paginationOptions.limit"
    @click="handlePageChange"
  />

  <common-modal
    v-model="downloadResonPopup"
    :title="subjectFeedbackData?.evalQstnCntn"
    :desc="subjectFeedbackData?.evalRegDttm"
    :show-close="false"
  >
    <template #content>
      {{ subjectFeedbackData?.evalAnsr }}
    </template>
    <template #footer>
      <button type="button" class="btn__line--primary-md" @click="handleCancel">
        닫기
      </button>
    </template>
  </common-modal>
</template>
