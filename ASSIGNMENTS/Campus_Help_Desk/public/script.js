// ==========================================================
// CAMPUS HELP DESK - INTERACTIVE APPLICATION CONTROLLER
// ==========================================================

// Global State
let allRequests = [];
let currentStatusFilter = "ALL";
let currentViewMode = localStorage.getItem("campus_view_mode") || "board"; // 'board' or 'grid'

// DOM Elements
const requestForm = document.getElementById("requestForm");
const ticketsDisplayContainer = document.getElementById("ticketsDisplayContainer");
const requestCounter = document.getElementById("requestCounter");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");
const sortBy = document.getElementById("sortBy");
const refreshBtn = document.getElementById("refreshBtn");

// Metrics
const statTotal = document.getElementById("statTotal");
const statOpen = document.getElementById("statOpen");
const statProgress = document.getElementById("statProgress");
const statResolved = document.getElementById("statResolved");
const metricCards = document.querySelectorAll(".metric-card");

// Form Interactive Pickers
const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const categoryChips = document.querySelectorAll("#categoryChips .chip");
const prioritySegments = document.querySelectorAll("#prioritySegments .priority-btn");
const descriptionInput = document.getElementById("description");
const charCounter = document.getElementById("charCounter");
const formResetBtn = document.getElementById("formResetBtn");

// View Toggle
const viewModeBoard = document.getElementById("viewModeBoard");
const viewModeGrid = document.getElementById("viewModeGrid");

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeLabelText = document.getElementById("themeLabelText");

// Modal Elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const modalTitle = document.getElementById("modalTitle");

const editId = document.getElementById("editId");
const editStudentName = document.getElementById("editStudentName");
const editEmail = document.getElementById("editEmail");
const editCategory = document.getElementById("editCategory");
const editPriority = document.getElementById("editPriority");
const editStatus = document.getElementById("editStatus");
const editDescription = document.getElementById("editDescription");

// Toast Container
const toastContainer = document.getElementById("toastContainer");

// ==========================================================
// SVG ICONS DICTIONARY (Strictly Zero Emojis)
// ==========================================================
const ICONS = {
    edit: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    delete: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    email: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    calendar: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    arrowRight: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    check: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    rotate: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>`,
    success: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info: `<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    copy: `<svg class="svg-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
};

// ==========================================================
// 1. THEME CONTROLLER (Dark / Light)
// ==========================================================
function initTheme() {
    const savedTheme = localStorage.getItem("campus_theme") || "dark";
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("campus_theme", theme);
    if (themeLabelText) {
        themeLabelText.textContent = theme === "dark" ? "Dark" : "Light";
    }
}

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    showToast(`Switched to ${newTheme} mode`, "info");
});

// ==========================================================
// 2. VIEW TOGGLE (Kanban Board vs. Compact Grid)
// ==========================================================
function setViewMode(mode) {
    currentViewMode = mode;
    localStorage.setItem("campus_view_mode", mode);

    if (mode === "board") {
        viewModeBoard.classList.add("active-view");
        viewModeGrid.classList.remove("active-view");
    } else {
        viewModeGrid.classList.add("active-view");
        viewModeBoard.classList.remove("active-view");
    }
    applyFiltersAndRender();
}

viewModeBoard.addEventListener("click", () => setViewMode("board"));
viewModeGrid.addEventListener("click", () => setViewMode("grid"));

// ==========================================================
// 3. INTERACTIVE CHIPS & PRIORITY SEGMENTS PICKERS
// ==========================================================
categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        categoryChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        categorySelect.value = chip.getAttribute("data-value");
    });
});

prioritySegments.forEach((btn) => {
    btn.addEventListener("click", () => {
        prioritySegments.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        prioritySelect.value = btn.getAttribute("data-value");
    });
});

// Live Character Counter
descriptionInput.addEventListener("input", () => {
    const length = descriptionInput.value.length;
    charCounter.textContent = `${length} / 500`;
    if (length > 450) {
        charCounter.classList.add("warning");
    } else {
        charCounter.classList.remove("warning");
    }
});

// Form Reset
formResetBtn.addEventListener("click", () => {
    categoryChips.forEach((c) => c.classList.remove("active"));
    prioritySegments.forEach((b) => b.classList.remove("active"));
    categorySelect.value = "";
    prioritySelect.value = "";
    charCounter.textContent = "0 / 500";
    charCounter.classList.remove("warning");
});

// ==========================================================
// 4. INTERACTIVE METRIC CARDS (Filter by Clicking Metrics)
// ==========================================================
metricCards.forEach((card) => {
    card.addEventListener("click", () => {
        const status = card.getAttribute("data-filter-status");
        currentStatusFilter = status;

        metricCards.forEach((c) => c.classList.remove("active-metric"));
        card.classList.add("active-metric");

        applyFiltersAndRender();
        showToast(`Showing ${status === "ALL" ? "All" : status} requests`, "info");
    });
});

// ==========================================================
// 5. GET: Fetch All Requests from Backend API
// ==========================================================
function getRequests() {
    fetch("/api/requests")
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then((data) => {
            allRequests = Array.isArray(data) ? data : [];
            updateMetrics(allRequests);
            applyFiltersAndRender();
        })
        .catch((error) => {
            console.error("Error loading requests:", error);
            showToast("Failed to load requests from server", "error");
            ticketsDisplayContainer.innerHTML = `
                <div class="empty-state-global">
                    <div class="empty-state-icon">${ICONS.info}</div>
                    <h3>Connection Error</h3>
                    <p>Unable to retrieve ticket data. Ensure the Express server is running on port 3000.</p>
                </div>
            `;
        });
}

// ==========================================================
// 6. POST: Create New Request via Backend API
// ==========================================================
requestForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const description = descriptionInput.value.trim();

    if (!studentName || !email || !category || !priority || !description) {
        showToast("Please complete all required fields", "error");
        return;
    }

    const payload = {
        studentName,
        email,
        category,
        priority,
        description
    };

    fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((err) => {
                    throw new Error(err.error || "Failed to create request");
                });
            }
            return res.json();
        })
        .then((newTicket) => {
            showToast(`Ticket #REQ-${String(newTicket.id).padStart(3, "0")} created!`, "success");
            requestForm.reset();
            formResetBtn.click();
            getRequests();
        })
        .catch((err) => {
            console.error("Submission failed:", err);
            showToast(err.message || "Failed to create ticket", "error");
        });
});

// ==========================================================
// 7. GET Single & Open Edit Modal
// ==========================================================
function editRequest(id) {
    fetch(`/api/requests/${id}`)
        .then((res) => {
            if (!res.ok) throw new Error("Could not retrieve ticket details");
            return res.json();
        })
        .then((request) => {
            editId.value = request.id;
            editStudentName.value = request.studentName;
            editEmail.value = request.email;
            editCategory.value = request.category;
            editPriority.value = request.priority;
            editStatus.value = request.status || "Open";
            editDescription.value = request.description;

            modalTitle.textContent = `Edit Ticket #REQ-${String(request.id).padStart(3, "0")}`;
            openModal();
        })
        .catch((err) => {
            console.error(err);
            showToast("Failed to fetch ticket details", "error");
        });
}

// ==========================================================
// 8. PUT: Update Request via Modal
// ==========================================================
editForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = editId.value;
    const updatePayload = {
        studentName: editStudentName.value.trim(),
        email: editEmail.value.trim(),
        category: editCategory.value,
        priority: editPriority.value,
        status: editStatus.value,
        description: editDescription.value.trim()
    };

    fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((err) => {
                    throw new Error(err.error || "Failed to update ticket");
                });
            }
            return res.json();
        })
        .then((updated) => {
            closeModal();
            showToast(`Ticket #REQ-${String(updated.id).padStart(3, "0")} updated`, "success");
            getRequests();
        })
        .catch((err) => {
            console.error(err);
            showToast(err.message || "Update failed", "error");
        });
});

// ==========================================================
// 9. QUICK STATUS STEPPER (1-Click Advance via PUT API)
// ==========================================================
function advanceStatus(id, currentStatus) {
    let nextStatus = "In Progress";
    if (currentStatus === "In Progress") nextStatus = "Resolved";
    else if (currentStatus === "Resolved") nextStatus = "Open";

    fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
    })
        .then((res) => {
            if (!res.ok) throw new Error("Status update failed");
            return res.json();
        })
        .then((updated) => {
            showToast(`Ticket #REQ-${String(id).padStart(3, "0")} moved to "${nextStatus}"`, "success");
            getRequests();
        })
        .catch((err) => {
            console.error(err);
            showToast("Failed to change status", "error");
        });
}

// ==========================================================
// 10. DELETE: Remove Ticket via API
// ==========================================================
function deleteRequest(id) {
    const isConfirmed = confirm(`Delete ticket #REQ-${String(id).padStart(3, "0")} permanently?`);
    if (!isConfirmed) return;

    fetch(`/api/requests/${id}`, {
        method: "DELETE"
    })
        .then((res) => {
            if (!res.ok) throw new Error("Delete failed");
            return res.json();
        })
        .then(() => {
            showToast(`Ticket #REQ-${String(id).padStart(3, "0")} deleted`, "success");
            getRequests();
        })
        .catch((err) => {
            console.error(err);
            showToast("Failed to delete ticket", "error");
        });
}

// Copy Ticket Code helper
function copyTicketCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`Copied ${code} to clipboard`, "info");
    }).catch(() => {
        showToast(`Selected ${code}`, "info");
    });
}

// Expose functions for inline HTML calls
window.editRequest = editRequest;
window.deleteRequest = deleteRequest;
window.advanceStatus = advanceStatus;
window.copyTicketCode = copyTicketCode;

// ==========================================================
// 11. FILTERING, SORTING & RENDERING LOGIC
// ==========================================================
function applyFiltersAndRender() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = filterCategory.value;
    const selectedPriority = filterPriority.value;
    const sortVal = sortBy.value;

    // Show/hide clear search icon
    if (query) {
        clearSearchBtn.classList.add("show");
    } else {
        clearSearchBtn.classList.remove("show");
    }

    let filtered = allRequests.filter((item) => {
        const itemStatus = (item.status || "Open");
        const matchesStatus =
            currentStatusFilter === "ALL" ||
            itemStatus.toLowerCase() === currentStatusFilter.toLowerCase();

        const matchesCategory =
            selectedCategory === "ALL" || item.category === selectedCategory;

        const matchesPriority =
            selectedPriority === "ALL" || item.priority === selectedPriority;

        const codeStr = `REQ-${String(item.id).padStart(3, "0")}`;
        const matchesSearch =
            !query ||
            (item.studentName && item.studentName.toLowerCase().includes(query)) ||
            (item.email && item.email.toLowerCase().includes(query)) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            (item.category && item.category.toLowerCase().includes(query)) ||
            codeStr.toLowerCase().includes(query) ||
            String(item.id).includes(query);

        return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
    });

    // Sorting
    filtered.sort((a, b) => {
        if (sortVal === "newest") {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortVal === "oldest") {
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortVal === "priority-desc") {
            const weights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
            return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        if (sortVal === "priority-asc") {
            const weights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
            return (weights[a.priority] || 0) - (weights[b.priority] || 0);
        }
        return 0;
    });

    requestCounter.textContent = `${filtered.length} of ${allRequests.length} tickets`;

    if (currentViewMode === "board") {
        renderKanbanBoard(filtered);
    } else {
        renderGridView(filtered);
    }
}

// ----------------------------------------------------------
// RENDER KANBAN BOARD
// ----------------------------------------------------------
function renderKanbanBoard(tickets) {
    const openTickets = tickets.filter((t) => (t.status || "Open").toLowerCase() === "open");
    const progressTickets = tickets.filter((t) => (t.status || "").toLowerCase() === "in progress");
    const resolvedTickets = tickets.filter((t) => (t.status || "").toLowerCase() === "resolved");

    ticketsDisplayContainer.innerHTML = `
        <div class="kanban-board">
            <!-- Open Column -->
            <div class="kanban-col">
                <div class="kanban-col-header header-open">
                    <div class="kanban-col-title">
                        <span class="col-indicator col-open"></span>
                        <span>Open</span>
                    </div>
                    <span class="col-badge">${openTickets.length}</span>
                </div>
                <div class="kanban-cards-stack">
                    ${openTickets.length > 0 
                        ? openTickets.map((t) => renderTicketCardHtml(t)).join("") 
                        : `<div class="empty-col-message">No open tickets</div>`
                    }
                </div>
            </div>

            <!-- In Progress Column -->
            <div class="kanban-col">
                <div class="kanban-col-header header-progress">
                    <div class="kanban-col-title">
                        <span class="col-indicator col-progress"></span>
                        <span>In Progress</span>
                    </div>
                    <span class="col-badge">${progressTickets.length}</span>
                </div>
                <div class="kanban-cards-stack">
                    ${progressTickets.length > 0 
                        ? progressTickets.map((t) => renderTicketCardHtml(t)).join("") 
                        : `<div class="empty-col-message">No active tickets</div>`
                    }
                </div>
            </div>

            <!-- Resolved Column -->
            <div class="kanban-col">
                <div class="kanban-col-header header-resolved">
                    <div class="kanban-col-title">
                        <span class="col-indicator col-resolved"></span>
                        <span>Resolved</span>
                    </div>
                    <span class="col-badge">${resolvedTickets.length}</span>
                </div>
                <div class="kanban-cards-stack">
                    ${resolvedTickets.length > 0 
                        ? resolvedTickets.map((t) => renderTicketCardHtml(t)).join("") 
                        : `<div class="empty-col-message">No resolved tickets</div>`
                    }
                </div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------------
// RENDER GRID VIEW
// ----------------------------------------------------------
function renderGridView(tickets) {
    if (tickets.length === 0) {
        ticketsDisplayContainer.innerHTML = `
            <div class="empty-state-global">
                <div class="empty-state-icon">${ICONS.info}</div>
                <h3>No Matching Tickets</h3>
                <p>Try adjusting your search keywords, priority, or category filters.</p>
            </div>
        `;
        return;
    }

    ticketsDisplayContainer.innerHTML = `
        <div class="tickets-grid-view">
            ${tickets.map((t) => renderTicketCardHtml(t)).join("")}
        </div>
    `;
}

// ----------------------------------------------------------
// HTML GENERATOR FOR INDIVIDUAL TICKET CARD
// ----------------------------------------------------------
function renderTicketCardHtml(t) {
    const priorityKey = (t.priority || "Low").toLowerCase();
    let priorityClass = "p-tag-low";
    if (priorityKey === "medium") priorityClass = "p-tag-medium";
    if (priorityKey === "high") priorityClass = "p-tag-high";
    if (priorityKey === "urgent") priorityClass = "p-tag-urgent";

    const formattedDate = t.createdAt
        ? new Date(t.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
          })
        : "Recently";

    const initials = getInitials(t.studentName);
    const code = `#REQ-${String(t.id).padStart(3, "0")}`;
    const status = t.status || "Open";

    // Stepper Button Label
    let stepperText = "Start Progress";
    let stepperIcon = ICONS.arrowRight;
    if (status === "In Progress") {
        stepperText = "Resolve";
        stepperIcon = ICONS.check;
    } else if (status === "Resolved") {
        stepperText = "Reopen";
        stepperIcon = ICONS.rotate;
    }

    return `
        <div class="ticket-card" data-ticket-id="${t.id}">
            <div class="ticket-card-header">
                <span class="ticket-id-tag" onclick="copyTicketCode('${code}')" title="Click to copy ID">
                    ${code}
                </span>
                <div class="ticket-card-pills">
                    <span class="pill-chip pill-category-style">${escapeHtml(t.category)}</span>
                    <span class="pill-chip ${priorityClass}">
                        <span class="pulse-dot"></span>
                        <span>${escapeHtml(t.priority)}</span>
                    </span>
                </div>
            </div>

            <div class="ticket-student-row">
                <div class="avatar-circle">${initials}</div>
                <div class="student-text-group">
                    <div class="student-full-name">${escapeHtml(t.studentName)}</div>
                    <div class="student-contact-email">
                        ${ICONS.email}
                        <span>${escapeHtml(t.email)}</span>
                    </div>
                </div>
            </div>

            <div class="ticket-problem-box">${escapeHtml(t.description)}</div>

            <div class="ticket-card-footer">
                <div class="ticket-timestamp">
                    ${ICONS.calendar}
                    <span>${formattedDate}</span>
                </div>
                <div class="ticket-footer-actions">
                    <button class="btn-status-stepper" onclick="advanceStatus(${t.id}, '${status}')" title="Advance status">
                        ${stepperIcon}
                        <span>${stepperText}</span>
                    </button>
                    <button class="btn-card-action" onclick="editRequest(${t.id})" title="Edit ticket details">
                        ${ICONS.edit}
                    </button>
                    <button class="btn-card-action btn-del" onclick="deleteRequest(${t.id})" title="Delete ticket">
                        ${ICONS.delete}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------------
// METRIC COUNTERS
// ----------------------------------------------------------
function updateMetrics(requests) {
    const total = requests.length;
    let open = 0;
    let progress = 0;
    let resolved = 0;

    requests.forEach((r) => {
        const s = (r.status || "Open").toLowerCase();
        if (s === "open") open++;
        else if (s === "in progress") progress++;
        else if (s === "resolved") resolved++;
        else open++;
    });

    if (statTotal) statTotal.textContent = total;
    if (statOpen) statOpen.textContent = open;
    if (statProgress) statProgress.textContent = progress;
    if (statResolved) statResolved.textContent = resolved;
}

// Helpers
function getInitials(name) {
    if (!name) return "ST";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
}

function escapeHtml(text) {
    if (!text) return "";
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Modal Handlers
function openModal() {
    editModal.classList.add("active");
    editModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    editModal.classList.remove("active");
    editModal.setAttribute("aria-hidden", "true");
}

closeModalBtn.addEventListener("click", closeModal);
cancelEditBtn.addEventListener("click", closeModal);
editModal.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal();
});

// Search & Filter Events
searchInput.addEventListener("input", applyFiltersAndRender);
clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    applyFiltersAndRender();
});
filterCategory.addEventListener("change", applyFiltersAndRender);
filterPriority.addEventListener("change", applyFiltersAndRender);
sortBy.addEventListener("change", applyFiltersAndRender);
refreshBtn.addEventListener("click", () => {
    getRequests();
    showToast("Tickets refreshed from server", "info");
});

// Toast System
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = ICONS.info;
    if (type === "success") iconSvg = ICONS.success;
    if (type === "error") iconSvg = ICONS.error;

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(12px) scale(0.95)";
        toast.style.transition = "opacity 0.25s ease, transform 0.25s ease";
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

// Initialize
initTheme();
setViewMode(currentViewMode);
getRequests();