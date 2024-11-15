<script lang="ts" setup>
import dayjs from 'dayjs';
import CustomTextarea from '~/example/components/custom-textarea/CustomTextarea.vue';

const router = useRouter();
const route = useRoute();
const isCreateMode = ref(false);
const confirmOption = reactive({
  content: '수정 되었습니다.',
  center: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  hideCancelButton: true,
});
const detailForm = ref({
  preAtclKdCd: '',
  atclCntn: '',
  atclKdCd: 'ANNC',
  atclSno: '',
  atclTit: '',
  chgDttm: '',
  chgrId: '',
  regDttm: '',
  regtId: '',
  useYn: 'Y',
});

const initData = ref('');

const vallidateBoardData = () => {
  if (
    !detailForm.value.atclKdCd ||
    !detailForm.value.atclTit ||
    !detailForm.value.atclCntn ||
    !detailForm.value.useYn
  ) {
    confirmOption.content = '필수값을 확인하세요.';
    openConfirm(confirmOption);
    return false;
  }
  return true;
};

const handleSaveBoard = async () => {
  if (!vallidateBoardData()) return;
  const data = {
    atclKdCd: detailForm.value.preAtclKdCd,
    changeAtclKdCd: detailForm.value.atclKdCd,
    atclTit: detailForm.value.atclTit,
    atclCntn: detailForm.value.atclCntn,
    useYn: detailForm.value.useYn,
    atclSno: detailForm.value.atclSno,
  };
  try {
    await request.post(
      '/bizon/mgmt/api/board/update',
      {
        ...data,
      },
      {
        headers: {
          'X-COMMAND': 'P05009',
        },
      }
    );
    confirmOption.content = '수정 되었습니다.';
    await openConfirm(confirmOption);
  } catch (error) {
    console.error(error);
  }

  handleChnageeMode(false);
};

const handleCreateBoard = async () => {
  if (!vallidateBoardData()) return;

  const data = {
    atclKdCd: detailForm.value.atclKdCd,
    atclTit: detailForm.value.atclTit,
    atclCntn: detailForm.value.atclCntn,
    useYn: detailForm.value.useYn,
  };
  try {
    await request.post(
      '/bizon/mgmt/api/board/create',
      {
        ...data,
      },
      {
        headers: {
          'X-COMMAND': 'P05009',
        },
      }
    );
    confirmOption.content = '등록 되었습니다.';
    await openConfirm(confirmOption);
    handleChnageeMode(false);
  } catch (error) {
    console.error(error);
  }
};

const handleChnageeMode = async (cancel: boolean) => {
  if (detailForm.value.atclSno) {
    if (cancel && initData.value !== JSON.stringify(detailForm.value)) {
      confirmOption.content = h('p', null, [
        h(
          'div',
          { style: 'text-align: center;' },
          '작성중인 내용이 사라집니다.'
        ),
        h('div', { style: 'text-align: center;' }, '취소 하시겠습니까?'),
      ]);
      await openConfirm(confirmOption);
    }
    isCreateMode.value = !isCreateMode.value;
    const params = {
      atclKdCd: route.query.atclKdCd,
      atclSno: route.query.atclSno,
    };
    const result = await request.get('/bizon/mgmt/api/board/detail', {
      params,
      headers: {
        'X-COMMAND': 'P05009',
      },
    });
    detailForm.value = result.data.data;
    detailForm.value.preAtclKdCd = result.data.data.atclKdCd;
  } else {
    router.push('/board');
  }
};

//
//
const handleDelete = async () => {
  const data = {
    atclKdCd: detailForm.value.atclKdCd,
    atclSno: detailForm.value.atclSno,
  };
  try {
    confirmOption.hideCancelButton = false;
    confirmOption.content = h('p', null, [
      h('div', { style: 'text-align: center;' }, '삭제 하시겠습니까?'),
      h('div', { style: 'text-align: center;' }, '삭제 후 되돌릴 수 없습니다.'),
    ]);
    await openConfirm(confirmOption);
    await request.post(
      '/bizon/mgmt/api/board/delete',
      {
        ...data,
      },
      {
        headers: {
          'X-COMMAND': 'P05009',
        },
      }
    );
    confirmOption.hideCancelButton = true;

    confirmOption.content = '삭제 되었습니다.';
    await openConfirm(confirmOption);
    router.push('/board');
  } catch (error) {
    console.error(error);
  }
};

const handleMoveList = async () => {
  router.back();
};

onMounted(async () => {
  if (route.query.atclSno) {
    const params = {
      atclKdCd: route.query.atclKdCd,
      atclSno: route.query.atclSno,
    };
    const result = await request.get('/bizon/mgmt/api/board/detail', {
      params,
      headers: {
        'X-COMMAND': 'P05009',
      },
    });
    detailForm.value = result.data.data;
    initData.value = JSON.stringify(detailForm.value);
  } else {
    isCreateMode.value = true;
  }
});
</script>

<template>
  <div>
    <div class="title">
      <h2>게시판 관리</h2>
      <p class="title__desc">FAQ와 공지사항을 관리합니다.</p>
    </div>
    <div class="content-box">
      <p class="content-box__desc">
        &#40;<em>*</em>&#41; 필수 입력 화면입니다.
      </p>
      <form class="form">
        <FormItem label="구분" required>
          <el-radio-group
            :disabled="!isCreateMode"
            v-model="detailForm.atclKdCd"
          >
            <el-radio value="ANNC"> 공지사항 </el-radio>
            <el-radio value="FAQ"> FAQ </el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="게시" required>
          <el-radio-group :disabled="!isCreateMode" v-model="detailForm.useYn">
            <el-radio value="Y"> 게시 </el-radio>
            <el-radio value="N"> 미게시 </el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="제목" required>
          <CustomInput
            :disabled="!isCreateMode"
            v-model="detailForm.atclTit"
            max-length="20"
            placeholder="제목을 입력하세요. 최대 20글자"
          />
        </FormItem>
        <FormItem label="내용" required>
          <CustomTextarea
            :disabled="!isCreateMode"
            v-model="detailForm.atclCntn"
            max-length="300"
            height="329"
            use-count
            placeholder="내용을 입력하세요. 최대 300자"
          />
        </FormItem>

        <!-- 상세화면인 경우 노출되는 영역 -->
        <template v-if="!isCreateMode">
          <div class="mt-4 divide__horizon--dce" />
          <FormItem group>
            <FormItem label="등록자">{{ detailForm.regtId ?? '-' }}</FormItem>
            <FormItem label="수정자">{{ detailForm.chgrId ?? '-' }}</FormItem>
          </FormItem>
          <FormItem group>
            <FormItem label="등록일">{{
              detailForm.regDttm
                ? dayjs(detailForm.regDttm).format('YYYY-MM-DD')
                : '-'
            }}</FormItem>
            <FormItem label="수정일">{{
              detailForm.chgDttm
                ? dayjs(detailForm.chgDttm).format('YYYY-MM-DD')
                : '-'
            }}</FormItem>
          </FormItem>
        </template>
      </form>
      <div class="content-box__btn">
        <template v-if="isCreateMode">
          <button
            type="button"
            class="btn__line--negative-md"
            @click="handleChnageeMode(true)"
          >
            취소
          </button>
          <button
            v-if="detailForm.atclSno"
            type="button"
            class="btn__full--primary-md"
            @click="handleSaveBoard"
          >
            저장
          </button>
          <button
            v-else
            type="button"
            class="btn__full--primary-md"
            @click="handleCreateBoard"
          >
            등록
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn__line--negative-md"
            @click="handleDelete"
          >
            삭제
          </button>
          <button
            type="button"
            class="btn__line--primary-md"
            @click="handleChnageeMode(false)"
          >
            수정
          </button>
          <button
            type="button"
            class="btn__full--primary-md"
            @click="handleMoveList"
          >
            목록
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
name: boardDetail
</route>
