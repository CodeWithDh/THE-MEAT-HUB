// ================== CORE IMPORTS ==================
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash";

// ================== CONFIG ==================
dotenv.config();
const app = express();
const port = 8080;

// ================== ES MODULE PATH FIX ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== DATABASE ==================
import db from "./config/db.js";

// ================== MIDDLEWARE ==================
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use(flash());

// ================== STATIC FILES ==================
app.use("/Invoices", express.static(path.join(__dirname, "..", "Invoices")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

// ================== VIEW ENGINE ==================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "frontend", "views"));

// ================== ROUTES ==================
import login from "./routes/login.js";
import dashboard from "./routes/dashboard.js";
import logout from "./routes/logout.js";
import auth from "./routes/auth.js";
import orders from "./routes/orders.js";
import placeOrder from "./routes/placeOrder.js";
import edit from "./routes/edit.js";
import invoices from "./routes/invoices.js";
import inventory from "./routes/inventory.js";
import billing from "./routes/billing.js";
import sales from "./routes/sales.js";
import employes from "./routes/employes.js";

app.use("/", login);
app.use("/auth", auth);
app.use("/dashboard", dashboard);
app.use("/logout", logout);
app.use("/orders", orders);
app.use("/placeOrder", placeOrder);
app.use("/edit", edit);
app.use("/invoices", invoices);
app.use("/inventory", inventory);
app.use("/billing", billing);
app.use("/sales", sales);
app.use("/employes", employes);

// ================== SERVER ==================
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
