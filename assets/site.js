/* ==========================================================================
   INK Design Language · site.js
   v1.1 · 零依赖。两件事：① dialog 的空间连续性；② 复制按钮。
   所有时长、缓动都从 tokens.css 读，不在脚本里写死设计值。
   ========================================================================== */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;

  const cssValue = (name, fallback) => {
    const value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
  };

  const cssMs = (name, fallback) => {
    const raw = cssValue(name, "");
    const number = Number.parseFloat(raw);
    if (!Number.isFinite(number)) return fallback;
    return raw.endsWith("ms") ? number : number * 1000;
  };

  const easeSnap = () => cssValue("--ink-ease-snap", "cubic-bezier(.17,.89,.32,1.18)");
  const easeOut = () => cssValue("--ink-ease-out", "cubic-bezier(.7,0,1,.5)");

  const rectCenter = (rect) => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  });

  /* --- 一、空间连续性：面板从触发点展开，关闭时收回触发点 ----------------- */

  const sheets = new Map(); // dialog id -> 最近一次触发它的元素

  const expand = (dialog, trigger) => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    if (reducedMotion.matches || typeof dialog.animate !== "function") return;

    const dialogRect = dialog.getBoundingClientRect();
    if (!dialogRect.width || !dialogRect.height) return;
    const origin = trigger ? trigger.getBoundingClientRect() : dialogRect;
    const from = rectCenter(origin);
    const to = rectCenter(dialogRect);
    const scale = Math.min(
      1,
      Math.max(0.3, Math.min(origin.width / dialogRect.width, origin.height / dialogRect.height) * 1.6),
    );

    dialog.animate(
      [
        {
          transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${scale})`,
          opacity: 0.4,
        },
        { transform: "none", opacity: 1 },
      ],
      {
        duration: cssMs("--ink-duration-expand", 380),
        easing: easeSnap(),
        fill: "none",
      },
    );
  };

  const collapse = (dialog, trigger) => {
    if (!dialog.open) return;

    if (reducedMotion.matches || typeof dialog.animate !== "function") {
      dialog.close();
      return;
    }

    const dialogRect = dialog.getBoundingClientRect();
    const origin = trigger ? trigger.getBoundingClientRect() : dialogRect;
    const from = rectCenter(origin);
    const to = rectCenter(dialogRect);
    const scale = Math.min(
      1,
      Math.max(0.3, Math.min(origin.width / dialogRect.width, origin.height / dialogRect.height) * 1.6),
    );

    const animation = dialog.animate(
      [
        { transform: "none", opacity: 1 },
        {
          transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${scale})`,
          opacity: 0.4,
        },
      ],
      {
        duration: cssMs("--ink-duration-collapse", 240),
        easing: easeOut(),
        fill: "forwards",
      },
    );

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      animation.cancel();
      if (dialog.open) dialog.close();
    };
    animation.addEventListener("finish", settle);
    animation.addEventListener("cancel", settle);
  };

  const requestClose = (dialog) => {
    if (!dialog.open) return;
    collapse(dialog, sheets.get(dialog.id));
  };

  const setupSheet = (trigger) => {
    const id = trigger.getAttribute("data-sheet-open");
    const dialog = id ? document.getElementById(id) : null;
    if (!dialog) return;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      sheets.set(dialog.id, trigger);
      expand(dialog, trigger);
    });

    dialog.querySelectorAll("[data-sheet-close]").forEach((button) => {
      button.addEventListener("click", () => requestClose(dialog));
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) requestClose(dialog);
    });

    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      requestClose(dialog);
    });

    dialog.addEventListener("close", () => {
      const opener = sheets.get(dialog.id);
      sheets.delete(dialog.id);
      if (opener && typeof opener.focus === "function") {
        opener.focus({ preventScroll: true });
      }
    });
  };

  /* --- 二、复制按钮 -------------------------------------------------------- */

  const COPY_RESET_MS = 1800;

  const fallbackCopy = (text) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.setAttribute("aria-hidden", "true");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.left = "-1000px";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // 继续走降级路径
      }
    }
    return fallbackCopy(text);
  };

  const setupCopyButton = (button) => {
    const selector = button.getAttribute("data-copy-target");
    if (!selector) return;
    const target = document.querySelector(selector);
    const label = button.querySelector("[data-copy-label]");
    if (!target || !label) return;

    const idleLabel = label.textContent;

    button.addEventListener("click", async () => {
      const ok = await copyText(target.textContent);
      label.textContent = ok ? "已复制" : "复制失败";
      button.classList.toggle("is-copied", ok);
      window.clearTimeout(button.copyResetTimer);
      button.copyResetTimer = window.setTimeout(() => {
        label.textContent = idleLabel;
        button.classList.remove("is-copied");
      }, COPY_RESET_MS);
    });
  };

  /* --- 启动 ---------------------------------------------------------------- */

  document.querySelectorAll("[data-sheet-open]").forEach(setupSheet);
  document.querySelectorAll("[data-copy-target]").forEach(setupCopyButton);
})();
