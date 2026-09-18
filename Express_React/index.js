import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());


// GET - Get all products
app.get("/api/products", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    const products = JSON.parse(data);

    res.json(products);
});


// POST - Add a new product
app.post("/api/products", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    const products = JSON.parse(data);

    const newProduct = {
        id: products.length > 0
            ? products[products.length - 1].id + 1
            : 1,

        name: req.body.name,
        price: req.body.price
    };

    products.push(newProduct);

    fs.writeFileSync(
        "product.json",
        JSON.stringify(products, null, 2)
    );

    res.json({
        message: "Product added successfully",
        product: newProduct
    });
});


// DELETE - Delete product by id
app.delete("/api/products/:id", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    let products = JSON.parse(data);

    const id = parseInt(req.params.id);

    products = products.filter(
        (product) => product.id !== id
    );

    fs.writeFileSync(
        "product.json",
        JSON.stringify(products, null, 2)
    );

    res.json({
        message: "Product deleted successfully"
    });
});


// Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});