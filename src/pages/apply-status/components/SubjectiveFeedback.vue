<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import dayjs from 'dayjs'

const searchForm = reactive({
  applyDate: '',
  signNum: '',
  applicationTraffic: '',
  applicationTrafficOption: [{ label: '미정', value: '미정' }],
})
const feedbackList = [
  {
    date: '2024-05-03', // 평가일
    signNum: '******1234', // 가입 번호
    signStatus: '정상', // 가입 상태
    applicationTraffic: {
      // 청약트래픽
      value1: '300M',
      value2: '500M',
    },
    question: '이십글자를맞출거에요이십글자를맞출거에요이십글자를맞출거에요이십글자를맞출거에요얍', // 질의
    answer: '이십글자를맞출거에요이십글자를맞출거에요이십글자를맞출거에요이십글자를맞출거에요얏', // 답변
    answerDate: '2024-05-03', // 답변일
  },
]

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 1000,
  limit: 20,
})

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
        <CustomInput v-model="searchForm.signNum" type="number" width="292px" />
      </SearchItem>
      <SearchItem label="청약트래픽">
        <CustomDropdown v-model="searchForm.applicationTraffic" placeholder="선택하세요" :options="searchForm.applicationTrafficOption" />
      </SearchItem>
    </SearchItem>
  </SearchForm>

  <div class="table-header">
    <p class="total">total <em>10</em></p>
  </div>
  <el-table :data="feedbackList" style="width: 100%" empty-text="조회된 내용이 없습니다." @row-click="openDownloadResonPopup">
    <el-table-column type="index" label="No" align="center" width="80" />
    <el-table-column prop="date" label="평가일" align="center" width="150" />
    <el-table-column prop="signNum" label="가입 번호" align="center" min-width="180" />
    <el-table-column prop="signStatus" label="가입 상태" align="center" width="150" />
    <el-table-column prop="applicationTraffic" label="청약트래픽" align="center" width="150">
      <template #default="scope">
        <div class="flex justify-center">
          <div class="flex flex-col items-end">
            <p class="flex items-center">{{ scope.row.applicationTraffic.value1 }}<icon name="triangle__full--525" width="11" height="9" alt="" class="ml-2.5" /></p>
            <p class="flex items-center">{{ scope.row.applicationTraffic.value2 }}<icon name="triangle__full--525" width="11" height="9" alt="" class="ml-2.5 rotate-180" /></p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="question" label="질의" align="center" min-width="532" />
    <el-table-column prop="answer" label="답변" align="center" min-width="532" />
    <el-table-column prop="answerDate" label="답변일" align="center" width="150" />
  </el-table>
  <Pagination :total-count="paginationOptions.totalCount" :limit="paginationOptions.limit" />

  <!-- 문서 다운로드 사유 팝업 -->
  <common-modal v-model="popup.downloadResonPopup.show" title="더 나은 서비스를 위해 추가적으로 하고 싶은 말씀을 자유롭게 써주시기 바랍니다." desc="2024-09-09" :show-close="false">
    <template #content>
      {{ feedbackList[0].answer }}
    </template>
    <template #footer>
      <button type="button" class="btn__line--primary-md" @click="handleCancel">닫기</button>
    </template>
  </common-modal>
</template>
