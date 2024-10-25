const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,       
    user: process.env.DB_USER,          
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection error: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id " + db.threadId);
});

app.post("/api/saveProductDetails", (req, res) => {
    const productDetails = req.body;

    const price = parseInt(productDetails.price.replace(/[$,]/g, ''), 10); 
    // can update/insert the product
    const query = `
        INSERT INTO products (productId, name, price, imageUrl, rating, description, breadcrumbs, siteId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            price = VALUES(price),
            imageUrl = VALUES(imageUrl),
            rating = VALUES(rating),
            description = VALUES(description),
            breadcrumbs = VALUES(breadcrumbs), 
            updatedAt = NOW();
    `;

    db.query(query, [
        productDetails.productId,
        productDetails.name,
        price,
        productDetails.imageUrl,
        productDetails.rating,
        productDetails.description,
        JSON.stringify(productDetails.breadcrumbs),  
        productDetails.siteId
    ], (err, result) => {
        if (err) {
            console.error("Error saving product details: ", err);
            return res.status(500).json({ error: "Error saving product details." });
        }
        console.log("Product details saved/updated: ", result);
        res.status(200).json({ message: "Product details saved/updated successfully!" });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
