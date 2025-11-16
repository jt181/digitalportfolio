const navLinks = document.querySelector(".nav-links");
const navToggle = document.querySelector(".nav-toggle");
const sections = document.querySelectorAll("main section");
const yearEl = document.getElementById("year");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateYear = () => {
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

const closeMenu = () => {
  navLinks?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

const handleToggle = () => {
  if (!navLinks || !navToggle) return;
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("is-open");
};

const smoothScroll = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLAnchorElement)) return;
  const href = target.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  const section = document.querySelector(href);
  if (!section) return;
  event.preventDefault();
  closeMenu();
  section.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
};

const setActiveLink = (id) => {
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkTarget = link.getAttribute("href")?.substring(1);
    link.classList.toggle("is-active", linkTarget === id);
  });
};

const setupIntersectionObserver = () => {
  if (prefersReducedMotion) {
    document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
};

const setupActiveSectionWatcher = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  sections.forEach((section) => observer.observe(section));
};

const init = () => {
  updateYear();
  setupIntersectionObserver();
  setupActiveSectionWatcher();
  navToggle?.addEventListener("click", handleToggle);
  navLinks?.addEventListener("click", smoothScroll);
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", smoothScroll));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) closeMenu();
  });
};

document.addEventListener("DOMContentLoaded", init);
