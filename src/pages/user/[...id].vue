<script lang="ts" setup>
import { IUserDetailData } from '~/types';

const router = useRouter();
const route = useRoute();

const applyStatus = ref('Y');
const emailOption = reactive([
  { label: '직접입력', value: 'self' },
  { label: 'gmail.com', value: 'gmail.com' },
  { label: 'naver.com', value: 'naver.com' },
]);
const cucoEmalDomain = ref('self');
const bizEmpEmalDomain = ref('self');

const userData = ref<IUserDetailData>({
  entrNo: '', // 가입번호
  cucoChrrNm: '', // 고객사담당자명
  brno: '', // 고객사 사업자 번호
  connectDate: '', // 최종 접속일
  connectIP: '', // 접속IP
  cucoChrrHpno: '', // 고객사담당자 전화번호
  cucoEmalAddr: '', //  고객사담당자 이메일
  cucoEmalDomain: '', //  고객사담당자 이메일
  bizEmpEmno: '', //영업 사원 사번
  bizEmpNm: '', // 관리 영업 사원명
  bizEmpHpno: '', // 관리 영업 사원 전화번호
  bizEmpEmalAddr: '', // 관리 영업 사원 이메일
  bizEmpEmalDomain: '', // 관리 영업 사원 이메일
  cucoNm: '', // 고객사 명
});

const handleChange = (target: string, domain: string) => {
  if (domain === 'self') return;
  userData.value[target] = domain;
};

const handleSaveUserData = () => {
  const data = {
    entrNo: userData.value.entrNo,
    cucoChrrNm: userData.value.cucoChrrNm,
    cucoChrrHpno: userData.value.cucoChrrHpno,
    cucoEmalAddr: `${userData.value.cucoEmalAddr}@${userData.value.cucoEmalDomain}`,
    bizEmpEmno: userData.value.bizEmpEmno,
    bizEmpEmalAddr: `${userData.value.bizEmpEmalAddr}@${userData.value.bizEmpEmalDomain}`,
    bizEmpHpno: userData.value.bizEmpHpno,
  };
  request.post('/bizon/mgmt/api/user-management/user-detail-update', {
    ...data,
  });
};
onMounted(async () => {
  const result = await request.get(
    '/bizon/mgmt/api/user-management/user-detail',
    {
      params: { encEntrNo: route.params.id },
    }
  );
  userData.value = result.data.data;
  const bizEmpEmalAddr = result.data.data.bizEmpEmalAddr.split('@');
  userData.value.bizEmpEmalAddr = bizEmpEmalAddr[0];
  userData.value.bizEmpEmalDomain = bizEmpEmalAddr[1];
  const cucoEmalAddr = result.data.data.cucoEmalAddr.split('@');
  userData.value.cucoEmalAddr = cucoEmalAddr[0];
  userData.value.cucoEmalDomain = cucoEmalAddr[1];
});
</script>

<template>
  <div>
    <div class="title">
      <h2>회원 관리</h2>
      <p class="title__desc">
        비즈온 서비스를 이용 중인 회원 정보입니다. 회원 정보를 수정할 수
        있습니다.
      </p>
    </div>
    <div class="content-box">
      <form class="form">
        <FormItem group>
          <FormItem label="가입 번호">
            {{ userData.entrNo }}
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
            {{ userData.brno }}
          </FormItem>
          <FormItem label="고객사 명"> {{ userData.cucoNm }}</FormItem>
        </FormItem>
        <FormItem group>
          <FormItem label="고객사 담당자 명">
            <CustomInput v-model="userData.cucoChrrNm" max-length="20" />
          </FormItem>
          <FormItem label="고객사 담당자 연락처">
            <CustomInput v-model="userData.cucoChrrHpno" />
          </FormItem>
        </FormItem>
        <FormItem label="고객사 담당자 이메일">
          <CustomInput v-model="userData.cucoEmalAddr" /><span>&#64;</span>
          <CustomInput v-model="userData.cucoEmalDomain" width="263px" />
          <CustomDropdown
            v-model="cucoEmalDomain"
            :options="emailOption"
            @change="handleChange('cucoEmalDomain', cucoEmalDomain)"
          />
        </FormItem>
        <FormItem group>
          <FormItem label="담당 영업사원 명">
            <CustomInput v-model="userData.bizEmpNm" max-length="20" />
          </FormItem>
          <FormItem label="담당 영업사원 연락처">
            <CustomInput v-model="userData.bizEmpHpno" />
          </FormItem>
        </FormItem>
        <FormItem label="담당 영업사원 이메일">
          <CustomInput v-model="userData.bizEmpEmalAddr" /><span>&#64;</span>
          <CustomInput v-model="userData.bizEmpEmalDomain" width="263px" />
          <CustomDropdown
            v-model="bizEmpEmalDomain"
            :options="emailOption"
            @change="handleChange('bizEmpEmalDomain', bizEmpEmalDomain)"
          />
        </FormItem>
      </form>
      <div class="flex justify-end mt-4">
        <button
          type="button"
          class="btn__line--primary-md"
          @click="router.back()"
        >
          목록으로
        </button>
        <button
          type="button"
          class="btn__full--primary-md"
          @click="handleSaveUserData"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>
