
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");
let products;

// HTML PAGE
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Information Management</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px 20px;
            font-family: Arial, Helvetica, sans-serif;
            background: #f2f2f2;
            color: #111;
        }

        .container {
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
            padding: 30px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }

        h1 {
            margin: 18px 0 26px;
            text-align: center;
            font-size: 32px;
            font-weight: 700;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 14px;
        }

        input {
            width: 100%;
            min-width: 0;
            height: 45px;
            padding: 12px 14px;
            border: 1px solid #aaa;
            border-radius: 2px;
            background: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
            border-color: #198754;
            box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.12);
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }

        button {
            padding: 11px 17px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s, transform 0.15s;
        }

        button:hover {
            transform: translateY(-1px);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .save-btn {
            color: white;
            background: #078b12;
        }

        .save-btn:hover {
            background: #06720f;
        }

        .clear-btn {
            color: white;
            background: #858585;
        }

        .clear-btn:hover {
            background: #686868;
        }

        h2 {
            margin: 25px 0 27px;
            font-size: 24px;
        }

        .table-wrapper {
            width: 100%;
            overflow-x: auto;
            border: 1px solid #d5d5d5;
        }

        table {
            width: 100%;
            min-width: 650px;
            border-collapse: collapse;
            table-layout: auto;
        }

        th, td {
            padding: 17px 14px;
            text-align: center;
            border-right: 1px solid #d0d0d0;
            border-bottom: 1px solid #d8d8d8;
            font-size: 16px;
        }

        th {
            background: #eee;
            font-weight: 600;
        }

        tr:last-child td {
            border-bottom: none;
        }

        th:last-child, td:last-child {
            border-right: none;
        }

        tbody tr {
            background: #fff;
            transition: background 0.2s;
        }

        tbody tr:hover {
            background: #fafafa;
        }

        .edit-btn {
            margin: 0 5px;
            color: white;
            background: #ffa500;
            min-width: 53px;
        }

        .edit-btn:hover {
            background: #e89300;
        }

        .delete-btn {
            margin: 0 5px;
            color: white;
            background: #ff0808;
        }

        .delete-btn:hover {
            background: #d90000;
        }

        .status {
            display: none;
            padding: 12px 15px;
            margin-top: 16px;
            border-radius: 5px;
            font-size: 14px;
        }

        .status.success {
            display: block;
            color: #146c43;
            background: #d1e7dd;
        }

        .status.error {
            display: block;
            color: #842029;
            background: #f8d7da;
        }

        .empty {
            padding: 28px;
            color: #777;
            text-align: center;
        }

        @media (max-width: 750px) {
            body {
                padding: 20px 12px;
            }

            .container {
                padding: 20px 16px;
            }

            h1 {
                font-size: 25px;
                line-height: 1.35;
            }

            .form-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            h2 {
                font-size: 22px;
            }

            th, td {
                padding: 14px 10px;
            }
        }

        @media (max-width: 450px) {
            .form-grid {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 23px;
            }
        }
    </style>
</head>

<body>
    <main class="container">

        <h1>Product Information Management</h1>

        <form id="productForm">
            <div class="form-grid">
                <input
                    id="name"
                    type="text"
                    placeholder="Product Name"
                    aria-label="Product Name"
                    required
                >

                <input
                    id="price"
                    type="number"
                    placeholder="Price"
                    aria-label="Price"
                    min="0"
                    step="0.01"
                    required
                >

                <input
                    id="category"
                    type="text"
                    placeholder="Category"
                    aria-label="Category"
                    required
                >

                <input
                    id="quantity"
                    type="number"
                    placeholder="Quantity"
                    aria-label="Quantity"
                    min="0"
                    step="1"
                    required
                >
            </div>

            <div class="actions">
                <button class="save-btn" id="saveBtn" type="submit">
                    Save Product
                </button>

                <button class="clear-btn" type="button" id="clearBtn">
                    Clear
                </button>
            </div>
        </form>

        <div id="status" class="status" role="status"></div>

        <h2>Product List</h2>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody id="productList">
                    <tr>
                        <td colspan="5">Loading products...</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </main>

    <script>
        let editId = null;

        const form = document.getElementById("productForm");
        const nameInput = document.getElementById("name");
        const priceInput = document.getElementById("price");
        const categoryInput = document.getElementById("category");
        const quantityInput = document.getElementById("quantity");
        const saveBtn = document.getElementById("saveBtn");
        const clearBtn = document.getElementById("clearBtn");
        const productList = document.getElementById("productList");
        const statusBox = document.getElementById("status");

        function showStatus(message, type) {
            statusBox.textContent = message;
            statusBox.className = "status " + type;
        }

        function clearStatus() {
            statusBox.textContent = "";
            statusBox.className = "status";
        }

        async function apiRequest(url, options) {
            const response = await fetch(url, options || {});

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Request failed");
            }

            return response.json();
        }

        async function loadProducts() {
            try {
                const data = await apiRequest("/api/products");

                productList.replaceChildren();

                if (data.length === 0) {
                    const row = document.createElement("tr");
                    const cell = document.createElement("td");

                    cell.colSpan = 5;
                    cell.className = "empty";
                    cell.textContent = "No products found. Add your first product!";

                    row.appendChild(cell);
                    productList.appendChild(row);
                    return;
                }

                data.forEach(function(product) {
                    const row = document.createElement("tr");

                    function addCell(value) {
                        const cell = document.createElement("td");
                        cell.textContent = value;
                        row.appendChild(cell);
                        return cell;
                    }

                    addCell(product.name);
                    addCell("₹" + Number(product.price).toLocaleString("en-IN", {
                        maximumFractionDigits: 2
                    }));
                    addCell(product.category);
                    addCell(String(product.quantity));

                    const actionsCell = addCell("");

                    const editButton = document.createElement("button");
                    editButton.type = "button";
                    editButton.className = "edit-btn";
                    editButton.textContent = "Edit";
                    editButton.addEventListener("click", function() {
                        editProduct(product);
                    });

                    const deleteButton = document.createElement("button");
                    deleteButton.type = "button";
                    deleteButton.className = "delete-btn";
                    deleteButton.textContent = "Delete";
                    deleteButton.addEventListener("click", function() {
                        deleteProduct(product._id);
                    });

                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);

                    productList.appendChild(row);
                });

            } catch (error) {
                productList.replaceChildren();

                const row = document.createElement("tr");
                const cell = document.createElement("td");

                cell.colSpan = 5;
                cell.className = "empty";
                cell.textContent = "Could not load products. Please refresh the page.";

                row.appendChild(cell);
                productList.appendChild(row);

                showStatus(error.message, "error");
            }
        }

        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            clearStatus();

            const product = {
                name: nameInput.value.trim(),
                price: Number(priceInput.value),
                category: categoryInput.value.trim(),
                quantity: Number(quantityInput.value)
            };

            if (
                !product.name ||
                !product.category ||
                priceInput.value === "" ||
                quantityInput.value === "" ||
                !Number.isFinite(product.price) ||
                !Number.isFinite(product.quantity) ||
                product.price < 0 ||
                product.quantity < 0 ||
                !Number.isInteger(product.quantity)
            ) {
                showStatus(
                    "Enter valid product details. Quantity must be a whole number.",
                    "error"
                );
                return;
            }

            saveBtn.disabled = true;

            try {
                if (editId) {
                    await apiRequest("/api/products/" + editId, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(product)
                    });

                    showStatus("Product updated successfully!", "success");
                } else {
                    await apiRequest("/api/products", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(product)
                    });

                    showStatus("Product added successfully!", "success");
                }

                resetForm();
                await loadProducts();

            } catch (error) {
                showStatus("Unable to save product: " + error.message, "error");
            } finally {
                saveBtn.disabled = false;
            }
        });

        function editProduct(product) {
            nameInput.value = product.name;
            priceInput.value = product.price;
            categoryInput.value = product.category;
            quantityInput.value = product.quantity;

            editId = product._id;
            saveBtn.textContent = "Update Product";

            clearStatus();

            document.getElementById("productForm").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            nameInput.focus();
        }

        async function deleteProduct(id) {
            if (!confirm("Are you sure you want to delete this product?")) {
                return;
            }

            clearStatus();

            try {
                await apiRequest("/api/products/" + id, {
                    method: "DELETE"
                });

                if (editId === id) {
                    resetForm();
                }

                showStatus("Product deleted successfully!", "success");
                await loadProducts();

            } catch (error) {
                showStatus("Unable to delete product: " + error.message, "error");
            }
        }

        function resetForm() {
            form.reset();
            editId = null;
            saveBtn.textContent = "Save Product";
        }

        clearBtn.addEventListener("click", function() {
            resetForm();
            clearStatus();
            nameInput.focus();
        });

        loadProducts();
    </script>
</body>
</html>
`;

// HOME PAGE
app.get("/", (req, res) => {
    res.send(html);
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
    try {
        const data = await products.find().toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// ADD PRODUCT
app.post("/api/products", async (req, res) => {
    try {
        const result = await products.insertOne(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

// UPDATE PRODUCT
app.put("/api/products/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const { name, price, category, quantity } = req.body;

        const result = await products.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: { name, price, category, quantity }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update product" });
    }
});

// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const result = await products.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// START SERVER
async function start() {
    try {
        await client.connect();

        const db = client.db("productDB");
        products = db.collection("products");

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log("Server running at http://localhost:" + PORT);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        await client.close().catch(() => {});
        process.exitCode = 1;
    }
}

start();