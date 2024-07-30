import http from "http";
import fs from "fs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";

const app = express();
const port = 3000;

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layout/layout"); // Default layout file

// Serve static files (for images, CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Route for home page
app.get("/", (req, res) => {
    res.render("index", {
        nama: "Hans",
        layout: "layout/layout",
    });
});

// Route for contact page
app.get("/contact", (req, res) => {
    fs.readFile(
        path.join(__dirname, "data", "contacts.json"),
        "utf-8",
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Server Error");
                return;
            }
            const contacts = JSON.parse(data);
            res.render("contact", { contacts });
        }
    );
});

// Route definition for product with productId and categoryId
app.get("/product/:productId/category/:categoryId", (req, res) => {
    const productId = req.params.productId;
    const categoryId = req.params.categoryId;
    const price = req.query.price; // Accessing query parameter 'price'

    let response = `Product ID: ${productId}, Category ID: ${categoryId}`;
    if (price) {
        response += `, Price: ${price}`;
    }

    res.send(response);
});

app.use((req, res, next) => {
    console.log("Time:", Date.now());
    next();
});

// Serve static files from 'static' directory
app.use(express.static(path.join(__dirname, "public123")));
// morgan.dev("tiny");
// app.use(express.static("public"));

// Update the about route to use the new path
app.get("/about", (req, res) => {
    const aboutData = {
        name: "Hans",
        description:
            "A passionate developer with a love for coding and technology.",
        picture: "/images/avatar.jpg", // Updated path
    };
    res.render("about", aboutData);
});

// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
