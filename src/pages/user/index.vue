<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import axios from 'axios';
import dayjs, { ManipulateType } from 'dayjs';
import { IPaginationOptions } from '~/types';
import { IUserData, IUserParams } from '~/types';

const router = useRouter();
const searchDate = ref([new Date(), new Date()]);
const searchedDate = ref([new Date(), new Date()]);
const datePickerButton = ref();
const downloadResonPopup = ref(false);
const downloadResonList = ref();
const downloadReson = ref('');
const confirmOption = reactive({
  content: '',
  center: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  hideCancelButton: true,
});
const searchForm = reactive({
  entrNo: '',
  brno: '',
  cucoChrrNm: '',
});

const searchedForm = reactive({
  entrNo: '',
  brno: '',
  cucoChrrNm: '',
});

const userList = ref<IUserData[]>([]);

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 0,
  limit: 10,
});

const getParams = () => {
  const params: IUserParams = {
    lastLoginDttmStart: dayjs(searchedDate.value[0]).format('YYYY-MM-DD'),
    lastLoginDttmEnd: dayjs(searchedDate.value[1]).format('YYYY-MM-DD'),
    perPageNum: 10,
    page: paginationOptions.currentPage,
  };
  if (searchedForm.cucoChrrNm) {
    params.cucoChrrNm = searchedForm.cucoChrrNm;
  }
  if (searchedForm.brno) {
    params.brno = searchedForm.brno;
  }
  if (searchedForm.entrNo) {
    params.entrNo = searchedForm.entrNo;
  }
  return params;
};

const getMemberList = async (params: IUserParams) => {
  try {
    const result = await request.get(
      '/bizon/mgmt/api/user-management/user-list',
      {
        params,
        headers: {
          'X-COMMAND': 'P05002',
        },
      }
    );
    return result.data.data;
  } catch (error) {
    console.error(error);
  }
};
const saveSearchedForm = () => {
  searchedDate.value = searchDate.value;
  searchedForm.entrNo = searchForm.entrNo;
  searchedForm.brno = searchForm.brno;
  searchedForm.cucoChrrNm = searchForm.cucoChrrNm;
};

const handleSeasrch = async () => {
  paginationOptions.currentPage = 1;
  saveSearchedForm();

  const params = getParams();
  const result = await getMemberList(params);
  userList.value = result.userList;
  paginationOptions.totalCount = result.totalCount;
};

const handlePageChange = async () => {
  const params = getParams();
  const result = await getMemberList(params);
  userList.value = result.userList;
  paginationOptions.totalCount = result.totalCount;
};
const goDetailPage = (target: IUserData) => {
  router.push(`/user/${target.encEntrNo}`);
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
};

const closeMenu = () => {
  datePickerButton.value.closeMenu();
};

const openDownloadResonPopup = async () => {
  if (!userList.value?.length) {
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
      'X-COMMAND': 'P05101',
    },
  });
  downloadResonList.value = result.data.data.codeList;
  downloadReson.value = downloadResonList.value[0].cd;
  downloadResonPopup.value = true;
};
const handleConfirm = async () => {
  const params: IUserParams = {
    exelDownRsnKdCd: downloadReson.value,
    lastLoginDttmStart: dayjs(searchedDate.value[0]).format('YYYY-MM-DD'),
    lastLoginDttmEnd: dayjs(searchedDate.value[1]).format('YYYY-MM-DD'),
  };
  if (searchedForm.entrNo) {
    params.entrNo = searchedForm.entrNo;
  }
  if (searchedForm.brno) {
    params.brno = searchedForm.brno;
  }
  if (searchedForm.cucoChrrNm) {
    params.cucoChrrNm = searchedForm.cucoChrrNm;
  }

  axios({
    url: '/bizon/mgmt/api/user-management/user-list-excel-download',
    params,
    headers: {
      'X-COMMAND': 'P05101',
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
      link.download = '회원 관리.xlsx';
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      downloadResonPopup.value = false;
    })
    .catch((error) => {
      console.error('Error downloading Excel file:', error);
    });
};
function handleCancel() {
  downloadResonPopup.value = false;
}

const handleClear = () => {
  searchForm.entrNo = '';
  searchForm.brno = '';
  searchForm.cucoChrrNm = '';
  searchDate.value = [new Date(), new Date()];
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

onMounted(async () => {
  // handleSeasrch();
});
</script>

<template>
  <div>
    <h2 class="title">회원 관리</h2>
    <div class="content-box">
      <SearchForm use-reset @search="handleSeasrch" @clear="handleClear">
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
              min-date="2024-11-01"
              :max-date="dayjs().format('YYYY-MM-DD')"
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
          <SearchItem label="가입 번호">
            <CustomInput
              v-model="searchForm.entrNo"
              type="number"
              width="268px"
              @keyup-enter="handleSeasrch"
            />
          </SearchItem>
          <SearchItem label="사업자 번호">
            <CustomInput
              v-model="searchForm.brno"
              type="number"
              width="268px"
              @keyup-enter="handleSeasrch"
            />
          </SearchItem>
          <SearchItem label="담당자">
            <CustomInput
              v-model="searchForm.cucoChrrNm"
              width="268px"
              @keyup-enter="handleSeasrch"
            />
          </SearchItem>
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
        :data="userList"
        style="width: 100%"
        empty-text="조회된 내용이 없습니다."
        @row-click="goDetailPage"
      >
        <el-table-column prop="rowNum" label="No" align="center" width="80" />
        <el-table-column prop="cntcStrtDt" align="center" width="150">
          <template #header> 비즈온<br />개통 일자 </template>
          <template #default="scope">
            {{
              scope.row.cntcStrtDt ? dateFormatter(scope.row.cntcStrtDt) : '-'
            }}
          </template>
        </el-table-column>
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
        <el-table-column prop="cucoChrrNm" align="center" min-width="120">
          <template #header> 고객사<br />담당자명 </template>
        </el-table-column>
        <el-table-column prop="brno" align="center" min-width="180">
          <template #header> 고객사<br />사업자 번호 </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginDttm"
          label="최종 접속일"
          align="center"
          width="150"
        />
        <el-table-column
          prop="userLginIp"
          label="접속 IP"
          align="center"
          min-width="180"
        >
          <template #default="scope">
            {{ scope.row.userLginIp ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="cucoChrrHpno" align="center" min-width="180">
          <template #header> 고객사 담당자<br />전화번호 </template>
        </el-table-column>
        <el-table-column prop="cucoEmalAddr" align="center" min-width="180">
          <template #header> 고객사 담당자<br />이메일 </template>
        </el-table-column>
        <el-table-column prop="bizEmpNm" align="center" min-width="120">
          <template #header> 관리 영업<br />사원명 </template>
        </el-table-column>
        <el-table-column prop="bizEmpHpno" align="center" min-width="180">
          <template #header> 관리 영업 사원<br />전화번호 </template>
        </el-table-column>
        <el-table-column prop="bizEmpEmalAddr" align="center" min-width="180">
          <template #header> 관리 영업 사원<br />이메일 </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-model="paginationOptions.currentPage"
        :total-count="paginationOptions.totalCount"
        :limit="paginationOptions.limit"
        @click="handlePageChange"
      />
    </div>

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
  </div>
</template>
