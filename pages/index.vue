<script setup lang="ts"></script>

<template>
  <div
    class="flex flex-col max-w-2/3 justify-center items-center m-auto space-y-4"
  >
    <h1 class="text-red-500 font-bold text-4xl my-2">Home</h1>

    <Button variant="default" as-child>
      <NuxtLink to="/your-page">Click me</NuxtLink>
    </Button>

    <Button variant="success" as-child>
      <NuxtLink to="/your-page">Click me</NuxtLink>
    </Button>
  </div>
</template>
