<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'

const router = useRouter()

const searchForm = reactive({
  connectDate: '',
  signNum: '',
  licenseNm: '',
  mgmtNm: '',
})
const memberList = [
  {
    openDate: '2024-05-03', // 비즈온 개통 일자
    signNum: '*******1231', // 가입번호
    status: '장기 미접속', // 가입상태
    clientMgNm: '손*민', // 고객사담당자명
    clientLicenseNm: '123-234-345', // 고객사 사업자 번호
    connectDate: '2024-09-09', // 최종 접속일
    connectIP: '192.168.***.1', // 접속IP
    clientMgPhNm: '010-****-1111', // 고객사담당자 전화번호
    clientMgMail: '20***@naver.com', //  고객사담당자 이메일
    mgmtNm: '손*민', // 관리 영업 사원명
    mgmtPhNm: '010-****-1111', // 관리 영업 사원 전화번호
    mgmtMail: 'son***@naver.com', // 관리 영업 사원 이메일
  },
]

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 1000,
  limit: 20,
})

const goDetailPage = () => {
  router.push('member/detail')
}

// 데이트피커
const searchDate = ref('')
const dateButton = ref('')
const datePickerButton = ref('')
const clickDateMode = ref('day')

const handleClickSetDay = () => {
  searchDate.value = ''
  clickDateMode.value = 'day'
  const today = dayjs()
  searchDate.value = [today, today]
}

const handleClickSetWeek = () => {
  searchDate.value = ''
  clickDateMode.value = 'week'
  const today = dayjs()
  const lastWeek = dayjs().subtract(6, 'day').endOf('day')
  searchDate.value = [lastWeek, today]
}

const handleClickSetMonth = () => {
  searchDate.value = ''
  clickDateMode.value = 'month'
  const startDay = dayjs().startOf('day')
  const endDay = dayjs().subtract(30, 'day').endOf('day')
  searchDate.value = [endDay, startDay]
}

const handleClickDate = () => {
  searchDate.value = ''
  clickDateMode.value = ''
}

onMounted(() => {
  handleClickSetDay()
})

const selectDate = () => {
  datePickerButton.value.selectDate()
}

const closeMenu = () => {
  datePickerButton.value.closeMenu()
}

// 팝업
const popup: IModalPopup = reactive({
  downloadResonPopup: {
    show: false,
  },
})
function openDownloadResonPopup() {
  popup.downloadResonPopup.show = true
}
function handleCancel() {
  popup.downloadResonPopup.show = false
}
</script>

<template>
  <div>
    <h2 class="title">회원 관리</h2>
    <div class="content-box">
      <SearchForm use-reset>
        <SearchItem label="접속일">
          <div class="datepicker">
            <div class="datepicker__btns">
              <button type="button" :class="{ 'is-selected': clickDateMode === 'day' }" @click="handleClickSetDay">일간</button>
              <button type="button" :class="{ 'is-selected': clickDateMode === 'week' }" @click="handleClickSetWeek('week')">주간</button>
              <button type="button" :class="{ 'is-selected': clickDateMode === 'month' }" @click="handleClickSetMonth">월간</button>
              <button type="button" :class="{ 'is-selected': clickDateMode === '' }">직접선택</button>
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
                <button type="button" class="btn__line--negative-sm" @click="closeMenu">취소</button>
                <button type="button" class="btn__full--primary-sm" @click="selectDate">선택</button>
              </template>
            </VueDatePicker>
          </div>
        </SearchItem>
        <SearchItem>
          <SearchItem label="가입 번호">
            <CustomInput v-model="searchForm.signNum" type="number" width="268px" />
          </SearchItem>
          <SearchItem label="사업자 번호">
            <CustomInput v-model="searchForm.licenseNm" type="number" width="268px" />
          </SearchItem>
          <SearchItem label="담당자">
            <CustomInput v-model="searchForm.mgmtNm" width="268px" />
          </SearchItem>
        </SearchItem>
      </SearchForm>

      <div class="table-header">
        <p class="total">total <em>10</em></p>
        <button type="button" class="btn__line--primary-md" @click="openDownloadResonPopup">
          <icon name="download__line--855" width="24" height="24" alt="" />
          엑셀 다운로드
        </button>
      </div>
      <el-table :data="memberList" style="width: 100%" empty-text="조회된 내용이 없습니다." @row-click="goDetailPage">
        <el-table-column type="index" label="No" align="center" width="80" />
        <el-table-column prop="openDate" align="center" width="150">
          <template #header> 비즈온<br />개통 일자 </template>
        </el-table-column>
        <el-table-column prop="signNum" label="가입 번호" align="center" min-width="180" />
        <el-table-column prop="status" label="가입 상태" align="center" width="150" />
        <el-table-column prop="clientMgNm" align="center" min-width="120">
          <template #header> 고객사<br />담당자명 </template>
        </el-table-column>
        <el-table-column prop="clientLicenseNm" align="center" min-width="180">
          <template #header> 고객사<br />사업자 번호 </template>
        </el-table-column>
        <el-table-column prop="connectDate" label="최종 접속일" align="center" width="150" />
        <el-table-column prop="connectIP" label="접속 IP" align="center" min-width="180" />
        <el-table-column prop="clientMgPhNm" align="center" min-width="180">
          <template #header> 고객사 담당자<br />전화번호 </template>
        </el-table-column>
        <el-table-column prop="clientMgMail" align="center" min-width="180">
          <template #header> 고객사 담당자<br />이메일 </template>
        </el-table-column>
        <el-table-column prop="mgmtNm" align="center" min-width="120">
          <template #header> 관리 영업<br />사원명 </template>
        </el-table-column>
        <el-table-column prop="mgmtPhNm" align="center" min-width="180">
          <template #header> 관리 영업 사원<br />전화번호 </template>
        </el-table-column>
        <el-table-column prop="mgmtMail" align="center" min-width="180">
          <template #header> 관리 영업 사원<br />이메일 </template>
        </el-table-column>
      </el-table>
      <Pagination :total-count="paginationOptions.totalCount" :limit="paginationOptions.limit" />
    </div>

    <!-- 문서 다운로드 사유 팝업 -->
    <common-modal v-model="popup.downloadResonPopup.show" title="문서 다운로드 사유" confirm-text="저장" @cancel="handleCancel" @confirm="handleCancel">
      <template #content>
        &#42; 문서 다운로드 사유를 선택해주세요.
        <div class="mt-4 box--f3f">
          <el-radio-group class="flex-col gap-2.5">
            <el-radio value="업무 보고용"> 업무 보고용 </el-radio>
            <el-radio value="단순 데이터 대조용"> 단순 데이터 대조용 </el-radio>
            <el-radio value="이벤트 대상자 추출용"> 이벤트 대상자 추출용 </el-radio>
          </el-radio-group>
        </div>
      </template>
    </common-modal>
  </div>
</template>
