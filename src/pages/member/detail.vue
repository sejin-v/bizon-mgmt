<script lang="ts" setup>
const router = useRouter()

const applyStatus = ref('Y')
const email = ref('직접입력')
const emailOption = reactive([
  { label: '직접입력', value: 1 },
  { label: 'gmail.com', value: 2 },
  { label: 'naver.com', value: 3 },
])

const memberInfoForm = reactive({
  signNum: '76543456', // 가입번호
  clientMgNm: '손*민', // 고객사담당자명
  clientLicenseNm: '123-234-345', // 고객사 사업자 번호
  connectDate: '2024-09-09', // 최종 접속일
  connectIP: '192.168.***.1', // 접속IP
  clientMgPhNm: '010-0000-1111', // 고객사담당자 전화번호
  clientMgMail: '20***@naver.com', //  고객사담당자 이메일
  mgmtNm: '손*민', // 관리 영업 사원명
  mgmtPhNm: '010-0000-1111', // 관리 영업 사원 전화번호
  mgmtMail: 'son***@naver.com', // 관리 영업 사원 이메일
})
</script>

<template>
  <div>
    <div class="title">
      <h2>회원 관리</h2>
      <p class="title__desc">비즈온 서비스를 이용 중인 회원 정보입니다. 회원 정보를 수정할 수 있습니다.</p>
    </div>
    <div class="content-box">
      <form class="form">
        <FormItem group>
          <FormItem label="가입 번호">
            {{ memberInfoForm.signNum }}
          </FormItem>
          <FormItem label="종속 신청 가능 여부">
            <el-radio-group v-model="applyStatus">
              <el-radio value="Y"> Y </el-radio>
              <el-radio value="N"> N </el-radio>
            </el-radio-group>
          </FormItem>
        </FormItem>
        <FormItem group>
          <FormItem label="사업자 번호">
            {{ memberInfoForm.clientLicenseNm }}
          </FormItem>
          <FormItem label="고객사 명"> (주) 애버커스 </FormItem>
        </FormItem>
        <FormItem group>
          <FormItem label="고객사 담당자 명">
            <CustomInput v-model="memberInfoForm.clientMgNm" max-length="20" />
          </FormItem>
          <FormItem label="고객사 담당자 연락처">
            <CustomInput v-model="memberInfoForm.clientMgPhNm" type="tel" />
          </FormItem>
        </FormItem>
        <FormItem label="고객사 담당자 이메일">
          <CustomInput v-model="memberInfoForm.clientMgMail" /><span>&#64;</span>
          <CustomInput v-model="memberInfoForm.clientMgMail" width="263px" />
          <CustomDropdown v-model="email" :options="emailOption" />
        </FormItem>
        <FormItem group>
          <FormItem label="담당 영업사원 명">
            <CustomInput v-model="memberInfoForm.mgmtNm" max-length="20" />
          </FormItem>
          <FormItem label="담당 영업사원 연락처">
            <CustomInput v-model="memberInfoForm.mgmtPhNm" type="tel" />
          </FormItem>
        </FormItem>
        <FormItem label="담당 영업사원 이메일">
          <CustomInput v-model="memberInfoForm.mgmtMail" /><span>&#64;</span>
          <CustomInput v-model="memberInfoForm.mgmtMail" width="263px" />
          <CustomDropdown v-model="email" :options="emailOption" />
        </FormItem>
      </form>
      <div class="flex justify-end mt-4">
        <button type="button" class="btn__line--primary-md" @click="router.back()">목록으로</button>
        <button type="button" class="btn__full--primary-md">저장</button>
      </div>
    </div>
  </div>
</template>
