"use strict";

const form = document.querySelector("#cid-form");
const page = document.querySelector(".cid-page");
const dialog = document.querySelector("#cid-dialog");

const colors = {
  navy: "#101d36",
  cranberry: "#a31342",
  emerald: "#005246",
  blue: "#2446a8",
  plum: "#482044",
  black: "#101218"
};

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function parseSymbols(value) {
  return value
    .split(",")
    .map(symbol => symbol.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function fillSymbolSlots(attribute, symbols) {
  document.querySelectorAll(`[${attribute}]`).forEach((slot, index) => {
    slot.textContent = symbols[index] || "";
  });
}

function updateCard() {
  const name = getValue("display-name") || "Your name";
  const secondary = getValue("secondary-name");
  const callSign = getValue("call-sign");

  setText("card-name", name);
  setText("card-secondary", secondary);
  setText("card-call-sign", callSign);
  setText("card-back-sign", callSign);
  setText("card-base", getValue("base-symbol"));
  setText("card-zodiac", getValue("zodiac"));

  document.getElementById("card-secondary").hidden = !secondary;

  document.querySelector(".cid-monogram").textContent =
    Array.from(name)[0].toUpperCase();

  page.style.setProperty(
    "--card-color",
    colors[getValue("card-color")] || colors.navy
  );

  fillSymbolSlots(
    "data-heritage-slot",
    parseSymbols(getValue("heritage-symbols"))
  );

  fillSymbolSlots(
    "data-personal-slot",
    parseSymbols(getValue("personal-symbols"))
  );
}

// Only allow complete HTTP or HTTPS links.
function safeDestination(value) {
  try {
    const url = new URL(value);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

function openPreview(type) {
  const isWork = type === "work";
  const name = getValue("display-name") || "Your name";
  const rawLink = getValue(isWork ? "work-link" : "connection-link");
  const destination = safeDestination(rawLink);

  setText(
    "preview-label",
    isWork ? "TAP / WORK" : "SCAN / CONNECTION"
  );

  setText(
    "preview-title",
    isWork ? `${name} / The work` : `${name} / The person`
  );

  let description = isWork
    ? "This side opens your professional introduction: your work, services, or opportunities to collaborate."
    : "This side opens your personal introduction: your interests, creative profile, and chosen stories.";

  if (!rawLink) {
    description += " Add a destination link in the editor to try it.";
  } else if (!destination) {
    description += " Enter a complete link beginning with https:// or http://.";
  }

  setText("preview-description", description);

  const link = document.getElementById("preview-link");
  link.hidden = !destination;

  if (destination) {
    link.href = destination;
  } else {
    link.removeAttribute("href");
  }

  dialog.showModal();
}

form.addEventListener("input", updateCard);
form.addEventListener("change", updateCard);

// Prevent Enter in the editor from reloading the page.
form.addEventListener("submit", event => {
  event.preventDefault();
});

form.addEventListener("reset", () => {
  // Wait until the browser has restored the original field values.
  requestAnimationFrame(updateCard);
});

document.querySelectorAll("[data-preview]").forEach(button => {
  button.addEventListener("click", () => {
    openPreview(button.dataset.preview);
  });
});

document.querySelector(".cid-close").addEventListener("click", () => {
  dialog.close();
});

updateCard();