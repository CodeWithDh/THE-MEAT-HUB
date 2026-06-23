import express from "express";
const router = express.Router();

import loginCheck from "../controllers/login.js";
import connectDb from "../config/db.js";

async function getDashboardData() {
    const ordersRaw = await connectDb("SELECT * FROM orders ORDER BY time DESC;").catch(() => []);
    
    // Parse orders for display
    const orders = ordersRaw.map(o => {
        let parsedItems = "";
        try {
            const list = JSON.parse(o.orderList);
            parsedItems = list.map(i => i.name).join(", ");
        } catch (e) {
            parsedItems = o.orderList; // Fallback
        }
        return { ...o, parsedItems };
    });

    const employees = await connectDb("SELECT * FROM employees ORDER BY joiningDate DESC").catch(() => []);
    
    // Fetch low stock from all 3 inventory tables
    const lowStockQuery = `
      SELECT stockName, stockValue FROM restaurantInventory WHERE stockValue < 10
      UNION ALL
      SELECT stockName, stockValue FROM meatShopInventory WHERE stockValue < 10
      UNION ALL
      SELECT stockName, stockValue FROM otherStuff WHERE stockValue < 10
    `;
    const lowStock = await connectDb(lowStockQuery).catch(() => []);

    // Calculate Sales Metrics
    let totalRevenue = 0, totalOrders = 0, avgOrderValue = 0;
    const completedOrders = orders.filter(o => o.status.toLowerCase() === 'completed');
    if (completedOrders.length > 0) {
        totalOrders = completedOrders.length;
        totalRevenue = completedOrders.reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0);
        avgOrderValue = (totalRevenue / totalOrders).toFixed(2);
    }
    const salesMetrics = { totalRevenue, totalOrders, avgOrderValue };

    // Get 3 pending orders from today
    const pendingOrders = orders.filter(o => {
        const isPending = o.status.toLowerCase() !== 'completed';
        return isPending;
    }).slice(0, 3);

    return { orders, employees, lowStock, salesMetrics, pendingOrders };
}

router.post("/", async (req, res) => {
  let { username, password } = req.body;

  if (!req.session.user) {
    let result = await loginCheck(username, password);

    if (result === true) {
      req.session.user = { username };
      const data = await getDashboardData();
      res.render("dashboard.ejs", data);
    } else {
      res.render("login.ejs", { msg: "Wrong Password or Username" });
    }
  } else {
    const data = await getDashboardData();
    res.render("dashboard.ejs", data);
  }
});

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const data = await getDashboardData();
    res.render("dashboard.ejs", data);
  } catch (error) {
    console.error("Dashboard GET Error:", error);
    res.status(500).send("Error loading dashboard");
  }
});

// Route to update order status directly from dashboard
router.post("/update-status", async (req, res) => {
    if (!req.session.user) return res.redirect("/");
    const { orderId, status } = req.body;
    try {
        await connectDb("UPDATE orders SET status = ? WHERE orderId = ?", [status, orderId]);
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send("Error updating status");
    }
});

export default router;
