<script setup lang="ts">
import { ref, watch } from "vue";

import { Icon } from "@iconify/vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
  }
);

const closeModal = () => {
  isOpen.value = false;
  emit("update:modelValue", false);
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <div>
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-white/70"
      >
        <div class="fixed inset-0" @click="closeModal" />
        <div
          class="bg-white p-6 rounded-lg z-10 w-[90%] h-[90vh] overflow-auto relative"
        >
          <!-- Close button -->
          <button
            class="absolute top-4 right-4 p-1 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
            @click="closeModal"
          >
            <Icon
              icon="material-symbols:close-rounded"
              class="h-[2rem] w-[2rem] text-black"
            />
          </button>

          <slot />
        </div>
      </div>
    </Teleport>
  </div>
</template>
