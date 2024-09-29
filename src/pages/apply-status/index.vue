<script setup lang="ts">
import ApplyStatus from './components/ApplyStatus.vue'
import Feedback from './components/Feedback.vue'
import SubjectiveFeedback from './components/SubjectiveFeedback.vue'

const activeTab = ref('applyStatus')
</script>

<template>
  <div>
    <div class="title">
      <h2>증속 신청현황</h2>
      <p class="title__desc">고객사별 증속 신청현황 입니다.</p>
    </div>
    <div class="content-box">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="증속신청현황" name="applyStatus">
          <ApplyStatus />
        </el-tab-pane>
        <el-tab-pane label="고객만족도평가" name="feedback">
          <Feedback />
        </el-tab-pane>
        <el-tab-pane label="고객만족도평가 (주관식)" name="subjectiveFeedback">
          <SubjectiveFeedback />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
