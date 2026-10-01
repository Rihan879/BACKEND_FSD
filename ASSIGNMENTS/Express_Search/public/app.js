/* ═══════════════════════════════════════════════════════════════════════════
   FileSearch — Client-Side Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

const searchInput  = document.getElementById("searchInput");
const clearBtn     = document.getElementById("clearBtn");
const categoryPills = document.querySelectorAll(".pill");
const cardGrid     = document.getElementById("cardGrid");
const skeletonGrid = document.getElementById("skeletonGrid");
const emptyState   = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");

let debounceTimer = null;
let activeCategory = "all";

// ── Boot: load all files ────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  fetchAndRender("", "all");
});

// ── Search Input ────────────────────────────────────────────────────────────
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  clearBtn.classList.toggle("visible", q.length > 0);

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchAndRender(q, activeCategory);
  }, 300);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") resetSearch();
});

// ── Clear Button ─────────────────────────────────────────────────────────────
clearBtn.addEventListener("click", resetSearch);

// ── Category Pills ───────────────────────────────────────────────────────────
categoryPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    categoryPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.dataset.cat;
    fetchAndRender(searchInput.value.trim(), activeCategory);
  });
});

// ── Fetch & Render ───────────────────────────────────────────────────────────
async function fetchAndRender(query, category) {
  showSkeleton();

  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category && category !== "all") params.set("category", category);

  try {
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    renderCards(data.results, query);
  } catch (err) {
    console.error("Search error:", err);
    showEmpty();
  }
}

// ── Render Cards ─────────────────────────────────────────────────────────────
function renderCards(files, query = "") {
  hideSkeleton();

  if (!files.length) {
    showEmpty();
    return;
  }

  emptyState.classList.add("hidden");
  cardGrid.classList.remove("hidden");

  resultsCount.innerHTML = `Showing <strong>${files.length}</strong> file${files.length !== 1 ? "s" : ""}${query ? ` for "<strong>${escapeHtml(query)}</strong>"` : ""}`;

  cardGrid.innerHTML = files.map((f) => `
    <div class="card">
      <div class="card-top">
        <span class="card-emoji">${f.icon}</span>
        <div>
          <div class="card-title">${highlight(f.name, query)}</div>
          <span class="card-category">${f.category}</span>
        </div>
      </div>
      <p class="card-desc">${highlight(f.description, query)}</p>
      <div class="card-tags">
        ${f.tags.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="card-footer">
        <span class="card-size">📁 ${f.size}</span>
        <a class="download-btn" href="/download/${f.filename}" download>
          <i class="fa fa-download"></i> Download
        </a>
      </div>
    </div>
  `).join("");
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped.replace(new RegExp(`(${escapedQuery})`, "gi"), "<mark>$1</mark>");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showSkeleton() {
  skeletonGrid.classList.remove("hidden");
  cardGrid.classList.add("hidden");
  emptyState.classList.add("hidden");
}

function hideSkeleton() {
  skeletonGrid.classList.add("hidden");
}

function showEmpty() {
  hideSkeleton();
  cardGrid.classList.add("hidden");
  emptyState.classList.remove("hidden");
  resultsCount.innerHTML = "No results found";
}

function resetSearch() {
  searchInput.value = "";
  clearBtn.classList.remove("visible");
  categoryPills.forEach((p) => p.classList.remove("active"));
  document.querySelector('.pill[data-cat="all"]').classList.add("active");
  activeCategory = "all";
  fetchAndRender("", "all");
}

// Make resetSearch globally accessible (used in HTML onclick)
window.resetSearch = resetSearch;
