<template>
  <v-container class="mt-10">
    <div class="d-flex justify-space-between">
      <div>
        <v-icon color="#FFF" v-if="darkMode">mdi-arrow-left</v-icon>
        <v-icon v-if="!darkMode">mdi-arrow-left</v-icon>
        <router-link to="/" class="router-link">Back to all pools</router-link>
      </div>
      <div>
        <v-select v-model="seletedDuration" :items="dataPeriod" item-title="label" item-value="value"
          :class="[darkMode ? 'select-box-dark' : 'select-box-light', 'select-box-detail']" :hide-details="true"
          variant="compact" density="plain" />
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
            <div class="label-color">Fee Tier(%)</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length ? (poolDetailsPeriods[0].feeTier / 10000) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Chain</div>
            <div class="text-capitalize label-font text-h5 text-textItemColor">
              <span class="text-customText">
                <img v-if="poolDetailsPeriods.length > 0 && poolDetailsPeriods[0].ChainId"
                  :src="chainIcon(poolDetailsPeriods[0].ChainId)" alt="Quote Token Icon" class="token-icon">
                {{ poolDetailsPeriods.length > 0 ? poolDetailsPeriods[0].ChainId : '' }}
              </span>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Protocol</div>
            <div class="text-capitalize label-font text-h5 text-textItemColor">
              <span class="text-customText">
                <!-- Check if the array length is greater than 0 and if the image exists -->
                <img v-if="poolDetailsPeriods.length > 0 && poolDetailsPeriods[0].baseTokenIcon"
                  :src="protocolIcon(poolDetailsPeriods[0].DexId)" alt="Quote Token Icon" class="token-icon">
                <!-- Display DexId if the array length is greater than 0 -->
                {{ poolDetailsPeriods.length > 0 ? poolDetailsPeriods[0].DexId : '' }}
              </span>
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
              {{ poolDetailsPeriods.length ? poolDetailsPeriods[0].priceNative : '' }}
            </div>
          </div>
        </div>
        <v-skeleton-loader v-if="loading" :loading="true" class="my-4 mx-4" width="97%" height="100px" />
      </v-card>
    </div>
    <div class="d-flex mt-4">
      <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'card-space']">
        <div class="pt-4 pb-4">
          <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
          <line-chart v-else :dark-mode="darkMode" :key="`${seletedDuration - darkMode}`"
            :labels="dailyPriceUsdChart.chartLabels" :show-exponential-digit="true"
            :series-name="'Daily Price(Base/USD)'" :data-values="dailyPriceUsdChart.chartDataPricesUSD" :map-colors="{
              stroke: darkMode ? '#DCC271' : '#25356F',
              gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
              offset: darkMode ? '#DCC271' : '#2C61B0',
              offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
            }" />
        </div>
      </v-card>
      <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'card-space']">
        <div class="pt-4 pb-4">
          <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
          <line-chart v-else :dark-mode="darkMode" :key="`${seletedDuration - darkMode}`"
            :labels="dailyPriceBaseQuote.chartLabels" :show-exponential-digit="true"
            :series-name="'Daily Price (Base/Quote)'" :data-values="dailyPriceBaseQuote.chartDataQuotePrices"
            :map-colors="{
              stroke: darkMode ? '#DCC271' : '#25356F',
              gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
              offset: darkMode ? '#DCC271' : '#2C61B0',
              offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
            }" />
        </div>
      </v-card>
      <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'card-space']">
        <div class="pt-4 pb-4">
          <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
          <line-chart v-else :dark-mode="darkMode" :key="`${seletedDuration - darkMode}`"
            :series-name="'Daily Price (Quote/Base)'" :show-exponential-digit="true" :map-colors="{
              stroke: darkMode ? '#F4F4F5' : '#BFAC62',
              gradientToColors: darkMode ? '#F4F4F5' : '#BFAC62',
              offset: darkMode ? '#F4F4F5' : '#BFAC62',
              offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(226, 217, 183, 0.46)'
            }" :labels="dailyPriceQuoteBase.chartLabels" :data-values="dailyPriceQuoteBase.chartDataRelativePrices" />
        </div>
      </v-card>
    </div>
    <div class="d-flex mt-6 justify-space-between">
      <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'bar-line-chart']">
        <div class="pt-4 pb-4">
          <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="97%" height="300" />
          <bar-chart v-else :dark-mode="darkMode" :key="`${seletedDuration - darkMode}`"
            :series-name="['Daily Liquidity', 'Daily Volume']" :labels="dailyVolumeBarData.chartLabels"
            :data-values="[dailyVolumeBarData.chartDataLiquidity, dailyVolumeBarData.chartDataVolume]" />
        </div>
      </v-card>
      <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'bar-line-chart']">
        <div class="pt-4 pb-4">
          <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="97%" height="300" />
          <line-chart v-else :dark-mode="darkMode" :chart-width="570" :key="`${seletedDuration - darkMode}`"
            series-name="Daily APR" :labels="dailyAprData.chartLabels" :data-values="dailyAprData.chartDataAPR"
            :map-colors="{
              stroke: darkMode ? '#DCC271' : '#25356F',
              gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
              offset: darkMode ? '#DCC271' : '#2C61B0',
              offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
            }" />
        </div>
      </v-card>
    </div>

    <div class="mt-4">
      <v-card :class="[darkMode ? 'dark-token-details' : 'token-detail']">
        <div class="d-flex justify-space-between pa-6 align-center" v-if="!loading">
          <!-- <div class="d-flex flex-column">
            <div class="label-color">Price Quote</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length ?  poolDetailsPeriods[0].priceNative : '' }}
            </div>
          </div> -->
          <div class="d-flex flex-column">
            <div class="label-color">Avg Liquidity</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyAvgLiquidity) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Period Volume</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyVolume) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Weekly Fees</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyFees) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Avg Volatility</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? (weeklyVolatility !== 0 ? (weeklyVolatility.toFixed(2) + '%') :
                weeklyVolatility) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Abs Volatility</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? (absoluteVolatility !== 0 ? (absoluteVolatility.toFixed(2) + '%') :
                weeklyVolatility) : '' }}
            </div>
          </div>
          <!-- <div class="d-flex flex-column">
            <div class="label-color">Correlation</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? correlationEstimator.value.toFixed(3) : ''  }}
            </div>
          </div> -->
          <div class="d-flex flex-column">
            <div class="label-color">Correlation</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ poolDetailsPeriods.length > 0 ? correlationEstimator.value + '%' : '' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Avg APR% est.</div>
            <div class="label-font text-h5 text-textItemColor">
              {{ (weeklyAvgAPR.toFixed(3) != null) ? weeklyAvgAPR.toFixed(2) + '%' : 0.00 + '%' }}
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="label-color">Dex screener</div>
            <div v-if="poolDetailsPeriods.length > 0">
              <a :class="[darkMode ? 'anchor-link' : 'anchor-link-light']" class=""
                :href="`https://dexscreener.com/${poolDetailsPeriods[0].ChainId}/${poolDetailsPeriods[0].pairAddress}`"
                target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </div>
          </div>
        </div>
        <v-skeleton-loader v-if="loading" :loading="true" class="my-4 mx-4" width="97%" height="100px" />
      </v-card>
    </div>

    <div class="d-flex justify-space-between mt-4 flex-wrap">
      <div>
        <v-tabs v-model="activeTab" :class="[darkMode ? 'tab-background-dark' : 'tab-background-light']"
          selected-class="active-tab">
          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" selected-class=""
            @click="handleTabClick(tab.value)">{{ tab.title }}</v-tab>
        </v-tabs>
      </div>
      <div class="mt-1">
        <v-select v-model="seletedDuration" :items="dataPeriod" item-title="label" item-value="value"
          :class="[darkMode ? 'select-box-dark' : 'select-box-light', 'select-box-detail']" variant="compact"
          :hide-details="true" density="plain" @update:modelValue="dateChange"></v-select>
      </div>
    </div>
    <div class="mt-4 mb-10">
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item key="0" value="0">
          <details-table :key="seletedDuration" :items="detailsTable" :dark-mode="darkMode" class="w-100" />
        </v-tabs-window-item>

        <!-- Kuladeep -->

        <v-tabs-window-item key="1" value="1">
          <v-row>
            <v-col cols="12" lg="6">
              <v-card class="d-flex flex-column "
                :class="[darkMode ? 'calculator-ui-dark sticky-top' : 'calculator-ui sticky-top']">
                <div class="d-flex justify-space-between">
                  <!-- <div :class="[darkMode ? 'calc-heading-dark' : 'calc-heading-light']">
                    <h4>APR CALCULATOR</h4>
                  </div> -->
                  <div class="d-flex flex-column mr-6">
                    <div class="calc-other-text" :class="[darkMode ? 'calc-other-text-dark' : 'calc-other-text-light']">
                      Current Price:</div>
                    <div class="highlight">{{ displayPrice }} {{ invertedPrices ?
                      poolDetailsPeriods[0].BaseToken :
                      poolDetailsPeriods[0].QuoteToken }}</div>
                  </div>

                  <!-- Invert Price -->
                  <div class="action mr-6">
                    <v-btn class="text-none" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                      min-width="92" variant="outlined" rounded @click="handleInvertPrices">
                      <span class="mt-2 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                          v-if="!darkMode">
                          <path
                            d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334"
                            stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                          v-else>
                          <path
                            d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334"
                            stroke="#FCFCFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      Invert Price
                    </v-btn>
                  </div>
                </div>

                <div class="d-flex">
                  <v-row cols="3">
                    <v-col>
                      <div class="d-flex flex-column flex-gap">
                        <div class="d-flex flex-row mr-6">
                          <label class="calculator-label"
                            :class="[darkMode ? 'label-dark' : 'label-light']">Supply</label>
                          <v-text-field v-model="liquidityValue" class="text-field-width"
                            :class="[darkMode ? 'text-field-dark' : 'text-field-light']" type="input"
                            :hide-details="true" density="compact" variant="plain" @change="refreshTokensDistribution">
                            <template v-slot:append-inner>
                              USD
                            </template>
                          </v-text-field>
                          <h4 class="highlight ml-1">{{ poolDetailsPeriods[0].QuoteToken }}</h4>
                        </div>
                      </div>
                    </v-col>
                    <v-col>
                      <div class="d-flex flex-row align-items-center">
                        <div class="result-text-right">Approx:</div>
                        <div class="result-number ml-1"
                          :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                          {{ approximateInitialLiquidityUSD }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>


                <div class="d-flex">
                  <v-row>
                    <!-- Min Value Input -->
                    <v-col cols="12" lg="6">
                      <div class="d-flex flex-column flex-gap" style="flex: 1;">
                        <div class="d-flex flex-column mr-6">
                          <div class="label-height">
                            <label class="calculator-label">Min Value: </label>
                            <span class="highlight ml-1">{{ lowerPercentageRange.toFixed(2) + '%' }}</span>
                          </div>
                          <v-text-field v-model="myMinRange" class="text-field-width"
                            :class="[darkMode ? 'text-field-dark' : 'text-field-light']" type="input" variant="plain"
                            density="default" :hide-details="true" prepend-inner-icon="mdi-minus"
                            append-inner-icon="mdi-plus" @click:prepend-inner="handlePrependInner('min')"
                            @click:append-inner="handleAppendInner('min')"></v-text-field>
                        </div>
                      </div>
                    </v-col>

                    <!-- Max Value Input -->
                    <v-col cols="12" lg="6">
                      <div class="d-flex flex-column flex-gap" style="flex: 1;">
                        <div class="d-flex flex-column">
                          <div class="label-height">
                            <label class="calculator-label">Max Value: </label>
                            <span class="highlight ml-1">{{ higherPercentageRange.toFixed(2) + '%' }}</span>
                          </div>
                          <v-text-field v-model="myMaxRange" class="text-field-width"
                            :class="[darkMode ? 'text-field-dark' : 'text-field-light']" type="input"
                            :hide-details="true" density="default" variant="plain" prepend-inner-icon="mdi-minus"
                            append-inner-icon="mdi-plus" @click:prepend-inner="handlePrependInner('max')"
                            @click:append-inner="handleAppendInner('max')"></v-text-field>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <div class="d-flex flex-column">
                  <v-row>
                    <!-- First Column -->
                    <v-col cols="12" lg="6">
                      <div class="d-flex flex-column mr-2">
                        <div class="calc-other-text">Capital Preservation Indicator</div>
                        <v-chip :class="[darkMode ? 'chip-gmvalue-dark' : 'chip-gmvalue']" variant="flat">{{ myGMValue
                          }}</v-chip>
                      </div>

                      <!-- Narror & Wide Range -->
                      <div class="d-flex flex-wrap justify-content-between mt-4">
                        <div class="d-flex mb-2">
                          <v-btn class="text-none mr-2" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                            min-width="92" variant="outlined" rounded
                            @click="initializeRanges1('current', 'aggressive')">
                            Narrow
                          </v-btn>
                          <v-btn class="text-none" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                            min-width="92" variant="outlined" rounded @click="initializeRanges1('current', 'neutral')">
                            Market
                          </v-btn>
                        </div>
                        <div class="d-flex">
                          <v-btn class="text-none mr-2" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                            min-width="92" variant="outlined" rounded
                            @click="initializeRanges1('current', 'wide-short')">
                            Wide Short
                          </v-btn>
                          <v-btn class="text-none" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                            min-width="92" variant="outlined" rounded
                            @click="initializeRanges1('current', 'wide-long')">
                            Wide Long
                          </v-btn>
                        </div>
                      </div>

                    </v-col>

                    <!-- Second Column capital & composition -->
                    <v-col cols="12" lg="4">
                      <div class="calc-other-text">Composition</div>
                      <v-card class="pa-5 mb-4 " elevation="0"
                        :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                        <div class="d-flex flex-column">
                          <div class="d-flex flex-column">
                            <div class="d-flex">
                              <span :class="[darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{
                                poolDetailsPeriods[0].BaseToken }}: </span>
                              <span class="highlight ml-1"> {{ xPercentage.toFixed(2) }} %</span>
                            </div>
                            <div class="composition-token">{{ Number(xTokens).toFixed(5) }} tokens</div>
                          </div>
                          <div>
                            <span :class="[darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{
                              poolDetailsPeriods[0].QuoteToken }}</span>:
                            <span class="highlight">
                              {{ yPercentage.toFixed(2) }} %
                            </span>
                          </div>
                          <div class="y-tokens">{{ Number(yTokens).toFixed(5) }} tokens</div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <!-- Run Test -->
                <v-row class="justify-space-between mb-5 mr-10 align-center">
                  <!-- First Column: Range Slider and Text Below -->
                  <v-col cols="12" lg="4">

                    <!-- Range Slider -->
                    <v-slider v-model="feeSelectedDays" :step="30" :min="0" :max="365" color="#BFAC62"
                      class="mt-4"></v-slider>
                    <!-- <input type="range" v-model="feeSelectedDays" :min="0" :max="360" :step="30"> -->
                    <div class="text-caption mt-2">Days to include for fees: {{ feeSelectedDays }}</div>
                  </v-col>

                  <!-- Second Column: Run Back Test Button -->
                  <v-col cols="12" lg="6" class="d-flex justify-start">
                    <v-btn class="text-none ml-4 run-text" color="medium-emphasis" min-width="92" rounded
                      @click="megaTest('current')">
                      Run Back Test
                      <v-icon class="ml-2 gap-cls">mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <hr>
                <div class="text-left result-text" :class="[darkMode ? 'result-text-dark' : 'result-text-light']">
                  Back Test Results
                </div>

                <!-- Bottom Box -->
                <div class="d-flex flex-column">
                  <v-card class="pa-5 mb-4 " elevation="0"
                    :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                    <v-row cols="3">
                      <v-col>
                        <div>
                          <div class="result-text-right">Generated Fees (est)</div>
                          <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                            SOL {{
                              estimatedFees.toFixed(5) }}, {{ approximateFeesUSD }}</div>
                        </div>
                      </v-col>
                      <v-col>
                        <div>
                          <div class="result-text-right">Time In Range (%)</div>
                          <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                            {{
                              inRangePercentaje.toFixed(2) + ' %' }}</div>
                        </div>
                      </v-col>
                      <v-col>
                        <div>
                          <div class="result-text-right">Estimated APR (%)</div>
                          <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                            {{
                              estimatedAPR.toFixed(2) + ' %' }}</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
              </v-card>
            </v-col>
            <!-- SplineChart Component for Liquidity Back Test -->
            <v-col cols="12" lg="6">
              <v-card :class="[darkMode ? 'custom-card-dark-class' : '', '']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="liquidityChartRender" :show-exponential-digit="true"
                    :labels="liquididtyChartLabels" :series-name="'Liquidity'" :data-values="liquidityDatasets"
                    :axis-titles="{ xaxis: 'Price', yaxis: 'Liquidity' }" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'mt-4']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="tokenDistributionChartRender"
                    :axis-titles="{ xaxis: 'Price' }" :show-exponential-digit="true"
                    :labels="tokenDistributionChartLabels" :options="{
                      yaxis: [
                        {
                          title: {
                            text: 'BaseToken Quantity',
                            style: {
                              color: darkMode ? '#FFF' : '#98A2B3',
                              fontWeight: '300'
                            },
                          },
                          labels: {
                            style: {
                              colors: darkMode ? '#FFF' : '#98A2B3',
                            },
                            formatter: (value) => {
                              return value > 1000 ? millify(value) : value.toFixed(2);
                            },
                          },
                        },
                        {
                          opposite: true,
                          title: {
                            text: 'QuoteToken Quantity',
                            style: {
                              color: darkMode ? '#FFF' : '#98A2B3',
                              fontWeight: '300'
                            },
                          },
                          labels: {
                            style: {
                              colors: darkMode ? '#FFF' : '#98A2B3',
                            },
                            formatter: (value) => {
                              return value > 1000 ? millify(value) : value.toFixed(2);
                            },
                          },
                        },
                      ],
                    }" :series-name="'Tokens Distribution'" :data-values="tokenDistributionDatasets" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : '', 'mt-4']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="backTesterChartRender" :show-exponential-digit="true"
                    :labels="backTesterChartLabels" :series-name="'Back Testing Results'"
                    :data-values="backTesterDatasets" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <!-- Kuladeep -->

        <v-tabs-window-item key="2" value="2">
          <v-row>
            <v-col cols="12" lg="6">
              <v-card class="d-flex flex-column " :class="[darkMode ? 'calculator-ui-dark' : 'calculator-ui']">
                <div class="d-flex justify-space-between">
                  <!-- <div :class="[darkMode ? 'calc-heading-dark' : 'calc-heading-light']">
                    <h4>APR CALCULATOR</h4>
                  </div> -->
                  <div class="d-flex flex-column mr-6">
                    <div class="calc-other-text" :class="[darkMode ? 'calc-other-text-dark' : 'calc-other-text-light']">
                      Future
                      Price:</div>
                    <div class="highlight">{{ displayPrice }} {{ invertedPrices ? poolDetailsPeriods[0].BaseToken :
                      poolDetailsPeriods[0].QuoteToken }}</div>
                  </div>
                  <div class="action mr-6">
                    <v-btn class="text-none" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                      min-width="92" variant="outlined" rounded @click="handleInvertPrices">
                      <span class="mt-2 mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                          v-if="!darkMode">
                          <path
                            d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334"
                            stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                          v-else>
                          <path
                            d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334"
                            stroke="#FCFCFD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      Invert Price
                    </v-btn>
                  </div>
                </div>
                <div class="d-flex justify-space-between mr-4 align-center">
                  <!-- Min Value Input -->
                  <div class="d-flex flex-column flex-gap" style="flex: 1;">
                    <div class="d-flex flex-column mr-6">
                      <div class="label-height">
                        <label class="calculator-label">Min Value: </label>
                        <span class="highlight ml-1">{{ lowerPercentageRange.toFixed(2) + '%' }}</span>
                      </div>
                      <v-text-field v-model="myMinRange" class="text-field-width"
                        :class="[darkMode ? 'text-field-dark' : 'text-field-light']" variant="plain" density="default"
                        :hide-details="true" prepend-inner-icon="mdi-minus" append-inner-icon="mdi-plus"
                        @click:prepend-inner="handlePrependInner('min')"
                        @click:append-inner="handleAppendInner('min')"></v-text-field>
                    </div>
                  </div>

                  <!-- Max Value Input -->
                  <div class="d-flex flex-column flex-gap" style="flex: 1;">
                    <div class="d-flex flex-column">
                      <div class="label-height">
                        <label class="calculator-label">Max Value: </label>
                        <span class="highlight ml-1">{{ higherPercentageRange.toFixed(2) + '%' }}</span>
                      </div>
                      <v-text-field v-model="myMaxRange" class="text-field-width"
                        :class="[darkMode ? 'text-field-dark' : 'text-field-light']" :hide-details="true"
                        density="default" variant="plain" prepend-inner-icon="mdi-minus" append-inner-icon="mdi-plus"
                        @click:prepend-inner="handlePrependInner('max')"
                        @click:append-inner="handleAppendInner('max')"></v-text-field>
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <v-row>
                    <!-- First Column -->
                    <v-col cols="6">
                      <div class="d-flex flex-column mr-2">
                        <div class="calc-other-text">Capital Preservation Indicator</div>
                        <v-chip :class="[darkMode ? 'chip-gmvalue-dark' : 'chip-gmvalue']" variant="flat">{{ myGMValue
                          }}</v-chip>
                      </div>
                      <div class="d-flex justify-space-between mt-5 mr-10 align-center">
                        <div class="d-flex">
                          <v-btn class="text-none mr-4" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                            min-width="92" variant="outlined" rounded
                            @click="initializeRanges1('future', 'aggressive')">
                            Narrow Range
                          </v-btn>

                          <v-btn class="text-none" :class="[darkMode ? 'round-button-dark' : 'round-button-light']"
                            min-width="92" variant="outlined" rounded @click="initializeRanges1('future', 'neutral')">
                            Wide range
                          </v-btn>
                        </div>
                      </div>
                    </v-col>

                    <!-- Second Column -->
                    <v-col cols="4">
                      <div class="calc-other-text">Composition</div>
                      <v-card class="pa-5 mb-4 " elevation="0"
                        :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                        <div class="d-flex flex-column">
                          <div class="d-flex flex-column">
                            <div class="d-flex">
                              <span :class="[darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{
                                poolDetailsPeriods[0].BaseToken }}: </span>
                              <span class="highlight ml-1"> {{ xPercentage.toFixed(2) }} %</span>
                            </div>
                            <div class="composition-token">{{ xTokens }} tokens</div>
                          </div>
                          <div>
                            <span :class="[darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{
                              poolDetailsPeriods[0].QuoteToken }}</span>:
                            <span class="highlight">
                              {{ yPercentage.toFixed(2) }} %
                            </span>
                          </div>
                          <div class="y-tokens">{{ yTokens }} tokens</div>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>

                <v-row class="justify-space-between mb-5 mr-10 align-center">
                  <!-- First Column: Range Slider and Text Below -->
                  <v-col cols="4">
                    <v-range-slider v-model="daysForFees" :min="0" :max="365" color="#BFAC62"></v-range-slider>
                    <div class="text-caption mt-2">Day to include for fees: {{ daysForFees }}</div>
                  </v-col>

                  <!-- Second Column: Run Back Test Button -->
                  <v-col cols="6" class="d-flex justify-start">
                    <v-btn class="text-none ml-4 run-text" color="medium-emphasis" min-width="92" rounded
                      @click="backTester('future')">
                      Run Back Test
                      <v-icon class="ml-2 gap-cls">mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <hr>
                <div class="text-left result-text" :class="[darkMode ? 'result-text-dark' : 'result-text-light']">
                  Back Test Results
                </div>
                <div class="d-flex flex-column">
                  <v-card class="pa-5 mb-4 " elevation="0"
                    :class="[darkMode ? 'result-card-dark' : 'result-card-light']">
                    <v-row cols="3">
                      <v-col>
                        <div>
                          <div class="result-text-right">Generated Fees (est)</div>
                          <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                            {{
                              formatMoney(estimatedFees) }}</div>
                        </div>
                      </v-col>
                      <v-col>
                        <div>
                          <div class="result-text-right">Time In Range (%)</div>
                          <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                            {{
                              inRangePercentaje.toFixed(2) + ' %' }}</div>
                        </div>
                      </v-col>
                      <v-col>
                        <div>
                          <div class="result-text-right">Estimated APR (%)</div>
                          <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                            {{
                              estimatedAPR.toFixed(2) + ' %' }}</div>
                        </div>
                      </v-col>
                    </v-row>
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
import SplineChart from '@/components/SplineChart.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import { ref, onMounted, computed, watch, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/utils/axios';
import { getMean, getStandardDeviation, formatNumber } from '@/utils/common';
import { formatMoney } from '@/utils/formatMoney.js';
import { useDateFormat } from '@/utils/composables/useDateFormat';
import { DATA_PERIOD_GRAPH, MONTH_NAMES } from '@/constant/index.js';
import millify from "millify";

const theme = useTheme();
const activeTab = ref(0)
const liquidityValue = ref(1000);
const seletedDuration = ref('7');
const dataPeriod = DATA_PERIOD_GRAPH;
const tabs = [{
  title: 'All Transactions',
  value: '0'
}, {
  title: 'APR Calculator',
  value: '1'
}, {
  title: 'Future Calculator',
  value: '2'
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
const tikFactor = ref(1.0001);
const invertedPrices = ref(false);

var xPercentage = ref(0);
var yPercentage = ref(0);
var xTokens = ref(0);
var yTokens = ref(0);

const myFeeTier = ref(0);
const myFeeDelta = ref(0);

const loading = ref(false);

const inRangePercentaje = ref(0);
const estimatedFees = ref(0);
const estimatedAPR = ref(0);
const daysForFees = ref(0);

const currentPriceNativeX = ref([0]);
const invertedPricesFlag = ref(false);
const myFuturePrice = ref([0]);
const myFutureMaxRange = ref([0]);
const myFutureMinRange = ref([0]);
const xtokensFuture = ref([0]);
const ytokensFuture = ref([0]);


// New
const backTesterLiquidityArray = ref([]);
const liquidityArray = ref([])
const feeSelectedDays = ref(30)
const liquidityDatasets = ref([])
const liquididtyChartLabels = ref([])
const liquidityChartRender = ref(0)
const tokenDistributionDatasets = ref([])
const tokenDistributionChartLabels = ref([])
const tokenDistributionChartRender = ref(0)
const backTesterDatasets = ref([])
const backTesterChartLabels = ref([])
const backTesterChartRender = ref(0)


const { formatDateTime } = useDateFormat();

const approximateFeesUSD = computed(() => {
  if (Math.abs(poolDetailsPrice.value.priceNative - poolDetailsPrice.value.priceUsd) / poolDetailsPrice.value.priceUsd < 0.01) {
    return formatMoney(estimatedFees.value);
  }
  else {
    return formatMoney(estimatedFees.value * poolDetailsPrice.value.priceUsd / currentPriceNativeX.value);
  }
})

const correlation1 = 0;
/** Methods */
const setValues = () => {
  let minPrice = 0;
  let maxPrice = 0;
  let counter = 0;
  let nativePriceArray = [];
  let standardDev = 0;
  let meanValue = 0;
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
    weeklyVolume.value += element.Volume / 3;
    weeklyFees.value += element.fees;
    if (typeof (element.priceNative) !== "undefined") {
      nativePriceArray.push(Number.parseFloat(element.priceNative));
    }
    counter++;
  });
  myFeeTier.value = poolDetailsPeriods.value[0].feeTier;

  if (myFeeTier.value !== 0) {
    myFeeDelta.value = myFeeTier.value * 2 / 100;
  } else {
    myFeeDelta.value = 200;
  }
  weeklyAvgAPR.value = (weeklyVolume.value * poolDetailsPeriods.value[0].feeTier * 365) / (10000 * weeklyAvgLiquidity.value);
  weeklyAvgLiquidity.value /= counter;
  absoluteVolatility.value = (100 * maxPrice / minPrice) - 100;
  mySigma.value = standardDev = getStandardDeviation(nativePriceArray);
  myMeanPrice.value = meanValue = getMean(nativePriceArray);
  weeklyVolatility.value = meanValue !== 0 ? ((standardDev * 100) / meanValue) : "N/A";
  initializeRanges1('current', 'neutral')
  correlationEstimator.value = (correlationEstimator1(poolDetailsPeriods.value, seletedDuration.value) * 100).toFixed(2);

  console.log(correlationEstimator.value);
};
const correlationEstimator = async (data, days) => {
  // Check if the input data is valid
  if (!Array.isArray(data) || data.length === 0 || days <= 0) {
    throw new Error("Invalid data or number of days");
  }

  const getBestCorrelation = (item) => {
    const correlations = [
      item.Correlation7d,
      item.Correlation30d,
      item.Correlation90d,
      item.Correlation180d
    ];

    // Filter out null or undefined values
    const validCorrelations = correlations.filter(correlation => correlation !== null && correlation !== undefined);

    // Find the highest correlation value
    const bestCorrelation = validCorrelations.length > 0 ? Math.max(...validCorrelations) : null;

    // Return the formatted correlation or 'N/A' if none is found
    return bestCorrelation !== null ? formatCorrelation(bestCorrelation) : 'N/A';
  };

  const formatCorrelation = (correlation) => {
    return (correlation * 100).toFixed(2) + ' %';
  };


  // Calculate the total number of samples based on days and samples per day
  const numSamples = days * 3; // 3 samples per day

  // Extract values for Token1 and Token2
  const token1Values = [];
  const token2Values = [];

  for (let i = 0; i < Math.min(data.length, numSamples); i++) {
    const sample = data[i];
    token1Values.push(Number(sample.priceUsd)); // Assuming token1USD is the USD value for Token1
    token2Values.push(Number(sample.priceUsd / sample.priceNative)); // Assuming token1InToken2 is the price of Token1 in terms of Token2
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
  // const correlation = numerator / Math.sqrt(denominatorToken1 * denominatorToken2);
  // return correlation;

  const correlation = numerator / Math.sqrt(denominatorToken1 * denominatorToken2);
  return correlation * 100;  // Convert correlation to percentage

};

const correlationEstimator1 = (data, days) => {
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
    token2Values.push(Number(sample.priceUsd / sample.priceNative)); // Assuming token1InToken2 is the price of Token1 in terms of Token2
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
    currentPriceNativeX.value = data.output.price.priceNative
    if (Math.abs(data.output.price.priceNative - data.output.price.priceUsd) / data.output.price.priceUsd < 0.01) {
      liquidityValue.value = 1000;
    }
    else {
      liquidityValue.value = 1000 * currentPriceNativeX.value / data.output.price.priceUsd;
    }
    setValues();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  finally {
    loading.value = false;
  }
};

const initializeRanges1 = (which, mode) => {
  let highMultiplier = 0;
  let lowMultiplier = 0;
  if (which === 'current') {
    switch (mode) {
      case 'aggressive':
        highMultiplier = 0.75;
        lowMultiplier = 0.75;
        myMinRange.value = Number.parseFloat(currentPriceNativeX.value) - Number.parseFloat(mySigma.value) * lowMultiplier;
        myMaxRange.value = Number.parseFloat(currentPriceNativeX.value) + Number.parseFloat(mySigma.value) * highMultiplier;
        break;
      case 'neutral':
        highMultiplier = 2.5;
        lowMultiplier = 1.5;
        if (currentPriceNativeX.value >= myMeanPrice.value) {
          myMinRange.value = Number.parseFloat(myMeanPrice.value) - Number.parseFloat(mySigma.value) * lowMultiplier;
          myMaxRange.value = Number.parseFloat(currentPriceNativeX.value) + Number.parseFloat(mySigma.value) * highMultiplier;
        } else {
          myMinRange.value = Number.parseFloat(currentPriceNativeX.value) - Number.parseFloat(mySigma.value) * highMultiplier;
          myMaxRange.value = Number.parseFloat(myMeanPrice.value) + Number.parseFloat(mySigma.value) * lowMultiplier;
        }
        break;
      case 'wide-short':
        highMultiplier = 1.5;
        lowMultiplier = 3.5;
        myMinRange.value = Number.parseFloat(currentPriceNativeX.value) - Number.parseFloat(mySigma.value) * lowMultiplier;
        myMaxRange.value = Number.parseFloat(currentPriceNativeX.value) + Number.parseFloat(mySigma.value) * highMultiplier;
        break;
      case 'wide-long':
        highMultiplier = 3.5;
        lowMultiplier = 1.5;
        myMinRange.value = Number.parseFloat(currentPriceNativeX.value) - Number.parseFloat(mySigma.value) * lowMultiplier;
        myMaxRange.value = Number.parseFloat(currentPriceNativeX.value) + Number.parseFloat(mySigma.value) * highMultiplier;
        break;
    }

    if (invertedPrices.value) {
      const actualMinRange = 1 / myMaxRange.value;
      const actualMaxRange = 1 / myMinRange.value;
      myMinRange.value = actualMinRange;
      myMaxRange.value = actualMaxRange;
    }

    // Execute the methods with promises to ensure all operations complete
    const promise1 = new Promise((resolve) => {
      findClosestTik('min');
      resolve();
    });
    const promise2 = new Promise((resolve) => {
      findClosestTik('max');
      resolve();
    });
    const promise3 = new Promise((resolve) => {
      const liqObjCurrent = calculateAssetBalances(myMinRange.value, myMaxRange.value, poolDetailsPrice.value.priceNative, poolDetailsPrice.value.priceNative, true);
      xTokens.value = Number.parseFloat(liqObjCurrent.xQty);
      yTokens.value = Number.parseFloat(liqObjCurrent.yQty);
      xPercentage.value = Number.parseFloat(liqObjCurrent.XPct);
      yPercentage.value = Number.parseFloat(liqObjCurrent.YPct);
      resolve();
    });

    Promise.all([promise1, promise2, promise3]).then(() => {
      console.log('Promise all resolved for current range');
    });
  } else {
    let actualFuturePrice = Number.parseFloat(myFuturePrice.value);
    let actualMinRange = Number.parseFloat(myMinRange.value);
    let actualMaxRange = Number.parseFloat(myMaxRange.value);

    if (invertedPricesFlag.value) {
      actualFuturePrice = 1 / Number.parseFloat(myFuturePrice.value);
      actualMinRange = 1 / Number.parseFloat(myMaxRange.value);
      actualMaxRange = 1 / Number.parseFloat(myMinRange.value);
    }

    switch (mode) {
      case 'aggressive':
        highMultiplier = 0.75;
        lowMultiplier = 0.75;
        if (actualFuturePrice > actualMaxRange) {
          myFutureMaxRange.value = Number.parseFloat(actualFuturePrice) + Number.parseFloat(mySigma.value) * highMultiplier;
          myFutureMinRange.value = (Number.parseFloat(actualMinRange) * Number.parseFloat(actualMaxRange)) / myFutureMaxRange.value;
        } else {
          myFutureMinRange.value = Number.parseFloat(actualFuturePrice) - Number.parseFloat(mySigma.value) * lowMultiplier;
          myFutureMaxRange.value = (Number.parseFloat(actualMinRange) * Number.parseFloat(actualMaxRange)) / myFutureMinRange.value;
        }
        break;
      case 'neutral':
        highMultiplier = 2.5;
        lowMultiplier = 1.5;
        if (actualFuturePrice > actualMaxRange) {
          myFutureMaxRange.value = Number.parseFloat(actualFuturePrice) + Number.parseFloat(mySigma.value) * highMultiplier;
          myFutureMinRange.value = (Number.parseFloat(actualMinRange) * Number.parseFloat(actualMaxRange)) / myFutureMaxRange.value;
        } else {
          myFutureMinRange.value = Number.parseFloat(actualFuturePrice) - Number.parseFloat(mySigma.value) * lowMultiplier;
          myFutureMaxRange.value = (Number.parseFloat(actualMinRange) * Number.parseFloat(actualMaxRange)) / myFutureMinRange.value;
        }
        break;
    }

    if (invertedPrices.value) {
      const actualFutureMinRange = 1 / myFutureMaxRange.value;
      const actualFutureMaxRange = 1 / myFutureMinRange.value;
      myFutureMaxRange.value = actualFutureMaxRange;
      myFutureMinRange.value = actualFutureMinRange;
    }

    // Execute the methods with promises
    const promise1 = new Promise((resolve) => {
      findClosestTik('minFuture');
      resolve();
    });
    const promise2 = new Promise((resolve) => {
      findClosestTik('maxFuture');
      resolve();
    });
    const promise3 = new Promise((resolve) => {
      if (myFutureMaxRange.value !== 0) {
        const liqObjFuture = calculateAssetBalances(myFutureMinRange.value, myFutureMaxRange.value, myFuturePrice.value, myFuturePrice.value, true);
        xtokensFuture.value = Number.parseFloat(liqObjFuture.xQty);
        ytokensFuture.value = Number.parseFloat(liqObjFuture.yQty);
        this.xPercentageFuture.value = Number.parseFloat(liqObjFuture.XPct);
        this.yPercentageFuture.value = Number.parseFloat(liqObjFuture.YPct);
      }
      resolve();
    });

    Promise.all([promise1, promise2, promise3]).then(() => {
      console.log('Promise all resolved for future range');
    });
  }
};




const findClosestTik = (which) => {
  let price = which === 'min' ? myMinRange.value : myMaxRange.value;
  let closestTik = Math.round((Math.log(price) / Math.log(tikFactor.value)) / myFeeDelta.value);
  which === 'min' ? (myMinRange.value = setPriceFromtik(closestTik)) : (myMaxRange.value = setPriceFromtik(closestTik));
  return closestTik;
};

const setPriceFromtik = (tikNumber) => Math.pow(tikFactor.value, myFeeDelta.value * tikNumber);

const calculateTokensRatio = () => {
  console.log("ratio=====")
  let x = 1;
  let Lx = (x * Math.sqrt(poolDetailsPrice.value.priceNative) * Math.sqrt(myMaxRange.value)) / (Math.sqrt(myMaxRange.value) - Math.sqrt(poolDetailsPrice.value.priceNative));
  let y = Lx * (Math.sqrt(poolDetailsPrice.value.priceNative) - Math.sqrt(myMinRange.value));
  xPercentage.value = (100 * Number.parseFloat(poolDetailsPrice.value.priceNative)) / (Number.parseFloat(poolDetailsPrice.value.priceNative) + Number.parseFloat(y));
  yPercentage.value = (100 * Number.parseFloat(y)) / (Number.parseFloat(poolDetailsPrice.value.priceNative) + Number.parseFloat(y));
  if (invertedPrices.value) {
    [xPercentage.value, yPercentage.value] = [yPercentage.value, xPercentage.value];
  }
  let MaxX = Number.parseFloat(liquidityValue.value) / Number.parseFloat(poolDetailsPrice.value.priceUsd);
  let MaxY = Number.parseFloat(MaxX) * Number.parseFloat(poolDetailsPrice.value.priceNative);
  xTokens.value = Number.parseFloat(MaxX) * (xPercentage.value / 100.0);
  yTokens.value = Number.parseFloat(MaxY) * (yPercentage.value / 100.0);
};

const handleInvertPrices = () => {
  invertedPrices.value = !invertedPrices.value;
  [myMinRange.value, myMaxRange.value] = [1 / myMaxRange.value, 1 / myMinRange.value];
  poolDetailsPrice.value.priceNative = 1 / poolDetailsPrice.value.priceNative;
  // calculateTokensRatio();

};

const handleTabClick = (value) => {
  if (value == 1) {
    initializeRanges1('current', 'neutral')

  }
}


const handleAppendInner = (type) => {
  shiftTik(type, 1);
}

const handlePrependInner = (type) => {
  shiftTik(type, -1);
}

const shiftTik = (which, step) => {
  let currentTik = 0;
  currentTik = findClosestTik(which);
  currentTik += step;
  if (which === 'min') {
    myMinRange.value = formatNumber(setPriceFromtik(currentTik));
  }
  else {
    myMaxRange.value = formatNumber(setPriceFromtik(currentTik));
  }
  calculateTokensRatio();
}

const refreshTokensDistribution = () => {
  let liqObjCurrent = this.calculateAssetBalances(myMinRange.value, myMaxRange.value, poolDetailsPrice.value.priceNative, poolDetailsPrice.value.priceNative, true);

  xTokens.value = Number.parseFloat(liqObjCurrent.xQty); //* this.myLiquidity/1000;
  yTokens.value = Number.parseFloat(liqObjCurrent.yQty); //* this.myLiquidity/1000;

  xPercentage.value = Number.parseFloat(liqObjCurrent.XPct);
  yPercentage.value = Number.parseFloat(liqObjCurrent.YPct);
};

const backTester = (which) => {
  let totalPeriods = 0;
  let inRangePeriods = 0;
  let totalFees = 0;
  let periodFee = 0;
  let actualMinRange = 0;
  let actualMaxRange = 0;
  // let actualMinRange = myMinRange.value;
  // let actualMaxRange = myMaxRange.value;

  // if (invertedPrices.value) {
  //     actualMinRange = 1 / myMaxRange.value;
  //     actualMaxRange = 1 / myMinRange.value;
  // }

  if (which === 'current') {
    actualMinRange = myMinRange.value;
    actualMaxRange = myMaxRange.value;
    if (invertedPrices.value) {
      actualMinRange = 1 / myMaxRange.value;
      actualMaxRange = 1 / myMinRange.value;
    }
  } else if (which === 'future') {
    // actualMinRange=this.myFutureMinRange;
    // actualMaxRange=this.myFutureMaxRange;
    // if (this.invertedPricesFlag) {
    //   actualMinRange=1/this.myFutureMaxRange;
    //   actualMaxRange=1/this.myFutureMinRange;
    // }
  }

  let stdDevs = Number.parseFloat(actualMaxRange - actualMinRange) / Number.parseFloat(mySigma.value);
  let FeesWeight = 1;
  if (stdDevs <= 2) {
    FeesWeight = 1;
  } else if (stdDevs > 2 && stdDevs <= 3) {
    const x1 = 2;
    const y1 = 1;
    const x2 = 3;
    const y2 = 0.81;
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const x = 2;
    const y = m * x + b;
    FeesWeight = m * stdDevs + b;
  } else if (stdDevs > 3 && stdDevs <= 4) {
    const x1 = 3;
    const y1 = 0.81;
    const x2 = 4;
    const y2 = 0.68;
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const x = 2;
    const y = m * x + b;
    FeesWeight = m * stdDevs + b;
  } else if (stdDevs > 4 && stdDevs <= 6) {
    const x1 = 4;
    const y1 = 0.68;
    const x2 = 6;
    const y2 = 0.5;
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const x = 2;
    const y = m * x + b;
    FeesWeight = m * stdDevs + b;
  } else if (stdDevs > 6 && stdDevs <= 20) {
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

  // New code
  const reversedArray = filteredPoolDetailsBasedOnPeriod.value.slice().reverse();
  const initialPrice = reversedArray[0].priceNative;
  // Initial tokens (for hold 50/50)
  let xHold = Number.parseFloat(500 / initialPrice);
  let yHold = 500;
  let lHold = xHold * initialPrice + yHold;
  // Let's clean the Back Tester liquidity array
  backTesterLiquidityArray.value.length = 0;
  xHold = xHold * liquidityValue.value / 1000;
  yHold = yHold * liquidityValue.value / 1000;
  console.log("New Data filtered pool data:", filteredPoolDetailsBasedOnPeriod.value);

  reversedArray.forEach(element => {
    totalPeriods++;
    // Let's get the calculated liquidity value at this point
    let liqObject = calculateAssetBalances(actualMinRange, actualMaxRange, initialPrice, element.priceNative, true, which);

    if (Number.parseFloat(element.priceNative) >= Number.parseFloat(actualMinRange) &&
      Number.parseFloat(element.priceNative) <= Number.parseFloat(actualMaxRange)) {
      inRangePeriods++;
      periodFee = liquidityValue.value * Number.parseFloat(FeesWeight) * (element.Volume / 3) *
        (poolDetailsPeriods.value[0].feeTier / 1000000) * (1 / (element.Liquidity));
    } else {
      periodFee = 0;
    }
    totalFees += periodFee;

    liqObject.HoldLiquidity = xHold * element.priceNative + yHold;
    liqObject.TotalValue = liqObject.Liquidity + totalFees;
    liqObject.periodFee = periodFee;
    liqObject.dateTime = element.dateTime;
    backTesterLiquidityArray.value.push(liqObject);
  });
  if (which === 'current') {
    inRangePercentaje.value = inRangePeriods * 100 / totalPeriods;
    estimatedFees.value = totalFees;
    estimatedAPR.value = estimatedFees.value * 100 * (365 / (totalPeriods / 3)) * (1 / liquidityValue.value);
    showBackTestChart();
    console.log("check resp : ", which, inRangePercentaje.value, estimatedFees.value, estimatedAPR.value)
  }
};
const megaTest = () => {
  backTester('current');

  calculateAssetBalances(myMinRange.value, myMaxRange.value, poolDetailsPrice.value.priceNative);
}

const calculateAssetBalances = (a, b, p0, pTarget = 0, single = false, which = 'current') => {

  //console.log(`Entered calculateAssetBalances with a=${a} b=${b} p0=${p0} pTarget=${pTarget} single=${single} which=${which}`);

  let actualLiquidity = 0;

  if (which === 'current') {
    actualLiquidity = liquidityValue.value;
    //console.log(`Current liquidity: ${actualLiquidity}`);
  } else {
    // actualLiquidity = this.myFutureLiquidity;
    //console.log(`Future liquidity: ${actualLiquidity}`);
  }

  // Aux functions

  function get_liquidity_0(x, sa, sb) {
    return x * sa * sb / (sb - sa);
  }

  function get_liquidity_1(y, sa, sb) {
    return y / (sb - sa);
  }

  function get_liquidity(x, y, sp, sa, sb) {

    if (sp <= sa) {
      return get_liquidity_0(x, sa, sb);
    } else if (sp < sb) {
      let liquidity_0 = get_liquidity_0(x, sp, sb);
      let liquidity_1 = get_liquidity_1(y, sa, sp);
      return Math.min(liquidity_0, liquidity_1);
    } else {
      return get_liquidity_1(y, sa, sb);
    }
  }

  // Simulating calculate_x function
  function calculate_x(L, sp, sa, sb) {
    let sc = Math.max(Math.min(sp, sb), sa);
    return L * (sb - sc) / (sc * sb);
  }

  // Simulating calculate_y function
  function calculate_y(L, sp, sa, sb) {
    let sc = Math.max(Math.min(sp, sb), sa);
    return L * (sc - sa);
  }

  let p = Math.sqrt(a * b);
  let x = 500 / p0;
  let y = 500;

  let x0Pct = 0;
  let y0Pct = 0;

  a = Number(a);
  b = Number(b);
  p0 = Number(p0);

  if (p0 < a) {
    // X will be 100% and Y will be 0%
    x = 1000 / p0;
    y = 0;
    p = p0;
    x0Pct = 100;
    y0Pct = 0;

  } else if (a <= p0 && p0 <= b) {
    // We start with the composition for the Geometric mean
    // X will be 50% and Y will be 50%
    p = Math.sqrt(a * b);
    x = 500 / p;
    y = 500;

    //console.log(`Initial composition: x=${x.toFixed(5)} y=${y.toFixed(2)} for P=${p.toFixed(2)}`);

    let sp = Math.sqrt(p);
    let sa = Math.sqrt(a);
    let sb = Math.sqrt(b);

    let sp1 = Math.sqrt(p0);
    let L = get_liquidity(x, y, sp, sa, sb);

    let x1 = calculate_x(L, sp1, sa, sb);
    let y1 = calculate_y(L, sp1, sa, sb);
    //  console.log(`Amount of ETH x=${x1.toFixed(5)} amount of USDC y=${y1.toFixed(2)} for P1=${p1.toFixed(2)}`);

    let p1 = p0;

    let LatP1 = x1 * p1 + y1;
    //  console.log(`Total liquidity ${LatP1.toFixed(2)}`);

    // Let's get the percentage of x1 and y1 with respect to the total liquidity
    let xPercentage = 100 * x1 * p1 / LatP1;
    let yPercentage = 100 - xPercentage;

    x0Pct = xPercentage;
    y0Pct = yPercentage;

    //console.log(`xPercentage: ${xPercentage} - yPercentage: ${yPercentage}`);

    let yy1 = yPercentage * 1000 / 100;
    let xx1 = (1000 - yy1) / p1;

    //console.log(`xx1: ${xx1} - yy1: ${yy1}`);

    x = xx1;
    y = yy1;
    p = p0;

  } else {
    // X will be 0% and Y will be 100%
    x = 0;
    y = 1000;
    p = p0;
    x0Pct = 0;
    y0Pct = 100;

  }

  let xHold = 500 / p0;
  let yHold = 500;

  let xHoldInitial = 1000 * x0Pct / (p0 * 100);
  let yHoldInitial = 1000 * y0Pct / 100;

  //console.log(`xHoldInitial: ${xHoldInitial} - yHoldInitial: ${yHoldInitial}`);

  let sp = Math.sqrt(p);
  let sa = Math.sqrt(a);
  let sb = Math.sqrt(b);

  // Calculate initial liquidity
  let L = get_liquidity(x, y, sp, sa, sb);
  //console.log(`Amount of L x=${L.toFixed(2)}`);

  xHold = xHold * actualLiquidity / 1000;
  yHold = yHold * actualLiquidity / 1000;

  xHoldInitial = xHoldInitial * actualLiquidity / 1000;
  yHoldInitial = yHoldInitial * actualLiquidity / 1000;

  // Draw the liquidity
  if (!single) {

    // Let/s divide the value of L by 1000

    if (which !== 'current') {
      // this.liquidityArrayFuture.length = 0;
    } else {
      liquidityArray.value.length = 0;
    }

    // Iterate over range similar to Python's range(3000, 4200, 25)
    for (let p1 = a * 0.75; p1 < b * 1.25; p1 += (b - a) / 50) {
      let sp1 = Math.sqrt(p1);

      let x1 = calculate_x(L, sp1, sa, sb);
      let y1 = calculate_y(L, sp1, sa, sb);
      //  console.log(`Amount of ETH x=${x1.toFixed(5)} amount of USDC y=${y1.toFixed(2)} for P1=${p1.toFixed(2)}`);

      // Let's get the actual x1 and y1 values
      // related to myLiquidty

      x1 = x1 * actualLiquidity / 1000;
      y1 = y1 * actualLiquidity / 1000;

      let LatP1 = x1 * p1 + y1;
      //  console.log(`Total liquidity ${LatP1.toFixed(2)}`);

      // Let's get the percentage of x1 and y1 with respect to the total liquidity
      let xPercentage = 100 * x1 * p1 / LatP1;
      let yPercentage = 100 - xPercentage;

      //  console.log(`xPercentage: ${xPercentage} - yPercentage: ${yPercentage}`);

      let LiquidityHold = xHold * p1 + yHold;
      let LiquidityHoldInitial = xHoldInitial * p1 + yHoldInitial;

      // Use only the int part of LatP1

      // If we have an estimated APR from the backtester
      // and the number of days to be used is greater than 0
      // we will calculate the liquidity at each price point plus fees
      // as a new property for the array

      let atPeriodFee = 0;

      if (estimatedAPR.value > 0 && feeSelectedDays.value > 0) {
        atPeriodFee = actualLiquidity * Number(feeSelectedDays.value) * Number.parseFloat(estimatedAPR.value) / (100 * 365);

      } else {
        atPeriodFee = 0;
      }

      var element = {
        "Price": p1,
        "Quantity": Number.parseFloat(LatP1),
        "QuantityWithFees": Number.parseFloat(LatP1 + atPeriodFee),
        "xPct": xPercentage,
        "yPct": yPercentage,
        "LiquidityHold": LiquidityHold,
        "LiquidityHoldInitial": LiquidityHoldInitial,
        "xQty": x1,
        "yQty": y1
      };

      //  console.log(element);
      //quantity.push(element);

      if (which !== 'current') {
        // this.liquidityArrayFuture.push(element);
      } else {
        liquidityArray.value.push(element);
      }

    }

    showLiquidityChart();
    showTokensDistributionChart();

    // console.log(JSON.stringify(this.liquidityArray));

  } else {

    // We are only interested in a single point

    let p1 = pTarget;
    let sp1 = Math.sqrt(pTarget);

    let x1 = calculate_x(L, sp1, sa, sb);
    let y1 = calculate_y(L, sp1, sa, sb);

    x1 = x1 * actualLiquidity / 1000;
    y1 = y1 * actualLiquidity / 1000;

    //console.log(`<<<<<`);
    //console.log(`Amount of ETH x=${x1} amount of USDC y=${y1} for P1=${p1}`);
    //console.log(`>>>>>`);

    let LatP1 = x1 * p1 + y1;
    //  console.log(`Total liquidity ${LatP1.toFixed(2)}`);

    // Let's get the percentage of x1 and y1 with respect to the total liquidity
    let xPercentage = 100 * x1 * p1 / LatP1;
    let yPercentage = 100 - xPercentage;

    //console.log(`Single Calculation----`);
    //console.log(`xPercentage: ${xPercentage} - yPercentage: ${yPercentage}`);
    //console.log(`A: ${a} - B: ${b} - P0: ${p0} - P1: ${pTarget} - X: ${x1} - Y: ${y1} - L: ${LatP1}`);

    // Let's return the values
    return {
      xQty: x1,
      yQty: y1,
      Liquidity: LatP1,
      XPct: xPercentage,
      YPct: yPercentage
    };
  }
}

const showLiquidityChart = () => {
  let chartLabels = [];
  let chartDataPricesUSD = [];
  let chartHoldLiquidity = [];
  let chartHoldLiquidityInitial = [];
  let chartLiquidityFees = [];
  let ix = 0;
  console.log(liquidityArray.value)
  liquidityArray.value.forEach((element) => {
    ix++;
    if (ix % 1 == 0) {
      if (element.Price != undefined) {
        chartLabels.push(element.Price);
        chartDataPricesUSD.push(element.Quantity);
        chartHoldLiquidity.push(element.LiquidityHold);
        chartHoldLiquidityInitial.push(element.LiquidityHoldInitial);
        chartLiquidityFees.push(element.QuantityWithFees);
      }
    }
  });

  liquidityDatasets.value = [
    {
      name: 'Liquidity',
      data: chartDataPricesUSD
    },
    {
      name: 'Hold Pool',
      data: chartHoldLiquidityInitial,
    },
    {
      name: 'Liquidity with Fees',
      data: chartLiquidityFees,
    }
  ]

  liquididtyChartLabels.value = chartLabels
  liquidityChartRender.value++
  console.log("liquidity chart data", liquidityDatasets.value, liquididtyChartLabels.value)
}

const showTokensDistributionChart = () => {
  let chartLabels = [];
  let chartTokenX = [];
  let chartTokenY = [];
  let chartTokenXQty = [];
  let chartTokenYQty = [];

  let ix = 0;

  liquidityArray.value.forEach(element => {
    ix++;
    if (ix % 1 == 0) {
      if (element.Price != undefined) {
        chartLabels.push(element.Price);
        chartTokenX.push(element.xPct.toFixed(2));
        chartTokenY.push(element.yPct.toFixed(2));
        chartTokenXQty.push(element.xQty);
        chartTokenYQty.push(element.yQty);
      }
    }
  });

  tokenDistributionDatasets.value = [
    {
      name: `${poolDetailsPeriods.value[0].BaseToken} Qty`,
      data: chartTokenXQty,
      pointStyle: false,
      borderWidth: 1,
      yAxisID: 'y1' // This dataset will use the quantity y-axis
    },
    {
      name: `${poolDetailsPeriods.value[0].QuoteToken} Qty`,
      data: chartTokenYQty,
      pointStyle: false,
      borderWidth: 1,
      yAxisID: 'y2' // This dataset will use the quantity y-axis
    },
  ]

  tokenDistributionChartLabels.value = chartLabels
  tokenDistributionChartRender.value++
  console.log(" tokenDistribution chart labels new", tokenDistributionDatasets.value, tokenDistributionChartLabels.value)
}

const showBackTestChart = () => {
  // Bar chart with liquidity and volume
  let chartLabels = [];
  let dailyLiquidity = [];
  let totalLiquidity = [];
  let holdLiquidityData = [];
  let ix = 0;

  //console.log(`Records to skip is: ${this.recordsToSkipChart}`);

  backTesterLiquidityArray.value.forEach(element => {

    chartLabels.push(element.dateTime.substring(0, 8));
    dailyLiquidity.push(element.Liquidity);
    totalLiquidity.push(element.TotalValue);
    holdLiquidityData.push(element.HoldLiquidity);

  });
  backTesterDatasets.value = [{
    name: 'Pool Value',
    data: dailyLiquidity
  },
  {
    name: 'Pool plus Fees',
    data: totalLiquidity
  },
  {
    name: 'Hold',
    data: holdLiquidityData
  }]

  backTesterChartLabels.value = chartLabels
  backTesterChartRender.value++
  console.log(" Back Testing Results chart labels new", backTesterDatasets.value, backTesterChartLabels.value)

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
      date: formatDateTime(poolDetailItem.dateTime),
      apr: poolDetailItem.apr.toFixed(2) != null ? parseFloat(poolDetailItem.apr).toFixed(2) : 0.00,
      liquidity: formatMoney(poolDetailItem.Liquidity),
      volume: formatMoney(poolDetailItem.Volume),
      fees: formatMoney(poolDetailItem.fees),
      vol_tvl: poolDetailItem.Liquidity != 0 ? ((poolDetailItem.Volume / poolDetailItem.Liquidity).toFixed(2)) : 0.00,
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
      if (element.priceUsd != undefined) {
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
    if (ix % 3 == 0) {
      if (element.priceUsd != undefined) {
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
  let chartDataRelativePrices = [];
  let ix = 0;
  filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
    ix++;
    if (ix % 3 == 0) {
      if (element.priceUsd != undefined) {
        const day = element.dateTime.slice(6, 8);
        const month = element.dateTime.slice(4, 6);
        chartLabels.push(`${day} ${MONTH_NAMES[month]}`);
        chartDataRelativePrices.push(parseFloat(1 / element.priceNative).toFixed(6));
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
  let chartDataAPR = [];
  let ix = 0;
  filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
    ix++;
    if (ix % 3 == 0) {
      if (element.priceUsd != undefined) {
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
  let chartDataLiquidity = [];
  let chartDataVolume = [];

  let ix = 0;
  filteredPoolDetailsBasedOnPeriod.value.forEach((element) => {
    ix++;
    if (ix % 3 == 0) {
      if (element.priceUsd != undefined) {
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
  if (invertedPrices.value) {
    return formatNumber(1 / Number.parseFloat(currentPriceNativeX.value));

  } else {
    return formatNumber(Number.parseFloat(currentPriceNativeX.value));
  }
});


const lowerPercentageRange = computed(() => {
  if (invertedPrices.value) {
    const actualMinRange = 1 / myMaxRange.value;
    const actualMaxRange = 1 / myMinRange.value;
    myMinRange.value = 1 / actualMaxRange;
    myMaxRange.value = 1 / actualMinRange;
  }
  return -1 * (100 - myMinRange.value * 100 / poolDetailsPrice.value.priceNative);
});

const higherPercentageRange = computed(() => {
  return -1 * (100 - myMaxRange.value * 100 / poolDetailsPrice.value.priceNative);
});

const myGMValue = computed(() => {
  let gmValue = Math.sqrt(myMinRange.value * myMaxRange.value);
  return formatNumber(gmValue);
});

const approximateInitialLiquidityUSD = computed(() => {
  if (Math.abs(poolDetailsPrice.value.priceNative - poolDetailsPrice.value.priceUsd) / poolDetailsPrice.value.priceUsd < 0.01) {
    return formatMoney(liquidityValue.value);
  }
  else {
    return formatMoney(liquidityValue.value * poolDetailsPrice.value.priceUsd / currentPriceNativeX.value);
  }
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
  width: 250px !important;
  border-radius: 10px;
  margin-top: -0.5rem;
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
  gap: 26px;
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
}

.calculator-ui-dark {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(21px);
  padding: 31px 26px 11px;
  gap: 26px;
}

.result-ui {
  border-radius: 16px;
  padding: 30px;
  gap: 38px;
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
  margin-right: 20px;
  /* Adjust the value as needed */
  padding-right: 10px;
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
  left: -10px;
  /* Adjust the value as needed */
  font-weight: bold;
  margin-bottom: 10px;
  /* Add some space below the series name */
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
  color: #182230 !important;
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
  /* margin: 2rem 0rem 2rem 0rem; */
}

.result-card-dark {
  border-radius: 8px;
  border: 1px solid rgba(178, 178, 178, 0.20);
  background: #1B1F32;
  /* margin: 2rem 0rem 2rem 0rem; */
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
  background: #fdfdfd4d;
  ;
}

.tab-background-light .active-tab {
  border-radius: 8px !important;
  border: 1px solid var(--Gray-200, #EAECF0);
  background: rgb(15, 35, 87);
  color: #FFF;
  /* Shadows/shadow-sm */
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
}

.tab-background-dark {
  border-radius: 8px;
  background: #1F243A;
  color: #FFF;
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
  width: 210px !important;
  color: #475467;
  background: #FCFCFD !important;
  border: 1px solid rgba(178, 178, 178, 0.20);
  /* Text sm/Medium */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  /* 142.857% */
}

.chip-gmvalue-dark {
  width: 210px !important;
  color: #F9FAFB;
  border: 1px solid rgba(178, 178, 178, 0.20);
  background: #1B1F32;
  /* Text sm/Medium */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  /* 142.857% */
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
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  margin-top: -0.1rem;
}

.result-number-dark {
  color: #EAECF0;
}

.result-number-light {
  color: #344054;
}



::v-deep .mdi-minus {
  color: #667085 !important;
}

::v-deep .mdi-plus {
  color: #667085 !important;
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
  color: #213aaa;
  font-weight: 700;
  font-size: larger;
  font-family: Poppins;
}

.anchor-link-light {
  color: #213aaa;
  text-decoration: none;
  font-weight: 700;
  font-size: larger;
  font-family: Poppins;
}

.flex-gap {
  gap: 40px;
}

.label-height {
  height: 29px !important;
}

.token-icon {
  width: 30px;
  /* Adjust size as needed */
  height: 30px;
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

  .sticky-top {
    position: sticky;
    top: 0;
  }
}
</style>
