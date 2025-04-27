<script lang="ts" setup>
const { t } = useI18n();

const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  payload: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:loading", value: boolean): void;
}>();

watch(
  () => props.payload,
  (newValue) => {
    if (newValue === false) {
      emit("update:loading", false);
    }
  }
);
</script>

<template>
  <div class="flex flex-col justify-center items-center mt-8 mx-auto space-y-4">
    <NuxtImg src="/images/loading.gif" class="h-32 w-32" />
    <h2 class="text-3xl">{{ t("searching") }}</h2>
  </div>
</template>
