<template>
  <div v-if="isLoading" class="loader">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
  </div>
  <div v-else>
    <v-app :class="[darkMode ? 'dark-theme-active' : '']">
      <v-main>
        <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="snackbar.timeout">
          {{ snackbar.message }}
        </v-snackbar>
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { inject, watch } from 'vue';
import { setAuthToken } from './utils/axios';
const snackbar = inject('snackbar');
const { isLoading, getAccessTokenSilently } = useAuth0();
watch(isLoading, async (state, prev) => {
  if (state !== prev && state === false) {
    const token = await getAccessTokenSilently();
    setAuthToken(token);
  }
})

const theme = useTheme();
const darkMode = computed(() => {
  return theme.global.current.value.dark;
});
</script>

<style>
.dark-theme-active {
  background: radial-gradient(54.09% 160.1% at 50% -60.1%, #2B3F85 0%, #0F0F1B 100%), #FFF !important;
  backdrop-filter: blur(21px);
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
