const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

const audienceCopy = {
  students:
    "LinkedIn presence, interview narrative, resume clarity, and a confident first professional story.",
  professionals:
    "Career acceleration through sharper positioning, stronger visibility, and communication that earns trust before meetings begin.",
  founders:
    "Founder story, market trust, content authority, investor-client credibility, and premium positioning.",
  experts:
    "Credibility-to-visibility systems for doctors, architects, consultants, coaches, and independent experts.",
  women:
    "Voice ownership, authority building, confident visibility, and community-backed momentum for women-led businesses.",
  corporates:
    "Real-world brand, career, and communication skills for teams, campuses, leadership cohorts, and institutions.",
};

const audienceButtons = document.querySelectorAll("[data-audience]");
const audienceDetail = document.querySelector("[data-audience-detail] h3");

audienceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    audienceButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (audienceDetail) {
      audienceDetail.textContent = audienceCopy[button.dataset.audience];
    }
  });
});

const formats = {
  keynote: {
    title: "60-90 mins",
    body: "High-energy, high-impact introduction to personal branding.",
  },
  intensive: {
    title: "6 hours",
    body: "Practical, actionable, and immediately applicable.",
  },
  immersive: {
    title: "Deep Dive",
    body: "Transformation-led, with coaching, portfolio work, and brand creation.",
  },
};

const formatTabs = document.querySelectorAll("[data-format]");
const formatCopy = document.querySelector("[data-format-copy]");

formatTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    formatTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const selected = formats[tab.dataset.format];
    if (formatCopy && selected) {
      formatCopy.innerHTML = `<strong>${selected.title}</strong><span>${selected.body}</span>`;
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const filters = document.querySelectorAll("[data-filter]");
const articles = document.querySelectorAll("[data-category]");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;
    articles.forEach((article) => {
      article.classList.toggle("hidden", category !== "all" && article.dataset.category !== category);
    });
  });
});

document.querySelectorAll("[data-expand]").forEach((button) => {
  button.dataset.closedLabel = button.textContent;
  button.addEventListener("click", () => {
    const card = button.closest(".article-card");
    const expanded = card.classList.toggle("expanded");
    button.textContent = expanded ? "Close note" : button.dataset.closedLabel;
  });
});

const recommendations = document.querySelectorAll(".recommendation");
const nextButton = document.querySelector("[data-next]");
const prevButton = document.querySelector("[data-prev]");
let activeRecommendation = 0;

function showRecommendation(index) {
  if (!recommendations.length) return;
  recommendations[activeRecommendation].classList.remove("active");
  activeRecommendation = (index + recommendations.length) % recommendations.length;
  recommendations[activeRecommendation].classList.add("active");
}

if (recommendations.length) {
  nextButton?.addEventListener("click", () => showRecommendation(activeRecommendation + 1));
  prevButton?.addEventListener("click", () => showRecommendation(activeRecommendation - 1));
  setInterval(() => showRecommendation(activeRecommendation + 1), 6000);
}

document.querySelectorAll("[data-newsletter]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.parentElement.querySelector("[data-newsletter-message]");
    form.reset();
    if (message) {
      message.textContent = "Thank you for signing up. Clarity is on its way.";
    }
  });
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Sattori enquiry: ${data.get("service")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\nStory:\n${data.get("message")}`,
    );
    const message = contactForm.querySelector("[data-contact-message]");
    if (message) {
      message.textContent = "Thank you. Your email app is opening with the enquiry ready.";
    }
    window.location.href = `mailto:reach@nidhimittal.com?subject=${subject}&body=${body}`;
  });
}
