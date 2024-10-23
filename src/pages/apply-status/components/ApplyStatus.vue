<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs, { ManipulateType } from 'dayjs';
import { IModalPopup } from '~/types/modal';
import { IPaginationOptions } from '~/types/pagination';

const searchForm = reactive({
  applyDate: '',
  entrNo: '',
  brno: '',
});
const searchDate = ref([new Date('2024.09.01'), new Date('2024.12.15')]);

//    icspRqstDt: '2024-05-03', // 비즈온 개통 일자
//     cucoChrrNm: '손*민', // 고객사담당자명
//     cucoChrrHpno: '010-****-1111', // 고객사담당자 전화번호
//     svcNm: '비즈온 Standard',
//     entrNo: '*******1231', // 가입번호
//     brno: '123-234-345', // 사업자 번호
//     cucoNm: 'AA 반도체', // 고객사 명
//     applicationTraffic: {
//       // 청약트래픽
//       value1: '300M',
//       value2: '500M',
//     },
//     increaseTraffic: {
//       // 증속트래픽
//       value1: '300M',
//       value2: '1G',
//     },
//     icspRqstPrssFnshYn: 'Y', // 증속 완료
//     sbscSpedRorgYn: 'Y', // 청약 속도 원복
const applyStatusList = ref([]);

const paginationOptions: IPaginationOptions = reactive({
  currentPage: 1,
  totalCount: 0,
  limit: 10,
});

const datePickerButton = ref();

const getAppluData = async () => {
  const params = {
    entrNo: searchForm.entrNo,
    brno: searchForm.brno,
    // icspRqstStartDt: '20240901',
    // icspRqstEndDt: '20241215',
    icspRqstStartDt: dayjs(searchDate.value[0]).format('YYYYMMDD'),
    icspRqstEndDt: dayjs(searchDate.value[1]).format('YYYYMMDD'),
    page: paginationOptions.currentPage,
    perPageNum: paginationOptions.limit,
  };
  const result = await request.get(
    '/bizon/mgmt/api/statistics/speed-increase-status',
    { params }
  );

  applyStatusList.value = result.data.data.speedIncreaseStatusList;
  paginationOptions.totalCount = result.data.data.totalCount;
};

const handleClickDay = (target: string) => {
  if (!target || target === 'day') {
    searchDate.value = [new Date(), new Date()];
  } else {
    searchDate.value = [
      new Date(
        dayjs()
          .subtract(1, target as ManipulateType)
          .format('YYYY-MM-DD')
      ),
      new Date(),
    ];
  }
};

const handleClickDate = () => {
  // selectedDate.value = '';
  // clickDateMode.value = '';
};

const selectDate = () => {
  datePickerButton.value.selectDate();
  if (!searchDate.value[1]) searchDate.value[1] = searchDate.value[0];
};

const closeMenu = () => {
  datePickerButton.value.closeMenu();
};

// 팝업
const popup: IModalPopup = reactive({
  downloadResonPopup: {
    show: false,
  },
});
function openDownloadResonPopup() {
  popup.downloadResonPopup.show = true;
}
function handleCancel() {
  popup.downloadResonPopup.show = false;
}

const selectedDate = computed(() => {
  if (
    dayjs(searchDate.value[1]).format('YYYY-MM-DD') !==
    dayjs().format('YYYY-MM-DD')
  )
    return '';
  return dayjs(searchDate.value[0]).format('YYYY-MM-DD') ===
    dayjs(searchDate.value[1]).format('YYYY-MM-DD')
    ? 'day'
    : dayjs(searchDate.value[0]).format('YYYY-MM-DD') ===
        dayjs(searchDate.value[1]).subtract(1, 'month').format('YYYY-MM-DD')
      ? 'month'
      : dayjs(searchDate.value[0]).format('YYYY-MM-DD') ===
          dayjs(searchDate.value[1]).subtract(1, 'year').format('YYYY-MM-DD')
        ? 'year'
        : '';
});

onMounted(() => {
  getAppluData();
});
</script>

<template>
  <SearchForm use-reset @search="getAppluData">
    <SearchItem label="접속일">
      <div class="datepicker">
        <div class="datepicker__btns">
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === 'day' }"
            @click="handleClickDay('day')"
          >
            오늘
          </button>
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === 'month' }"
            @click="handleClickDay('month')"
          >
            1개월
          </button>
          <button
            type="button"
            :class="{ 'is-selected': selectedDate === 'year' }"
            @click="handleClickDay('year')"
          >
            1년
          </button>
          <button
            type="button"
            @click="handleClickDay('')"
            :class="{ 'is-selected': selectedDate === '' }"
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
    <SearchItem>
      <el-radio>
        <SearchItem label="가입 번호">
          <CustomInput
            v-model="searchForm.entrNo"
            type="number"
            width="292px"
          />
        </SearchItem>
      </el-radio>
      <el-radio>
        <SearchItem label="사업자 번호">
          <CustomInput v-model="searchForm.brno" type="number" width="292px" />
        </SearchItem>
      </el-radio>
    </SearchItem>
  </SearchForm>
  <div class="table-header">
    <p class="total">
      total <em>{{ prettyNumber(paginationOptions.totalCount) }}</em>
    </p>
    <button
      type="button"
      class="btn__line--primary-md"
      @click="openDownloadResonPopup"
    >
      <icon name="download__line--855" width="24" height="24" alt="" />
      엑셀 다운로드
    </button>
  </div>
  <el-table
    :data="applyStatusList"
    style="width: 100%"
    empty-text="조회된 내용이 없습니다."
  >
    <el-table-column
      prop="icspRqstDt"
      label="증속 신청일"
      align="center"
      width="150"
    />
    <el-table-column prop="cucoChrrNm" align="center" min-width="120">
      <template #header> 고객사<br />담당자 명 </template>
    </el-table-column>
    <el-table-column prop="cucoChrrHpno" align="center" min-width="180">
      <template #header> 고객사<br />담당자 전화번호 </template>
    </el-table-column>
    <el-table-column
      prop="svcNm"
      label="서비스"
      align="center"
      min-width="180"
    />
    <el-table-column
      prop="entrNo"
      label="가입 번호"
      align="center"
      min-width="180"
    />
    <el-table-column
      prop="brno"
      label="사업자 번호"
      align="center"
      min-width="180"
    />
    <el-table-column
      prop="cucoNm"
      label="고객사 명"
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
              {{ scope.row.sbscDownSpedVlue
              }}<icon
                name="triangle__full--525"
                width="11"
                height="9"
                alt=""
                class="ml-2.5"
              />
            </p>
            <p class="flex items-center">
              {{ scope.row.sbscUpldSpedVlue
              }}<icon
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
      prop="increaseTraffic"
      label="증속트래픽"
      align="center"
      width="120"
    >
      <template #default="scope">
        <div class="flex justify-center">
          <div class="flex flex-col items-end">
            <p class="flex items-center">
              {{ scope.row.icspRqstDownSped
              }}<icon
                name="triangle__full--525"
                width="11"
                height="9"
                alt=""
                class="ml-2.5"
              />
            </p>
            <p class="flex items-center">
              {{ scope.row.icspRqstUpldSped
              }}<icon
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
      prop="icspRqstPrssFnshYn"
      label="증속 완료"
      align="center"
      width="150"
    />
    <el-table-column
      prop="sbscSpedRorgYn"
      label="청약 속도 원복"
      align="center"
      width="150"
    />
  </el-table>
  <Pagination
    v-model="paginationOptions.currentPage"
    :total-count="paginationOptions.totalCount"
    :limit="paginationOptions.limit"
    @click="getAppluData"
  />

  <!-- 문서 다운로드 사유 팝업 -->
  <common-modal
    v-model="popup.downloadResonPopup.show"
    title="문서 다운로드 사유"
    confirm-text="저장"
    @cancel="handleCancel"
    @confirm="handleCancel"
  >
    <template #content>
      &#42; 문서 다운로드 사유를 선택해주세요.
      <div class="mt-4 box--f3f">
        <el-radio-group class="flex-col gap-2.5">
          <el-radio value="업무 보고용"> 업무 보고용 </el-radio>
          <el-radio value="단순 데이터 대조용"> 단순 데이터 대조용 </el-radio>
          <el-radio value="이벤트 대상자 추출용">
            이벤트 대상자 추출용
          </el-radio>
        </el-radio-group>
      </div>
    </template>
  </common-modal>
</template>
