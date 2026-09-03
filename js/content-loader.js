// content-loader.js
// Fetches content managed through the /admin CMS and renders it into
// designated placeholder containers on the page. Runs on every page
// that includes this script; each function simply exits early if the
// relevant container isn't present on that page.

(function () {
  async function fetchJSON(url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function escapeHTML(str) {
    if (str === undefined || str === null) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Ministry / Mission section (homepage) ----------
  async function loadMinistry() {
    const el = document.getElementById("ministry-content");
    if (!el) return;
    const data = await fetchJSON("/content/homepage/ministry.json");
    if (!data) return;
    el.innerHTML = `
      <p>${escapeHTML(data.intro)}</p>
      <p class="emphasis">${escapeHTML(data.emphasis)}</p>
    `;
  }

  // ---------- Bio section (homepage) ----------
  async function loadBio() {
    const blockEl = document.getElementById("bio-block");
    if (!blockEl) return;
    const data = await fetchJSON("/content/homepage/bio.json");
    if (!data) return;

    const photoEl = document.getElementById("bio-photo");
    if (photoEl && data.photo) {
      photoEl.src = data.photo;
    }

    const paragraphs = data.paragraphs || [];
    blockEl.innerHTML = paragraphs
      .map((p, i) => {
        const bullet = i > 0 ? '<p class="bio-bullet">&#8226;</p>' : "";
        return `${bullet}<p>${escapeHTML(p.text)}</p>`;
      })
      .join("");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  // ---------- Sermons ----------
  function renderSermonItem(sermon) {
    const scripture = sermon.scripture
      ? `<p class="sermon-scripture">${escapeHTML(sermon.scripture)}</p>`
      : "";
    const link = sermon.videoUrl
      ? `&nbsp;&nbsp;<a href="${escapeHTML(
          sermon.videoUrl
        )}" class="link-underline" target="_blank" rel="noopener noreferrer">Watch this Sermon Now</a>`
      : "";
    const dateLabel = formatDate(sermon.date);
    const metaLine = dateLabel
      ? `${escapeHTML(sermon.church)} &middot; ${escapeHTML(sermon.location)} &middot; ${escapeHTML(dateLabel)}`
      : `${escapeHTML(sermon.church)} &middot; ${escapeHTML(sermon.location)}`;
    return `
      <article class="sermon-item">
        <img src="${escapeHTML(sermon.image)}" alt="${escapeHTML(
      sermon.title
    )}" width="165" height="165">
        <div>
          <p class="sermon-meta">${metaLine}</p>
          <h3>${escapeHTML(sermon.title)}</h3>
          ${scripture}
          <p>${escapeHTML(sermon.description)}${link}</p>
        </div>
      </article>
    `;
  }

  async function loadSermons() {
    const homeList = document.getElementById("sermon-list-home");
    const archiveList = document.getElementById("sermon-list-archive");
    if (!homeList && !archiveList) return;

    const sermons = await fetchJSON("/data/sermons.json");
    if (!sermons) return;

    if (homeList) {
      homeList.innerHTML = sermons.slice(0, 3).map(renderSermonItem).join("");
    }
    if (archiveList) {
      archiveList.innerHTML = sermons.map(renderSermonItem).join("");
    }
  }

  // ---------- Resources ----------
  function renderResourceItem(resource) {
    const isBook = resource.coverType === "book";
    const imgClass = isBook ? "resource-item-book" : "resource-item-square";
    const width = 165;
    const height = isBook ? 264 : 165;
    return `
      <article class="resource-item">
        <img src="${escapeHTML(resource.image)}" alt="${escapeHTML(
      resource.title
    )}" width="${width}" height="${height}" class="${imgClass}">
        <div>
          <h3>${escapeHTML(resource.title)}</h3>
          <p class="resource-author">by ${escapeHTML(resource.author)}</p>
          <p>${escapeHTML(resource.description)}</p>
        </div>
      </article>
    `;
  }

  async function loadResources() {
    const homeList = document.getElementById("resource-list-home");
    const archiveList = document.getElementById("resource-list-archive");
    if (!homeList && !archiveList) return;

    const resources = await fetchJSON("/data/resources.json");
    if (!resources) return;

    if (homeList) {
      homeList.innerHTML = resources.slice(0, 2).map(renderResourceItem).join("");
    }
    if (archiveList) {
      archiveList.innerHTML = resources.map(renderResourceItem).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadMinistry();
    loadBio();
    loadSermons();
    loadResources();
  });
})();
