<template>
  <div class="login-page">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { onMounted } from 'vue';
import { inject } from 'vue';
const notify = inject('notify');
const { loginWithRedirect } = useAuth0();

onMounted(() => {
  notify('Loading...', {
    color: 'info',
    timeout: 4000,
  })
  loginWithRedirect();
})

</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
