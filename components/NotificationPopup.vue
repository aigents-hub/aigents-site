<script setup lang="ts">
import AutomobileComponent from "@/components/events/AutomobileComponent.vue";
import ComparisonComponent from "@/components/events/ComparisonComponent.vue";
import NewsComponent from "@/components/events/NewsComponent.vue";
import ProvidersComponent from "@/components/events/ProvidersComponent.vue";
import { SessionEvent } from "@/types/session-event.enum";
import SearchingComponent from "./events/SearchingComponent.vue";

const props = defineProps<{
  sessionId: string;
  host: string;
}>();

const ws = ref<WebSocket | null>(null);
const visible = ref(false);
const loading = ref(false);
const payload = ref<any>(null);
const eventType = ref<SessionEvent | null>(null);

const currentComponent = computed(() => {
  switch (eventType.value) {
    case SessionEvent.AUTOMOBILE:
      return AutomobileComponent;
    case SessionEvent.COMPARISON:
      return ComparisonComponent;
    case SessionEvent.NEWS:
      return NewsComponent;
    case SessionEvent.PROVIDERS:
      return ProvidersComponent;
    case SessionEvent.SEARCHING:
      return SearchingComponent;
    default:
      return null;
  }
});

onMounted(() => {
  ws.value = new WebSocket(`ws://${props.host}/ws/notification`);
  ws.value.binaryType = "arraybuffer";

  ws.value.onopen = () => {
    ws.value!.send(
      JSON.stringify({ action: "init", sessionId: props.sessionId })
    );
    Object.values(SessionEvent).forEach((ev) =>
      ws.value!.send(JSON.stringify({ action: "subscribe", event: ev }))
    );
  };

  ws.value.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.event && msg.payload !== undefined) {
      eventType.value = msg.event;
      payload.value = msg.payload;
      if (msg.event !== "Searching") {
        visible.value = true;
      } else {
        loading.value = true;
      }
    }
  };
});
</script>

<template>
  <div>
    <component
      v-if="loading"
      v-model:loading="loading"
      :is="currentComponent"
      :payload="payload.searching"
    />

    <div v-if="visible">
      <AppModal v-model="visible">
        <div class="text-black mt-8 mb-4">
          <component :is="currentComponent" :payload="payload" />
        </div>
      </AppModal>
    </div>
  </div>
</template>
