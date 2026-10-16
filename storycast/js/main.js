// StoryCast — small progressive enhancements. The site works without JS:
// the menu shows as a plain list and transcripts are visible by default.
(function () {
  document.documentElement.classList.remove("no-js");

  // ---- Mobile navigation toggle ------------------------------
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("primary-menu");

  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Escape closes the menu and returns focus to the button
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // ---- Transcript show / hide --------------------------------
  const transcriptToggle = document.querySelector(".transcript__toggle");

  if (transcriptToggle) {
    const body = document.getElementById(transcriptToggle.getAttribute("aria-controls"));

    transcriptToggle.addEventListener("click", () => {
      const expanded = transcriptToggle.getAttribute("aria-expanded") === "true";
      transcriptToggle.setAttribute("aria-expanded", String(!expanded));
      transcriptToggle.textContent = expanded ? "Show transcript" : "Hide transcript";
      body.hidden = expanded;
    });
  }

  // ---- Timestamp buttons jump the player to that moment ------
  // Works with native <audio>/<video> and with YouTube embeds
  // (through the YouTube player's postMessage API).
  const sendToYouTube = (frame, func, args) => {
    frame.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");
  };

  document.querySelectorAll(".transcript__time").forEach((button) => {
    button.addEventListener("click", () => {
      const scope = button.closest(".story-layout") || document;
      const media = scope.querySelector(".player audio, .player video, .player iframe");
      const time = Number(button.dataset.time);
      if (!media) return;

      if (media.tagName === "IFRAME") {
        sendToYouTube(media, "seekTo", [time, true]);
        sendToYouTube(media, "playVideo", []);
      } else {
        media.currentTime = time;
        media.play();
      }
      media.focus();
    });
  });
})();
