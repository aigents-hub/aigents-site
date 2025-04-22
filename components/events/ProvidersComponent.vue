<script setup lang="ts">
import { defineProps } from "vue";

interface Provider {
  id: string;
  name: string;
}
interface ProvidersPayload {
  providers: Provider[];
}

const props = defineProps<{ payload: ProvidersPayload }>();
const payload = props.payload;
</script>

<template>
  <div class="providers">
    <h3>Providers</h3>
    <ul>
      <li v-for="prov in payload.providers" :key="prov.id">
        {{ prov.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.providers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.providers ul {
  list-style: disc;
  margin-left: 1rem;
}
</style>
