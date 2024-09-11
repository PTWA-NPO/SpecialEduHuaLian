<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <!-- <router-view /> -->
</template>
<script>
import fetchJson from '@/utilitys/fetch-json.js';
export default {
  name: 'App',
};
</script>
<style lang="scss">
@font-face {
  font-family: 'YuanQuan';
  src: url('@/assets/fonts/YuanQuan/BpmfGenSenRounded-M.ttf') format('truetype');
}
.navbar {
  background-color: #57B9D9; 
  height: 10vh; 
  width: 100%; 
  margin: 0;
  .navbar-brand {
    img{
        max-width: 70%
    }
  }
  img {
    max-width: 80%;
  }
  
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>