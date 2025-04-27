<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  sessionId: {
    type: [String, null] as PropType<string | null>,
    default: null,
  },
  host: {
    type: String,
    required: true,
  },
});

const status = ref<"closed" | "connecting" | "open">("closed");

// WebSocket and audio nodes
let ws: WebSocket | null = null;
let audioContext: AudioContext | null = null;
let processor: ScriptProcessorNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
const playQueue: Array<Int16Array> = [];
let isPlaying = false;
let mediaStream: MediaStream | null = null;

const statusText = computed(() => {
  switch (status.value) {
    case "open":
      return t("connected");
    default:
      return t("disconnected");
  }
});

const statusClass = computed(() => {
  switch (status.value) {
    case "open":
      return "bg-green-500";
    case "closed":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
});

// function to start streaming audio
const startStreaming = async () => {
  if (!props.sessionId) return;
  status.value = "connecting";
  ws = new WebSocket(
    `ws://${props.host}/ws/conversation?sessionId=${props.sessionId}`
  );
  ws.binaryType = "arraybuffer";

  // handle open/error/close events
  ws.onopen = () => {
    status.value = "open";
  };
  ws.onerror = () => {
    status.value = "closed";
  };
  ws.onclose = () => {
    status.value = "closed";
  };

  // wait for open before proceeding
  await new Promise<void>((resolve, reject) => {
    if (!ws) return reject(new Error("WebSocket not initialized"));
    ws.onopen = () => {
      status.value = "open";
      resolve();
    };
    ws.onerror = (e) => {
      status.value = "closed";
      reject(e);
    };
  });

  // incoming audio
  if (ws) {
    ws.onmessage = (event) => {
      const pcm16 = new Int16Array(event.data as ArrayBuffer);
      playQueue.push(pcm16);
      tryPlayNext();
    };
  }

  // capture mic
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaStream = stream; // Store the stream reference
  audioContext = new AudioContext({ sampleRate: 24000 });
  sourceNode = audioContext.createMediaStreamSource(stream);
  processor = audioContext.createScriptProcessor(4096, 1, 1);

  sourceNode.connect(processor);
  processor.connect(audioContext.destination);

  processor.onaudioprocess = (e) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const float32 = e.inputBuffer.getChannelData(0);
      const pcm16 = convertFloat32ToInt16(float32);
      ws.send(pcm16);
    }
  };
};

// convert Float32 → ArrayBuffer Int16
const convertFloat32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
  const length = buffer.length;
  const result = new Int16Array(length);
  for (let i = 0; i < length; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return result.buffer;
};

// convert Int16 → Float32
const convertInt16ToFloat32 = (buffer: Int16Array): Float32Array => {
  const length = buffer.length;
  const result = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = buffer[i] / 0x7fff;
  }
  return result;
};

// play queued buffers sequentially
const tryPlayNext = () => {
  if (isPlaying || playQueue.length === 0 || !audioContext) return;
  isPlaying = true;
  const pcm16 = playQueue.shift()!;
  const float32 = convertInt16ToFloat32(pcm16);
  const buffer = audioContext.createBuffer(
    1,
    float32.length,
    audioContext.sampleRate
  );
  buffer.getChannelData(0).set(float32);

  const src = audioContext.createBufferSource();
  src.buffer = buffer;
  src.connect(audioContext.destination);
  src.onended = () => {
    isPlaying = false;
    tryPlayNext();
  };
  src.start();
};

// stop and cleanup
const stopStreaming = () => {
  processor?.disconnect();
  sourceNode?.disconnect();
  audioContext?.close();
  ws?.close();

  // Stop all audio tracks from the media stream
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
    mediaStream = null;
  }

  status.value = "closed";
};

// restart streaming on sessionId changes, including initial
watch(
  () => props.sessionId,
  (newId, oldId) => {
    if (oldId && ws) stopStreaming();
    if (newId) startStreaming();
    // Add this condition to handle null sessionId
    if (newId === null && ws) stopStreaming();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <div class="flex items-center gap-2">
      <span :class="statusClass" class="w-3 h-3 rounded-full" />
      {{ statusText }}
    </div>
  </div>
</template>
