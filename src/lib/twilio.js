import { Device } from "@twilio/voice-sdk";
import { hasSupabaseConfig, supabase } from "./supabase.js";

let device = null;
let currentCall = null;

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
  if (!hasSupabaseConfig || !supabase) return null;

  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  if (!token) throw new Error("Niet ingelogd");

  const res = await supabase.functions.invoke("twilio-token");
  if (res.error) throw new Error(res.error.message);

  device = new Device(res.data.token, {
    logLevel: "warn",
    codecPreferences: ["opus", "pcmu"],
  });

  await device.register();
  return device;
}

// Start een uitgaand gesprek naar een andere gebruiker (via hun user_id als identity)
export async function startCall(toUserId, { onAccepted, onDisconnected } = {}) {
  if (!hasSupabaseConfig || !supabase) {
    currentCall = createDemoCall({ onAccepted, onDisconnected });
    return currentCall;
  }

  try {
    if (!device) await initTwilioDevice();

    currentCall = await device.connect({
      params: { To: toUserId },
    });

    currentCall.on("accept", () => onAccepted?.());
    currentCall.on("disconnect", () => {
      currentCall = null;
      onDisconnected?.();
    });
    currentCall.on("cancel", () => {
      currentCall = null;
      onDisconnected?.();
    });

    return currentCall;
  } catch (err) {
    console.warn("Twilio niet beschikbaar, demo-call gestart:", err);
    currentCall = createDemoCall({ onAccepted, onDisconnected });
    return currentCall;
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
  if (!device) return;
  device?.on("incoming", callback);
}

export function getDevice() {
  return device;
}
