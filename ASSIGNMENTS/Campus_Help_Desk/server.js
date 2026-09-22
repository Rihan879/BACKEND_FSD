import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "requests.json");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Helper function to read requests from requests.json
function getRequestsData(callback) {
    fs.readFile(DATA_FILE, "utf-8", (err, data) => {
        if (err) {
            // If file does not exist, initialize it with an empty array
            if (err.code === "ENOENT") {
                const initialData = [];
                return fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), (writeErr) => {
                    if (writeErr) return callback(writeErr, null);
                    callback(null, initialData);
                });
            }
            return callback(err, null);
        }

        try {
            const requests = data.trim() ? JSON.parse(data) : [];
            callback(null, requests);
        } catch (parseError) {
            callback(parseError, null);
        }
    });
}

// Helper function to write requests to requests.json
function saveRequestsData(data, callback) {
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8", (err) => {
        callback(err);
    });
}

// 1. GET /api/requests - Get all requests
app.get("/api/requests", (req, res) => {
    getRequestsData((err, requests) => {
        if (err) {
            console.error("Error reading requests:", err);
            return res.status(500).json({ error: "Failed to read requests data" });
        }
        res.json(requests);
    });
});

// 2. GET /api/requests/:id - Get a single request by ID
app.get("/api/requests/:id", (req, res) => {
    const requestId = parseInt(req.params.id, 10);
    if (isNaN(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
    }

    getRequestsData((err, requests) => {
        if (err) {
            console.error("Error reading requests:", err);
            return res.status(500).json({ error: "Failed to read requests data" });
        }

        const request = requests.find((item) => item.id === requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.json(request);
    });
});

// 3. POST /api/requests - Create a new request
app.post("/api/requests", (req, res) => {
    const { studentName, email, category, description, priority } = req.body;

    // Validation
    if (!studentName || !email || !category || !description || !priority) {
        return res.status(400).json({
            error: "All fields are required: studentName, email, category, description, priority."
        });
    }

    getRequestsData((err, requests) => {
        if (err) {
            console.error("Error reading requests:", err);
            return res.status(500).json({ error: "Failed to read requests data" });
        }

        // Generate next ID
        const nextId = requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1;

        const newRequest = {
            id: nextId,
            studentName: studentName.trim(),
            email: email.trim(),
            category: category.trim(),
            description: description.trim(),
            priority: priority.trim(),
            status: req.body.status ? req.body.status.trim() : "Open",
            createdAt: new Date().toISOString()
        };

        requests.push(newRequest);

        saveRequestsData(requests, (saveErr) => {
            if (saveErr) {
                console.error("Error writing requests:", saveErr);
                return res.status(500).json({ error: "Failed to save new request" });
            }

            res.status(201).json(newRequest);
        });
    });
});

// 4. PUT /api/requests/:id - Update an existing request
app.put("/api/requests/:id", (req, res) => {
    const requestId = parseInt(req.params.id, 10);
    if (isNaN(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
    }

    getRequestsData((err, requests) => {
        if (err) {
            console.error("Error reading requests:", err);
            return res.status(500).json({ error: "Failed to read requests data" });
        }

        const index = requests.findIndex((item) => item.id === requestId);
        if (index === -1) {
            return res.status(404).json({ error: "Request not found" });
        }

        const existing = requests[index];
        const updatedRequest = {
            id: existing.id,
            studentName: req.body.studentName !== undefined ? req.body.studentName.trim() : existing.studentName,
            email: req.body.email !== undefined ? req.body.email.trim() : existing.email,
            category: req.body.category !== undefined ? req.body.category.trim() : existing.category,
            description: req.body.description !== undefined ? req.body.description.trim() : existing.description,
            priority: req.body.priority !== undefined ? req.body.priority.trim() : existing.priority,
            status: req.body.status !== undefined ? req.body.status.trim() : (existing.status || "Open"),
            createdAt: existing.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        requests[index] = updatedRequest;

        saveRequestsData(requests, (saveErr) => {
            if (saveErr) {
                console.error("Error updating requests:", saveErr);
                return res.status(500).json({ error: "Failed to update request" });
            }

            res.json(updatedRequest);
        });
    });
});

// 5. DELETE /api/requests/:id - Delete a request
app.delete("/api/requests/:id", (req, res) => {
    const requestId = parseInt(req.params.id, 10);
    if (isNaN(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
    }

    getRequestsData((err, requests) => {
        if (err) {
            console.error("Error reading requests:", err);
            return res.status(500).json({ error: "Failed to read requests data" });
        }

        const index = requests.findIndex((item) => item.id === requestId);
        if (index === -1) {
            return res.status(404).json({ error: "Request not found" });
        }

        const deletedRequest = requests.splice(index, 1)[0];

        saveRequestsData(requests, (saveErr) => {
            if (saveErr) {
                console.error("Error saving after delete:", saveErr);
                return res.status(500).json({ error: "Failed to delete request" });
            }

            res.json({ message: "Request deleted successfully", deletedRequest });
        });
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

export default app;