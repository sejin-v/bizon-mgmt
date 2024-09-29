<script lang="ts" setup>
const searchForm = reactive({
  applyDate: '',
  signNum: '',
  licenseNm: '',
})

const applyStatusList = [
  {
    applyDate: '2024-05-03', // 비즈온 개통 일자
    clientMgNm: '손*민', // 고객사담당자명
    clientMgPhNm: '010-****-1111', // 고객사담당자 전화번호
    service: '비즈온 Standard',
    signNum: '*******1231', // 가입번호
    licenseNm: '123-234-345', // 사업자 번호
    clientNm: 'AA 반도체', // 고객사 명
    applicationTraffic: {
      // 청약트래픽
      value1: '300M',
      value2: '500M',
    },
    increaseTraffic: {
      // 증속트래픽
      value1: '300M',
      value2: '1G',
    },
    increaseStatus: 'Y', // 증속 완료
    applicationStatus: 'Y', // 청약 속도 원복
  },
]

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
      <!-- datepicker -->
    </SearchItem>
    <SearchItem>
      <el-radio>
        <SearchItem label="가입 번호">
          <CustomInput v-model="searchForm.signNum" />
        </SearchItem>
      </el-radio>
      <el-radio>
        <SearchItem label="사업자 번호">
          <CustomInput v-model="searchForm.licenseNm" />
        </SearchItem>
      </el-radio>
    </SearchItem>
  </SearchForm>
  <div class="table-header">
    <p class="total">total <em>10</em></p>
    <button type="button" class="btn__line--primary-md" @click="openDownloadResonPopup">
      <icon name="download__line--855" width="24" height="24" alt="" class="ml-2.5" />
      엑셀 다운로드
    </button>
  </div>
  <el-table :data="applyStatusList" style="width: 100%" empty-text="조회된 내용이 없습니다.">
    <el-table-column prop="applyDate" label="증속 신청일" align="center" width="150" />
    <el-table-column prop="clientMgNm" align="center" min-width="120">
      <template #header> 고객사<br />담당자 명 </template>
    </el-table-column>
    <el-table-column prop="clientMgPhNm" align="center" min-width="180">
      <template #header> 고객사<br />담당자 전화번호 </template>
    </el-table-column>
    <el-table-column prop="service" label="서비스" align="center" min-width="180" />
    <el-table-column prop="signNum" label="가입 번호" align="center" min-width="180" />
    <el-table-column prop="licenseNm" label="사업자 번호" align="center" min-width="180" />
    <el-table-column prop="clientNm" label="고객사 명" align="center" width="150" />
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
    <el-table-column prop="increaseTraffic" label="증속트래픽" align="center" width="120">
      <template #default="scope">
        <div class="flex justify-center">
          <div class="flex flex-col items-end">
            <p class="flex items-center">{{ scope.row.increaseTraffic.value1 }}<icon name="triangle__full--525" width="11" height="9" alt="" class="ml-2.5" /></p>
            <p class="flex items-center">{{ scope.row.increaseTraffic.value2 }}<icon name="triangle__full--525" width="11" height="9" alt="" class="ml-2.5 rotate-180" /></p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="increaseStatus" label="증속 완료" align="center" width="150" />
    <el-table-column prop="applicationStatus" label="청약 속도 원복" align="center" width="150" />
  </el-table>
  <Pagination />

  <!-- 문서 다운로드 사유 팝업 -->
  <common-modal v-model="popup.downloadResonPopup.show" title="문서 다운로드 사유" confirm-text="저장" @cancel="handleCancel" @confirm="handleCancel">
    <template #content>
      &#42; 문서 다운로드 사유를 선택해주세요.
      <div class="mt-4 box--f3f">
        <el-radio-group v-model="applyStatus" class="flex-col gap-2.5">
          <el-radio value="Y"> 업무 보고용 </el-radio>
          <el-radio value="N"> 단순 데이터 대조용 </el-radio>
          <el-radio value="N"> 이벤트 대상자 추출용 </el-radio>
        </el-radio-group>
      </div>
    </template>
  </common-modal>
</template>
