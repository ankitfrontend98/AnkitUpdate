<script setup>
import { ref, defineProps } from 'vue';
import { DETAIL_TABLE_HEADER } from '@/constant';

const headers = ref(DETAIL_TABLE_HEADER);
const loading = ref(false);

// Define props
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },

  darkMode: {
    type: Boolean,
    default: false
  }
})

</script>
<template>
    <v-data-table
      :headers="headers"
      :items="items"
      item-value="name"
      items-per-page="10"
      :loading="loading"
      :class="[props.darkMode ? 'detail-table-dark' : 'detail-table-light']"
    >
    <template v-slot:item.date="{ item }">
        <div class="font-weight">{{ item.date }}</div>
    </template>
    <template v-slot:item.apr="{ item }">
        <div>{{ item.apr }}</div>
    </template>
    </v-data-table>
</template>
<style scoped>
  .detail-table-dark {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: rgba(255, 255, 255, 0.04);
    /* Shadows/shadow-sm */
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    font-family: Inter;
    font-size: 14px;
    color: #F9FAFB;
  }

  .detail-table-light {
    border-radius: 12px;
    border: 1px solid var(--Gray-200, #EAECF0);
    background: #FFF;
    font-family: Inter;
    font-size: 14px;
    color: #344054;
    /* Shadows/shadow-sm */
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  }
  ::v-deep .v-table__wrapper thead {
    background: rgb(var(--v-theme-tableHeader)) !important;
  }
  .font-weight {
    font-weight: 600;
  }

  ::v-deep .v-data-table-header__content {
    font-weight: 600;
  }
  
  ::v-deep .v-table__wrapper > table > thead > tr > th {
    height: 36px !important;
  }

  ::v-deep .v-table__wrapper > table > tbody > tr > td {
    padding: 10px 18px !important;
  }

  ::v-deep .v-table__wrapper > table > thead > tr > th {
    padding: 2px 18px !important;
  }
</style>