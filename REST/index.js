import express from 'express';
const app = express();
app.use(express.json());
let users = [
    { id: 1, name: "Rihan", email: "rihan@gmail.com" },
    { id: 2, name: "saifi", email: "saifi@gmail.com" }
];

// GET: Fetch all users
app.get('/users', (req, res) => {
    res.json(users);
});

// POST: Create a new user
app.post('/users', (req, res) => {
    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(user);
    res.json(user);
});

// PUT: Update a user
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    res.json(user);
});

// DELETE: Delete a user
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    users = users.filter(user => user.id !== id);
    res.send("User deleted successfully");
});

app.listen(8000, () => {
    console.log("Server is running on port: http://localhost:8000");
});

//Create a PRODUCT REST API and test all in Thunder Client
//work it on approx 100 product and test all the methods in Thunder