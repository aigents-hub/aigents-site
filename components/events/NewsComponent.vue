<script lang="ts" setup>
import { useMarkdown } from "~/composables/useMarkdown";
import { Icon } from "@iconify/vue";
import type { Payload, ProcessedItem } from "~/types/new";

const { t } = useI18n();

const props = defineProps({
  payload: {
    type: Object as PropType<Payload>,
    required: true,
  },
});

const processedItems = ref<ProcessedItem[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const processMarkdown = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    if (!props.payload) {
      throw new Error("Payload is missing");
    }

    const itemsArray = Object.values(props.payload);

    processedItems.value = await Promise.all(
      itemsArray.map(async (item) => {
        const processedContent = await useMarkdown(item.content);
        return {
          ...item,
          content: processedContent,
        };
      })
    );
  } catch (err) {
    console.error("Processing error:", err);
    error.value = "Failed to process content";
    processedItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(processMarkdown);
watch(() => props.payload, processMarkdown, { deep: true });

const defaultValue = "item-1";
</script>

<template>
  <div>
    <h2 class="text-center text-xl md:text-5xl font-semibold uppercase">
      {{ t("news") }}
    </h2>
    <div
      v-for="(item, index) in processedItems"
      :key="index"
      class="flex flex-col gap-4"
    >
      <NuxtLink
        :to="item.sourceUrl"
        class="text-blue-500 text-3xl hover:text-blue-700 inline-flex items-center"
        target="_blank"
        >{{ item.title }}
        <Icon icon="gridicons:external" class="h-[1.2rem] w-[1.2rem] ml-2"
      /></NuxtLink>
      {{ item.summary }}
      <Accordion
        type="single"
        class="w-full"
        collapsible
        :default-value="defaultValue"
      >
        <AccordionItem :value="item.title">
          <AccordionTrigger class="text-xl cursor-pointer">{{
            t("readMore")
          }}</AccordionTrigger>
          <AccordionContent>
            <div class="markdown-container ml-12 mb-8" v-html="item.content" />
            {{ t("source") }}
            <NuxtLink
              :to="item.sourceUrl"
              class="text-blue-500 hover:text-blue-700 inline-flex items-center"
              target="_blank"
              >{{ item.sourceUrl }}</NuxtLink
            >
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <hr v-if="index !== processedItems.length - 1" class="mb-8" />
    </div>
  </div>
</template>

<style>
.markdown-container {
  line-height: 1.6;
  max-width: 800px;
  word-wrap: break-word;
}

/* Headings */
.markdown-container h1,
.markdown-container h2,
.markdown-container h3,
.markdown-container h4,
.markdown-container h5,
.markdown-container h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-container h1 {
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
}

.markdown-container h2 {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.markdown-container h3 {
  font-size: 1.25em;
}

.markdown-container h4 {
  font-size: 1em;
}

/* Paragraphs */
.markdown-container p {
  margin-top: 0;
  margin-bottom: 16px;
}

/* Links */
.markdown-container a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-container a:hover {
  text-decoration: underline;
}

/* Lists */
.markdown-container ul,
.markdown-container ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-container li {
  margin-bottom: 0.25em;
}

.markdown-container li > p {
  margin-bottom: 0;
}

.markdown-container ul ul,
.markdown-container ul ol,
.markdown-container ol ol,
.markdown-container ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

/* Code */
.markdown-container code {
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  padding: 0.2em 0.4em;
  font-size: 85%;
}

.markdown-container pre {
  background-color: #f6f8fa;
  border-radius: 3px;
  padding: 16px;
  overflow: auto;
  line-height: 1.45;
  margin-bottom: 16px;
}

.markdown-container pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  display: inline;
  line-height: inherit;
  overflow: visible;
  word-wrap: normal;
}

/* Images */
.markdown-container img {
  max-width: 100%;
  box-sizing: initial;
  background-color: #fff;
  border-style: none;
}

.markdown-container img[align="right"] {
  padding-left: 20px;
}

.markdown-container img[align="left"] {
  padding-right: 20px;
}

/* Blockquotes */
.markdown-container blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-container blockquote > :first-child {
  margin-top: 0;
}

.markdown-container blockquote > :last-child {
  margin-bottom: 0;
}

/* Tables */
.markdown-container table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: 100%;
  overflow: auto;
  margin-bottom: 16px;
}

.markdown-container table th {
  font-weight: 600;
}

.markdown-container table th,
.markdown-container table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-container table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-container table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

/* Horizontal Rule */
.markdown-container hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

/* Task Lists */
.markdown-container .task-list-item {
  list-style-type: none;
}

.markdown-container .task-list-item-checkbox {
  margin: 0 0.2em 0.25em -1.6em;
  vertical-align: middle;
}
</style>
