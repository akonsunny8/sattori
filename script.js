const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroDots = document.querySelectorAll("[data-hero-dot]");
let heroSlideIndex = 0;

function setHeroSlide(index) {
  if (!heroSlides.length) return;
  heroSlideIndex = index % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === heroSlideIndex);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === heroSlideIndex);
  });
}

if (heroSlides.length) {
  window.setInterval(() => {
    setHeroSlide(heroSlideIndex + 1);
  }, 3600);
}

const coverSlides = document.querySelectorAll("[data-cover-slide]");
let coverSlideIndex = 0;

function setCoverSlide(index) {
  if (!coverSlides.length) return;
  coverSlideIndex = index % coverSlides.length;
  coverSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === coverSlideIndex);
  });
}

if (coverSlides.length) {
  window.setInterval(() => {
    setCoverSlide(coverSlideIndex + 1);
  }, 4800);
}

document.querySelectorAll("[data-card-link]").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    window.location.href = card.dataset.cardLink;
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = card.dataset.cardLink;
    }
  });
});

const revealItems = document.querySelectorAll(
  ".reveal, main > section, .narrative-card, .program-feature-grid article, .program-detail-list p, .impact-story-track article",
);

revealItems.forEach((item) => item.classList.add("smooth-reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible", "smooth-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.16 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible", "smooth-visible"));
}

const filters = document.querySelectorAll("[data-filter]");
const articles = document.querySelectorAll("[data-category]");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;
    applyBlogFilter(category);
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

const contactForms = document.querySelectorAll("[data-contact-form]");

function showContactThanks() {
  let popup = document.querySelector("[data-contact-thanks]");
  if (!popup) {
    popup = document.createElement("div");
    popup.className = "contact-thanks";
    popup.dataset.contactThanks = "";
    popup.setAttribute("role", "status");
    popup.setAttribute("aria-live", "polite");
    popup.innerHTML = `
      <div class="contact-thanks-card">
        <button type="button" aria-label="Close message" data-contact-thanks-close>&times;</button>
        <p>Thanks for writing and I will get back to you.</p>
      </div>
    `;
    document.body.appendChild(popup);
    popup.querySelector("[data-contact-thanks-close]")?.addEventListener("click", () => {
      popup.classList.remove("show");
    });
  }

  popup.classList.add("show");
  window.clearTimeout(showContactThanks.timer);
  showContactThanks.timer = window.setTimeout(() => {
    popup.classList.remove("show");
  }, 5200);
}

contactForms.forEach((contactForm) => {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Sattori enquiry: ${data.get("service")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\nStory:\n${data.get("message")}`,
    );
    const message = contactForm.querySelector("[data-contact-message]");
    if (message) {
      message.textContent = "Thanks for writing and I will get back to you.";
    }
    showContactThanks();
    window.setTimeout(() => {
      window.location.href = `mailto:reach@nidhimittal.com?subject=${subject}&body=${body}`;
    }, 900);
  });
});

const blogStoreKey = "sattori.blogPosts";
const adminSessionKey = "sattori.adminUnlocked";
const adminPassword = "Sattori@123";
const categoryLabels = {
  marketing: "Marketing mastery",
  brand: "Personal brand building",
  journal: "Nidhi's journal entries",
};

function readBlogPosts() {
  try {
    return JSON.parse(localStorage.getItem(blogStoreKey) || "[]");
  } catch {
    return [];
  }
}

function writeBlogPosts(posts) {
  localStorage.setItem(blogStoreKey, JSON.stringify(posts));
  window.dispatchEvent(new CustomEvent("sattori:blogs-updated"));
}

function makePostId(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${slug || "post"}-${Date.now()}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function paragraphsFromText(value) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function createPublicPostCard(post) {
  const article = document.createElement("article");
  article.className = "article-card live-post";
  article.id = post.id;
  article.dataset.category = post.category;
  const formattedDate = post.updatedAt
    ? new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(post.updatedAt))
    : "New note";
  article.innerHTML = `
    <figure class="article-card-image">
      <img src="assets/brand-awakening-blocks.jpg" alt="" />
    </figure>
    <div class="article-meta">
      <span>${categoryLabels[post.category] || "Brand insight"}</span>
      <time>${formattedDate}</time>
    </div>
    <h2>${escapeHtml(post.title)}</h2>
    <p>${escapeHtml(post.excerpt)}</p>
    <button class="text-link" type="button" data-expand>Read More</button>
    <div class="article-more">${paragraphsFromText(post.body)}</div>
  `;
  return article;
}

function currentBlogFilter() {
  return document.querySelector(".filter.active")?.dataset.filter || "all";
}

function applyBlogFilter(category = currentBlogFilter()) {
  document.querySelectorAll("[data-category]").forEach((article) => {
    article.classList.toggle("hidden", category !== "all" && article.dataset.category !== category);
  });
}

function renderPublicPosts() {
  const mount = document.querySelector("[data-live-posts]");
  if (!mount) return;

  const publishedPosts = readBlogPosts()
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  mount.replaceChildren(...publishedPosts.map(createPublicPostCard));
  mount.querySelectorAll("[data-expand]").forEach((button) => {
    button.dataset.closedLabel = button.textContent;
    button.addEventListener("click", () => {
      const card = button.closest(".article-card");
      const expanded = card.classList.toggle("expanded");
      button.textContent = expanded ? "Close note" : button.dataset.closedLabel;
    });
  });
  applyBlogFilter();
}

function renderAdminPosts() {
  const list = document.querySelector("[data-admin-posts]");
  if (!list) return;

  const posts = readBlogPosts().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (!posts.length) {
    list.innerHTML = `<p class="admin-empty">No posts yet. Write your first one and publish when it is ready.</p>`;
    return;
  }

  list.innerHTML = posts
    .map(
      (post) => `
        <article class="admin-post" data-admin-post-id="${post.id}">
          <div>
            <span>${post.status === "published" ? "Published" : "Draft"} / ${categoryLabels[post.category]}</span>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.excerpt)}</p>
          </div>
          <div class="admin-post-actions">
            <button class="text-link" type="button" data-edit-post="${post.id}">Edit</button>
            <button class="text-link" type="button" data-toggle-post="${post.id}">
              ${post.status === "published" ? "Unpublish" : "Publish"}
            </button>
            <button class="text-link danger-link" type="button" data-delete-post="${post.id}">Delete</button>
          </div>
        </article>
      `,
    )
    .join("");
}

const blogAdminForm = document.querySelector("[data-blog-admin-form]");
const adminLoginForm = document.querySelector("[data-admin-login-form]");
const adminLoginPanel = document.querySelector("[data-admin-login-panel]");
const adminContent = document.querySelector("[data-admin-content]");

function isAdminUnlocked() {
  return sessionStorage.getItem(adminSessionKey) === "true";
}

function setAdminUnlocked(unlocked) {
  if (!adminLoginPanel || !adminContent) return;
  adminLoginPanel.hidden = unlocked;
  adminContent.hidden = !unlocked;
  if (unlocked) {
    renderAdminPosts();
  }
}

if (adminLoginForm) {
  const loginMessage = document.querySelector("[data-login-message]");
  setAdminUnlocked(isAdminUnlocked());

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = new FormData(adminLoginForm).get("password");
    if (password === adminPassword) {
      sessionStorage.setItem(adminSessionKey, "true");
      adminLoginForm.reset();
      if (loginMessage) {
        loginMessage.textContent = "";
      }
      setAdminUnlocked(true);
    } else if (loginMessage) {
      loginMessage.textContent = "Incorrect password. Please try again.";
    }
  });

  document.querySelector("[data-admin-logout]")?.addEventListener("click", () => {
    sessionStorage.removeItem(adminSessionKey);
    resetBlogForm();
    setAdminUnlocked(false);
  });
}

function resetBlogForm() {
  if (!blogAdminForm) return;
  blogAdminForm.reset();
  blogAdminForm.elements.id.value = "";
}

if (blogAdminForm) {
  const message = document.querySelector("[data-admin-message]");

  blogAdminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isAdminUnlocked()) return;
    const submitter = event.submitter;
    const data = new FormData(blogAdminForm);
    const id = data.get("id") || makePostId(data.get("title"));
    const posts = readBlogPosts();
    const existingIndex = posts.findIndex((post) => post.id === id);
    const existing = posts[existingIndex] || {};
    const post = {
      ...existing,
      id,
      title: data.get("title").trim(),
      category: data.get("category"),
      excerpt: data.get("excerpt").trim(),
      body: data.get("body").trim(),
      status: submitter?.value || "draft",
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.push(post);
    }

    writeBlogPosts(posts);
    renderAdminPosts();
    resetBlogForm();
    if (message) {
      message.textContent = post.status === "published" ? "Published. The blog page has updated." : "Draft saved.";
    }
  });

  document.querySelector("[data-blog-reset]")?.addEventListener("click", resetBlogForm);

  document.addEventListener("click", (event) => {
    if (!isAdminUnlocked()) return;
    const editButton = event.target.closest("[data-edit-post]");
    const toggleButton = event.target.closest("[data-toggle-post]");
    const deleteButton = event.target.closest("[data-delete-post]");
    const posts = readBlogPosts();

    if (editButton) {
      const post = posts.find((item) => item.id === editButton.dataset.editPost);
      if (!post) return;
      blogAdminForm.elements.id.value = post.id;
      blogAdminForm.elements.title.value = post.title;
      blogAdminForm.elements.category.value = post.category;
      blogAdminForm.elements.excerpt.value = post.excerpt;
      blogAdminForm.elements.body.value = post.body;
      blogAdminForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (toggleButton) {
      const nextPosts = posts.map((post) =>
        post.id === toggleButton.dataset.togglePost
          ? {
              ...post,
              status: post.status === "published" ? "draft" : "published",
              updatedAt: new Date().toISOString(),
            }
          : post,
      );
      writeBlogPosts(nextPosts);
      renderAdminPosts();
    }

    if (deleteButton) {
      const nextPosts = posts.filter((post) => post.id !== deleteButton.dataset.deletePost);
      writeBlogPosts(nextPosts);
      renderAdminPosts();
    }
  });

  if (isAdminUnlocked()) {
    renderAdminPosts();
  }
}

renderPublicPosts();

window.addEventListener("storage", (event) => {
  if (event.key === blogStoreKey) {
    renderPublicPosts();
    renderAdminPosts();
  }
});

window.addEventListener("sattori:blogs-updated", () => {
  renderPublicPosts();
  renderAdminPosts();
});
