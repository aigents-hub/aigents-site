<script setup lang="ts">
import { defineProps } from "vue";

interface ComparisonPayload {
  comparison: Record<string, string | number>;
}

const props = defineProps<{ payload: ComparisonPayload }>();
const payload = props.payload;
</script>

<template>
  <div class="comparison">
    <h3>Comparativa</h3>
    <table class="comparison-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, key) in payload.comparison" :key="key">
          <td>{{ key }}</td>
          <td>{{ val }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.comparison {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
}
.comparison-table th,
.comparison-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
.comparison-table th {
  background: #f5f5f5;
}
</style>
