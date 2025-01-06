<template>
  <v-card class="d-flex flex-column " :class="[props.darkMode ? 'calculator-ui-dark' : 'calculator-ui']">
    <div class="d-flex justify-space-between">
      <div class="d-flex flex-column mr-6">
        <div class="calc-other-text" :class="[props.darkMode ? 'calc-other-text-dark' : 'calc-other-text-light']">
          Current Price:</div>
        <div class="highlight">{{ props.displayPrice }} {{ props.token }}</div>
      </div>

      <!-- Invert Price -->
      <div class="action">
        <v-btn class="text-none" :class="[props.darkMode ? 'round-button-dark' : 'round-button-light']" min-width="92"
          variant="outlined" rounded @click="emit('handleInvertPrices')">
          <span class="mt-2 mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
              v-if="!props.darkMode">
              <path
                d="M10.0001 17.0833C13.9121 17.0833 17.0834 13.912 17.0834 10C17.0834 7.6454 15.9345 5.55912 14.1667 4.27118M10.8334 18.6667L9.16675 17L10.8334 15.3333M10.0001 2.91668C6.08806 2.91668 2.91675 6.08799 2.91675 10C2.91675 12.3546 4.06564 14.4409 5.83341 15.7288M9.16675 4.66668L10.8334 3.00001L9.16675 1.33334"
                stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" v-else>
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
      <v-row>
        <v-col cols="12" lg="7">
          <div class="d-flex flex-row mr-6 align-center ga-2 w-100">
            <div class="d-flex">
              <span class="calculator-label" :class="[props.darkMode ? 'label-dark' : 'label-light']">Supply:
              </span> &nbsp; <span class="highlight ml-1">{{ props.quoteToken }}</span>
            </div>
            <div class="w-100">
              <v-text-field v-model="liquidityValue" class="text-field-width"
                :class="[props.darkMode ? 'text-field-dark' : 'text-field-light']" type="input" :hide-details="true"
                density="compact" variant="plain" @change="props.type === 'apr' ? emit('refreshTokensDistribution') : ''">

              </v-text-field>
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="5">
          <div class="d-flex flex-row align-items-center">
            <div class="heading-key" :class="[props.darkMode ? 'result-number-dark' : 'result-number-light']">
              Approx: <span class="result-text-right">{{
                props.approxLiquidity }}</span></div>

          </div>
        </v-col>
      </v-row>
    </div>


    <div class="d-flex">
      <v-row>

        <v-col v-if="props.type === 'future'" :lg="props.type === 'apr' ? 6 : 4" cols="12">
          <div class="d-flex flex-column flex-gap" style="flex: 1;">
            <div class="d-flex flex-column mr-6 ga-3 w-100">
              <div class="label-height">
                <label class="calculator-label">Price: </label>
                <span class="highlight ml-1">{{ props.pricePercent.toFixed(2) + '%' }}</span>
              </div>
              <v-text-field v-model="myFuturePrice" class="text-field-width custom-textfield-padding-append-icon"
                :class="[props.darkMode ? 'text-field-dark' : 'text-field-light']" type="input" variant="plain"
                density="compact" :hide-details="true" prepend-inner-icon="mdi-minus" append-inner-icon="mdi-plus"
                @click:prepend-inner="emit('handlePrependAppend', 'prepend', 'future')"
                @click:append-inner="emit('handlePrependAppend', 'append', 'future')"></v-text-field>
            </div>
          </div>
        </v-col>

        <!-- Min Value Input -->
        <v-col cols="12" :lg="props.type === 'apr' ? 6 : 4">
          <div class="d-flex flex-column flex-gap" style="flex: 1;">
            <div class="d-flex flex-column mr-6 ga-3 w-100">
              <div class="label-height">
                <label class="calculator-label">Min Value: </label>
                <span class="highlight ml-1">{{ props.lowerPercentageRange.toFixed(2) + '%' }}</span>
              </div>
              <v-text-field v-model="myMinRange" class="text-field-width custom-textfield-padding-append-icon"
                :class="{ 'text-field-dark': props.darkMode, 'text-field-light': !props.darkMode, disabled: props.type === 'future' }"
                type="input" variant="plain" density="compact" :hide-details="true"
                :readonly="props.type === 'future' ? true : false"
                :prepend-inner-icon="props.type === 'future' ? '' : 'mdi-minus'"
                :append-inner-icon="props.type === 'future' ? '' : 'mdi-plus'"
                @click:prepend-inner="emit('handlePrependAppend', 'prepend', 'min')"
                @click:append-inner="emit('handlePrependAppend', 'append', 'min')"></v-text-field>
            </div>
          </div>
        </v-col>

        <!-- Max Value Input -->
        <v-col cols="12" :lg="props.type === 'apr' ? 6 : 4">
          <div class="d-flex flex-column flex-gap" style="flex: 1;">
            <div class="d-flex flex-column ga-3 w-100">
              <div class="label-height">
                <label class="calculator-label">Max Value: </label>
                <span class="highlight ml-1">{{ props.higherPercentageRange.toFixed(2) + '%' }}</span>
              </div>
              <v-text-field v-model="myMaxRange" class="text-field-width custom-textfield-padding-append-icon"
                :class="{ 'text-field-dark': props.darkMode, 'text-field-light': !props.darkMode, disabled: props.type === 'future' }"
                type="input" :hide-details="true" density="compact" variant="plain"
                :prepend-inner-icon="props.type === 'future' ? '' : 'mdi-minus'"
                :append-inner-icon="props.type === 'future' ? '' : 'mdi-plus'"
                @click:prepend-inner="emit('handlePrependAppend', 'prepend', 'max')"
                @click:append-inner="emit('handlePrependAppend', 'append', 'max')"></v-text-field>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="d-flex flex-column">
      <v-row>
        <!-- First Column -->
        <v-col cols="12" lg="6">
          <div class="d-flex ga-3 flex-column">
            <div class="d-flex flex-column mr-2">
              <div class="calc-other-text">Capital Protection Indicator</div>
              <v-chip :class="[props.darkMode ? 'chip-gmvalue-dark' : 'chip-gmvalue']" variant="flat">{{
                props.cpi
              }}</v-chip>
            </div>

            <!-- Narror & Wide Range -->
            <div class="d-flex flex-wrap justify-content-between mt-4" style="width: 280px;">
              <div class="d-flex ga-2" style="flex-wrap: wrap;">
                <v-btn v-for="item in rangeOptions" :key="item.id" class="text-none mr-2"
                  :class="[props.darkMode ? 'round-button-dark' : 'round-button-light']" min-width="124"
                  variant="outlined" rounded
                  @click="emit('initializeRanges', props.type === 'apr' ? 'current' : 'future', item.value)">
                  {{ item.label }}
                </v-btn>
              </div>
            </div>
          </div>

        </v-col>

        <!-- Second Column capital & composition -->
        <v-col cols="12" lg="6">
          <div class="calc-other-text">Composition</div>
          <v-card class="pa-5 mb-4 " elevation="0" :class="[props.darkMode ? 'result-card-dark' : 'result-card-light']">
            <div class="d-flex flex-column ga-6">
              <div v-for="(item, index) in composition" :key="item.id" class="d-flex flex-column">
                <div class="d-flex">
                  <span :class="[props.darkMode ? 'calc-token-dark' : 'calc-token-light']" class="calc-token">{{
                    index===0?props.baseToken: props.quoteToken }}: </span>
                  <span class="highlight ml-1 composition-val-font"> {{ item.tokensPercentage }} %</span>
                </div>
                <div class="composition-token">{{ item.tokens }} tokens</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Run Test -->
    <v-row class="">
      <!-- First Column: Range Slider and Text Below -->
      <v-col cols="12" lg="6">

        <!-- Range Slider -->
        <div class="d-flex flex-column justify-center">
          <v-slider v-model="feeSelectedDays" :step="1" :min="0" :max="365" color="#BFAC62" track-color="#eee"
            class="w-50 custom-slider ml-7"></v-slider>
          <!-- <input type="range" v-model="feeSelectedDays" :min="0" :max="360" :step="30"> -->
          <div class="calc-other-text mt-2">Days to include for fees: <span class="highlight">{{
            feeSelectedDays
          }}</span></div>
        </div>
      </v-col>

      <!-- Second Column: Run Back Test Button -->
      <v-col cols="12" lg="6" class="d-flex justify-end">
        <v-btn class="text-none ml-4 run-text" color="medium-emphasis" min-width="92" rounded
          @click="emit('handleRunBackTest', 'current')">
          Run Back Test
          <v-icon class="ml-2 gap-cls">mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <hr class="mx-6" style="border: 1px solid rgba(178, 178, 178, 0.7)">
    <div class="d-flex flex-column ga-3">
      <div class="text-left result-text-small" :class="[props.darkMode ? 'result-text-dark' : 'result-text-light']">
        Back Test Results
      </div>

      <!-- Bottom Box -->
      <div class="d-flex flex-column">
        <v-card class="pa-5 mb-4 " elevation="0" :class="[props.darkMode ? 'result-card-dark' : 'result-card-light']">
          <v-row cols="3">
            <v-col v-for="item in results" :key="item.id">
              <div>
                <div class="result-text-right">{{ item.label }}</div>
                <div class="result-number" :class="[props.darkMode ? 'result-number-dark' : 'result-number-light']">
                  <div v-if="item.isHtml" v-html="item.value"></div>
                  <span v-else>{{ item.value }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';


const props = defineProps(['type', 'darkMode', 'displayPrice', 'token', 'quoteToken', 'baseToken', 'liquidity', 'approxLiquidity',
  'lowerPercentageRange', 'higherPercentageRange', 'min', 'max', 'cpi', 'rangeOptions', 'backTestResults', 'sliderValue',
  'compositionData', 'price', 'pricePercent'
])

const emit = defineEmits(['handleInvertPrices', 'refreshTokensDistribution', 'updateLiquidityValue',
  'handlePrependAppend', 'initializeRanges', 'handleRunBackTest', 'updateSlider', 'updatePrice'])

const liquidityValue = ref(props.liquidity);
const myMinRange = ref(props.min);
const myMaxRange = ref(props.max);
const myFuturePrice = ref(props.price);
const results = ref(props.backTestResults);
const feeSelectedDays = ref(props.sliderValue)
const composition = ref(props.compositionData)


watch(
  () => props.price,
  (newValue) => {
    myFuturePrice.value = newValue;
  }
);
watch(
  () => props.min,
  (newValue) => {
    myMinRange.value = newValue;
  }
);
watch(
  () => props.max,
  (newValue) => {
    myMaxRange.value = newValue;
  }
);
watch(
  () => props.sliderValue,
  (newValue) => {
    feeSelectedDays.value = newValue;
  }
);
watch(
  () => props.liquidity,
  (newValue) => {
    liquidityValue.value = newValue;
  }
);

watch(
  () => props.backTestResults,
  (newVal) => {
    results.value = newVal
  },
  { deep: true }
);

watch(
  () => props.compositionData,
  (newVal) => {
    composition.value = newVal
  },
  { deep: true }
);

watch(liquidityValue, (nextState, prevState) => {
  if (nextState !== prevState) {
    emit('updateLiquidityValue', nextState)
  }
})

watch(myMinRange, (nextState, prevState) => {
  if (nextState !== prevState) {
    emit('updateMinRange', nextState)
  }
})
watch(myMaxRange, (nextState, prevState) => {
  if (nextState !== prevState) {
    emit('updateMaxRange', nextState)
  }
})

watch(feeSelectedDays, (nextState, prevState) => {
  if (nextState !== prevState) {
    emit('updateSlider', nextState)
  }
})

watch(myFuturePrice, (nextState, prevState) => {
  if (nextState !== prevState) {
    emit('updatePrice', nextState)
  }
})

</script>



<style scoped>
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

.highlight {
  color: #BFAC62;
  font-family: Poppins;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
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

.custom-textfield-padding-append-icon::v-deep .v-field__append-inner {
  padding-top: 10px !important;
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

.flex-gap {
  gap: 40px;
}

.label-height {
  height: 29px !important;
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

.custom-slider::v-deep .v-input__details {
  display: none !important;
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

.gap-cls {
  gap: 28px !important;
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

.result-number {
  font-family: Poppins;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;
  margin-top: -0.1rem;
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

.composition-val-font {
  color: #BFAC62;
  font-family: Poppins;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
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
