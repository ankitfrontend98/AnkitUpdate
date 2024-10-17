<template>
    <v-app :class="[darkMode ? 'dark-theme-active' : '']">
      <v-main>
        <router-view />
      </v-main>
  </v-app>
  
</template>

<script setup>
import { useTheme } from 'vuetify';
import { computed } from 'vue';

const theme = useTheme();

const darkMode = computed(() => {
  return theme.global.current.value.dark;
});
  //
</script>
<style>
 .dark-theme-active {
    background: radial-gradient(54.09% 160.1% at 50% -60.1%, #2B3F85 0%, #0F0F1B 100%), #FFF !important;
    backdrop-filter: blur(21px);
  }
</style>