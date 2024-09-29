<script lang="ts" setup>
import CustomTextarea from '~/example/components/custom-textarea/CustomTextarea.vue'

const router = useRouter()

const isCreateMode = ref(false)

const detailForm = reactive({
  category: 'notice',
  post: 'Y',
  title: '',
  content: '',
})

const ChangeCreateMode = () => {
  isCreateMode.value = true
}
</script>

<template>
  <div>
    <div class="title">
      <h2>게시판 관리</h2>
      <p class="title__desc">FAQ와 공지사항을 관리합니다.</p>
    </div>
    <div class="content-box">
      <p class="content-box__desc">&#40;<em>*</em>&#41; 필수 입력 화면입니다.</p>
      <form class="form">
        <FormItem label="구분" required>
          <el-radio-group v-model="detailForm.category">
            <el-radio value="notice"> 공지사항 </el-radio>
            <el-radio value="faq"> FAQ </el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="게시" required>
          <el-radio-group v-model="detailForm.post">
            <el-radio value="Y"> 게시 </el-radio>
            <el-radio value="N"> 미게시 </el-radio>
          </el-radio-group>
        </FormItem>
        <FormItem label="제목" required>
          <CustomInput v-model="detailForm.title" max-length="20" placeholder="제목을 입력하세요. 최대 20글자" />
        </FormItem>
        <FormItem label="내용" required>
          <CustomTextarea v-model="detailForm.content" max-length="300" height="329" use-count placeholder="내용을 입력하세요. 최대 300자" />
        </FormItem>

        <!-- 상세화면인 경우 노출되는 영역 -->
        <template v-if="!isCreateMode">
          <div class="mt-4 divide__horizon--dce" />
          <FormItem group>
            <FormItem label="등록자"> admin </FormItem>
            <FormItem label="수정자"> admin </FormItem>
          </FormItem>
          <FormItem group>
            <FormItem label="등록일"> 2024-01-01 </FormItem>
            <FormItem label="수정일"> 2024-01-01 </FormItem>
          </FormItem>
        </template>
      </form>
      <div class="content-box__btn">
        <template v-if="isCreateMode">
          <button type="button" class="btn__line--negative-md">취소</button>
          <button type="button" class="btn__full--primary-md">저장</button>
        </template>
        <template v-else>
          <button type="button" class="btn__line--negative-md">삭제</button>
          <button type="button" class="btn__line--primary-md" @click="ChangeCreateMode">수정</button>
          <button type="button" class="btn__full--primary-md" @click="router.back()">목록</button>
        </template>
      </div>
    </div>
  </div>
</template>
