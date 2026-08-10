const parcelButton = document.querySelector("#parcel-button");
const foldButton = document.querySelector("#fold-button");
const parcelReveal = document.querySelector("#parcel-reveal");
const dreamMask = document.querySelector("#dream-mask");
const voiceNote = document.querySelector("#voice-note");
const playButton = document.querySelector("#play-button");
const voiceTime = document.querySelector("#voice-time");
const waveProgress = document.querySelector("#wave-progress");
const flowTitle = document.querySelector("#flow-title");
const flowCopy = document.querySelector("#flow-copy");
const flowStatus = document.querySelector("#flow-status");
const stageStatus = document.querySelector("#stage-status");
const parcelScene = document.querySelector("#parcel-scene");
const mailbox = document.querySelector("#mailbox");
const clouds = document.querySelectorAll(".cloud");
const dreamGrid = document.querySelector(".dream-grid");
const flaps = {
  top: document.querySelector(".paper-flap-top"),
  right: document.querySelector(".paper-flap-right"),
  bottom: document.querySelector(".paper-flap-bottom"),
  left: document.querySelector(".paper-flap-left"),
};

gsap.registerPlugin(MorphSVGPlugin);
gsap.set(dreamMask, { morphSVG: "#mask-closed" });
gsap.set([parcelReveal, voiceNote], { autoAlpha: 0 });
gsap.set(Object.values(flaps), { autoAlpha: 0, scale: 0.82 });

let parcelOpen = false;
let playing = false;
let playbackTimeline;
let parcelFloatTween;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function startParcelFloat() {
  if (prefersReducedMotion || parcelOpen) return;
  parcelFloatTween = gsap.to(parcelButton, {
    y: -11,
    rotate: 0.35,
    duration: 1.9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

function stopParcelFloat() {
  parcelFloatTween?.kill();
  parcelFloatTween = null;
  gsap.set(parcelButton, { y: 0, rotate: 0 });
}

function startAmbientMotion() {
  if (prefersReducedMotion) return;
  startParcelFloat();
  gsap.to(mailbox, {
    y: -9,
    rotate: -0.6,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(clouds, {
    x: (index) => index === 0 ? 18 : -15,
    duration: 6.5,
    stagger: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(dreamGrid, {
    y: 8,
    rotateZ: 11,
    duration: 5.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

function setOpenCopy() {
  flowTitle.textContent = "Sam sent you somewhere softer.";
  flowCopy.textContent = "A sunset train, a field of flowers, and twelve seconds meant only for you.";
  flowStatus.textContent = "The parcel is open. The little world is still warm.";
  stageStatus.textContent = "June opened Sam's tiny weatherproof world.";
}

function setClosedCopy() {
  flowTitle.textContent = "A little world, folded just for you.";
  flowCopy.textContent = "Tap the parcel to see what Sam tucked inside.";
  flowStatus.textContent = "Paper parcel. Packed 12 minutes ago.";
  stageStatus.textContent = "There is something soft waiting in your mailbox.";
}

function openParcel() {
  if (parcelOpen) return;
  stopParcelFloat();
  const lidLift = parcelScene.clientHeight * 0.67;
  const flapReachY = parcelScene.clientHeight * 0.46;
  const flapReachX = parcelScene.clientWidth * 0.33;
  parcelOpen = true;
  parcelButton.setAttribute("aria-expanded", "true");
  parcelReveal.setAttribute("aria-hidden", "false");
  foldButton.hidden = false;
  setOpenCopy();

  gsap.timeline({ defaults: { ease: "power3.inOut" } })
    .to(parcelButton, {
      duration: 0.8,
      y: -lidLift,
      rotateX: -12,
      scale: 0.96,
      transformOrigin: "50% 100%",
    })
    .to(parcelReveal, { duration: 0.18, autoAlpha: 1 }, "-=0.38")
    .to(flaps.top, { duration: 0.64, autoAlpha: 1, y: -flapReachY, scale: 1, rotateX: -8 }, "-=0.26")
    .to(flaps.right, { duration: 0.58, autoAlpha: 1, x: flapReachX, scale: 1, rotateY: 8 }, "-=0.48")
    .to(flaps.bottom, { duration: 0.58, autoAlpha: 1, y: flapReachY, scale: 1, rotateX: 8 }, "-=0.48")
    .to(flaps.left, { duration: 0.58, autoAlpha: 1, x: -flapReachX, scale: 1, rotateY: -8 }, "-=0.48")
    .to(dreamMask, { duration: 1.05, morphSVG: "#mask-open", ease: "expo.inOut" }, "-=0.26")
    .fromTo(".dream-landscape image", { scale: 1.16 }, { duration: 1.2, scale: 1, transformOrigin: "50% 50%" }, "<")
    .to(voiceNote, { duration: 0.5, autoAlpha: 1, y: 0 }, "-=0.35")
    .fromTo(".waveform span", { scaleY: 0.25 }, { duration: 0.4, scaleY: 1, stagger: 0.035 }, "-=0.28")
    .call(() => playButton.focus());
}

function stopPlayback() {
  playbackTimeline?.kill();
  playing = false;
  playButton.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Play voice message");
  voiceTime.textContent = "0:00 / 0:12";
  gsap.set(waveProgress, { scaleX: 0 });
}

function closeParcel() {
  if (!parcelOpen) return;
  stopPlayback();
  parcelOpen = false;
  parcelButton.setAttribute("aria-expanded", "false");
  foldButton.hidden = true;
  setClosedCopy();

  gsap.timeline({ defaults: { ease: "power3.inOut" } })
    .to(voiceNote, { duration: 0.24, autoAlpha: 0 })
    .to(dreamMask, { duration: 0.72, morphSVG: "#mask-closed" }, "-=0.08")
    .to(flaps.left, { duration: 0.46, x: 0, scale: 0.82, autoAlpha: 0 }, "-=0.18")
    .to(flaps.bottom, { duration: 0.46, y: 0, scale: 0.82, autoAlpha: 0 }, "-=0.38")
    .to(flaps.right, { duration: 0.46, x: 0, scale: 0.82, autoAlpha: 0 }, "-=0.38")
    .to(flaps.top, { duration: 0.46, y: 0, scale: 0.82, autoAlpha: 0 }, "-=0.38")
    .to(parcelReveal, { duration: 0.16, autoAlpha: 0 }, "-=0.2")
    .to(parcelButton, { duration: 0.7, y: 0, rotateX: 0, scale: 1 }, "-=0.12")
    .call(() => {
      parcelReveal.setAttribute("aria-hidden", "true");
      parcelButton.focus();
      startParcelFloat();
    });
}

function togglePlayback() {
  if (playing) {
    stopPlayback();
    return;
  }

  playing = true;
  playButton.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Pause voice message");
  playbackTimeline = gsap.timeline({
    onUpdate() {
      const elapsed = Math.min(12, Math.floor(this.progress() * 12));
      voiceTime.textContent = `0:${String(elapsed).padStart(2, "0")} / 0:12`;
    },
    onComplete() {
      stopPlayback();
    },
  });
  playbackTimeline.fromTo(waveProgress, { scaleX: 0 }, { duration: 12, scaleX: 1, ease: "none" });
}

parcelButton.addEventListener("click", openParcel);
foldButton.addEventListener("click", closeParcel);
playButton.addEventListener("click", togglePlayback);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && parcelOpen) closeParcel();
});

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(100);
} else {
  startAmbientMotion();
}
