<script setup>
import { useTheme } from 'vuetify';

import { ADMIN_TABLE_HEADER, ALL_CHAINS, ALL_PROTOCOL } from '@/constant';
import apiClient from '@/utils/axios';
import { computed, onMounted, ref } from 'vue';
import { VNavigationDrawer } from 'vuetify/components/VNavigationDrawer';
import { useRouter } from 'vue-router';
import AdminEditPool from './AdminEditPool.vue';
import AdminAddPool from './AdminAddPool.vue';
import { useRoute } from 'vue-router';


const FILTER = {
  "Contract": "",
  "Chain": "all",
  "BaseToken": "",
  "QuoteToken": "",
  "Protocol": "all",
  "ZeroFees": false,
  "TotalResults": 10,
  "IgnoredPools": false
}

const theme = useTheme();
const router = useRouter()

const headers = ref(ADMIN_TABLE_HEADER);
const allChainItems = [{ text: "All", value: "all" }, ...ALL_CHAINS];
const allProtocolItems = [{ text: "All", value: "all" }, ...ALL_PROTOCOL];
const poolData = ref([]);
const searchData = ref(FILTER);
const loading = ref(false);
const drawer = ref(false);
const isWidthSmallScreen = ref(window.matchMedia("(max-width: 1024px)").matches || false)
const isHeightSmallScreen = ref(window.matchMedia("(max-height: 700px)").matches || false);
const filterMenu = ref(false);

const chainIcon = (value) => {
  return `../assets/images/chains/${value}.png`;
}

const protocolIcon = (value) => {
  return `../assets/images/protocols/${value}.png`;
}
const darkMode = computed(() => {
  return theme.global.current.value.dark;
});
const route = useRoute();

onMounted(() => {
  const query = route.query;
  if (query) {
    searchData.value.Contract = query.Contract;
    searchData.value.Chain = query.Chain;
    searchData.value.BaseToken = query.BaseToken;
    searchData.value.QuoteToken = query.QuoteToken;
    searchData.value.Protocol = query.Protocol;
    searchData.value.ZeroFees = query.ZeroFees === 'true' ? true : false;
    searchData.value.TotalResults = parseInt(query.TotalResults) || 10;
    searchData.value.IgnoredPools = query.IgnoredPools === 'true' ? true : false;
  }
  fetchData(true);
})





async function fetchData(initialLoad = false) {
  loading.value = true;
  console.log(initialLoad, "mayank")
  try {
    searchData.value.Contract = searchData.value.Contract.trim();
    searchData.value.Chain = searchData.value.Chain ?? 'all';
    searchData.value.Protocol = searchData.value.Protocol ?? 'all';
    if (!initialLoad) {
      router.push({ query: searchData.value });
    }
    const { data } = await apiClient.post('adminPools', searchData.value, { routeParams: { id: 'search' } });
    poolData.value = data.output;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching data:', error);
    loading.value = false;
  }
  finally {
    loading.value = false;
  }
}


function handleItemsPerPageChange(newItemsPerPage) {
  searchData.value.TotalResults = newItemsPerPage;
  fetchData();
}

function resetData() {
  searchData.value = { ...FILTER };
  fetchData();
}


function handleSearchWithContract() {
  fetchData()
}

function handlePoolRoute(id) {
  router.push({ path: `/pool/${id}` })
}
</script>


<template>
  <v-container class="mt-7">
    <v-btn v-if="isWidthSmallScreen" @click="drawer = !drawer" density="default" icon="mdi-filter" size="small"
      style="float: right; margin-bottom: 5px;"></v-btn>
    <component :is="isWidthSmallScreen ? VNavigationDrawer : 'div'" v-model="drawer" location="right" temporary
      :class="!isWidthSmallScreen ? 'd-flex filter-common' : 'd-flex flex-column filter-common mobile-filter-padding'"
      style="z-index: 1000; top: 0px !important; height: 100% !important;">
      <div v-if="isWidthSmallScreen" class="d-flex mr-3 mb-5 justify-space-between align-center">
        <div>Filters</div>
        <v-btn @click="drawer = !drawer" density="default" icon="mdi-close" size="small" variant="text" />
      </div>
      <hr v-if="isWidthSmallScreen" class="mr-3 mb-5"
        style="border: none; border-top: 1px solid #5b5a77 !important; " />

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Contract</div>
        <div>
          <v-text-field v-model="searchData.Contract" label="Search" append-inner-icon="mdi-magnify" variant="plain"
            density="compact" :hide-details="true" @click:append-inner="handleSearchWithContract()" clearable
            @click:clear="searchData.Contract = ''" class="width-adjust-contract select-box2" center-affix
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']"
            @keydown.enter="handleSearchWithContract()" />
        </div>
      </div>
      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Chain</div>
        <div>
          <v-select v-model="searchData.Chain" label="All Chains" :items="allChainItems"
            :clearable="searchData.Chain !== 'all'" class="width-adjust select-box2"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" single variant="plain" density="compact"
            item-title="text" center-affix :hide-details="true" @click:clear="searchData.Chain = 'all'"
            @update:model-value="() => fetchData()">
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Protocol</div>
        <div>
          <v-select v-model="searchData.Protocol" label="All Protocol" :items="allProtocolItems"
            :clearable="searchData.Protocol !== 'all'" class="width-adjust select-box2"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" variant="plain" density="compact"
            item-title="text" :hide-details="true" center-affix single @click:clear="searchData.Protocol = 'all'"
            @update:model-value="() => fetchData()">
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Base Token</div>
        <div>
          <v-text-field v-model="searchData.BaseToken" label="Search" append-inner-icon="mdi-magnify" variant="plain"
            density="compact" :hide-details="true" @click:append-inner="() => fetchData()" clearable
            @click:clear="searchData.BaseToken = ''" class="width-adjust select-box2" center-affix
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" @keydown.enter="() => fetchData()" />
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Quote Token</div>
        <div>
          <v-text-field v-model="searchData.QuoteToken" label="Search" append-inner-icon="mdi-magnify" variant="plain"
            density="compact" :hide-details="true" @click:append-inner="() => fetchData()" clearable
            @click:clear="searchData.QuoteToken = ''" class="width-adjust select-box2" center-affix
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" @keydown.enter="() => fetchData()" />
        </div>
      </div>

      <div class="d-flex flex-column mr-4 mb-5">
        <div class="text-customText">Extra</div>
        <v-menu v-model="filterMenu" :close-on-content-click="false" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn class="text-customText reset-filters"
              :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']" v-bind="props">
              View More
              <v-icon :icon="filterMenu ? 'mdi-menu-up' : 'mdi-menu-down'" end></v-icon>
            </v-btn>
          </template>
          <v-card class="mt-5 custom-card-class pa-2" width="300">
            <div class="d-flex flex-column">
              <v-checkbox-btn label="Include Ignored Pools" v-model="searchData.IgnoredPools"></v-checkbox-btn>
              <v-checkbox-btn label="No Zero Fees" v-model:model-value="searchData.ZeroFees"></v-checkbox-btn>
              <hr style="border:none; border-top:1px solid #354251" />
              <div class="d-flex justify-center mt-5 mb-2 ">
                <v-btn class="text-none" :color="darkMode ? '#BFAC62' : '#0F2357'" size="large"
                  @click="() => fetchData()">
                  Apply
                </v-btn>

              </div>

            </div>
          </v-card>
        </v-menu>
      </div>


      <div class="mt-6 d-flex justify-center  mr-3 mb-5" :class="isHeightSmallScreen ? 'mb-10' : 'mb-5'">
        <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
          @click="resetData">
          Reset
        </v-btn>
      </div>
      <div class="mt-6 d-flex justify-center  mr-3 mb-5" :class="isHeightSmallScreen ? 'mb-10' : 'mb-5'">
        <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
          @click="() => fetchData()">
          Apply
        </v-btn>
      </div>
      <div class="mt-6 d-flex justify-center mb-5" :class="isHeightSmallScreen ? 'mb-10' : 'mb-5'">
        <AdminAddPool />
      </div>
    </component>

    <v-data-table v-model="selected" :headers="headers" :items="poolData" item-value="PoolAddress"
      :items-per-page="searchData.TotalResults" :loading="loading" show-select
      :items-per-page-options="[5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 1000]"
      @update:items-per-page="handleItemsPerPageChange"
      :class="[darkMode ? 'custom-dark-table-background' : 'custom-light-table-background']">
      <template v-slot:header.data-table-select>
      </template>
      <template v-slot:item.data-table-select="{ item }">
        <AdminEditPool :pool="item" />
      </template>
      <template v-slot:item.PoolAddress="{ item }">
        <span class="router-link text-customText" style="cursor: pointer;" @click="handlePoolRoute(item.PoolAddress)">
          {{ item.PoolAddress }}
        </span>
      </template>
      <template v-slot:item.Chain="{ item }">
        <div class="text-capitalize">
          <span class="text-customText">
            <img :src="chainIcon(item.Chain)" alt="Chain Icon" class="token-icon">
            {{ item.Chain != null ? item.Chain : '' }}
          </span>
        </div>
      </template>
      <template v-slot:item.Dex="{ item }">
        <div class="text-capitalize">
          <span class="text-customText">
            <img :src="protocolIcon(item.Dex)" alt="Protocol Icon" class="token-icon">
            {{ item.Dex != null ? item.Dex : '' }}
          </span>
        </div>
      </template>
      <template v-slot:item.Tokens="{ item }">
        <span class="router-link text-customText" style="cursor: pointer;">
          {{ item.BaseToken?.substring(0, 10) }}
          / {{ item.OtherToken?.substring(0, 10) }}
        </span>
      </template>
      <template v-slot:item.FeeTier="{ item }">
        <span class="text-customText">{{ item.FeeTier != 0 ? (item.FeeTier / 10000) + '%' : '' }}</span>
      </template>
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
  min-width: 350px !important;
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
