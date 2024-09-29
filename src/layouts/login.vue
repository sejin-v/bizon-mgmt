<script setup lang="ts"></script>

<template>
  <main class="layout">
    <header class="header--login">
      <div class="logo-wrap">
        <h1 class="logo">
          <icon name="logo-bizon--fff" width="131" height="28" alt="BIZON" class="mr-2.5" />
          <span>Precare</span>
        </h1>
        <p>기업인터넷 전용 회선 <em>비즈온 증속신청 서비스</em></p>
      </div>
      <p>SAFE &#38; SMART U&#43; LINE BIZON</p>
    </header>
    <div class="content">
      <router-view />
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
