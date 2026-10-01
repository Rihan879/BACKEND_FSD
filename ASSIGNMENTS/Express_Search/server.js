import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ─── File Registry ────────────────────────────────────────────────────────────
// Each entry describes a downloadable file stored in /public/files/
const FILES = [
  {
    id: 1,
    name: "JavaScript Cheatsheet",
    description: "Quick reference for JavaScript ES6+ syntax, methods, and patterns.",
    category: "Programming",
    tags: ["javascript", "js", "es6", "cheatsheet", "frontend"],
    filename: "javascript-cheatsheet.txt",
    size: "8 KB",
    icon: "📄",
  },
  {
    id: 2,
    name: "Node.js & Express Guide",
    description: "A beginner-friendly guide to building REST APIs with Node and Express.",
    category: "Backend",
    tags: ["nodejs", "express", "api", "backend", "rest"],
    filename: "nodejs-express-guide.txt",
    size: "12 KB",
    icon: "📘",
  },
  {
    id: 3,
    name: "CSS Tricks & Tips",
    description: "Handy CSS snippets for layouts, animations, and responsive design.",
    category: "Design",
    tags: ["css", "flexbox", "grid", "animation", "responsive", "frontend"],
    filename: "css-tricks.txt",
    size: "6 KB",
    icon: "🎨",
  },
  {
    id: 4,
    name: "Git Commands Reference",
    description: "Essential Git commands for version control and team collaboration.",
    category: "Tools",
    tags: ["git", "github", "version control", "commands", "devops"],
    filename: "git-commands.txt",
    size: "5 KB",
    icon: "🔧",
  },
  {
    id: 5,
    name: "React Quick Start",
    description: "Get started with React: components, hooks, state, and props explained.",
    category: "Frontend",
    tags: ["react", "jsx", "hooks", "frontend", "javascript", "components"],
    filename: "react-quickstart.txt",
    size: "10 KB",
    icon: "⚛️",
  },
  {
    id: 6,
    name: "MongoDB Basics",
    description: "Introduction to MongoDB: CRUD operations, queries, and aggregation.",
    category: "Database",
    tags: ["mongodb", "database", "nosql", "crud", "queries"],
    filename: "mongodb-basics.txt",
    size: "9 KB",
    icon: "🗄️",
  },
  {
    id: 7,
    name: "HTTP Status Codes",
    description: "Complete list of HTTP status codes with descriptions and use cases.",
    category: "Web",
    tags: ["http", "status codes", "api", "web", "rest"],
    filename: "http-status-codes.txt",
    size: "4 KB",
    icon: "🌐",
  },
  {
    id: 8,
    name: "Python Basics",
    description: "Core Python syntax, data types, loops, functions, and OOP concepts.",
    category: "Programming",
    tags: ["python", "programming", "beginner", "syntax", "oop"],
    filename: "python-basics.txt",
    size: "11 KB",
    icon: "🐍",
  },
];

// ─── Search API ───────────────────────────────────────────────────────────────
app.get("/api/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase().trim();
  const category = (req.query.category || "").toLowerCase().trim();

  let results = FILES;

  if (query) {
    results = results.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.tags.some((t) => t.includes(query)) ||
        f.category.toLowerCase().includes(query)
    );
  }

  if (category && category !== "all") {
    results = results.filter((f) => f.category.toLowerCase() === category);
  }

  res.json({ results, total: results.length, query });
});

// ─── All Files API ────────────────────────────────────────────────────────────
app.get("/api/files", (req, res) => {
  res.json({ files: FILES, total: FILES.length });
});

// ─── Download Route ───────────────────────────────────────────────────────────
app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  // Security: only allow known filenames
  const file = FILES.find((f) => f.filename === filename);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }
  const filePath = path.join(__dirname, "public", "files", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File missing on server" });
  }
  res.download(filePath, filename);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
});