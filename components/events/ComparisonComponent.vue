<script setup lang="ts">
import type { Car } from "~/types/car";

defineProps<{
  payload: { cars: Car[] };
}>();

const formatHeader = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Add or modify the formatValue method
const formatValue = (value: unknown): string => {
  if (value === undefined || value === null) return "-";

  // Handle arrays
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "object") {
          // Special handling for wheel objects
          if ("name" in item && "size" in item) {
            return `${item.name} ${item.size}`;
          }
          return Object.values(item).join(" ");
        }
        return item.toString();
      })
      .join(", ");
  }

  // Handle objects
  if (typeof value === "object") {
    return Object.values(value).join(" ");
  }

  // Handle primitive values
  return value.toString();
};

const hasChildren = (value: unknown): boolean => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};
</script>

<template>
  <Table class="text-black">
    <TableHeader>
      <TableRow class="border-none bg-white hover:bg-white">
        <TableHead />
        <TableHead
          v-for="car in payload.cars"
          :key="car.specs.model"
          class="text-center"
        >
          <NuxtImg
            :src="car.images[0].url"
            class="w-[350px] max-w-full inline-block"
          />
        </TableHead>
      </TableRow>
    </TableHeader>

    <div class="mb-4" />

    <TableBody>
      <template v-for="(value, key) in payload.cars[0].specs" :key="key">
        <!-- Parent property row -->
        <TableRow
          class="border-none bg-sky-50"
          :class="[
            {
              'hover:bg-sky-50':
                hasChildren(value) ||
                (Array.isArray(value) &&
                  value.length > 0 &&
                  typeof value[0] === 'object'),
              'dark:hover:bg-white':
                !hasChildren(value) &&
                (!Array.isArray(value) || typeof value[0] !== 'object'),
            },
          ]"
        >
          <TableCell class="font-medium">
            {{ formatHeader(key) }}
          </TableCell>
          <TableCell
            v-for="car in payload.cars"
            :key="car.specs.model + key"
            :class="{
              'border-l':
                typeof value !== 'object' ||
                (Array.isArray(value) && typeof value[0] !== 'object'),
            }"
          >
            <span
              v-if="
                typeof value !== 'object' ||
                (Array.isArray(value) && typeof value[0] !== 'object')
              "
            >
              {{ formatValue(car.specs[key]) }}
            </span>
          </TableCell>
        </TableRow>

        <!-- Special handling for wheels array -->
        <template
          v-if="
            Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === 'object'
          "
        >
          <TableRow
            v-for="subKey in ['name', 'size']"
            :key="subKey"
            class="bg-sky-50 dark:hover:bg-white"
          >
            <TableCell class="font-medium">
              {{ formatHeader(subKey) }}
            </TableCell>
            <TableCell
              v-for="car in payload.cars"
              :key="car.specs.model + subKey"
              class="border-l"
            >
              {{
                Array.isArray(car.specs[key])
                  ? car.specs[key][0]?.[subKey]
                  : "-"
              }}
            </TableCell>
          </TableRow>
        </template>

        <div v-if="!hasChildren(value)" class="flex mb-4" />

        <!-- Child properties for objects -->
        <template v-if="hasChildren(value)">
          <TableRow
            v-for="(subvalue, subKey) in value"
            :key="subKey"
            class="bg-sky-50 dark:hover:bg-white"
          >
            <TableCell class="font-medium">
              {{ formatHeader(subKey) }}
            </TableCell>
            <TableCell
              v-for="car in payload.cars"
              :key="car.specs.model + subKey"
              class="border-l"
            >
              {{ formatValue(car.specs[key]?.[subKey]) }}
            </TableCell>
          </TableRow>
        </template>
        <div v-if="hasChildren(value)" class="flex mb-4" />
      </template>
    </TableBody>
  </Table>
</template>
