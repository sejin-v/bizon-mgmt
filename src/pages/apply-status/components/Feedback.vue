<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs, { ManipulateType } from 'dayjs';
import { IFeedbackParams, IFeedbackData } from '~/types';

const emit = defineEmits<{
  (e: 'change'): void;
}>();

const searchDate = ref([
  new Date(dayjs().startOf('month').format('YYYY-MM-DD')),
  new Date(),
]);
const searchedDate = ref([
  new Date(dayjs().startOf('month').format('YYYY-MM-DD')),
  new Date(),
]);
const datePickerButton = ref();
const feedbackList = ref<IFeedbackData[]>([]);
const totalUserCount = ref(0);

const getParams = () => {
  return {
    regDtStart: dayjs(searchDate.value[0]).format('YYYY-MM-DD'),
    regDtEnd: dayjs(searchDate.value[1]).format('YYYY-MM-DD'),
  };
};
const getFeedbackData = async (params: IFeedbackParams) => {
  try {
    const result = await request.get(
      '/bizon/mgmt/api/statistics/statisfaction-rating',
      {
        params,
        headers: {
          'X-COMMAND': 'P05005',
        },
      }
    );
    searchedDate.value = searchDate.value;
    return result.data.data;
  } catch (error) {
    console.error(error);
  }
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

const handleSearch = async () => {
  const params = getParams();
  const result = await getFeedbackData(params);
  feedbackList.value = result.getStatisfactionRatingEvaluationItemDTOList;
  totalUserCount.value = result.allUserTotalCount;
};

const selectDate = () => {
  datePickerButton.value.selectDate();
};

const closeMenu = () => {
  datePickerButton.value.closeMenu();
};

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

const handleChange = () => {
  emit('change');
};
onMounted(async () => {
  handleSearch();
});
</script>

<template>
  <SearchForm @search="handleSearch">
    <SearchItem label="등록일">
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
        >
          <template #action-preview />
          <template #action-buttons>
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
      <p>
        {{ dayjs(searchedDate[0]).format('YYYY-MM-DD') }}~
        {{ dayjs(searchedDate[1]).format('YYYY-MM-DD') }}
      </p>
    </li>
    <li>
      <label>참여자</label>
      <p>
        <em>{{ prettyNumber(totalUserCount) }}</em
        >&nbsp;명
      </p>
    </li>
  </ul>
  <el-table
    :data="feedbackList"
    style="width: 100%"
    empty-text="조회된 내용이 없습니다."
    class="data-table"
  >
    <el-table-column prop="evalQstnNo" label="No" align="center" width="100" />
    <el-table-column prop="regDttm" label="등록일" align="center" width="180" />
    <el-table-column
      show-overflow-tooltip
      prop="evalQstnCntn"
      label="평가항목"
      min-width="200"
    />
    <el-table-column
      show-overflow-tooltip
      prop="avgScor"
      label="평균점수"
      align="center"
      width="150"
    />
    <el-table-column
      show-overflow-tooltip
      prop="evaluatingCustomerSatisfactionDTOList"
      label="상세 현황"
      min-width="200"
    >
      <template #default="scope">
        <template
          v-for="(data, i) in scope.row.evaluatingCustomerSatisfactionDTOList"
        >
          <em v-if="data.evalScorName === '만족'">
            {{ `${data.evalScorName}(${data.userTotalCount}), ` }}
          </em>
          <span v-else>
            {{
              `${data.evalScorName}(${data.userTotalCount})${i === scope.row.evaluatingCustomerSatisfactionDTOList.length - 1 ? '' : ','} `
            }}
          </span>
        </template>
      </template>
    </el-table-column>
  </el-table>

  <div class="flex justify-end w-full mt-[32px]" @click="handleChange">
    <a href="javascript:void(0);" type="button" class="btn__full--primary-md"
      >주관식 답변보기</a
    >
  </div>
</template>
