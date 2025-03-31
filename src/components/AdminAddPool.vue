<template>
  <div>
    <v-btn class="text-none" :color="darkMode ? '#BFAC62' : '#0F2357'" icon="mdi-plus" size="small"
      @click="openEditDialog">
    </v-btn>
    <v-tooltip activator="parent" location="bottom">Add Pools</v-tooltip>
  </div>
  <v-dialog v-model="addDialog" fullscreen transition="dialog-bottom-transition" persistent>
    <v-card :class="darkMode ? 'custom-dark-table-background' : 'custom-light-table-background'"
      class="edit-dialog-card">

      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center dialog-header">
        <span class="text-h6 font-weight-bold">Add Pool</span>
        <v-btn icon="mdi-close" variant="text" @click="addDialog = false" />
      </v-card-title>

      <!-- Scrollable Body -->
      <v-card-text class="dialog-scroll-content">
        <v-container fluid>
          <AdminAddPoolSection />
        </v-container>
      </v-card-text>

      <!-- Footer -->
      <div class="dialog-footer">
        <v-spacer />
        <v-btn :color="darkMode ? '#262A3F' : 'var(--Base-White, #FFF)'" @click="editDialog = false">Cancel</v-btn>
        &nbsp;
        &nbsp;
        <v-btn :color="darkMode ? '#BFAC62' : '#0F2357'" @click="saveEdit" :loading="loading">Save</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import AdminAddPoolSection from './AdminAddPoolSection.vue';

const addDialog = ref(false)
const loading = ref(false);
const theme = useTheme()
const darkMode = computed(() => theme.global.current.value.dark)



function openEditDialog() {
  addDialog.value = true;
}


function saveEdit() {
}

</script>

<style scoped>
.edit-dialog-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  padding: 16px 24px;
  border-bottom: 1px solid #354251;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: inherit;
}

.dialog-scroll-content {
  overflow-y: auto;
  padding: 0px !important;
  flex: 1;
}

.dialog-footer {
  padding: 12px 24px;
  border-top: 1px solid #354251;
  position: sticky;
  bottom: 0;
  background-color: inherit;
  z-index: 1;
  justify-content: flex-end;
  display: flex;
}
</style>
