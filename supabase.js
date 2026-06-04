import { supabase } from "./supabase";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function pushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

// Pede permissão, inscreve no PushManager e salva a inscrição no Supabase
export async function enablePush(profileId) {
  if (!pushSupported()) throw new Error("Push não suportado neste dispositivo/navegador.");
  const vapid = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapid) throw new Error("VITE_VAPID_PUBLIC_KEY ausente.");

  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permissão de notificação negada.");

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapid),
    });
  }
  const json = sub.toJSON();
  await supabase.from("push_subscriptions").upsert(
    { profile_id: profileId, endpoint: sub.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth },
    { onConflict: "endpoint" }
  );
  return true;
}

// Dispara push via Edge Function (best-effort; ignora falha se não estiver deployada)
export async function triggerPush({ recipient, title, body, link }) {
  try {
    await supabase.functions.invoke("send-push", { body: { recipient, title, body, link } });
  } catch (_) { /* silencioso */ }
}
