import { getStore } from "@netlify/blobs";

const DEFAULT_STATE = JSON.stringify({ eventName: "Balkans Sea Fair 2026", tickets: {} });

export default async (req) => {
  const store = getStore("bsf-checkin");

  if (req.method === "GET") {
    const value = await store.get("event-state");
    return new Response(value || DEFAULT_STATE, {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    const body = await req.text();
    // basic sanity check so a malformed write can't corrupt the store
    JSON.parse(body);
    await store.set("event-state", body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/ticket-state" };
