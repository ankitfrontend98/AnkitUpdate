<template>
  <v-app-bar :class="[isDarkMode ? 'dark-active' : '', 'my-custom-margin']" :elevation="0">
    <!-- <div class="container width-full"> -->
    <v-container>
      <div class="d-flex justify-space-between align-center">
        <!-- <h2 class="my-custom">Logo</h2> -->
        <div class="mt-4">
          <img v-if="isDarkMode" src="../assets/logo-dark.png" width="180" />
          <img v-else src="../assets/logo-light.png" width="180" />
        </div>
        <div class="d-flex margin-right">
          <div class="text-center">
            <v-menu v-model="menu" :close-on-content-click="false" location="end">
              <template v-slot:activator="{ props }">
                <v-avatar class="ml-6 cursor-pointer" v-bind="props">
                  <v-img :src="user?.picture" alt="Profile Picture" style="border-radius: 50%;"></v-img>
                </v-avatar>
              </template>
              <v-card min-width="300">
                <v-list>
                  <v-list-item :prepend-avatar="user?.picture" :subtitle="user?.email" :title="user?.name">
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item>
                    <div class="d-flex justify-space-between align-center">
                      <div class="d-flex">
                        <span>App Theme: {{ isDarkMode ? 'Dark' : 'Light' }}</span>
                      </div>
                      <input type="checkbox" class="checkbox" id="checkbox" v-model="isDarkMode">
                      <label for="checkbox"
                        :class="[isDarkMode ? 'checkbox-dark' : 'checkbox-light', 'checkbox-label']">
                        <v-icon>mdi-moon-waning-crescent</v-icon>
                        <v-icon>mdi-brightness-7</v-icon>
                        <span class="ball"></span>
                      </label>
                    </div>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item @click="handleLogout">
                    Logout
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </div>
      </div>
    </v-container>

    <!-- </div> -->
  </v-app-bar>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { ref, watch } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
const { logout, user } = useAuth0();
const theme = useTheme();
// const emit = defineEmits(['updateTheme'])
let isDarkMode = ref(false);
const menu = ref(false);
isDarkMode.value = localStorage.getItem('theme') === 'dark';

watch(isDarkMode, (newVal) => {
  theme.global.name.value = newVal ? 'dark' : 'light';
  if (newVal) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
  // emit('updateTheme', newVal);
}, { immediate: true });


function handleLogout() {
  logout({ logoutParams: { returnTo: `${window.location.origin}/login` } });
}
</script>

<style scoped>
.dark-active {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(2px);
}

/* .v-theme--dark {
    background: radial-gradient(54.09% 160.1% at 50% -60.1%, #2B3F85 0%, #0F0F1B 100%), #FFF !important;
    backdrop-filter: blur(21px);
  } */
.theme-switch .v-switch__thumb {
  background-color: transparent !important;
}

.my-custom-margin {
  background: rgba(255, 255, 255, 0.04);
  height: 80px;
  filter: drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.06)) drop-shadow(0px 1px 3px rgba(16, 24, 40, 0.10));
}

.theme-btn {
  border-radius: 37px;
  background: #E9EAF0;
  /* box-shadow: 10px green; */
  box-shadow: -7.1px -7.1px 14.2px 0px rgba(233, 234, 240, 0.70), 7.1px 7.1px 14.2px 0px rgba(36, 39, 44, 0.70);
}

.checkbox {
  opacity: 0;
  position: absolute;
}

.checkbox-label {
  width: 50px;
  height: 26px;
  border-radius: 50px;
  position: relative;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-light {
  background-color: #0f2357;
}

.checkbox-dark {
  background-color: #DCC271;
}

.fa-moon {
  color: #f1c40f;
}

.fa-sun {
  color: #f39c12;
}

.checkbox-label .ball {
  background-color: #fff;
  width: 22px;
  height: 22px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}

.checkbox:checked+.checkbox-label .ball {
  transform: translateX(24px);
}

.v-icon {
  color: #FFFFFF;
  /* Replace with your desired color */
  font-size: 18px;
}

.width-full {
  width: 100% !important;
}

@media (min-width: 1280px) {
  .v-container {
    max-width: 1700px !important;
    width: 100% !important;
    padding: 16px 4% !important;
  }
}

/* Add any necessary custom styling here */
</style>
