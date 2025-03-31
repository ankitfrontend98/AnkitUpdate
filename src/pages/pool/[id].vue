<template>
  <v-container class="mt-10">
    <div class="d-flex justify-space-between align-center">
      <div>
        <v-icon color="#FFF" v-if="darkMode">mdi-arrow-left</v-icon>
        <v-icon v-if="!darkMode">mdi-arrow-left</v-icon>
        <span @click="handleNavigate" class="router-link" style="cursor: pointer;">Back to all pools</span>
      </div>
      <div>
        <v-select v-model="seletedDuration" :items="dataPeriod" item-title="label" item-value="value"
          :class="[darkMode ? 'select-box-dark' : 'select-box-light', 'select-box-detail']" :hide-details="true"
          variant="compact" density="plain" />
      </div>
    </div>
    <div class="mt-4">
      <v-card :class="[darkMode ? 'dark-token-details' : 'token-detail']">
        <div class="d-flex flex-wrap justify-space-between pa-6 align-center" style="gap:10px" v-if="!loading">
          <div v-for="item in tokenDetails" :key="item.id" class="d-flex flex-column container-item-mobile">
            <div class="label-color">{{ item.label }}</div>
            <div v-if="!item.hasImage" class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ item.value }}
            </div>
            <div v-else class="text-capitalize label-font text-h5 text-textItemColor">
              <span class="text-customText container-item-text-mobile">
                <img v-if="item.imgCondition" :src="item.img" alt="Quote Token Icon"
                  class="token-icon container-item-img-mobile">
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
        <v-skeleton-loader v-if="loading" :loading="true" class="my-4 mx-4" width="97%" height="100px" />
      </v-card>
    </div>
    <div class="d-flex mt-4">
      <v-row>
        <v-col cols="12" lg="4">
          <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class']">
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
        </v-col>
        <v-col cols="12" lg="4">

          <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class']">
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
        </v-col>
        <v-col cols="12" lg="4">

          <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class']">
            <div class="pt-4 pb-4">
              <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
              <line-chart v-else :dark-mode="darkMode" :key="`${seletedDuration - darkMode}`"
                :series-name="'Daily Price (Quote/Base)'" :show-exponential-digit="true" :map-colors="{
                  stroke: darkMode ? '#F4F4F5' : '#BFAC62',
                  gradientToColors: darkMode ? '#F4F4F5' : '#BFAC62',
                  offset: darkMode ? '#F4F4F5' : '#BFAC62',
                  offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(226, 217, 183, 0.46)'
                }" :labels="dailyPriceQuoteBase.chartLabels"
                :data-values="dailyPriceQuoteBase.chartDataRelativePrices" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex mt-6 justify-space-between">
      <v-row>
        <v-col lg="6" cols="12">
          <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class']">
            <div class="pt-4 pb-4">
              <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="97%" height="300" />
              <bar-chart v-else :dark-mode="darkMode" :key="`${seletedDuration - darkMode}`"
                :series-name="['Daily Liquidity', 'Daily Volume']" :labels="dailyVolumeBarData.chartLabels"
                :data-values="[dailyVolumeBarData.chartDataLiquidity, dailyVolumeBarData.chartDataVolume]" />
            </div>
          </v-card>
        </v-col>
        <v-col lg="6" cols="12">

          <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class']">
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
        </v-col>
      </v-row>
    </div>

    <div class="mt-4">
      <v-card :class="[darkMode ? 'dark-token-details' : 'token-detail']">
        <div class="d-flex justify-space-between pa-6 align-center flex-wrap" style="gap:10px" v-if="!loading">
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Avg Liquidity</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyAvgLiquidity) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Period Volume</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyVolume) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Weekly Fees</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ poolDetailsPeriods.length > 0 ? formatMoney(weeklyFees) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Avg Volatility</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ poolDetailsPeriods.length > 0 ? (weeklyVolatility !== 0 ? (weeklyVolatility.toFixed(2) + '%') :
                weeklyVolatility) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Abs Volatility</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ poolDetailsPeriods.length > 0 ? (absoluteVolatility !== 0 ? (absoluteVolatility.toFixed(2) + '%') :
                weeklyVolatility) : '' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Correlation</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ poolDetailsPeriods.length > 0 ? correlationEstimatorState.toFixed(2) + '%' : '' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Avg APR est.</div>
            <div class="label-font text-h5 text-textItemColor container-item-text-mobile">
              {{ (weeklyAvgAPR.toFixed(3) != null) ? weeklyAvgAPR.toFixed(2) + '%' : 0.00 + '%' }}
            </div>
          </div>
          <div class="d-flex flex-column container-item-mobile ">
            <div class="label-color">Dex screener</div>
            <div v-if="poolDetailsPeriods.length > 0">
              <a class="label-font text-h6 text-textItemColor"
                :href="`https://dexscreener.com/${poolDetailsPeriods[0].ChainId}/${poolDetailsPeriods[0].pairAddress}`"
                target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                <u>View</u>
              </a>
            </div>
          </div>
        </div>
        <v-skeleton-loader v-if="loading" :loading="true" class="my-4 mx-4" width="97%" height="100px" />
      </v-card>
    </div>

    <div class="d-flex justify-space-between mt-4 flex-wrap">
      <div>
        <v-tabs v-model="activeTab" :transition="false"
          :class="[darkMode ? 'tab-background-dark' : 'tab-background-light', 'flex-wrap', 'hidden-md-and-down']"
          selected-class="active-tab" show-arrows>
          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" selected-class=""
            @click="handleTabClick(tab.value)">{{ tab.title }}</v-tab>
        </v-tabs>
        <v-select :model-value="tabs[activeTab].title" :items="tabs" item-title="title" item-value="value"
          :class="[darkMode ? 'select-box-dark' : 'select-box-light', 'select-box-detail', 'hidden-lg-and-up']"
          variant="compact" :hide-details="true" density="plain" @update:modelValue="handleTabClick"></v-select>
      </div>
      <div class="mt-1">
        <v-select v-model="seletedDuration" :items="dataPeriod" item-title="label" item-value="value"
          :class="[darkMode ? 'select-box-dark' : 'select-box-light', 'select-box-detail']" variant="compact"
          :hide-details="true" density="plain" @update:modelValue="dateChange"></v-select>
      </div>
    </div>
    <div class="mt-4 mb-10">
      <DetailsTable v-if="activeTab === '0'" :key="seletedDuration" :items="detailsTable" :dark-mode="darkMode"
        class="w-100" />


      <v-row v-if="activeTab === '1'">
        <v-col cols="12" lg="6">

          <div class="d-flex flex-column ga-2 sticky-top">
            <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">Current
              Price
            </div>
            <SharedCalculator :type="'apr'" :darkMode="darkMode" :displayPrice="displayPrice" :token="invertedPrices ?
              poolDetailsPeriods[0].BaseToken :
              poolDetailsPeriods[0].QuoteToken" :quoteToken="poolDetailsPeriods[0].QuoteToken"
              :base-token="poolDetailsPeriods[0].BaseToken" :approx-liquidity="approximateInitialLiquidityUSD"
              :liquidity="liquidityValue" :lowerPercentageRange="lowerPercentageRange" :slider-value="feeSelectedDays"
              :higherPercentageRange="higherPercentageRange" :range-options="[{ id: 1, label: 'Narrow', value: 'aggressive' },
              { id: 2, label: 'Market', value: 'neutral' },
              { id: 3, label: 'Wide Short', value: 'wide-short' }, { id: 3, label: 'Wide Long', value: 'wide-long' }
              ]" :min="myMinRange" :max="myMaxRange" @update-liquidity-value="(val) => liquidityValue = val"
              :cpi="myGMValue" :back-test-results="[{
                id: 1, label: 'Generated Fees (est)',
                isHtml: true,
                value: `<span>${poolDetailsPeriods[0].QuoteToken} ${estimatedFees.toFixed(5)}<br />
              <span style='font-size: 12px'>(Approx. ${approximateFeesUSD})</span></span>`
              },
              { id: 2, label: 'Time In Range', value: inRangePercentaje.toFixed(2) + ' %' },
              { id: 3, label: 'Estimated APR', value: estimatedAPR.toFixed(2) + ' %' }]" :composition-data="[{ id: 1, tokens: Number(xTokens).toFixed(5), tokensPercentage: xPercentage.toFixed(2) },
              { id: 2, tokens: Number(yTokens).toFixed(5), tokensPercentage: yPercentage.toFixed(2) }]"
              @update-slider="(val) => feeSelectedDays = val"
              @handle-prepend-append="(type, state) => type === 'prepend' ? handlePrependInner(state) : handleAppendInner(state)"
              @update-min-range="(val) => { myMinRange = val; }" @update-max-range="(val) => { myMaxRange = val; }"
              @handle-blur="(type) => findClosestTik(type)"
              @initialize-ranges="(calc, type) => initializeRanges(calc, type)"
              @refresh-tokens-distribution="refreshTokensDistribution" @handle-invert-prices="handleInvertPrices"
              @handle-run-back-test="megaTest">
            </SharedCalculator>
          </div>
        </v-col>
        <!-- SplineChart Component for Liquidity Back Test -->
        <v-col cols="12" lg="6">
          <div class="d-flex flex-column ga-5">
            <div class="d-flex flex-column ga-2">
              <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                Liquidity
              </div>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class', '']">
                <div class="pt-4 pb-4 pr-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="liquidityChartRender" :show-exponential-digit="true"
                    :labels="liquididtyChartLabels" :data-values="liquidityDatasets"
                    :options="{ colors: ['#DCC271', darkMode ? '#FFF' : '#0f2357', '#10C461'] }"
                    :axis-titles="{ xaxis: 'Price', yaxis: 'Liquidity' }" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
            </div>
            <div class="d-flex flex-column ga-2">
              <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">Token
                Distribution
              </div>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class', '']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="tokenDistributionChartRender"
                    :axis-titles="{ xaxis: 'Price' }" :show-exponential-digit="true" :zoom="false"
                    :labels="tokenDistributionChartLabels" :options="!testClicked ? {} : {
                      colors: ['#DCC271', darkMode ? '#FFF' : '#0f2357'],
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
                              const val = removeTrailingZeros(value);
                              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
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
                              const val = removeTrailingZeros(value);
                              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
                            },
                          },
                        },
                      ],
                      tooltip: {
                        theme: darkMode ? 'dark' : 'light',
                        fillSeriesColor: false,
                        marker: {
                          show: true,
                        },
                        style: {
                          fontSize: '12px',
                          fontFamily: 'Poppins',
                          fontWeight: '800',
                        },
                        fixed: {
                          enabled: true, // Keep tooltip fixed
                          position: 'topRight',
                          offsetX: -100,
                          offsetY: 0,
                        },
                        y: {
                          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                            const percentage = tokenDistributionDatasets[seriesIndex].percentages[dataPointIndex];
                            const color = w.config.colors[seriesIndex];
                            return `<span style='color: ${color};'>${value}</span><span> (${percentage} %)</span>`;
                          },
                        },
                        x: {
                          formatter: function (num) {
                            const val = Number(num / 1e6);
                            return val;
                          },
                        }
                      },
                    }" :data-values="tokenDistributionDatasets" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
            </div>
            <div class="d-flex flex-column ga-2">
              <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">
                Back Testing Results
              </div>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class', '']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="backTesterChartRender"
                    :axis-types="{ xaxis: 'category' }" :show-exponential-digit="true" :labels="backTesterChartLabels"
                    :data-values="backTesterDatasets"
                    :options="{ colors: ['#DCC271', darkMode ? '#FFF' : '#0f2357', '#10C461'] }" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="activeTab === '2'">
        <v-col cols="12" lg="6">
          <div class="d-flex flex-column ga-2 sticky-top">
            <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">Future
              Price
            </div>
            <SharedCalculator :type="'future'" :darkMode="darkMode" :displayPrice="displayPrice" :price="myFuturePrice"
              :price-percent="futurePercentageRange ?? 0" :token="invertedPrices ?
                poolDetailsPeriods[0].BaseToken :
                poolDetailsPeriods[0].QuoteToken" :quoteToken="poolDetailsPeriods[0].QuoteToken"
              :base-token="poolDetailsPeriods[0].BaseToken" :approx-liquidity="approximateInitialLiquidityUSDFuture"
              :liquidity="myFutureLiquidity" :lowerPercentageRange="lowPercentageRangeFuture"
              :slider-value="feeSelectedDaysFuture" :higherPercentageRange="highPercentageRangeFuture" :range-options="[{ id: 1, label: 'Narrow', value: 'aggressive' },
              { id: 2, label: 'Market', value: 'neutral' },
              ]" :min="myFutureMinRange" :max="myFutureMaxRange"
              @update-liquidity-value="(val) => myFutureLiquidity = val" :cpi="myGMValue" :back-test-results="[{
                id: 1, label: 'Generated Fees (est)',
                isHtml: true,
                value: `<span>${poolDetailsPeriods[0].QuoteToken} ${futureEstimatedFees.toFixed(5)}<br />
              <span style='font-size: 12px'>(Approx. ${approximateFutureFeesUSD})</span></span>`
              },
              { id: 2, label: 'Time In Range', value: futureInRangePercentage.toFixed(2) + ' %' },
              { id: 3, label: 'Estimated APR', value: futureEstimatedAPR.toFixed(2) + ' %' }]" :composition-data="[{ id: 1, tokens: xtokensFuture ?? 0, tokensPercentage: xPercentageFuture.toFixed(2) },
              { id: 2, tokens: ytokensFuture ?? 0, tokensPercentage: yPercentageFuture.toFixed(2) }]"
              @update-slider="(val) => feeSelectedDaysFuture = val" @handle-blur="(type) => { findClosestTik(type) }"
              @handle-prepend-append="(type, state) => type === 'prepend' ? handlePrependInner(state) : handleAppendInner(state)"
              @initialize-ranges="(calc, type) => initializeRanges(calc, type)"
              @handle-invert-prices="handleInvertPrices" @update-price="val => myFuturePrice = val"
              @handle-run-back-test="megaTestFuture">
            </SharedCalculator>
          </div>
        </v-col>



        <v-col cols="12" lg="6">
          <div class="d-flex flex-column ga-5">

            <div class="d-flex flex-column ga-2">
              <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">Future
                Liquidity
              </div>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class', '']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="liquidityChartRenderFuture"
                    :show-exponential-digit="true" :labels="liquididtyChartLabelsFuture"
                    :data-values="liquidityDatasetsFuture" :options="{
                      colors: ['#DCC271', darkMode ? '#FFF' : '#0f2357', '#10C461'],

                    }" :axis-titles="{ xaxis: 'Price', yaxis: 'Liquidity' }" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
            </div>
            <div class="d-flex flex-column ga-2">
              <div class="result-number" :class="[darkMode ? 'result-number-dark' : 'result-number-light']">Future
                Token Distribution
              </div>
              <v-card :class="[darkMode ? 'custom-card-dark-class' : 'custom-card-light-class', '']">
                <div class="pt-4 pb-4">
                  <v-skeleton-loader v-if="loading" :loading="true" class="my-7 mx-2" width="98%" height="100px" />
                  <spline-chart v-else :dark-mode="darkMode" :key="tokenDistributionChartRenderFuture"
                    :axis-titles="{ xaxis: 'Price' }" :show-exponential-digit="true" :zoom="false"
                    :data-values="tokenDistributionDatasetsFuture" :labels="tokenDistributionChartLabelsFuture"
                    :options="!testClickedFuture ? {} : {
                      colors: [darkMode ? '#FFF' : '#0f2357', '#DCC271'],
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
                              const val = removeTrailingZeros(value);
                              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
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
                              const val = removeTrailingZeros(value);
                              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
                            },
                          },
                        },
                      ],
                      tooltip: {
                        theme: darkMode ? 'dark' : 'light',
                        fillSeriesColor: false,
                        marker: {
                          show: true,
                        },
                        style: {
                          fontSize: '12px',
                          fontFamily: 'Poppins',
                          fontWeight: '800',
                        },
                        fixed: {
                          enabled: true, // Keep tooltip fixed
                          position: 'topRight',
                          offsetX: -100,
                          offsetY: 0,
                        },
                        y: {
                          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                            const percentage = tokenDistributionDatasetsFuture[seriesIndex].percentages[dataPointIndex];
                            const color = w.config.colors[seriesIndex];
                            return `<span style='color: ${color};'>${value}</span><span> (${percentage} %)</span>`;
                          },
                        },
                        x: {
                          formatter: function (num) {
                            const val = Number(num / 1e6);
                            return val;
                          },
                        },
                      }
                    }" :map-colors="{
                      stroke: darkMode ? '#DCC271' : '#25356F',
                      gradientToColors: darkMode ? '#DCC271' : '#2C61B0',
                      offset: darkMode ? '#DCC271' : '#2C61B0',
                      offsetColor: darkMode ? 'rgba(0, 0, 0, 0.00) 95.71%)' : 'rgba(183, 201, 228, 0.34)'
                    }" />
                </div>
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { useTheme } from 'vuetify';
import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';
import SplineChart from '@/components/SplineChart.vue';
import DetailsTable from '@/components/DetailsTable.vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/utils/axios';
import {
  getMean, getStandardDeviation, formatNumber, removeTrailingZeros, formatDecimalNumber,
  convertToTimestamp
} from '@/utils/common';
import { formatMoney } from '@/utils/formatMoney.js';
import { DATA_PERIOD_GRAPH } from '@/constant/index.js';
import millify from "millify";
import moment from 'moment';
import SharedCalculator from '@/components/SharedCalculator.vue';
import { useRouter } from 'vue-router';


const theme = useTheme();
const router = useRouter()
const activeTab = ref('0')
const liquidityValue = ref(1000);
const myFutureLiquidity = ref(0);
const seletedDuration = ref('7');
const dataPeriod = DATA_PERIOD_GRAPH;
const tabs = [{
  title: 'All Transactions',
  value: '0'
}, {
  title: 'APR Calculator',
  value: '1'
}, {
  title: 'Redeploy Calculator',
  value: '2'
}];
// Access the current route
const route = useRoute()
// Extract the ID parameter from the route
const id = route.params.id

/** Reactive Properties */
const poolDetailsPeriods = ref([]);
const poolDetailsPrice = ref([]);
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

const currentPriceNativeX = ref([0]);
const myFuturePrice = ref(0);
const myFutureMaxRange = ref([0]);
const myFutureMinRange = ref([0]);
const xtokensFuture = ref(0);
const ytokensFuture = ref(0);
const xPercentageFuture = ref(0)
const yPercentageFuture = ref(0)
const correlationEstimatorState = ref(0)


// New
const backTesterLiquidityArray = ref([]);
const liquidityArray = ref([])
const liquidityArrayFuture = ref([])
const feeSelectedDays = ref(30)
const feeSelectedDaysFuture = ref(30)
const liquidityDatasets = ref([])
const liquididtyChartLabels = ref([])
const liquidityChartRender = ref(0)
const liquidityDatasetsFuture = ref([])
const liquididtyChartLabelsFuture = ref([])
const liquidityChartRenderFuture = ref(0)
const tokenDistributionDatasets = ref([])
const tokenDistributionChartLabels = ref([])
const tokenDistributionChartRender = ref(0)
const tokenDistributionDatasetsFuture = ref([])
const tokenDistributionChartLabelsFuture = ref([])
const tokenDistributionChartRenderFuture = ref(0)
const backTesterDatasets = ref([])
const backTesterChartLabels = ref([])
const backTesterChartRender = ref(0)
const testClicked = ref(false)
const testClickedFuture = ref(false)

const futureInRangePercentage = ref(0)
const futureEstimatedFees = ref(0)
const futureEstimatedAPR = ref(0)
const approximateFeesUSD = computed(() => {
  if (Math.abs(poolDetailsPrice.value.priceNative - poolDetailsPrice.value.priceUsd) / poolDetailsPrice.value.priceUsd < 0.01) {
    return formatMoney(estimatedFees.value);
  }
  else {
    return formatMoney(estimatedFees.value * poolDetailsPrice.value.priceUsd / currentPriceNativeX.value);
  }
})

const highPercentageRangeFuture = computed(() => {
  return -1 * (100 - myFutureMaxRange.value * 100 / myFuturePrice.value);

})
const lowPercentageRangeFuture = computed(() => {
  return -1 * (100 - myFutureMinRange.value * 100 / myFuturePrice.value);
})

const futurePercentageRange = computed(() => {
  return -1 * (100 - myFuturePrice.value * 100 / poolDetailsPrice.value.priceNative);
})

const approximateFutureFeesUSD = computed(() => {
  if (Math.abs(poolDetailsPrice.value.priceNative - poolDetailsPrice.value.priceUsd) / poolDetailsPrice.value.priceUsd < 0.01) {
    return formatMoney(futureEstimatedFees.value);
  }
  else {
    return formatMoney(futureEstimatedFees.value * poolDetailsPrice.value.priceUsd / currentPriceNativeX.value);
  }

})


const tokenDetails = computed(() => {
  return [
    {
      id: 1,
      label: 'Base Token',
      value: poolDetailsPeriods.value.length ? poolDetailsPeriods.value[0]?.BaseToken : ''
    },
    {
      id: 2,
      label: 'Quote Token',
      value: poolDetailsPeriods.value.length ? poolDetailsPeriods.value[0]?.QuoteToken : ''
    },
    {
      id: 3,
      label: 'Fee Tier(%)',
      value: poolDetailsPeriods.value.length ? (poolDetailsPeriods.value[0].feeTier / 10000) : ''
    },
    {
      id: 4,
      label: 'Chain',
      value: poolDetailsPeriods.value.length > 0 ? poolDetailsPeriods.value[0]?.ChainId : '',
      hasImage: true,
      imgCondition: poolDetailsPeriods.value.length > 0 && poolDetailsPeriods.value[0]?.ChainId,
      img: chainIcon(poolDetailsPeriods.value[0]?.ChainId)
    },
    {
      id: 5,
      label: 'Protocol',
      value: poolDetailsPeriods.value.length > 0 ? poolDetailsPeriods.value[0]?.DexId : '',
      hasImage: true,
      imgCondition: poolDetailsPeriods.value.length > 0 && poolDetailsPeriods.value[0].DexId,
      img: protocolIcon(poolDetailsPeriods.value[0]?.DexId)
    },
    {
      id: 6,
      label: 'Price (USD)',
      value: poolDetailsPrice.value.priceUsd ? poolDetailsPrice.value.priceUsd : ''
    },
    {
      id: 7,
      label: 'Price (Quote)',
      value: poolDetailsPeriods.value.length ? currentPriceNativeX.value : ''
    }
  ]
})
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
      minPrice = Number.parseFloat(element.priceNative);
      maxPrice = Number.parseFloat(element.priceNative);
    }
    else {
      if (Number.parseFloat(element.priceNative) < minPrice) {
        minPrice = Number.parseFloat(element.priceNative);
      }
      if (Number.parseFloat(element.priceNative) > maxPrice) {
        maxPrice = Number.parseFloat(element.priceNative);
      }
    }

    weeklyAvgLiquidity.value += element.Liquidity;
    weeklyVolume.value += element.Volume / 3;
    weeklyFees.value += element.fees / 3;
    if (typeof (element.priceNative) !== "undefined" &&
      Number.parseFloat(element.priceNative) > 0) {
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
  weeklyAvgAPR.value = 3 * ((weeklyVolume.value * poolDetailsPeriods.value[0].feeTier * 365) / (10000 * weeklyAvgLiquidity.value));
  weeklyAvgLiquidity.value /= counter;
  absoluteVolatility.value = (100 * maxPrice / minPrice) - 100;
  mySigma.value = standardDev = getStandardDeviation(nativePriceArray);
  myMeanPrice.value = meanValue = getMean(nativePriceArray);
  weeklyVolatility.value = meanValue !== 0 ? ((standardDev * 100) / meanValue) : "N/A";
  initializeRanges('current', 'neutral')
  correlationEstimator(poolDetailsPeriods.value.slice(0, seletedDuration.value * 3), seletedDuration.value).then((res) => {
    correlationEstimatorState.value = res;
  })
};
const correlationEstimator = async (data, days) => {
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
  // const correlation = numerator / Math.sqrt(denominatorToken1 * denominatorToken2);
  // return correlation;

  const correlation = numerator / Math.sqrt(denominatorToken1 * denominatorToken2);
  return Math.abs(correlation) * 100;  // Convert correlation to percentage

};

const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get(`api/pooldata/${id}`);
    poolDetailsPeriods.value = data.output.periodData;
    poolDetailsPrice.value = data.output.price;
    correlationEstimatorState.value = await correlationEstimator(poolDetailsPeriods.value.slice(0, seletedDuration.value * 3), seletedDuration.value);
    currentPriceNativeX.value = data.output.price.priceNative
    myFuturePrice.value = data.output.price.priceNative;
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

const initializeRanges = (which, mode) => {
  let highMultiplier = 0;
  let lowMultiplier = 0;
  if (which === 'current') {
    switch (mode) {
      case 'aggressive':
        if (Number.parseFloat(weeklyVolatility.value) * 1.5 > 75) {
          lowMultiplier = 75;
        }
        else {
          lowMultiplier = Number.parseFloat(weeklyVolatility.value) * 1.5;
        }
        myMinRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 - (lowMultiplier / 100)));
        myMaxRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 + (Number.parseFloat(weeklyVolatility.value) * 1.5 / 100)));
        break;
      case 'neutral':
        if (Number.parseFloat(weeklyVolatility.value) * 3 > 75) {
          lowMultiplier = 75;
        }
        else {
          lowMultiplier = Number.parseFloat(weeklyVolatility.value) * 3;
        }
        myMinRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 - (lowMultiplier / 100)));
        myMaxRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 + (Number.parseFloat(weeklyVolatility.value) * 3 / 100)));
        break;
      case 'wide-short':
        if (Number.parseFloat(weeklyVolatility.value) * 6 > 75) {
          lowMultiplier = 75;
        }
        else {
          lowMultiplier = Number.parseFloat(weeklyVolatility.value) * 6;
        }
        myMinRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 - (lowMultiplier / 100)));
        myMaxRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 + (Number.parseFloat(weeklyVolatility.value) * 1.5 / 100)));
        break;
      case 'wide-long':
        if (Number.parseFloat(weeklyVolatility.value) * 1.5 > 75) {
          lowMultiplier = 75;
        }
        else {
          lowMultiplier = Number.parseFloat(weeklyVolatility.value) * 1.5;
        }
        myMinRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 - (lowMultiplier / 100)));
        myMaxRange.value = formatNumber(Number.parseFloat(currentPriceNativeX.value) * (1 + (Number.parseFloat(weeklyVolatility.value) * 6 / 100)));
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

    if (invertedPrices.value) {
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
        const liqObjFuture = calculateAssetBalances(Number.parseFloat(myFutureMinRange.value), Number.parseFloat(myFutureMaxRange.value),
          Number.parseFloat(myFuturePrice.value), Number.parseFloat(myFuturePrice.value), true);
        xtokensFuture.value = Number.parseFloat(liqObjFuture.xQty);
        ytokensFuture.value = Number.parseFloat(liqObjFuture.yQty);
        xPercentageFuture.value = Number.parseFloat(liqObjFuture.XPct);
        yPercentageFuture.value = Number.parseFloat(liqObjFuture.YPct);
      }
      resolve();
    });

    Promise.all([promise1, promise2, promise3]).then(() => {
      console.log('Promise all resolved for future range');
    });
  }
};

function findClosestTik(which) {

  let price = 0;
  switch (which) {
    case 'min':
      price = myMinRange.value;
      break;

    case 'max':
      price = myMaxRange.value;
      break;

    case 'future':
      price = myFuturePrice.value;
      break;

    case 'minFuture':
      price = myFutureMinRange.value;
      break;

    case 'maxFuture':
      price = myFutureMaxRange.value;
      break;
  }

  let pe = (Math.log(price) / Math.log(tikFactor.value)) / myFeeDelta.value;
  let closestTik = Math.round(pe);


  switch (which) {
    case 'min':
      price = myMinRange.value;
      myMinRange.value = formatNumber(setPriceFromtik(closestTik));
      break;

    case 'max':
      myMaxRange.value = formatNumber(setPriceFromtik(closestTik));
      break;

    case 'future':
      myFuturePrice.value = formatNumber(setPriceFromtik(closestTik));
      break;

    case 'minFuture':
      myFutureMinRange.value = formatNumber(setPriceFromtik(closestTik));
      break;

    case 'maxFuture':
      myFutureMaxRange.value = formatNumber(setPriceFromtik(closestTik));
      break;
  }

  return closestTik;

}

const handleNavigate = () => {
  router.back();
}


const setPriceFromtik = (tikNumber) => Math.pow(tikFactor.value, myFeeDelta.value * tikNumber);

const handleInvertPrices = () => {
  invertedPrices.value = !invertedPrices.value;
  [myMinRange.value, myMaxRange.value] = [1 / myMaxRange.value, 1 / myMinRange.value];
  if (myFutureMinRange.value != 0) {
    const aux1 = myFutureMinRange.value;
    const aux2 = myFutureMaxRange.value;
    myFutureMaxRange.value = formatNumber(1 / aux1);
    myFutureMinRange.value = formatNumber(1 / aux2);

  }
  myFuturePrice.value = formatNumber(1 / myFuturePrice.value);
  poolDetailsPrice.value.priceNative = 1 / poolDetailsPrice.value.priceNative;

};

const handleTabClick = (value) => {
  activeTab.value = value
  tokenDistributionChartRender.value++
  tokenDistributionChartRenderFuture.value++
  if (invertedPrices.value) {
    handleInvertPrices()
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
  else if (which === 'future') {
    myFuturePrice.value = formatNumber(setPriceFromtik(currentTik));
  }
  else {
    myMaxRange.value = formatNumber(setPriceFromtik(currentTik));
  }

  let liqObjCurrent = calculateAssetBalances(myMinRange.value, myMaxRange.value, poolDetailsPrice.value.priceNative,
    poolDetailsPrice.value.priceNative, true);

  let liqObjCurrentAtFuturePrice = calculateAssetBalances(myMinRange.value, myMaxRange.value, poolDetailsPrice.value.priceNative,
    myFuturePrice.value, true);

  let liqObjFuture = calculateAssetBalances(myFutureMinRange.value, myFutureMaxRange.value, poolDetailsPrice.value.priceNative,
    myFuturePrice.value, true);

  if (myFutureLiquidity.value === 0) {
    myFutureLiquidity.value = liqObjCurrentAtFuturePrice.Liquidity;
  }

  xTokens.value = Number.parseFloat(liqObjCurrent.xQty); //* myLiquidity/1000;
  yTokens.value = Number.parseFloat(liqObjCurrent.yQty); // * myLiquidity/1000;

  xPercentage.value = Number.parseFloat(liqObjCurrent.XPct);
  yPercentage.value = Number.parseFloat(liqObjCurrent.YPct);

  xtokensFuture.value = Number.parseFloat(liqObjFuture.xQty);
  ytokensFuture.value = Number.parseFloat(liqObjFuture.yQty);

  xPercentageFuture.value = Number.parseFloat(liqObjFuture.XPct);
  yPercentageFuture.value = Number.parseFloat(liqObjFuture.YPct);
}

const refreshTokensDistribution = () => {
  let liqObjCurrent = calculateAssetBalances(myMinRange.value, myMaxRange.value, poolDetailsPrice.value.priceNative, poolDetailsPrice.value.priceNative, true);

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
    actualMinRange = Number.parseFloat(myMinRange.value);
    actualMaxRange = Number.parseFloat(myMaxRange.value);
    if (invertedPrices.value) {
      actualMinRange = Number.parseFloat(1 / myMaxRange.value);
      actualMaxRange = Number.parseFloat(1 / myMinRange.value);
    }
  } else if (which === 'future') {
    actualMinRange = Number.parseFloat(myFutureMinRange.value);
    actualMaxRange = Number.parseFloat(myFutureMaxRange.value);
    if (invertedPrices.value) {
      actualMinRange = Number.parseFloat(1 / myFutureMaxRange.value);
      actualMaxRange = Number.parseFloat(1 / myFutureMinRange.value);
    }
  }

  if (actualMaxRange < actualMinRange) {
    console.log(`Max range is less than min range`);
    alert(`Max range is less than min range`);
    return;
  }
  // let stdDevs = Number.parseFloat(actualMaxRange - actualMinRange) / Number.parseFloat(mySigma.value);
  let FeesWeight = 1;

  let r = Math.sqrt(actualMaxRange / actualMinRange);

  let factor = r - 1;

  FeesWeight = 3.3 / (factor * 100 / weeklyVolatility.value);

  // New code
  const reversedArray = filteredPoolDetailsBasedOnPeriod.value.slice().reverse();
  const initialPrice = reversedArray[0].priceNative;
  // Initial tokens (for hold 50/50)
  let xHold = Number.parseFloat(500 / initialPrice);
  let yHold = 500;
  // let lHold = xHold * initialPrice + yHold;
  // Let's clean the Back Tester liquidity array
  backTesterLiquidityArray.value.length = 0;
  xHold = xHold * liquidityValue.value / 1000;
  yHold = yHold * liquidityValue.value / 1000;

  reversedArray.forEach(element => {
    totalPeriods++;
    // Let's get the calculated liquidity value at this point
    let liqObject = calculateAssetBalances(actualMinRange, actualMaxRange, initialPrice, Number.parseFloat(element.priceNative), true, which);

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
  }
  else {
    futureInRangePercentage.value = inRangePeriods * 100 / totalPeriods;
    futureEstimatedFees.value = totalFees;
    futureEstimatedAPR.value = futureEstimatedFees.value * 100 * (365 / (totalPeriods / 3)) * (1 / liquidityValue.value);
    showLiquidityChart('future');
    showTokensDistributionChart('future');

  }
};
const megaTest = () => {
  backTester('current');
  testClicked.value = true
  calculateAssetBalances(Number.parseFloat(myMinRange.value), Number.parseFloat(myMaxRange.value), Number.parseFloat(poolDetailsPrice.value.priceNative));
}

const megaTestFuture = () => {
  backTester('future');
  testClickedFuture.value = true
  calculateAssetBalances(Number.parseFloat(myFutureMinRange.value), Number.parseFloat(myFutureMaxRange.value),
    Number.parseFloat(myFuturePrice.value), 0, false, 'future');

}

const calculateAssetBalances = (a, b, p0, pTarget = 0, single = false, which = 'current') => {

  if (b < a) {
    console.log(`Selected range is not valid - Error: b=${b} is less than a=${a}`);
    return;
  }

  let actualLiquidity = 0;

  if (which === 'current') {
    actualLiquidity = liquidityValue.value;
  } else {
    actualLiquidity = myFutureLiquidity.value;
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
    let sp = Math.sqrt(p);
    let sa = Math.sqrt(a);
    let sb = Math.sqrt(b);
    let sp1 = Math.sqrt(p0);
    let L = get_liquidity(x, y, sp, sa, sb);

    let x1 = calculate_x(L, sp1, sa, sb);
    let y1 = calculate_y(L, sp1, sa, sb);
    let p1 = p0;
    let LatP1 = x1 * p1 + y1;
    // Let's get the percentage of x1 and y1 with respect to the total liquidity
    let xPercentage = 100 * x1 * p1 / LatP1;
    let yPercentage = 100 - xPercentage;
    x0Pct = xPercentage;
    y0Pct = yPercentage;
    let yy1 = yPercentage * 1000 / 100;
    let xx1 = (1000 - yy1) / p1;
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
  let sp = Math.sqrt(p);
  let sa = Math.sqrt(a);
  let sb = Math.sqrt(b);

  // Calculate initial liquidity
  let L = get_liquidity(x, y, sp, sa, sb);
  xHold = xHold * actualLiquidity / 1000;
  yHold = yHold * actualLiquidity / 1000;

  xHoldInitial = xHoldInitial * actualLiquidity / 1000;
  yHoldInitial = yHoldInitial * actualLiquidity / 1000;

  // Draw the liquidity
  if (!single) {

    // Let/s divide the value of L by 1000

    if (which !== 'current') {
      liquidityArrayFuture.value.length = 0;
    } else {
      liquidityArray.value.length = 0;
    }

    // Iterate over range similar to Python's range(3000, 4200, 25)
    for (let p1 = a * 0.75; p1 < b * 1.25; p1 += (b - a) / 50) {
      let sp1 = Math.sqrt(p1);

      let x1 = calculate_x(L, sp1, sa, sb);
      let y1 = calculate_y(L, sp1, sa, sb);
      // Let's get the actual x1 and y1 values
      // related to myLiquidty

      x1 = x1 * actualLiquidity / 1000;
      y1 = y1 * actualLiquidity / 1000;

      let LatP1 = x1 * p1 + y1;
      // Let's get the percentage of x1 and y1 with respect to the total liquidity
      let xPercentage = 100 * x1 * p1 / LatP1;
      let yPercentage = 100 - xPercentage;
      let LiquidityHold = xHold * p1 + yHold;
      let LiquidityHoldInitial = xHoldInitial * p1 + yHoldInitial;

      let atPeriodFee = 0;

      if (which === 'current') {
        if (estimatedAPR.value > 0 && feeSelectedDays.value > 0) {
          atPeriodFee = actualLiquidity * Number(feeSelectedDays.value) * Number.parseFloat(estimatedAPR.value) / (100 * 365);

        } else {
          atPeriodFee = 0;
        }
      }
      else {
        if (futureEstimatedAPR.value > 0 && feeSelectedDaysFuture.value > 0) {
          atPeriodFee = actualLiquidity * Number(feeSelectedDaysFuture.value) * Number.parseFloat(futureEstimatedAPR.value) / (100 * 365);

        } else {
          atPeriodFee = 0;
        }
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

      if (which !== 'current') {
        liquidityArrayFuture.value.push(element);
      } else {
        liquidityArray.value.push(element);
      }

    }

    showLiquidityChart(which);
    showTokensDistributionChart(which);
  } else {
    // We are only interested in a single point
    let p1 = pTarget;
    let sp1 = Math.sqrt(pTarget);

    let x1 = calculate_x(L, sp1, sa, sb);
    let y1 = calculate_y(L, sp1, sa, sb);

    x1 = x1 * actualLiquidity / 1000;
    y1 = y1 * actualLiquidity / 1000;
    let LatP1 = x1 * p1 + y1;
    // Let's get the percentage of x1 and y1 with respect to the total liquidity
    let xPercentage = 100 * x1 * p1 / LatP1;
    let yPercentage = 100 - xPercentage;
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

const showLiquidityChart = (type = 'current') => {
  let chartLabels = [];
  let chartDataPricesUSD = [];
  let chartHoldLiquidity = [];
  let chartHoldLiquidityInitial = [];
  let chartLiquidityFees = [];
  let ix = 0;
  const array = type === 'current' ? liquidityArray.value : liquidityArrayFuture.value
  array.forEach((element) => {
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
  if (type === 'current') {
    liquidityDatasets.value = [
      {
        name: 'Pool Liquidity',
        data: chartDataPricesUSD
      },
      {
        name: 'Hold Liquidity',
        data: chartHoldLiquidityInitial,
      },
      {
        name: 'Pool + Fees',
        data: chartLiquidityFees,
      }
    ]

    liquididtyChartLabels.value = chartLabels
    liquidityChartRender.value++
  }
  else {
    liquidityDatasetsFuture.value = [
      {
        name: 'Pool Liquidity',
        data: chartDataPricesUSD
      },
      {
        name: 'Hold Liquidity',
        data: chartHoldLiquidityInitial,
      },
      {
        name: 'Pool + Fees',
        data: chartLiquidityFees,
      }
    ]

    liquididtyChartLabelsFuture.value = chartLabels
    liquidityChartRenderFuture.value++
  }

}

const showTokensDistributionChart = (type = 'current') => {
  let chartLabels = [];
  let chartTokenX = [];
  let chartTokenY = [];
  let chartTokenXQty = [];
  let chartTokenYQty = [];

  let ix = 0;
  const array = type === 'current' ? liquidityArray.value : liquidityArrayFuture.value
  array.forEach(element => {
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

  if (type === 'current') {
    tokenDistributionDatasets.value = [
      {
        name: `${poolDetailsPeriods.value[0].BaseToken} Qty`,
        data: chartTokenXQty,
        percentages: chartTokenX,
        pointStyle: false,
        borderWidth: 1,
        yAxisID: 'y1' // This dataset will use the quantity y-axis
      },
      {
        name: `${poolDetailsPeriods.value[0].QuoteToken} Qty`,
        data: chartTokenYQty,
        percentages: chartTokenY,
        pointStyle: false,
        borderWidth: 1,
        yAxisID: 'y2' // This dataset will use the quantity y-axis
      },
    ]

    tokenDistributionChartLabels.value = chartLabels
    tokenDistributionChartRender.value++
  }
  else {
    tokenDistributionDatasetsFuture.value = [
      {
        name: `${poolDetailsPeriods.value[0].BaseToken} Qty`,
        data: chartTokenXQty,
        percentages: chartTokenX,
        pointStyle: false,
        borderWidth: 1,
        yAxisID: 'y1' // This dataset will use the quantity y-axis
      },
      {
        name: `${poolDetailsPeriods.value[0].QuoteToken} Qty`,
        data: chartTokenYQty,
        percentages: chartTokenY,
        pointStyle: false,
        borderWidth: 1,
        yAxisID: 'y2' // This dataset will use the quantity y-axis
      },
    ]

    tokenDistributionChartLabelsFuture.value = chartLabels
    tokenDistributionChartRenderFuture.value++
  }
}

const showBackTestChart = () => {
  // Bar chart with liquidity and volume
  let chartLabels = [];
  let dailyLiquidity = [];
  let totalLiquidity = [];
  let holdLiquidityData = [];
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
    name: 'Hold',
    data: holdLiquidityData
  },
  {
    name: 'Pool + Fees',
    data: totalLiquidity
  },
  ]

  backTesterChartLabels.value = chartLabels
  backTesterChartRender.value++
}


/** Computed */

const filteredPoolDetailsBasedOnPeriod = computed(() => {
  const filterRecords = [...poolDetailsPeriods.value];
  return filterRecords.slice(0, parseInt(seletedDuration.value) * 3);
})

const darkMode = computed(() => {
  return theme.global.current.value.dark;
});

watch(darkMode, (next, prev) => {
  if (next !== prev) {
    liquidityChartRender.value++;
    tokenDistributionChartRender.value++
    backTesterChartRender.value++;
  }
})

const detailsTable = computed(() => {

  return filteredPoolDetailsBasedOnPeriod.value.map((poolDetailItem) => {
    return {
      date: moment(convertToTimestamp(poolDetailItem.dateTime)).format('lll'),
      apr: `${poolDetailItem.apr.toFixed(2) != null ? parseFloat(poolDetailItem.apr).toFixed(2) : 0.00} %`,
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
        // const day = element.dateTime.slice(6, 8);
        // const month = element.dateTime.slice(4, 6);
        const date = new Date(convertToTimestamp(element.dateTime));
        const isoDate = date.toISOString();
        chartLabels.push(isoDate);
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
        const date = new Date(convertToTimestamp(element.dateTime));
        const isoDate = date.toISOString();
        chartLabels.push(isoDate);
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
        const date = new Date(convertToTimestamp(element.dateTime));
        const isoDate = date.toISOString();
        chartLabels.push(isoDate);
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
        const date = new Date(convertToTimestamp(element.dateTime));
        const isoDate = date.toISOString();
        chartLabels.push(isoDate);
        chartDataAPR.push(element.apr);
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
        const date = new Date(convertToTimestamp(element.dateTime));
        const isoDate = date.toISOString();
        chartLabels.push(isoDate);
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

const myGMValueFuture = computed(() => {
  let gmValue = Math.sqrt(myFutureMinRange.value * myFutureMaxRange.value);
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

const approximateInitialLiquidityUSDFuture = computed(() => {
  if (Math.abs(poolDetailsPrice.value.priceNative - poolDetailsPrice.value.priceUsd) / poolDetailsPrice.value.priceUsd < 0.01) {
    return formatMoney(myFutureLiquidity.value);
  }
  else {
    return formatMoney(myFutureLiquidity.value * poolDetailsPrice.value.priceUsd / currentPriceNativeX.value);
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
.container-item-mobile {
  display: flex !important;
}

@media (max-width: 1024px) {
  .container-item-mobile {
    width: calc(50% - 10px);
    display: flex !important;
    flex: 0 0 calc(50% - 10px);
    box-sizing: border-box;
    padding: 10px;
    word-wrap: break-word;
  }

  .container-item-text-mobile {
    font-size: 18px !important;
  }

  .container-item-img-mobile {
    height: 20px !important;
    width: 20px !important
  }
}


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
  /* width: 250px !important; */
  border-radius: 10px;
  margin-top: -0.5rem;
}

.text-field-width-future {
  width: 200px !important;
  border-radius: 10px;
  margin-top: -0.5rem;
}

.text-field-dark {
  border: 1px solid rgba(255, 255, 255, 0.17);
  background: #0F0F1B;
}

.text-field-dark.disabled {
  border: 1px solid rgba(255, 255, 255, 0.17);
  background: #1B1F32;
  color: #98A2B3
}

.text-field-light {
  border: 1px solid var(--Gray-200, #EAECF0);
  background: var(--Gray-25, #FCFCFD);
}

.text-field-light.disabled {
  border: 1px solid var(--Gray-200, #EAECF0);
  background: var(--Gray-100, #efefef);
  color: #98A2B3
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
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
}

.composition-val-font {
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

.result-text-small {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

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
  font-size: 15px;
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


.custom-card-light-class {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.17);
  background: #FFF;
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
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
  font-size: 15px;
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
  color: #000000;
  font-family: Poppins;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;

}

.custom-slider::v-deep .v-input__details {
  display: none !important;
}

::v-deep .v-field__append-inner {
  cursor: pointer;
}

.custom-textfield-padding-append-icon::v-deep .v-field__append-inner {
  padding-top: 10px !important;
}

/* .custom-textfield-padding::v-deep .v-field__prepend-inner {
  padding-top: 12px !important;
} */

/* .custom-textfield-padding ::v-deep .v-field__input {
  padding-top: 12px !important
} */

::v-deep .v-field__prepend-inner {
  cursor: pointer;
}

::v-deep .v-input--density-default {
  padding-top: 0px !important;
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

.chip-width {
  width: 100% !important;
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
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  margin-top: -0.1rem;
}

.heading-key {
  font-family: Poppins;
  font-size: 15px;
  font-weight: 500;
  line-height: 22.5px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

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

.text-field-width-future :deep(.v-field--no-label) {
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

.text-field-width-future ::v-deep .v-field__append-inner {
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

::v-deep(.v-slider-track__background--opacity) {
  opacity: 1 !important;
}



.calculator-label {
  font-family: Poppins;
  font-size: 15px;
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
  color: #000000;
  font-family: Poppins;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
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
    top: 10px;
  }
}
</style>
