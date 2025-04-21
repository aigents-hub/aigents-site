<script setup lang="ts">
const { locale, t } = useI18n();
const selectedLocale = ref(locale.value);

const options = [
  { label: "EN", value: "en" },
  { label: "ES", value: "es" },
];

const changeLocale = (value: string) => {
  locale.value = value;
  localStorage.setItem("locale", value);
};

// Watch for changes in selectedLocale and update the locale
watch(selectedLocale, (newValue) => {
  changeLocale(newValue);
});

// Initialize the locale on component mount
onMounted(() => {
  useI18nSetup();
  selectedLocale.value = locale.value; // Ensure the select reflects the correct initial value
});
</script>

<template>
  <Select v-model="selectedLocale">
    <SelectTrigger class="cursor-pointer">
      <SelectValue :placeholder="t('selectLanguage')" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="cursor-pointer"
        >
          {{ option.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
