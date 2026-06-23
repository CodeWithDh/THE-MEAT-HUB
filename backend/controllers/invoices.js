import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const invoicesDir = path.join(__dirname, "..", "..", "Invoices");

// Ensure directory exists
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

export const getInvoices = (req, res) => {
    try {
        const files = fs.readdirSync(invoicesDir);
        const invoices = files
            .filter(file => file.endsWith(".pdf") && file.startsWith("invoice_"))
            .map(file => {
                const stats = fs.statSync(path.join(invoicesDir, file));
                return {
                    filename: file,
                    date: stats.mtime,
                    size: (stats.size / 1024).toFixed(2) + " KB",
                    url: `/Invoices/${file}`
                };
            })
            .sort((a, b) => b.date - a.date); // Sort by latest modified
            
        res.render("invoices", { invoices, pageTitle: "Invoices" });
    } catch (error) {
        console.error("Error loading invoices:", error);
        res.status(500).send("Server Error");
    }
};

export const deleteInvoice = (req, res) => {
    const filename = req.params.filename;
    try {
        if (!filename.endsWith(".pdf")) return res.status(400).send("Invalid file type");
        const filePath = path.join(invoicesDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.redirect("/invoices");
    } catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).send("Server Error");
    }
};

export const deleteAllInvoices = (req, res) => {
    try {
        const files = fs.readdirSync(invoicesDir);
        files.forEach(file => {
            if (file.endsWith(".pdf") && file.startsWith("invoice_")) {
                fs.unlinkSync(path.join(invoicesDir, file));
            }
        });
        res.redirect("/invoices");
    } catch (error) {
        console.error("Error deleting all invoices:", error);
        res.status(500).send("Server Error");
    }
};

export const saveAllInvoices = (req, res) => {
    try {
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        res.attachment('invoices.zip');
        archive.pipe(res);
        
        const files = fs.readdirSync(invoicesDir);
        files.forEach(file => {
            if (file.endsWith(".pdf") && file.startsWith("invoice_")) {
                archive.file(path.join(invoicesDir, file), { name: file });
            }
        });
        
        archive.finalize();
    } catch (error) {
        console.error("Error saving all invoices:", error);
        res.status(500).send("Server Error");
    }
};
