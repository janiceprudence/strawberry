const stageStatus = document.querySelector("#stage-status");
const mailbox = document.querySelector("#mailbox");
const openButton = document.querySelector("#open-button");
const wrapButton = document.querySelector("#wrap-button");
const sendButton = document.querySelector("#send-button");
const resetButton = document.querySelector("#reset-button");
const flowTitle = document.querySelector("#flow-title");
const flowCopy = document.querySelector("#flow-copy");
const flowStatus = document.querySelector("#flow-status");
const meterSteps = Array.from(document.querySelectorAll(".meter-step"));
const parcelShape = document.querySelector("#parcel-shape");
const parcelFlap = document.querySelector("#parcel-flap");
const threadWave = document.querySelector("#thread-wave");
const parcelTape = document.querySelector("#parcel-tape-svg");
const parcelLabel = document.querySelector("#parcel-label-svg");
const postalStamp = document.querySelector("#postal-stamp");

gsap.registerPlugin(MorphSVGPlugin);
gsap.set(parcelShape, { morphSVG: "#shape-closed" });
gsap.set([parcelTape, parcelLabel, postalStamp], { autoAlpha: 0 });

const content = {
  receive: [
    "There is a berry important delivery.",
    "Open it, wrap a reply, then pop it into the little digital post.",
    "Special delivery from Sam. Packed 12 minutes ago.",
  ],
  open: [
    "Something soft from Sam.",
    "The paper opens like a tiny window. One sleepy hello is tucked inside.",
    "Played once. Saved with a tiny opened-again postmark.",
  ],
  wrap: [
    "Wrap your reply.",
    "Gingham paper, cream label, one little red thread of feeling.",
    "Sealed and labeled: Open when you miss me.",
  ],
  send: [
    "It is on its way.",
    "The parcel shrinks into the digital mailbox and waits with the flag up.",
    "Alex has a little something waiting.",
  ],
};

function setStep(stepName) {
  const stepNames = ["receive", "open", "wrap", "send"];
  const activeIndex = stepNames.indexOf(stepName);
  const [title, copy, status] = content[stepName];

  flowTitle.textContent = title;
  flowCopy.textContent = copy;
  flowStatus.textContent = status;
  stageStatus.textContent = status;
  meterSteps.forEach((step, index) => {
    step.classList.toggle("is-active", index <= activeIndex);
  });
}

function makeTimeline(stepName) {
  setStep(stepName);
  return gsap.timeline({ defaults: { ease: "power2.inOut" } });
}

openButton.addEventListener("click", () => {
  makeTimeline("open")
    .to(parcelShape, { duration: 0.95, morphSVG: "#shape-open" })
    .to(parcelFlap, { duration: 0.65, y: -34, rotateX: 28, transformOrigin: "50% 100%" }, "<")
    .to(threadWave, { duration: 0.45, autoAlpha: 1, strokeDashoffset: 0 }, "-=0.15")
    .fromTo(threadWave, { strokeDasharray: "1 18" }, { duration: 0.8, strokeDasharray: "18 10" }, "<");
});

wrapButton.addEventListener("click", () => {
  makeTimeline("wrap")
    .to(threadWave, { duration: 0.25, autoAlpha: 0 })
    .to(parcelFlap, { duration: 0.45, y: 0, rotateX: 0 }, "<")
    .to(parcelShape, { duration: 0.9, morphSVG: "#shape-wrapped" }, "<")
    .to(parcelTape, { duration: 0.45, autoAlpha: 1, scaleY: 1.04, transformOrigin: "50% 50%" })
    .to(parcelLabel, { duration: 0.35, autoAlpha: 1, y: -4 }, "-=0.18")
    .to(postalStamp, { duration: 0.3, autoAlpha: 1, scale: 1.08, transformOrigin: "50% 50%" }, "-=0.05")
    .to(postalStamp, { duration: 0.18, scale: 1 });
});

sendButton.addEventListener("click", () => {
  makeTimeline("send")
    .to([parcelShape, parcelFlap, parcelTape, parcelLabel, postalStamp], {
      duration: 0.75,
      scale: 0.62,
      x: 76,
      y: -18,
      transformOrigin: "50% 50%",
    })
    .to(parcelShape, { duration: 0.65, morphSVG: "#shape-mailed" }, "<")
    .to(".mailbox-flag", { duration: 0.5, rotate: -52, transformOrigin: "50% 100%" }, "-=0.35")
    .to(".mailbox-screen", { duration: 0.3, background: "linear-gradient(180deg, #c94a4a, #762e35)" }, "<")
    .call(() => mailbox.classList.add("has-mail"));
});

resetButton.addEventListener("click", () => {
  setStep("receive");
  mailbox.classList.remove("has-mail");
  gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } })
    .to([parcelShape, parcelFlap, parcelTape, parcelLabel, postalStamp], {
      x: 0,
      y: 0,
      scale: 1,
      autoAlpha: 1,
      transformOrigin: "50% 50%",
    })
    .to(parcelShape, { morphSVG: "#shape-closed" }, "<")
    .to([parcelTape, parcelLabel, postalStamp, threadWave], { autoAlpha: 0 }, "<")
    .to(".mailbox-flag", { rotate: -14 }, "<");
});
