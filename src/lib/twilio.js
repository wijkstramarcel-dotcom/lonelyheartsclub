import { hasSupabaseConfig, supabase } from "./supabase.js";

let device = null;
let currentCall = null;
let DeviceConstructor = null;

const enabledVoiceValues = new Set(["1", "true", "yes", "on"]);

export function isVoiceCallingEnabled() {
  return enabledVoiceValues.has(String(import.meta.env.VITE_ENABLE_VOICE_CALLS || "").trim().toLowerCase());
}

function bindCallEvents(call, { onAccepted, onDisconnected, onError } = {}) {
  call.on?.("accept", () => onAccepted?.());
  call.on?.("disconnect", () => {
    if (currentCall === call) currentCall = null;
    onDisconnected?.();
  });
  call.on?.("cancel", () => {
    if (currentCall === call) currentCall = null;
    onDisconnected?.();
  });
  call.on?.("reject", () => {
    if (currentCall === call) currentCall = null;
    onDisconnected?.();
  });
  call.on?.("error", (error) => {
    if (currentCall === call) currentCall = null;
    onError?.(error);
  });
}

async function getDeviceConstructor() {
  if (!DeviceConstructor) {
    const module = await import("@twilio/voice-sdk");
    DeviceConstructor = module.Device;
  }
  return DeviceConstructor;
}

function createDemoCall({ onAccepted, onDisconnected } = {}) {
  let disconnected = false;
  const acceptedTimer = setTimeout(() => {
    if (!disconnected) onAccepted?.();
  }, 500);

  return {
    disconnect() {
      if (disconnected) return;
      disconnected = true;
      clearTimeout(acceptedTimer);
      onDisconnected?.();
    },
    mute() {},
    on() {},
  };
}

export async function initTwilioDevice() {
  if (!isVoiceCallingEnabled()) {
    throw new Error("Anoniem bellen staat nog niet live. We activeren dit zodra de belprovider is gecontroleerd.");
  }
  if (!hasSupabaseConfig || !supabase) return null;

  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error("Niet ingelogd");

  const res = await supabase.functions.invoke("twilio-token");
  if (res.error) throw new Error(res.error.message);

  const Device = await getDeviceConstructor();
  device = new Device(res.data.token, {
    logLevel: "warn",
    codecPreferences: ["opus", "pcmu"],
  });

  await device.register();
  return device;
}

// Start een uitgaand gesprek naar een andere gebruiker (via hun user_id als identity)
export async function startCall(toUserId, { onAccepted, onDisconnected, allowDemoFallback = false } = {}) {
  if (!toUserId) throw new Error("Geen ontvanger voor het gesprek.");

  if (!allowDemoFallback && !isVoiceCallingEnabled()) {
    throw new Error("Anoniem bellen staat nog niet live. We activeren dit zodra de belprovider is gecontroleerd.");
  }

  if (!hasSupabaseConfig || !supabase) {
    if (allowDemoFallback) {
      currentCall = createDemoCall({ onAccepted, onDisconnected });
      return currentCall;
    }
    throw new Error("Supabase is nog niet gekoppeld voor anoniem bellen.");
  }

  try {
    if (!device) await initTwilioDevice();

    currentCall = await device.connect({
      params: { To: toUserId },
    });

    bindCallEvents(currentCall, { onAccepted, onDisconnected });

    return currentCall;
  } catch (err) {
    if (allowDemoFallback) {
      console.warn("Twilio niet beschikbaar, demo-call gestart:", err);
      currentCall = createDemoCall({ onAccepted, onDisconnected });
      return currentCall;
    }
    throw err;
  }
}

export function hangUp() {
  currentCall?.disconnect();
  currentCall = null;
}

export function mute(muted) {
  currentCall?.mute(muted);
}

// Luister op inkomende gesprekken
export function onIncomingCall(callback) {
  if (!device) return () => {};
  device.on("incoming", callback);
  return () => {
    if (typeof device.off === "function") device.off("incoming", callback);
    else if (typeof device.removeListener === "function") device.removeListener("incoming", callback);
  };
}

export function answerIncomingCall(call, { onAccepted, onDisconnected, onError } = {}) {
  if (!call) throw new Error("Geen inkomend gesprek om op te nemen.");
  currentCall = call;
  bindCallEvents(call, { onAccepted, onDisconnected, onError });
  call.accept();
  return call;
}

export function rejectIncomingCall(call) {
  if (!call) return;
  if (typeof call.reject === "function") call.reject();
  else call.disconnect?.();
  if (currentCall === call) currentCall = null;
}

export function getDevice() {
  return device;
}
