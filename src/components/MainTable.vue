<script setup>
import { useTheme } from 'vuetify';
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import apiClient from '../utils/axios.js';
import { formatMoney } from '@/utils/formatMoney.js';
import { ALL_CHAINS, ALL_PROTOCOL, MAIN_TABLE_HEADER, ALL_CATEGORIES, DATA_PERIOD } from '@/constant/index.js'
import { useAppStore } from '@/stores/app'
import { useAuth0 } from '@auth0/auth0-vue';
import StarCheckbox from './StarCheckbox.vue';
import { VNavigationDrawer } from 'vuetify/components/VNavigationDrawer';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const theme = useTheme();
const store = useAppStore();
const { user } = useAuth0()
const router = useRouter();
const route = useRoute();

const drawer = ref(false)
const isWidthSmallScreen = ref(window.matchMedia("(max-width: 1024px)").matches || false)
const isHeightSmallScreen = ref(window.matchMedia("(max-height: 700px)").matches || false)


const dataPeriod = DATA_PERIOD;
const seletedDuration = ref("1");
const showFavourites = ref(false)

const items = ref([]);
const menu = ref(false);
const menu1 = ref(false);
const filteredItems = ref([]);
const seletedChains = ref([]);
const selectedProtocol = ref([]);
const selectedCategories = ref([]);
const selected = ref([]);
const token1 = ref([]);
const token2 = ref([]);
const token3 = ref([]);
const selectedToken1 = ref([]);
const selectedToken2 = ref([]);

const tvlMinPrice = ref(0);
const tvlMaxPrice = ref(0);

const tempTvlMinPrice = ref(0);
const tempTvlMaxPrice = ref(0);

const searchToken1 = ref('');
const searchToken2 = ref('');
const finalSearchToken1 = ref('');
const finalSearchToken2 = ref('');


const aprMinPrice = ref(0);
const aprMaxPrice = ref(0);

const tempAprMinPrice = ref(0);
const tempAprMaxPrice = ref(0);

const loading = ref(true);

const headers = ref(MAIN_TABLE_HEADER);
const allChainItems = ALL_CHAINS;
const allProtocolItems = ALL_PROTOCOL;
const allCategorieItems = ALL_CATEGORIES;





const darkMode = computed(() => {
  return theme.global.current.value.dark;
});

const sortedToken1 = computed(() => {
  if (searchToken1.value) {
    return token1.value.filter((tokenName) => tokenName.toLowerCase().includes(searchToken1.value.toLocaleLowerCase()));
  }
  return token1.value.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
});

const sortedToken2 = computed(() => {
  if (searchToken2.value) {
    return token2.value.filter((tokenName) => tokenName.toLowerCase().includes(searchToken2.value.toLocaleLowerCase()));
  }
  return token2.value.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
});

// Function to filter data by selected period
const filterDataByPeriod = () => {
  if (seletedDuration.value) {
    const selectedPeriod = parseInt(seletedDuration.value, 10);  // Convert the selected duration to a number
    filteredItems.value = items.value.filter(item => {
      // Assuming `item.period` exists and represents the duration in days
      return item.period <= selectedPeriod;
    });
  }

};

const filterArrayData = computed(() => {
  let filterData = items.value.map((element) => {
    // Add vol_tvl calculation to each item
    return {
      ...element,
      vol_tvl: element.Liquidity !== 0 ? parseFloat((element.Volume / element.Liquidity).toFixed(2)) : 0.0,
    };
  });

  // Apply chain filter
  if (seletedChains.value.length > 0) {
    const selectedValues = seletedChains.value.filter((item) => item !== 'all_select');
    filterData = filterData.filter((item) => selectedValues.includes(item.ChainId));
  }

  // Apply protocol filter
  if (selectedProtocol.value.length > 0) {
    const selectedValues = selectedProtocol.value.filter((item) => item !== 'all_select');
    filterData = filterData.filter((item) => selectedValues.includes(item.DexId));
  }

  // Apply category filter
  if (selectedCategories.value.length > 0) {
    const selectedValues = selectedCategories.value.filter((item) => item !== 'all_select');
    filterData = filterData.filter((item) =>
      selectedValues.some((selectedValue) => {
        if (selectedValue === 'Stablecoins') {
          return item.baseTokenCategories.includes('Stablecoins') &&
            item.quoteTokenCategories.includes('Stablecoins');
        }
        else return item.baseTokenCategories.includes(selectedValue) ||
          item.quoteTokenCategories.includes(selectedValue);
      })
    );
  }



  // Apply token filters
  if (selectedToken1.value.length > 0) {
    if (finalSearchToken1.value) {
      filterData = filterData.filter(item => item.BaseToken.toLowerCase().includes(finalSearchToken1.value.toLowerCase()));
    }
    else {
      const selectedValues = [...selectedToken1.value];
      filterData = filterData.filter((item) => selectedValues.includes(item.BaseToken));
    }
  }
  if (selectedToken2.value.length > 0) {

    if (finalSearchToken2.value) {
      filterData = filterData.filter(item => item.QuoteToken.toLowerCase().includes(finalSearchToken2.value.toLowerCase()));
    }
    else {
      const selectedValues = [...selectedToken2.value];
      filterData = filterData.filter((item) => selectedValues.includes(item.QuoteToken));
    }
  }



  // Apply period filter
  if (seletedDuration.value) {
    const periodFieldMapping = {
      '1': 'Volume',
      '7': 'SMA_Volume7d',
      '30': 'SMA_Volume30d',
      '90': 'SMA_Volume90d',
      '180': 'SMA_Volume180d',
    };

    const liquidityFieldMapping = {
      '1': 'Liquidity',
      '7': 'SMA_Liquidity7d',
      '30': 'SMA_Liquidity30d',
      '90': 'SMA_Liquidity90d',
      '180': 'SMA_Liquidity180d',
    };

    const feesFieldMapping = {
      '1': 'fees',
      '7': 'SMA_Fees7d',
      '30': 'SMA_Fees30d',
      '90': 'SMA_Fees90d',
      '180': 'SMA_Fees180d',
    };

    const aprFieldMapping = {
      '1': 'apr',
      '7': 'SMA_APR7d',
      '30': 'SMA_APR30d',
      '90': 'SMA_APR90d',
      '180': 'SMA_APR180d',
    };

    const corrFieldMapping = {
      '1': 'Correlation7d',
      '7': 'Correlation7d',
      '30': 'Correlation30d',
      '90': 'Correlation90d',
      '180': 'Correlation180d',
    }

    const selectedPeriod = seletedDuration.value;

    // Map the data fields dynamically for the selected period
    filterData = filterData.map((item) => {
      return {
        ...item,
        Volume: item[periodFieldMapping[selectedPeriod]],
        Liquidity: item[liquidityFieldMapping[selectedPeriod]],
        fees: item[feesFieldMapping[selectedPeriod]],
        apr: item[aprFieldMapping[selectedPeriod]],
        corr: formatCorrelation(item[corrFieldMapping[selectedPeriod]]),
        vol_tvl_new: Number(item[liquidityFieldMapping[selectedPeriod]]) != 0 ?
        ((parseFloat(item[periodFieldMapping[selectedPeriod]]) / parseFloat(item[liquidityFieldMapping[selectedPeriod]])).toFixed(2)) : 0.00
      };
    });
    // Remove items where mapped fields are null or undefined
    filterData = filterData.filter((item) => {
      return item.Volume !== null && item.Volume !== undefined &&
        item.Liquidity !== null && item.Liquidity !== undefined &&
        item.fees !== null && item.fees !== undefined &&
        item.apr !== null && item.apr !== undefined;
    });
  }


  if (tvlMinPrice.value !== 0) {
    filterData = filterData.filter((item) => {
      return Number(item.Liquidity) >= Number(tvlMinPrice.value)
    });
  }
  if (tvlMaxPrice.value !== 0) {
    filterData = filterData.filter((item) => {
      return Number(item.Liquidity) <= Number(tvlMaxPrice.value)
    });
  }

   // Apply TVL and APR filters

   if (aprMinPrice.value !== 0 || aprMaxPrice.value !== 0) {
    filterData = filterData.filter((item) => {
      return (
        (aprMinPrice.value === 0 || item.apr >= aprMinPrice.value) &&
        (aprMaxPrice.value === 0 || item.apr <= aprMaxPrice.value)
      );
    });
  }

  console.log(filterData)

  if (showFavourites.value) {
    const fav = [];
    const notFav = [];
    filterData.forEach((item) => {
      if (selected.value.includes(item.pairAddress)) {
        fav.push(item);
      } else {
        notFav.push(item);
      }
    });
    filterData = [...fav];
  }
  return filterData;
});

const formatCorrelation = (correlation) => {
  return Math.round(Math.abs(correlation) * 100);
};

const likesAllChains = computed(() => {
  return allChainItems.length === seletedChains.value.length
});
const likesSomeChains = computed(() => {
  return seletedChains.value.length > 0
});

const likesAllProtocols = computed(() => {
  return allProtocolItems.length === selectedProtocol.value.length
});

const likesSomeProtocols = computed(() => {
  return selectedProtocol.value.length > 0
});

const likesAllCategories = computed(() => {
  return allCategorieItems.length === selectedCategories.value.length
});

const likesSomeCategories = computed(() => {
  return selectedCategories.value.length > 0
});






function createQueryFilter() {
  const query = {
    ...(seletedChains.value.length ? { chains: seletedChains.value.join(',') } : {}),
    ...(selectedProtocol.value.length ? { protocol: selectedProtocol.value.join(',') } : {}),
    ...(selectedCategories.value.length ? { categories: selectedCategories.value.join(',') } : {}),
    ...(seletedDuration.value !== "1" ? { duration: seletedDuration.value } : {}),
    ...(selectedToken1.value.length ? { token1: selectedToken1.value.join(',') } : {}),
    ...(selectedToken2.value.length ? { token2: selectedToken2.value.join(',') } : {}),
    ...(finalSearchToken1.value ? { searchToken1: finalSearchToken1.value } : {}),
    ...(finalSearchToken2.value ? { searchToken2: finalSearchToken2.value } : {}),
    tvlMin: tvlMinPrice.value || undefined,
    tvlMax: tvlMaxPrice.value || undefined,
    aprMin: aprMinPrice.value || undefined,
    aprMax: aprMaxPrice.value || undefined,
    favourites: showFavourites.value ? 1 : undefined,
  };
  return query;
}

watch(
  [seletedChains, selectedProtocol, selectedToken1, selectedToken2, selectedCategories, seletedDuration, tvlMinPrice, tvlMaxPrice, aprMinPrice, aprMaxPrice, showFavourites],
  () => {
    const query = createQueryFilter()
    router.push({ query });
  },
  { deep: true }
);



function initDataFiltersFromQuery() {
  const query = route.query;
  seletedChains.value = query.chains ? query.chains.split(',') : [];
  selectedProtocol.value = query.protocol ? query.protocol.split(',') : [];
  selectedCategories.value = query.categories ? query.categories.split(',') : [];
  seletedDuration.value = query.duration || "1";
  selectedToken1.value = query.token1 ? query.token1.split(',') : [];
  selectedToken2.value = query.token2 ? query.token2.split(',') : [];
  finalSearchToken1.value = query.searchToken1 || "";
  finalSearchToken2.value = query.searchToken2 || "";
  tvlMinPrice.value = query.tvlMin ? Number(query.tvlMin) : 0;
  tvlMaxPrice.value = query.tvlMax ? Number(query.tvlMax) : 0;
  tempTvlMinPrice.value = query.tvlMin ? Number(query.tvlMin) : 0;
  tempTvlMaxPrice.value = query.tvlMax ? Number(query.tvlMax) : 0;
  aprMinPrice.value = query.aprMin ? Number(query.aprMin) : 0;
  aprMaxPrice.value = query.aprMax ? Number(query.aprMax) : 0;
  tempAprMaxPrice.value = query.aprMax ? Number(query.aprMax) : 0;
  tempAprMinPrice.value = query.aprMin ? Number(query.aprMin) : 0;
  showFavourites.value = query.favourites === '1';
}





const fetchData = async () => {

  loading.value = true;
  try {
    if (store.poolList.length === 0) {
      const { data } = await apiClient.get('api/pooldata/0');
      store.poolList = data;
    }
    const data = store.poolList;
    items.value = data.output;
    items.value.forEach((element) => {
      let baseToken = element.BaseToken.substring(0, 10);
      if (!token1.value.includes(baseToken)) {

        token1.value.push(baseToken);
      }
      let baseTokenCategories = element.baseTokenCategories;
      let categories = Array.isArray(baseTokenCategories)
        ? baseTokenCategories
          .map(token => Array.isArray(element.baseTokenCategories) ? element.baseTokenCategories : [])
          .flat()
        : [];
      if (!token3.value.includes(categories)) {
        token3.value.push(element.baseTokenCategories);
      }

      let quoteToken = element.QuoteToken.substring(0, 10);
      if (!token2.value.includes(quoteToken)) {
        token2.value.push(quoteToken);
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  finally {
    loading.value = false;
  }
};

const applyTvlFilter = () => {
  menu.value = false;
  tvlMinPrice.value = tempTvlMinPrice.value;
  tvlMaxPrice.value = tempTvlMaxPrice.value;
}

const applyAprFilter = () => {
  menu1.value = false;
  aprMinPrice.value = tempAprMinPrice.value;
  aprMaxPrice.value = tempAprMaxPrice.value;
}

const resetFilter = () => {
  seletedChains.value = [];
  selectedProtocol.value = [];
  selectedCategories.value = [];
  seletedDuration.value = "1";
  selectedToken1.value = [];
  selectedToken2.value = [];
  tempTvlMinPrice.value = tvlMinPrice.value = 0;
  tempTvlMaxPrice.value = tvlMaxPrice.value = 0;
  tempAprMinPrice.value = aprMinPrice.value = 0;
  tempAprMaxPrice.value = aprMaxPrice.value = 0;
  showFavourites.value = false;
}

const onChainSelectionChange = () => {
  if (seletedChains.value.length === 0) {
    seletedChains.value = allChainItems.map(item => item.value);
  } else if (seletedChains.value.length === allChainItems.length) {
    seletedChains.value = [];
  } else if (allChainItems.length >= seletedChains.value.length) {
    seletedChains.value = allChainItems.map(item => item.value);
  }
}

const onProtocolSelectionChange = () => {
  if (selectedProtocol.value.length === 0) {
    selectedProtocol.value = allProtocolItems.map(item => item.value);
  } else if (selectedProtocol.value.length === allProtocolItems.length) {
    selectedProtocol.value = [];
  } else if (allProtocolItems.length >= selectedProtocol.value.length) {
    selectedProtocol.value = allProtocolItems.map(item => item.value);
  }
}

const onCategorieSelectionChange = () => {

  if (selectedCategories.value.length === 0) {
    selectedCategories.value = allCategorieItems.map(item => item.value);
  } else if (selectedCategories.value.length === allCategorieItems.length) {
    selectedCategories.value = [];
  } else if (allCategorieItems.length >= selectedCategories.value.length) {
    selectedCategories.value = allCategorieItems.map(item => item.value);
  }
}

const chainIcon = (value) => {
  return `../assets/images/chains/${value}.png`;
}

const protocolIcon = (value) => {
  return `../assets/images/protocols/${value}.png`;
}



const updateSort = () => {
  // update
}

watch(items, () => {
  filterDataByPeriod();
});

const saveFav = async (data) => {
  const userId = user.value?.sub
  const payload = {
    "favorites": data
  }
  try {
    await apiClient.post(`api/favorites/${userId}`, payload)
  }
  catch (err) {
    console.log(err)
  }
}



async function handleSelectCheckbox(val, toggleSelect, internalItem) {
  toggleSelect(internalItem)
  if (val)
    selected.value.push(internalItem.value)
  else selected.value = selected.value.filter(item => item !== internalItem.value)

  const uniqueArray = [...new Set(selected.value)];
  selected.value = [...uniqueArray]
  store.favPoolList = selected.value
  await saveFav(selected.value);
}

onMounted(async () => {
  initDataFiltersFromQuery();
  window.addEventListener("resize", checkScreenSize);
  if (store.favPoolList.length > 0) {
    selected.value = [...store.favPoolList]
  }
  else {
    const userId = user.value?.sub
    try {
      const { data } = await apiClient.get(`api/favorites/${userId}`);
      if (data && data?.favorites) selected.value = data?.favorites || [];
      else selected.value = []
      store.favPoolList = [...selected.value];
    }
    catch (error) {
      console.log(error)
    }
  }
  fetchData();


});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
})

function checkScreenSize() {
  isWidthSmallScreen.value = window.matchMedia("(max-width: 1024px)").matches;
  isHeightSmallScreen.value = window.matchMedia("(max-height: 700px)").matches
}

function handleSearchWithToken(type) {
  if (type === 'token1') {
    if (searchToken1.value) {
      selectedToken1.value = [searchToken1.value];
      finalSearchToken1.value = searchToken1.value;
    }
    else {
      selectedToken1.value = [];
      finalSearchToken1.value = '';
    }
  }
  else {
    if (searchToken2.value) {
      selectedToken2.value = [searchToken2.value];
      finalSearchToken2.value = searchToken2.value
    }
    else {
      selectedToken2.value = [];
      finalSearchToken2.value = "";
    }
  }
}

function handlePoolRoute(id) {
  const dataQuery = createQueryFilter()
  router.push({ path: `/pool/${id}`, query: dataQuery })
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
        <div class="text-customText">Chain</div>
        <div>
          <v-select v-model="seletedChains" label="All Chains" :items="allChainItems" class="width-adjust select-box2"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" multiple variant="plain" density="compact"
            item-title="text" center-affix :hide-details="true" clearable>
            <template v-slot:prepend-item>
              <v-list-item title="Select All" @click="onChainSelectionChange">
                <template v-slot:prepend>
                  <v-checkbox-btn :color="likesSomeChains ? 'black-darken-4' : undefined"
                    :indeterminate="likesSomeChains && !likesAllChains" :model-value="likesAllChains"></v-checkbox-btn>
                </template>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:selection="{ item, index }">

              <v-chip v-if="index < 1" density="compact" size="x-small" :color="darkMode ? '#FFF' : ''">
                <span>{{ item.title.substring(0, 2) + '.' }}</span>
              </v-chip>
              <span v-if="index === 1" class="text-grey more-selection-text align-self-center">
                (+{{ seletedChains.length - 1 }})
              </span>
            </template>
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Protocol</div>
        <div>
          <v-select v-model="selectedProtocol" label="All Protocol" :items="allProtocolItems"
            class="width-adjust select-box2" :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']"
            variant="plain" density="compact" item-title="text" :hide-details="true" center-affix multiple clearable>
            <template v-slot:prepend-item>
              <v-list-item title="Select All" @click="onProtocolSelectionChange">
                <template v-slot:prepend>
                  <v-checkbox-btn :color="likesSomeProtocols ? 'black-darken-4' : undefined"
                    :indeterminate="likesSomeProtocols && !likesAllProtocols"
                    :model-value="likesAllProtocols"></v-checkbox-btn>
                </template>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 1" density="compact" size="x-small" :color="darkMode ? '#FFF' : ''">
                <span>{{ item.title.substring(0, 2) + '.' }}</span>
              </v-chip>
              <span v-if="index === 1" class="text-grey more-selection-text align-self-center">
                (+{{ selectedProtocol.length - 1 }})
              </span>
            </template>
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Category</div>
        <div>
          <v-select v-model="selectedCategories" label="All Category" :items="allCategorieItems"
            class="width-adjust select-box2" :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']"
            variant="plain" density="compact" item-title="text" :hide-details="true" center-affix multiple clearable>
            <template v-slot:prepend-item>
              <v-list-item title="Select All" @click="onCategorieSelectionChange">
                <template v-slot:prepend>
                  <v-checkbox-btn :color="likesSomeCategories ? 'black-darken-4' : undefined"
                    :indeterminate="likesSomeCategories && !likesAllCategories"
                    :model-value="likesAllCategories"></v-checkbox-btn>
                </template>
              </v-list-item>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip density="compact" size="x-small" v-if="index < 1" :color="darkMode ? '#FFF' : ''">
                <span>{{ item.title.substring(0, 5) + '...' }}</span>
              </v-chip>
              <span v-if="index === 1" class="text-grey align-self-center more-selection-text">
                (+{{ selectedCategories.length - 1 }})
              </span>
            </template>
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Period</div>
        <div>
          <v-select v-model="seletedDuration" class="select-box2 width-adjust"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" label="Select Period" :items="dataPeriod"
            item-title="label" item-value="value" :hide-details="true" variant="plain" density="compact" center-affix>
            <template v-slot:selection="{ item }">
              <div style="font-size: 14px; font-weight: 600"> {{ item.title }}
              </div>
            </template>
          </v-select>

        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Token 1</div>
        <div>
          <v-select v-model="selectedToken1" class="select-box2 width-adjust"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" label="Search Token 1" :items="sortedToken1"
            variant="plain" density="compact" item-title="text" :hide-details="true" multiple clearable center-affix
            @update:model-value="finalSearchToken1 = ''">
            <template v-slot:prepend-item>
              <div class="d-flex justify-space-between">
                <v-text-field v-model="searchToken1" label="Search or Select" append-inner-icon="mdi-magnify"
                  variant="outlined" class="pt-2 px-2" :hide-details="true" density="compact"
                  @click:append-inner="handleSearchWithToken('token1')"
                  @keydown.enter="handleSearchWithToken('token1')" />
              </div>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 1" density="compact" size="x-small" :color="darkMode ? '#FFF' : ''">
                <span>{{ item.title.substring(0, 3) + '...' }}</span>
              </v-chip>
              <span v-if="index === 1" class="text-grey align-self-center more-selection-text">
                (+{{ selectedToken1.length - 1 }})
              </span>
            </template>
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-3 mb-5">
        <div class="text-customText">Token 2</div>
        <div>
          <v-select v-model="selectedToken2" label="Search Token 2" class="select-box2 width-adjust"
            :class="[darkMode ? 'select-box2-dark' : 'select-box2-light']" :items="sortedToken2" variant="plain"
            density="compact" item-title="text" :hide-details="true" multiple clearable center-affix
            @update:model-value="finalSearchToken2 = ''">
            <template v-slot:prepend-item>
              <div class="d-flex justify-space-between">
                <v-text-field v-model="searchToken2" label="Search or Select" append-inner-icon="mdi-magnify"
                  variant="outlined" class="pt-2 px-2" :hide-details="true" density="compact"
                  @keydown.enter="handleSearchWithToken('token2')"
                  @click:append-inner="handleSearchWithToken('token2')" />
                <!-- <a href="#" class="pt-2 px-2 mt-2 clear-link" @click.prevent="clearTokenFilter">Clear</a> -->
              </div>
              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 1" density="compact" size="x-small" :color="darkMode ? '#FFF' : ''">
                <span>{{ item.title.substring(0, 2) + '.' }}</span>
              </v-chip>
              <span v-if="index === 1" class="text-grey  align-self-center more-selection-text">
                (+{{ selectedToken2.length - 1 }})
              </span>
            </template>
          </v-select>
        </div>
      </div>

      <div class="d-flex flex-column mr-4 mb-5">
        <div class="text-customText">APR</div>
        <v-menu v-model="menu1" :close-on-content-click="false" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn class="text-customText reset-filters"
              :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']" v-bind="props">
              Set APR
            </v-btn>
          </template>
          <v-card class="mt-5 custom-card-class" height="220" width="300">
            <div class="d-flex flex-column">
              <v-text-field v-model="tempAprMinPrice" label="Min" variant="outlined" class="pt-10 px-10"
                :hide-details="true" density="compact" suffix="%"></v-text-field>
              <v-text-field v-model="tempAprMaxPrice" label="Max" variant="outlined" class="px-10 pt-5 pb-5"
                :hide-details="true" density="compact" suffix="%"></v-text-field>
              <div class="d-flex justify-center">
                <v-btn class="text-none" :color="darkMode ? '#BFAC62' : '#0F2357'" size="large" @click="applyAprFilter">
                  Apply
                </v-btn>
              </div>

            </div>
          </v-card>
        </v-menu>
      </div>

      <div class="d-flex flex-column mr-4 mb-5">
        <div class="text-customText">TVL</div>
        <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn class="text-customText reset-filters"
              :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']" v-bind="props">
              Set TVL
            </v-btn>
          </template>
          <v-card class="mt-5 custom-card-class" height="220" width="300">
            <div class="d-flex flex-column">
              <v-text-field v-model="tempTvlMinPrice" label="Min" variant="outlined" class="pt-10 px-10"
                :hide-details="true" density="compact"></v-text-field>
              <v-text-field v-model="tempTvlMaxPrice" label="Max" variant="outlined" class="px-10 pt-5 pb-5"
                :hide-details="true" density="compact"></v-text-field>
              <div class="d-flex justify-center">
                <v-btn class="text-none" :color="darkMode ? '#BFAC62' : '#0F2357'" size="large" @click="applyTvlFilter">
                  Apply
                </v-btn>
              </div>

            </div>
          </v-card>
        </v-menu>
      </div>

      <div class="mt-6 mr-4 mb-5 d-flex">
        <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
          @click="showFavourites = !showFavourites" style="flex: 1 0 auto;">
          <span v-if="showFavourites" :class="{ 'custom-star-light': !darkMode, 'custom-star-dark': darkMode }">⭐</span>
          <span v-else
            :class="{ 'custom-star-not-selected-light': !darkMode, 'custom-star-not-selected-dark': darkMode }">⭐</span>
          <span v-if="isWidthSmallScreen">&nbsp; {{ showFavourites ? 'Hide' : 'Show' }} Favorites</span>
          <v-tooltip activator="parent" location="bottom">{{ showFavourites ? 'Hide' : 'Show' }} Favorites</v-tooltip>
        </v-btn>

      </div>

      <div class="mt-6 d-flex justify-center mb-5" :class="isHeightSmallScreen ? 'mb-10' : 'mb-5'">
        <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
          @click="resetFilter">
          Reset
        </v-btn>
      </div>
    </component>

    <v-data-table v-model="selected" :headers="headers" :items="filterArrayData" item-value="pairAddress"
      :items-per-page="isHeightSmallScreen ? 5 : 10" :loading="loading" show-select
      :class="[darkMode ? 'custom-dark-table-background' : 'custom-light-table-background']"
      @update:sort-by="updateSort">
      <template v-slot:header.data-table-select>
        <!-- <v-checkbox-btn :indeterminate="someSelected && !allSelected" :model-value="allSelected" color="primary"
          @update:model-value="(val) => handleSelectAll(val, selectAll, allSelected)"></v-checkbox-btn> -->
      </template>
      <template v-slot:item.data-table-select="{ internalItem, isSelected, toggleSelect }">
        <StarCheckbox :model-value="isSelected(internalItem)" color="primary"
          @update:model-value="(val) => handleSelectCheckbox(val, toggleSelect, internalItem)" />
      </template>
      <template v-slot:item.BaseToken="{ item }">
        <span class="router-link text-customText" style="cursor: pointer;" @click="handlePoolRoute(item.pairAddress)">
          {{ item.BaseToken.substring(0, 10) }}
          / {{ item.QuoteToken.substring(0, 10) }} {{ item.feeTier != 0 ? (item.feeTier / 10000) + '%' : '' }}
        </span>
      </template>
      <template v-slot:item.ChainId="{ item }">
        <div class="text-capitalize">
          <span class="text-customText">
            <img :src="chainIcon(item.ChainId)" alt="Chain Icon" class="token-icon">
            {{ item.ChainId != null ? item.ChainId : '' }}
          </span>
        </div>
      </template>
      <template v-slot:item.DexId="{ item }">
        <div class="text-capitalize">
          <span class="text-customText">
            <img :src="protocolIcon(item.DexId)" alt="Protocol Icon" class="token-icon">
            {{ item.DexId != null ? item.DexId : '' }}
          </span>
        </div>
      </template>
      <template v-slot:item.apr="{ item }">
        <span class="text-customText">{{ (item.apr != null ? parseFloat(item.apr).toFixed(2) : 0.00) + '%' }}</span>
      </template>

      <!-- <template v-slot:item.corr="{ item }">
                <span class="text-customText">{{ (item.corr != null ? item.corr.toFixed(2) : 0.00)+'%' }}</span>
              </template> -->
      <template v-slot:item.corr="{ item }">
        <span class="text-customText">{{ item.corr }} %</span>
      </template>

      <template v-slot:item.Liquidity="{ item }">
        <span class="text-customText">{{ formatMoney(item.Liquidity) }}</span>
      </template>
      <template v-slot:item.Volume="{ item }">
        <span class="text-customText">{{ formatMoney(item.Volume) }}</span>
      </template>
      <template v-slot:item.fees="{ item }">
        <span class="text-customText">{{ formatMoney(item.fees) }}</span>
      </template>
      <template v-slot:item.vol_tvl_new="{ item }">
        <span class="text-customText">{{ item.vol_tvl_new
          }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>
<style scoped>
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

/* @media (min-width: 1024px) {
  .filter-common {
    flex-wrap: wrap !important;
  }
} */
</style>
