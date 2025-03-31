<script setup>
import { useTheme } from 'vuetify';

import apiClient from '@/utils/axios';
import { computed, ref } from 'vue';
import { ADD_POOL_HEADER_DATA, ADD_POOL_HEADER_DETAILS, ALL_CHAINS } from '@/constant';

const theme = useTheme();

const darkMode = computed(() => {
  return theme.global.current.value.dark;
});
const loading = ref(false);
const allChainItems = [{ text: "All", value: "all" }, ...ALL_CHAINS];


const queryParams = ref({
  id: "",
  symbol: ""
})

const routeParams = ref({
  searchId: "all"
})

async function searchPools() {
  loading.value = true;
  try {
    await apiClient.get('addPools', { routeParams: routeParams.value, queryParams: queryParams.value });
    loading.value = false;
  }
  catch (err) {
    console.log(err)
  }
}
function resetData() {
  queryParams.value.id = "";
  queryParams.value.symbol = "";
  routeParams.value.searchId = "";
}

</script>


<template>
  <v-container class="mt-7">
    <v-btn v-if="isWidthSmallScreen" @click="drawer = !drawer" density="default" icon="mdi-filter" size="small"
      style="float: right; margin-bottom: 5px;"></v-btn>
    <div temporary :class="'d-flex filter-common'" style="z-index: 1000; top: 0px !important; height: 100% !important;">
      <div v-if="isWidthSmallScreen" class="d-flex mr-3 mb-5 justify-space-between align-center">
        <div>Filters</div>
        <v-btn @click="drawer = !drawer" density="default" icon="mdi-close" size="small" variant="text" />
      </div>
      <hr v-if="isWidthSmallScreen" class="mr-3 mb-5"
        style="border: none; border-top: 1px solid #5b5a77 !important; " />
      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Symbol</div>
        <div>
          <v-text-field v-model="queryParams.symbol" label="Search" variant="plain" density="compact"
            :hide-details="true" clearable @click:clear="queryParams.symbol = ''" class="width-adjust select-box2"
            center-affix :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" />
        </div>
      </div>
      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Token or Pool Address</div>
        <div>
          <v-text-field v-model="queryParams.id" label="Search" variant="plain" density="compact" :hide-details="true"
            clearable @click:clear="queryParams.id = ''" class="width-adjust-contract select-box2" center-affix
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" />
        </div>
      </div>
      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Network</div>
        <div>
          <v-select v-model="routeParams.searchId" label="All Chains" :items="allChainItems"
            :clearable="routeParams.searchId !== 'all'" class="width-adjust select-box2"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" single variant="plain" density="compact"
            item-title="text" center-affix :hide-details="true" @click:clear="routeParams.searchId = 'all'">
          </v-select>
        </div>
      </div>

      <div class="mt-6 d-flex justify-center  mr-3 mb-5" :class="'mb-5'">
        <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
          @click="resetData">
          Reset
        </v-btn>
      </div>
      <div class="mt-6 d-flex justify-center  mr-3 mb-5" :class="'mb-5'">
        <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
          @click="searchPools">
          Search Pools
        </v-btn>
      </div>
    </div>

    <v-data-table :headers="ADD_POOL_HEADER_DATA" :items="[]" item-value="id" :loading="loading" hide-default-footer
      :class="[darkMode ? 'custom-dark-table-background' : 'custom-light-table-background']">
    </v-data-table>
    <br />
    <v-data-table :headers="ADD_POOL_HEADER_DETAILS" :items="[]" item-value="id-1" :loading="loading"
      hide-default-footer :class="[darkMode ? 'custom-dark-table-background' : 'custom-light-table-background']">
    </v-data-table>



  </v-container>
</template>

<style scoped>
.v-data-table-footer__info {
  display: none !important;
}

.v-pagination__list {
  display: none !important;
}

.mobile-filter-padding {
  padding: 10px 0px 10px 10px
}




.custom-star-not-selected-light {
  color: transparent;
  text-shadow: 0 0 0 #bbbcc3;
}

.custom-star-not-selected-dark {
  color: transparent;
  text-shadow: 0 0 0 #5d5757;
}

.custom-star-light {
  color: transparent;
  text-shadow: 0 0 0 #142257;
}

.custom-star-dark {
  color: transparent;
  text-shadow: 0 0 0 rgb(var(--v-theme-labelColor));
}

.width-adjust {
  min-width: 180px !important;
}

.width-adjust-contract {
  min-width: 450px !important;
}

.router-link {
  text-decoration: none;
  font-weight: 600;
  font-family: Inter;
  font-size: 14px;
}

.custom-dark-table-background {
  background: rgba(255, 255, 255, 0.04) !important;
  font-family: Inter;
  color: #F9FAFB;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
}

.custom-light-table-background {
  background: #FFF !important;
  font-family: Inter;
  color: #344054;
  font-size: 14px;
  border-radius: 12px;
  border: 1px solid #EAECF0;
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
}

.select-box {
  border-radius: 8px;
  border: 1px solid rgb(var(--v-theme-selectBoxBorder));
  background: rgb(var(--v-theme-selectBoxBackground));
  /* Shadows/shadow-xs */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
}

.menu-list {
  border-radius: 10px !important;
}

.menu1-list {
  border-radius: 10px !important;
}

::v-deep .v-data-table thead {
  background: rgb(var(--v-theme-tableHeader)) !important;
}

.filters-items {
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
}

.custom-card-class {
  background: rgba(var(--v-theme-cardBackground)) !important;
}

::v-deep .v-data-table-header__content {
  font-size: 12px !important;
}

.reset-filters {
  font-size: 14px !important;
  font-family: Inter;
  height: 42px !important;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
}

.reset-filters-dark {
  border: 1px solid var(--Gray-700, #344054);
  background: #262A3F;
}

.reset-filters-light {
  border: 1px solid var(--Gray-200, #EAECF0);
  background: var(--Base-White, #FFF);
}

.select-box2-light :deep(.v-label.v-field-label) {
  color: rgb(71, 84, 103);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
}

.select-box2-dark :deep(.v-label.v-field-label) {
  color: var(--Gray-300, #D0D5DD);
  /* Text sm/Semibold */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  /* 142.857% */
}

.select-box2-dark {
  border: 1px solid #344054;
  background: #262A3F;
  color: #FFF;
}

.select-box2-light {
  border: 1px solid #EAECF0;
  background: #FFF;
}

.select-box2 {
  padding: 10px 14px;
  height: 45px;
  border-radius: 8px;
  /* Shadows/shadow-xs */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
}

.select-box2 :deep(.v-field-label) {
  top: 30% !important;
}

.select-box2 :deep(.v-field__append-inner) {
  padding-top: 0px !important;
}

.custom-dark-table-background :deep(.mdi-checkbox-marked) {
  color: #F9FAFB !important;
}

.custom-dark-table-background :deep(.mdi-minus-box) {
  color: #F9FAFB !important;
}

.select-box2-dark :deep(.mdi-menu-down) {
  color: #F9FAFB !important;
}

.select-box2-dark :deep(.mdi-menu1-down) {
  color: #F9FAFB !important;
}

.custom-light-table-background :deep(.mdi-checkbox-marked) {
  color: #0F2357 !important;
}

.custom-light-table-background :deep(.mdi-minus-box) {
  color: #0F2357 !important;
}

::v-deep .v-list .v-theme--dark {
  background: #262A3F !important;
}

::v-deep .v-data-table-column--no-padding {
  padding: 0px 8px !important;
}

::v-deep .mdi-close-circle.v-theme--dark {
  color: #FFF;
}

.more-selection-text {
  font-size: 9px;
}

.clear-link {
  text-decoration: none;
}

::v-deep .v-table>.v-table__wrapper>table>thead>tr>th {
  height: 44px !important;
}

::v-deep .v-table>.v-table__wrapper>table>tbody>tr>td {
  padding: 10px 18px !important;
}

::v-deep .v-table>.v-table__wrapper>table>thead>tr>th {
  padding: 0px 18px !important;
}

.token-icon {
  width: 20px;
  /* Adjust size as needed */
  height: 20px;
  /* Adjust size as needed */
  vertical-align: middle;
  /* Aligns the image with the text */
  margin-right: 5px;
  /* Adds spacing between the image and text */
  border-radius: 50% !important;
}

@media (min-width: 1280px) {
  .v-container {
    max-width: 1700px !important;
    width: 100% !important;
    padding: 16px 4% !important;
  }
}

@media (min-width: 1400px) {
  .width-adjust {
    min-width: 160px !important;
  }
}

.v-select .v-select__selection-text {
  font-size: 12px !important;
}

.v-text-field input {
  font-size: 12px !important;

}

/* @media (min-width: 1024px) {
  .filter-common {
    flex-wrap: wrap !important;
  }
} */
</style>
