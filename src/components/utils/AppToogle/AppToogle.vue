<template>
  <div
    class="toggle-switch"
    :class="{ 'is-checked': isChecked }"
    @click="toggle"
  >
    <div class="toggle-knob"></div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  });

  const emit = defineEmits(['update:modelValue']);

  const isChecked = computed(() => props.modelValue);

  function toggle() {
    emit('update:modelValue', !isChecked.value);
  }
</script>

<style scoped>
  .toggle-switch {
    width: 50px;
    height: 25px;
    background-color: #ccc;
    border-radius: 12.5px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .toggle-switch.is-checked {
    background-color: #4caf50;
  }

  .toggle-knob {
    width: 23px;
    height: 23px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 1px;
    left: 1px;
    transition: transform 0.3s;
  }

  .toggle-switch.is-checked .toggle-knob {
    transform: translateX(25px);
  }
</style>
