<script setup lang="ts">
import AutomobileComponent from "@/components/events/AutomobileComponent.vue";
import ComparisonComponent from "~/components/events/ComparisonComponent.vue";
import ProvidersComponent from "@/components/events/ProvidersComponent.vue";
import { SessionEvent } from "@/types/session-event.enum";

const props = defineProps<{
  sessionId: string;
  host: string;
}>();

const ws = ref<WebSocket | null>(null);
const visible = ref(false);
const payload = ref<any>(null);
const eventType = ref<SessionEvent | null>(null);

const currentComponent = computed(() => {
  switch (eventType.value) {
    case SessionEvent.AUTOMOBILE:
      return AutomobileComponent;
    case SessionEvent.COMPARISON:
      return ComparisonComponent;
    case SessionEvent.PROVIDERS:
      return ProvidersComponent;
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
      visible.value = true;
    }
  };
});

function close() {
  visible.value = false;
}
</script>

<template>
  <div v-if="visible" class="notification-popup">
    <component :is="currentComponent" :payload="payload" />
    <button class="close-btn" @click="close">&times;</button>
  </div>
</template>

<style scoped>
.notification-popup {
  position: fixed;
  left: 10%;
  width: 80%;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 1rem;
  z-index: 1000;
}
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
