<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from 'axios';
import dayjs, { ManipulateType } from 'dayjs';
import { IApplyData, IApplyParams } from '~/types';
import { IPaginationOptions } from '~/types/pagination';

const searchDate = ref([new Date(), new Date()]);
const searchedDate = ref([new Date(), new Date()]);
const applyStatusList = ref<IApplyData[]>([]);
const datePickerButton = ref();
const downloadResonPopup = ref(false);
const downloadResonList = ref();
const downloadReson = ref('');

const searchForm = reactive({
  applyDate: '',
  entrNo: '',
  brno: '',
});

const searchedForm = reactive({
  applyDate: '',
  entrNo: '',
  brno: '',
});

const paginationOptions: IPaginationOptions = reactive({
  currentPage: 1,
  totalCount: 0,
  limit: 10,
});
const confirmOption = reactive({
  content: '',
  center: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  hideCancelButton: true,
});
const getParams = () => {
  const params: IApplyParams = {
    icspRqstStartDt: dayjs(searchedDate.value[0]).format('YYYYMMDD'),
    icspRqstEndDt: dayjs(searchedDate.value[1]).format('YYYYMMDD'),
    page: paginationOptions.currentPage,
    perPageNum: paginationOptions.limit,
  };
  if (searchedForm.entrNo) params.entrNo = searchedForm.entrNo;
  if (searchedForm.brno) params.brno = searchedForm.brno;
  return params;
};

const saveSearchedForm = () => {
  searchedDate.value = searchDate.value;
  searchedForm.applyDate = searchForm.applyDate;
  searchedForm.entrNo = searchForm.entrNo;
  searchedForm.brno = searchForm.brno;
};
const getAppluData = async (params: IApplyParams) => {
  try {
    const result = await request.get(
      '/bizon/mgmt/api/statistics/speed-increase-status',
      {
        params,
        headers: {
          'X-COMMAND': 'P05004',
        },
      }
    );

    return result.data.data;
  } catch (error) {
    console.error(error);
  }
};

const handleClearSearchForm = () => {
  searchDate.value = [new Date(), new Date()];
  paginationOptions.currentPage = 1;
  searchForm.applyDate = '';
  searchForm.entrNo = '';
  searchForm.brno = '';
};

const handleClickDay = (target: string) => {
  if (!target) return;
  if (target === 'day') {
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

const selectDate = () => {
  datePickerButton.value.selectDate();
  if (!searchDate.value[1]) searchDate.value[1] = searchDate.value[0];
};

const closeMenu = () => {
  datePickerButton.value.closeMenu();
};

const openDownloadResonPopup = async () => {
  if (!applyStatusList.value?.length) {
    // 오류 처리 로직 추가 (예: 메시지 표시)
    confirmOption.content = '엑셀 다운로드할 데이터가 없습니다.';
    await openConfirm(confirmOption);
    return;
  }
  const params = {
    cdGrp: 'EXEL_DOWN_RSN_KD_CD',
  };
  const result = await request.get('/bizon/mgmt/api/common/code/list', {
    params,
    headers: {
      'X-COMMAND': 'P05104',
    },
  });
  downloadResonList.value = result.data.data.codeList;
  downloadReson.value = downloadResonList.value[0].cd;
  downloadResonPopup.value = true;
};
function handleCancel() {
  downloadResonPopup.value = false;
}

const handleConfirm = async () => {
  const params: IApplyParams = {
    exelDownRsnKdCd: downloadReson.value,
    icspRqstStartDt: dayjs(searchedDate.value[0]).format('YYYYMMDD'),
    icspRqstEndDt: dayjs(searchedDate.value[1]).format('YYYYMMDD'),
  };
  if (searchedForm.entrNo) {
    params.entrNo = searchedForm.entrNo;
  }
  if (searchedForm.brno) {
    params.brno = searchedForm.brno;
  }

  axios({
    url: '/bizon/mgmt/api/statistics/speed-increase-status-excel-download',
    params,
    headers: {
      'X-COMMAND': 'P05104',
      'X-LOGKEY': generateLogKey(),
    },
    method: 'GET',
    responseType: 'blob',
  })
    .then((response) => {
      const blob = new Blob([response.data]); // 데이터가 유효한 경우 blob 생성
      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement('a');
      link.href = url;
      link.download = '증속 신청현황.xlsx';
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      downloadResonPopup.value = false;
    })
    .catch((error) => {
      console.error('Error downloading Excel file:', error);
    });
};

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

const handleSearch = async () => {
  paginationOptions.currentPage = 1;
  saveSearchedForm();
  const params = getParams();
  const result = await getAppluData(params);
  applyStatusList.value = result.speedIncreaseStatusList;
  paginationOptions.totalCount = result.totalCount;
};

const handlePageChange = async () => {
  const params = getParams();
  const result = await getAppluData(params);
  applyStatusList.value = result.speedIncreaseStatusList;
  paginationOptions.totalCount = result.totalCount;
};

onMounted(async () => {
  // handleSearch();
});
</script>

<template>
  <SearchForm use-reset @search="handleSearch" @clear="handleClearSearchForm">
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
          min-date="2024-11-01"
          :max-date="dayjs().format('YYYY-MM-DD')"
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
    <SearchItem>
      <el-radio>
        <SearchItem label="가입 번호">
          <CustomInput
            v-model="searchForm.entrNo"
            type="text"
            @keyupEnter="handleSearch"
          />
        </SearchItem>
      </el-radio>
      <el-radio>
        <SearchItem label="사업자 번호">
          <CustomInput
            v-model="searchForm.brno"
            type="text"
            @keyupEnter="handleSearch"
          />
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
              {{ scope.row.sbscDownSpedVlue }}M<icon
                name="triangle__full--525"
                width="11"
                height="9"
                alt=""
                class="ml-2.5"
              />
            </p>
            <p class="flex items-center">
              {{ scope.row.sbscUpldSpedVlue }}M<icon
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
              {{ scope.row.icspRqstDownSped }}M<icon
                name="triangle__full--525"
                width="11"
                height="9"
                alt=""
                class="ml-2.5"
              />
            </p>
            <p class="flex items-center">
              {{ scope.row.icspRqstUpldSped }}M<icon
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
    @click="handlePageChange"
  />
  <!-- 문서 다운로드 사유 팝업 -->
  <common-modal
    v-model="downloadResonPopup"
    title="문서 다운로드 사유"
    confirm-text="저장"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #content>
      &#42; 문서 다운로드 사유를 선택해주세요.
      <div class="mt-4 box--f3f">
        <el-radio-group v-model="downloadReson" class="flex-col gap-2.5">
          <el-radio v-for="reson in downloadResonList" :value="reson.cd">
            {{ reson.cdNm }}
          </el-radio>
        </el-radio-group>
      </div>
    </template>
  </common-modal>
</template>
