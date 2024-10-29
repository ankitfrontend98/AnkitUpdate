// router/index.ts
import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { useAuth0 } from '@auth0/auth0-vue';

// Create the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
});


router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  if (to.query.error === 'access_denied') {
    logout({
      returnTo: `${window.location.origin}/login`
    });
    return;
  }
  if (!isAuthenticated.value) {
    loginWithRedirect({
      loginHint: JSON.stringify({ action: "save"})
    });
  }
  else {
    const code = localStorage.getItem('code');
    const state = localStorage.getItem('state');
    if (code === "undefined" || state === "undefined") {
      localStorage.setItem('code', to.query.code || code);
      localStorage.setItem('state', to.query.state || state);
    }

    if (!to.query.code || !to.query.state) {
      next({
        ...to,
        query: {
          ...to.query, 
          code: code || to.query.code,  
          state: state || to.query.state 
        },
        replace: true 
      });
    } else {
      next();
    }
  }
});



export default router;
