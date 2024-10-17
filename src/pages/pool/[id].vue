<template>
    <v-container class="mt-10">
      <div class="d-flex justify-space-between">
        <div>
          <v-icon color="#FFF" v-if="darkMode">mdi-arrow-left</v-icon>
          <v-icon v-if="!darkMode">mdi-arrow-left</v-icon>
          <router-link to="/" class="router-link">Back to all pools</router-link>
        </div>
        <div>
          <v-select
            v-model="seletedDuration"
            :items="dataPeriod"
            item-title="label"
            item-value="value"
            :class="[darkMode ? 'select-box-dark': 'select-box-light', 'select-box-detail']"
            :hide-details="true"
            variant="compact"
            density="plain"
          />
        </div>
      </div>
      <div class="mt-4">
        <v-card :class="[darkMode ? 'dark-token-details' : 'token-detail']">
          <div class="d-flex justify-space-between pa-6 align-center" v-if="!loading">
            <div class="d-flex flex-column ml-4">
              <div class="label-color">Base Token</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length ? poolDetailsPeriods[0]?.BaseToken : '' }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Quote Token</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length ? poolDetailsPeriods[0]?.QuoteToken : '' }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Chain</div>
                <div class="text-capitalize label-font text-h5 text-textItemColor">
                  <span class="text-customText">
                    <img v-if="poolDetailsPeriods.length > 0 && poolDetailsPeriods[0].ChainId"  :src="chainIcon(poolDetailsPeriods[0].ChainId)" alt="Quote Token Icon" class="token-icon">
                    {{ poolDetailsPeriods.length > 0 ? poolDetailsPeriods[0].ChainId : '' }}
                  </span>
                </div>
              </div>

              <div class="d-flex flex-column">
                <div class="label-color">Protocol</div>
                <div class="text-capitalize label-font text-h5 text-textItemColor">
                  <span class="text-customText">
                    <!-- Check if the array length is greater than 0 and if the image exists -->
                    <img v-if="poolDetailsPeriods.length > 0 && poolDetailsPeriods[0].baseTokenIcon"  :src="protocolIcon(poolDetailsPeriods[0].DexId)" alt="Quote Token Icon" class="token-icon">
                    <!-- Display DexId if the array length is greater than 0 -->
                    {{ poolDetailsPeriods.length > 0 ? poolDetailsPeriods[0].DexId : '' }}
                  </span>
                </div>
              </div>

            <div class="d-flex flex-column">
              <div class="label-color">Fee Tier(%)</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length ? (poolDetailsPeriods[0].feeTier / 10000) : '' }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Price (USD)</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPrice.priceUsd ? poolDetailsPrice.priceUsd : '' }}
              </div>
            </div>

            <div class="d-flex flex-column">
              <div class="label-color">Price Quote</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length ?  poolDetailsPeriods[0].priceNative : '' }}
              </div>
            </div>

          </div>
          <v-skeleton-loader
            v-if="loading"
            :loading="true"
            class="my-4 mx-4"
            width="97%"
            height="100px"
          />
        </v-card>
      </div>
      <div class="d-flex mt-4">
        <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'card-space']"> 
          <div class="pt-4 pb-4">
            <v-skeleton-loader 
              v-if="loading"
              :loading="true"
              class="my-7 mx-2"
              width="98%"
              height="100px"
            />
            <line-chart
              v-else
              :dark-mode="darkMode"
              :key="`${seletedDuration-darkMode}`"
              :labels="dailyPriceUsdChart.chartLabels"
              :show-exponential-digit="true"
              :series-name="'Daily Price(Base/USD)'"
              :data-values="dailyPriceUsdChart.chartDataPricesUSD"
              :map-colors="{
                stroke: darkMode ? '#DCC271': '#25356F',
                gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                offset:  darkMode ? '#DCC271' : '#2C61B0',
                offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
              }"
            />
          </div>
        </v-card>
        <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'card-space']">
          <div class="pt-4 pb-4">
            <v-skeleton-loader
              v-if="loading"
              :loading="true"
              class="my-7 mx-2"
              width="98%"
              height="100px"
            />
            <line-chart
              v-else
              :dark-mode="darkMode"
              :key="`${seletedDuration-darkMode}`"
              :labels="dailyPriceBaseQuote.chartLabels"
              :show-exponential-digit="true"
              :series-name="'Daily Price (Base/Quote)'"
              :data-values="dailyPriceBaseQuote.chartDataQuotePrices"
              :map-colors="{
                stroke: darkMode ? '#DCC271': '#25356F',
                gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                offset:  darkMode ? '#DCC271' : '#2C61B0',
                offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
              }"
            />
          </div>
        </v-card>
        <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'card-space']">
          <div class="pt-4 pb-4">
            <v-skeleton-loader
              v-if="loading"
              :loading="true"
              class="my-7 mx-2"
              width="98%"
              height="100px"
            />
            <line-chart
              v-else
              :dark-mode="darkMode"
              :key="`${seletedDuration-darkMode}`"
              :series-name="'Daily Price (Quote/Base)'"
              :show-exponential-digit="true"
              :map-colors="{
                stroke: darkMode ? '#F4F4F5' : '#BFAC62',
                gradientToColors: darkMode ? '#F4F4F5': '#BFAC62',
                offset: darkMode ? '#F4F4F5': '#BFAC62',
                offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(226, 217, 183, 0.46)'
              }"
              :labels="dailyPriceQuoteBase.chartLabels"
              :data-values="dailyPriceQuoteBase.chartDataRelativePrices"
            />
          </div>
        </v-card>
      </div>
        <div class="d-flex mt-6 justify-space-between">
            <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'bar-line-chart']">
              <div class="pt-4 pb-4">
                <v-skeleton-loader 
                    v-if="loading"
                    :loading="true"
                    class="my-7 mx-2"
                    width="97%"
                    height="300"
                />
                <bar-chart
                    v-else
                    :dark-mode="darkMode"
                    :key="`${seletedDuration-darkMode}`"
                    :series-name="['Daily Liquidity', 'Daily Volume']"
                    :labels="dailyVolumeBarData.chartLabels"
                    :data-values="[dailyVolumeBarData.chartDataLiquidity, dailyVolumeBarData.chartDataVolume]"
                />
              </div>
            </v-card>
            <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'bar-line-chart']">
              <div class="pt-4 pb-4">
                <v-skeleton-loader 
                    v-if="loading"
                    :loading="true"
                    class="my-7 mx-2"
                    width="97%"
                    height="300"
                />
                <line-chart
                  v-else
                  :dark-mode="darkMode"
                  :chart-width="570"
                  :key="`${seletedDuration-darkMode}`"
                  series-name="Daily APR"
                  :labels="dailyAprData.chartLabels"
                  :data-values="dailyAprData.chartDataAPR"
                  :map-colors="{
                      stroke: darkMode ? '#DCC271': '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset:  darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                  }"
                />
              </div>
            </v-card>
        </div>
  
      <div class="mt-4">
        <v-card :class="[darkMode ? 'dark-token-details' : 'token-detail']">
          <div class="d-flex justify-space-between pa-6 align-center"  v-if="!loading">
            <div class="d-flex flex-column">
              <div class="label-color">Avg APR% est.</div>
              <div class="label-font text-h5 text-textItemColor">
                {{  (weeklyAvgAPR.toFixed(3) != null ) ? weeklyAvgAPR.toFixed(2) + '%' : 0.00 + '%' }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Avg Liquidity</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyAvgLiquidity) : ''  }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Period Volume</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyVolume) : ''  }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Correlation</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length > 0 ? correlationEstimator.value.toFixed(3) : ''  }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Avg Volatility</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length > 0 ? (weeklyVolatility !==0 ? (weeklyVolatility.toFixed(2) + '%') : weeklyVolatility) : ''  }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Abs Volatility</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length > 0 ? (absoluteVolatility !==0 ? (absoluteVolatility.toFixed(2) + '%') : weeklyVolatility  ) : ''  }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Weekly Fees</div>
              <div class="label-font text-h5 text-textItemColor">
                {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyFees) : ''  }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="label-color">Dex screener</div>
              <div v-if="poolDetailsPeriods.length > 0">
                <a
                  :class="[darkMode ? 'anchor-link' : 'anchor-link-light']"
                  class=""
                  :href="`https://dexscreener.com/${poolDetailsPeriods[0].ChainId}/${poolDetailsPeriods[0].pairAddress}`"
                  target="_blank"
                >
                  Open
                </a>
              </div>
            </div>
          </div>
          <v-skeleton-loader
            v-if="loading"
            :loading="true"
            class="my-4 mx-4"
            width="97%"
            height="100px"
          />
        </v-card>
      </div>
  
      <div class="d-flex justify-space-between mt-4">
        <div>
          <v-tabs v-model="activeTab" :class="[darkMode ? 'tab-background-dark' : 'tab-background-light']" selected-class="active-tab">
            <v-tab
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              selected-class=""
              @click="handleTabClick(tab.value)"
              >{{ tab.title }}</v-tab
            >
          </v-tabs>
        </div>
        <div class="mt-1">
          <v-select
            v-model="seletedDuration"
            label="Select Duration"
            :items="dataPeriod"
            item-title="label"
            item-value="value"
            :class="[darkMode ? 'select-box-dark': 'select-box-light', 'select-box-detail']"
            variant="compact"
            :hide-details="true"
            density="plain"
            @update:modelValue="dateChange"
          ></v-select>
        </div>
      </div>
      <div class="mt-4 mb-10">
        <v-tabs-window v-model="activeTab">
          <v-tabs-window-item key="0" value="0">
            <details-table :key="seletedDuration" :items="detailsTable" :dark-mode="darkMode" class="w-100"/>
          </v-tabs-window-item>
          <v-tabs-window-item key="1" value="1">
            <v-row>
              <v-col cols="8">
                <v-card class="d-flex flex-column " :class="[darkMode ? 'calculator-ui-dark' : 'calculator-ui']">
                  <div class="d-flex justify-space-between">
                    <div :class="[darkMode ? 'calc-heading-dark' : 'calc-heading-light']">
                      <h4>APR CALCULATOR</h4>
                    </div>
                    <div class="d-flex flex-column mr-6">
                      <div class="calc-other-text" :class="[darkMode ? 'calc-other-text-dark' : 'calc-other-text-light']">Current Price:</div>
                      <div class="highlight">{{ displayPrice }} {{ invertedPrices ? poolDetailsPeriods[0].BaseToken  : 
                                        poolDetailsPeriods[0].QuoteToken  }}</div>
                    </div>
                    <div class="action mr-6">
                      <v-btn
                        class="text-none"
                        :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                        min-width="92"    
                        variant="outlined"
                        rounded
                        @click="handleInvertPrices"
                      >
                      <span class="mt-2 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" v-if="!darkMode">
                          <path d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" v-else>
                          <path d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334" stroke="#FCFCFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                        Invert Price
                      </v-btn>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div class="d-flex flex-column flex-gap">
                      <div class="d-flex flex-column mr-6">
                        <label class="calculator-label" :class="[darkMode ? 'label-dark' : 'label-light']">Liquidity</label>
                        <v-text-field
                          v-model="liquidityValue"
                          class="text-field-width"
                          :class="[darkMode ? 'text-field-dark' : 'text-field-light']"
                          type="input"
                          :hide-details="true"
                          density="compact"
                          variant="plain"
                        >
                          <template v-slot:append-inner>
                            USD
                          </template>
                        </v-text-field>
                      </div>
                      <div class="d-flex flex-column mr-2">
                        <div class="calc-other-text">Capital Preservation Indicator</div>
                        <v-chip :class="[darkMode ? 'chip-gmvalue-dark' : 'chip-gmvalue']" variant="flat">{{ myGMValue }}</v-chip>
                      </div>
                    </div>
                    <div class="d-flex flex-column flex-gap">
                      <div class="d-flex flex-column mr-6">
                        <div class="label-height">
                          <label class="calculator-label">Min Value: </label>
                          <span class="highlight ml-1">{{ lowerPercentageRange.toFixed(2) + '%' }}</span>
                        </div>
                        <v-text-field
                          v-model="myMinRange"
                          class="text-field-width"
                          :class="[darkMode ? 'text-field-dark' : 'text-field-light']"
                          type="input"
                          variant="plain"
                          density="compact"
                          :hide-details="true"
                          prepend-inner-icon="mdi-minus"
                          append-inner-icon="mdi-plus"
                          @click:prepend-inner="handlePrependInner('min')"
                          @click:append-inner="handleAppendInner('min')"
                        ></v-text-field>
                      </div>
                      <div class="d-flex flex-column mr-4 ml-1 flex-grow-1">
                        <div class="calc-other-text">Composition</div>
                        <div class="d-flex">
                          <span :class="[darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{ poolDetailsPeriods[0].BaseToken }}: </span>
                          <span class="highlight ml-1">   {{ xPercentage.toFixed(2) }} %</span>
                        </div>
                        <div class="composition-token">{{ xTokens }} tokens</div>
                      </div>
                    </div>
                    <div class="d-flex flex-column flex-gap">
                      <div class="d-flex flex-column mr-6">
                        <div class="label-height">
                          <label class="calculator-label">Max Value: </label>
                          <span class="highlight ml-1">{{ higherPercentageRange.toFixed(2) + '%' }}</span>
                        </div>
                        <v-text-field
                          v-model="myMaxRange"
                          class="text-field-width"
                          :class="[darkMode ? 'text-field-dark' : 'text-field-light']"
                          type="input"
                          :hide-details="true"
                          density="compact"
                          variant="plain"
                          prepend-inner-icon="mdi-minus"
                          append-inner-icon="mdi-plus"
                          @click:prepend-inner="handlePrependInner('max')"
                          @click:append-inner="handleAppendInner('max')"
                        >
                        </v-text-field>
                      </div>
                      <div class="d-flex flex-column mr-10 mt-6">
                        <div>
                          <span :class="[darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{ poolDetailsPeriods[0].QuoteToken }}</span>: 
                          <span class="highlight">
                            {{ yPercentage.toFixed(2) }} %
                          </span></div>
                        <div class="y-tokens">{{ yTokens }} tokens</div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mb-5 mr-10 align-center">
                    <div class="d-flex">
                      <v-btn
                        class="text-none mr-4"
                        :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                        min-width="92"
                        variant="outlined"
                        rounded
                        @click="initializeRanges('','aggressive')"
                      >
                        Narrow Range
                      </v-btn>

                      <v-btn
                        class="text-none"
                        :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                        min-width="92"
                        variant="outlined"
                        rounded
                        @click="initializeRanges('','conservative')"
                      >
                        Wide range
                      </v-btn>
                    </div>
                    <div class="d-flex">
                      <v-btn
                        class="text-none ml-4 run-text"
                        color="medium-emphasis"
                        min-width="92"
                        colour="#FF0000"
                        rounded
                        @click="backTester"
                      >
                        Run Back Test
                        <v-icon class="ml-2 gap-cls">mdi-arrow-right</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="result-ui custom-card-class d-flex flex-column" :class="[darkMode ? 'result-ui-dark' : 'result-ui-light']">
                  <div class="text-left result-text" :class="[darkMode ? 'result-text-dark' : 'result-text-light']">Back Test Results</div>
                  <div class="d-flex flex-column">
                    <v-card class="pa-5 mb-4 " elevation="0" :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                      <div class="d-flex justify-space-between align-center">
                        <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">{{ formatMoney(estimatedFees) }}</div>
                        <div class="result-text-right">Generated Fees (est)</div>
                      </div>
                    </v-card>
                    <v-card class="pa-5 mb-4" elevation="0"  :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                      <div class="d-flex justify-space-between align-center">
                        <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">{{ inRangePercentaje.toFixed(2) + ' %' }}</div>
                        <div class="result-text-right">Time In Range (%)</div>
                      </div>
                    </v-card>
                    <v-card class="pa-5 mb-2" elevation="0" :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                      <div class="d-flex justify-space-between align-center">
                        <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">{{ estimatedAPR.toFixed(2) + ' %' }}</div>
                        <div class="result-text-right">Estimated APR (%)</div>
                      </div>
                    </v-card>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-container>
  </template>
  <script setup>
  import { useTheme } from 'vuetify';
  import BarChart from '@/components/BarChart.vue';
  import LineChart from '@/components/LineChart.vue';
  import DetailsTable from '@/components/DetailsTable.vue';
  import { ref, onMounted, computed, watch, toRefs } from 'vue';
  import { useRoute } from 'vue-router';
  import apiClient from '@/utils/axios';
  import { getMean, getStandardDeviation, formatNumber } from '@/utils/common';
  import { formatMoney } from '@/utils/formatMoney.js';
  import { useDateFormat } from '@/utils/composables/useDateFormat';
  import { DATA_PERIOD, MONTH_NAMES } from '@/constant/index.js';
  import millify from "millify";

  const theme = useTheme();
  const activeTab = ref(0)
  const liquidityValue = ref(1000);
  const seletedDuration = ref('7');
  const dataPeriod = DATA_PERIOD;
  const tabs = [{
      title : 'All Transactions',
      value: '0'
  }, {
      title: 'APR Calculator',
      value: '1'
  }];
  // Access the current route
  const route = useRoute()
  // Extract the ID parameter from the route
  const id = route.params.id
  
  /** Reactive Properties */
  const poolDetailsPeriods = ref([]);
  const poolDetailsPrice = ref([]);
  const poolDetailsDefination = ref([]);
  const weeklyAvgAPR = ref(0);
  const weeklyVolume = ref(0);
  const weeklyFees = ref(0);
  const weeklyAvgLiquidity = ref(0);
  const absoluteVolatility = ref(0);
  const weeklyVolatility = ref(0);

  const myMeanPrice = ref(0);
  const mySigma = ref(0);

  const myMinRange = ref(0);
  const myMaxRange = ref(0);
  const tikFactor =  ref(1.0001);
  const invertedPrices = ref(false);

  const xPercentage = ref(0);
  const yPercentage = ref(0);
  const xTokens = ref(0);
  const yTokens = ref(0);
  
  const myFeeTier = ref(0);
  const myFeeDelta = ref(0);

  const loading = ref(false);

  const inRangePercentaje = ref(0);
  const estimatedFees = ref(0);
  const estimatedAPR = ref(0);

  const { formatDateTime } = useDateFormat();
  
  const correlation1 = 0;
  /** Methods */
  const setValues = () => {
      let minPrice=0;
      let maxPrice=0;
      let counter=0;
      let nativePriceArray=[];
      let standardDev=0;
      let meanValue=0;
      weeklyAvgLiquidity.value = 0;
      weeklyAvgAPR.value = 0;
      weeklyVolume.value = 0;
      weeklyFees.value = 0;
      filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
          if (counter === 0) {
              minPrice = element.priceNative;
              maxPrice = element.priceNative;
          }
          else {
              if (element.priceNative < minPrice) {
                  minPrice = element.priceNative;
              }
              if (element.priceNative > maxPrice) {
                  maxPrice = element.priceNative;
              }
          }
          
          weeklyAvgLiquidity.value += element.Liquidity;
          weeklyVolume.value += element.Volume/3;
          weeklyFees.value += element.fees;
          if (typeof(element.priceNative) !== "undefined" ) {
              nativePriceArray.push(Number.parseFloat(element.priceNative));
          }
          counter++;
      });
      myFeeTier.value = poolDetailsPeriods.value[0].feeTier;
      
      if(myFeeTier.value !== 0) {
          myFeeDelta.value = myFeeTier.value*2/100;
      } else {
          myFeeDelta.value = 200;
      }
      weeklyAvgAPR.value = (weeklyVolume.value * poolDetailsPeriods.value[0].feeTier * 365) / (10000 * weeklyAvgLiquidity.value);
      weeklyAvgLiquidity.value /= counter;
      absoluteVolatility.value = (100 *  maxPrice / minPrice) - 100;
      mySigma.value = standardDev = getStandardDeviation(nativePriceArray);
      myMeanPrice.value = meanValue = getMean(nativePriceArray);
      weeklyVolatility.value = meanValue !== 0 ? ( (standardDev * 100) / meanValue) : "N/A";
      initializeRanges(1, 'aggressive');
      correlationEstimator.value = correlationEstimator1(poolDetailsPeriods.value, seletedDuration.value);
      console.log(correlationEstimator.value);
  };
  const correlationEstimator = async(data,days ) => {
    // Check if the input data is valid
    if (!Array.isArray(data) || data.length === 0 || days <= 0) {
        throw new Error("Invalid data or number of days");
    }

    // Calculate the total number of samples based on days and samples per day
    const numSamples = days * 3; // 3 samples per day

    // Extract values for Token1 and Token2
    const token1Values = [];
    const token2Values = [];

    for (let i = 0; i < Math.min(data.length, numSamples); i++) {
        const sample = data[i];
        token1Values.push(Number(sample.priceUsd)); // Assuming token1USD is the USD value for Token1
        token2Values.push(Number(sample.priceUsd/sample.priceNative)); // Assuming token1InToken2 is the price of Token1 in terms of Token2
    }

    // Calculate means
    const meanToken1 = token1Values.reduce((sum, value) => sum + value, 0) / token1Values.length;
    const meanToken2 = token2Values.reduce((sum, value) => sum + value, 0) / token2Values.length;

    // Calculate the numerator and denominator for the correlation coefficient
    let numerator = 0;
    let denominatorToken1 = 0;
    let denominatorToken2 = 0;

    for (let i = 0; i < token1Values.length; i++) {
        const diffToken1 = token1Values[i] - meanToken1;
        const diffToken2 = token2Values[i] - meanToken2;

        numerator += diffToken1 * diffToken2;
        denominatorToken1 += diffToken1 ** 2;
        denominatorToken2 += diffToken2 ** 2;
    }


    // Edge case for two stable tokens
    if (denominatorToken1 === 0 || denominatorToken2 === 0 || numerator === 0) {
        return 1;
    }

    // Calculate the correlation coefficient
    const correlation = numerator / Math.sqrt(denominatorToken1 * denominatorToken2);
    return correlation;
  };
  const correlationEstimator1 = (data,days ) => {
    // Check if the input data is valid
    if (!Array.isArray(data) || data.length === 0 || days <= 0) {
        throw new Error("Invalid data or number of days");
    }

    // Calculate the total number of samples based on days and samples per day
    const numSamples = days * 3; // 3 samples per day

    // Extract values for Token1 and Token2
    const token1Values = [];
    const token2Values = [];

    for (let i = 0; i < Math.min(data.length, numSamples); i++) {
        const sample = data[i];
        token1Values.push(Number(sample.priceUsd)); // Assuming token1USD is the USD value for Token1
        token2Values.push(Number(sample.priceUsd/sample.priceNative)); // Assuming token1InToken2 is the price of Token1 in terms of Token2
    }

    // Calculate means
    const meanToken1 = token1Values.reduce((sum, value) => sum + value, 0) / token1Values.length;
    const meanToken2 = token2Values.reduce((sum, value) => sum + value, 0) / token2Values.length;

    // Calculate the numerator and denominator for the correlation coefficient
    let numerator = 0;
    let denominatorToken1 = 0;
    let denominatorToken2 = 0;

    for (let i = 0; i < token1Values.length; i++) {
        const diffToken1 = token1Values[i] - meanToken1;
        const diffToken2 = token2Values[i] - meanToken2;

        numerator += diffToken1 * diffToken2;
        denominatorToken1 += diffToken1 ** 2;
        denominatorToken2 += diffToken2 ** 2;
    }


    // Edge case for two stable tokens
    if (denominatorToken1 === 0 || denominatorToken2 === 0 || numerator === 0) {
        return 1;
    }

    // Calculate the correlation coefficient
    const correlation = numerator / Math.sqrt(denominatorToken1 * denominatorToken2);
    return correlation;
  };
  const fetchData = async () => {
    loading.value = true;
    try {
      const { data } = await apiClient.get(`api/message/${id}`);
      poolDetailsPeriods.value = data.output.periodData;
      poolDetailsPrice.value = data.output.price;
      correlationEstimator.value = await correlationEstimator(poolDetailsPeriods.value, seletedDuration.value);
      setValues();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      loading.value = false;
    }
  };

  const initializeRanges = (volMultiplier, mode) => {
    if (mode==='aggressive') {
        myMinRange.value = formatNumber(Number.parseFloat(poolDetailsPrice.value.priceNative)-Number.parseFloat(mySigma.value)*1.5);
        myMaxRange.value = formatNumber(Number.parseFloat(poolDetailsPrice.value.priceNative)+Number.parseFloat(mySigma.value)*1.5);
        // console.log(`sigma: ${mySigma.value} - min: ${myMinRange.value} - max: ${myMaxRange.value} - current: ${poolDetailsPrice.value.priceNative}`);
    } else {
        if (poolDetailsPrice.value.priceNative >= myMeanPrice.value) {
            myMinRange.value = formatNumber(Number.parseFloat(myMeanPrice.value) - Number.parseFloat(mySigma.value)*1.5);
            myMaxRange.value = formatNumber(Number.parseFloat(poolDetailsPrice.value.priceNative )+Number.parseFloat(mySigma.value)*2.5);
            // console.log(`sigma: ${mySigma.value} - min: ${myMinRange.value} - max: ${myMaxRange.value} - current: ${poolDetailsPrice.value.priceNative}`);
        }
        else {
            myMinRange.value = formatNumber(Number.parseFloat(poolDetailsPrice.value.priceNative)-Number.parseFloat(mySigma.value)*2.5);
            myMaxRange.value = formatNumber(Number.parseFloat(myMeanPrice.value)+Number.parseFloat(mySigma.value)*1.5);
            // console.log(`sigma: ${mySigma.value} - min: ${myMinRange.value} - max: ${myMaxRange.value} - current: ${poolDetailsPrice.value.priceNative}`);
        }
    }

    if (invertedPrices.value) {
        myMinRange.value = 1 / myMaxRange.value;
        myMaxRange.value = 1 / myMinRange.value;
    }


    findClosestTik('min');
    findClosestTik('max');
    calculateTokensRatio();
  }

  const findClosestTik = (which) => {
    let price=0;
    if (which==='min') {
        price = myMinRange.value;
    } else {
        price = myMaxRange.value;
    }

    let pe = ((Math.log(price) / Math.log(tikFactor.value)) / myFeeDelta.value);
    let closestTik = Math.round(pe);
    if (which === 'min') {
        myMinRange.value = formatNumber(setPriceFromtik(closestTik));
    } else {
      console.log('setPriceFromtik(closestTik) myMaxRange', setPriceFromtik(closestTik));

        myMaxRange.value = formatNumber(setPriceFromtik(closestTik));
    }

    return closestTik;
  }

  const setPriceFromtik = (tikNumber) => {
    let price=0;
    price = Math.pow(tikFactor.value, myFeeDelta.value * tikNumber);
    return price;
  }

  const calculateTokensRatio = () => {
    let x=1;
    let Lx = x *  (Math.sqrt(poolDetailsPrice.value.priceNative)* Math.sqrt(myMaxRange.value))/
                (Math.sqrt(myMaxRange.value) - Math.sqrt(poolDetailsPrice.value.priceNative) );
    // console.log('Lx', Lx);
              
    let y = Lx * (Math.sqrt(poolDetailsPrice.value.priceNative) - Math.sqrt(myMinRange.value));
    // console.log('y', y);

    xPercentage.value = 100 * Number.parseFloat(poolDetailsPrice.value.priceNative) / (Number.parseFloat(poolDetailsPrice.value.priceNative) + Number.parseFloat(y));

    yPercentage.value = 100 * Number.parseFloat(y) / (Number.parseFloat(poolDetailsPrice.value.priceNative) + Number.parseFloat(y));

    console.log('yPercentage', yPercentage.value);

    console.log('yPercentage', yPercentage.value);

    if (invertedPrices.value) {
        let aux1 = Number.parseFloat(xPercentage.value);
        let aux2 = Number.parseFloat(yPercentage.value);
        xPercentage.value = Number.parseFloat(aux2);
        yPercentage.value = Number.parseFloat(aux1);
    }
    let MaxX = Number.parseFloat(liquidityValue.value) / Number.parseFloat(poolDetailsPrice.value.priceUsd);
    let MaxY = Number.parseFloat(MaxX) * Number.parseFloat(poolDetailsPrice.value.priceNative);

    // console.log('MaxX', MaxX);

    let ActualX = Number.parseFloat(MaxX) * Number.parseFloat(xPercentage.value) / 100.0;
    let ActualY = Number.parseFloat(MaxY) * Number.parseFloat(yPercentage.value) / 100.0;

    xTokens.value = formatNumber(Number.parseFloat(ActualX));
    yTokens.value = formatNumber(Number.parseFloat(ActualY));
  }

  const handleTabClick = (value) => {
    if(value == 1) {
      initializeRanges('', 'aggressive');
    }
  }

  const handleInvertPrices = () => {
    invertedPrices.value = !invertedPrices.value;
    let aux1 = myMinRange.value;
    let aux2 = myMaxRange.value;
    myMaxRange.value = formatNumber(1/aux1);
    myMinRange.value = formatNumber(1/aux2);
    poolDetailsPrice.value.priceNative = 1 / poolDetailsPrice.value.priceNative;
    calculateTokensRatio();
  }

  const handleAppendInner = (type) => {
    shiftTik(type,1);
  }

  const handlePrependInner = (type) => {
    shiftTik(type,-1);
  }

  const shiftTik = (which, step) => {
    let currentTik=0;
    currentTik = findClosestTik(which);
    currentTik += step;
    if (which==='min') {
       myMinRange.value = formatNumber(setPriceFromtik(currentTik));
    }
    else {
        myMaxRange.value = formatNumber(setPriceFromtik(currentTik));
    }
    calculateTokensRatio();
  }

  const backTester = () => {
    let totalPeriods = 0;
    let inRangePeriods = 0;
    let totalFees = 0;
    let periodFee = 0;
    let actualMinRange = myMinRange.value;
    let actualMaxRange = myMaxRange.value;

    if (invertedPrices.value) {
        actualMinRange = 1 / myMaxRange.value;
        actualMaxRange = 1 / myMinRange.value;
    }
    let stdDevs = Number.parseFloat(actualMaxRange-actualMinRange) / Number.parseFloat(mySigma.value);
    let FeesWeight = 1;
    if (stdDevs <= 2) {
        FeesWeight = 1;
    } else if(stdDevs > 2 && stdDevs <= 3) {
        const x1 = 2;
        const y1 = 1;
        const x2 = 3;
        const y2 = 0.81;
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        const x = 2;
        const y = m * x + b;
        FeesWeight = m * stdDevs + b;
    } else if(stdDevs >3 && stdDevs <=4) {
        const x1 = 3;
        const y1 = 0.81;
        const x2 = 4;
        const y2 = 0.68;
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        const x = 2;
        const y = m * x + b;
        FeesWeight = m * stdDevs + b;
    } else if(stdDevs >4 && stdDevs <=6) {
        const x1 = 4;
        const y1 = 0.68;
        const x2 = 6;
        const y2 = 0.5;
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        const x = 2;
        const y = m * x + b;
        FeesWeight = m * stdDevs + b;
    } else if (stdDevs >6 && stdDevs <=20) {
        const x1 = 6;
        const y1 = 0.5;
        const x2 = 20;
        const y2 = 0.1;
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        const x = 2;
        const y = m * x + b;        
        FeesWeight = m * stdDevs + b;
    } else {
        const x1 = 20;
        const y1 = 0.1;
        const x2 = 100;
        const y2 = 0.05;
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
        const x = 2;
        const y = m * x + b;      
        FeesWeight = m * stdDevs + b;
    }
    const period = 7;
    const averages = [];
    for (let i = period - 1; i < filteredPoolDetailsBasedOnPeriod.value.length; i++) {
        const volumes = filteredPoolDetailsBasedOnPeriod.value.slice(i - period + 1, i + 1).map(element => element.Volume / 3);
        const sum = volumes.reduce((acc, volume) => acc + volume, 0);
        const average = sum / period;
        averages.push(average);
    }
    filteredPoolDetailsBasedOnPeriod.value.forEach(element => {
        totalPeriods++;

        if (Number.parseFloat(element.priceNative) >= Number.parseFloat(actualMinRange) &&
                            Number.parseFloat(element.priceNative) <= Number.parseFloat(actualMaxRange)) {
            inRangePeriods++;
            periodFee = liquidityValue.value * Number.parseFloat(FeesWeight) * (element.Volume/3)*
            (poolDetailsPeriods.value[0].feeTier / 1000000)*(1/(element.Liquidity));
        } else {
            periodFee = 0;
        }
        totalFees += periodFee;
    });
    inRangePercentaje.value = inRangePeriods*100 / totalPeriods;
    estimatedFees.value = totalFees;
    estimatedAPR.value = estimatedFees.value * 100 * (365/(totalPeriods/3))*(1/liquidityValue.value);
  }

  
  /** Computed */

    const filteredPoolDetailsBasedOnPeriod = computed(() => {
        const filterRecords = [...poolDetailsPeriods.value];
        return filterRecords.slice(0, parseInt(seletedDuration.value) * 3);
    })

    const darkMode = computed(() => {
      return theme.global.current.value.dark;
    });
  
    const detailsTable = computed(() => {
      
        return filteredPoolDetailsBasedOnPeriod.value.map((poolDetailItem) => {
            return {
                date : formatDateTime(poolDetailItem.dateTime),
                apr : poolDetailItem.apr.toFixed(2) != null ? parseFloat(poolDetailItem.apr).toFixed(2) : 0.00,
                liquidity : formatMoney(poolDetailItem.Liquidity),
                volume: formatMoney(poolDetailItem.Volume),
                fees: formatMoney(poolDetailItem.fees),
                vol_tvl: poolDetailItem.Liquidity !=0 ? ( (poolDetailItem.Volume/poolDetailItem.Liquidity).toFixed(2)) : 0.00,
            }
        });
    });

    const dailyPriceUsdChart = computed(() => {
        let chartLabels = [];
        let chartDataPricesUSD = [];
        let ix = 0;
        filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
            ix++;
            if (ix % 3 == 0) {
                if (element.priceUsd !=undefined) {
                    const day = element.dateTime.slice(6, 8);
                    const month = element.dateTime.slice(4, 6);
                    chartLabels.push(`${day} ${MONTH_NAMES[month]}`);
                    chartDataPricesUSD.push(Number(element.priceUsd));
                }
            }
        });
        return {
            chartLabels: chartLabels.reverse(),
            chartDataPricesUSD: chartDataPricesUSD.reverse(),
        }
    });

    const dailyPriceBaseQuote = computed(() => {
        let chartLabels = [];
        let chartDataQuotePrices = [];
        let ix = 0;
        filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
            ix++;
            if (ix % 3 ==0) {
                if (element.priceUsd !=undefined) {
                    const day = element.dateTime.slice(6, 8);
                    const month = element.dateTime.slice(4, 6);
                    chartLabels.push(`${day} ${MONTH_NAMES[month]}`);
                    chartDataQuotePrices.push(Number(element.priceNative));
                }
            }
        });
        return {
            chartLabels: chartLabels.reverse(),
            chartDataQuotePrices: chartDataQuotePrices.reverse(),
        }
    });

    const dailyPriceQuoteBase = computed(() => {
        let chartLabels = [];
        let chartDataRelativePrices=[];
        let ix = 0;
        filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
            ix++;
            if (ix % 3 ==0) {
                if (element.priceUsd !=undefined) {
                    const day = element.dateTime.slice(6, 8);
                    const month = element.dateTime.slice(4, 6);
                    chartLabels.push(`${day} ${MONTH_NAMES[month]}`);
                    chartDataRelativePrices.push(parseFloat(1/element.priceNative).toFixed(6));
                }
            }
        });
        return {
            chartLabels: chartLabels.reverse(),
            chartDataRelativePrices: chartDataRelativePrices.reverse(),
        }
    });

    const dailyAprData = computed(() => {
        let chartLabels = [];
        let chartDataAPR=[];
        let ix = 0;
        filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
            ix++;
            if (ix % 3 ==0) {
                if (element.priceUsd !=undefined) {
                    const day = element.dateTime.slice(6, 8);
                    const month = element.dateTime.slice(4, 6);
                    chartLabels.push(`${day} ${MONTH_NAMES[month]}`);
                    chartDataAPR.push(parseFloat(element.apr).toFixed(2));
                }
            }
        });
        return {
            chartLabels: chartLabels.reverse(),
            chartDataAPR: chartDataAPR.reverse(),
        }
    });

    const dailyVolumeBarData = computed(() => {
        let chartLabels = [];
        let chartDataLiquidity=[];
        let chartDataVolume=[];

        let ix = 0;
        filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
            ix++;
            if (ix % 3 ==0) {
                if (element.priceUsd !=undefined) {
                    const day = element.dateTime.slice(6, 8);
                    const month = element.dateTime.slice(4, 6);
                    chartLabels.push(`${day} ${MONTH_NAMES[month]}`);
                    chartDataLiquidity.push(element.Liquidity);
                    chartDataVolume.push(element.Volume);

                }
            }
        });
        return {
            chartLabels: chartLabels.reverse(),
            chartDataLiquidity: chartDataLiquidity.reverse(),
            chartDataVolume: chartDataVolume.reverse(),
        }
    });

    const displayPrice = computed(() => {
        if(invertedPrices.value) {
          return Number.parseFloat(poolDetailsPrice.value.priceNative).toFixed(4);
        } else {
          return formatNumber(Number.parseFloat(poolDetailsPrice.value.priceNative));
        }
    });

    const lowerPercentageRange = computed(() => {
      if (invertedPrices.value) {
        const actualMinRange = 1/myMaxRange.value;
        const actualMaxRange = 1/myMinRange.value;
        myMinRange.value = 1/actualMaxRange;
        myMaxRange.value = 1/actualMinRange;
      }
      return -1*(100-myMinRange.value*100/poolDetailsPrice.value.priceNative);
    });

    const higherPercentageRange = computed(() => {
      return -1*(100-myMaxRange.value*100/poolDetailsPrice.value.priceNative);
    });

    const myGMValue = computed(() => {
      let gmValue = Math.sqrt(myMinRange.value * myMaxRange.value);
      return formatNumber(gmValue);
    });


    watch(seletedDuration, () => {
      setValues();
    });
    const chainIcon = (value) => {
    return `/assets/images/chains/${value}.png`;
  }

  const protocolIcon = (value) => {
    return `/assets/images/protocols/${value}.png`;
  }
  /** Mounted */
  onMounted(fetchData);
  </script>
  <style scoped>
  .select-box-light {
    width: 150px !important;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    border: 1px solid var(--Gray-200, #EAECF0);
    background: var(--Base-White, #FFF);
    /* Shadows/shadow-xs */
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  }

  .select-box-dark {
    width: 150px !important;
    background: #262A3F !important;
    border: 1px solid var(--Gray-700, #344054);
    color: #FFF;
    /* Shadows/shadow-xs */
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  }

  .width-full {
    width: 100% !important;
  }

  .text-field-width {
    width: 210px !important;
    border-radius: 10px;
  }

  .text-field-dark {
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: #0F0F1B;
  }

  .text-field-light {
    border: 1px solid var(--Gray-200, #EAECF0);
    background: var(--Gray-25, #FCFCFD);
  }

  .token-detail {
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: #FFF;
    /* Shadows/shadow-sm */
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  }

  .dark-token-details {
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(21px);
  }

  .gap-width {
    gap: 24px;
  }

  .calculator-ui {
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: #FFF;
    padding: 31px 26px 11px;
    gap: 30px;
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  }

  .calculator-ui-dark {
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(21px);
    padding: 31px 26px 11px;
    gap: 30px;
  }

  .result-ui {
    border-radius: 16px;
    padding: 30px;
    gap:38px;
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  }

  .result-ui-dark {
    border: 1px solid rgba(255, 255, 255, 0.17);
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(21px);
  }

  .result-ui-light {
    background: #FFF;
    border: 1px solid rgba(255, 255, 255, 0.17);
  }

  .card-space {
    margin-right: 20px; /* Adjust the value as needed */
    padding-right:10px;
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    border-radius: 16px;
    /* height: 280px; */
    height: auto;
    width: 33%;
  }

  .bar-line-chart {
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.17);
    width: 49%;
  }

  .card-space:last-child {
    margin-right: 0;
  }

.line-chart .series-name {
  position: relative;
  left: -10px; /* Adjust the value as needed */
  font-weight: bold;
  margin-bottom: 10px; /* Add some space below the series name */
}
.text-color {
  color: #bfac62;
}

.main-text {
  display: flex;
  align-items: baseline;
}

.label {
  font-weight: bold;
  color: #3d3939;
}

.highlight {
  color: #BFAC62;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
}

.subtext {
  color: #888888;
  font-size: 14px;
}

.run-text {
  background: #BFAB62;
  padding: 16px 30px;
  height: 65px;
  border-radius: 70px;
  font-weight: 700;
  color:#182230 !important;
  font-size: 16px;
  font-family: Poppins;
  letter-spacing: 0px;
}

.router-link {
  text-decoration: none;
  color: rgb(var(--v-theme-primaryColor));
}

.round-button-light {
  border-radius: 53.078px;
  border: 0.856px solid #BFAC62;
  background: linear-gradient(90deg, rgba(215, 193, 128, 0.20) 0%, rgba(230, 205, 131, 0.20) 18.51%, rgba(241, 214, 133, 0.20) 32.51%, rgba(255, 225, 136, 0.20) 50%, rgba(215, 193, 128, 0.20) 85.01%);
  color: var(--Gray-700, #344054);
  text-align: center;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.round-button-dark {
  border-radius: 53.078px;
  border: 0.856px solid #CFB871;
  background: linear-gradient(90deg, rgba(215, 193, 128, 0.20) 0%, rgba(230, 205, 131, 0.20) 18.51%, rgba(241, 214, 133, 0.20) 32.51%, rgba(255, 225, 136, 0.20) 50%, rgba(215, 193, 128, 0.20) 85.01%);
  color: var(--Gray-25, #FCFCFD);
  text-align: center;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.result-card-light {
  border-radius: 8px;
  border: 1px solid rgba(178, 178, 178, 0.20);
  background: var(--Gray-25, #FCFCFD);
}

.result-card-dark {
  border-radius: 8px;
  border: 1px solid rgba(178, 178, 178, 0.20);
  background: #1B1F32;
}

.result-text {
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; 
}

.result-text-dark {
  color: #FCFCFD;
}

.result-text-light {
  color: #182230;
}

.result-text-right {
  color: #BFAC62;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
}

.custom-card-dark-class {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(21px);
}



.label-color {
  color: rgb(var(--v-theme-labelColor));
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  font-family: Poppins;
}

.label-font {
  font-weight: 600;
  font-family: Poppins;
}

.tab-background-light {
  border-radius: 8px;
  background: #fdfdfd4d;;
}

.tab-background-light .active-tab {
  border-radius: 8px !important;
  border: 1px solid var(--Gray-200, #EAECF0);
  background: rgb(15, 35, 87);
  color:#FFF;
  /* Shadows/shadow-sm */
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
}

.tab-background-dark {
  border-radius: 8px;
  background: #1F243A;
  color:#FFF;
}

.tab-background-dark .active-tab {
  border-radius: 8px !important;
  border: 1px solid var(--Gray-700, #344054);
  background: #FCFCFD;
  color: black;
  box-shadow: 0px 4px 4px 0px rgba(15, 15, 15, 0.25);
}

.calc-heading {
  color: #182230;
  font-size: 20px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
}

.calc-heading-dark {
  color: var(--Gray-25, #FCFCFD);
  font-family: Poppins;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
}

.calc-other-text {
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
  height: 29px;
}

.calc-other-text-dark {
  color: #EAECF0;
}

.calc-other-text-light {
  color: #475467;
}

::v-deep .v-field__append-inner {
  cursor: pointer;
}
::v-deep .v-field__prepend-inner {
  cursor: pointer;
}

.chip-gmvalue {
  width:210px !important;
  color: #475467;
  background: #FCFCFD !important;
  border: 1px solid rgba(178, 178, 178, 0.20);
  /* Text sm/Medium */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
}

.chip-gmvalue-dark {
  width:210px !important;
  color: #F9FAFB;
  border: 1px solid rgba(178, 178, 178, 0.20);
  background: #1B1F32;
  /* Text sm/Medium */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
}
.calc-token {
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
}
.calc-token-dark {
  color: #D0D5DD;
}
.calc-token-light {
  color: var(--Gray-600, #475467);
}
.composition-token {
  color: #98A2B3;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
}

.y-tokens {
  color: #98A2B3;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
}
.result-number {
  font-family: Poppins;
  font-size: 25px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
}
.result-number-dark {
  color: #EAECF0;
}

.result-number-light {
  color: #344054;
}



::v-deep .mdi-minus {
  color:#667085 !important;
}

::v-deep .mdi-plus {
  color:#667085 !important;
}

.text-field-width :deep(.v-field--no-label) {
  padding-left: 11px;
  padding-right: 11px;
  padding-bottom: 6px;
}
.text-field-width ::v-deep .v-field__append-inner {
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.text-field-dark :deep(.v-field__append-inner) {
  color: #667085
}
.text-field-light :deep(.v-field__append-inner) {
  color: #667085;
}
.calculator-label {
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
  height: 29px;
}

.label-dark {
  color: #EAECF0;
}

.label-light {
  color: #475467;
}

.gap-cls {
  gap: 28px !important;
}

.select-box-detail {
    padding: 10px 0px;
    height: 45px;
    border-radius: 8px;
    /* width:100px !important; */
  }
  .anchor-link {
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-family: Poppins;
  }
  .anchor-link-light {
    color: #1F243A;
    text-decoration: none;
    font-weight: 600;
    font-family: Poppins;
  }
  .flex-gap {
    gap:40px;
  }
  .label-height {
    height: 29px !important;
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
  