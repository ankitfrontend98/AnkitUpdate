<template>
  <v-btn class="ma-2" color="blue-lighten-2" icon="mdi-pencil" variant="text" size="xs" @click="openEditDialog" />

  <v-dialog v-model="editDialog" max-width="900px" persistent>
    <v-card :class="darkMode ? 'custom-dark-table-background' : 'custom-light-table-background'"
      class="edit-dialog-card">

      <!-- Header -->
      <v-card-title class="d-flex justify-space-between align-center dialog-header">
        <span class="text-h6 font-weight-bold">Edit Pool Details</span>
        <v-btn icon="mdi-close" variant="text" @click="editDialog = false" />
      </v-card-title>

      <!-- Scrollable Body -->
      <v-card-text class="dialog-scroll-content">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.PoolAddress" label="Pool Address" :rules="[rules.required]"
                :error-messages="errors.PoolAddress" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.id" label="ID" readonly />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.BaseToken" label="Base Token" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.OtherToken" label="Quote Token" />
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="editForm.Chain" :items="ALL_CHAINS" label="Chain" item-title="text"
                item-value="value" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="editForm.Dex" :items="ALL_PROTOCOL" label="Dex" item-title="text" item-value="value" />
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="editForm.PoolCategory" :items="CATEGORY_OPTIONS" label="Category" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.FeetierAux" label="Fee Tier (%)" suffix="%" type="number" />
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="editForm.baseTokenCategories" :items="ALL_CATEGORIES" label="Base Categories" multiple
                item-title="text" chips />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="editForm.quoteTokenCategories" :items="ALL_CATEGORIES" label="Quote Categories"
                item-title="text" multiple chips />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.id" label="Id(read-only)" readonly />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="editForm.poolAndChainID" label="Pool And Chain Id" readonly />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="staticEditForm.liquidity" label="Liquidity" disabled />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="staticEditForm.volume" label="Volume" disabled />
            </v-col>
          </v-row>
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
import { computed, inject, ref } from 'vue'
import { useTheme } from 'vuetify'
import {
  ALL_CHAINS,
  ALL_PROTOCOL,
  ALL_CATEGORIES,
  CATEGORY_GENERAL,
} from '@/constant'
import apiClient from '@/utils/axios'

const props = defineProps(['pool'])

const editDialog = ref(false)
const loading = ref(false);
const editForm = ref({})
const staticEditForm = ref({ liquidity: "-", volume: "-" })
const theme = useTheme()
const darkMode = computed(() => theme.global.current.value.dark)

const CATEGORY_OPTIONS = CATEGORY_GENERAL;
const rules = {
  required: value => !!value || 'This field is required',
}
const notify = inject('notify'); // inject notify function

const errors = ref({
  PoolAddress: '',
})

function validateForm() {
  let isValid = true
  if (!editForm.value.PoolAddress) {
    errors.value.PoolAddress = 'Pool Address is required'
    isValid = false
  } else {
    errors.value.PoolAddress = ''
  }

  return isValid
}



function openEditDialog() {
  const pool = { ...props.pool };

  editForm.value = {
    ...pool,
    baseTokenCategories: Array.isArray(pool.baseTokenCategories)
      ? pool.baseTokenCategories.filter(cat => ALL_CATEGORIES.map(item => item.text).includes(cat))
      : [],
    quoteTokenCategories: Array.isArray(pool.quoteTokenCategories)
      ? pool.quoteTokenCategories.filter(cat => ALL_CATEGORIES.map(item => item.text).includes(cat))
      : [],
    FeetierAux: formatFeeTier(pool.FeeTier),
  };

  editDialog.value = true;
}

function formatFeeTier(value) {
  if (!value || value === 0) return ''
  const percent = value / 10000
  return percent % 1 === 0 ? `${percent}` : `${percent.toFixed(2)}`
}

function revertFeeTier(formatted) {
  const raw = parseFloat(formatted)
  if (isNaN(raw)) return 0
  return Math.round(raw * 10000)
}

function saveEdit() {
  if (!validateForm()) return;
  editForm.value.FeeTier = revertFeeTier(editForm.value.FeetierAux);
  editForm.value.FeetierAux = String(editForm.value.FeetierAux);
  postData();
}

async function postData() {
  loading.value = true;
  try {
    await apiClient.post('adminPools', editForm.value, { routeParams: { id: props.pool.PoolAddress } });
    loading.value = false;
    showSuccess();
    editDialog.value = false
  } catch (error) {
    console.error('Error fetching data:', error);
    showError();
    loading.value = false;
  }
  finally {
    loading.value = false;
  }
}

const showSuccess = () => {
  notify('Successfully updated!');
};

const showError = () => {
  notify('Something went wrong.', { color: 'error', timeout: 5000 });
};
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
  padding: 16px 24px;
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
