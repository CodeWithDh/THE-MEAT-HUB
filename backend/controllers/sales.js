import connectDb from "../config/db.js";

export const getSalesDashboard = async (req, res) => {
    try {
        // Fetch all completed orders for sales analysis
        const rawOrders = await connectDb("SELECT * FROM orders WHERE LOWER(status) = 'completed' ORDER BY time DESC");
        const orders = Array.isArray(rawOrders) ? rawOrders : [];

        let totalRevenue = 0;
        let totalOrders = orders.length;
        
        const monthlyData = {};
        const itemSales = {};

        orders.forEach(order => {
            // Aggregate Total Revenue
            const orderTotal = parseFloat(order.total) || 0;
            totalRevenue += orderTotal;

            // Aggregate Monthly Data
            // The time column represents the order timestamp
            const date = new Date(order.time);
            // Ensure valid date
            if (!isNaN(date.getTime())) {
                const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = 0;
                }
                monthlyData[monthYear] += orderTotal;
            }

            // Aggregate Top Selling Items
            if (order.orderList) {
                try {
                    let items = order.orderList;
                    if (typeof items === 'string') {
                        items = JSON.parse(items);
                    }
                    if (Array.isArray(items)) {
                        items.forEach(item => {
                            const name = item.itemName || item.name || 'Unknown';
                            const qty = parseInt(item.quantity) || 1;
                            const price = parseFloat(item.itemPrice || item.price) || 0;
                            if (!itemSales[name]) {
                                itemSales[name] = { revenue: 0, quantity: 0 };
                            }
                            itemSales[name].revenue += (price * qty);
                            itemSales[name].quantity += qty;
                        });
                    }
                } catch (e) {
                    // Plain string orderList — skip item-level breakdown, keep revenue
                }
            }
        });

        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

        // Sort chronologically for the trend chart
        const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
        const chartLabels = sortedMonths;
        const chartRevenues = sortedMonths.map(m => monthlyData[m]);

        // Sort to get Top 5 items by revenue for the pie chart
        const topItems = Object.keys(itemSales)
            .map(name => ({ name, ...itemSales[name] }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const itemLabels = topItems.map(i => i.name);
        const itemRevenues = topItems.map(i => i.revenue);

        res.render("sales", { 
            orders: orders.slice(0, 10), // Pass latest 10 orders for the recent table
            metrics: {
                totalRevenue: totalRevenue.toFixed(2),
                totalOrders,
                avgOrderValue
            },
            chartData: {
                labels: JSON.stringify(chartLabels),
                revenues: JSON.stringify(chartRevenues),
                itemLabels: JSON.stringify(itemLabels),
                itemRevenues: JSON.stringify(itemRevenues)
            }
        });
    } catch (error) {
        console.error("Sales Dashboard Error:", error);
        res.status(500).send("Error loading sales dashboard");
    }
};
