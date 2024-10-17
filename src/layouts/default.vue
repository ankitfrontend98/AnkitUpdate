<template>
  <v-app>
    <AppHeader/>
    <v-main :class="[darkMode ? 'dark-background' : '']">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
 import { useTheme } from 'vuetify';
import AppHeader from '../components/AppHeader.vue';
import { computed } from 'vue';

const theme = useTheme();

const darkMode = computed(() => {
  return theme.global.current.value.dark;
});
</script>
<style scoped>
.dark-background {
  background: radial-gradient(54.09% 160.1% at 50% -60.1%, #2B3F85 0%, #0F0F1B 100%), #FFF !important;
  /* background-image: url(../assets/Dashboard.png); */
}
</style>