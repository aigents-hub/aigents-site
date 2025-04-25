<script setup lang="ts">
const { t } = useI18n();

const host = "localhost:7000";
const sessionId = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const startSession = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch(`http://${host}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    sessionId.value = json.sessionId;
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : "Unexpected error";
  } finally {
    loading.value = false;
  }
};

const stopSession = () => {
  sessionId.value = null;
};

const toggleSession = () => {
  if (sessionId.value) {
    stopSession();
  } else {
    startSession();
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <Button
      :variant="sessionId ? 'success' : 'default'"
      class="cursor-pointer"
      @click="toggleSession"
    >
      {{ sessionId ? t("stopSession") : t("startSession") }}
    </Button>

    <ConversationComponent :session-id="sessionId" :host="host" />
    <NotificationPopup v-if="sessionId" :session-id="sessionId" :host="host" />
    <p v-if="error" class="text-destructive">{{ error }}</p>
    <p v-if="sessionId" class="text-xl">
      {{ t("sessionId") }}: {{ sessionId }}
    </p>
  </div>
</template>
