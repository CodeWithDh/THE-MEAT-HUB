import connectDb from "../config/db.js";

const getTableName = (menuType) => {
    if (menuType === "restaurantMenu") return "restaurentMenu";
    if (menuType === "meatShopMenu") return "meatShopMenu";
    return null;
}

export const getMenu = async (req, res) => {
    let menuType = req.params.menuType;
    let tableName = getTableName(menuType);
    if (!tableName) return res.status(404).send("Menu not found");

    let pageTitle = menuType === "restaurantMenu" ? "Restaurant Menu" : "Meat Shop Menu";

    try {
        let menuData = await connectDb(`SELECT * FROM ${tableName}`);
        res.render("edit", { menuData, menuType, pageTitle });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Server Error");
    }
};

export const addDish = async (req, res) => {
    let menuType = req.params.menuType;
    let { itemName, itemPrice } = req.body;
    let tableName = getTableName(menuType);
    if (!tableName) return res.status(404).send("Menu not found");

    try {
        // id is required here count from the las item id
        let rows = await connectDb(`SELECT MAX(CAST(id AS UNSIGNED)) AS maxId FROM ${tableName}`);
        let newId = 1;
        if (rows && rows.length > 0 && rows[0].maxId != null) {
            newId = parseInt(rows[0].maxId) + 1;
        }

        await connectDb(`INSERT INTO ${tableName} (id, itemName, itemPrice) VALUES (?, ?, ?)`, [newId.toString(), itemName, itemPrice]);
        res.redirect(`/edit/${menuType}`);
    } catch (error) {
        console.error("Error adding dish:", error);
        res.status(500).send("Server Error");
    }
};

export const updateDish = async (req, res) => {
    let menuType = req.params.menuType;
    let id = req.params.id;
    let { itemName, itemPrice } = req.body;
    let tableName = getTableName(menuType);
    if (!tableName) return res.status(404).send("Menu not found");

    try {
        await connectDb(`UPDATE ${tableName} SET itemName = ?, itemPrice = ? WHERE id = ?`, [itemName, itemPrice, id]);
        res.redirect(`/edit/${menuType}`);
    } catch (error) {
        console.error("Error updating dish:", error);
        res.status(500).send("Server Error");
    }
};

export const deleteDish = async (req, res) => {
    let menuType = req.params.menuType;
    let id = req.params.id;
    let tableName = getTableName(menuType);
    if (!tableName) return res.status(404).send("Menu not found");

    try {
        await connectDb(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        res.redirect(`/edit/${menuType}`);
    } catch (error) {
        console.error("Error deleting dish:", error);
        res.status(500).send("Server Error");
    }
};
