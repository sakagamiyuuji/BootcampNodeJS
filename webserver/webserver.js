import http from "http";
import fs from "fs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route for home page
app.get("/", (req, res) => {
    res.render("index", { nama: "Hans" });
});

// Route for about page
app.get("/about", (req, res) => {
    res.render("about");
});

// Route for contact page
app.get("/contact", (req, res) => {
    const listNama = [
        {
            nama: "Hans",
            email: "varian.khasira@gmail.com",
        },
        {
            nama: "Lisa",
            email: "lisa.blackpink@gmail.com",
        },
        {
            nama: "Random",
            email: "random.idea@gmail.com",
        },
    ];
    res.render("contact", { listNama });
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

// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// const server = http.createServer((req, res) => {
//     console.log("Received a request");

//     switch (req.url) {
//         case "/about":
//             renderHtml(path.join(dirPath, "about.html"), res);
//             break;
//         case "/contact":
//             renderHtml(path.join(dirPath, "contact.html"), res);
//             break;
//         default:
//             renderHtml(path.join(dirPath, "index.html"), res);
//             break;
//     }
// });

// server.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

// const renderHtml = (filePath, res) => {
//     fs.readFile(filePath, (err, data) => {
//         if (err) {
//             console.error(`Error reading file ${filePath}: ${err}`);
//             res.writeHead(404, { "Content-Type": "text/plain" });
//             res.write("Error: Page not found");
//         } else {
//             console.log(`Serving file ${filePath}`);
//             res.writeHead(200, { "Content-Type": "text/html" });
//             res.write(data);
//         }
//         res.end();
//     });
// };
