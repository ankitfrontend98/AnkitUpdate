import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { useAuth0 } from '@auth0/auth0-vue';
import { CLAIMS_NAMESPACE_URL, ROLE_ADMIN } from '@/constant';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, idTokenClaims } = useAuth0();
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  if (to.query.error === 'access_denied') {
    logout({ logoutParams: { returnTo: `${window.location.origin}/login` } });
    return;
  }
  if (!isAuthenticated.value) {
    loginWithRedirect({
      loginHint: JSON.stringify({ action: "save"})
    });
  }
  else {
    const claimsRoles = idTokenClaims.value[`${CLAIMS_NAMESPACE_URL}/roles`]
    if(!claimsRoles.includes(ROLE_ADMIN) && to.path === "/admin") next("/");
    else next();
  }
});

export default router;
