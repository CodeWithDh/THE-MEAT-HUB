import connectDb from "../config/db.js";

// The tables in the database based on the provided schema
const INVENTORY_TABLES = ["meatShopInventory", "otherStuff", "restaurantInventory"];

export const getInventory = async (req, res) => {
    try {
        let allInventory = {};
        let lowStockAlerts = [];

        for (let table of INVENTORY_TABLES) {
            try {
                // Fetch all data from the table
                const data = await connectDb(`SELECT * FROM ${table}`);
                allInventory[table] = data;

                // Identify low stock items using the provided schema columns
                // Since there is no 'minStock' column in the schema, we use a default threshold of 10
                const DEFAULT_MIN_STOCK = 10;
                
                data.forEach(item => {
                    const qty = item.stockValue || 0;
                    const min = DEFAULT_MIN_STOCK;
                    
                    if (Number(qty) < min) {
                        lowStockAlerts.push({
                            table,
                            id: item.stockId,
                            name: item.stockName || "Unknown Item",
                            quantity: qty,
                            minStock: min
                        });
                    }
                });
            } catch (tableError) {
                console.error(`Error fetching table ${table}:`, tableError.message);
                // If table doesn't exist yet or has error, initialize as empty array
                allInventory[table] = [];
            }
        }

        res.render("inventory", { 
            pageTitle: "Inventory Management",
            inventory: allInventory,
            alerts: lowStockAlerts,
            tables: INVENTORY_TABLES
        });
    } catch (error) {
        console.error("Error loading inventory:", error);
        res.status(500).send("Server Error");
    }
};

export const updateInventory = async (req, res) => {
    const { table, id } = req.params;
    // We expect the form to send stockValue based on the schema
    const { stockValue } = req.body;
    
    try {
        if (!INVENTORY_TABLES.includes(table)) {
            return res.status(400).send("Invalid table name");
        }

        await connectDb(
            `UPDATE ${table} SET stockValue = ? WHERE stockId = ?`, 
            [stockValue, id]
        );
        res.redirect("/inventory");
    } catch (error) {
        console.error(`Error updating ${table}:`, error);
        res.status(500).send("Server Error");
    }
};
