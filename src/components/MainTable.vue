<script setup>
import { useTheme } from 'vuetify';
import { ref, onMounted, computed, watch } from 'vue';
import apiClient from '../utils/axios.js';
import { formatMoney } from '@/utils/formatMoney.js';
import { ALL_CHAINS, ALL_PROTOCOL, MAIN_TABLE_HEADER,ALL_CATEGORIES, DATA_PERIOD } from '@/constant/index.js'


const theme = useTheme();
const dataPeriod = DATA_PERIOD;
const seletedDuration = ref('all');

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
  if(searchToken1.value) {
    return token1.value.filter((tokenName) => tokenName.toLowerCase().includes(searchToken1.value.toLocaleLowerCase()));
  }
  return token1.value.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
});

const sortedToken2 = computed(() => {
  if(searchToken2.value) {
    return token2.value.filter((tokenName) => tokenName.toLowerCase().includes(searchToken2.value.toLocaleLowerCase()));
  }
  return token2.value.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
});

// Function to filter data by selected period
const filterDataByPeriod = () => {
  const selectedPeriod = parseInt(seletedDuration.value, 10);  // Convert the selected duration to a number
  filteredItems.value = items.value.filter(item => {
    // Assuming `item.period` exists and represents the duration in days
    return item.period <= selectedPeriod;
  });
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
      selectedValues.some((selectedValue) => item.baseTokenCategories.includes(selectedValue))
    );
  }

  // Apply token filters
  if (selectedToken1.value.length > 0) {
    const selectedValues = [...selectedToken1.value];
    filterData = filterData.filter((item) => selectedValues.includes(item.BaseToken));
  }
  if (selectedToken2.value.length > 0) {
    const selectedValues = [...selectedToken2.value];
    filterData = filterData.filter((item) => selectedValues.includes(item.QuoteToken));
  }

  // Apply TVL and APR filters
  if (tvlMinPrice.value !== 0) {
    filterData = filterData.filter((item) => item.Liquidity >= tvlMinPrice.value);
  }
  if (tvlMaxPrice.value !== 0) {
    filterData = filterData.filter((item) => item.Liquidity <= tvlMaxPrice.value);
  }
  if (aprMinPrice.value !== 0 || aprMaxPrice.value !== 0) {
    filterData = filterData.filter((item) => {
      return (
        (aprMinPrice.value === 0 || item.apr >= aprMinPrice.value) &&
        (aprMaxPrice.value === 0 || item.apr <= aprMaxPrice.value)
      );
    });
  }

  // Apply period filter
  if (seletedDuration.value !== 'all') {
    const periodFieldMapping = {
      '7': 'SMA_Volume7d',
      '30': 'SMA_Volume30d',
      '90': 'SMA_Volume90d',
      '180': 'SMA_Volume180d',
    };

    const liquidityFieldMapping = {
      '7': 'SMA_Liquidity7d',
      '30': 'SMA_Liquidity30d',
      '90': 'SMA_Liquidity90d',
      '180': 'SMA_Liquidity180d',
    };

    const feesFieldMapping = {
      '7': 'SMA_Fees7d',
      '30': 'SMA_Fees30d',
      '90': 'SMA_Fees90d',
      '180': 'SMA_Fees180d',
    };

    const aprFieldMapping = {
      '7': 'SMA_APR7d',
      '30': 'SMA_APR30d',
      '90': 'SMA_APR90d',
      '180': 'SMA_APR180d',
    };

    const selectedPeriod = seletedDuration.value;

    // Map the data fields dynamically for the selected period
    filterData = filterData.map((item) => {
      return {
        ...item,
        Volume: item[periodFieldMapping[selectedPeriod]],
        Liquidity: item[liquidityFieldMapping[selectedPeriod]],
        Fees: item[feesFieldMapping[selectedPeriod]],
        APR: item[aprFieldMapping[selectedPeriod]],
      };
    });
    // Remove items where mapped fields are null or undefined
    filterData = filterData.filter((item) => {
      return item.Volume !== null && item.Volume !== undefined &&
            item.Liquidity !== null && item.Liquidity !== undefined &&
            item.Fees !== null && item.Fees !== undefined &&
            item.APR !== null && item.APR !== undefined;
    });
  }

  // Prioritize selected pairs
  if (selected.value.length > 0) {
    const fav = [];
    const notFav = [];
    filterData.forEach((item) => {
      if (selected.value.includes(item.pairAddress)) {
        fav.push(item);
      } else {
        notFav.push(item);
      }
    });
    filterData = [...fav, ...notFav];
  }
  console.log('Filtered Data:', filterData);
  return filterData;
});


// Function to get the best correlation value from 7d, 30d, 90d, 180d fields
const getBestCorrelation = (item) => {
const correlations = [
  item.Correlation7d,
  item.Correlation30d,
  item.Correlation90d,
  item.Correlation180d
];

// Find the first non-null, non-undefined correlation value
const bestCorrelation = correlations.find(correlation => correlation !== null && correlation !== undefined);

// Return the formatted correlation or 'N/A' if none is found
return bestCorrelation !== undefined ? formatCorrelation(bestCorrelation) : 'N/A';
};
const formatCorrelation = (correlation) => {
return Math.round(Math.abs(correlation) * 100) + ' %';
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


const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get('api/message/0');
    items.value = data.output;
    items.value.forEach((element) => {
      let baseToken = element.BaseToken.substring(0,10);
      if(!token1.value.includes(baseToken)) {

        token1.value.push(baseToken);
      }
      let baseTokenCategories = element.baseTokenCategories;
      let categories = Array.isArray(baseTokenCategories)
        ? baseTokenCategories
            .map(token => Array.isArray(element.baseTokenCategories) ? element.baseTokenCategories : [])
            .flat()
        : [];
      if(!token3.value.includes(categories)) {
        token3.value.push(element.baseTokenCategories);
      }
      
      let quoteToken = element.QuoteToken.substring(0,10);
      if(!token2.value.includes(quoteToken)) {
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
  seletedDuration.value = 'all';
  selectedToken1.value = [];
  selectedToken2.value = [];
  tempTvlMinPrice.value = tvlMinPrice.value = 0;
  tempTvlMaxPrice.value = tvlMaxPrice.value = 0;
  tempAprMinPrice.value = aprMinPrice.value = 0;
  tempAprMaxPrice.value = aprMaxPrice.value = 0;
}

const onChainSelectionChange = () => {
  if(seletedChains.value.length === 0) {
    seletedChains.value = allChainItems.map(item => item.value);
  } else if(seletedChains.value.length === allChainItems.length) {
    seletedChains.value = [];
  } else if(allChainItems.length >= seletedChains.value.length) {
    seletedChains.value = allChainItems.map(item => item.value);
  }
}

const onProtocolSelectionChange = () => {
  if(selectedProtocol.value.length === 0) {
    selectedProtocol.value = allProtocolItems.map(item => item.value);
  } else if(selectedProtocol.value.length === allProtocolItems.length) {
    selectedProtocol.value = [];
  } else if(allProtocolItems.length >= selectedProtocol.value.length) {
    selectedProtocol.value = allProtocolItems.map(item => item.value);
  }
}

const onCategorieSelectionChange = () => {
  
  if(selectedCategories.value.length === 0) {
    selectedCategories.value = allCategorieItems.map(item => item.value);
  } else if(selectedCategories.value.length === allCategorieItems.length) {
    selectedCategories.value = [];
  } else if(allCategorieItems.length >= selectedCategories.value.length) {
    selectedCategories.value = allCategorieItems.map(item => item.value);
  }
}

const chainIcon = (value) => {
  return `../assets/images/chains/${value}.png`;
}

const protocolIcon = (value) => {
  return `../assets/images/protocols/${value}.png`;
}

watch(selected, async (newValue) => {
  localStorage.setItem("favItems", newValue);
});

const updateSort = (value) => {
  console.log('update value', value);
}

watch(items, () => {
  filterDataByPeriod();  // Automatically apply period filter once items are fetched
});


// Watch for changes in selected duration or other filters
// watch(seletedDuration, () => {
//   filterArrayData.value; // Recalculate when duration or filters change
// });

onMounted(() => {
  fetchData();
  const favItems = localStorage.getItem('favItems');
  if(favItems) {
    selected.value = localStorage.getItem('favItems').split(',');
  }
});

</script>


  <template>
      <v-container class="mt-7 mb-10">
        <div class="d-flex filters-items">
          <div class="d-flex flex-column mr-3 mb-5">
            <div class="text-customText">Chain</div>
            <div>
              <v-select
                v-model="seletedChains"
                label="All Chains"
                :items="allChainItems"
                class="width-adjust select-box2"
                :class="[darkMode ? 'select-box2-dark': 'select-box2-light']"
                multiple
                variant="plain"
                density="compact"
                item-title="text"
                center-affix
                :hide-details="true"
                clearable
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    title="Select All"
                    @click="onChainSelectionChange"
                  >
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="likesSomeChains ? 'black-darken-4' : undefined"
                        :indeterminate="likesSomeChains && !likesAllChains"
                        :model-value="likesAllChains"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
                <template v-slot:selection="{ item, index }">
                  
                  <v-chip v-if="index < 1" :color="darkMode ? '#FFF': ''">
                    <span>{{ item.title.substring(0, 2) + '.' }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ seletedChains.length - 1 }})
                  </span>
                </template>
              </v-select>
            </div>
          </div>

          <div class="d-flex flex-column mr-3">
            <div class="text-customText">Protocol</div>
            <div>
              <v-select
                v-model="selectedProtocol"
                label="All Protocol"
                :items="allProtocolItems"
                class="width-adjust select-box2"
                :class="[darkMode ? 'select-box2-dark': 'select-box2-light']"
                variant="plain"
                density="compact"
                item-title="text"
                :hide-details="true"
                center-affix
                multiple
                clearable
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    title="Select All"
                    @click="onProtocolSelectionChange"
                  >
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="likesSomeProtocols ? 'black-darken-4' : undefined"
                        :indeterminate="likesSomeProtocols && !likesAllProtocols"
                        :model-value="likesAllProtocols"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 1" :color="darkMode ? '#FFF': ''">
                    <span>{{ item.title.substring(0, 2) + '.' }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ selectedProtocol.length - 1 }})
                  </span>
                </template>
            </v-select>
            </div>
          </div>

          <div class="d-flex flex-column mr-3">
            <div class="text-customText">Category</div>
            <div>
              <v-select
                v-model="selectedCategories"
                label="All Category"
                :items="allCategorieItems"
                class="width-adjust select-box2"
                :class="[darkMode ? 'select-box2-dark': 'select-box2-light']"
                variant="plain"
                density="compact"
                item-title="text"
                :hide-details="true"
                center-affix
                multiple
                clearable
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    title="Select All"
                    @click="onCategorieSelectionChange"
                  >
                    <template v-slot:prepend>
                      <v-checkbox-btn
                        :color="likesSomeCategories ? 'black-darken-4' : undefined"
                        :indeterminate="likesSomeCategories && !likesAllCategories"
                        :model-value="likesAllCategories"
                      ></v-checkbox-btn>
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 1" :color="darkMode ? '#FFF': ''">
                    <span>{{ item.title.substring(0, 2) + '.' }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ selectedCategories.length - 1 }})
                  </span>
                </template>
            </v-select>
            </div>
          </div>

          <div class="d-flex flex-column mr-3">
            <div class="text-customText">Period</div>
              <div>
                  <v-select
                  v-model="seletedDuration"
                  class="select-box2 width-adjust"
                  :class="[darkMode ? 'select-box2-dark': 'select-box2-light']"
                  label="Select Period"
                  :items="dataPeriod"
                  item-title="label"
                  item-value="value"
                  :hide-details="true"
                  variant="plain"
                  density="compact"

                />
              </div>
          </div>

          <div class="d-flex flex-column mr-3">
            <div class="text-customText">Token 1</div>
              <div>               
                <v-select
                  v-model="selectedToken1"
                  class="select-box2 width-adjust"
                  :class="[darkMode ? 'select-box2-dark': 'select-box2-light']"
                  label="Select Token 1"
                  :items="sortedToken1"
                  variant="plain"
                  density="compact"
                  item-title="text"
                  :hide-details="true"
                  multiple
                  clearable
                  center-affix
                >
                <template v-slot:prepend-item>
                  <div class="d-flex justify-space-between">
                    <v-text-field
                      v-model="searchToken1"
                      label="Search"
                      variant="outlined"
                      class="pt-2 px-2"
                      :hide-details="true"
                      density="compact"
                    />
                  </div>
                  <v-divider class="mt-2"></v-divider>
                </template>
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 1" :color="darkMode ? '#FFF': ''">
                      <span>Hello</span>
                    </v-chip>
                    <span
                      v-if="index === 1"
                      class="text-grey text-caption align-self-center"
                    >
                      (+{{ selectedToken1.length - 1 }})
                    </span>
                  </template>
                </v-select>
              </div>
          </div>
          
          <div class="d-flex flex-column mr-3">
            <div class="text-customText">Token 2</div>
            <div>
              <v-select
                v-model="selectedToken2"
                label="Select Token 2"
                class="select-box2 width-adjust"
                :class="[darkMode ? 'select-box2-dark': 'select-box2-light']"
                :items="sortedToken2"
                variant="plain"
                density="compact"
                item-title="text"
                :hide-details="true"
                multiple
                clearable
                center-affix
              >
                <template v-slot:prepend-item>
                  <div class="d-flex justify-space-between">
                    <v-text-field
                      v-model="searchToken2"
                      label="Search"
                      variant="outlined"
                      class="pt-2 px-2"
                      :hide-details="true"
                      density="compact"
                    />
                    <!-- <a href="#" class="pt-2 px-2 mt-2 clear-link" @click.prevent="clearTokenFilter">Clear</a> -->
                  </div>
                  <v-divider class="mt-2"></v-divider>
                </template>
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 1" :color="darkMode ? '#FFF': ''">
                  <span>{{ item.title.substring(0, 2) + '.' }}</span>
                </v-chip>
                <span
                  v-if="index === 1"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ selectedToken2.length - 1 }})
                </span>
              </template>
            </v-select>
            </div>
          </div>

          <div class="d-flex flex-column mr-4">
              <div class="text-customText">APR</div>
              <v-menu
                  v-model="menu1"
                  :close-on-content-click="false"
                  location="bottom"
              >
                  <template v-slot:activator="{ props }">
                      <v-btn
                        class="text-customText reset-filters"
                        :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
                        v-bind="props"
                      >
                          Set APR
                      </v-btn>
                  </template>
                  <v-card class="mt-5 custom-card-class" height="220" width="300">
                      <div class="d-flex flex-column">
                          <v-text-field
                              v-model="tempAprMinPrice"
                              label="Min (%)"
                              variant="outlined"
                              class="pt-10 px-10"
                              :hide-details="true"
                              density="compact"
                          ></v-text-field>
                          <v-text-field
                              v-model="tempAprMaxPrice"
                              label="Max (%)"
                              variant="outlined"
                              class="px-10 pt-5 pb-5"
                              :hide-details="true"
                              density="compact"
                          ></v-text-field>
                          <div class="d-flex justify-center">
                            <v-btn
                              class="text-none"
                              :color="darkMode ? '#BFAC62' : '#0F2357'"
                              size="large"
                              @click="applyAprFilter"
                            >
                              Apply
                            </v-btn>
                          </div>
                          
                      </div>
                  </v-card>
              </v-menu>
          </div>

          <div class="d-flex flex-column mr-4">
              <div class="text-customText">TVL</div>
              <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  location="bottom"
              >
                  <template v-slot:activator="{ props }">
                      <v-btn
                        class="text-customText reset-filters"
                        :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']"
                        v-bind="props"
                      >
                          Set TVL
                      </v-btn>
                  </template>
                  <v-card class="mt-5 custom-card-class" height="220" width="300">
                      <div class="d-flex flex-column">
                          <v-text-field
                              v-model="tempTvlMinPrice"
                              label="Min"
                              variant="outlined"
                              class="pt-10 px-10"
                              :hide-details="true"
                              density="compact"
                          ></v-text-field>
                          <v-text-field
                              v-model="tempTvlMaxPrice"
                              label="Max"
                              variant="outlined"
                              class="px-10 pt-5 pb-5"
                              :hide-details="true"
                              density="compact"
                          ></v-text-field>
                          <div class="d-flex justify-center">
                            <v-btn
                              class="text-none"
                              :color="darkMode ? '#BFAC62' : '#0F2357'"
                              size="large"
                              @click="applyTvlFilter"
                            >
                              Apply
                            </v-btn>
                          </div>
                          
                      </div>
                  </v-card>
              </v-menu>
          </div>

          <div class="mt-6">
            <v-btn class="text-customText reset-filters" :class="[darkMode ? 'reset-filters-dark' : 'reset-filters-light']" @click="resetFilter">
              Reset
            </v-btn>
          </div>

        </div>
          <v-data-table
              v-model="selected"
              :headers="headers"
              :items="filterArrayData"
              item-value="pairAddress"
              items-per-page="10"
              :loading="loading"
              show-select
              :class="[darkMode ? 'custom-dark-table-background' : 'custom-light-table-background']"
              @update:sort-by="updateSort"
              >
              <template v-slot:item.BaseToken="{ item }">
                <router-link class="router-link text-customText" :to="`/pool/${item.pairAddress}`">
                  {{ item.BaseToken.substring(0,10) }}
                    / {{ item.QuoteToken.substring(0,10) }} {{ item.feeTier !=0 ? (item.feeTier/10000) + '%': ''}}
                </router-link>
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
                <span class="text-customText">{{ (item.apr != null ? item.apr.toFixed(2) : 0.00)+'%' }}</span>
              </template>

              <!-- <template v-slot:item.corr="{ item }">
                <span class="text-customText">{{ (item.corr != null ? item.corr.toFixed(2) : 0.00)+'%' }}</span>
              </template> -->
              <template v-slot:item.corr="{ item }">
                <span class="text-customText">{{ getBestCorrelation(item) }}</span>
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
              <template v-slot:item.vol_tvl="{ item }">
                <span class="text-customText">{{ item.Liquidity !=0 ? ( (item.Volume / item.Liquidity).toFixed(2)) : 0.00 }}</span>
              </template>
          </v-data-table>
      </v-container>
  </template>
  <style scoped>
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
    line-height: 20px; /* 142.857% */
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
    top:30% !important;
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

  ::v-deep .mdi-close-circle.v-theme--dark  {
    color: #FFF;
  }
  .clear-link {
    text-decoration: none;
  }

  ::v-deep .v-table > .v-table__wrapper > table > thead > tr > th {
    height: 44px !important;
  }

  ::v-deep .v-table > .v-table__wrapper > table > tbody > tr > td {
    padding: 10px 18px !important;
  }

  ::v-deep .v-table > .v-table__wrapper > table > thead > tr > th {
    padding: 0px 18px !important;
  }
  .token-icon {
  width: 20px; /* Adjust size as needed */
  height: 20px; /* Adjust size as needed */
  vertical-align: middle; /* Aligns the image with the text */
  margin-right: 5px; /* Adds spacing between the image and text */
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

</style>