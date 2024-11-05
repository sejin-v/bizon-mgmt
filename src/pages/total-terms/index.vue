<script lang="ts" setup>
import { IPaginationOptions, ITermsData, ITermsParams } from '~/types';

const searchOptionList = [
  {
    label: '메뉴 이름',
    value: 'tadvPrvsLinkNm',
  },
  {
    label: '메뉴 URL',
    value: 'tadvPrvsLinkUrlAddr',
  },
];

const searchForm = reactive({
  searchOption: 'tadvPrvsLinkNm',
  keyword: '',
});

const searchedForm = reactive({
  searchOption: 'tadvPrvsLinkNm',
  keyword: '',
});

const termsList = ref<ITermsData[]>();
const termsData = ref<ITermsData>({
  chgDttm: '',
  regDttm: '',
  rowNum: '',
  tadvPrvsLinkId: '',
  tadvPrvsLinkNm: '',
  tadvPrvsLinkUrlAddr: '',
  updateTadvPrvsLinkId: '',
});

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 0,
  currentPage: 1,
  limit: 10,
});

const confirmOptions = reactive({
  content: '',
  center: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  hideCancelButton: true,
});

const menuUrlPopup = ref(false);
const mode = ref('');
const getParams = () => {
  const params: ITermsParams = {
    page: paginationOptions.currentPage,
    perPageNum: paginationOptions.limit,
  };
  if (searchedForm.keyword) {
    params[searchedForm.searchOption] = searchedForm.keyword;
  }
  return params;
};

const getTermsList = async (params: ITermsParams) => {
  const result = await request.get('/bizon/mgmt/api/terms/list', {
    params,
    headers: {
      'X-COMMAND': 'P05007',
    },
  });
  return result.data.data;
};

const handleRowClick = async (target: ITermsData) => {
  const params = {
    tadvPrvsLinkId: target.tadvPrvsLinkId,
  };
  const result = await request.get('/bizon/mgmt/api/terms/detail', {
    params,
    headers: {
      'X-COMMAND': 'P05103',
    },
  });
  termsData.value = result.data.data;
  termsData.value.updateTadvPrvsLinkId = termsData.value.tadvPrvsLinkId;
  mode.value = 'detail';
  menuUrlPopup.value = true;
};
const openNoticeCreate = () => {
  mode.value = 'create';
  menuUrlPopup.value = true;
};

const initTermsData = () => {
  termsData.value = {
    chgDttm: '',
    regDttm: '',
    rowNum: '',
    tadvPrvsLinkId: '',
    tadvPrvsLinkNm: '',
    tadvPrvsLinkUrlAddr: '',
    updateTadvPrvsLinkId: '',
  };
};
const handleConfirm = async () => {
  const data: {
    tadvPrvsLinkNm: string;
    tadvPrvsLinkUrlAddr: string;
    tadvPrvsLinkId?: string;
  } = {
    tadvPrvsLinkNm: termsData.value.tadvPrvsLinkNm,
    tadvPrvsLinkUrlAddr: termsData.value.tadvPrvsLinkUrlAddr,
    tadvPrvsLinkId: termsData.value.tadvPrvsLinkId,
  };
  try {
    if (mode.value === 'detail') {
      data.updateTadvPrvsLinkId = termsData.value.updateTadvPrvsLinkId;
      await request.post(
        '/bizon/mgmt/api/terms/update',
        { ...data },
        {
          headers: {
            'X-COMMAND': 'P05103',
          },
        }
      );
      initTermsData();
    } else {
      await request.post(
        '/bizon/mgmt/api/terms/insert',
        { ...data },
        {
          headers: {
            'X-COMMAND': 'P05103',
          },
        }
      );
    }
    handleSearch();
    menuUrlPopup.value = false;
  } catch (error: any) {
    if (error.code === '40000000') {
      confirmOptions.content = '잘못된 요청입니다.';
      openConfirm(confirmOptions);
      return;
    }
    if (error.code === '40400001') {
      confirmOptions.content = '수정할 담당 영업사원 정보가 없습니다.';
      openConfirm(confirmOptions);
      return;
    }
  }
};
const handleCancel = () => {
  menuUrlPopup.value = false;
  initTermsData();
};

const saveSearchedForm = () => {
  searchedForm.searchOption = searchForm.searchOption;
  searchedForm.keyword = searchForm.keyword;
};

const handleSearch = async () => {
  paginationOptions.currentPage = 1;
  saveSearchedForm();
  const params = getParams();
  const result = await getTermsList(params);
  termsList.value = result.termsDTOList;
  paginationOptions.totalCount = result.totalCount;
};

const handlePageChange = async () => {
  const params = getParams();
  const result = await getTermsList(params);
  termsList.value = result.termsDTOList;
  paginationOptions.totalCount = result.totalCount;
};

onMounted(async () => {
  handleSearch();
});
</script>

<template>
  <div>
    <div class="title">
      <h2>전체 약관 목록</h2>
      <p class="title__desc">서비스 관련 약관을 관리합니다.</p>
    </div>
    <div class="content-box">
      <SearchForm @search="handleSearch">
        <SearchItem label="메뉴이름">
          <CustomDropdown
            v-model="searchForm.searchOption"
            :options="searchOptionList"
          />
          <CustomInput
            @keyupEnter="handleSearch"
            v-model="searchForm.keyword"
            placeholder="검색어를 입력해주세요."
            class="flex-1"
          />
        </SearchItem>
      </SearchForm>

      <div class="table-header">
        <p class="total">
          total <em>{{ paginationOptions.totalCount }}</em>
        </p>
      </div>
      <el-table
        :data="termsList"
        style="width: 100%"
        class="no-cursor"
        @row-click="handleRowClick"
      >
        <el-table-column prop="rowNum" label="No" align="center" width="80" />
        <el-table-column
          prop="tadvPrvsLinkNm"
          label="메뉴명"
          align="center"
          min-width="200"
        />
        <el-table-column label="메뉴 URL" min-width="300">
          <template #default="scope">
            <a href="javascript:void(0);" class="hover:underline">
              {{ scope.row.tadvPrvsLinkUrlAddr }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="chgDttm"
          label="수정일"
          align="center"
          width="150"
        >
          <template #default="scope">
            {{ scope.row.chgDttm ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="regDttm"
          label="등록일"
          align="center"
          width="150"
        />
      </el-table>
      <Pagination
        :total-count="paginationOptions.totalCount"
        :limit="paginationOptions.limit"
        @click="handlePageChange"
      />
      <div class="flex justify-end w-full mt-[32px]">
        <button
          type="button"
          class="btn__full--primary-md"
          @click="openNoticeCreate"
        >
          등록
        </button>
      </div>
    </div>

    <!-- 메뉴 링크 관리 팝업 -->
    <common-modal
      v-model="menuUrlPopup"
      title="메뉴 링크 관리"
      :confirm-text="mode === 'detail' ? '저장' : '등록'"
      @cancel="handleCancel"
      @close="handleCancel"
      @confirm="handleConfirm"
    >
      <template #content>
        <form class="form">
          <FormItem label="메뉴ID">
            <CustomInput
              v-model="termsData.updateTadvPrvsLinkId"
              placeholder="메뉴ID를 입력해주세요."
            />
          </FormItem>
          <FormItem label="메뉴명">
            <CustomInput
              v-model="termsData.tadvPrvsLinkNm"
              placeholder="메뉴명을 입력해주세요."
            />
          </FormItem>
          <FormItem label="메뉴 URL">
            <CustomInput
              v-model="termsData.tadvPrvsLinkUrlAddr"
              placeholder="관련 URL을 입력해주세요."
            />
          </FormItem>
        </form>
      </template>
    </common-modal>
  </div>
</template>
