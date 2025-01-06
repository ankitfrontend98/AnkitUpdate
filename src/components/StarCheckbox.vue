<template>
  <div class="star-container">
    <label>
      <!-- The hidden checkbox -->
      <input type="checkbox" v-model="isChecked" @change="emit('update:modelValue', isChecked)" />
      <!-- The visible star -->
      <div style="cursor: pointer;">
        <span v-if="isChecked" :class="{ 'custom-star-light': !darkMode, 'custom-star-dark': darkMode }">⭐</span>
        <span v-else
          :class="{ 'custom-star-not-selected-light': !darkMode, 'custom-star-not-selected-dark': darkMode }">⭐</span>
      </div>
      <!-- <span class="star" :class="{ active: isChecked, light: !darkMode, dark: darkMode }">&#9733;</span> -->
    </label>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const isChecked = ref(props.modelValue);

const darkMode = computed(() => {
  return theme.global.current.value.dark;
});

watch(
  () => props.modelValue,
  (newVal) => {
    isChecked.value = newVal;
  }
);
</script>

<style scoped>
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


.star-container {
  display: flex;
  justify-content: center;
  position: relative;
}

input[type="checkbox"] {
  display: none;
}

.star {
  position: relative;
  font-size: 1.5rem;
  color: #bbbcc3;
  cursor: pointer;
  transition: color 0.3s ease;
}

.star.active.light {
  color: #142257;
}

.star.active.dark {
  color: rgb(var(--v-theme-labelColor));
}
</style>
