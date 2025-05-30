import StreamingAvatar, { AvatarQuality, StreamingEvents } from "@heygen/streaming-avatar";

(async function () {
  async function getFreshToken() {
    const res = await fetch("/.netlify/functions/token", { method: "POST" });
    const json = await res.json();
    return json.token;
  }

  const config = {
    token: await getFreshToken(),
    avatarName: window.heygenAvatarId,
    quality: AvatarQuality.Low,
    logUrl: window.heygenAnalyticsEndpoint,
    clientId: window.heygenClientId
  };

  function log(eventType, data = {}) {
    if (!config.logUrl) return;
    fetch(config.logUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        clientId: config.clientId,
        sessionId: window._sessionId,
        ...data
      })
    });
  }

  window.HeyGenAnalytics = {
    async start() {
      const token = await getFreshToken(); // <== Move here
      const avatar = new StreamingAvatar({ token });

      avatar.on(StreamingEvents.STREAM_READY, () => log("stream_ready"));
      avatar.on(StreamingEvents.AVATAR_START_TALKING, () => log("start_talking"));
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => log("stop_talking"));
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => log("stream_disconnected"));

      const session = await avatar.createStartAvatar({
        avatarName: config.avatarName,
        quality: config.quality
      });

      window._avatarInstance = avatar;
      window._sessionId = session.session_id;
      log("session_started", { sessionId: session.session_id });
    },

    async speak(text) {
      if (!window._avatarInstance) return;
      await window._avatarInstance.speak({ sessionId: window._sessionId, text });
      log("speak", { text });
    },

    async end() {
      if (window._avatarInstance) {
        await window._avatarInstance.stopAvatar();
        log("session_ended");
      }
    }
  };
})();