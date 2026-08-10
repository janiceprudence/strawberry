const tabs = Array.from(document.querySelectorAll("[data-screen]"));
const screens = Array.from(document.querySelectorAll(".screen"));
const stageStatus = document.querySelector("#stage-status");
const mailbox = document.querySelector("#mailbox");
const recordButton = document.querySelector("#record-button");
const recordStatus = document.querySelector("#record-status");
const sendButton = document.querySelector("#send-button");
const sendStatus = document.querySelector("#send-status");
const openParcel = document.querySelector("#open-parcel");
const listenButton = document.querySelector("#listen-button");
const listenStatus = document.querySelector("#listen-status");
const parcelPreview = document.querySelector("#parcel-preview");

const statusByScreen = {
  mailbox: "There is something soft waiting in your mailbox.",
  record: "A little voice note is becoming a parcel.",
  wrap: "Pick paper, add label, seal with care.",
  send: "Tiny postal magic queued at the flag.",
  open: "Pull the tab and listen when ready.",
};

function showScreen(name) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === `screen-${name}`);
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.screen === name);
  });

  stageStatus.textContent = statusByScreen[name];
}

tabs.forEach((control) => {
  control.addEventListener("click", () => showScreen(control.dataset.screen));
});

recordButton.addEventListener("click", () => {
  recordStatus.textContent = "0:42 of good stuff. Ready to wrap it up?";
  recordButton.textContent = "Recorded";
});

document.querySelectorAll(".wrap-choice").forEach((choice) => {
  choice.addEventListener("click", () => {
    document.querySelectorAll(".wrap-choice").forEach((button) => {
      button.classList.remove("is-selected");
    });
    choice.classList.add("is-selected");
    parcelPreview.className = `parcel-preview ${choice.dataset.wrap}`;
  });
});

sendButton.addEventListener("click", () => {
  sendStatus.textContent = "It is on its way. Alex has a little something waiting.";
  mailbox.classList.add("has-mail");
});

openParcel.addEventListener("click", () => {
  openParcel.classList.toggle("is-open");
});

listenButton.addEventListener("click", () => {
  listenStatus.textContent = "Played once. Saved with a tiny opened-again postmark.";
});
