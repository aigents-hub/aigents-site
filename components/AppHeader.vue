<script setup lang="ts">
import { Icon } from "@iconify/vue";

const { t } = useI18n();

const { toggleTheme } = useStrictTheme();
</script>

<template>
  <div class="grid grid-cols-[1fr_100px] my-4 gap-4">
    <div flex flex-col>
      <NuxtImg src="/aigents_logo.svg" width="400" />
      <h1 class="text-2xl md:text-3xl sm:tracking-[8px] font-bold">
        {{ t("slogan") }}
      </h1>
    </div>
    <div class="flex justify-end">
      <Button variant="outline" class="cursor-pointer" @click="toggleTheme">
        <Icon
          icon="radix-icons:moon"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icon
          icon="radix-icons:sun"
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
      <LanguageSelector />
    </div>
  </div>

  <!-- <Button variant="default" as-child>
      <NuxtLink to="/about">About us</NuxtLink>
    </Button>

    <Button variant="success" as-child>
      <NuxtLink to="/faq">FAQ</NuxtLink>
    </Button> -->
</template>
