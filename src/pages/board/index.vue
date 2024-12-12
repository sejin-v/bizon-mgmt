<script lang="ts" setup>
import dayjs from 'dayjs';
import { IBoardData, IBoardParams, IPaginationOptions } from '~/types';

const router = useRouter();
const boardStore = useBoardStore();
const searchOptionList = [
  {
    label: 'FAQ',
    value: 'FAQ',
  },
  {
    label: '공지사항',
    value: 'ANNC',
  },
];

const searchForm = reactive({
  atclKdCd: 'FAQ',
  keyword: '',
});

const searchedForm = reactive({
  atclKdCd: 'FAQ',
  keyword: '',
});

const boardList = ref<IBoardData[]>();

const paginationOptions: IPaginationOptions = reactive({
  totalCount: 0,
  limit: 10,
  currentPage: 1,
});

const getParams = () => {
  const params: IBoardParams = {
    page: paginationOptions.currentPage,
    perPageNum: paginationOptions.limit,
    atclKdCd: searchedForm.atclKdCd,
  };
  if (searchedForm.keyword) params.atclTit = searchedForm.keyword;
  return params;
};

const getBoardList = async (params: IBoardParams) => {
  const result = await request.get('/bizon/mgmt/api/board/list', {
    params,
    headers: {
      'X-COMMAND': 'P05008',
    },
  });
  return result.data.data;
};

const saveSearchedForm = () => {
  searchedForm.atclKdCd = searchForm.atclKdCd;
  searchedForm.keyword = searchForm.keyword;
};

const handleSearch = async () => {
  paginationOptions.currentPage = 1;
  saveSearchedForm();
  const params = getParams();
  const result = await getBoardList(params);
  boardList.value = result.articleList;
  paginationOptions.totalCount = result.totalCount;
};

const handlePageChange = async () => {
  const params = getParams();
  const result = await getBoardList(params);
  boardList.value = result.articleList;
  paginationOptions.totalCount = result.totalCount;
};

const route = useRoute();
const handleRowClick = (target) => {
  boardStore.setAtclKdCd(target.atclKdCd);
  router.push({
    path: `/board/detail`,
    query: { atclSno: target.atclSno, atclKdCd: target.atclKdCd },
  });
};
const goCreatePage = () => {
  boardStore.setAtclKdCd(searchForm.atclKdCd);
  router.push('board/detail');
};

onMounted(async () => {
  searchForm.atclKdCd = boardStore.atclKdCd;
  handleSearch();
});
</script>

<template>
  <div>
    <div class="title">
      <h2>게시판 관리</h2>
      <p class="title__desc">FAQ와 공지사항을 관리합니다.</p>
    </div>
    <div class="content-box">
      <SearchForm @search="handleSearch">
        <SearchItem label="구분">
          <CustomDropdown
            v-model="searchForm.atclKdCd"
            :options="searchOptionList"
          />
          <CustomInput
            v-model="searchForm.keyword"
            placeholder="검색어를 입력해주세요."
            @keyupEnter="handleSearch"
          />
        </SearchItem>
      </SearchForm>

      <div class="table-header">
        <p class="total">
          total <em>{{ prettyNumber(paginationOptions.totalCount) }}</em>
        </p>
      </div>
      <el-table
        :data="boardList"
        style="width: 100%"
        empty-text="조회된 내용이 없습니다."
        @row-click="handleRowClick"
      >
        <el-table-column prop="rowNum" label="No" align="center" width="80" />
        <el-table-column
          prop="atclKdCd"
          label="구분"
          align="center"
          min-width="150"
        >
          <template #default="scope">
            {{
              scope.row.atclKdCd === 'ANNC' ? '공지사항' : scope.row.atclKdCd
            }}
          </template>
        </el-table-column>
        <el-table-column prop="atclTit" label="제목" min-width="300" />
        <el-table-column
          prop="chgDttm"
          label="수정일"
          align="center"
          width="150"
        >
          <template #default="scope">
            {{
              scope.row.chgDttm
                ? dayjs(scope.row.chgDttm).format('YYYY-MM-DD')
                : '-'
            }}
          </template></el-table-column
        >
        <el-table-column
          prop="regDttm"
          label="등록일"
          align="center"
          width="150"
        >
          <template #default="scope">
            {{
              scope.row.regDttm
                ? dayjs(scope.row.regDttm).format('YYYY-MM-DD')
                : '-'
            }}
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-model="paginationOptions.currentPage"
        :total-count="paginationOptions.totalCount"
        :limit="paginationOptions.limit"
        @click="handlePageChange"
      />
      <div class="flex justify-end w-full mt-[32px]">
        <a
          href="javascript:void(0);"
          type="button"
          class="btn__full--primary-md"
          @click="goCreatePage"
          >등록</a
        >
      </div>
    </div>
  </div>
</template>
