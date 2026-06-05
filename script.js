const cursorGlow = document.querySelector(".cursor-glow");

window.addEventListener("pointermove", (event) => {
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener("pointerleave", () => {
  cursorGlow.style.opacity = "0";
});

document.querySelectorAll(".work-card, .mini-card, .compare-card, .gallery-item").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxMedia = lightbox.querySelector(".lightbox-media");
const lightboxImage = lightbox.querySelector("img");
const lightboxCompare = lightbox.querySelector(".lightbox-compare");
const compareBefore = lightbox.querySelector(".compare-before");
const compareAfter = lightbox.querySelector(".compare-after");
const compareBeforeWrap = lightbox.querySelector(".compare-before-wrap");
const compareRange = lightbox.querySelector(".compare-range");
const compareLabelBefore = lightbox.querySelector(".compare-label-before");
const compareLabelAfter = lightbox.querySelector(".compare-label-after");
const lightboxKind = lightbox.querySelector(".lightbox-info span");
const lightboxTitle = lightbox.querySelector(".lightbox-info h2");
const lightboxDesc = lightbox.querySelector(".lightbox-info p");
const closeLightbox = lightbox.querySelector(".lightbox-close");

const updateCompareSlider = (value) => {
  const split = Math.min(99, Math.max(1, Number(value)));
  lightboxCompare.style.setProperty("--split", `${split}%`);
  lightboxCompare.style.setProperty("--split-number", split);
  lightboxCompare.style.setProperty("--before-width", `${10000 / split}%`);
};

compareRange.addEventListener("input", () => {
  updateCompareSlider(compareRange.value);
});

document.querySelectorAll(".work-card, .mini-card, .compare-card, .gallery-item").forEach((card) => {
    card.addEventListener("click", (event) => {
    if (card.classList.contains("gallery-trigger")) return;
    if (card.classList.contains("poster-gallery-trigger")) return;
    const clickedFigure = event.target.closest("figure");
    const caption = clickedFigure?.querySelector("figcaption")?.textContent.trim();
    const figures = [...card.querySelectorAll("figure")];
    const canCompare = card.classList.contains("compare-card") && figures.length >= 2;

    lightboxMedia.classList.toggle("is-compare", canCompare);
    lightboxCompare.setAttribute("aria-hidden", String(!canCompare));

    if (canCompare) {
      const beforeImage = figures[0].querySelector("img");
      const afterImage = figures[1].querySelector("img");
      const beforeText = figures[0].querySelector("figcaption")?.textContent.trim() || "对比前";
      const afterText = figures[1].querySelector("figcaption")?.textContent.trim() || "对比后";
      compareBefore.src = beforeImage.src;
      compareBefore.alt = beforeImage.alt;
      compareAfter.src = afterImage.src;
      compareAfter.alt = afterImage.alt;
      compareLabelBefore.textContent = beforeText;
      compareLabelAfter.textContent = afterText;
      compareRange.value = 50;
      updateCompareSlider(50);
      lightboxKind.textContent = `${card.dataset.kind} / 滑动对比`;
    } else {
      const image = clickedFigure?.querySelector("img") || card.querySelector("figure:last-child img") || card.querySelector("img");
      lightboxImage.src = image ? image.src : "./assets/work-detail.png";
      lightboxImage.alt = image ? image.alt : card.dataset.title;
      lightboxKind.textContent = caption ? `${card.dataset.kind} / ${caption}` : card.dataset.kind;
    }

    lightboxTitle.textContent = card.dataset.title;
    lightboxDesc.textContent = card.dataset.desc;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (card.classList.contains("gallery-item")) {
      renderGallery.classList.remove("is-open");
      renderGallery.setAttribute("aria-hidden", "true");
      posterGallery.classList.remove("is-open");
      posterGallery.setAttribute("aria-hidden", "true");
    }
  });
});

const closePreview = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxMedia.classList.remove("is-compare");
  lightboxCompare.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

closeLightbox.addEventListener("click", closePreview);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closePreview();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePreview();
  if (event.key === "Escape") closeGallery();
  if (event.key === "Escape") closePosterGallery();
  if (event.key === "Escape") closeResume();
});

const meterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".meter").forEach((meter) => {
        meter.querySelector("i").style.width = `${meter.dataset.progress}%`;
      });
      meterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.35 }
);

meterObserver.observe(document.querySelector(".capabilities"));

const qrButton = document.querySelector(".wechat-button");
const qrPopover = document.getElementById("qrPopover");
const qqButton = document.querySelector(".qq-button");
const qqPopover = document.getElementById("qqPopover");

const closeContactPopovers = () => {
  qrPopover.classList.remove("is-open");
  qqPopover.classList.remove("is-open");
  qrButton.setAttribute("aria-expanded", "false");
  qqButton.setAttribute("aria-expanded", "false");
  qrPopover.setAttribute("aria-hidden", "true");
  qqPopover.setAttribute("aria-hidden", "true");
};

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeContactPopovers();
});

qrButton.addEventListener("click", () => {
  const isOpen = qrPopover.classList.toggle("is-open");
  qqPopover.classList.remove("is-open");
  qqButton.setAttribute("aria-expanded", "false");
  qqPopover.setAttribute("aria-hidden", "true");
  qrButton.setAttribute("aria-expanded", String(isOpen));
  qrPopover.setAttribute("aria-hidden", String(!isOpen));
});

qqButton.addEventListener("click", () => {
  const isOpen = qqPopover.classList.toggle("is-open");
  qrPopover.classList.remove("is-open");
  qrButton.setAttribute("aria-expanded", "false");
  qrPopover.setAttribute("aria-hidden", "true");
  qqButton.setAttribute("aria-expanded", String(isOpen));
  qqPopover.setAttribute("aria-hidden", String(!isOpen));
});

document.querySelectorAll(".popover-close").forEach((button) => {
  button.addEventListener("click", closeContactPopovers);
});

document.addEventListener("click", (event) => {
  const insideContactPopover =
    event.target.closest(".qr-popover") ||
    event.target.closest(".qq-popover") ||
    event.target.closest(".wechat-button") ||
    event.target.closest(".qq-button");
  if (insideContactPopover) return;
  closeContactPopovers();
});

const resumeModal = document.getElementById("resumeModal");
const resumeButton = document.querySelector(".resume-button");
const resumeClose = resumeModal.querySelector(".resume-close");

const openResume = () => {
  resumeModal.classList.add("is-open");
  resumeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeResume = () => {
  resumeModal.classList.remove("is-open");
  resumeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

resumeButton.addEventListener("click", openResume);
resumeClose.addEventListener("click", closeResume);
resumeModal.addEventListener("click", (event) => {
  if (event.target === resumeModal) closeResume();
});

const renderGallery = document.getElementById("renderGallery");
const galleryClose = renderGallery.querySelector(".gallery-close");
const posterGallery = document.getElementById("posterGallery");
const posterGalleryClose = posterGallery.querySelector(".poster-gallery-close");

document.querySelectorAll(".gallery-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    renderGallery.classList.add("is-open");
    renderGallery.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

const closeGallery = () => {
  renderGallery.classList.remove("is-open");
  renderGallery.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

galleryClose.addEventListener("click", closeGallery);
renderGallery.addEventListener("click", (event) => {
  if (event.target === renderGallery) closeGallery();
});

document.querySelectorAll(".poster-gallery-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    posterGallery.classList.add("is-open");
    posterGallery.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

const closePosterGallery = () => {
  posterGallery.classList.remove("is-open");
  posterGallery.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

posterGalleryClose.addEventListener("click", closePosterGallery);
posterGallery.addEventListener("click", (event) => {
  if (event.target === posterGallery) closePosterGallery();
});

const sections = [...document.querySelectorAll("#works, #categories, #capabilities, #contact")];
const navLinks = [...document.querySelectorAll(".nav a")];

window.addEventListener("scroll", () => {
  const active = sections
    .filter((section) => section.getBoundingClientRect().top < window.innerHeight * 0.45)
    .at(-1);
  navLinks.forEach((link) => {
    link.classList.toggle("is-current", active && link.getAttribute("href") === `#${active.id}`);
  });
});
