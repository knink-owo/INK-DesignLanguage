/* ==========================================================================
   INK Design Language · site.js
   Dependency-free enhancements. Everything degrades without JavaScript.
   ========================================================================== */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function prefersReducedMotion() {
    return reducedMotion.matches;
  }

  /* --- 1. Spatial sheet: open from origin, return to origin -------------- */

  function animateOpen(dialog, trigger) {
    if (prefersReducedMotion()) return;
    var dialogRect = dialog.getBoundingClientRect();
    var triggerRect = trigger.getBoundingClientRect();
    if (!dialogRect.width || !dialogRect.height) return;

    var dx =
      triggerRect.left + triggerRect.width / 2 -
      (dialogRect.left + dialogRect.width / 2);
    var dy =
      triggerRect.top + triggerRect.height / 2 -
      (dialogRect.top + dialogRect.height / 2);
    var scale = Math.max(
      0.3,
      Math.min(
        1,
        Math.min(
          triggerRect.width / dialogRect.width,
          triggerRect.height / dialogRect.height
        ) * 1.6
      )
    );

    dialog.animate(
      [
        {
          transform: "translate(" + dx + "px, " + dy + "px) scale(" + scale + ")",
          opacity: 0.4
        },
        { transform: "translate(0, 0) scale(1)", opacity: 1 }
      ],
      { duration: 380, easing: "cubic-bezier(.17,.89,.32,1.18)", fill: "none" }
    );
  }

  function closeSheet(dialog, trigger, done) {
    if (prefersReducedMotion() || typeof dialog.animate !== "function") {
      done();
      return;
    }
    var dialogRect = dialog.getBoundingClientRect();
    var triggerRect = trigger ? trigger.getBoundingClientRect() : dialogRect;
    var dx =
      triggerRect.left + triggerRect.width / 2 -
      (dialogRect.left + dialogRect.width / 2);
    var dy =
      triggerRect.top + triggerRect.height / 2 -
      (dialogRect.top + dialogRect.height / 2);
    var scale = Math.max(
      0.3,
      Math.min(
        1,
        Math.min(
          triggerRect.width / dialogRect.width,
          triggerRect.height / dialogRect.height
        ) * 1.6
      )
    );

    var animation = dialog.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: "translate(" + dx + "px, " + dy + "px) scale(" + scale + ")",
          opacity: 0
        }
      ],
      { duration: 280, easing: "cubic-bezier(.7,0,1,.5)", fill: "forwards" }
    );
    animation.onfinish = function () {
      animation.cancel();
      done();
    };
    animation.oncancel = function () {
      done();
    };
  }

  function setupSheet(dialog) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    var opener = null;

    document.querySelectorAll('[data-sheet-open="' + dialog.id + '"]').forEach(
      function (trigger) {
        trigger.addEventListener("click", function () {
          opener = trigger;
          dialog.showModal();
          animateOpen(dialog, trigger);
        });
      }
    );

    function requestClose() {
      if (!dialog.open) return;
      var wasOpen = dialog.open;
      closeSheet(dialog, opener, function () {
        if (wasOpen && dialog.open) dialog.close();
      });
    }

    dialog.querySelectorAll("[data-sheet-close]").forEach(function (button) {
      button.addEventListener("click", requestClose);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) requestClose();
    });

    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      requestClose();
    });

    dialog.addEventListener("close", function () {
      if (opener && typeof opener.focus === "function") opener.focus();
    });
  }

  /* --- 2. Copy to clipboard ---------------------------------------------- */

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function setupCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach(function (button) {
      var target = document.querySelector(
        button.getAttribute("data-copy-target")
      );
      if (!target) return;
      var label = button.textContent;
      button.addEventListener("click", function () {
        copyText(target.innerText.replace(/\n{3,}/g, "\n\n").trim()).then(
          function (ok) {
            button.textContent = ok ? "已复制" : "复制失败";
            button.classList.toggle("is-copied", ok);
            window.setTimeout(function () {
              button.textContent = label;
              button.classList.remove("is-copied");
            }, 1800);
          }
        );
      });
    });
  }

  /* --- 3. Boot ----------------------------------------------------------- */

  function boot() {
    document.querySelectorAll("dialog.sheet").forEach(setupSheet);
    setupCopyButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
