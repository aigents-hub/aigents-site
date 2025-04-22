<script setup lang="ts">
import { defineProps } from "vue";

interface AutomobileItem {
  title: string;
  model: string;
  description: string;
  specs: Record<string, string>;
  image: string;
}
interface AutomobilePayload {
  items: AutomobileItem[];
}

const props = defineProps<{ payload: AutomobilePayload }>();
const payload = props.payload;

const schema: Array<{ key: keyof AutomobileItem; label: string }> = [
  { key: "title", label: "Título" },
  { key: "model", label: "Modelo" },
  { key: "description", label: "Descripción" },
];
</script>

<template>
  <div v-for="item in payload.items" :key="item.title" class="automobile">
    <div v-for="field in schema" :key="field.key" class="field">
      <strong>{{ field.label }}:</strong> {{ (item as any)[field.key] }}
    </div>

    <table class="tech-specs">
      <thead>
        <tr>
          <th>Especificación</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, key) in item.specs" :key="key">
          <td>{{ key }}</td>
          <td>{{ val }}</td>
        </tr>
      </tbody>
    </table>

    <img :src="item.image" alt="Imagen del vehículo" />
  </div>
</template>

<style scoped>
.automobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.tech-specs {
  width: 100%;
  border-collapse: collapse;
}
.tech-specs th,
.tech-specs td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
.tech-specs th {
  background: #f5f5f5;
}
img {
  max-width: 100%;
  border-radius: 4px;
}
</style>
