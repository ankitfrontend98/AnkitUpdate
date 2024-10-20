<script setup>
import { useTheme } from 'vuetify';
import { ref, onMounted, computed, watch } from 'vue';
import apiClient from '../utils/axios.js';
import { formatMoney } from '@/utils/formatMoney.js';
import { ALL_CHAINS, ALL_PROTOCOL, MAIN_TABLE_HEADER,ALL_CATEGORIES, DATA_PERIOD } from '@/constant/index.js'


const theme = useTheme();
const dataPeriod = DATA_PERIOD;
const seletedDuration = ref('30');

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
  console.log(token1);
});

//   const sortedToken1 = computed(() => {
//     if (searchToken1.value) {
//       // Search the token based on the 'title' key
//       return token1.value.filter((token) => 
//         token.title.toLowerCase().includes(searchToken1.value.toLowerCase())
//       );
//     }
//     // Sort the tokens by 'title' key
//     return token1.value.sort((a, b) => 
//       a.title.toLowerCase().localeCompare(b.title.toLowerCase())
//     );
// });

const sortedToken2 = computed(() => {
  if(searchToken2.value) {
    return token2.value.filter((tokenName) => tokenName.toLowerCase().includes(searchToken2.value.toLocaleLowerCase()));
  }
  return token2.value.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
});

const filterArrayData = computed(() => {
    let filterData = items.value.map((element) => {
      return {
        ...element,
        vol_tvl: element.Liquidity !=0 ? ( parseFloat((element.Volume / element.Liquidity).toFixed(2))) : 0.00
      }
    });
    if(seletedChains.value.length > 0) {
      const seletedValues = seletedChains.value.filter((item) => item !== 'all_select');
      filterData = filterData.filter((item) => {
        return seletedValues.includes(item.ChainId);
      });
    }
    if(selectedProtocol.value.length > 0) {
      const seletedValues = selectedProtocol.value.filter((item) => item !== 'all_select');
      filterData = filterData.filter((item) => {
        console.log('Kuladeep', item);
        
        return seletedValues.includes(item.DexId);
      });
    }

    if (selectedCategories.value.length > 0) {
      const selectedValues = selectedCategories.value.filter((item) => item !== 'all_select');
      filterData = filterData.filter((item) => 
        selectedValues.some(selectedValue => item.baseTokenCategories.includes(selectedValue))
      );
    }

    if(selectedToken1.value.length > 0) {
      const seletedValues = [...selectedToken1.value]
      filterData = filterData.filter((element) => seletedValues.includes(element.BaseToken));
    }

    if(selectedToken2.value.length > 0) {
      const seletedValues = [...selectedToken2.value]
      filterData = filterData.filter((element) => seletedValues.includes(element.QuoteToken));
    }

    if(tvlMinPrice.value !== 0) {
      filterData = filterData.filter((element) => element.Liquidity >= tvlMinPrice.value);
    }

    if(tvlMaxPrice.value !== 0) {
      filterData = filterData.filter((element) => element.Liquidity <= tvlMaxPrice.value);
    }
    
    if(tempAprMinPrice.value !== 0) {
      filterData = filterData.filter(item => {
        const apr = item.apr || 0; // Use 0 if apr is null
        return apr >= tempAprMinPrice.value && apr <= tempAprMaxPrice.value;
      });
    }

    if(aprMaxPrice.value !== 0) {
      filterData = filterData.filter((element) => element.Liquidity <= aprMaxPrice.value);
    }

    if(selected.value.length > 0){
      const notFav = [];
      const fav = [];
      filterData.forEach((element) => {
        if(!selected.value.includes(element.pairAddress)) {
          notFav.push(element);
        } else {
          fav.push(element);
        }
      });
      filterData = [...fav, ...notFav];
    }
    // Apply period filter
    // const selectedPeriod = parseInt(seletedDuration.value, 10);
    // filterData = filterData.filter(item => item.period <= selectedPeriod);
    console.log('Filtered data:', filterData);
    return filterData;
});


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
        // token1.value.push({
        //   title: baseToken,
        //   baseTokenIcon: (element.baseTokenIcon != '')?element.baseTokenIcon:'src/assets/logo-light.png'
        // });
        token1.value.push(baseToken);
      }
      //console.log(token1);
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

// Filter items based on selected duration
const filterDataByPeriod = () => {
  const selectedPeriod = parseInt(seletedDuration.value, 10);
  filteredItems.value = items.value.filter((item) => {
    return item.period <= selectedPeriod;
  });
};

const applyTvlFilter = () => {
  menu.value = false;
  tvlMinPrice.value = tempTvlMinPrice.value;
  tvlMaxPrice.value = tempTvlMaxPrice.value;
}

const applyAprFilter = () => {
  menu1.value = false;
}

const resetFilter = () => {
  seletedChains.value = [];
  selectedProtocol.value = [];
  selectedCategories.value = [];
  seletedDuration.value = '30';
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

// const updateOptions = (value) => {
//   console.log('update updateOptions', value);
// }

watch(selected, async (newValue) => {
  localStorage.setItem("favItems", newValue);
});

// watch(searchToken1, async (newValue) => {
//   console.log('newValue', newValue);
//   sortedToken1.value = sortedToken1.value.filter((tokenName) => tokenName.includes(newValue));
// });

const updateSort = (value) => {
  console.log('update value', value);
}

// Watch for changes in selected duration and apply filters
watch([seletedDuration, selectedCategories, selected], () => {
  // You can call a function to update the filtered data
  filterArrayData.value; // This will trigger the computed property to recalculate
});

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
                
                <v-chip v-if="index < 2" :color="darkMode ? '#FFF': ''">
                  <span>{{ item.title.substring(0, 2) + '.' }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ seletedChains.length - 2 }})
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
                <v-chip v-if="index < 2" :color="darkMode ? '#FFF': ''">
                  <span>{{ item.title.substring(0, 2) + '.' }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ selectedProtocol.length - 2 }})
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
                <v-chip v-if="index < 2" :color="darkMode ? '#FFF': ''">
                  <span>{{ item.title.substring(0, 2) + '.' }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >
                  (+{{ selectedCategories.length - 2 }})
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
                label="Select period"
                :items="dataPeriod"
                item-title="label"
                item-value="value"
                :hide-details="true"
                variant="plain"
                density="compact"
                @change="filterDataByPeriod"
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
                  <v-chip v-if="index < 2" :color="darkMode ? '#FFF': ''">
                    <span>Hello</span>
                  </v-chip>
                  <span
                    v-if="index === 2"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ selectedToken1.length - 2 }})
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
              <v-chip v-if="index < 2" :color="darkMode ? '#FFF': ''">
                <span>{{ item.title.substring(0, 2) + '.' }}</span>
              </v-chip>
              <span
                v-if="index === 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ selectedToken2.length - 2 }})
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
                            label="Min"
                            variant="outlined"
                            class="pt-10 px-10"
                            :hide-details="true"
                            density="compact"
                        ></v-text-field>
                        <v-text-field
                            v-model="tempAprMaxPrice"
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
                <!-- <span class="text-customText">
                  <img :src="item.quoteTokenIcon" alt="Quote Token Icon" class="token-icon">{{ item.ChainId != null ? item.ChainId : '' }}
                </span> -->
                <span class="text-customText">
                  <img :src="chainIcon(item.ChainId)" alt="Chain Icon" class="token-icon">
                  {{ item.ChainId != null ? item.ChainId : '' }}
                </span>
              </div>
            </template>
            <template v-slot:item.DexId="{ item }">
              <div class="text-capitalize">
                <!-- <span class="text-customText">
                  <img :src="item.quoteTokenIcon" alt="Quote Token Icon" class="token-icon">{{ item.DexId != null ? item.DexId : '' }}
                </span> -->
                <span class="text-customText">
                  <img :src="protocolIcon(item.DexId)" alt="Protocol Icon" class="token-icon">
                  {{ item.DexId != null ? item.DexId : '' }}
                </span>
              </div>
            </template>
            <template v-slot:item.apr="{ item }">
              <span class="text-customText">{{ (item.apr != null ? item.apr.toFixed(2) : 0.00)+'%' }}</span>
            </template>

            <template v-slot:item.corr="{ item }">
              <span class="text-customText">{{ (item.corr != null ? item.corr.toFixed(2) : 0.00)+'%' }}</span>
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
      min-width: 200px !important;
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
  }
  @media (min-width: 1280px) {
      .v-container {
        max-width: 1700px !important;
        width: 100% !important;
        padding: 16px 4% !important;
      }
  }

</style>