<template>
  <div class="star-container">
    <label>
      <!-- The hidden checkbox -->
      <input
        type="checkbox"
        v-model="isChecked"
        @change="emit('update:modelValue', isChecked)"
      />
      <!-- The visible star -->
      <span class="star" :class="{ active: isChecked, light: !darkMode, dark:darkMode }">&#9733;</span>
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
